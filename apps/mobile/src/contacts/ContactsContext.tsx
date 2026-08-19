import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { sortByUpcomingBirthday } from '@celebrationcountdown/shared'
import { contactsApi, type Contact, type ContactInput } from '../api/contacts'
import { toErrorMessage } from '../api/client'
import { useAuth } from '../auth/AuthContext'

type ContactsContextValue = {
  contacts: Contact[]
  /** `contacts` ordered by whose birthday lands soonest. */
  upcoming: Contact[]
  status: 'loading' | 'ready' | 'error'
  error: string | null
  refreshing: boolean
  refresh: () => Promise<void>
  getById: (id: string) => Contact | undefined
  create: (input: ContactInput) => Promise<Contact>
  update: (id: string, input: ContactInput) => Promise<Contact>
  remove: (id: string) => Promise<void>
}

const ContactsContext = createContext<ContactsContextValue | null>(null)

export function ContactsProvider({ children }: { children: ReactNode }) {
  const { api } = useAuth()
  const client = useMemo(() => contactsApi(api), [api])

  const [contacts, setContacts] = useState<Contact[]>([])
  const [status, setStatus] = useState<ContactsContextValue['status']>('loading')
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(
    async (mode: 'initial' | 'refresh') => {
      if (mode === 'refresh') setRefreshing(true)
      try {
        setContacts(await client.list())
        setError(null)
        setStatus('ready')
      } catch (caught) {
        setError(toErrorMessage(caught))
        // A failed refresh keeps the list we already have on screen.
        setStatus((current) => (current === 'ready' ? 'ready' : 'error'))
      } finally {
        if (mode === 'refresh') setRefreshing(false)
      }
    },
    [client],
  )

  useEffect(() => {
    void load('initial')
  }, [load])

  const refresh = useCallback(() => load('refresh'), [load])

  const create = useCallback(
    async (input: ContactInput) => {
      const created = await client.create(input)
      setContacts((current) => [...current, created])
      return created
    },
    [client],
  )

  const update = useCallback(
    async (id: string, input: ContactInput) => {
      const updated = await client.update(id, input)
      setContacts((current) =>
        current.map((contact) => (contact.id === id ? updated : contact)),
      )
      return updated
    },
    [client],
  )

  const remove = useCallback(
    async (id: string) => {
      await client.remove(id)
      setContacts((current) => current.filter((contact) => contact.id !== id))
    },
    [client],
  )

  const upcoming = useMemo(() => sortByUpcomingBirthday(contacts), [contacts])

  const getById = useCallback(
    (id: string) => contacts.find((contact) => contact.id === id),
    [contacts],
  )

  const value = useMemo<ContactsContextValue>(
    () => ({
      contacts,
      upcoming,
      status,
      error,
      refreshing,
      refresh,
      getById,
      create,
      update,
      remove,
    }),
    [
      contacts,
      upcoming,
      status,
      error,
      refreshing,
      refresh,
      getById,
      create,
      update,
      remove,
    ],
  )

  return (
    <ContactsContext.Provider value={value}>{children}</ContactsContext.Provider>
  )
}

export function useContacts(): ContactsContextValue {
  const context = useContext(ContactsContext)
  if (!context) {
    throw new Error('useContacts must be used inside a ContactsProvider')
  }
  return context
}

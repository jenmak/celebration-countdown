import type { RelationshipEnum } from '@celebrationcountdown/shared'
import type { AuthorizedRequest } from './client'

export type Contact = {
  id: string
  fullName: string
  photoUrl: string | null
  /** `YYYY-MM-DD`. */
  birthdate: string
  relationship: RelationshipEnum
  notes: string | null
  createdAt: string
  updatedAt: string
}

export type ContactInput = {
  fullName: string
  birthdate: string
  relationship: RelationshipEnum
  notes?: string | null
}

export function contactsApi(api: AuthorizedRequest) {
  return {
    list: () => api<Contact[]>('/contact'),

    create: (body: ContactInput) =>
      api<Contact>('/contact', { method: 'POST', body }),

    update: (id: string, body: Partial<ContactInput>) =>
      api<Contact>(`/contact/${id}`, { method: 'PATCH', body }),

    remove: (id: string) =>
      api<{ success: boolean }>(`/contact/${id}`, { method: 'DELETE' }),
  }
}

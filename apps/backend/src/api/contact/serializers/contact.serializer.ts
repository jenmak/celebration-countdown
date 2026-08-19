import { Contact } from '@celebrationcountdown/orm/dist/generated/client'

export type ContactResponse = {
  id: string
  fullName: string
  photoUrl: string | null
  birthdate: string
  relationship: string
  notes: string | null
  updatedAt: string
  createdAt: string
}

export function serializeContact(contact: Contact): ContactResponse {
  const birthdate =
    contact.birthdate instanceof Date
      ? contact.birthdate.toISOString().slice(0, 10)
      : String(contact.birthdate).slice(0, 10)

  return {
    id: contact.id,
    fullName: contact.fullName,
    photoUrl: contact.photoUrl,
    birthdate,
    relationship: contact.relationship,
    notes: contact.notes,
    createdAt: contact.createdAt.toISOString(),
    updatedAt: (contact.updatedAt ?? contact.createdAt).toISOString(),
  }
}

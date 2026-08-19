import { User } from '@celebrationcountdown/orm/dist/generated/client'

export type UserPublic = {
  id: string
  email: string
  firstName: string
  lastName: string
  createdAt: string
}

export function serializeUser(user: User): UserPublic {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt.toISOString(),
  }
}

'use client'

import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useSocket } from '../hooks/useSocket'
import { format } from 'date-fns'
import { useApi } from '../lib/api'

interface BirthdayDetailsProps {
  birthday: {
    id: string
    name: string
    date: Date
    notes?: string
    sharedWith: Array<{
      friend: {
        id: string
        name: string
        image?: string
      }
    }>
    collaborators: Array<{
      id: string
      userId: string
    }>
  }
  onUpdate: (data: { notes: string }) => Promise<void>
}

export default function BirthdayDetails({ birthday, onUpdate }: BirthdayDetailsProps) {
  const { user } = useAuth0()
  const { fetchWithAuth } = useApi()
  const [notes, setNotes] = useState(birthday.notes || '')
  const [isEditing, setIsEditing] = useState(false)
  const { updateNotes, onNotesUpdate } = useSocket(birthday.id)

  useEffect(() => {
    const cleanup = onNotesUpdate(({ notes: newNotes, userId }) => {
      if (userId !== user?.sub) {
        setNotes(newNotes)
      }
    })

    return cleanup
  }, [user?.sub, onNotesUpdate])

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value
    setNotes(newNotes)
    if (user?.sub) {
      updateNotes(newNotes, user.sub)
    }
  }

  const handleSave = async () => {
    try {
      await fetchWithAuth(`/api/birthdays/${birthday.id}`, {
        method: 'PUT',
        body: JSON.stringify({ notes }),
      })
      await onUpdate({ notes })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating notes:', error)
      // You might want to show an error message to the user here
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{birthday.name}</h1>
          <p className="text-lg text-gray-500">
            {format(new Date(birthday.date), 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex -space-x-2">
          {birthday.sharedWith.map(({ friend }) => (
            <img
              key={friend.id}
              src={friend.image || '/default-avatar.png'}
              alt={friend.name}
              className="w-8 h-8 rounded-full border-2 border-white"
              title={friend.name}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-900">Notes</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Edit
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setNotes(birthday.notes || '')
                    setIsEditing(false)
                  }}
                  className="text-sm text-gray-600 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Save
                </button>
              </div>
            )}
          </div>
          {isEditing ? (
            <textarea
              value={notes}
              onChange={handleNotesChange}
              className="w-full h-32 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Add notes about this birthday..."
            />
          ) : (
            <p className="text-gray-600 whitespace-pre-wrap">
              {notes || 'No notes added yet.'}
            </p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Collaborators
          </h2>
          <div className="flex flex-wrap gap-2">
            {birthday.collaborators.map(({ id, userId }) => (
              <div
                key={id}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
              >
                {userId === user?.sub ? 'You' : 'Collaborator'}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 
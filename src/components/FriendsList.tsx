'use client'

import React, { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

interface Friend {
  id: string
  name: string
  email: string
  image?: string
}

interface FriendsListProps {
  friends: Friend[]
  onAddFriend: (email: string) => Promise<void>
  onRemoveFriend: (friendId: string) => Promise<void>
  onShareBirthday: (friendId: string, birthdayId: string) => Promise<void>
}

export default function FriendsList({
  friends,
  onAddFriend,
  onRemoveFriend,
  onShareBirthday,
}: FriendsListProps) {
  const [newFriendEmail, setNewFriendEmail] = useState('')
  const [isAddingFriend, setIsAddingFriend] = useState(false)
  const { user } = useAuth0()

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFriendEmail) return

    setIsAddingFriend(true)
    try {
      await onAddFriend(newFriendEmail)
      setNewFriendEmail('')
    } catch (error) {
      console.error('Error adding friend:', error)
    } finally {
      setIsAddingFriend(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-6">Friends</h2>

      <form onSubmit={handleAddFriend} className="mb-6">
        <div className="flex gap-2">
          <input
            type="email"
            value={newFriendEmail}
            onChange={(e) => setNewFriendEmail(e.target.value)}
            placeholder="Enter friend's email"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            required
          />
          <button
            type="submit"
            disabled={isAddingFriend}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isAddingFriend ? 'Adding...' : 'Add Friend'}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {friends.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No friends added yet. Add friends to share birthdays with them!
          </p>
        ) : (
          friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={friend.image || '/default-avatar.png'}
                  alt={friend.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{friend.name}</h3>
                  <p className="text-sm text-gray-500">{friend.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onRemoveFriend(friend.id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Share Your Profile
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Share this link with your friends so they can add you:
        </p>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={`${window.location.origin}/profile/${user?.sub}`}
            readOnly
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/profile/${user?.sub}`
              )
            }}
            className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  )
} 
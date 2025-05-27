import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

export const useSocket = (birthdayId?: string) => {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Initialize socket connection
    const initSocket = async () => {
      await fetch('/api/socket')
      socketRef.current = io()

      if (birthdayId) {
        socketRef.current.emit('join-birthday', birthdayId)
      }

      return () => {
        if (birthdayId) {
          socketRef.current?.emit('leave-birthday', birthdayId)
        }
        socketRef.current?.disconnect()
      }
    }

    initSocket()
  }, [birthdayId])

  const updateNotes = (notes: string, userId: string) => {
    if (birthdayId && socketRef.current) {
      socketRef.current.emit('update-notes', { birthdayId, notes, userId })
    }
  }

  const onNotesUpdate = (callback: (data: { notes: string; userId: string }) => void) => {
    socketRef.current?.on('notes-updated', callback)
    return () => {
      socketRef.current?.off('notes-updated', callback)
    }
  }

  return {
    updateNotes,
    onNotesUpdate,
  }
} 
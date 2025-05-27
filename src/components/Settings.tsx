'use client'

import React, { useState } from 'react'

interface SettingsProps {
  initialDaysBeforeNotification: number
  onSave: (settings: SettingsData) => void
}

export interface SettingsData {
  daysBeforeNotification: number
}

export default function Settings({ initialDaysBeforeNotification, onSave }: SettingsProps) {
  const [settings, setSettings] = useState<SettingsData>({
    daysBeforeNotification: initialDaysBeforeNotification
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(settings)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-6">Notification Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="daysBeforeNotification"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Days before birthday to receive notification
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="range"
              id="daysBeforeNotification"
              min="1"
              max="30"
              value={settings.daysBeforeNotification}
              onChange={(e) => setSettings({
                ...settings,
                daysBeforeNotification: parseInt(e.target.value)
              })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="ml-4 text-lg font-medium text-gray-900">
              {settings.daysBeforeNotification} days
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            You will receive a notification this many days before each birthday
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Save Settings
          </button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Accessibility Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="highContrast"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="highContrast" className="ml-3 text-sm text-gray-700">
              High contrast mode
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="largeText"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="largeText" className="ml-3 text-sm text-gray-700">
              Large text mode
            </label>
          </div>
        </div>
      </div>
    </div>
  )
} 
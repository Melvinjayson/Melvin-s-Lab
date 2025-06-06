import { useState } from 'react'
import { Tab } from '@headlessui/react'
import {
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const tabs = [
  { name: 'Analytics', icon: ChartBarIcon },
  { name: 'Conversations', icon: ChatBubbleLeftRightIcon },
  { name: 'Users', icon: UserGroupIcon },
  { name: 'Settings', icon: Cog6ToothIcon },
]

export default function DashboardPage() {
  const [selectedTab, setSelectedTab] = useState(0)

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500">Monitor and manage your AI consultation system</p>
      </div>

      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-1 border-b border-gray-200 px-4">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'flex items-center space-x-2 px-4 py-2 text-sm font-medium leading-5 focus:outline-none',
                  selected
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                )
              }
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.name}</span>
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="p-4">
          <Tab.Panel>
            {/* Analytics Panel */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white overflow-hidden rounded-lg border border-gray-200 p-4">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Consultations</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">1,234</dd>
              </div>
              <div className="bg-white overflow-hidden rounded-lg border border-gray-200 p-4">
                <dt className="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">56</dd>
              </div>
              <div className="bg-white overflow-hidden rounded-lg border border-gray-200 p-4">
                <dt className="text-sm font-medium text-gray-500 truncate">Conversion Rate</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">12.3%</dd>
              </div>
              <div className="bg-white overflow-hidden rounded-lg border border-gray-200 p-4">
                <dt className="text-sm font-medium text-gray-500 truncate">Avg. Response Time</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">1.5s</dd>
              </div>
            </div>
          </Tab.Panel>

          <Tab.Panel>
            {/* Conversations Panel */}
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                {/* Placeholder for conversation list */}
                <p className="p-4 text-gray-500 text-center">No conversations yet</p>
              </div>
            </div>
          </Tab.Panel>

          <Tab.Panel>
            {/* Users Panel */}
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                {/* Placeholder for user list */}
                <p className="p-4 text-gray-500 text-center">No users yet</p>
              </div>
            </div>
          </Tab.Panel>

          <Tab.Panel>
            {/* Settings Panel */}
            <div className="max-w-2xl space-y-6">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">AI Model Settings</h3>
                <div className="mt-2 space-y-4">
                  <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                      Model
                    </label>
                    <select
                      id="model"
                      name="model"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                      <option>GPT4All</option>
                      <option>LLaMA</option>
                      <option>OpenAssistant</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
                      Temperature
                    </label>
                    <input
                      type="range"
                      id="temperature"
                      name="temperature"
                      min="0"
                      max="1"
                      step="0.1"
                      className="mt-1 block w-full"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">API Settings</h3>
                <div className="mt-2 space-y-4">
                  <div>
                    <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                      API Key
                    </label>
                    <input
                      type="password"
                      id="apiKey"
                      name="apiKey"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
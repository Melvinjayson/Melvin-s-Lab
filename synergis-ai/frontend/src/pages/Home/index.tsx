import { Link } from 'react-router-dom'
import { ChartBarIcon, ChatBubbleLeftRightIcon, CogIcon, RocketLaunchIcon } from '@heroicons/react/24/outline'

const features = [
  {
    name: 'AI-Powered Consultations',
    description: 'Automated, context-aware conversations that simulate expert consultations across various professional domains.',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: 'Smart Recommendations',
    description: 'Dynamic product and service recommendations based on user behavior, intent, and profile analysis.',
    icon: ChartBarIcon,
  },
  {
    name: 'Easy Integration',
    description: 'Seamlessly integrate with your existing CRM, CMS, and e-commerce platforms through our API.',
    icon: CogIcon,
  },
  {
    name: 'Scalable Solution',
    description: 'Built for growth with modern technology stack and efficient vector-based knowledge management.',
    icon: RocketLaunchIcon,
  },
]

export default function HomePage() {
  return (
    <div className="relative isolate">
      {/* Hero section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              AI-Powered Professional Consultation
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Automate your expertise delivery and optimize conversions with our intelligent consultation platform.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/consultation"
                className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Start Consultation
              </Link>
              <Link
                to="/dashboard"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                View Dashboard <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">
              Powerful Features
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to scale your consultancy
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Leverage AI technology to automate consultations, generate leads, and increase conversions.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <feature.icon
                      className="h-5 w-5 flex-none text-primary-600"
                      aria-hidden="true"
                    />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
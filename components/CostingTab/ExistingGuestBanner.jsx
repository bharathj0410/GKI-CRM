import React from 'react'
import { 
    BuildingOffice2Icon, 
    EnvelopeIcon, 
    PhoneIcon, 
    MapPinIcon,
    UserIcon,
    CubeTransparentIcon,
    IdentificationIcon
} from '@heroicons/react/24/outline'
import { Avatar, Chip } from '@heroui/react'

export default function ExistingGuestBanner({data}) {
  return (
    <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md border border-gray-200/80 dark:border-gray-700">
      {/* Accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-secondary-500 via-purple-500 to-violet-500"></div>

      <div className="p-6">
        {/* Top section: avatar + name + ID */}
        <div className="flex items-center gap-5 mb-6">
          <div className="relative flex-shrink-0">
            <Avatar
              src={data["logo"]}
              className="w-16 h-16 ring-2 ring-secondary-100 dark:ring-secondary-900/40"
              fallback={
                <BuildingOffice2Icon className="w-8 h-8 text-secondary-400" />
              }
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-900"></div>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white truncate leading-tight">
              {data['company/person_name']}
            </h2>
            <span className="inline-flex items-center gap-1.5 mt-1 text-xs font-medium text-secondary-600 dark:text-secondary-400">
              <CubeTransparentIcon className="w-3.5 h-3.5" />
              {data['company_type']}
            </span>
          </div>

          <Chip
            variant="flat"
            startContent={<IdentificationIcon className="w-4 h-4" />}
            classNames={{
              base: "bg-secondary-50 dark:bg-secondary-900/30 border border-secondary-200/60 dark:border-secondary-700/40",
              content: "font-bold text-secondary-700 dark:text-secondary-300 text-xs"
            }}
          >
            {data['id']}
          </Chip>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 dark:bg-gray-800 mb-5"></div>

        {/* Info grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
          {/* Contact Person */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
              <UserIcon className="w-4.5 h-4.5 text-purple-500 dark:text-purple-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mb-0.5">Contact Person</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                {data['contact_person_name']}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
              <EnvelopeIcon className="w-4.5 h-4.5 text-blue-500 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mb-0.5">Email</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                {data['contact_email']}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
              <PhoneIcon className="w-4.5 h-4.5 text-green-500 dark:text-green-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mb-0.5">Phone</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                {data['contact_phone']}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
              <MapPinIcon className="w-4.5 h-4.5 text-amber-500 dark:text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mb-0.5">Location</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                {[data['billing_city'], data['billing_state'], data['billing_country']].filter(Boolean).join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

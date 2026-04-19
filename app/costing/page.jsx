"use client"
import React from 'react'
import { UsersIcon, NewspaperIcon, BuildingOfficeIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const cards = [
  {
    href: "/costing/new-guest",
    icon: UsersIcon,
    title: "New Guest",
    description: "Create billing for a new guest and start managing orders",
    gradient: "from-violet-600 to-purple-600",
    shadowColor: "shadow-violet-500/25",
    hoverBorder: "hover:border-violet-400/60",
    badge: "Create",
    accentRing: "ring-violet-500/20",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-600",
  },
  {
    href: "/costing/guest",
    icon: NewspaperIcon,
    title: "Guest",
    description: "View and manage your guest records and orders",
    gradient: "from-blue-600 to-cyan-600",
    shadowColor: "shadow-blue-500/25",
    hoverBorder: "hover:border-blue-400/60",
    badge: "Manage",
    accentRing: "ring-blue-500/20",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
  },
  {
    href: "/costing/customer",
    icon: BuildingOfficeIcon,
    title: "Customer",
    description: "Manage your customer database and billing",
    gradient: "from-emerald-600 to-teal-600",
    shadowColor: "shadow-emerald-500/25",
    hoverBorder: "hover:border-emerald-400/60",
    badge: "Database",
    accentRing: "ring-emerald-500/20",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
  },
];

export default function CostingPage() {
  return (
    <div className="relative flex flex-col w-full min-h-[calc(100vh-60px)] overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-200/40 to-pink-200/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-blue-200/30 to-cyan-200/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-violet-100/20 to-emerald-100/20 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex flex-col items-center justify-center flex-1">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/80 dark:bg-purple-900/30 border border-purple-200/60 dark:border-purple-700/40 mb-5">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 tracking-wide uppercase">Billing & Orders</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900 dark:text-white tracking-tight">
            Costing Management
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            Choose a workflow below to create new bills or manage existing records
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.href} href={card.href} className="group outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-2xl">
                <div className={`relative h-full rounded-2xl border border-purple-200/60 dark:border-purple-700/40 ${card.hoverBorder} bg-gradient-to-br from-purple-50 via-violet-50/80 to-fuchsia-50/60 dark:from-purple-900/40 dark:via-violet-900/30 dark:to-gray-800/80 backdrop-blur-sm transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:shadow-xl group-hover:shadow-purple-500/20 overflow-hidden`}>
                  {/* Top gradient accent line */}
                  <div className={`h-1 w-full bg-gradient-to-r ${card.gradient}`} />

                  <div className="p-7 flex flex-col h-full">
                    {/* Icon + Badge row */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`p-3 rounded-xl ${card.iconBg} ring-1 ${card.accentRing} transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}>
                        <Icon className={`w-7 h-7 ${card.iconColor}`} />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-gradient-to-r ${card.gradient} text-white shadow-sm`}>
                        {card.badge}
                      </span>
                    </div>

                    {/* Content */}
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {card.title}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1">
                      {card.description}
                    </p>

                    {/* Footer action */}
                    <div className="mt-6 flex items-center gap-2 text-sm font-medium text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                      <span>Get started</span>
                      <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom hint */}
        <p className="mt-10 text-xs text-gray-400 dark:text-gray-500 text-center">
          Tip: Use <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] font-mono">Existing Guest</kbd> to quickly look up a previous order
        </p>
      </div>
    </div>
  )
}

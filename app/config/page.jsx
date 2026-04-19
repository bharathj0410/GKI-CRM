'use client';

/**
 * Configuration Management Page
 * 
 * This page serves as the central configuration hub for the application.
 * All configuration options defined here will be reflected throughout the entire application.
 * 
 * Purpose:
 * - Centralized management of application-wide settings
 * - Quick updates that propagate across all modules
 * - Consistent data definitions for Box Types, Pin Types, Glue Types, and Color Types
 * 
 * How to use:
 * - Add new configuration types by adding a new entry to CONFIG_SECTIONS
 * - Modify existing sections by updating the configuration object
 * - The TagInput component handles CRUD operations for each configuration type
 * 
 * @module ConfigurationPage
 */

import React from 'react';
import { useState } from 'react';
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import TagInput from "@/components/Config/TagInput";

/**
 * Configuration sections definition
 * Each section represents a configurable entity in the application
 * 
 * @property {string} tableName - Display name and database identifier
 * @property {boolean} hasPrice - Whether this configuration includes pricing
 * @property {string} description - Brief description of the configuration purpose
 */
const CONFIG_SECTIONS = [
  {
    tableName: "Box Type",
    hasPrice: false,
    description: "Define available box types for product packaging"
  },
  {
    tableName: "Pin Type",
    hasPrice: true,
    description: "Configure pin types with associated pricing"
  },
  {
    tableName: "Glue Type",
    hasPrice: true,
    description: "Manage glue types and their cost structure"
  },
  {
    tableName: "Color Type",
    hasPrice: true,
    description: "Set up color options with pricing information"
  }
];

/**
 * Configuration Management Page Component
 * Renders all configuration sections in a professional layout
 */
export default function ConfigurationPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter sections based on search query
  const filteredSections = CONFIG_SECTIONS.filter(section =>
    section.tableName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ⚙️ Configuration Center
          </h1>
          <p className="text-gray-600 text-lg">
            Centralized control panel for application-wide settings. Changes made here reflect across the entire system.
          </p>
        </div>

        {/* Important Note */}
        <div className="mb-6 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-sm border-2 border-orange-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-orange-900 mb-2">⚠️ Important Notice</h3>
              <p className="text-orange-800 leading-relaxed">
                Any changes made to these configurations will <strong>immediately affect all related features</strong> across the application. Always verify your changes and save them before navigating away from this page.
              </p>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <svg className="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Sections</p>
                <p className="text-3xl font-bold text-gray-800">{CONFIG_SECTIONS.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 rounded-lg p-3">
                <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">With Pricing</p>
                <p className="text-3xl font-bold text-gray-800">
                  {CONFIG_SECTIONS.filter(s => s.hasPrice).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 rounded-lg p-3">
                <svg className="w-7 h-7 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Active Configs</p>
                <p className="text-3xl font-bold text-gray-800">{CONFIG_SECTIONS.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <Autocomplete
            label=""
            placeholder="Search by name or description..."
            value={searchQuery}
            onInputChange={setSearchQuery}
            className="max-w-2xl"
            size="lg"
            variant="bordered"
            color="secondary"
            startContent={
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            }
          >
            {CONFIG_SECTIONS.map((section) => (
              <AutocompleteItem key={section.tableName} value={section.tableName}>
                {section.tableName}
              </AutocompleteItem>
            ))}
          </Autocomplete>
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-600">
              Found {filteredSections.length} configuration{filteredSections.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Configuration Sections */}
        {filteredSections.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No configurations found</h3>
            <p className="text-gray-600">Try adjusting your search query</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredSections.map((section) => (
              <div
                key={section.tableName}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden"
              >
                {/* Section Header */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {section.tableName}
                      </h2>
                      <p className="text-gray-600 text-sm">
                        {section.description}
                      </p>
                    </div>
                  
                  {section.hasPrice && (
                    <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 px-4 py-2 rounded-xl">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-semibold text-green-700">Pricing Enabled</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Section Content */}
              <div className="px-8 py-6">
                <TagInput
                  tableName={section.tableName}
                  hasPrice={section.hasPrice}
                />
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}

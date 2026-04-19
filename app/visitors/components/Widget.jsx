"use client"
import { Card, CardBody } from '@heroui/react'
import React from 'react'

export default function Widget({ icon, count, name, gradient = "from-secondary to-purple-600" }) {
  return (
    <Card className='hover:shadow-xl transition-all duration-300 hover:scale-105'>
      <CardBody className='p-0'>
        <div className='flex items-center gap-4 p-5'>
          <div className={`bg-gradient-to-br ${gradient} rounded-xl p-3 shadow-lg`}>
            {icon}
          </div>
          <div className='flex-1'>
            <p className='font-extrabold text-3xl text-gray-900'>{count}</p>
            <p className='text-sm text-gray-600 font-medium'>{name}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

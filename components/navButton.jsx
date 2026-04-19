"use client"
import { useRouter } from 'next/navigation';
import React from 'react'

export default function NavButton({ icon, currentTab, tab, setTab, closeSideBar, name, route }) {
    const router = useRouter();
    const isActive = currentTab === tab;
    
    const onClickHandler = ()=>{
        setTab(tab)
        router.push(route || "/"+tab)
    }
    
    return (
        <div 
            className={`relative group rounded-xl transition-all duration-200 hover:cursor-pointer ${
                isActive 
                    ? 'bg-white/20 shadow-lg backdrop-blur-sm' 
                    : 'hover:bg-white/10'
            }`} 
            onClick={onClickHandler} 
            role='button'
        >
            {isActive && (
                <div className='absolute inset-0 bg-gradient-to-r from-primary-400/20 to-transparent rounded-xl'></div>
            )}
            <div className={`relative flex items-center gap-3 ${closeSideBar ? 'justify-center p-3' : 'p-3'}`}>
                <div className={`transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-white/70 group-hover:text-white'
                }`}>
                    {icon}
                </div>
                {!closeSideBar && (
                    <p className={`text-sm font-medium transition-colors ${
                        isActive ? 'text-white' : 'text-white/70 group-hover:text-white'
                    }`}>
                        {name}
                    </p>
                )}
            </div>
            {isActive && !closeSideBar && (
                <div className='absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full'></div>
            )}
        </div>
    )
}

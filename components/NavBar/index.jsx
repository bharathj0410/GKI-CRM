'use client';
import { useState, useEffect } from 'react';
import Navbar from "./navbar"
import SignIn from '@/components/SignIn';
import Dashboard from '@/components/Dashbord';
import Members from '@/components/Members';
import Costing from '@/components/CostingTab/Costing';
import VisitorDetails from '@/components/VisitorTab/Visitors';
import Stocks from '@/components/StocksTab/Stocks';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

export default function NavBar() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  // Set tab based on current pathname
  const getCurrentTab = () => {
    if (pathname === '/') return '';
    if (pathname.startsWith('/employee')) return 'employee';
    if (pathname.startsWith('/stocks')) return 'stocks';
    if (pathname.startsWith('/costing')) return 'costing';
    if (pathname.startsWith('/visitors')) return 'visitors';
    if (pathname.startsWith('/job')) return 'job';
    return '';
  };
  
  const [tab, setTab] = useState(getCurrentTab());

  useEffect(() => {
    // Update tab when pathname changes
    setTab(getCurrentTab());
  }, [pathname]);

  useEffect(() => {
    // Redirect to login if not authenticated and not already on login page
    if (!loading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, loading, pathname, router]);

  // Don't show navbar on login page
  if (pathname === '/login') {
    return null;
  }

  // Show skeleton navbar during loading
  if (loading) {
    return (
      <div className='flex'>
        <div className='w-64 duration-300 ease-in-out transition-all'>
          <div className='p-3 text-white fixed h-screen z-50'>
            <div className='w-60 h-full rounded-2xl flex flex-col p-5 bg-gradient-to-b from-secondary via-secondary to-purple-800 shadow-2xl border border-white/10 animate-pulse'>
              <div className='h-8 bg-white/10 rounded mb-6'></div>
              <div className='w-full h-px bg-white/10 mb-6'></div>
              <div className='space-y-2 flex-1'>
                <div className='h-12 bg-white/10 rounded-xl'></div>
                <div className='h-12 bg-white/10 rounded-xl'></div>
                <div className='h-12 bg-white/10 rounded-xl'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if not logged in
  if (!user) {
    return null;
  }

  return (
    <div className='flex'>
        <Navbar setTab={setTab} tab={tab}/>
    </div>
  )
}

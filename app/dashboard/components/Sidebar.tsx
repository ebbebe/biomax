'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Image from 'next/image';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-700';
  };

  return (
    <div className="bg-blue-900 text-white w-64 flex-shrink-0 hidden md:block">
      <div className="flex items-center justify-center h-16 border-b border-blue-800">
        <Image
          src="/logo.png"
          alt="BioMax Logo"
          width={150}
          height={40}
          className="mx-auto"
        />
      </div>
      <nav className="mt-5">
        <div className="px-2 space-y-1">
          {user?.role === 'admin' ? (
            // 관리자 메뉴
            <>
              <Link 
                href="/dashboard" 
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/dashboard')}`}
              >
                <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                대시보드
              </Link>
              <Link 
                href="/dashboard/products" 
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/dashboard/products')}`}
              >
                <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                품목관리
              </Link>
              <Link 
                href="/dashboard/orders" 
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/dashboard/orders')}`}
              >
                <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                주문확인
              </Link>
              <Link 
                href="/dashboard/users" 
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/dashboard/users')}`}
              >
                <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                계정관리
              </Link>
            </>
          ) : (
            // 일반 사용자 메뉴
            <>
              <Link 
                href="/dashboard" 
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/dashboard')}`}
              >
                <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                대시보드
              </Link>
              <Link 
                href="/dashboard/order-new" 
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/dashboard/order-new')}`}
              >
                <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                주문등록
              </Link>
              <Link 
                href="/dashboard/order-history" 
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/dashboard/order-history')}`}
              >
                <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                주문내역
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

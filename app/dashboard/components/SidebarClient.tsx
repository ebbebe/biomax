'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { UserRole } from '@/lib/types';

type User = {
  id: string;
  name: string;
  role: UserRole;
  username: string;
  companyName?: string;
  businessNumber?: string;
  phone?: string;
  address?: string;
  email?: string;
  image?: string;
};

export default function SidebarClient({ user }: { user: User }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-gray-700 text-white font-medium border-l-4 border-blue-500' : 'text-gray-300 hover:bg-gray-700 hover:text-white border-l-4 border-transparent';
  };
  
  // 애니메이션 변수
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="bg-gray-800 text-white w-64 flex-shrink-0 hidden md:block shadow-md">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-16 border-b border-gray-700 bg-gray-900"
      >
        <Image
          src="/logo.png"
          alt="BioMax Logo"
          width={150}
          height={40}
          className="mx-auto"
        />
      </motion.div>
      <nav className="mt-5 px-3">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-1">
          {user?.role === 'admin' ? (
            // 관리자 메뉴
            <>
              <motion.div variants={item}>
                <Link 
                  href="/dashboard" 
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive('/dashboard')}`}
                >
                  <div className="bg-gray-700 p-1.5 rounded-lg mr-3">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  대시보드
                </Link>
              </motion.div>
              
              <motion.div variants={item}>
                <Link 
                  href="/dashboard/products" 
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive('/dashboard/products')}`}
                >
                  <div className="bg-gray-700 p-1.5 rounded-lg mr-3">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  품목관리
                </Link>
              </motion.div>
              
              <motion.div variants={item}>
                <Link 
                  href="/dashboard/orders" 
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive('/dashboard/orders')}`}
                >
                  <div className="bg-gray-700 p-1.5 rounded-lg mr-3">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  주문확인
                </Link>
              </motion.div>
              
              <motion.div variants={item}>
                <Link 
                  href="/dashboard/users" 
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive('/dashboard/users')}`}
                >
                  <div className="bg-gray-700 p-1.5 rounded-lg mr-3">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  계정관리
                </Link>
              </motion.div>
            </>
          ) : (
            // 일반 사용자 메뉴
            <>
              <motion.div variants={item}>
                <Link 
                  href="/dashboard" 
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive('/dashboard')}`}
                >
                  <div className="bg-gray-700 p-1.5 rounded-lg mr-3">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  대시보드
                </Link>
              </motion.div>
              
              <motion.div variants={item}>
                <Link 
                  href="/dashboard/order-new" 
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive('/dashboard/order-new')}`}
                >
                  <div className="bg-gray-700 p-1.5 rounded-lg mr-3">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  주문등록
                </Link>
              </motion.div>
              
              <motion.div variants={item}>
                <Link 
                  href="/dashboard/order-history" 
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive('/dashboard/order-history')}`}
                >
                  <div className="bg-gray-700 p-1.5 rounded-lg mr-3">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  주문내역
                </Link>
              </motion.div>
            </>
          )}
        </motion.div>
        
        <div className="mt-10 px-3 py-4">
          <div className="bg-gray-700 rounded-lg p-3">
            <h3 className="text-xs font-medium text-gray-300 uppercase tracking-wider">시스템 정보</h3>
            <div className="mt-2 text-xs text-gray-400 space-y-1">
              <p>버전: 1.0.0</p>
              <p>최종 업데이트: {new Date().toLocaleDateString('ko-KR')}</p>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { signOut } from 'next-auth/react';
import { UserRole } from '@/lib/types';

// 서버에서 가져온 사용자 정보 타입
type UserInfo = {
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

export default function AuthHeader({ user }: { user: UserInfo }) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      // NextAuth를 사용한 로그아웃
      await signOut({ redirect: true, callbackUrl: '/login' });
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 shadow-sm z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 왼쪽 영역 */}
          <div className="w-1/3">
            {/* 로고나 추가 요소가 필요하면 여기에 배치 */}
          </div>
          
          {/* 중앙 영역 - 제목 */}
          <div className="w-1/3 text-center">
            <motion.h1 
              whileHover={{ scale: 1.02 }}
              className="text-2xl font-bold text-gray-800 tracking-tight"
            >
              
            </motion.h1>
          </div>
          
          {/* 오른쪽 영역 - 사용자 메뉴 */}
          <div className="w-1/3 flex justify-end">
            <button 
              onClick={handleLogout}
              className="flex items-center bg-gray-100 hover:bg-gray-200 transition-all duration-200 px-4 py-2 rounded-lg text-gray-700"
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm font-medium">로그아웃</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

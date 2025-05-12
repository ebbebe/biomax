'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showDevTools, setShowDevTools] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // 개발 목적으로 역할 전환 함수
  const switchRole = (newRole: 'admin' | 'user') => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      role: newRole
    };
    
    // localStorage 업데이트
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // 페이지 새로고침으로 변경사항 적용
    window.location.reload();
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 shadow-sm z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <motion.h1 
            whileHover={{ scale: 1.02 }}
            className="text-2xl font-bold text-gray-800 tracking-tight"
          >
            바이오맥스 발주시스템
          </motion.h1>
          <div className="flex items-center">
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 transition-all duration-200 px-3 py-2 rounded-lg text-gray-700"
              >
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium">{user?.name || '사용자'}</span>
                  <span className="text-xs opacity-80">
                    {user?.role === 'admin' ? '관리자' : '사용자'}
                  </span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-10"
                >
                  {/* 개발 도구 - 역할 전환 버튼 */}
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-medium text-gray-400">개발 도구</p>
                    <div className="mt-2 grid grid-cols-2 gap-1">
                      <button 
                        onClick={() => switchRole('admin')}
                        className={`px-2 py-1 text-xs rounded-md ${user?.role === 'admin' ? 'bg-indigo-100 text-indigo-700 font-medium' : 'bg-gray-100 text-gray-600 hover:bg-indigo-50'}`}
                        disabled={user?.role === 'admin'}
                      >
                        관리자 모드
                      </button>
                      <button 
                        onClick={() => switchRole('user')}
                        className={`px-2 py-1 text-xs rounded-md ${user?.role === 'user' ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 text-gray-600 hover:bg-blue-50'}`}
                        disabled={user?.role === 'user'}
                      >
                        사용자 모드
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      로그아웃
                    </div>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

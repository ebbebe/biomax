'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showDevTools, setShowDevTools] = useState(false);

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
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h1 className="text-2xl font-semibold text-gray-900">바이오맥스 발주시스템</h1>
          <div className="flex items-center">
            <div className="mr-4">
              <span className="text-sm text-gray-500">안녕하세요,</span>
              <span className="ml-1 text-sm font-medium text-gray-900">{user?.name}</span>
              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                {user?.role === 'admin' ? '관리자' : '사용자'}
              </span>
              
              {/* 개발 도구 토글 버튼 */}
              <button 
                onClick={() => setShowDevTools(!showDevTools)}
                className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                title="개발 도구 표시"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              
              {/* 개발 도구 - 역할 전환 버튼 */}
              {showDevTools && (
                <div className="ml-2 flex space-x-1">
                  <button 
                    onClick={() => switchRole('admin')}
                    className={`px-2 py-1 text-xs rounded-md ${user?.role === 'admin' ? 'bg-purple-200 text-purple-800' : 'bg-gray-200 text-gray-700 hover:bg-purple-100'}`}
                    disabled={user?.role === 'admin'}
                  >
                    관리자 모드
                  </button>
                  <button 
                    onClick={() => switchRole('user')}
                    className={`px-2 py-1 text-xs rounded-md ${user?.role === 'user' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-700 hover:bg-green-100'}`}
                    disabled={user?.role === 'user'}
                  >
                    사용자 모드
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="ml-3 px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

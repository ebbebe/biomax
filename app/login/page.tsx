'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';

// 메인 로그인 페이지 컴포넌트
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoadingFallback />}>
      <LoginContent />
    </Suspense>
  );
}

// 로딩 상태 컴포넌트
function LoginLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-3 text-gray-600">로딩 중...</p>
      </div>
    </div>
  );
}

// 실제 로그인 내용 컴포넌트
function LoginContent() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  // 애니메이션 변수
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // URL 파라미터에서 오류 메시지 확인
  const searchParams = useSearchParams();
  const errorType = searchParams.get('error');
  
  // useEffect를 사용하여 오류 메시지 처리
  useEffect(() => {
    if (errorType === 'CredentialsSignin') {
      setError('계정 정보가 올바르지 않습니다.');
    } else if (errorType) {
      setError('로그인 중 오류가 발생했습니다.');
    }
  }, [errorType]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!username || !password) {
      setError('계정 아이디와 비밀번호를 모두 입력해주세요.');
      setIsLoading(false);
      return;
    }
    
    try {
      // NextAuth 로그인 호출
      const result = await signIn('credentials', {
        username,
        password,
        redirect: true,
        callbackUrl: '/dashboard'
      });
      
      // 리다이렉트 옵션이 true이므로 여기에 도달하지 않음
      // 오류 처리는 URL 파라미터로 처리됨
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 자동 로그인 함수
  const handleAutoLogin = async (userType: 'admin' | 'user') => {
    setIsLoading(true);
    setError('');
    
    const credentials = {
      admin: { username: 'admin', password: '1234' },
      user: { username: 'user1', password: '1234' }
    };
    
    const { username: autoUsername, password: autoPassword } = credentials[userType];
    
    try {
      await signIn('credentials', {
        username: autoUsername,
        password: autoPassword,
        redirect: true,
        callbackUrl: '/dashboard'
      });
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
      console.error('Auto login error:', err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div 
        className="max-w-5xl w-full mx-auto overflow-hidden shadow-xl rounded-xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col md:flex-row">
          {/* 왼쪽 사이드 - 이미지, 로고, 텍스트 */}
          <div className="w-full md:w-1/2 bg-blue-800 relative p-10 text-white flex flex-col justify-center items-start">
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-3">바이오맥스</h1>
              <h2 className="text-3xl font-bold mb-6">웹발주시스템</h2>
              <p className="text-2xl font-light mb-2">Web Order</p>
              <p className="text-2xl font-light">System</p>
            </div>
            
            {/* 배경 이미지 (연구실/과학자 이미지) */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-50"
              style={{
                backgroundImage: 'url(/lab_background.jpg)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-700 opacity-70" />
          </div>
          
          {/* 오른쪽 사이드 - 로그인 폼 */}
          <div className="w-full md:w-1/2 bg-white p-10 flex flex-col justify-center">
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">협력사/관리자 로그인</h2>
              
              <motion.form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    아이디/ID
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    비밀번호/Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {error && (
                  <motion.div 
                    className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.div>
                )}

                <div>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        로그인 중...
                      </>
                    ) : '로그인'}
                  </motion.button>
                </div>
              </motion.form>
            </motion.div>
            
            {/* 하단 연락처 정보 */}
            <motion.div variants={itemVariants} className="mt-8 text-xs text-center text-gray-500">
              <p>신규거래관련문의 031-554-5344 | sales@biomaxcorp.co.kr</p>
              <p className="mt-1">ID 신규관련문의는 담당영업사원또는 사업소로 문의하시기 바랍니다.</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

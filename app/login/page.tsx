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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/50">
          <motion.div className="text-center" variants={itemVariants}>
            <Image
              src="/logo.png"
              alt="BioMax Logo"
              width={180}
              height={72}
              className="mx-auto"
            />
            <h2 className="mt-6 text-center text-2xl font-bold text-gray-900 tracking-tight">
              발주시스템 로그인
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              바이오맥스 발주시스템에 오신 것을 환영합니다
            </p>
          </motion.div>
          
          <motion.form 
            className="mt-8 space-y-5" 
            onSubmit={handleSubmit}
            variants={itemVariants}
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  계정 아이디
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 sm:text-sm"
                    placeholder="계정 아이디 입력"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 sm:text-sm"
                    placeholder="비밀번호 입력"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
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
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 shadow-sm"
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
          
          <motion.div 
            className="mt-6 text-sm text-center text-gray-500 bg-gray-50 p-3 rounded-lg"
            variants={itemVariants}
          >
            <p className="font-medium text-gray-600 mb-2">테스트 계정으로 로그인</p>
            <div className="grid grid-cols-2 gap-2">
              <motion.button
                onClick={() => handleAutoLogin('admin')}
                disabled={isLoading}
                className="bg-white p-2 rounded border border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200 flex flex-col items-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <p className="font-medium text-indigo-600 mb-1">관리자</p>
                <p className="text-xs text-gray-600">admin</p>
                <p className="text-xs text-gray-600">1234</p>
              </motion.button>
              
              <motion.button
                onClick={() => handleAutoLogin('user')}
                disabled={isLoading}
                className="bg-white p-2 rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 flex flex-col items-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <p className="font-medium text-blue-600 mb-1">사용자</p>
                <p className="text-xs text-gray-600">user1</p>
                <p className="text-xs text-gray-600">1234</p>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

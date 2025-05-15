'use server';

import { redirect } from 'next/navigation';
import { getCollection, collections } from '@/lib/mongodb';
import { User, UserRole } from '@/lib/types';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * NextAuth.js를 사용하여 현재 로그인한 사용자 정보를 가져옵니다.
 * 이 함수는 서버 컴포넌트에서 사용할 수 있습니다.
 */
export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return null;
    }
    
    return session.user as User;
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    return null;
  }
}

/**
 * 사용자 권한을 확인하고 필요한 권한이 없는 경우 리다이렉트합니다.
 * 이 함수는 서버 컴포넌트에서 사용할 수 있습니다.
 */
export async function checkUserRole(requiredRole: UserRole) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    
    if (!user) {
      return { redirect: '/login' };
    }
    
    if (requiredRole === 'admin' && user.role !== 'admin') {
      return { redirect: '/dashboard' };
    }
    
    return { role: user.role };
  } catch (error) {
    console.error('권한 확인 오류:', error);
    return { redirect: '/login' };
  }
}

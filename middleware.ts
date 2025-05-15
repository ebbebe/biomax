import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withAuth } from 'next-auth/middleware';

// 인증이 필요한 경로 목록
const protectedRoutes = ['/dashboard'];

// NextAuth 미들웨어 사용
export default withAuth(
  // 미들웨어 함수
  function middleware(request: NextRequest) {
    return NextResponse.next();
  },
  {
    callbacks: {
      // 인증 여부 확인
      authorized: ({ token }) => !!token,
    },
  }
);

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * 다음 경로에 대해 미들웨어 실행:
     * - /dashboard로 시작하는 모든 경로
     */
    '/dashboard/:path*',
  ],
};

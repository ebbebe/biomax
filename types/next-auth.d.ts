import NextAuth from "next-auth";
import { UserRole } from "@/lib/types";
import { User } from '@/lib/types';
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * 기본 세션에 추가 속성을 확장합니다
   */
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  /**
   * JWT 토큰에 추가 속성을 확장합니다
   */
  interface JWT {
    id: string;
    role: UserRole;
    username: string;
    companyName?: string;
    businessNumber?: string;
    phone?: string;
    address?: string;
  }
}

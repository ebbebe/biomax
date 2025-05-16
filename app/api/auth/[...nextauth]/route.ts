import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCollection, collections } from "@/lib/mongodb";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { UserRole } from "@/lib/types";
import bcrypt from "bcryptjs";

// NextAuth 설정
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // MongoDB에서 사용자 조회 (username으로만 검색)
          const usersCollection = await getCollection(collections.users);
          const user = await usersCollection.findOne({ 
            username: credentials.username
          });

          if (!user) {
            return null;
          }

          // 비밀번호 검증
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          if (user.status === 'blocked') {
            throw new Error('계정이 차단되었습니다. 관리자에게 문의하세요.');
          }

          // 마지막 로그인 시간 업데이트
          await usersCollection.updateOne(
            { _id: user._id },
            { $set: { lastLogin: new Date().toISOString(), updatedAt: new Date().toISOString() } }
          );

          // NextAuth에 반환할 사용자 객체
          return {
            id: user._id.toString(),
            name: user.name,
            username: user.username,
            role: user.role as UserRole,
            companyName: user.companyName,
            businessNumber: user.businessNumber,
            phone: user.phone,
            address: user.address
          };
        } catch (error) {
          console.error("인증 오류:", error);
          throw new Error(error instanceof Error ? error.message : "인증 중 오류가 발생했습니다.");
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      // 사용자 정보를 토큰에 추가
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
        token.companyName = user.companyName;
        token.businessNumber = user.businessNumber;
        token.phone = user.phone;
        token.address = user.address;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      // 세션에 사용자 정보 추가
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.username = token.username as string;
        session.user.companyName = token.companyName as string;
        session.user.businessNumber = token.businessNumber as string;
        session.user.phone = token.phone as string;
        session.user.address = token.address as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 14 * 24 * 60 * 60, // 14일
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// NextAuth 핸들러 생성
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

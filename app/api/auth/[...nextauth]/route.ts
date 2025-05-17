import NextAuth from "next-auth";
import { authOptions } from "../options";

// NextAuth 핸들러 생성
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

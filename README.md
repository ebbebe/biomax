# 바이오맥스 주문관리 시스템

## 환경 변수 설정

이 프로젝트는 다음과 같은 환경 변수를 사용합니다. 프로젝트 루트에 `.env.local` 파일을 생성하고 아래 변수들을 설정해주세요.

```
# MongoDB 연결 정보
MONGODB_URI=mongodb://username:password@localhost:27017/biomax
MONGODB_DB=biomax

# NextAuth 설정
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# 이메일 설정 (주문완료 이메일 발송용)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_SENDER_NAME=바이오맥스 주문시스템
DEFAULT_ORDER_EMAIL=orders@example.com
```

### 이메일 발송 설정 안내

이메일 발송을 위해 Gmail을 사용할 경우:

1. Gmail 계정의 2단계 인증을 활성화합니다.
2. Google 계정 설정 > 보안 > 앱 비밀번호에서 애플리케이션용 비밀번호를 생성합니다.
3. 생성된 비밀번호를 `EMAIL_PASSWORD` 환경 변수에 입력합니다.
4. `EMAIL_USER`에는 Gmail 이메일 주소를 입력합니다.
5. `DEFAULT_ORDER_EMAIL`에는 주문 완료 이메일을 받을 수신자 이메일을 입력합니다.

## 기능

- 사용자 관리 (관리자/일반 사용자)
- 제품 관리
- 주문 등록 및 관리
- 주문 완료 시 이메일 자동 발송
- 하루 일일 전송량 제한 약 500통

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [remember, setRemember] = useState(false);
  // Dummy login; redirect to /dashboard
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f5f5",
      }}
    >
      <Image
        src="https://ext.same-assets.com/1304735728/1117858943.png"
        alt="BIOMAX Logo"
        width={230}
        height={70}
        style={{ marginBottom: 14, marginTop: -30 }}
      />
      <h2
        style={{
          fontWeight: 500,
          fontSize: 30,
          marginBottom: 36,
        }}
      >
        바이오맥스 웹주문관리 시스템
      </h2>
      <div
        style={{
          width: 380,
          background: "#fff",
          borderRadius: 15,
          boxShadow: "0 6px 24px 0 rgba(38,51,77,.09)",
          padding: "35px 36px 28px 36px",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            fontWeight: 500,
            fontSize: 18,
            borderBottom: "1px solid #c6dee9",
            marginBottom: 30,
            color: "#1a5595",
            paddingBottom: 12,
          }}
        >
          로그인
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                color: "#333",
                fontWeight: 400,
                marginBottom: 5,
              }}
              htmlFor="account"
            >
              계정 *
            </label>
            <input
              required
              type="text"
              id="account"
              placeholder="아이디"
              style={{
                width: "100%",
                fontSize: 17,
                border: "1px solid #97adc0",
                padding: "8px 12px",
                borderRadius: 4,
                outline: "none",
                marginBottom: 4,
              }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                color: "#333",
                fontWeight: 400,
                marginBottom: 5,
              }}
              htmlFor="password"
            >
              비밀번호 *
            </label>
            <input
              required
              type="password"
              id="password"
              placeholder="비밀번호"
              style={{
                width: "100%",
                fontSize: 17,
                border: "1px solid #97adc0",
                padding: "8px 12px",
                borderRadius: 4,
                outline: "none",
                marginBottom: 6,
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              style={{ marginRight: 7 }}
            />
            <label
              htmlFor="remember"
              style={{ color: "#222", fontSize: 15, cursor: "pointer" }}
            >
              계정기억
            </label>
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              background: "linear-gradient(90deg, #1a5595 0%, #2988c7 100%)",
              color: "#fff",
              fontWeight: 500,
              fontSize: 19,
              border: "none",
              borderRadius: 6,
              padding: "11px 0",
              cursor: "pointer",
              boxShadow: "0 1.5px 5px #b4b4b4aa",
            }}
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}

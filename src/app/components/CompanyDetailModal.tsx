"use client";

import { useEffect, useRef } from "react";

interface CompanyDetailProps {
  company: {
    id: string;
    name: string;
    businessNumber: string;
    address: string;
    phone: string;
  };
  onClose: () => void;
}

export default function CompanyDetailModal({ company, onClose }: CompanyDetailProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        ref={modalRef}
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          width: "450px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "#1a5595",
            color: "#fff",
            padding: "15px 20px",
            fontSize: "18px",
            fontWeight: 500,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>거래처 상세 정보</span>
          <span
            onClick={onClose}
            style={{ cursor: "pointer", fontSize: "22px" }}
          >
            ×
          </span>
        </div>

        <div style={{ padding: "20px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px 5px",
                    borderBottom: "1px solid #eee",
                    width: "120px",
                    color: "#555",
                  }}
                >
                  거래처명
                </th>
                <td
                  style={{
                    padding: "10px 5px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {company.name}
                </td>
              </tr>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px 5px",
                    borderBottom: "1px solid #eee",
                    color: "#555",
                  }}
                >
                  사업자등록번호
                </th>
                <td
                  style={{
                    padding: "10px 5px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {company.businessNumber}
                </td>
              </tr>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px 5px",
                    borderBottom: "1px solid #eee",
                    color: "#555",
                  }}
                >
                  주소
                </th>
                <td
                  style={{
                    padding: "10px 5px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {company.address}
                </td>
              </tr>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px 5px",
                    borderBottom: "1px solid #eee",
                    color: "#555",
                  }}
                >
                  전화번호
                </th>
                <td
                  style={{
                    padding: "10px 5px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {company.phone}
                </td>
              </tr>
            </tbody>
          </table>

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button
              onClick={onClose}
              style={{
                background: "#1a5595",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "8px 20px",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

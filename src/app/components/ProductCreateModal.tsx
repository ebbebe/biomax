"use client";

import { useState, useEffect, useRef } from "react";
import { ProductData } from "../../types";

interface ProductCreateModalProps {
  onClose: () => void;
  onSave: (product: Omit<ProductData, "id" | "linkedCompanies">) => void;
}

export default function ProductCreateModal({
  onClose,
  onSave,
}: ProductCreateModalProps) {
  const [productData, setProductData] = useState<Omit<ProductData, "id" | "linkedCompanies">>({
    code: "",
    name: "",
    stock: "",
    registrationDate: new Date().toISOString().split('T')[0],
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // 재고는 숫자만 입력 가능하도록 처리
    if (name === "stock" && value !== "") {
      // 숫자만 추출하고 천 단위 콤마 추가
      const numericValue = value.replace(/[^\d]/g, "");
      const formattedValue = numericValue === "" 
        ? "" 
        : Number(numericValue).toLocaleString();
      
      setProductData({
        ...productData,
        [name]: formattedValue,
      });
    } else {
      setProductData({
        ...productData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(productData);
  };

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
          width: "500px",
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
          <span>품목 등록</span>
          <span
            onClick={onClose}
            style={{ cursor: "pointer", fontSize: "22px" }}
          >
            ×
          </span>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: 500,
                fontSize: "15px",
              }}
            >
              등록일자
            </label>
            <input
              type="date"
              name="registrationDate"
              value={productData.registrationDate}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #bcbcbc",
                borderRadius: "4px",
                fontSize: "15px",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: 500,
                fontSize: "15px",
              }}
            >
              상품코드
            </label>
            <input
              type="text"
              name="code"
              value={productData.code}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #bcbcbc",
                borderRadius: "4px",
                fontSize: "15px",
              }}
              required
              placeholder="예: P001"
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: 500,
                fontSize: "15px",
              }}
            >
              제품명
            </label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #bcbcbc",
                borderRadius: "4px",
                fontSize: "15px",
              }}
              required
            />
          </div>

          {/* 가격 필드 제거 */}

          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: 500,
                fontSize: "15px",
              }}
            >
              재고
            </label>
            <input
              type="text"
              name="stock"
              value={productData.stock}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #bcbcbc",
                borderRadius: "4px",
                fontSize: "15px",
              }}
              required
              placeholder="숫자만 입력 (예: 1000)"
            />
          </div>

          {/* 카테고리 필드 제거 */}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 20px",
                background: "#f5f5f5",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              취소
            </button>
            <button
              type="submit"
              style={{
                padding: "8px 20px",
                background: "#1a5595",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

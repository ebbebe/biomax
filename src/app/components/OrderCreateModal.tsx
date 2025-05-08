"use client";

import { useState } from "react";

interface OrderCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (orderData: OrderData) => void;
}

export interface OrderData {
  date: string;
  product: string;
  qty: string;
  memo: string;
  company: string;
  address: string;
  orderStatus: string;
}

export default function OrderCreateModal({ isOpen, onClose, onSubmit }: OrderCreateModalProps) {
  const [orderData, setOrderData] = useState<OrderData>({
    date: new Date().toISOString().split('T')[0],
    product: "",
    qty: "",
    memo: "",
    company: "",
    address: "",
    orderStatus: "진행",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(orderData);
  };

  if (!isOpen) return null;

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
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          width: "500px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        {/* 헤더 */}
        <div style={{ 
          background: '#1a5595', 
          height: 50, 
          display: 'flex', 
          alignItems: 'center', 
          padding: '0 20px', 
          color: '#fff', 
          fontSize: 17,
          fontWeight: 500
        }}>
          <span>주문 등록</span>
          <span style={{ flex: 1 }} />
          <span 
            onClick={onClose} 
            style={{ 
              cursor: 'pointer', 
              fontSize: 20 
            }}
          >
            ✖
          </span>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: "20px" }}>
            <div style={{ marginBottom: "15px" }}>
              <label 
                style={{ 
                  display: "block", 
                  marginBottom: "5px", 
                  fontWeight: 500,
                  fontSize: "15px"
                }}
              >
                등록일
              </label>
              <input
                type="date"
                name="date"
                value={orderData.date}
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
                  fontSize: "15px"
                }}
              >
                제품명
              </label>
              <select
                name="product"
                value={orderData.product}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #bcbcbc",
                  borderRadius: "4px",
                  fontSize: "15px",
                }}
                required
              >
                <option value="">제품을 선택하세요</option>
                <option value="AQUBAC 종균제 (kg)">AQUBAC 종균제 (kg)</option>
                <option value="바이오맥스 (L)">바이오맥스 (L)</option>
                <option value="바이오스타 (kg)">바이오스타 (kg)</option>
              </select>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label 
                style={{ 
                  display: "block", 
                  marginBottom: "5px", 
                  fontWeight: 500,
                  fontSize: "15px"
                }}
              >
                수량
              </label>
              <input
                type="text"
                name="qty"
                value={orderData.qty}
                onChange={handleChange}
                placeholder="수량을 입력하세요"
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
                  fontSize: "15px"
                }}
              >
                회사명
              </label>
              <input
                type="text"
                name="company"
                value={orderData.company}
                onChange={handleChange}
                placeholder="회사명을 입력하세요"
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
                  fontSize: "15px"
                }}
              >
                주소
              </label>
              <input
                type="text"
                name="address"
                value={orderData.address}
                onChange={handleChange}
                placeholder="주소를 입력하세요"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #bcbcbc",
                  borderRadius: "4px",
                  fontSize: "15px",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label 
                style={{ 
                  display: "block", 
                  marginBottom: "5px", 
                  fontWeight: 500,
                  fontSize: "15px"
                }}
              >
                주문상태
              </label>
              <select
                name="orderStatus"
                value={orderData.orderStatus}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #bcbcbc",
                  borderRadius: "4px",
                  fontSize: "15px",
                }}
                required
              >
                <option value="진행">진행</option>
                <option value="완료">완료</option>
              </select>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label 
                style={{ 
                  display: "block", 
                  marginBottom: "5px", 
                  fontWeight: 500,
                  fontSize: "15px"
                }}
              >
                메모
              </label>
              <textarea
                name="memo"
                value={orderData.memo}
                onChange={handleChange}
                placeholder="메모를 입력하세요"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #bcbcbc",
                  borderRadius: "4px",
                  fontSize: "15px",
                  minHeight: "80px",
                  resize: "vertical",
                }}
              />
            </div>
          </div>

          {/* 버튼 영역 */}
          <div 
            style={{ 
              padding: "15px 20px", 
              borderTop: "1px solid #c6dee9",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              background: "#f4f5f5"
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 16px",
                backgroundColor: "#fff",
                color: "#333",
                border: "1px solid #bcbcbc",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              취소
            </button>
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                backgroundColor: "#1a5595",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
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

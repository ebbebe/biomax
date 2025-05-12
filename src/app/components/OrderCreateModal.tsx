"use client";

import { useState } from "react";
import { OrderData } from "../../types";

interface OrderCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (orderData: OrderData) => void;
}

export default function OrderCreateModal({ isOpen, onClose, onSubmit }: OrderCreateModalProps) {
  const [orderData, setOrderData] = useState<OrderData>({
    date: new Date().toISOString().split('T')[0],
    productName: "",
    quantity: "",
    memo: "",
    companyName: "",
    address: "",
    status: "대기중", // 기본값을 '대기중'로 설정
  });

  // 유효성 검사 오류 상태 관리
  const [errors, setErrors] = useState<{
    productName?: string;
    quantity?: string;
    companyName?: string;
    address?: string;
  }>({});

  // 입력값 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // 입력값 업데이트
    setOrderData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // 해당 필드의 오류 메시지 초기화
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // 수량 입력 필드에 숫자와 쉼표만 허용하는 처리
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // 숫자와 쉼표만 허용
    const sanitizedValue = value.replace(/[^0-9,]/g, '');
    
    // 입력값 업데이트
    setOrderData(prev => ({
      ...prev,
      quantity: sanitizedValue
    }));
    
    // 오류 메시지 초기화
    if (errors.quantity) {
      setErrors(prev => ({
        ...prev,
        quantity: undefined
      }));
    }
  };

  // 폼 제출 전 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: {
      productName?: string;
      quantity?: string;
      companyName?: string;
      address?: string;
    } = {};
    
    // 제품명 검사
    if (!orderData.productName) {
      newErrors.productName = "제품을 선택해주세요";
    }
    
    // 수량 검사
    if (!orderData.quantity) {
      newErrors.quantity = "수량을 입력해주세요";
    } else if (!/^[0-9,]+$/.test(orderData.quantity)) {
      newErrors.quantity = "수량은 숫자만 입력 가능합니다";
    }
    
    // 회사명 검사
    if (!orderData.companyName) {
      newErrors.companyName = "회사명을 입력해주세요";
    }
    
    // 주소 검사
    if (!orderData.address) {
      newErrors.address = "주소를 입력해주세요";
    }
    
    // 오류 상태 업데이트
    setErrors(newErrors);
    
    // 오류가 없으면 true 반환
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검사 실행
    if (validateForm()) {
      onSubmit(orderData);
    }
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
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          width: "500px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
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
                name="productName"
                value={orderData.productName}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: errors.productName ? "1px solid #f44336" : "1px solid #bcbcbc",
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
              {errors.productName && (
                <div style={{ color: "#f44336", fontSize: "13px", marginTop: "5px" }}>
                  {errors.productName}
                </div>
              )}
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
                name="quantity"
                value={orderData.quantity}
                onChange={handleQuantityChange}
                placeholder="수량을 입력하세요"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: errors.quantity ? "1px solid #f44336" : "1px solid #bcbcbc",
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
                name="companyName"
                value={orderData.companyName}
                onChange={handleChange}
                placeholder="회사명을 입력하세요"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: errors.companyName ? "1px solid #f44336" : "1px solid #bcbcbc",
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
                  border: errors.address ? "1px solid #f44336" : "1px solid #bcbcbc",
                  borderRadius: "4px",
                  fontSize: "15px",
                }}
                required
              />
              {errors.address && (
                <div style={{ color: "#f44336", fontSize: "13px", marginTop: "5px" }}>
                  {errors.address}
                </div>
              )}
            </div>

            {/* 주문상태 필드 제거 - 기본값은 '대기'로 설정되며 관리자가 주문확인에서 처리 */}

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

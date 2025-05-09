"use client";

import { useState, useEffect, useRef } from "react";

export interface AccountData {
  login: string;
  password: string;
  name: string;
  company: string;
  brn: string;
  phone: string;
  addr: string;
  perm: string;
  level: string;
  linkedProducts?: string[];
}

interface AccountCreateModalProps {
  onClose: () => void;
  onSave: (account: AccountData) => void;
  products: Array<{
    id: string;
    name: string;
  }>;
}

export default function AccountCreateModal({
  onClose,
  onSave,
  products
}: AccountCreateModalProps) {
  const [accountData, setAccountData] = useState<AccountData>({
    login: "",
    password: "",
    name: "",
    company: "",
    brn: "",
    phone: "",
    addr: "",
    perm: "허용",
    level: "일반",
    linkedProducts: [],
  });
  
  // 품목 연결 관리
  const [productSearchTerm, setProductSearchTerm] = useState<string>("");
  
  // 검색어에 따라 필터링된 품목 목록
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

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

  // 품목 연결 처리
  const toggleProductLink = (productId: string) => {
    setAccountData(prev => {
      const currentLinkedProducts = prev.linkedProducts || [];
      const isLinked = currentLinkedProducts.includes(productId);
      
      if (isLinked) {
        // 연결 해제
        return {
          ...prev,
          linkedProducts: currentLinkedProducts.filter(id => id !== productId)
        };
      } else {
        // 연결 추가
        return {
          ...prev,
          linkedProducts: [...currentLinkedProducts, productId]
        };
      }
    });
  };
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // 사업자번호 형식 자동 포맷팅 (xxx-xx-xxxxx)
    if (name === "brn") {
      const digits = value.replace(/\D/g, "");
      let formattedValue = "";
      
      if (digits.length <= 3) {
        formattedValue = digits;
      } else if (digits.length <= 5) {
        formattedValue = `${digits.slice(0, 3)}-${digits.slice(3)}`;
      } else {
        formattedValue = `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 10)}`;
      }
      
      setAccountData({
        ...accountData,
        [name]: formattedValue,
      });
    } 
    // 전화번호 형식 자동 포맷팅 (xxx-xxxx-xxxx)
    else if (name === "phone") {
      const digits = value.replace(/\D/g, "");
      let formattedValue = "";
      
      if (digits.length <= 3) {
        formattedValue = digits;
      } else if (digits.length <= 7) {
        formattedValue = `${digits.slice(0, 3)}-${digits.slice(3)}`;
      } else {
        formattedValue = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
      }
      
      setAccountData({
        ...accountData,
        [name]: formattedValue,
      });
    } else {
      setAccountData({
        ...accountData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(accountData);
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
          width: "550px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
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
          <span>계정 등록</span>
          <span
            onClick={onClose}
            style={{ cursor: "pointer", fontSize: "22px" }}
          >
            ×
          </span>
        </div>

        <div style={{ padding: "20px", overflowY: "auto" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: 500,
                    fontSize: "15px",
                  }}
                >
                  계정 ID
                </label>
                <input
                  type="text"
                  name="login"
                  value={accountData.login}
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

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: 500,
                    fontSize: "15px",
                  }}
                >
                  비밀번호
                </label>
                <input
                  type="password"
                  name="password"
                  value={accountData.password}
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

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: 500,
                    fontSize: "15px",
                  }}
                >
                  이름
                </label>
                <input
                  type="text"
                  name="name"
                  value={accountData.name}
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

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: 500,
                    fontSize: "15px",
                  }}
                >
                  사업자명
                </label>
                <input
                  type="text"
                  name="company"
                  value={accountData.company}
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

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: 500,
                    fontSize: "15px",
                  }}
                >
                  사업자번호
                </label>
                <input
                  type="text"
                  name="brn"
                  value={accountData.brn}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #bcbcbc",
                    borderRadius: "4px",
                    fontSize: "15px",
                  }}
                  placeholder="000-00-00000"
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: 500,
                    fontSize: "15px",
                  }}
                >
                  연락처
                </label>
                <input
                  type="text"
                  name="phone"
                  value={accountData.phone}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #bcbcbc",
                    borderRadius: "4px",
                    fontSize: "15px",
                  }}
                  placeholder="000-0000-0000"
                  required
                />
              </div>

              {/* 담당자 필드 제거 */}
            </div>

            <div style={{ marginTop: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: 500,
                  fontSize: "15px",
                }}
              >
                주소
              </label>
              <input
                type="text"
                name="addr"
                value={accountData.addr}
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "15px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: 500,
                    fontSize: "15px",
                  }}
                >
                  허용여부
                </label>
                <select
                  name="perm"
                  value={accountData.perm}
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
                  <option value="허용">허용</option>
                  <option value="비허용">비허용</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: 500,
                    fontSize: "15px",
                  }}
                >
                  접속권한
                </label>
                <select
                  name="level"
                  value={accountData.level}
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
                  <option value="일반">일반</option>
                  <option value="관리">관리</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: "25px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  fontWeight: 500,
                  fontSize: "15px",
                }}
              >
                연결할 품목
              </label>
              
              <div style={{ marginBottom: "10px" }}>
                <input
                  type="text"
                  placeholder="품목 검색..."
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #bcbcbc",
                    borderRadius: "4px",
                    fontSize: "15px",
                  }}
                />
              </div>
              
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  maxHeight: "200px",
                  overflowY: "auto",
                  marginBottom: "15px",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f5f5f5" }}>
                      <th style={{ padding: "8px 5px", textAlign: "center", width: "40px" }}></th>
                      <th style={{ padding: "8px 5px", textAlign: "left" }}>품목명</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => {
                        const isLinked = accountData.linkedProducts?.includes(product.id) || false;
                        return (
                          <tr key={product.id} style={{ borderTop: "1px solid #eee" }}>
                            <td style={{ padding: "8px 5px", textAlign: "center" }}>
                              <input
                                type="checkbox"
                                checked={isLinked}
                                onChange={() => toggleProductLink(product.id)}
                              />
                            </td>
                            <td style={{ padding: "8px 5px" }}>{product.name}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={2} style={{ padding: "15px 5px", textAlign: "center", color: "#888" }}>
                          {productSearchTerm ? "검색 결과가 없습니다." : "연결할 품목이 없습니다."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "15px",
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
    </div>
  );
}

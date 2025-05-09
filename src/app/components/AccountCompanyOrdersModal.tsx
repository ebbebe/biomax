import React, { useRef, useEffect } from "react";
import { OrderData } from "./OrderCreateModal";

interface AccountCompanyOrdersModalProps {
  companyName: string;
  orders: OrderData[];
  onClose: () => void;
}

export default function AccountCompanyOrdersModal({
  companyName,
  orders,
  onClose,
}: AccountCompanyOrdersModalProps) {
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

  // 해당 회사의 주문만 필터링
  const filteredOrders = orders.filter(
    (order) => order.companyName === companyName
  );

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
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          width: "80%",
          maxWidth: "900px",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ margin: 0, color: "#1a5595" }}>
            {companyName} 주문내역
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: "#666",
            }}
          >
            ✕
          </button>
        </div>

        {filteredOrders.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f4f5f5", color: "#1a5595" }}>
                  <th style={{ padding: "10px", border: "1px solid #bcbcbc" }}>
                    등록일
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #bcbcbc" }}>
                    제품명
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #bcbcbc" }}>
                    수량
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #bcbcbc" }}>
                    메모
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #bcbcbc" }}>
                    등록아이디
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #bcbcbc" }}>
                    주소
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #bcbcbc" }}>
                    주문상태
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} style={{ textAlign: "center" }}>
                    <td style={{ padding: "8px", border: "1px solid #bcbcbc" }}>
                      {order.date}
                    </td>
                    <td style={{ padding: "8px", border: "1px solid #bcbcbc" }}>
                      {order.productName}
                    </td>
                    <td style={{ padding: "8px", border: "1px solid #bcbcbc" }}>
                      {order.quantity}
                    </td>
                    <td style={{ padding: "8px", border: "1px solid #bcbcbc" }}>
                      {order.memo}
                    </td>
                    <td style={{ padding: "8px", border: "1px solid #bcbcbc" }}>
                      {order.userId}
                    </td>
                    <td style={{ padding: "8px", border: "1px solid #bcbcbc" }}>
                      {order.address}
                    </td>
                    <td style={{ padding: "8px", border: "1px solid #bcbcbc" }}>
                      {order.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "30px",
              color: "#666",
              backgroundColor: "#f9f9f9",
              borderRadius: "4px",
            }}
          >
            {companyName}의 주문내역이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

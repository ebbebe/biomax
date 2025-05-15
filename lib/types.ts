// 사용자 상태 타입
export type UserStatus = 'allowed' | 'blocked';

// 사용자 역할 타입
export type UserRole = 'user' | 'admin';

// 사용자 타입
export type User = {
  id: string;
  username: string;
  password: string;
  name: string;
  companyName: string;
  businessNumber: string;
  phone: string;
  address: string;
  productIds: string[];
  status: UserStatus;
  role: UserRole;
  lastLogin: string;
};

// 제품 타입
export type Product = {
  id: string;
  name: string;
  code: string;
  registDate: string;
};

// 주문 상태 타입
export type OrderStatus = '대기' | '완료';

// 주문 항목 타입
export type OrderItem = {
  name: string;
  quantity: number;
};

// 주문 타입
export type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  customerId: string;
  customerName: string;
  items: OrderItem[];
};

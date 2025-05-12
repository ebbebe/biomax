// 공통 타입 정의 파일

export interface ProductData {
  id: string;
  code: string;
  name: string;
  stock: string;
  registrationDate: string;
  linkedCompanies: string[];
}

export interface CompanyData {
  id: string;
  name: string;
}

export interface OrderData {
  id?: string;
  date: string;
  productName: string;
  quantity: string;
  memo: string;
  userId?: string;
  companyName: string;
  address: string;
  status: string;
}

export interface AccountData {
  id?: string;
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

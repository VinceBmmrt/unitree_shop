import { apiClient } from './client';

export interface AdminOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string };
  items: { quantity: number; totalPrice: number }[];
  payments: { status: string }[];
}

export interface AdminProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category: string;
  basePrice: number;
  compareAtPrice?: number;
  requiresQuote: boolean;
  isConfigurable: boolean;
  isFeatured: boolean;
  isActive: boolean;
  shortDescription?: string;
  description?: string;
  leasePriceMonth?: number;
  images?: { url: string; altText?: string; isPrimary?: boolean; sortOrder?: number }[];
  tags?: { tag: string }[];
}

export async function adminGetOrders(
  page = 1,
  status?: string,
): Promise<{ data: AdminOrder[]; meta: { total: number } }> {
  const res = await apiClient.get('/orders/admin/all', { params: { page, limit: 20, status } });
  return res.data.data;
}

export async function adminUpdateOrderStatus(id: string, status: string): Promise<void> {
  await apiClient.patch(`/orders/admin/${id}/status`, { status });
}

export async function adminGetProducts(
  page = 1,
): Promise<{ data: AdminProduct[]; meta: { total: number } }> {
  const res = await apiClient.get('/products', { params: { page, limit: 50 } });
  return res.data.data;
}

export interface ProductPayload {
  sku?: string;
  name?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  category?: string;
  basePrice?: number;
  compareAtPrice?: number;
  leasePriceMonth?: number;
  requiresQuote?: boolean;
  isConfigurable?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  images?: { url: string; altText?: string; isPrimary?: boolean; sortOrder?: number }[];
  tags?: string[];
}

export async function adminCreateProduct(data: ProductPayload): Promise<AdminProduct> {
  const res = await apiClient.post('/products', data);
  return res.data.data;
}

export async function adminUpdateProduct(id: string, data: ProductPayload): Promise<AdminProduct> {
  const res = await apiClient.patch(`/products/${id}`, data);
  return res.data.data;
}

// ── Quotes ────────────────────────────────────────────────────────────────────

export interface AdminQuote {
  id: string;
  quoteNumber: string;
  status: string;
  currency: string;
  subtotal: number;
  discount: number;
  taxTotal: number;
  total: number;
  validUntil: string;
  notes?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  salesRep?: { id: string; firstName: string; lastName: string; email: string };
  items: {
    id: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    totalPrice: number;
    notes?: string;
    product: {
      id: string;
      name: string;
      sku: string;
      images: { url: string; isPrimary: boolean }[];
    };
  }[];
  orders: { id: string; orderNumber: string; status: string }[];
}

export async function adminGetQuotes(
  page = 1,
  status?: string,
  search?: string,
): Promise<{ data: AdminQuote[]; meta: { total: number; totalPages: number } }> {
  const res = await apiClient.get('/quotes', { params: { page, limit: 50, status, search } });
  return res.data.data;
}

export async function adminGetQuote(id: string): Promise<AdminQuote> {
  const res = await apiClient.get(`/quotes/${id}`);
  return res.data.data;
}

export interface QuoteUpdatePayload {
  status?: string;
  notes?: string;
  internalNotes?: string;
  discount?: number;
  validUntil?: string;
}

export async function adminUpdateQuote(id: string, data: QuoteUpdatePayload): Promise<void> {
  await apiClient.patch(`/quotes/${id}`, data);
}

export async function adminConvertQuote(id: string): Promise<{ orderNumber: string }> {
  const res = await apiClient.post(`/quotes/${id}/convert`);
  return res.data.data;
}

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

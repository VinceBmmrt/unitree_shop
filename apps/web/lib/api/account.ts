import { apiClient } from './client';

export interface OrderItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: { name: string; images?: { url: string }[] };
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  taxTotal: number;
  shippingTotal: number;
  total: number;
  currency: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress?: {
    firstName: string;
    lastName: string;
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  payments?: { status: string; method: string; invoiceUrl?: string }[];
  shipments?: { trackingNumber?: string; carrier?: string; status: string }[];
}

export interface Quote {
  id: string;
  quoteNumber: string;
  status: string;
  totalHT: number;
  totalTTC: number;
  validUntil?: string;
  createdAt: string;
  items?: { name: string; quantity: number; unitPrice: number }[];
  product?: { name: string };
}

export async function getOrders(page = 1): Promise<{ data: Order[]; meta: { total: number } }> {
  const res = await apiClient.get('/orders', { params: { page, limit: 20 } });
  return res.data.data;
}

export async function getOrder(id: string): Promise<Order> {
  const res = await apiClient.get(`/orders/${id}`);
  return res.data.data;
}

export async function cancelOrder(id: string): Promise<void> {
  await apiClient.delete(`/orders/${id}`);
}

export async function getQuotes(page = 1): Promise<{ data: Quote[]; meta: { total: number } }> {
  const res = await apiClient.get('/quotes/my', { params: { page, limit: 20 } });
  return res.data.data;
}

export async function getQuote(id: string): Promise<Quote> {
  const res = await apiClient.get(`/quotes/my/${id}`);
  return res.data.data;
}

export async function acceptQuote(id: string): Promise<void> {
  await apiClient.post(`/quotes/my/${id}/accept`);
}

export async function rejectQuote(id: string, reason?: string): Promise<void> {
  await apiClient.post(`/quotes/my/${id}/reject`, { reason });
}

export async function updateProfile(data: {
  firstName?: string;
  lastName?: string;
  phone?: string;
}): Promise<void> {
  await apiClient.patch('/users/me', data);
}

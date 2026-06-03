import { apiClient } from './client';
import type { Address } from '@unitree/types';

export interface CreateAddressInput {
  label?: string;
  firstName: string;
  lastName: string;
  company?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface CreateOrderInput {
  items: Array<{
    productId: string;
    variantId?: string;
    configurationId?: string;
    quantity: number;
  }>;
  shippingAddressId: string;
  billingAddressId?: string;
  couponCode?: string;
  customerNotes?: string;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  subtotal: number;
  taxTotal: number;
  shippingTotal: number;
  total: number;
}

export async function createAddress(data: CreateAddressInput): Promise<Address> {
  const res = await apiClient.post('/users/me/addresses', data);
  return res.data.data;
}

export async function createOrder(payload: CreateOrderInput): Promise<OrderSummary> {
  const res = await apiClient.post('/orders', payload);
  return res.data.data;
}

export async function createPaymentIntent(orderId: string): Promise<{ clientSecret: string }> {
  const res = await apiClient.post(`/payments/orders/${orderId}/intent`, {});
  return res.data.data;
}

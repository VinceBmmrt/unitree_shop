export enum ProductCategory {
  HUMANOID_ROBOT = 'HUMANOID_ROBOT',
  QUADRUPED_ROBOT = 'QUADRUPED_ROBOT',
  ROBOTIC_ARM = 'ROBOTIC_ARM',
  ACCESSORY = 'ACCESSORY',
  SPARE_PART = 'SPARE_PART',
  SOFTWARE_SUBSCRIPTION = 'SOFTWARE_SUBSCRIPTION',
  SERVICE_PLAN = 'SERVICE_PLAN',
  PERIPHERAL = 'PERIPHERAL',
}

export interface ProductImage {
  id?: string;
  url: string;
  altText?: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface ProductTag {
  tag: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  category: ProductCategory | string;
  basePrice: number;
  compareAtPrice?: number;
  leasePriceMonth?: number;
  requiresQuote: boolean;
  isConfigurable: boolean;
  isFeatured?: boolean;
  inStock?: boolean;
  images?: ProductImage[];
  tags?: ProductTag[];
  options?: ProductOption[];
  modelUrl?: string;
  modelFormat?: string;
}

export interface ProductOption {
  id: string;
  name: string;
  choices: ProductConfigChoice[];
}

export interface ProductConfigChoice {
  id: string;
  label: string;
  value: string;
  priceDelta: number;
  isDefault: boolean;
}

export interface Review {
  id: string;
  rating: number;
  title?: string;
  body?: string;
  createdAt: string | Date;
  verified?: boolean;
  authorName?: string;
  user?: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

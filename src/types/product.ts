export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  quantity: number;
}

export interface CreateProductInput {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  quantity: number;
}

export interface UpdateProductInput {
  id: string;
  name?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
  quantity?: number;
}

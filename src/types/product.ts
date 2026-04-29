export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

export interface CreateProductInput {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

export interface UpdateProductInput {
  id: number;
  name?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
}

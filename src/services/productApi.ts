import { graphqlClient } from "./graphql";
import type { Product, CreateProductInput, UpdateProductInput } from "../types/product";

export const productAPI = {
  // Get all products
  getProducts: async (): Promise<Product[]> => {
    const query = `
      query GetProducts {
        getAllProducts {
          id
          name
          price
          description
          image
          quantity
        }
      }
    `;
    // console.log(graphqlClient.requestConfig, "config");
    const response = await graphqlClient.request<{ getAllProducts: Product[] }>(query);
    return response.getAllProducts;
  },

  // Get single product
  getProduct: async (id: string): Promise<Product> => {
    const query = `
      query GetProduct($id: String!) {
        product(id: $id) {
          id
          name
          price
          description
          image
          quantity
        }
      }
    `;

    const response = await graphqlClient.request<{ product: Product }>(query, { id });
    return response.product;
  },

  // Create product
  createProduct: async (input: CreateProductInput): Promise<Product> => {
    const mutation = `
  mutation CreateProduct($name: String!, $price: Float!, $description: String!, $image: String!, $quantity: Int!) {
    createProduct(name: $name, price: $price, description: $description, image: $image, quantity: $quantity) {
      id
      name
      price
      description
      image
      quantity
    }
  }
`;
    // console.log(graphqlClient.requestConfig, "config");
    // console.log("imgUrl", input.imageUrl);
    const response = await graphqlClient.request<{ createProduct: Product }>(mutation, {
      name: input.name,
      price: input.price,
      description: input.description,
      image: input.imageUrl,
      quantity: input.quantity,
    });
    return response.createProduct;
  },
  // Update product
  updateProduct: async (input: UpdateProductInput): Promise<Product> => {
    const mutation = `
      mutation UpdateProduct($id:String!, $input: UpdateProductInput!) {
        updateProduct(id:$id, input: $input) {
          id
          name
          price
          description
          image
          quantity
        }
      }
    `;

    const response = await graphqlClient.request<{ updateProduct: Product }>(mutation, {
      id: input.id,
      input: {
        name: input.name,
        price: input.price,
        description: input.description,
        image: input.imageUrl,
        quantity: input.quantity,
      },
    });
    return response.updateProduct;
  },

  // Delete product
  deleteProduct: async (id: string): Promise<boolean> => {
    const mutation = `
      mutation DeleteProduct($id: String!) {
        deleteProduct(id: $id)
      }
    `;

    const response = await graphqlClient.request<{ deleteProduct: boolean }>(mutation, { id });
    return response.deleteProduct;
  },
};

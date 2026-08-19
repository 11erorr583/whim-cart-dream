import { PRODUCTS } from "@/data/products";
import type { Product, SellerProduct } from "@/types/shopping";

/**
 * Runtime registry that merges the static mock catalog with fictional products
 * uploaded by "sellers". A FastAPI backend can later replace this module with
 * GET /api/products (which would already return both sets merged).
 */

let sellerProducts: SellerProduct[] = [];

export const setSellerProducts = (products: SellerProduct[]): void => {
  sellerProducts = products;
};

export const getSellerProducts = (): SellerProduct[] => sellerProducts;

export const allProducts = (): Product[] => [...sellerProducts, ...PRODUCTS];

export const resolveProduct = (id: string): Product | undefined =>
  allProducts().find((p) => p.id === id);

export const isSellerProduct = (product: Product): product is SellerProduct =>
  (product as SellerProduct).submittedBySeller === true;

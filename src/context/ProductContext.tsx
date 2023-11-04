import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';


type ProductType = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;

};

interface ProductContextType {
    products: ProductType[];
    error: string | null;
    totalPages: number;
    currentPage: number;
    fetchProducts: (page?: number, limit?: number) => Promise<void>;
    fetchProductById: (id: string) => Promise<ProductType | null>;
    createProduct: (productData: ProductType) => Promise<void>;
    updateProduct: (id: string, productData: ProductType) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
  }
  
  

const ProductContext = createContext<ProductContextType | null>(null);
  
  
export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
      throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
  };

  export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { user, isAdmin } = useUser(); 



  // Fetch products with pagination
  const fetchProducts = async (page = 1, limit = 10) => {
    try {
      const res = await fetch(`/api/products?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error('Failed to fetch products');

      const { data, totalPages: total, currentPage: current } = await res.json();
      setProducts(data);
      setTotalPages(total);
      setCurrentPage(current);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch a single product by ID
  const fetchProductById = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error('Product not found');

      const product = await res.json();
      return product;
    } catch (err) {
      setError(err.message);
    }
  };

  // Create a new product
  const createProduct = async (productData) => {
   if (!isAdmin) { // Checking if the user is an admin before allowing the creation
      setError('Only admins can create a new product.');
      return;
    }
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      if (!res.ok) throw new Error('Failed to create product');

      const newProduct = await res.json();
      setProducts([...products, newProduct]);
    } catch (err) {
      setError(err.message);
    }
  };

  // Update an existing product
  const updateProduct = async (id, productData) => {
    if (!isAdmin) { // Checking if the user is an admin before allowing the creation
        setError('Only admins can create a new product.');
        return;
      }
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      if (!res.ok) throw new Error('Failed to update product');

      const updatedProduct = await res.json();
      setProducts(products.map((p) => (p.id === id ? updatedProduct : p)));
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete a product from the database
  const deleteProduct = async (id) => {
    if (!isAdmin) { // Checking if the user is an admin before allowing the creation
        setError('Only admins can create a new product.');
        return;
      }
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete product');

      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const value = {
    products,
    error,
    totalPages,
    currentPage,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};



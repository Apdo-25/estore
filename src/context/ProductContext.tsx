import React, { createContext, useContext, useState, useCallback,useMemo  } from 'react';
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
    const [state, setState] = useState({
      products: [],
      error: null,
      totalPages: 0,
      currentPage: 1,
    });
    const { isAdmin } = useUser();


  // Helper functions to update state
  const setError = (error) => setState((prevState) => ({ ...prevState, error }));
  const setProducts = (products) => setState((prevState) => ({ ...prevState, products }));
  const setTotalPages = (totalPages) => setState((prevState) => ({ ...prevState, totalPages }));
  const setCurrentPage = (currentPage) => setState((prevState) => ({ ...prevState, currentPage }));

  // Fetch products with pagination
  const fetchProducts = useCallback(async (page = 1, limit = 10) => {
    setError(null);
    try {
      const res = await fetch(`/api/products?page=${page}&limit=${limit}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch products');
      }
  
      const { data, totalPages: total } = await res.json();
      setState(prevState => ({
        ...prevState,
        products: data,
        totalPages: total,
        currentPage: page // Set the page from the parameter, not the response
      }));
    } catch (err) {
      setError(err.message);
    }
  }, []);
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
    if (!isAdmin) {
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
      setProducts([...state.products, newProduct]); // Changed products to state.products
    } catch (err) {
      setError(err.message);
    }
  };

  // Update an existing product
  const updateProduct = async (id, productData) => {
    if (!isAdmin) {
      setError('Only admins can update a product.');
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
      setProducts(state.products.map((p) => (p.id === id ? updatedProduct : p))); // Changed products to state.products
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete a product from the database
  const deleteProduct = async (id) => {
    if (!isAdmin) {
      setError('Only admins can delete a product.');
      return;
    }
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete product');
  
      setProducts(state.products.filter((p) => p.id !== id)); // Changed products to state.products
    } catch (err) {
      setError(err.message);
    }
  };

 const contextValue = useMemo(() => ({
    ...state,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [state, isAdmin]); 
  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};



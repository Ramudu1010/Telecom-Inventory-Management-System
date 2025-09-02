import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Items from './components/Items';
import Suppliers from './components/Suppliers';
import Products from './components/Products';
import OrderedProducts from './components/OrderedProducts';
import PendingProducts from './components/PendingProducts';
import ProtectedLayout from './components/ProtectedLayout';
import LowStockItems from './components/LowStockItems';
import FullStockItems from './components/FullStockItems';

function App() {
  const [token, setToken] = React.useState(localStorage.getItem('token'));
  const [inventory, setInventory] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orderedProducts, setOrderedProducts] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);

  const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  useEffect(() => {
    if (token) {
      fetchInventory();
      fetchSuppliers();
      fetchProducts();
      fetchOrderedProducts();
      fetchPendingProducts();
    }
  }, [token]);

  const fetchInventory = async () => {
    try {
      const response = await api.get('/inventory');
      setInventory(response.data);
    } catch (error) {
      toast.error('Failed to fetch inventory');
      console.error('Failed to fetch inventory', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      toast.error('Failed to fetch suppliers');
      console.error('Failed to fetch suppliers', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error('Failed to fetch products', error);
    }
  };

  const fetchOrderedProducts = async () => {
    try {
      const response = await api.get('/ordered-products');
      setOrderedProducts(response.data);
    } catch (error) {
      toast.error('Failed to fetch ordered products');
      console.error('Failed to fetch ordered products', error);
    }
  };

  const fetchPendingProducts = async () => {
    try {
      const response = await api.get('/pending-products');
      setPendingProducts(response.data);
    } catch (error) {
      toast.error('Failed to fetch pending products');
      console.error('Failed to fetch pending products', error);
    }
  };

  const saveToken = (userToken) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  };

  const handleAddItem = async (item) => {
    try {
      const response = await api.post('/inventory', item);
      setInventory([...inventory, response.data]);
      toast.success('Item added successfully!');
    } catch (error) {
      toast.error('Failed to add item');
      console.error('Failed to add item', error);
    }
  };

  const handleEditItem = async (item) => {
    try {
      const response = await api.put(`/inventory/${item.id}`, item);
      setInventory(inventory.map(i => i.id === item.id ? response.data : i));
      toast.success('Item updated successfully!');
    } catch (error) {
      toast.error('Failed to edit item');
      console.error('Failed to edit item', error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await api.delete(`/inventory/${id}`);
      setInventory(inventory.filter(i => i.id !== id));
      toast.success('Item deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete item');
      console.error('Failed to delete item', error);
    }
  };

  const handleAddSupplier = async (supplier) => {
    try {
      const response = await api.post('/suppliers', supplier);
      setSuppliers([...suppliers, response.data]);
      toast.success('Supplier added successfully!');
    } catch (error) {
      toast.error('Failed to add supplier');
      console.error('Failed to add supplier', error);
    }
  };

  const handleEditSupplier = async (supplier) => {
    try {
      const response = await api.put(`/suppliers/${supplier.id}`, supplier);
      setSuppliers(suppliers.map(s => s.id === supplier.id ? response.data : s));
      toast.success('Supplier updated successfully!');
    } catch (error) {
      toast.error('Failed to edit supplier');
      console.error('Failed to edit supplier', error);
    }
  };

  const handleDeleteSupplier = async (id) => {
    try {
      await api.delete(`/suppliers/${id}`);
      setSuppliers(suppliers.filter(s => s.id !== id));
      toast.success('Supplier deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete supplier');
      console.error('Failed to delete supplier', error);
    }
  };

  const handleAddProduct = async (product) => {
    try {
      const response = await api.post('/products', product);
      setProducts([...products, response.data]);
      toast.success('Product added successfully!');
    } catch (error) {
      toast.error('Failed to add product');
      console.error('Failed to add product', error);
    }
  };

  const handleEditProduct = async (product) => {
    try {
      const response = await api.put(`/products/${product.id}`, product);
      setProducts(products.map(p => p.id === product.id ? response.data : p));
      toast.success('Product updated successfully!');
    } catch (error) {
      toast.error('Failed to edit product');
      console.error('Failed to edit product', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
      toast.success('Product deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete product');
      console.error('Failed to delete product', error);
    }
  };

  const handleAddOrderedProduct = async (product) => {
    try {
      const response = await api.post('/ordered-products', product);
      setOrderedProducts([...orderedProducts, response.data]);
      toast.success('Ordered product added successfully!');
    } catch (error) {
      toast.error('Failed to add ordered product');
      console.error('Failed to add ordered product', error);
    }
  };

  const handleEditOrderedProduct = async (product) => {
    try {
      const response = await api.put(`/ordered-products/${product.id}`, product);
      setOrderedProducts(orderedProducts.map(p => p.id === product.id ? response.data : p));
      toast.success('Ordered product updated successfully!');
    } catch (error) {
      toast.error('Failed to edit ordered product');
      console.error('Failed to edit ordered product', error);
    }
  };

  const handleDeleteOrderedProduct = async (id) => {
    try {
      await api.delete(`/ordered-products/${id}`);
      setOrderedProducts(orderedProducts.filter(p => p.id !== id));
      toast.success('Ordered product deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete ordered product');
      console.error('Failed to delete ordered product', error);
    }
  };

  const handleAddPendingProduct = async (product) => {
    try {
      const response = await api.post('/pending-products', product);
      setPendingProducts([...pendingProducts, response.data]);
      toast.success('Pending product added successfully!');
    } catch (error) {
      toast.error('Failed to add pending product');
      console.error('Failed to add pending product', error);
    }
  };

  const handleEditPendingProduct = async (product) => {
    try {
      const response = await api.put(`/pending-products/${product.id}`, product);
      setPendingProducts(pendingProducts.map(p => p.id === product.id ? response.data : p));
      toast.success('Pending product updated successfully!');
    } catch (error) {
      toast.error('Failed to edit pending product');
      console.error('Failed to edit pending product', error);
    }
  };

  const handleDeletePendingProduct = async (id) => {
    try {
      await api.delete(`/pending-products/${id}`);
      setPendingProducts(pendingProducts.filter(p => p.id !== id));
      toast.success('Pending product deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete pending product');
      console.error('Failed to delete pending product', error);
    }
  };

  const handleOrderItem = async (item) => {
    const orderedProduct = {
      orderId: orderedProducts.length + 1,
      productName: item.name,
      quantity: 1, // Default quantity to 1
      status: 'Processing'
    };
    await handleAddOrderedProduct(orderedProduct);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/login" element={<Login setToken={saveToken} />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute><ProtectedLayout /></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard 
            inventory={inventory} 
            suppliers={suppliers} 
            products={products}
            orderedProducts={orderedProducts}
            pendingProducts={pendingProducts}
            handleAddItem={handleAddItem} 
            handleEditItem={handleEditItem} 
            handleDeleteItem={handleDeleteItem} 
            handleAddSupplier={handleAddSupplier}
            handleEditSupplier={handleEditSupplier}
            handleDeleteSupplier={handleDeleteSupplier}
            handleAddProduct={handleAddProduct}
            handleEditProduct={handleEditProduct}
            handleDeleteProduct={handleDeleteProduct}
            handleAddOrderedProduct={handleAddOrderedProduct}
            handleEditOrderedProduct={handleEditOrderedProduct}
            handleDeleteOrderedProduct={handleDeleteOrderedProduct}
            handleAddPendingProduct={handleAddPendingProduct}
            handleEditPendingProduct={handleEditPendingProduct}
            handleDeletePendingProduct={handleDeletePendingProduct}
            handleOrderItem={handleOrderItem}
            handleLogout={handleLogout}
          />} />
          <Route path="/items" element={<Items inventory={inventory} />} />
          <Route path="/suppliers" element={<Suppliers suppliers={suppliers} />} />
          <Route path="/products" element={<Products products={products} />} />
          <Route path="/ordered-products" element={<OrderedProducts orderedProducts={orderedProducts} />} />
          <Route path="/pending-products" element={<PendingProducts pendingProducts={pendingProducts} />} />
          <Route path="/low-stock-items" element={<LowStockItems handleEditItem={handleEditItem} handleDeleteItem={handleDeleteItem} handleOrderItem={handleOrderItem} />} />
          <Route path="/full-stock-items" element={<FullStockItems handleEditItem={handleEditItem} handleDeleteItem={handleDeleteItem} handleOrderItem={handleOrderItem} />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

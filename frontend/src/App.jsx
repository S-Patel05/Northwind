
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
import PageLoader from "./components/PageLoader";
import { useAuth } from '@clerk/react';
import Layout from './components/Layout';
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import { Routes, Route, Navigate } from "react-router";

function App() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <PageLoader />;
   return (
 <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route
          path="/orders"
          element={isSignedIn ? <OrdersPage /> : <Navigate to={"/"} replace />}
        />
      </Routes>
    </Layout>
  )  
}

export default App

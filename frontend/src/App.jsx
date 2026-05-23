
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
import PageLoader from "./components/PageLoader";
import { useAuth } from '@clerk/react';
import Layout from './components/Layout';
import HomePage from "./pages/HomePage";
import { Routes, Route, Navigate } from "react-router";

function App() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <PageLoader />;
   return (
 <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Layout>
  )  
}

export default App

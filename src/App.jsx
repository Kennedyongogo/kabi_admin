import { useCallback, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { USER_DIRECTORY_ROLES, clearSession, loadSession, saveSession } from "./auth.js";
import AppShell from "./layout/AppShell.jsx";
import Login from "./pages/Login/Login.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import ShopEditor from "./pages/ShopEditor.jsx";
import Products from "./pages/Products.jsx";
import ProductEditor from "./pages/ProductEditor.jsx";
import Orders from "./pages/Orders.jsx";
import Users from "./pages/Users.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
  const [session, setSession] = useState(loadSession);

  const handleLogin = useCallback((next) => {
    saveSession(next);
    setSession(next);
  }, []);

  const handleSignOut = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const handleUserUpdate = useCallback((user) => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = { ...prev, user };
      saveSession(next);
      return next;
    });
  }, []);

  const ownerOnly = (element, fallback) =>
    session?.user.role === "shop_owner" ? element : <Navigate to={fallback} replace />;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={session ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />}
        />
        <Route
          element={
            session ? (
              <AppShell session={session} onSignOut={handleSignOut} onUserUpdate={handleUserUpdate} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="shop/new" element={ownerOnly(<ShopEditor />, "/shop")} />
          <Route path="shop/edit" element={ownerOnly(<ShopEditor />, "/shop")} />
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={ownerOnly(<ProductEditor />, "/products")} />
          <Route path="products/:productId/edit" element={ownerOnly(<ProductEditor />, "/products")} />
          <Route path="orders" element={<Orders />} />
          <Route
            path="users"
            element={USER_DIRECTORY_ROLES.includes(session?.user.role) ? <Users /> : <Navigate to="/" replace />}
          />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

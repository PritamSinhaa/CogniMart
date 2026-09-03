import React from "react";

import ReactDOM from "react-dom/client";

import { RouterProvider } from "react-router-dom";

import router from "./routes/router";

import ErrorBoundary from "./components/common/ErrorBoundary";

import { AuthProvider } from "./context/AuthContext";

import { CartProvider } from "./context/CartContext";

import { WishlistProvider } from "./context/WishlistContext";

import { AddressProvider } from "./context/AddressContext";

import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element was not found.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <AddressProvider>
            <WishlistProvider>
              <RouterProvider router={router} />
            </WishlistProvider>
          </AddressProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);

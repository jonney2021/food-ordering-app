"use client";

import { set } from "mongoose";
import { SessionProvider } from "next-auth/react";
import { createContext, useEffect, useState } from "react";

export const CartContext = createContext({});

const AppProvider = ({ children }) => {
  const [cartProducts, setCartProducts] = useState([]);

  const ls = typeof window !== "undefined" ? window.localStorage : null;

  useEffect(() => {
    if (ls) {
      const savedCart = ls.getItem("cart");
      if (savedCart) {
        setCartProducts(JSON.parse(savedCart));
      }
    }
  }, []);

  const clearCart = () => {
    setCartProducts([]);
    saveCartProductsToLocalStorage([]);
  };

  const removeCartProduct = (index) => {
    setCartProducts((prevProducts) => {
      const newProducts = prevProducts.filter((_, i) => i !== index);
      saveCartProductsToLocalStorage(newProducts);
      return newProducts;
    });
  };

  const saveCartProductsToLocalStorage = (cartProducts) => {
    if (ls) {
      ls.setItem("cart", JSON.stringify(cartProducts));
    }
  };

  const addToCart = (product, size = null, extras = []) => {
    setCartProducts((prevProducts) => {
      const cartProduct = { ...product, size, extras };
      const newProducts = [...prevProducts, cartProduct];
      saveCartProductsToLocalStorage(newProducts);
      return newProducts;
    });
  };
  return (
    <SessionProvider>
      <CartContext.Provider
        value={{
          cartProducts,
          setCartProducts,
          addToCart,
          removeCartProduct,
          clearCart,
        }}
      >
        {children}
      </CartContext.Provider>
    </SessionProvider>
  );
};
export default AppProvider;

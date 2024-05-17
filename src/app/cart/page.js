"use client";

import { CartContext, cartProductPrice } from "@/components/AppContext";
import useProfile from "@/components/UseProfile";
import Trash from "@/components/icons/Trash";
import AddressInputs from "@/components/layout/AddressInputs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import CartProduct from "@/components/menu/CartProduct";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const CartPage = () => {
  const { cartProducts, removeCartProduct } = useContext(CartContext);
  const [address, setAddress] = useState({});
  const { data: profileData } = useProfile();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.href.includes("canceled")) {
        toast.error("Payment failed ");
      }
    }
  }, []);

  useEffect(() => {
    if (profileData?.city) {
      const { phone, street, city, postalCode, country } = profileData;
      const addressFromProfile = { phone, street, city, postalCode, country };
      setAddress(addressFromProfile);
    }
  }, [profileData]);
  let subtotal = 0;
  for (const p of cartProducts) {
    subtotal += cartProductPrice(p);
  }

  const handleAddressChange = (propName, value) => {
    setAddress((prev) => ({ ...prev, [propName]: value }));
  };

  const proceedToCheckout = async (e) => {
    e.preventDefault();
    // address and shopping cart products
    const promise = new Promise((resolve, reject) => {
      fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address, cartProducts }),
      }).then(async (response) => {
        if (response.ok) {
          resolve();
          // redirect to stripe
          window.location = await response.json();
        } else {
          reject();
        }
      });
    });

    toast.promise(promise, {
      loading: "Processing...",
      success: "Redirecting to payment...",
      error: "An error occurred",
    });
  };

  if (cartProducts?.length === 0) {
    return (
      <section className="mt-8 text-center">
        <SectionHeaders mainHeader="Cart" />
        <p className="mt-4">Your shopping cart is empty.</p>
      </section>
    );
  }
  return (
    <section className="mt-8">
      <div className="text-center">
        <SectionHeaders mainHeader="Cart" />
      </div>
      <div className="mt-8 grid gap-8 grid-cols-2">
        <div>
          {cartProducts?.length === 0 && (
            <div No products in your shopping cart></div>
          )}
          {cartProducts?.length > 0 &&
            cartProducts.map((product, index) => (
              <CartProduct
                product={product}
                onRemove={removeCartProduct}
                key={index}
              />
            ))}
          <div className="py-2 pr-16 flex justify-end items-center">
            <div className="text-gray-500">
              Subtotal:
              <br />
              Delivery:
              <br />
              Total:
            </div>
            <div className="font-semibold pl-2 text-right">
              ${subtotal.toFixed(2)}
              <br />
              $5.00
              <br />${(subtotal + 5.0).toFixed(2)}
            </div>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2>Checkout</h2>
          <form onSubmit={proceedToCheckout}>
            <AddressInputs
              addressProps={address}
              setAddressProps={handleAddressChange}
            />
            <button type="submit">Pay ${(subtotal + 5).toFixed(2)}</button>
          </form>
        </div>
      </div>
    </section>
  );
};
export default CartPage;

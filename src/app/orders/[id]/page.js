"use client";

import { CartContext, cartProductPrice } from "@/AppContext";
import AddressInputs from "@/components/layout/AddressInputs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import CartProduct from "@/components/menu/CartProduct";
import { set } from "mongoose";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const OrderPage = () => {
  const { clearCart } = useContext(CartContext);
  const [order, setOrder] = useState();
  const { id } = useParams();
  const [loadingOrder, setLoadingOrder] = useState(true);
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.href.includes("clear-cart=1")) {
        clearCart();
      }
    }
    if (id) {
      setLoadingOrder(true);
      fetch("/api/orders?_id=" + id).then((res) => {
        res.json().then((orderData) => {
          setOrder(orderData);
          setLoadingOrder(false);
        });
      });
    }
  }, []);

  let subtotal = 0;
  if (order?.cartProducts) {
    for (const p of order?.cartProducts) {
      subtotal += cartProductPrice(p);
    }
  }
  return (
    <section className="max-w-2xl mx-auto text-center mt-8">
      <div className="text-center">
        <SectionHeaders mainHeader="Your order"></SectionHeaders>
        <div className="mt-4 mb-8">
          <p>Thanks for your order</p>
          <p>We will call you when your order will be on the way.</p>
        </div>
      </div>
      {loadingOrder && <div>Loading order...</div>}
      {order && (
        <div className="grid md:grid-cols-2 md:gap-16">
          <div>
            {order.cartProducts.map((product) => (
              <CartProduct product={product} key={product._id} />
            ))}
            <div className="text-right py-2 text-gray-500">
              Subtotal:{" "}
              <span className="text-black font-bold inline-block w-8">
                ${subtotal}
              </span>
              <br />
              Delivery:{" "}
              <span className="text-black font-bold inline-block w-8">$5</span>
              <br />
              Total:{" "}
              <span className="text-black font-bold inline-block w-8">
                ${subtotal + 5}
              </span>
              <br />
            </div>
          </div>
          <div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <AddressInputs disabled={true} addressProps={order} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
export default OrderPage;

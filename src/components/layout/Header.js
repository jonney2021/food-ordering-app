"use client";
import { signOut, useSession } from "next-auth/react";

import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "../AppContext";
import ShoppingCart from "../icons/ShoppingCart";

const Header = () => {
  const session = useSession();
  console.log(session);
  const { cartProducts } = useContext(CartContext);
  const status = session?.status;
  const userData = session.data?.user;
  let userName = userData?.name || userData?.email;
  if (userName && userName.includes(" ")) {
    userName = userName.split(" ")[0];
  }
  return (
    <header className="flex items-center justify-between">
      <nav className="flex gap-8 items-center text-gray-500 font-semibold">
        <Link className="text-primary font-semibold text-2xl" href="/">
          EJ PIZZA
        </Link>
        <Link href={"/"}>Home</Link>
        <Link href={"/menu"}>Menu</Link>
        <Link href={"/#about"}>About</Link>
        <Link href={"/#contact"}>Contact</Link>
      </nav>
      <nav className="flex gap-4 items-center text-gray-500 font-semibold">
        {status === "authenticated" && (
          <>
            <Link href={"/profile"} className="whitespace-nowrap">
              Hello, {userName}
            </Link>
            <button
              onClick={() => signOut()}
              className="bg-primary rounded-full text-white px-8 py-2"
            >
              Logout
            </button>
          </>
        )}

        {status === "unauthenticated" && (
          <>
            <Link href={"/login"}>Login</Link>
            <Link
              href={"/register"}
              className="bg-primary rounded-full text-white px-8 py-2"
            >
              Register
            </Link>
          </>
        )}

        <Link href="/cart" className="relative">
          <ShoppingCart />
          <span className="absolute -top-2 -right-4 bg-primary text-white text-sm py-1 px-2 rounded-full leading-3">
            {cartProducts.length}
          </span>
        </Link>
      </nav>
    </header>
  );
};
export default Header;

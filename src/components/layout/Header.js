"use client";
import { signOut, useSession } from "next-auth/react";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/AppContext";
import ShoppingCart from "@/components/icons/ShoppingCart";
import Bars3 from "@/components/icons/Bars3";

const Header = () => {
  // const session = useSession();
  // console.log("Session: ", session);
  // const { cartProducts } = useContext(CartContext);
  // const [mobileNavOpen, setMobileNavOpen] = useState(false);
  // const status = session?.status;
  // const userData = session.data?.user;
  // let userName = userData?.name || userData?.email;
  // if (userName && userName.includes(" ")) {
  //   userName = userName.split(" ")[0];
  // }

  // console.log("Username:", userName);

  const { data: session, status } = useSession();
  // console.log("Session: ", session);
  const { cartProducts } = useContext(CartContext);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // console.log("Session data in Header component: ", session);
    if (session?.user) {
      setUserName(session.user.name?.split(" ")[0] || session.user.email);
      // setUserName(session.user.email);
    }
  }, [session]);

  const AuthLinks = ({ status, userName }) => {
    if (status === "authenticated") {
      return (
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
      );
    }
    if (status === "unauthenticated") {
      return (
        <>
          <Link href={"/login"}>Login</Link>
          <Link
            href={"/register"}
            className="bg-primary rounded-full text-white px-8 py-2"
          >
            Register
          </Link>
        </>
      );
    }
  };

  return (
    <header>
      <div className="flex items-center md:hidden justify-between">
        <Link className="text-primary font-semibold text-2xl" href="/">
          EJ PIZZA
        </Link>

        <div className="flex items-center gap-8">
          <Link href="/cart" className="relative">
            <ShoppingCart />
            {cartProducts?.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-primary text-white text-sm py-1 px-2 rounded-full leading-3">
                {cartProducts.length}
              </span>
            )}
          </Link>
          <button
            className="p-1"
            onClick={() => {
              setMobileNavOpen((prev) => !prev);
            }}
          >
            <Bars3 />
          </button>
        </div>
      </div>
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="md:hidden p-4 bg-gray-200 rounded-lg mt-2 flex flex-col gap-2 text-center"
        >
          <Link href={"/"}>Home</Link>
          <Link href={"/menu"}>Menu</Link>
          <Link href={"/#about"}>About</Link>
          <Link href={"/#contact"}>Contact</Link>
          <AuthLinks status={status} userName={userName} />
        </div>
      )}

      <div className="hidden md:flex items-center justify-between">
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
          <AuthLinks status={status} userName={userName} />
          <Link href="/cart" className="relative">
            <ShoppingCart />
            {cartProducts?.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-primary text-white text-sm py-1 px-2 rounded-full leading-3">
                {cartProducts.length}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};
export default Header;

"use client";

import { logout } from "@/lib/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const LogOutButton = (token) => {
  const logutHandler = async (e) => {
    e.preventDefault();
    const data = await logout(token);
    if (data.code == 200) {
      alert(data.message);
      localStorage.clear();
      window.location.href = "/";
    }
  };
  return (
    <button className="w-20 h-11 shadow-sm rounded-lg border border-gray-200 hover:shadow-lg" onClick={logutHandler}>
      Logout
    </button>
  );
};

const AuthButton = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Link href="/login">
        <button className="w-20 h-11 shadow-sm rounded-lg border border-gray-200 hover:shadow-lg hover:bg-yellow-300"> Login </button>
      </Link>
      <Link href="/register">
        <button className="w-20 h-11 shadow-sm bg-yellow-300 rounded-lg border border-gray-200 hover:shadow-lg hover:bg-yellow-500 "> Register </button>
      </Link>
    </div>
  );
};

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    if (token != null || token != undefined) {
      setLoggedIn(true);
    }
  }, [token]);

  return (
    <>
      <nav className="bg-white border-gray-200 pb-2 shadow-md z-50 w-full">
        <div className="max-w-screen-xl h-20 flex flex-wrap items-center justify-between mx-auto p-4">
          <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-2xl font-semibold whitespace-nowrap">Discover Roads</span>
          </Link>
          <button
            onClick={toggleMenu}
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-default"
            aria-expanded={menuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
          <div className={`${menuOpen ? "block" : "hidden"} w-full md:block md:w-auto bg-white`} id="navbar-default">
            <div className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
              <div className="space-x-3 font-medium text-sm">{loggedIn ? LogOutButton(token) : AuthButton()}</div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LogOutButton = () => {
  const logutHandler = (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = "/";
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
        <button className="w-20 h-11 shadow-sm rounded-lg border border-gray-200 hover:shadow-lg"> Login </button>
      </Link>
      <Link href="/register">
        <button className="w-20 h-11 shadow-sm bg-blue-300 rounded-lg border border-gray-200"> Sign Up </button>
      </Link>
    </div>
  );
};

export default function Navbar({ token }) {
  const [loggedIn, setLoggedIn] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

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
      <nav className="bg-white border-gray-200 pb-2 shadow-md z-50">
        <div className="max-w-screen-xl h-20 flex flex-wrap items-center justify-between mx-auto p-4">
          <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-2xl font-semibold whitespace-nowrap">Discover Roads</span>
          </Link>
          <button
            onClick={toggleMenu}
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 block"
            aria-controls="navbar-default"
            aria-expanded={menuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
          <div className={`${menuOpen ? "block" : "hidden"} w-full md:block md:w-auto`} id="navbar-default">
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
              <li>
                <Link href="/hospital" className="block py-2 px-3 text-black hover:text-sky-800 md:p-0" aria-current="page">
                  Roads
                </Link>
              </li>
              <li>
                <Link href="/map" className="block py-2 px-3 text-black hover:text-sky-800 md:p-0" aria-current="page">
                  Maps
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-x-3 font-medium text-sm">{loggedIn ? LogOutButton() : AuthButton()}</div>
        </div>
      </nav>
    </>
  );
}

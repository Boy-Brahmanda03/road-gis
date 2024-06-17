"use client";

import { logout } from "@/lib/auth";
import { clsx } from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const LogOutButton = (token) => {
  const logutHandler = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "warning",
      title: "Are you sure you want to logged out?",
      showConfirmButton: false,
      showDenyButton: true,
      showCancelButton: true,
      denyButtonText: "Yes",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isDenied) {
        logout(token).then((data) => {
          if (data.code == 200) {
            Swal.fire({
              title: "Success!",
              text: `Successfully logged out!`,
              icon: "success",
            });
            localStorage.clear();
            window.location.href = "/";
          }
        });
      }
    });
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
  const [dropDown, setDropdown] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDropdown = () => {
    setDropdown(!dropDown);
  };

  useEffect(() => {
    if (token != null || token != undefined) {
      setLoggedIn(true);
    }
  }, [token]);

  return (
    <>
      <nav className="bg-white border-gray-200 shadow-md pb-2 z-50">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-2xl font-semibold whitespace-nowrap">Discover Roads</span>
          </Link>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {loggedIn ? LogOutButton(token) : AuthButton()}
            <button
              data-collapse-toggle="navbar-cta"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-cta"
              aria-expanded="false"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
          </div>
          <div className={clsx("items-center justify-between w-full md:flex md:w-auto md:order-1", { hidden: !menuOpen })} id="navbar-cta">
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
              {loggedIn && (
                <>
                  <Link href="/road/data">
                    <p className="block py-2 px-3 md:p-0 text-black font-semibold rounded md:bg-transparent hover:text-yellow-700 " aria-current="page">
                      Road Data
                    </p>
                  </Link>
                  <Link href="/road/add">
                    <p className="block py-2 px-3 md:p-0 text-black font-semibold rounded md:bg-transparent hover:text-yellow-700 " aria-current="page">
                      Add Road
                    </p>
                  </Link>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

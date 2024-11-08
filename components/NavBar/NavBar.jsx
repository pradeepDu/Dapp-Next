// components/NavBar/NavBar.js
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-xl text-primary">
          Voting App
        </Link>
      </div>

      <div className="flex-none hidden lg:flex space-x-4">
        <Link href="/" className="btn btn-ghost">
          Home
        </Link>
        <Link href="/candidate-registration" className="btn btn-ghost">
          Candidate Registration
        </Link>
        <Link href="/allowed-voters" className="btn btn-ghost">
          Voters Registration
        </Link>
        <Link href="/voterList" className="btn btn-ghost">
          Voter List
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="flex-none lg:hidden">
        <button
          className="btn btn-square btn-ghost"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 right-0 w-48 bg-base-200 shadow-md rounded-lg p-2 lg:hidden z-50">
          <Link href="/" className="block px-4 py-2 hover:bg-base-300 rounded-md">
            Home
          </Link>
          <Link href="/candidate-registration" className="block px-4 py-2 hover:bg-base-300 rounded-md">
            Candidate Registration
          </Link>
          <Link href="/allowed-voters" className="block px-4 py-2 hover:bg-base-300 rounded-md">
            Allowed Voters
          </Link>
          <Link href="/voterList" className="block px-4 py-2 hover:bg-base-300 rounded-md">
            Voter List
          </Link>
        </div>
      )}

      {/* Theme Switcher */}
      <div className="ml-4">
        <button className="btn btn-circle btn-outline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 3v1M12 21v1m8.46-5.68l-.71.7M4.68 4.69l-.7.71m15.02 10.96l-.7-.71M4.68 19.3l-.71-.7M21 12h1M3 12H2m15.64 5.64A7 7 0 116.36 6.36a7 7 0 0110.28 10.28z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Navbar;

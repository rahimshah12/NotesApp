// src/Navbar.jsx
import React from "react";

function Navbar({ user, handleLogout }) {
  return (
    <nav className="w-full bg-white shadow-md px-6 py-3 flex justify-between items-center">
      {/* Logo / App Name */}
      <h1 className="text-xl font-bold text-indigo-600">Notes App</h1>

      {/* Only show Logout if user is logged in */}
      {user && (
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      )}
    </nav>
  );
}

export default Navbar;

// src/SignUp.jsx
import { useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

function SignUp({ onSignedUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update display name
      if (name) {
        await updateProfile(userCredential.user, { displayName: name });
      }

      onSignedUp(userCredential.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
        Create Your Account
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSignUp} className="flex flex-col gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Full Name
          </label>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          Sign Up
        </button>
      </form>

      <p className="text-sm text-gray-500 text-center mt-6">
        Already have an account?{" "}
        <span className="text-indigo-600 font-medium">Login instead</span>
      </p>
    </div>
  );
}

export default SignUp;

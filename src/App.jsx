// src/App.jsx
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";

import NoteForm from "./NoteForm";
import NoteList from "./NoteList";
import TeacherForm from "./TeacherForm";
import PublicNotes from "./PublicNotes";
import SignUp from "./SignUp";
import Navbar from "./Navbar";

function App() {
  const [user, setUser] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);

  const teacherEmail = "teacher@example.com";
  const teacherPassword = "abc123";

  // Track login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Google login
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  };

  // Teacher login
  const handleTeacherLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        teacherEmail,
        teacherPassword
      );
      setUser(userCredential.user);
    } catch (error) {
      console.error("Teacher login failed:", error.message);
      alert("Teacher login failed. Check credentials in Firebase.");
    }
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const isTeacher = user?.email === teacherEmail;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar user={user} handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center mt-10 w-full">
        {!user ? (
          !showSignUp ? (
            <div className="flex justify-center items-center min-h-[70vh] w-full px-4">
              <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-center text-indigo-600">
                  Welcome!
                </h2>

                {/* Google login */}
                <button
                  onClick={handleLogin}
                  className="bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition cursor-pointer"
                >
                  Login with Google
                </button>

                {/* Teacher login */}
                <button
                  onClick={handleTeacherLogin}
                  className="bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition cursor-pointer"
                >
                  Teacher Login
                </button>

                {/* Signup link */}
                <p className="text-center text-gray-600">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setShowSignUp(true)}
                    className="text-indigo-600 font-medium hover:underline cursor-pointer"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center min-h-[70vh] w-full px-4">
              <SignUp onSignedUp={(user) => setUser(user)} />
            </div>
          )
        ) : (
          <>
            <p className="text-lg font-medium text-center mt-4">
              Welcome {user.displayName || user.email}
            </p>

            {/* Student view */}
            {!isTeacher && (
              <>
                <NoteForm user={user} />
                <NoteList user={user} />
              </>
            )}

            {/* Teacher view */}
            {isTeacher && <TeacherForm />}

            {/* Public notes */}
            <PublicNotes user={user} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;

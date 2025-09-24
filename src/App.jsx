import React, { useEffect, useState } from "react";
import { auth, provider } from "./firebase";
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

function App() {
  const [user, setUser] = useState(null);

  const teacherEmail = "teacher@example.com";
  const teacherPassword = "abc123";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    await signInWithPopup(auth, provider);
  };

  const handleTeacherLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        teacherEmail,
        teacherPassword
      );
      setUser(result.user);
    } catch (error) {
      alert("Teacher login failed. Please check Firebase Auth credentials.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const isTeacher = user?.email === teacherEmail;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">📝 Notes App</h1>
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : null}
      </header>

      <main className="p-6">
        {!user ? (
          <div className="flex flex-col items-center gap-4 mt-20">
            <button
              onClick={handleLogin}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Login with Google (Student)
            </button>
            <button
              onClick={handleTeacherLogin}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Teacher Login
            </button>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {isTeacher ? (
              <>
                <TeacherForm />
                <PublicNotes user={user} />
              </>
            ) : (
              <>
                <NoteForm user={user} />
                <NoteList user={user} />
                <PublicNotes user={user} />
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

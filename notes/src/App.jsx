import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  signInWithEmailAndPassword 
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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  };

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

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const isTeacher = user?.email === teacherEmail;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">

      {/* Logout button top-right */}
      {user && (
        <div className="w-full flex justify-end p-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}

      <div className="flex flex-col items-center justify-center gap-6 w-full max-w-2xl">
        {!user ? (
          <>
            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition cursor-pointer mt-40"
            >
              Sign in with Google
            </button>

            <button
              onClick={handleTeacherLogin}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition cursor-pointer"
            >
              Teacher Login
            </button>
          </>
        ) : (
          <>
            <p className="text-lg font-medium text-center">
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

            {/* Public notes for all users */}
            <PublicNotes user={user} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;

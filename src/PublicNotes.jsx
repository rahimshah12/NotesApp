import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

function PublicNotes({ user }) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "publicNotes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesData);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "publicNotes", id));
  };

  const handleEdit = async (note) => {
    const newText = prompt("Edit your note:", note.text);
    if (newText) {
      await updateDoc(doc(db, "publicNotes", note.id), { text: newText });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-center">📢 Teacher's Notes</h2>

      {notes.length === 0 ? (
        <p className="text-gray-500 text-center">No public notes yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white shadow-md rounded-xl p-5 border hover:shadow-lg transition flex flex-col"
            >
              <p className="text-gray-800 mb-3">{note.text}</p>
              <small className="text-gray-400 mb-3">
                {note.createdAt?.toDate().toLocaleString() || "just now"}
              </small>

              {user && user.email === "teacher@example.com" && (
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEdit(note)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PublicNotes;

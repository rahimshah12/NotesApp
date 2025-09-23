import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, onSnapshot, orderBy, query, deleteDoc, doc, updateDoc } from "firebase/firestore";

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

  // delete note
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "publicNotes", id));
  };

  // edit note
  const handleEdit = async (note) => {
    const newText = prompt("Edit your note:", note.text);
    if (newText) {
      await updateDoc(doc(db, "publicNotes", note.id), {
        text: newText,
      });
    }
  };

  return (
    <div className="p-4 w-full max-w-md mx-auto flex flex-col gap-4">
      <h2 className="text-xl font-bold text-center mb-2">📢 Teacher's Notes</h2>

      {notes.length === 0 ? (
        <p className="text-gray-500 text-center">No public notes yet</p>
      ) : (
        notes.map((note) => (
          <div
            key={note.id}
            className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition"
          >
            <p className="text-gray-800">{note.text}</p>
            <small className="text-gray-400">
              {note.createdAt?.toDate().toLocaleString() || "just now"}
            </small>


            {user && user.email === "teacher@example.com" && (
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleDelete(note.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleEdit(note)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 cursor-pointer"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default PublicNotes;

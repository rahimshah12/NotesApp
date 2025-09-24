import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

function NoteList({ user }) {
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "notes", id));
  };

  const handleEdit = (note) => {
    setEditingId(note.id);
    setEditText(note.text);
  };

  const handleUpdate = async (id) => {
    if (!editText.trim()) return;
    await updateDoc(doc(db, "notes", id), { text: editText });
    setEditingId(null);
    setEditText("");
  };

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "notes"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesData);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4">📒 Your Notes</h2>

      {notes.length === 0 ? (
        <p className="text-gray-500 text-center">No notes yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white shadow-md rounded-xl p-5 border hover:shadow-lg transition flex flex-col"
            >
              {editingId === note.id ? (
                <>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full border p-2 rounded-lg mb-3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(note.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded-lg hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-800 mb-3">{note.text}</p>
                  <small className="text-gray-400 mb-3">
                    {note.createdAt?.toDate().toLocaleString() || "just now"}
                  </small>
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => handleEdit(note)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NoteList;

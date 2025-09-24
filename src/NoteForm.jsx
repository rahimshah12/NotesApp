import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function NoteForm({ user }) {
  const [note, setNote] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;

    await addDoc(collection(db, "notes"), {
      text: note,
      uid: user.uid,
      createdAt: serverTimestamp(),
    });

    setNote("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-xl p-6 mb-6 flex flex-col gap-4"
    >
      <textarea
        className="w-full h-28 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
        placeholder="Write your note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        Add Note
      </button>
    </form>
  );
}

export default NoteForm;

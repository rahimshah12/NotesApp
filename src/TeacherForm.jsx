import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function TeacherForm() {
  const [note, setNote] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;

    await addDoc(collection(db, "publicNotes"), {
      text: note,
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
        placeholder="Write public note for all students..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button
        type="submit"
        className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
      >
        Share Public Note
      </button>
    </form>
  );
}

export default TeacherForm;

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

    setNote(""); // form reset
  };

  return (
    <div className="flex flex-col items-center mt-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 items-center w-full max-w-md"
      >
        <textarea
          className="w-full h-32 border border-black rounded p-2"
          placeholder="Write public note for all students..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600 transition"
        >
          Share Public Note
        </button>
      </form>
    </div>
  );
}

export default TeacherForm;

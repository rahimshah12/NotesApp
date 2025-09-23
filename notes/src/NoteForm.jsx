import React, { useState } from "react";
import { db } from "./firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

function NoteForm({ user }) {
  const [note, setNote] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;

    await addDoc(collection(db, "notes"), {
      text: note,
      uid: user.uid,
      createdAt: serverTimestamp(),
      localTime: Date.now()
    });

    setNote(""); 
  };

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 items-center w-full max-w-md"
      >
        <textarea
          className="w-full h-32 border border-black rounded p-2"
          placeholder="Write your notes here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition mx-auto block"
        >
          Add Note
        </button>
      </form>
    </div>
  );
}

export default NoteForm;

import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, push } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyArAfhCSvews_rxsiG9Pb7y3-HZsjVHImc",
  authDomain: "tsimpoufm-43085.firebaseapp.com",
  databaseURL:
    "https://tsimpoufm-43085-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tsimpoufm-43085",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function App() {
  const [videoId, setVideoId] = useState("jfKfPfyJRdk");
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    onValue(ref(db, "currentSong"), (snapshot) => {
      if (snapshot.exists()) setVideoId(snapshot.val());
    });

    onValue(ref(db, "chat"), (snapshot) => {
      const data = snapshot.val();
      setChat(data ? Object.values(data) : []);
    });
  }, []);

  const changeSong = () => {
    if (input.trim()) {
      set(ref(db, "currentSong"), input.trim());
    }
  };

  const send = () => {
    if (msg.trim()) {
      push(ref(db, "chat"), msg);
      setMsg("");
    }
  };

  return (
    <div style={{ background: "black", color: "white", minHeight: "100vh", padding: 20 }}>
      <h1>TsimpouFM</h1>

      <iframe
        width="100%"
        height="400"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        allowFullScreen
      />

      <h3>Change Song</h3>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={changeSong}>Play</button>

      <h3>Chat</h3>
      {chat.map((m, i) => (
        <div key={i}>{m}</div>
      ))}

      <input value={msg} onChange={(e) => setMsg(e.target.value)} />
      <button onClick={send}>Send</button>
    </div>
  );
}

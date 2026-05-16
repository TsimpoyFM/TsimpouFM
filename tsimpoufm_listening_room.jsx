import { useState, useEffect } from "react"
import { initializeApp } from "firebase/app"
import { getDatabase, ref, set, onValue, push } from "firebase/database"

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT",
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)
const ADMIN_PASSWORD = "tsimpouadmin"

export default function TsimpouFM() {
  const [videoId, setVideoId] = useState("jfKfPfyJRdk")
  const [input, setInput] = useState("")
  const [password, setPassword] = useState("")
  const [admin, setAdmin] = useState(false)
  const [listeners, setListeners] = useState(1)
  const [chat, setChat] = useState([])
  const [message, setMessage] = useState("")

  useEffect(() => {
    onValue(ref(db, "currentSong"), (s) => s.exists() && setVideoId(s.val()))
    onValue(ref(db, "listeners"), (s) => setListeners(s.val() || 1))
    onValue(ref(db, "chat"), (s) => setChat(s.val() ? Object.values(s.val()) : []))
    set(ref(db, "listeners"), listeners + 1)
  }, [])

  const login = () => password === ADMIN_PASSWORD && setAdmin(true)
  const updateTrack = () => input.trim() && set(ref(db, "currentSong"), input.trim())
  const sendMessage = () => {
    if (message.trim()) {
      push(ref(db, "chat"), message)
      setMessage("")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-7xl font-bold">TsimpouFM</h1>
          <p className="text-zinc-400 italic">A live shared listening transmission</p>
          <p className="text-sm text-zinc-500">{listeners} listeners online</p>
        </div>

        <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
          <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} allowFullScreen />
        </div>

        {!admin && (
          <div className="bg-zinc-900 p-4 rounded-xl space-y-3">
            <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Admin password" className="w-full p-3 bg-zinc-800 rounded" />
            <button onClick={login} className="w-full bg-white text-black p-3 rounded">Enter Studio</button>
          </div>
        )}

        {admin && (
          <div className="bg-zinc-900 p-6 rounded-xl space-y-4">
            <h2 className="text-xl font-bold">Studio Control</h2>
            <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="YouTube video ID" className="w-full p-3 bg-zinc-800 rounded" />
            <button onClick={updateTrack} className="bg-white text-black px-6 py-3 rounded">Broadcast</button>
          </div>
        )}

        <div className="bg-zinc-900 p-6 rounded-xl space-y-4">
          <h2 className="font-bold">Live Chat</h2>
          <div className="h-48 overflow-y-auto bg-zinc-950 rounded p-3 space-y-2">
            {chat.map((m,i)=><div key={i}>{m}</div>)}
          </div>
          <input value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Send message" className="w-full p-3 bg-zinc-800 rounded" />
          <button onClick={sendMessage} className="bg-white text-black px-4 py-2 rounded">Send</button>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from "react";
import axios from "axios";

export default function Player({ back }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [s, setS] = useState(null);

  async function join() {
    await axios.post("http://localhost:5000/api/join", { name, room });
    setJoined(true);
  }

  async function answer(i) {
    // prevent answering if quiz ended
    if (s?.ended) return;
    await axios.post("http://localhost:5000/api/answer", {
      room,
      name,
      answer: i
    });
  }

  useEffect(() => {
    if (!joined) return;
    const id = setInterval(async () => {
      const res = await axios.get("http://localhost:5000/api/status/" + room);
      setS(res.data);
    }, 1000);
    return () => clearInterval(id);
  }, [joined]);

  return (
    <div className="card">
      <button className="back-btn" onClick={back}>Back</button>

      {!joined && (
        <>
        <input 
            className="input"
            placeholder="name"
            onChange={(e) => setName(e.target.value)}
        />

        <input 
            className="input"
            placeholder="room"
            onChange={(e) => setRoom(e.target.value)}
        />

          <button className="btn" onClick={join}>Join</button>
        </>
      )}

      {joined && s && (
        <>
          <h2>Room {room}</h2>

          {/* Final leaderboard */}
          {s.leaderboard && (
            <>
              <h2>FINAL LEADERBOARD</h2>
              <div className="room-box">
                {s.leaderboard.map((x) => (
                  <div key={x.rank}>
                    #{x.rank} — {x.name} — {x.score} pts
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Questions ONLY when quiz running and not ended */}
          {!s.leaderboard && !s.ended && s.currentIndex >= 0 && (
            <>
              <h3 className="question-text">
                {s.questions[s.currentIndex].text}
              </h3>

              <div className="options-grid">
                {s.questions[s.currentIndex].options.map((o, i) => (
                  <button key={i} className="btn" onClick={() => answer(i)}>
                    {o}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* If quiz ended but leaderboard not present for some reason, show message */}
          {s.ended && !s.leaderboard && (
            <div className="room-box">
              Quiz ended — final leaderboard being prepared.
            </div>
          )}
        </>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Host({ back }) {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [q, setQ] = useState("");
  const [o, setO] = useState(["", ""]);
  const [c, setC] = useState(0);
  const [room, setRoom] = useState("");
  const [s, setS] = useState(null);

  function save() {
    setQuestions([...questions, { text: q, options: o, correct: c }]);
    setQ("");
    setO(["", ""]);
    setC(0);
  }

  async function createQuiz() {
    const r = await axios.post("http://localhost:5000/api/createQuiz", {
      title,
      questions,
    });

    setRoom(r.data.room);   // removed alert
  }

  async function start() {
    await axios.post("http://localhost:5000/api/start", { room });
  }

  async function next() {
    await axios.post("http://localhost:5000/api/next", { room });
  }

  async function endQuiz() {
    await axios.post("http://localhost:5000/api/end", { room });
  }

  useEffect(() => {
    if (!room) return;

    const id = setInterval(async () => {
      const r = await axios.get("http://localhost:5000/api/status/" + room);
      setS(r.data);
    }, 1000);

    return () => clearInterval(id);
  }, [room]);

  return (
    <div>
      <button className="back-btn" onClick={back}>Back</button>

      {!room && (
        <>
          <h2>Create</h2>

          <input
            className="input"
            placeholder="Quiz title"
            onChange={(e) => setTitle(e.target.value)}
          />

          <h3>New Question</h3>

          <input
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Question"
          />

          {o.map((v, i) => (
            <input
              key={i}
              className="input"
              value={v}
              onChange={(e) => {
                const t = [...o];
                t[i] = e.target.value;
                setO(t);
              }}
              placeholder={`Option ${i + 1}`}
            />
          ))}

          <button className="btn" onClick={() => setO([...o, ""])}>
            Add option
          </button>

          <h4>Correct Index</h4>

          <input
            className="input"
            type="number"
            value={c}
            onChange={(e) => setC(Number(e.target.value))}
          />

          <button className="btn" onClick={save}>
            Save Q
          </button>

          <button className="btn" onClick={createQuiz}>
            Create Room
          </button>
        </>
      )}

      {room && (
        <>
          {/* ROOM DISPLAY */}
          <div className="room-box">
            <h3>Room Code</h3>
            <div className="room-code">{room}</div>
          </div>

          <h2>Room {room}</h2>

          <button className="btn" onClick={start} disabled={s?.started && !s?.ended}>
            Start
          </button>

          <button className="btn" onClick={next} disabled={!s?.started || s?.ended}>
            Next
          </button>

          {/* End button: only show after start and if not already ended */}
          {s?.started && !s?.ended && (
            <button className="btn end-btn" onClick={endQuiz}>
              End Quiz
            </button>
          )}

          {s && (
            <>
              <h3>Players:</h3>
              {s.players?.map((p) => (
                <div key={p.name}>
                  {p.name}: {p.score}
                </div>
              ))}
            </>
          )}

          {/* Final leaderboard for host too */}
          {s?.leaderboard && (
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
        </>
      )}
    </div>
  );
}

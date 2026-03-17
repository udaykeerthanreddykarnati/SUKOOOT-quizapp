import React, { useState } from "react";
import Host from "./Host.jsx";
import Player from "./Player.jsx";
import owlLogo from "./owl_logo.png"; 

export default function App() {
  const [view, setView] = useState("menu");

  return (
    <div className="card">
      {view === "menu" && (
        <>
          <div className="title-row">
            <img
              src={owlLogo}
              alt="owl-logo"
              className="owl-logo"
            />

            <h1 className="title">
              SUK
              <span className="o o1">O</span>
              <span className="o o2">O</span>
              <span className="o o3">O</span>
              <span className="o o4">O</span>
              <span className="o o5">O</span>
              <span className="o o6">O</span>
              <span className="o o7">O</span>
              <span className="o o8">O</span>
              OT
            </h1>
          </div>

          <button className="btn" onClick={() => setView("host")}>Host Quiz</button>
          <button className="btn" onClick={() => setView("player")}>Join Quiz</button>
        </>
      )}

      {view === "host" && <Host back={() => setView("menu")} />}
      {view === "player" && <Player back={() => setView("menu")} />}
    </div>
  );
}

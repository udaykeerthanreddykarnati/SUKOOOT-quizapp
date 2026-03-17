const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient("mongodb://127.0.0.1:27017");
let db;

async function start() {
    await client.connect();
    db = client.db("quiz_v35");
    console.log("MongoDB Connected v3.5");
}
start();

app.post("/api/createQuiz", async (req, res) => {
    const { title, questions } = req.body;
    const room = Math.floor(100000 + Math.random()*900000).toString();

    await db.collection("rooms").insertOne({
        room, title, questions,
        currentIndex: -1,
        players: [],
        started: false
    });

    res.json({ room });
});

app.post("/api/join", async (req, res) => {
    const { name, room } = req.body;
    const r = await db.collection("rooms").findOne({ room });
    if (!r) return res.json({ error: "Room not found" });

    if (!r.players.find(p => p.name === name)) {
        await db.collection("rooms").updateOne(
            { room },
            { $push: { players: { name, score: 0 } } }
        );
    }
    res.json({ ok: true });
});

app.post("/api/start", async (req,res)=>{
    const {room}=req.body;
    await db.collection("rooms").updateOne(
        {room},
        {$set:{started:true, currentIndex:0}}
    );
    res.json({ok:true});
});

app.post("/api/next", async (req,res)=>{
    const {room}=req.body;
    const r=await db.collection("rooms").findOne({room});
    let next=r.currentIndex+1;
    if(next>=r.questions.length) return res.json({end:true});
    await db.collection("rooms").updateOne({room},{$set:{currentIndex:next}});
    res.json({ok:true});
});

app.post("/api/answer", async (req,res)=>{
    const {room,name,answer}=req.body;
    const r=await db.collection("rooms").findOne({room});

    // if quiz ended, ignore answers
    if (r && r.ended) {
        return res.json({ok:false, message:"Quiz ended"});
    }

    const q=r.questions[r.currentIndex];
    if(q.correct == answer){
        await db.collection("rooms").updateOne(
            {room,"players.name":name},
            {$inc:{"players.$.score":10}}
        );
    }
    res.json({ok:true});
});

app.get("/api/status/:room", async (req,res)=>{
    const r=await db.collection("rooms").findOne({room:req.params.room});
    res.json(r);
});

// NEW endpoint: host ends quiz and leaderboard is computed instantly
app.post("/api/end", async (req, res) => {
    const { room } = req.body;

    const r = await db.collection("rooms").findOne({ room });
    if (!r) return res.json({ error: "Room not found" });

    // compute leaderboard
    const leaderboard = [...(r.players || [])]
        .sort((a, b) => b.score - a.score)
        .map((p, i) => ({
            rank: i + 1,
            name: p.name,
            score: p.score
        }));

    await db.collection("rooms").updateOne(
        { room },
        { $set: { leaderboard, ended: true } }
    );

    res.json({ ok: true });
});

app.listen(5000, ()=> console.log("Server running on 5000 v3.5"));

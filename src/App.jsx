import React, { useState } from "react";

const STORAGE_PROFILE = "veyron_profile";
const STORAGE_POSTS = "veyron_posts";

function loadProfile() {
  try { return JSON.parse(localStorage.getItem(STORAGE_PROFILE)); } catch { return null; }
}
function loadPosts() {
  try { return JSON.parse(localStorage.getItem(STORAGE_POSTS)) || []; } catch { return []; }
}
function savePosts(posts) {
  localStorage.setItem(STORAGE_POSTS, JSON.stringify(posts));
}
function initials(name) {
  return (name || "U").trim().slice(0, 1).toUpperCase();
}
function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return Math.floor(s / 60) + "m";
  if (s < 86400) return Math.floor(s / 3600) + "h";
  return Math.floor(s / 86400) + "d";
}

function Hero({ onStart }) {
  return (
    <div className="hero">
      <div className="hero-orb" />
      <div className="hero-inner">
        <div className="hero-mark">VEYRON NEXUS</div>
        <h1>One platform.<br />Built to grow<br />with you.</h1>
        <p className="hero-sub">A feed, an assistant, and a community that upgrades over time — starting here.</p>
        <button className="btn btn-hero" onClick={onStart}>Enter Veyron Nexus</button>
      </div>
    </div>
  );
}

function SignUp({ onDone }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nin, setNin] = useState("");

  function submit() {
    if (!name.trim() || !email.trim()) { alert("Please enter at least your name and email."); return; }
    const profile = { name, email, phone, nin, verified: false, createdAt: Date.now() };
    localStorage.setItem(STORAGE_PROFILE, JSON.stringify(profile));
    onDone(profile);
  }

  return (
    <div className="screen">
      <h2 className="sec">Create your account</h2>
      <div className="label">Full name</div>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
      <div className="label">Email</div>
      <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" />
      <div className="label">Phone number</div>
      <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="+234..." />
      <div className="label">National ID number</div>
      <input value={nin} onChange={e => setNin(e.target.value)} placeholder="NIN" />
      <button className="btn" onClick={submit}>Create account</button>
      <p className="note">
        <span className="pill">Verification pending</span>&nbsp;
        ID and phone aren't checked against a government or SMS service yet — that needs a licensed verification
        partner connected first. Posting and the feed work now.
      </p>
    </div>
  );
}

function Composer({ profile, onPosted }) {
  const [text, setText] = useState("");
  function submit() {
    if (!text.trim()) { alert("Write something first."); return; }
    const posts = loadPosts();
    posts.unshift({
      id: "p" + Date.now(),
      authorName: profile.name,
      text,
      createdAt: Date.now(),
      likedBy: [],
      views: Math.floor(Math.random() * 20),
    });
    savePosts(posts);
    setText("");
    onPosted();
  }
  return (
    <div className="screen">
      <h2 className="sec">New post</h2>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="What's happening?" />
      <button className="btn" onClick={submit}>Post</button>
      <p className="note">Saved on this device for now — connect a shared database to make posts visible to everyone (see README).</p>
    </div>
  );
}

function Feed({ profile }) {
  const [posts, setPosts] = useState(loadPosts());

  function toggleLike(id) {
    const updated = posts.map(p => {
      if (p.id !== id) return p;
      const likedBy = p.likedBy.includes(profile.email)
        ? p.likedBy.filter(e => e !== profile.email)
        : [...p.likedBy, profile.email];
      return { ...p, likedBy };
    });
    setPosts(updated);
    savePosts(updated);
  }

  if (!posts.length) {
    return <div className="screen"><p className="note">No posts yet — tap Post to share the first one.</p></div>;
  }

  return (
    <div className="screen">
      {posts.map(p => (
        <div className="card" key={p.id}>
          <div className="post-head">
            <div className="avatar">{initials(p.authorName)}</div>
            <div>
              <div className="post-name">{p.authorName}</div>
              <div className="post-time">{timeAgo(p.createdAt)}</div>
            </div>
          </div>
          <p className="post-body">{p.text}</p>
          <div className="post-actions">
            <button
              className={"act" + (p.likedBy.includes(profile.email) ? " liked" : "")}
              onClick={() => toggleLike(p.id)}
            >
              ♥ {p.likedBy.length}
            </button>
            <div className="act">👁 {p.views} views</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Dashboard({ profile }) {
  const mine = loadPosts().filter(p => p.authorName === profile.name);
  const totalLikes = mine.reduce((s, p) => s + p.likedBy.length, 0);
  const totalViews = mine.reduce((s, p) => s + p.views, 0);
  return (
    <div className="screen">
      <h2 className="sec">Your dashboard</h2>
      <div className="stat-grid">
        <div className="stat"><div className="stat-num">{mine.length}</div><div className="stat-label">Posts</div></div>
        <div className="stat"><div className="stat-num">{totalLikes}</div><div className="stat-label">Total likes</div></div>
        <div className="stat"><div className="stat-num">{totalViews}</div><div className="stat-label">Total views</div></div>
        <div className="stat"><div className="stat-num">₦0</div><div className="stat-label">Earnings</div></div>
      </div>
      <p className="note">Pay-per-view earnings activate once a licensed payment partner is connected — see the roadmap doc.</p>
    </div>
  );
}

function Assistant() {
  const [messages, setMessages] = useState([
    { role: "system", text: "Connect an API key to make this assistant real — see README for setup." }
  ]);
  const [input, setInput] = useState("");
  function send() {
    if (!input.trim()) return;
    setMessages(m => [...m, { role: "user", text: input }, { role: "system", text: "This assistant isn't wired to an AI yet. Add your API key in src/assistant.js to activate it." }]);
    setInput("");
  }
  return (
    <div className="screen">
      <h2 className="sec">Assistant</h2>
      <div className="card" style={{ minHeight: 180 }}>
        {messages.map((m, i) => (
          <p key={i} className="post-body" style={{ opacity: m.role === "system" ? 0.7 : 1 }}>
            {m.role === "user" ? "You: " : ""}{m.text}
          </p>
        ))}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask the assistant..." onKeyDown={e => e.key === "Enter" && send()} />
      <button className="btn" onClick={send}>Send</button>
    </div>
  );
}

export default function App() {
  const [profile, setProfile] = useState(loadProfile());
  const [tab, setTab] = useState("feed");
  const [entered, setEntered] = useState(false);

  if (!profile) {
    if (!entered) return <Hero onStart={() => setEntered(true)} />;
    return <><Header /><SignUp onDone={setProfile} /></>;
  }

  return (
    <>
      <Header profile={profile} />
      {tab === "feed" && <Feed profile={profile} />}
      {tab === "post" && <Composer profile={profile} onPosted={() => setTab("feed")} />}
      {tab === "dash" && <Dashboard profile={profile} />}
      {tab === "ai" && <Assistant />}
      <div className="tabbar">
        <button className={"tab" + (tab === "feed" ? " active" : "")} onClick={() => setTab("feed")}>Feed</button>
        <button className={"tab" + (tab === "post" ? " active" : "")} onClick={() => setTab("post")}>Post</button>
        <button className={"tab" + (tab === "dash" ? " active" : "")} onClick={() => setTab("dash")}>Dashboard</button>
        <button className={"tab" + (tab === "ai" ? " active" : "")} onClick={() => setTab("ai")}>Assistant</button>
      </div>
    </>
  );
}

function Header({ profile }) {
  return (
    <header>
      <nav>
        <div className="brand">VEYRON NEXUS</div>
        {profile && <div className="avatar" style={{ width: 30, height: 30, fontSize: 13 }}>{initials(profile.name)}</div>}
      </nav>
    </header>
  );
}

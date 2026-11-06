import React, { useState, useEffect } from "react";
import "./style.css";

const STORAGE = {
  profile: "veyron_nexus_profile",
  posts: "veyron_nexus_posts"
};

const WORKSPACES = [
  {
    id: "intelligence",
    name: "AI Intelligence",
    description: "Artificial intelligence, intelligent assistants and model operations.",
    category: "INTELLIGENCE",
    status: "FOUNDATION"
  },
  {
    id: "automation",
    name: "Automation Systems",
    description: "Design workflows, automate tasks and coordinate operations.",
    category: "OPERATIONS",
    status: "FOUNDATION"
  },
  {
    id: "development",
    name: "Developer Environment",
    description: "Software development, code management and technical tools.",
    category: "ENGINEERING",
    status: "FOUNDATION"
  },
  {
    id: "research",
    name: "Research Laboratory",
    description: "Research environments, analysis and knowledge management.",
    category: "RESEARCH",
    status: "FOUNDATION"
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity Centre",
    description: "Security education, system monitoring and defensive operations.",
    category: "SECURITY",
    status: "FOUNDATION"
  },
  {
    id: "business",
    name: "Business Intelligence",
    description: "Business operations, planning and performance analysis.",
    category: "BUSINESS",
    status: "FOUNDATION"
  },
  {
    id: "cloud",
    name: "Cloud Infrastructure",
    description: "Cloud resources, infrastructure management and deployment.",
    category: "INFRASTRUCTURE",
    status: "FOUNDATION"
  },
  {
    id: "education",
    name: "Education Systems",
    description: "Learning environments, educational resources and study tools.",
    category: "KNOWLEDGE",
    status: "FOUNDATION"
  },
  {
    id: "marketplace",
    name: "Digital Marketplace",
    description: "A foundation for digital products, services and collaboration.",
    category: "ECONOMY",
    status: "FOUNDATION"
  }
];

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [profile, setProfile] = useState(() =>
    readStorage(STORAGE.profile, null)
  );

  const [posts, setPosts] = useState(() =>
    readStorage(STORAGE.posts, [])
  );

  const [page, setPage] = useState("overview");
  const [workspace, setWorkspace] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  const [postText, setPostText] = useState("");
  const [assistantInput, setAssistantInput] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "system",
      text: "Veyron-Nexus Intelligence interface initialized. An AI provider has not yet been connected."
    }
  ]);

  useEffect(() => {
    localStorage.setItem(STORAGE.posts, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    if (profile) {
      localStorage.setItem(STORAGE.profile, JSON.stringify(profile));
    }
  }, [profile]);

  function notify(message) {
    setNotice(message);
    setTimeout(() => setNotice(""), 3500);
  }

  function register(event) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const newProfile = {
      name: form.get("name").trim(),
      email: form.get("email").trim(),
      createdAt: new Date().toISOString()
    };

    if (!newProfile.name || !newProfile.email) {
      notify("Please complete all required fields.");
      return;
    }

    setProfile(newProfile);
    notify("Local profile created successfully.");
  }

  function logout() {
    localStorage.removeItem(STORAGE.profile);
    setProfile(null);
    setPage("overview");
    notify("You have signed out of this local session.");
  }

  function publishPost(event) {
    event.preventDefault();

    if (!postText.trim()) return;

    if (!profile) {
      notify("Create a local profile before publishing.");
      return;
    }

    const newPost = {
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now()),
      author: profile.name,
      text: postText.trim(),
      createdAt: new Date().toISOString(),
      likes: 0
    };

    setPosts(previous => [newPost, ...previous]);
    setPostText("");
    notify("Post saved on this device.");
  }

  function likePost(id) {
    setPosts(previous =>
      previous.map(post =>
        post.id === id
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
  }

  function sendAssistantMessage(event) {
    event.preventDefault();

    const question = assistantInput.trim();
    if (!question) return;

    setMessages(previous => [
      ...previous,
      { role: "user", text: question },
      {
        role: "system",
        text: "The Veyron-Nexus AI interface is ready, but no AI model provider is connected yet. Connect a secure backend and AI API to enable real responses."
      }
    ]);

    setAssistantInput("");
  }

  function navigate(destination) {
    setPage(destination);
    setWorkspace(null);
    setMenuOpen(false);
  }

  const filteredWorkspaces = WORKSPACES.filter(item =>
    `${item.name} ${item.description} ${item.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function openWorkspace(item) {
    setWorkspace(item);
    setPage("workspace");
  }

  function Header() {
    return (
      <header className="topbar">
        <button
          className="brand"
          onClick={() => navigate("overview")}
        >
          <span className="brand-symbol">V</span>
          <span>VEYRON<span className="brand-light">-NEXUS</span></span>
        </button>

        <div className="header-right">
          <span className="system-indicator">
            <span className="indicator-dot"></span>
            SYSTEM ONLINE
          </span>

          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </header>
    );
  }

  function Sidebar() {
    const navigation = [
      { id: "overview", icon: "⌂", label: "Overview" },
      { id: "intelligence", icon: "◈", label: "AI Intelligence" },
      { id: "workspaces", icon: "▦", label: "Workspaces" },
      { id: "feed", icon: "◉", label: "Community Feed" },
      { id: "dashboard", icon: "▤", label: "Dashboard" }
    ];

    return (
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-label">CONTROL CENTRE</div>

        {navigation.map(item => (
          <button
            key={item.id}
            className={`nav-item ${page === item.id ? "active" : ""}`}
            onClick={() => {
              if (item.id === "intelligence") {
                navigate("assistant");
              } else {
                navigate(item.id);
              }
            }}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}

        <div className="sidebar-divider"></div>

        <div className="sidebar-label">INFRASTRUCTURE</div>

        <div className="sidebar-small-item">Cloud Systems</div>
        <div className="sidebar-small-item">Developer Tools</div>
        <div className="sidebar-small-item">Security Operations</div>

        <div className="sidebar-bottom">
          <div className="connection-label">PLATFORM STATUS</div>
          <div className="connection-value">FRONTEND ACTIVE</div>
          <div className="connection-description">
            Backend integrations pending
          </div>
        </div>
      </aside>
    );
  }

  function Overview() {
    return (
      <>
        <section className="hero-panel">
          <div className="eyebrow">UNIFIED TECHNOLOGY ENVIRONMENT</div>

          <h1>
            ONE SYSTEM.
            <br />
            <span>INFINITE POSSIBILITIES.</span>
          </h1>

          <p>
            A unified environment for artificial intelligence,
            development, research, automation and digital operations.
          </p>

          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={() => navigate("workspaces")}
            >
              EXPLORE SYSTEMS →
            </button>

            <button
              className="secondary-button"
              onClick={() => navigate("assistant")}
            >
              OPEN INTELLIGENCE
            </button>
          </div>

          <div className="hero-footer">
            VEYRON-NEXUS / UNIFIED PLATFORM / VERSION 1.0
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div>
              <div className="eyebrow">SYSTEM ARCHITECTURE</div>
              <h2>Core environments</h2>
            </div>

            <button
              className="text-button"
              onClick={() => navigate("workspaces")}
            >
              VIEW ALL →
            </button>
          </div>

          <div className="workspace-grid">
            {WORKSPACES.slice(0, 6).map(item => (
              <button
                className="workspace-card"
                key={item.id}
                onClick={() => openWorkspace(item)}
              >
                <div className="card-topline">
                  <span>{item.category}</span>
                  <span className="card-arrow">↗</span>
                </div>

                <h3>{item.name}</h3>
                <p>{item.description}</p>

                <div className="card-status">
                  <span className="status-square"></span>
                  {item.status}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div>
              <div className="eyebrow">PLATFORM ACTIVITY</div>
              <h2>Current environment</h2>
            </div>
          </div>

          <div className="system-grid">
            <div className="system-card">
              <span>FRONTEND</span>
              <strong>ACTIVE</strong>
              <small>Application interface running</small>
            </div>

            <div className="system-card">
              <span>DATABASE</span>
              <strong>NOT CONNECTED</strong>
              <small>Persistent cloud storage pending</small>
            </div>

            <div className="system-card">
              <span>AI ENGINE</span>
              <strong>NOT CONNECTED</strong>
              <small>Model integration pending</small>
            </div>
          </div>
        </section>
      </>
    );
  }

  function Workspaces() {
    return (
      <section className="page-section">
        <div className="eyebrow">PLATFORM MODULES</div>
        <h1 className="page-title">Workspaces</h1>

        <p className="page-description">
          Explore the environments that make up Veyron-Nexus.
        </p>

        <input
          className="search-input"
          placeholder="Search systems and environments..."
          value={search}
          onChange={event => setSearch(event.target.value)}
        />

        <div className="workspace-grid">
          {filteredWorkspaces.map(item => (
            <button
              className="workspace-card"
              key={item.id}
              onClick={() => openWorkspace(item)}
            >
              <div className="card-topline">
                <span>{item.category}</span>
                <span className="card-arrow">↗</span>
              </div>

              <h3>{item.name}</h3>
              <p>{item.description}</p>

              <div className="card-status">
                <span className="status-square"></span>
                {item.status}
              </div>
            </button>
          ))}
        </div>

        {filteredWorkspaces.length === 0 && (
          <div className="empty-state">No matching systems found.</div>
        )}
      </section>
    );
  }

  function WorkspaceDetail() {
    if (!workspace) return null;

    return (
      <section className="page-section">
        <button
          className="text-button back-button"
          onClick={() => navigate("workspaces")}
        >
          ← ALL WORKSPACES
        </button>

        <div className="eyebrow">{workspace.category}</div>
        <h1 className="page-title">{workspace.name}</h1>

        <p className="page-description">
          {workspace.description}
        </p>

        <div className="detail-panel">
          <div className="detail-icon">◈</div>
          <h2>Environment foundation</h2>

          <p>
            This workspace is part of the Veyron-Nexus architecture.
            Its full operational services have not yet been connected.
          </p>

          <div className="detail-status">
            DEVELOPMENT STATUS: FOUNDATION
          </div>
        </div>
      </section>
    );
  }

  function Assistant() {
    return (
      <section className="page-section assistant-page">
        <div className="eyebrow">INTELLIGENCE ENVIRONMENT</div>
        <h1 className="page-title">AI Intelligence</h1>

        <p className="page-description">
          Central interface for future AI model and agent integrations.
        </p>

        <div className="assistant-status">
          <span className="status-square"></span>
          AI PROVIDER NOT CONNECTED
        </div>

        <div className="chat-window">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${message.role}`}
            >
              <span className="message-label">
                {message.role === "user" ? "YOU" : "SYSTEM"}
              </span>
              <p>{message.text}</p>
            </div>
          ))}
        </div>

        <form className="chat-form" onSubmit={sendAssistantMessage}>
          <input
            value={assistantInput}
            onChange={event => setAssistantInput(event.target.value)}
            placeholder="Enter a message..."
          />

          <button type="submit">SEND →</button>
        </form>

        <p className="small-note">
          This is currently an interface preview, not a connected AI model.
        </p>
      </section>
    );
  }

  function Feed() {
    return (
      <section className="page-section">
        <div className="eyebrow">COMMUNITY ENVIRONMENT</div>
        <h1 className="page-title">Community Feed</h1>

        <p className="page-description">
          Share updates and communicate with the Veyron-Nexus community.
        </p>

        {profile ? (
          <form className="composer" onSubmit={publishPost}>
            <textarea
              value={postText}
              onChange={event => setPostText(event.target.value)}
              placeholder="Write something..."
            />

            <button className="primary-button" type="submit">
              PUBLISH POST
            </button>
          </form>
        ) : (
          <div className="detail-panel">
            Create a local profile to publish posts.
          </div>
        )}

        <div className="feed-list">
          {posts.map(post => (
            <article className="feed-post" key={post.id}>
              <div className="post-author">{post.author}</div>

              <p>{post.text}</p>

              <div className="post-footer">
                <span>
                  {new Date(post.createdAt).toLocaleString()}
                </span>

                <button onClick={() => likePost(post.id)}>
                  ♡ {post.likes}
                </button>
              </div>
            </article>
          ))}

          {posts.length === 0 && (
            <div className="empty-state">
              No community posts yet.
            </div>
          )}
        </div>
      </section>
    );
  }

  function Dashboard() {
    const totalLikes = posts.reduce(
      (total, post) => total + post.likes,
      0
    );

    return (
      <section className="page-section">
        <div className="eyebrow">PERSONAL CONTROL CENTRE</div>
        <h1 className="page-title">Dashboard</h1>

        <p className="page-description">
          Your local account and platform activity.
        </p>

        <div className="system-grid">
          <div className="system-card">
            <span>PROFILE</span>
            <strong>{profile ? "ACTIVE" : "NOT CREATED"}</strong>
            <small>Local device profile</small>
          </div>

          <div className="system-card">
            <span>POSTS</span>
            <strong>{posts.length}</strong>
            <small>Posts stored on this device</small>
          </div>

          <div className="system-card">
            <span>LIKES</span>
            <strong>{totalLikes}</strong>
            <small>Recorded local interactions</small>
          </div>
        </div>

        {profile ? (
          <div className="detail-panel">
            <div className="eyebrow">ACCOUNT INFORMATION</div>
            <h2>{profile.name}</h2>
            <p>{profile.email}</p>
            <button className="secondary-button" onClick={logout}>
              SIGN OUT
            </button>
          </div>
        ) : (
          <div className="detail-panel">
            <h2>Create your profile</h2>

            <form className="signup-form" onSubmit={register}>
              <input name="name" placeholder="Full name" required />
              <input
                name="email"
                type="email"
                placeholder="Email address"
                required
              />

              <button className="primary-button" type="submit">
                CREATE LOCAL PROFILE
              </button>
            </form>

            <p className="small-note">
              This creates a profile on this device only. Secure
              account registration will require a backend.
            </p>
          </div>
        )}
      </section>
    );
  }

  if (!profile && page === "register") {
    return (
      <div className="app-shell">
        <Header />

        <main className="main-content">
          <Dashboard />
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Header />

      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          {page === "overview" && <Overview />}
          {page === "workspaces" && <Workspaces />}
          {page === "workspace" && <WorkspaceDetail />}
          {page === "assistant" && <Assistant />}
          {page === "feed" && <Feed />}
          {page === "dashboard" && <Dashboard />}

          <footer className="app-footer">
            <span>VEYRON-NEXUS</span>
            <span>UNIFIED TECHNOLOGY PLATFORM</span>
            <span>VERSION 1.0</span>
          </footer>
        </main>
      </div>

      {notice && <div className="notification">{notice}</div>}
    </div>
  );
}

export default App;

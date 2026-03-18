import { useState, useEffect, useRef } from "react";
import "./App.css";

const BASE_URL = "http://localhost:5000";

function App() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [modalCaption, setModalCaption] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPosts();
    function onKey(e) {
      if (e.key === "Escape") setModalOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch(`${BASE_URL}/posts`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      alert("Please select an image file");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/create-post`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Status ${res.status}`);
      }

      await res.json();
      setCaption("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await fetchPosts();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed. Check console.");
    } finally {
      setLoading(false);
    }
  }

  function openModal(p) {
    setModalImage(p.Image);
    setModalCaption(p.caption || "");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setModalImage("");
    setModalCaption("");
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Image Upload</h1>
        <p className="sub">
          Upload an image with a caption and see it below as a card.
        </p>
      </header>

      <form className="upload-form" onSubmit={handleSubmit}>
        <label className="file-label">
          <input
            ref={fileInputRef}
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <input
          className="caption-input"
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      <h2 className="section-title">Posts</h2>

      <div className="posts-grid">
        {posts.length === 0 && <p className="empty">No posts yet.</p>}

        {posts.map((p) => (
          <article
            className="card"
            key={p._id || p.Image + p.caption}
            onClick={() => openModal(p)}
          >
            <div className="card-media">
              <img
                src={p.Image}
                alt={p.caption || "Uploaded image"}
                loading="lazy"
              />
            </div>
            <div className="card-body">
              <p className="card-caption">{p.caption}</p>
            </div>
          </article>
        ))}
      </div>

      {modalOpen && (
        <div
          className="modal"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={closeModal}
              aria-label="Close"
            >
              ×
            </button>
            <img src={modalImage} alt={modalCaption || "Preview"} />
            {modalCaption && (
              <div className="modal-caption">{modalCaption}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

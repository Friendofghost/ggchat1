import React, { useState, useEffect, useRef } from "react";

const PASSWORD = "loveyou123";

const emojiMap: { [key: string]: string } = {
  ":)": "😊",
  ":(": "😢",
  ":heart:": "❤️",
  ":smile:": "😄",
  ":laughing:": "😆",
  ":wink:": "😉",
};

const convertToEmoji = (text: string) => {
  return text
    .split(" ")
    .map((word) => emojiMap[word] || word)
    .join(" ");
};

const App: React.FC = () => {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    { username: string; message: string }[]
  >(() => {
    const saved = localStorage.getItem("chat");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pwd = prompt("Enter the secret password:");
    if (pwd?.trim().toLowerCase() === PASSWORD) {
      const name = prompt("Enter your username:");
      setUsername(name?.trim() || "Anonymous");
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (trimmed) {
      const messageWithEmojis = convertToEmoji(trimmed);
      const newMessages = [
        ...messages,
        { username: username || "Anonymous", message: messageWithEmojis },
      ];
      setMessages(newMessages);
      localStorage.setItem("chat", JSON.stringify(newMessages));
      setInput("");
    }
  };

  if (authorized === null) return null;
  if (!authorized)
    return (
      <h1 style={{ textAlign: "center", marginTop: "100px" }}>
        ❌ Access Denied
      </h1>
    );

  return (
    <div style={styles.container}>
      <h2>Secret Chat 💬</h2>
      <div style={styles.chatBox} ref={chatRef}>
        {messages.map((msg, idx) => (
          <div key={idx} style={styles.message}>
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "500px",
    margin: "40px auto",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
  chatBox: {
    height: "300px",
    overflowY: "auto",
    border: "1px solid #ccc",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    background: "#f1f1f1",
    textAlign: "left",
  },
  message: {
    padding: "5px",
    borderBottom: "1px solid #ddd",
  },
  inputRow: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "4px",
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default App;

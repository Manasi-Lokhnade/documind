import { useEffect, useRef, useState } from "react";

import {
  FaBars,
  FaFilePdf,
  FaPaperPlane,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import {
  Document,
  Page,
  pdfjs,
} from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function Dashboard() {

  const navigate = useNavigate();

  const messagesEndRef =
    useRef(null);

  const user =
    JSON.parse(
      localStorage.getItem("user") || "{}"
    );

  // STATES

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [file, setFile] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [aiLoading, setAiLoading] =
    useState(false);

  const [messages, setMessages] =
    useState([
      {
        sender: "ai",

        text:
          "Hello 👋 Upload a PDF and ask me anything about it.",

        time:
          new Date().toLocaleTimeString(),
      },
    ]);

  const [recentChats, setRecentChats] =
    useState([]);

  const [selectedChat, setSelectedChat] =
    useState(null);

  // PDF STATES

  const [numPages, setNumPages] =
    useState(null);

  const [pageNumber, setPageNumber] =
    useState(1);

  const [pdfFile, setPdfFile] =
    useState(null);

  // AUTO SCROLL

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  // FETCH CHATS

  useEffect(() => {

    fetchChats();

  }, []);

  // FETCH CHAT HISTORY

  const fetchChats = async () => {

    try {

      const response =
        await fetch(
          "http://localhost:5000/api/chat/history",
          {

            headers: {
              Authorization:
                `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

      const data =
        await response.json();

      const formattedChats =
        data.map((chat) => ({

          id:
            chat.documentId?._id,

          chatId:
            chat._id,

          name:
            chat.documentId?.fileName ||
            "Untitled PDF",

          messages:
            chat.messages.flatMap(
              (msg) => [

                {
                  sender: "user",

                  text:
                    msg.question,

                  time:
                    new Date().toLocaleTimeString(),
                },

                {
                  sender: "ai",

                  text:
                    msg.answer,

                  time:
                    new Date().toLocaleTimeString(),
                },
              ]
            ),
        }));

      setRecentChats(
        formattedChats
      );

    } catch (error) {

      console.log(error);
    }
  };

  // LOGOUT

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");
  };

  // NEW CHAT

  const createNewChat = () => {

    setSelectedChat(null);

    setPdfFile(null);

    setNumPages(null);

    setPageNumber(1);

    setMessages([
      {
        sender: "ai",

        text:
          "Start a new conversation by uploading a PDF 📄",

        time:
          new Date().toLocaleTimeString(),
      },
    ]);
  };

  // UPLOAD PDF

  const handleUpload = async () => {

    if (!file) {

      alert("Select PDF first");

      return;
    }

    try {

      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const response =
        await fetch(
          "http://localhost:5000/api/documents/upload",
          {

            method: "POST",

            headers: {
              Authorization:
                `Bearer ${localStorage.getItem("token")}`,
            },

            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        alert(
          data.message ||
          "Upload failed"
        );

        return;
      }

      const newChat = {

        id:
          data.document._id,

        chatId:
          null,

        name:
          data.document.fileName,

        messages: [
          {
            sender: "ai",

            text:
              `PDF "${data.document.fileName}" uploaded successfully ✅`,

            time:
              new Date().toLocaleTimeString(),
          },
        ],
      };

      setRecentChats((prev) => [
        newChat,
        ...prev,
      ]);

      setSelectedChat(newChat);

      setMessages(newChat.messages);

      setPdfFile(
        `http://localhost:5000/uploads/${encodeURIComponent(data.document.fileName)}`
      );

      setPageNumber(1);

      setFile(null);

      alert(
        "PDF Uploaded Successfully ✅"
      );

    } catch (error) {

      console.log(error);

      alert(
        "Upload failed ❌"
      );

    } finally {

      setLoading(false);
    }
  };

  // SEND MESSAGE

  const sendMessage = async () => {

    if (!message.trim()) return;

    if (!selectedChat) {

      alert(
        "Please upload and select a PDF first"
      );

      return;
    }

    const userMessage = {

      sender: "user",

      text: message,

      time:
        new Date().toLocaleTimeString(),
    };

    const tempMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(tempMessages);

    const currentMessage =
      message;

    setMessage("");

    setAiLoading(true);

    try {

      const response =
        await fetch(
          "http://localhost:5000/api/chat/ask",
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${localStorage.getItem("token")}`,
            },

            body: JSON.stringify({

              question:
                currentMessage,

              documentId:
                selectedChat.id,
            }),
          }
        );

      const data =
        await response.json();

      const aiMessage = {

        sender: "ai",

        text:
          data.answer ||
          data.message ||
          "No AI response received",

        time:
          new Date().toLocaleTimeString(),
      };

      setMessages([
        ...tempMessages,
        aiMessage,
      ]);

      fetchChats();

    } catch (error) {

      console.log(error);

      setMessages([
        ...tempMessages,
        {

          sender: "ai",

          text:
            "Server error ❌ Unable to get AI response",

          time:
            new Date().toLocaleTimeString(),
        },
      ]);

    } finally {

      setAiLoading(false);
    }
  };

  // DELETE CHAT

  const deleteChat = async (chatId) => {

    try {

      await fetch(
        `http://localhost:5000/api/chat/${chatId}`,
        {

          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setRecentChats((prev) =>
        prev.filter(
          (chat) =>
            chat.chatId !== chatId
        )
      );

      createNewChat();

    } catch (error) {

      console.log(error);
    }
  };

  return (

    <div
      style={{
        ...styles.container,

        gridTemplateColumns:
          pdfFile
            ? "30% 1fr 30%"
            : "30% 1fr",
      }}
    >

      {/* SIDEBAR */}

      {
        sidebarOpen && (

          <div style={styles.sidebar}>

            <div>

              <div style={styles.logoRow}>

                <h1 style={styles.logo}>
                  DocuMind AI
                </h1>

                <button
                  style={styles.menuBtn}
                  onClick={() =>
                    setSidebarOpen(false)
                  }
                >
                  ✕
                </button>

              </div>

              <h2 style={styles.welcome}>
                Welcome,
                {" "}
                {
                  user?.email
                    ?.split("@")[0]
                }
              </h2>

              <button
                style={styles.newChatBtn}
                onClick={createNewChat}
              >

                <FaPlus />

                New Chat

              </button>

              {/* UPLOAD */}

              <div style={styles.uploadBox}>

                <FaFilePdf size={45} />

                <h3>
                  Upload Your PDF
                </h3>

                <p style={styles.uploadText}>
                  Select a PDF document and
                  start chatting with AI instantly.
                </p>

                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) =>
                    setFile(
                      e.target.files[0]
                    )
                  }
                  style={styles.fileInput}
                />

                <button
                  style={styles.uploadBtn}
                  onClick={handleUpload}
                >
                  {
                    loading
                      ? "Uploading..."
                      : "Upload PDF"
                  }
                </button>

              </div>

            </div>

            {/* RECENT CHATS */}

            <div style={styles.recentSection}>

              <div style={styles.recentHeader}>
                Recent Chats
              </div>

              {
                recentChats.map(
                  (chat) => (

                    <div
                      key={chat.chatId || chat.id}

                      style={{
                        ...styles.chatContent,

                        border:
                          selectedChat?.id === chat.id
                            ? "1px solid #2563eb"
                            : "none",
                      }}

                      onClick={() => {

                        setSelectedChat(chat);

                        setMessages(chat.messages);

                        setPdfFile(
                          `http://localhost:5000/uploads/${encodeURIComponent(chat.name)}`
                        );

                        setPageNumber(1);
                      }}
                    >

                      <div style={styles.chatTop}>

                        <span style={styles.chatName}>
                          📄 {chat.name}
                        </span>

                        {
                          chat.chatId && (

                            <button
                              style={styles.deleteBtn}

                              onClick={(e) => {

                                e.stopPropagation();

                                deleteChat(chat.chatId);
                              }}
                            >

                              <FaTrash size={12} />

                            </button>
                          )
                        }

                      </div>

                      <p style={styles.chatPreview}>

                        {
                          chat.messages[
                            chat.messages.length - 1
                          ]?.text?.slice(0, 60)
                        }

                        ...

                      </p>

                    </div>
                  )
                )
              }

            </div>

            <button
              style={styles.logoutBtn}
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>
        )
      }

      {/* CHAT AREA */}

      <div style={styles.chatArea}>

        <div style={styles.topBar}>

          {
            !sidebarOpen && (

              <button
                style={styles.topMenuBtn}
                onClick={() =>
                  setSidebarOpen(true)
                }
              >

                <FaBars />

              </button>
            )
          }

          <h3>

            {
              selectedChat?.name ||
              "New Conversation"
            }

          </h3>

        </div>

        {/* MESSAGES */}

        <div style={styles.messagesContainer}>

          {
            messages.map(
              (msg, index) => (

                <div
                  key={index}

                  style={{
                    display: "flex",

                    flexDirection:
                      "column",

                    alignItems:
                      msg.sender === "user"
                        ? "flex-end"
                        : "flex-start",
                  }}
                >

                  <div
                    style={{
                      ...styles.messageBubble,

                      background:
                        msg.sender === "user"
                          ? "#2563eb"
                          : "#1e293b",
                    }}
                  >

                    {msg.text}

                  </div>

                  <span style={styles.timestamp}>

                    {msg.time}

                  </span>

                </div>
              )
            )
          }

          {
            aiLoading && (

              <div style={styles.typingBox}>
                Documind is typing...
              </div>
            )
          }

          <div ref={messagesEndRef} />

        </div>

        {/* INPUT */}

        <div style={styles.inputContainer}>

          <input
            type="text"

            placeholder="Ask anything..."

            value={message}

            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }

            style={styles.input}

            onKeyDown={(e) => {

              if (e.key === "Enter") {

                sendMessage();
              }
            }}
          />

          <button
            style={styles.sendBtn}
            onClick={sendMessage}
          >

            <FaPaperPlane />

          </button>

        </div>

      </div>

      {/* PDF VIEWER */}

      {
        pdfFile && (

          <div style={styles.pdfPanel}>

            <div style={styles.pdfTop}>

              <h3>
                PDF Preview
              </h3>

              <div style={styles.pageControls}>

                <button
                  style={styles.closePdfBtn}

                  onClick={() => {

                    setPdfFile(null);

                    setNumPages(null);

                    setPageNumber(1);
                  }}
                >
                  ✕
                </button>

                <button
                  style={styles.pageBtn}

                  disabled={
                    pageNumber <= 1
                  }

                  onClick={() =>
                    setPageNumber(
                      pageNumber - 1
                    )
                  }
                >
                  Prev
                </button>

                <span>
                  {pageNumber}
                  {" / "}
                  {numPages || 1}
                </span>

                <button
                  style={styles.pageBtn}

                  disabled={
                    pageNumber >= numPages
                  }

                  onClick={() =>
                    setPageNumber(
                      pageNumber + 1
                    )
                  }
                >
                  Next
                </button>

              </div>

            </div>

            <div style={styles.pdfViewer}>

              <Document
                file={{
                  url: pdfFile,
                }}

                loading={
                  <p style={{ color: "white" }}>
                    Loading PDF...
                  </p>
                }

                error={
                  <p style={{ color: "red" }}>
                    Failed to load PDF file.
                  </p>
                }

                onLoadSuccess={({
                  numPages,
                }) => {

                  setNumPages(
                    numPages
                  );
                }}
              >

                <Page
                  pageNumber={
                    pageNumber
                  }

                  width={420}
                />

              </Document>

            </div>

          </div>
        )
      }

    </div>
  );
}

const styles = {

  container: {

    display: "grid",

    height: "100vh",

    background: "#0f172a",

    color: "white",

    overflow: "hidden",

    transition: "0.3s ease",
  },

  sidebar: {

    padding: "22px",

    display: "flex",

    flexDirection: "column",

    justifyContent: "space-between",

    background: "#111827",

    borderRight:
      "1px solid rgba(255,255,255,0.08)",
  },

  logoRow: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",
  },

  logo: {

    fontSize: "30px",

    fontWeight: "bold",
  },

  menuBtn: {

    background: "transparent",

    border: "none",

    color: "white",

    cursor: "pointer",

    fontSize: "18px",
  },

  welcome: {

    fontSize: "20px",

    color: "#e2e8f0",

    marginTop: "10px",

    marginBottom: "20px",
  },

  newChatBtn: {

    width: "100%",

    padding: "14px",

    border: "none",

    borderRadius: "12px",

    background: "#2563eb",

    color: "white",

    fontWeight: "bold",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "10px",

    cursor: "pointer",

    marginBottom: "20px",
  },

  uploadBox: {

    background: "#1e293b",

    padding: "25px",

    borderRadius: "18px",

    display: "flex",

    flexDirection: "column",

    gap: "18px",

    alignItems: "center",
  },

  uploadText: {

    textAlign: "center",

    color: "#cbd5e1",

    lineHeight: "1.6",

    fontSize: "14px",
  },

  fileInput: {

    color: "white",

    width: "100%",
  },

  uploadBtn: {

    width: "100%",

    padding: "14px",

    border: "none",

    borderRadius: "12px",

    background: "#2563eb",

    color: "white",

    cursor: "pointer",

    fontWeight: "bold",
  },

  recentSection: {

    flex: 1,

    overflowY: "auto",

    marginTop: "20px",
  },

  recentHeader: {

    marginBottom: "16px",

    fontWeight: "bold",
  },

  chatContent: {

    padding: "14px",

    cursor: "pointer",

    borderRadius: "14px",

    background: "#1e293b",

    marginBottom: "12px",
  },

  chatTop: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",
  },

  chatName: {

    fontWeight: "600",

    fontSize: "14px",

    color: "#e2e8f0",
  },

  chatPreview: {

    fontSize: "12px",

    color: "#94a3b8",

    marginTop: "8px",
  },

  deleteBtn: {

    background: "transparent",

    border: "none",

    color: "#94a3b8",

    cursor: "pointer",
  },

  logoutBtn: {

    padding: "15px",

    borderRadius: "12px",

    border: "none",

    background: "#dc2626",

    color: "white",

    cursor: "pointer",

    fontWeight: "bold",
  },

  chatArea: {

    display: "flex",

    flexDirection: "column",

    justifyContent: "space-between",

    overflow: "hidden",
  },

  topBar: {

    padding: "18px 25px",

    borderBottom:
      "1px solid rgba(255,255,255,0.08)",

    display: "flex",

    alignItems: "center",

    gap: "15px",
  },

  topMenuBtn: {

    background: "transparent",

    border: "none",

    color: "white",

    cursor: "pointer",

    fontSize: "18px",
  },

  messagesContainer: {

    flex: 1,

    padding: "35px",

    overflowY: "auto",

    display: "flex",

    flexDirection: "column",

    gap: "22px",
  },

  messageBubble: {

    maxWidth: "70%",

    padding: "16px 18px",

    borderRadius: "18px",

    lineHeight: "1.7",

    fontSize: "15px",
  },

  typingBox: {

    background: "#1e293b",

    width: "fit-content",

    padding: "12px 16px",

    borderRadius: "14px",

    color: "#cbd5e1",

    fontSize: "14px",
  },

  timestamp: {

    fontSize: "11px",

    color: "#94a3b8",

    marginTop: "6px",
  },

  inputContainer: {

    padding: "20px",

    borderTop:
      "1px solid rgba(255,255,255,0.08)",

    display: "flex",

    gap: "15px",

    background: "#111827",
  },

  input: {

    flex: 1,

    padding: "16px",

    borderRadius: "14px",

    border: "none",

    outline: "none",

    background: "#1e293b",

    color: "white",

    fontSize: "15px",
  },

  sendBtn: {

    width: "58px",

    border: "none",

    borderRadius: "14px",

    background: "#2563eb",

    color: "white",

    cursor: "pointer",

    fontSize: "18px",
  },

  pdfPanel: {

    minWidth: "420px",

    background: "#0f172a",

    borderLeft:
      "1px solid rgba(255,255,255,0.08)",

    display: "flex",

    flexDirection: "column",
  },

  pdfTop: {

    padding: "18px",

    borderBottom:
      "1px solid rgba(255,255,255,0.08)",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",
  },

  pageControls: {

    display: "flex",

    alignItems: "center",

    gap: "10px",
  },

  closePdfBtn: {

    padding: "8px 12px",

    border: "none",

    borderRadius: "8px",

    background: "#dc2626",

    color: "white",

    cursor: "pointer",

    fontWeight: "bold",
  },

  pageBtn: {

    padding: "8px 12px",

    border: "none",

    borderRadius: "8px",

    background: "#2563eb",

    color: "white",

    cursor: "pointer",
  },

  pdfViewer: {

    flex: 1,

    overflowY: "auto",

    display: "flex",

    justifyContent: "center",

    padding: "20px",
  },
};

export default Dashboard;
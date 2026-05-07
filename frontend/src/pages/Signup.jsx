import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import API from "../services/api";

function Signup() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // Signup
  const handleSignup = async () => {

    // ✅ Gmail validation
    if (
      !email.endsWith("@gmail.com")
    ) {

      alert(
        "Enter valid Gmail address"
      );

      return;
    }

    try {

      setLoading(true);

      await API.post(
        "/auth/signup",
        {
          email,
          password,
        }
      );

      alert(
        "Account created successfully ✅"
      );

      navigate("/login");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Signup failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.glow1}></div>
      <div style={styles.glow2}></div>

      <div style={styles.card}>

        <h1 style={styles.title}>
          Create Account
        </h1>

        <p style={styles.subtitle}>
          Signup to start using
          DocuMind AI
        </p>

        {/* Email */}
        <input
          type="email"
          placeholder="Enter Gmail"
          style={styles.input}
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Enter password"
          style={styles.input}
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        {/* Button */}
        <button
          style={styles.button}
          onClick={handleSignup}
        >
          {
            loading
              ? "Creating..."
              : "Signup"
          }
        </button>

        <p style={styles.text}>
          Already have an account?{" "}

          <Link
            to="/login"
            style={styles.link}
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

const styles = {

  container: {
    height: "100vh",
    background:
      "linear-gradient(to bottom, #000000, #1e1b4b, #c4b5fd)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },

  glow1: {
    width: "300px",
    height: "300px",
    background: "#7c3aed",
    borderRadius: "50%",
    filter: "blur(120px)",
    position: "absolute",
    top: "-100px",
    left: "-100px",
    opacity: 0.35,
  },

  glow2: {
    width: "300px",
    height: "300px",
    background: "#8b5cf6",
    borderRadius: "50%",
    filter: "blur(120px)",
    position: "absolute",
    bottom: "-100px",
    right: "-100px",
    opacity: 0.35,
  },

  card: {
    width: "400px",
    padding: "40px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    zIndex: 2,
    boxShadow:
      "0 10px 40px rgba(0,0,0,0.3)",
  },

  title: {
    fontSize: "36px",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "#d1d5db",
    marginBottom: "10px",
  },

  input: {
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "16px",
    background: "rgba(255,255,255,0.12)",
    color: "white",
  },

  button: {
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "white",
    color: "black",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
  },

  text: {
    textAlign: "center",
    color: "#e5e7eb",
  },

  link: {
    color: "#c4b5fd",
  },
};

export default Signup;
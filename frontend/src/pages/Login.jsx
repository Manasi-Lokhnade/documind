import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import API from "../services/api";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // Login
  const handleLogin = async () => {

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

      const response =
        await API.post(
          "/auth/login",
          {
            email,
            password,
          }
        );

      // Save token
      localStorage.setItem(
        "token",
        response.data.token
      );

      // Save user
      localStorage.setItem(
        "user",
        JSON.stringify(
          response.data.user
        )
      );

      alert("Login Successful ✅");

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>

      {/* Glow Effects */}
      <div style={styles.glow1}></div>
      <div style={styles.glow2}></div>

      {/* Login Card */}
      <div style={styles.card}>

        <h1 style={styles.title}>
          Welcome Back
        </h1>

        <p style={styles.subtitle}>
          Login to continue using
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

        {/* Login Button */}
        <button
          style={styles.button}
          onClick={handleLogin}
        >
          {
            loading
              ? "Logging in..."
              : "Login"
          }
        </button>

        {/* Signup Link */}
        <p style={styles.text}>
          Don’t have an account?{" "}

          <Link
            to="/signup"
            style={styles.link}
          >
            Signup
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

export default Login;
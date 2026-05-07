import { useNavigate } from "react-router-dom";

function Landing() {

  const navigate = useNavigate();

  return (
    <div style={styles.container}>

      {/* Glow Effects */}
      <div style={styles.glow1}></div>
      <div style={styles.glow2}></div>

      {/* Main Content */}
      <div style={styles.content}>

        {/* Robot Image */}
        <img
          src="http://localhost:5173/robot.png"
          alt="Robot"
          style={styles.robot}
        />

        {/* Heading */}
        <h1 style={styles.title}>
          Because Reading The Whole Document Is 
          Overrated
        </h1>

        {/* Subtitle */}
        <p style={styles.subtitle}>
          Upload PDFs, ask questions,
          and get AI-powered semantic
          answers instantly with
          DocuMind AI.
        </p>

        {/* Button */}
        <button
          style={styles.button}
          onClick={() => navigate("/login")}
        >
          Get Started
        </button>

      </div>

    </div>
  );
}

const styles = {

  container: {
    height: "100vh",
    background:
      "linear-gradient(to bottom, #000000, #1e1b4b, #c4b5fd)",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  glow1: {
    width: "350px",
    height: "350px",
    background: "#7c3aed",
    borderRadius: "50%",
    filter: "blur(120px)",
    position: "absolute",
    top: "-100px",
    left: "-100px",
    opacity: 0.35,
  },

  glow2: {
    width: "350px",
    height: "350px",
    background: "#8b5cf6",
    borderRadius: "50%",
    filter: "blur(120px)",
    position: "absolute",
    bottom: "-100px",
    right: "-100px",
    opacity: 0.35,
  },

  content: {
    textAlign: "center",
    zIndex: 2,
    maxWidth: "1000px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  robot: {
    width: "90px",
    marginBottom: "24px",
  },

  title: {
    fontSize: "52px",
    fontWeight: "700",
    lineHeight: "1.15",
    marginBottom: "24px",
    color: "white",
    letterSpacing: "-2px",
  },

  subtitle: {
    fontSize: "18px",
    color: "#d1d5db",
    lineHeight: "1.8",
    marginBottom: "40px",
    maxWidth: "700px",
  },

  button: {
    padding: "16px 42px",
    fontSize: "16px",
    fontWeight: "600",
    borderRadius: "999px",
    border: "none",
    background: "white",
    color: "#422780",
    cursor: "pointer",
    boxShadow:
      "0 10px 30px rgba(255,255,255,0.2)",
  },
};

export default Landing;
import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div style={{
      minHeight: "70vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Google Sans', Roboto, Arial, sans-serif"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "2.5rem",
        maxWidth: "420px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        border: "1px solid #e0e0e0",
        textAlign: "center"
      }}>
        <h2 style={{ fontSize: "2rem", color: "#5E35B1", marginBottom: "1rem" }}>
          Welcome!
        </h2>
        <p style={{ color: "#757575", marginBottom: "2rem" }}>
          Your account has been created successfully.<br />
          You can now log in and start using the platform.
        </p>
        <Link
          to="/login"
          style={{
            display: "inline-block",
            background: "#5E35B1",
            color: "#fff",
            padding: "0.9rem 2rem",
            borderRadius: "8px",
            fontWeight: "600",
            textDecoration: "none",
            fontSize: "1rem"
          }}
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Welcome() {
  const { t } = useTranslation();
  
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
          {t('welcome.title')}
        </h2>
        <p style={{ color: "#757575", marginBottom: "2rem" }}>
          {t('welcome.message')}<br />
          {t('welcome.submessage')}
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
          {t('welcome.login')}
        </Link>
      </div>
    </div>
  );
}
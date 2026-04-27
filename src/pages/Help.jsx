import React from "react";

export default function HelpPage() {
  const cardStyle = {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid var(--border)",
    borderRadius: "22px",
    padding: "28px",
  };

  const itemStyle = {
    display: "block",
    color: "var(--text)",
    textDecoration: "none",
    fontSize: "1.05rem",
    marginBottom: "14px",
    lineHeight: "1.6",
  };

  return (
    <div className="container" style={{ color: "var(--text)", padding: "80px 20px 100px" }}>
      <section style={{ maxWidth: "860px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "800", marginBottom: "16px" }}>
          Көмек және байланыс
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1.1rem", marginBottom: "30px", lineHeight: "1.7" }}>
          Сұрақтарыңыз болса немесе платформа бойынша көмек керек болса, төмендегі байланыс
          арналары арқылы хабарласа аласыз.
        </p>

        <div style={cardStyle}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>Байланыс ақпараты</h2>
          <a href="mailto:alikhanmalikuly@gmail.com" style={itemStyle}>
            Email: alikhanmalikuly@gmail.com
          </a>
          <a href="tel:+77767904566" style={itemStyle}>
            Телефон: 8 776 790 4566
          </a>
          <a href="https://wa.me/77767904566" target="_blank" rel="noreferrer" style={itemStyle}>
            WhatsApp: Написать в WhatsApp
          </a>
          
          
        </div>
      </section>
    </div>
  );
}

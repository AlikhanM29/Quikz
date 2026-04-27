import React, { useState, useEffect } from "react";
import { APP_NAME, NAV_LINKS } from "../data/constants";

export default function Navbar({ page, setPage, user, canAccessTeacherPanel, onLogout }) {
  // Мүмкіндіктер бөлімінде тұрғанымызды қадағалау үшін стейт
  const [isFeaturesActive, setIsFeaturesActive] = useState(false);

  // Скроллды бақылау: Мүмкіндіктер бөліміне жеткенде батырманы көк қылу
  useEffect(() => {
    const handleScroll = () => {
      // Тек "home" бетінде болғанда ғана скроллды тексереміз
      if (page !== "home") {
        setIsFeaturesActive(false);
        return;
      }

      const element = document.getElementById("features");
      if (element) {
        const rect = element.getBoundingClientRect();
        // Егер "features" бөлімі экранның ортасына жақын болса
        if (rect.top <= 200 && rect.bottom >= 200) {
          setIsFeaturesActive(true);
        } else {
          setIsFeaturesActive(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page]); // page өзгергенде эффект қайта тексеріледі

  // Төменге жұмсақ жылжыту функциясы
  const scrollToFeatures = (e) => {
    e.preventDefault();
    setPage("home");
    
    setTimeout(() => {
      const element = document.getElementById("features");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <header className="nav">
      <div className="nav-inner">
        <span className="logo" onClick={() => { setPage("home"); window.scrollTo({top:0, behavior:'smooth'}); }} style={{ cursor: "pointer" }}>
          {APP_NAME}
        </span>
        
        <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {NAV_LINKS.map((link, i) => {
            // БАТЫРМА БЕЛСЕНДІ МЕ? 
            // 1. Егер бұл "Мүмкіндіктер" болса және скролл сол жерде тұрса
            // 2. Немесе бұл кәдімгі бет (мысалы: pricing, tests) болса
            const isActive = (link.name === "Мүмкіндіктер" && isFeaturesActive) || 
                             (link.page === page && link.name !== "Мүмкіндіктер");

            return (
              <a 
                key={i} 
                href={link.path || "#"} 
                onClick={(e) => {
                  if (link.name === "Мүмкіндіктер") {
                    scrollToFeatures(e);
                  } else if (link.page) {
                    e.preventDefault();
                    setPage(link.page);
                  }
                }}
                style={{ 
                  color: isActive ? "#007bff" : "var(--text)", 
                  textDecoration: "none", 
                  fontSize: "14px",
                  fontWeight: isActive ? "bold" : "normal",
                  transition: "0.3s",
                  borderBottom: isActive ? "2px solid #007bff" : "none",
                  paddingBottom: "5px"
                }}
              >
                {link.name}
              </a>
            );
          })}

          {/* Мұғалім панелі */}
          {canAccessTeacherPanel && (
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setPage("teacher"); }} 
              style={{ 
                color: page === "teacher" ? "#007bff" : "var(--green)",
                fontWeight: page === "teacher" ? "bold" : "normal",
                textDecoration: "none",
                fontSize: "14px",
                borderBottom: page === "teacher" ? "2px solid #007bff" : "none",
                paddingBottom: "5px"
              }}
            >
              Мұғалім панелі
            </a>
          )}
        </nav>
        
        <div className="auth-buttons" style={{ display: "flex", gap: "10px" }}>
          {user ? (
            <>
              <button 
                className="btn btn-primary" 
                onClick={() => setPage("profile")}
                style={{ backgroundColor: page === "profile" ? "#0056b3" : "" }}
              >
                {user.name.split(" ")[0]}
              </button>
              <button className="btn" style={{ border: "1px solid #ff4d4d", color: "#ff4d4d", background: 'transparent', cursor: 'pointer' }} onClick={onLogout}>Шығу</button>
            </>
          ) : (
            <>
              <button className="btn" style={{ color: page === "login" ? "#007bff" : "blue", background: 'transparent', cursor: 'pointer' }} onClick={() => setPage("login")}>Кіру</button>
              <button className="btn btn-primary" style={{ backgroundColor: page === "register" ? "#0056b3" : "" }} onClick={() => setPage("register")}>Тіркелу</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

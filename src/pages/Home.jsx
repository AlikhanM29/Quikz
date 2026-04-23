import React, { useEffect, useState } from "react";

export default function HomePage({ setPage, user }) {
  // Мұғалім екенін тексеру
  const isTeacher = user && user.role === 'teacher';

  const handleStartClick = (e) => {
    if (!user) {
      e.preventDefault();
      alert("Тесттерді көру үшін жүйеге кіріңіз!");
      setPage("login");
    } else {
      setPage("tests");
    }
  };

  // Карточка стилі үшін ортақ объект
  const cardStyle = {
    padding: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border)',
    borderRadius: '20px',
    transition: 'all 0.3s ease',
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  };

  return (
    <div className="container" style={{ color: 'var(--text)' }}>
      {/* Hero Section */}
      <section className="hero" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h1 style={{ fontSize: '3.8rem', lineHeight: '1.1', marginBottom: '25px', fontWeight: '800' }}>
          QuiKz: <span style={{ color: 'var(--green)' }}>Интеллектуалды</span><br />
          тест конструкторы
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.25rem', maxWidth: '750px', margin: '0 auto 40px', lineHeight: '1.6' }}>
          Жасанды интеллект негізінде тесттер жасаңыз және білімді тез әрі сапалы тексеріңіз. 
          Мұғалімдер мен студенттерге арналған заманауи шешім.
        </p>
        <button 
          onClick={() => setPage(user ? "tests" : "register")} 
          className="btn btn-primary"
          style={{ padding: '18px 50px', fontSize: '1.2rem', borderRadius: '14px', boxShadow: '0 10px 20px rgba(0, 123, 255, 0.3)' }}
        >
          Жұмысты бастау
        </button>
      </section>

      {/* Features Title */}
      <h2 id="features" className="section-title" style={{ textAlign: 'center', margin: '60px 0 40px', fontSize: '2.5rem', fontWeight: '700', scrollMarginTop: '100px' }}>
        Платформаның <span style={{ color: 'var(--green)' }}>мүмкіндіктері</span>
      </h2>

      {/* Mega Card / Features Grid */}
      <div className="features-container" style={{ marginBottom: '100px' }}>
        <div className="features-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '25px' 
        }}>
          
          {/* AI қабілеттері */}
          <div className="feature-item" style={cardStyle} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--green)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
            
            <h4 style={{ color: '#fff', fontSize: '1.3rem', margin: 0 }}>AI қабілеттері</h4>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: '1.5', margin: 0 }}>
              Жасанды интеллект мәтін бойынша автоматты түрде сұрақтар құрастырады және олардың қиындық деңгейін саралайды.
            </p>
          </div>
          
          {/* Кеңейтілген аналитика */}
          <div className="feature-item" style={cardStyle} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--blue)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
            
            <h4 style={{ color: '#fff', fontSize: '1.3rem', margin: 0 }}>Кеңейтілген аналитика</h4>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: '1.5', margin: 0 }}>
              Әр студенттің үлгерімін егжей-тегжейлі графиктер мен статистика арқылы бақылаңыз.
            </p>
          </div>

          {/* Бұлтты сақтау */}
          <div className="feature-item" style={cardStyle} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--green)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
            
            <h4 style={{ color: '#fff', fontSize: '1.3rem', margin: 0 }}>Бұлтты сақтау</h4>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: '1.5', margin: 0 }}>
              Тесттер мен нәтижелер кез келген құрылғыдан қолжетімді. Деректер жоғалуынан қорықпаңыз.
            </p>
          </div>

          {/* Ұсыныстар жүйесі */}
          <div className="feature-item" style={cardStyle} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--blue)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
            
            <h4 style={{ color: '#fff', fontSize: '1.3rem', margin: 0 }}>Ұсыныстар жүйесі</h4>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: '1.5', margin: 0 }}>
              Нәтижелерге сүйене отырып, AI студентке қай тақырыптарды қайталау керектігін айтады.
            </p>
          </div>

          {/* Мақсатты оқыту */}
          <div className="feature-item" style={cardStyle} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--green)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
            
            <h4 style={{ color: '#fff', fontSize: '1.3rem', margin: 0 }}>Мақсатты оқыту</h4>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: '1.5', margin: 0 }}>
              Студенттің әлсіз тұстарын анықтап, білім деңгейін көтеруге арналған жеке тапсырмалар.
            </p>
          </div>

          {/* Қауіпсіздік */}
          <div className="feature-item" style={cardStyle} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--blue)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
            
            <h4 style={{ color: '#fff', fontSize: '1.3rem', margin: 0 }}>Қауіпсіздік</h4>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: '1.5', margin: 0 }}>
              Деректер заманауи шифрлау хаттамаларымен қорғалған. Құпиялылыққа 100% кепілдік.
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer style={{ 
        textAlign: 'center', 
        padding: '60px 0', 
        borderTop: '1px solid var(--border)',
        marginTop: '40px'
      }}>
        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--green)', marginBottom: '15px' }}>QuiKz</div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>© 2026 Интеллектуалды білім беру платформасы</p>
      </footer>
    </div>
  );
}
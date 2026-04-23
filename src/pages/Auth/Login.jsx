import React, { useState } from "react";
import { getUsers } from "../../utils/storage";

export default function LoginPage({ setPage, setUser, showNotif }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // handleLogin функциясын асинхронды (async) қыламыз
  const handleLogin = async () => {
    if (!email || !password) return showNotif("Барлық өрісті толтырыңыз!");

    try {
      // Базадан қолданушыларды алу (күту - await)
      const users = await getUsers();
      
      // Табылған қолданушыны email мен password арқылы тексереміз
      const found = users.find(u => u.email === email && u.password === password);
      
      if (found) {
        setUser(found);
        showNotif("Қош келдіңіз!");
        // Кіргеннен кейін басты бетке немесе панельге өту логикасы
      } else {
        showNotif("Email немесе құпия сөз қате!");
      }
    } catch (error) {
      console.error("Кіру қатесі:", error);
      showNotif("Сервермен байланыс орнату мүмкін болмады!");
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      padding: '80px 20px', 
      backgroundColor: '#000000', 
      minHeight: '100vh' 
    }}>
      <div style={{ 
        background: '#ffffff', 
        padding: '40px', 
        borderRadius: '24px', 
        color: '#000000', 
        width: '100%', 
        maxWidth: '420px', 
        boxShadow: '0 10px 40px rgba(255, 255, 255, 0.1)' 
      }}>
        
        <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>Жүйеге кіру</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>Аккаунтқа кіріңіз</p>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Email</label>
          <input 
            className="form-input" 
            placeholder="example@mail.kz" 
            style={{ 
              width: '100%', 
              padding: '14px', 
              borderRadius: '12px', 
              border: '1px solid #ddd', 
              backgroundColor: '#f9f9f9', 
              color: '#000000', 
              boxSizing: 'border-box' 
            }}
            onChange={e => setEmail(e.target.value)} 
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Құпия сөз</label>
          <input 
            type="password"
            className="form-input" 
            placeholder="Құпия сөзіңіз" 
            style={{ 
              width: '100%', 
              padding: '14px', 
              borderRadius: '12px', 
              border: '1px solid #ddd', 
              backgroundColor: '#f9f9f9', 
              color: '#000000', 
              boxSizing: 'border-box' 
            }}
            onChange={e => setPassword(e.target.value)} 
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <input type="checkbox" id="remember" style={{ cursor: 'pointer' }} />
            <label htmlFor="remember" style={{ cursor: 'pointer' }}>Есте сақтау</label>
          </div>
          <span style={{ color: '#007bff', fontSize: '14px', cursor: 'pointer' }}>Құпия сөзді ұмыттыңыз ба?</span>
        </div>

        <button 
          className="btn btn-primary" 
          style={{ 
            width: '100%', 
            padding: '16px', 
            borderRadius: '12px', 
            fontSize: '18px', 
            fontWeight: 'bold', 
            backgroundColor: '#007bff', 
            border: 'none', 
            color: 'white', 
            cursor: 'pointer' 
          }} 
          onClick={handleLogin}
        >
          Кіру
        </button>

        <p style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
          Аккаунтыңыз жоқ па? <span style={{ color: '#007bff', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setPage("register")}>Тіркелу</span>
        </p>
      </div>
    </div>
  );
}
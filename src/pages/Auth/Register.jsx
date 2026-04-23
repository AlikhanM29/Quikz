import React, { useState } from "react";
import { getUsers, saveUsers } from "../../utils/storage";

export default function RegisterPage({ setPage, showNotif }) {
  const [role, setRole] = useState("student");
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({ 
    name: "", 
    phone: "", 
    email: "", 
    groupOrSubject: "", 
    password: "" 
  });

  // 1. handleSubmit-ті АСИНХРОНДЫ (async) қыламыз
  const handleSubmit = async () => { 
    if (!form.email || !form.password || !form.name) return showNotif("Барлық өрісті толтырыңыз!");
    
    try {
      // 2. Бұл жерде енді users.push қолданбаймыз. 
      // Тікелей жаңа объектіні saveUsers арқылы серверге жібереміз.
      const newUser = { ...form, role };
      
      // Серверге (PostgreSQL) жіберу
      await saveUsers(newUser); 

      // 3. Егер "Есте сақтау" белгіленсе, деректерді localStorage-қа сақтау
      if (rememberMe) {
        localStorage.setItem("rememberedUser", JSON.stringify(newUser));
      }

      showNotif("Сәтті тіркелдіңіз! ✓");
      setTimeout(() => setPage("login"), 1000);
    } catch (error) {
      console.error("Тіркелу қатесі:", error);
      showNotif("Тіркелу кезінде қате кетті. Серверді тексеріңіз!");
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid #ddd',
    backgroundColor: '#f9f9f9',
    boxSizing: 'border-box',
    marginBottom: '15px',
    fontSize: '16px'
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      padding: '50px 20px', 
      backgroundColor: '#000000', 
      minHeight: '100vh' 
    }}>
      <div style={{ 
        background: '#ffffff', 
        padding: '40px', 
        borderRadius: '24px', 
        color: '#000000', 
        width: '100%', 
        maxWidth: '450px', 
        boxShadow: '0 10px 40px rgba(255, 255, 255, 0.1)' 
      }}>
        
        <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>Тіркелу</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '25px' }}>Платформаға қосылыңыз</p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', backgroundColor: '#f0f0f0', padding: '5px', borderRadius: '12px' }}>
          <button 
            style={{
              flex: 1, padding: '12px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold',
              backgroundColor: role === 'student' ? '#007bff' : 'transparent',
              color: role === 'student' ? '#fff' : '#666',
              transition: '0.3s'
            }}
            onClick={() => setRole("student")}
          >ОҚУШЫ</button>
          <button 
            style={{
              flex: 1, padding: '12px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold',
              backgroundColor: role === 'teacher' ? '#007bff' : 'transparent',
              color: role === 'teacher' ? '#fff' : '#666',
              transition: '0.3s'
            }}
            onClick={() => setRole("teacher")}
          >МҰҒАЛІМ</button>
        </div>

        <input 
          style={inputStyle}
          placeholder="Аты-жөніңіз" 
          onChange={e => setForm({...form, name: e.target.value})} 
        />
        
        <input 
          style={inputStyle}
          placeholder="Телефон номері" 
          onChange={e => setForm({...form, phone: e.target.value})} 
        />

        <input 
          style={inputStyle}
          type="email"
          placeholder="Email" 
          onChange={e => setForm({...form, email: e.target.value})} 
        />

        <input 
          style={inputStyle}
          placeholder={role === "student" ? "Тобыңызды жазыңыз (мысалы: IT-101)" : "Беретін сабағыңыздың атауы"} 
          onChange={e => setForm({...form, groupOrSubject: e.target.value})} 
        />

        <input 
          style={inputStyle}
          type="password" 
          placeholder="Құпия сөз" 
          onChange={e => setForm({...form, password: e.target.value})} 
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '14px', color: '#666' }}>
          <input 
            type="checkbox" 
            id="remember" 
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            style={{ cursor: 'pointer', width: '18px', height: '18px' }} 
          />
          <label htmlFor="remember" style={{ cursor: 'pointer' }}>Есте сақтау</label>
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
          onClick={handleSubmit}
        >
          Тіркелу
        </button>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
          Аккаунтыңыз бар ма? <span style={{ color: '#007bff', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setPage("login")}>Кіру</span>
        </p>
      </div>
    </div>
  );
}
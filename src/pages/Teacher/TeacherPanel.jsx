import React, { useState, useEffect } from "react";
// Backend-пен жұмыс істейтін асинхронды функцияларды импорттаймыз
import { getQuizzes, saveQuizzes, getResults } from "../../utils/storage";
import * as XLSX from 'xlsx';

export default function TeacherPage({ user }) {
  const [tab, setTab] = useState("create");
  // Мәліметтерді сақтайтын стейттер
  const [results, setResults] = useState([]); 
  const [quizzes, setQuizzes] = useState([]);

  // Жаңа тест стейттері
  const [testTitle, setTestTitle] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const visibleResults = results.filter(
    (result) =>
      result?.student_name &&
      result?.test_title &&
      result?.score !== null &&
      result?.score !== undefined &&
      result?.total !== null &&
      result?.total !== undefined
  );
  const teacherIdentifier = user?.email || user?.id || user?.name || "";
  const teacherQuizzes = quizzes.filter((quiz) => {
    const quizTeacherIdentifier =
      quiz?.teacherEmail || quiz?.teacherId || quiz?.teacherName || "";

    if (teacherIdentifier && quizTeacherIdentifier) {
      return quizTeacherIdentifier === teacherIdentifier;
    }

    return false;
  });

  // ПАРАҚША АШЫЛҒАНДА МӘЛІМЕТТЕРДІ СЕРВЕРДЕН АЛУ
  useEffect(() => {
    const fetchData = async () => {
      try {
        const qData = await getQuizzes();
        const rData = await getResults();
        setQuizzes(Array.isArray(qData) ? qData : []);
        setResults(Array.isArray(rData) ? rData : []);
      } catch (err) {
        console.error("Мәлімет алу қатесі:", err);
      }
    };
    fetchData();
  }, [tab]); // tab өзгерген сайын мәліметті жаңартып тұрады

  const addOption = () => setOptions([...options, ""]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const exportToExcel = () => {
    if (visibleResults.length === 0) {
      alert("Жүктейтін мәлімет жоқ!");
      return;
    }

    const dataToExport = visibleResults.map(r => ({
      "Оқушы есімі": r.student_name, // Базада баған аты r.student_name болуы мүмкін
      "Тест атауы": r.test_title,
      "Балл": `${r.score}/${r.total}`,
      "Күні": r.test_date
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    XLSX.writeFile(workbook, "Quikz_Student_Results.xlsx");
  };

  // ТЕСТТІ БАЗАҒА (POSTGRESQL) САҚТАУ
  const handlePublish = async () => {
    if (!testTitle || !questionText || options.some(opt => opt === "")) {
      alert("Барлық өрістерді толтырыңыз!");
      return;
    }

    const newQuiz = {
      title: testTitle,
      teacherId: user?.id || null,
      teacherName: user?.name || "",
      teacherEmail: user?.email || "",
      questions: [
        {
          question: questionText,
          options: options,
          correct: correctAnswer
        }
      ]
    };

    try {
      await saveQuizzes(newQuiz); // storage.js арқылы серверге жіберу
      alert("Тест сәтті жарияланды!");
      
      // Форманы тазалау
      setTestTitle("");
      setQuestionText("");
      setOptions(["", ""]);
      setTab("stats");
    } catch (err) {
      alert("Тестті сақтау мүмкін болмады!");
    }
  };

  const sidebarItemStyle = (isActive) => ({
    width: '100%',
    padding: '12px 20px',
    marginBottom: '10px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: isActive ? 'rgba(0, 255, 0, 0.1)' : 'transparent',
    color: isActive ? '#00ff00' : '#888',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    fontSize: '1rem',
    textAlign: 'left',
    transition: '0.3s'
  });

  return (
    <div className="teacher-layout" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}>
      
      {/* Sidebar */}
      <div className="sidebar" style={{ width: '260px', borderRight: '1px solid #222', padding: '30px 20px' }}>
        <h2 style={{ color: '#00ff00', fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '40px', paddingLeft: '10px' }}>QuiKz</h2>
        <button style={sidebarItemStyle(tab === 'home')} onClick={() => setTab("home")}>🏠 Басты бет</button>
        <button style={sidebarItemStyle(tab === 'create')} onClick={() => setTab("create")}>📄 Менің тесттерім</button>
        <button style={sidebarItemStyle(tab === 'stats')} onClick={() => setTab("stats")}>📊 Статистика</button>
        <button style={sidebarItemStyle(tab === 'settings')} onClick={() => setTab("settings")}>⚙️ Баптаулар</button>
        <button className="sidebar-item" onClick={() => window.location.reload()} style={{ ...sidebarItemStyle(false), marginTop: 'auto', color: '#ff4d4d' }}>🚪 Шығу</button>
      </div>

      {/* Main Content */}
      <div className="teacher-content" style={{ flex: 1, padding: '50px 80px', overflowY: 'auto' }}>
        {tab === "home" && (
          <div>
            <h1 style={{ fontSize: '2.8rem', fontWeight: '800', marginBottom: '16px' }}>Басты бет</h1>
            <p style={{ color: '#888', marginBottom: '32px' }}>Мұнда сіз жасаған тесттер көрсетіледі.</p>

            {teacherQuizzes.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {teacherQuizzes.map((quiz, index) => (
                  <div
                    key={quiz.id || `${quiz.title}-${index}`}
                    style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '24px' }}
                  >
                    <div style={{ color: '#00ff00', fontSize: '0.9rem', marginBottom: '12px' }}>
                      Тест #{index + 1}
                    </div>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>{quiz.title || 'Атаусыз тест'}</h3>
                    <p style={{ color: '#888', margin: 0 }}>
                      Сұрақ саны: {Array.isArray(quiz.questions) ? quiz.questions.length : 0}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '28px', color: '#666' }}>
                Сіз жасаған тесттер әлі жоқ.
              </div>
            )}
          </div>
        )}
        
        {tab === "create" && (
          <div style={{ maxWidth: '800px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '40px' }}>Жаңа квиз құрастыру</h1>
            <div style={{ background: '#111', padding: '25px', borderRadius: '15px', marginBottom: '25px', border: '1px solid #222' }}>
              <label style={{ display: 'block', marginBottom: '15px', fontWeight: 'bold' }}>Тест атауы</label>
              <input 
                type="text" 
                placeholder="Мысалы: Математика тесті"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                style={{ width: '100%', background: '#080808', border: '1px solid #333', padding: '15px', borderRadius: '8px', color: '#fff' }}
              />
            </div>
            <div style={{ background: '#111', padding: '25px', borderRadius: '15px', border: '1px solid #222' }}>
              <label style={{ display: 'block', marginBottom: '15px', fontWeight: 'bold' }}>Сұрақ мәтіні</label>
              <textarea 
                placeholder="Сұрағыңызды жазыңыз..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                style={{ width: '100%', background: '#080808', border: '1px solid #333', padding: '15px', borderRadius: '8px', color: '#fff', minHeight: '120px', marginBottom: '20px' }}
              />
              <label style={{ display: 'block', marginBottom: '15px', fontWeight: 'bold' }}>Жауап нұсқалары (Дұрысын таңдаңыз)</label>
              {options.map((opt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '12px' }}>
                  <input 
                    type="radio" 
                    name="correctIdx" 
                    checked={correctAnswer === i} 
                    onChange={() => setCorrectAnswer(i)}
                    style={{ cursor: 'pointer', accentColor: '#00ff00', width: '20px', height: '20px' }}
                  />
                  <input 
                    type="text" 
                    value={opt}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    placeholder={`Жауап нұсқасы ${i + 1}`}
                    style={{ flex: 1, background: '#080808', border: '1px solid #333', padding: '12px', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
              ))}
              <button onClick={addOption} style={{ background: '#00ff00', color: '#000', border: 'none', padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', marginTop: '15px', cursor: 'pointer' }}>+ Жауап нұсқасын қосу</button>
              <button onClick={handlePublish} style={{ width: '100%', background: 'transparent', border: '1px solid #00ff00', color: '#00ff00', padding: '15px', borderRadius: '10px', fontWeight: 'bold', marginTop: '30px', cursor: 'pointer' }}>Тестті жариялау</button>
            </div>
          </div>
        )}

        {tab === "stats" && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h1 style={{ fontSize: '2.5rem' }}>Оқушылар нәтижесі</h1>
              <button 
                onClick={exportToExcel}
                style={{ background: '#00ff00', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Excel-ге жүктеу
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#111', borderRadius: '15px', overflow: 'hidden' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#888', borderBottom: '1px solid #222' }}>
                  <th style={{ padding: '20px' }}>Оқушы</th>
                  <th>Тест</th>
                  <th>Балл</th>
                  <th>Күні</th>
                </tr>
              </thead>
              <tbody>
                {visibleResults.length > 0 ? visibleResults.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '20px' }}>{r.student_name}</td>
                    <td>{r.test_title}</td>
                    <td style={{ color: '#00ff00', fontWeight: 'bold' }}>{r.score}/{r.total}</td>
                    <td style={{ color: '#666' }}>{r.test_date}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#555' }}>Әзірге нәтижелер жоқ</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  ); 
}

import React, { useState, useCallback } from "react";

// 1. Стильдерді импорттау
import { styles } from "./styles/globalStyles";

// 2. Логикалық функцияларды импорттау
import { applyUserProfileOverride, getCurrentUser, clearCurrentUser, setCurrentUser, hasTeacherAccess } from "./utils/storage";

// 3. Компоненттерді импорттау
import Navbar from "./components/Navbar";
import Notification from "./components/Notification";

// 4. Беттерді импорттау
import HomePage from "./pages/Home";
import LoginPage from "./pages/Auth/Login";
import RegisterPage from "./pages/Auth/Register";
import TestsPage from "./pages/Student/Tests";
import QuizPage from "./pages/Student/Quiz";
import ProfilePage from "./pages/Student/Profile";
import HelpPage from "./pages/Help";
import TeacherPage from "./pages/Teacher/TeacherPanel";
// Файл аты PricingPage.jsx болса, импорт та дәл солай болуы керек:
import PricingPage from "./pages/PricingPage"; 

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(() => getCurrentUser());
  const [currentTest, setCurrentTest] = useState(null);
  const [notif, setNotif] = useState("");
  const canAccessTeacherPanel = hasTeacherAccess(user);

  const showNotif = useCallback((msg) => {
    setNotif(msg);
    setTimeout(() => setNotif(""), 2500);
  }, []);

  const handleSetUser = (u) => {
    const hydratedUser = applyUserProfileOverride(u);
    setCurrentUser(hydratedUser);
    setUser(hydratedUser);
    setPage("home");
  };

  const handleLogout = () => {
    clearCurrentUser();
    setUser(null);
    setPage("home");
    showNotif("Жүйеден шықтыңыз");
  };

  return (
    <>
      <style>{styles}</style>
      <Notification msg={notif} />
      
      {page !== "teacher" && (
        <Navbar 
          page={page} 
          setPage={setPage} 
          user={user} 
          canAccessTeacherPanel={canAccessTeacherPanel}
          onLogout={handleLogout} 
        />
      )}

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {page === "home" && <HomePage setPage={setPage} user={user} />}
        {page === "login" && <LoginPage setPage={setPage} setUser={handleSetUser} showNotif={showNotif} />}
        {page === "register" && <RegisterPage setPage={setPage} showNotif={showNotif} />}
        {page === "pricing" && <PricingPage user={user} setUser={setUser} showNotif={showNotif} setPage={setPage} />}
        {page === "help" && <HelpPage />}
        {page === "tests" && <TestsPage setPage={setPage} setCurrentTest={setCurrentTest} user={user} />}
        {page === "quiz" && <QuizPage testId={currentTest} user={user} setPage={setPage} showNotif={showNotif} />}
        {page === "profile" && <ProfilePage user={user} setPage={setPage} setUser={setUser} showNotif={showNotif} />}
        {page === "teacher" && canAccessTeacherPanel && <TeacherPage user={user} />}
      </main>
    </>
  );
}

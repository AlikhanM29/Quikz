import React, { useEffect, useState } from "react";
import { TESTS } from "../../data/quizData";
import { getQuizzes } from "../../utils/storage";

export default function TestsPage({ setPage, setCurrentTest, user }) {
  const [allTests, setAllTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadTests = async () => {
      const staticTests = [...TESTS];

      try {
        const quizzesData = await getQuizzes();
        const localQuizzes = Array.isArray(quizzesData) ? quizzesData : [];

        const formattedLocalTests = localQuizzes.map((quiz) => ({
          id: quiz.id,
          title: quiz.title,
          icon: "\uD83D\uDCDD",
          desc: "Teacher-created test",
        }));

        setAllTests([...staticTests, ...formattedLocalTests]);
      } catch (error) {
        console.error("Failed to load quizzes:", error);
        setAllTests(staticTests);
      }
    };

    loadTests();
  }, []);

  const handleStart = (id) => {
    if (!user) {
      alert("Login is required to take a test.");
      setPage("login");
      return;
    }

    setCurrentTest(id);
    setPage("quiz");
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredTests = allTests.filter((test) => {
    if (!normalizedQuery) {
      return true;
    }

    const title = (test.title || "").toLowerCase();
    const desc = (test.desc || "").toLowerCase();
    return title.includes(normalizedQuery) || desc.includes(normalizedQuery);
  });

  return (
    <div style={{ padding: "40px" }}>
      <h2 className="section-title">
        All <span style={{ color: "var(--green)" }}>tests</span>
      </h2>

      <div style={{ marginTop: "24px", marginBottom: "10px" }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search tests by title or description"
          className="form-input"
          style={{
            width: "100%",
            maxWidth: "520px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "white",
          }}
        />
      </div>

      <div
        className="card-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "25px",
          marginTop: "30px",
        }}
      >
        {filteredTests.map((test) => (
          <div
            key={test.id}
            className="card"
            style={{
              background: "var(--surface)",
              padding: "30px",
              borderRadius: "20px",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: "40px", marginBottom: "15px" }}>{test.icon}</div>
              <h3 style={{ marginBottom: "10px" }}>{test.title}</h3>
              <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "20px" }}>
                {test.desc}
              </p>
            </div>
            <button
              className="btn btn-green"
              style={{ width: "100%" }}
              onClick={() => handleStart(test.id)}
            >
              Start
            </button>
          </div>
        ))}
      </div>

      {filteredTests.length === 0 && (
        <p style={{ color: "var(--muted)", marginTop: "24px" }}>
          No tests found for "{searchQuery}".
        </p>
      )}
    </div>
  );
}

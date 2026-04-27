import React, { useEffect, useState } from "react";
import { QUIZ_DATA, TESTS } from "../../data/quizData";
import { getQuizzes, saveResults } from "../../utils/storage";

export default function QuizPage({ testId, user, setPage }) {
  const [allQuestions, setAllQuestions] = useState([]);
  const [testTitle, setTestTitle] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const loadQuiz = async () => {
      let currentQuestions = QUIZ_DATA[testId] || [];
      let currentTest = TESTS.find((test) => test.id === testId);

      if (currentQuestions.length === 0) {
        try {
          const quizzesData = await getQuizzes();
          const localQuizzes = Array.isArray(quizzesData) ? quizzesData : [];
          const foundQuiz = localQuizzes.find((quiz) => quiz.id === testId);

          if (foundQuiz) {
            currentQuestions = (foundQuiz.questions || []).map((question) => ({
              q: question.question,
              options: Array.isArray(question.options) ? question.options : [],
              answer: Array.isArray(question.options)
                ? question.options[question.correct]
                : undefined,
            }));
            currentTest = { title: foundQuiz.title };
          }
        } catch (error) {
          console.error("Failed to load quiz:", error);
        }
      }

      setAllQuestions(Array.isArray(currentQuestions) ? currentQuestions : []);
      setTestTitle(currentTest?.title || "Test");
    };

    loadQuiz();
  }, [testId]);

  const handleAnswerSelect = (questionIndex, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  const handleSubmit = () => {
    let nextScore = 0;

    allQuestions.forEach((question, index) => {
      if (answers[index] === question.answer) {
        nextScore += 1;
      }
    });

    setScore(nextScore);
    setSubmitted(true);

    saveResults({
      name: user?.name || "User",
      test: testTitle,
      score: nextScore,
      total: allQuestions.length,
      date: new Date().toLocaleDateString(),
    });
  };

  const answeredCount = Object.keys(answers).length;
  const progress = allQuestions.length > 0 ? Math.round((answeredCount / allQuestions.length) * 100) : 0;
  const scorePercent = allQuestions.length > 0 ? Math.round((score / allQuestions.length) * 100) : 0;

  if (submitted) {
    return (
      <div style={{ padding: "48px 20px 80px" }}>
        <div
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            background:
              "radial-gradient(circle at top, rgba(57, 255, 20, 0.16), transparent 35%), linear-gradient(180deg, #181818 0%, #101010 100%)",
            border: "1px solid rgba(57, 255, 20, 0.18)",
            borderRadius: "28px",
            padding: "48px 32px",
            textAlign: "center",
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.35)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              border: "2px solid rgba(57, 255, 20, 0.35)",
              background: "rgba(57, 255, 20, 0.08)",
              color: "var(--green)",
              fontSize: "2rem",
              fontWeight: "800",
              marginBottom: "24px",
            }}
          >
            {score}/{allQuestions.length}
          </div>

          <div
            style={{
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: "999px",
              background: "rgba(0, 123, 255, 0.12)",
              border: "1px solid rgba(0, 123, 255, 0.22)",
              color: "#8cc2ff",
              fontSize: "0.9rem",
              marginBottom: "18px",
            }}
          >
            Result: {scorePercent}%
          </div>

          <h1 style={{ fontSize: "2.6rem", marginBottom: "12px" }}>{testTitle}</h1>
          <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: "1.7", maxWidth: "540px", margin: "0 auto 30px" }}>
            Test completed. Your result has been saved and you can return to the list of available tests.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            <button className="btn btn-green" onClick={() => setPage("tests")} style={{ padding: "14px 28px" }}>
              Back to tests
            </button>
            <button
              className="btn"
              onClick={() => setPage("profile")}
              style={{
                padding: "14px 28px",
                background: "transparent",
                color: "white",
                border: "1px solid var(--border)",
              }}
            >
              Open profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 20px 80px" }}>
      <div style={{ maxWidth: "980px", margin: "0 auto" }}>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            background:
              "linear-gradient(135deg, rgba(0, 123, 255, 0.18) 0%, rgba(57, 255, 20, 0.08) 100%), #111",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "28px",
            padding: "32px",
            marginBottom: "28px",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.28)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(57,255,20,0.18), transparent 65%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "20px",
              flexWrap: "wrap",
              marginBottom: "24px",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-block",
                  padding: "8px 14px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#b8b8b8",
                  fontSize: "0.9rem",
                  marginBottom: "16px",
                }}
              >
                Interactive quiz session
              </div>
              <h1 style={{ fontSize: "2.4rem", lineHeight: "1.1", marginBottom: "12px" }}>{testTitle}</h1>
              <p style={{ color: "#b7b7b7", maxWidth: "620px", lineHeight: "1.7" }}>
                Answer each question carefully. Selected variants are highlighted, and your final score will be saved after submission.
              </p>
            </div>

            <div
              style={{
                minWidth: "180px",
                background: "rgba(0,0,0,0.18)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "18px",
              }}
            >
              <div style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "8px" }}>Progress</div>
              <div style={{ fontSize: "1.8rem", fontWeight: "800", marginBottom: "8px" }}>
                {answeredCount}/{allQuestions.length}
              </div>
              <div style={{ color: "#a8a8a8", fontSize: "0.95rem" }}>{progress}% completed</div>
            </div>
          </div>

          <div style={{ height: "10px", borderRadius: "999px", background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                borderRadius: "999px",
                background: "linear-gradient(90deg, var(--blue) 0%, var(--green) 100%)",
                transition: "width 0.25s ease",
              }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gap: "20px" }}>
          {allQuestions.map((question, index) => (
            <div
              key={index}
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 100%)",
                border: "1px solid var(--border)",
                borderRadius: "24px",
                padding: "28px",
                boxShadow: "0 14px 30px rgba(0, 0, 0, 0.18)",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "42px",
                  height: "42px",
                  padding: "0 14px",
                  borderRadius: "999px",
                  background: "rgba(0, 123, 255, 0.12)",
                  border: "1px solid rgba(0, 123, 255, 0.18)",
                  color: "#8bc1ff",
                  fontWeight: "700",
                  marginBottom: "18px",
                }}
              >
                Q{index + 1}
              </div>

              <h3 style={{ fontSize: "1.35rem", lineHeight: "1.45", marginBottom: "22px" }}>{question.q}</h3>

              <div style={{ display: "grid", gap: "12px" }}>
                {question.options.map((option, optionIndex) => {
                  const isSelected = answers[index] === option;

                  return (
                    <label
                      key={`${option}-${optionIndex}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "16px 18px",
                        borderRadius: "18px",
                        border: isSelected ? "1px solid rgba(57, 255, 20, 0.4)" : "1px solid rgba(255,255,255,0.08)",
                        background: isSelected ? "rgba(57, 255, 20, 0.08)" : "#111",
                        cursor: "pointer",
                        transition: "0.2s ease",
                      }}
                    >
                      <input
                        type="radio"
                        name={`q${index}`}
                        checked={isSelected}
                        onChange={() => handleAnswerSelect(index, option)}
                        style={{
                          accentColor: "#39FF14",
                          width: "18px",
                          height: "18px",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "50%",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: isSelected ? "rgba(57,255,20,0.18)" : "rgba(255,255,255,0.05)",
                          color: isSelected ? "var(--green)" : "#a5a5a5",
                          fontWeight: "700",
                          flexShrink: 0,
                        }}
                      >
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <span style={{ lineHeight: "1.5", color: isSelected ? "white" : "#d3d3d3" }}>{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "28px",
            background: "#101010",
            border: "1px solid var(--border)",
            borderRadius: "24px",
            padding: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "8px" }}>Ready to finish?</div>
            <div style={{ fontSize: "1.2rem", fontWeight: "700" }}>
              Answered {answeredCount} of {allQuestions.length} questions
            </div>
          </div>

          <button
            className="btn btn-green"
            style={{
              minWidth: "220px",
              padding: "16px 24px",
              fontSize: "1rem",
              boxShadow: "0 12px 28px rgba(57, 255, 20, 0.18)",
              opacity: allQuestions.length === 0 ? 0.6 : 1,
            }}
            onClick={handleSubmit}
            disabled={allQuestions.length === 0}
          >
            {allQuestions.length === 0 ? "Loading questions..." : "Finish and see result"}
          </button>
        </div>
      </div>
    </div>
  );
}

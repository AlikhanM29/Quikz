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

  if (submitted) {
    return (
      <div className="score-card" style={{ textAlign: "center", padding: "50px" }}>
        <h1 style={{ fontSize: "72px", color: "var(--green)" }}>
          {score}/{allQuestions.length}
        </h1>
        <p>Test completed.</p>
        <button className="btn btn-primary" onClick={() => setPage("tests")}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-wrap" style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
      <h2>{testTitle}</h2>
      {allQuestions.map((question, index) => (
        <div
          key={index}
          className="question-card"
          style={{ margin: "20px 0", padding: "20px", background: "var(--surface)", borderRadius: "12px" }}
        >
          <p>
            {index + 1}. {question.q}
          </p>
          {question.options.map((option) => (
            <label key={option} style={{ display: "block", margin: "10px 0", cursor: "pointer" }}>
              <input
                type="radio"
                name={`q${index}`}
                onChange={() => setAnswers({ ...answers, [index]: option })}
              />{" "}
              {option}
            </label>
          ))}
        </div>
      ))}
      <button
        className="btn btn-green"
        style={{ width: "100%", marginTop: "20px" }}
        onClick={handleSubmit}
        disabled={allQuestions.length === 0}
      >
        {allQuestions.length === 0 ? "Loading questions..." : "See result"}
      </button>
    </div>
  );
}

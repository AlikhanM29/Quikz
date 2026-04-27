import React, { useState } from "react";
import { saveUserProfile } from "../utils/storage";

const plans = [
  {
    id: "student-free",
    name: "Студент",
    price: "Тегін",
    period: "",
    description: "Жеке оқушылар мен студенттерге арналған бастапқы жоспар.",
    features: [
      "Айына 10 AI тест жасау",
      "Шексіз тест тапсыру",
      "Негізгі статистика",
      "100 МБ бұлтты сақтау",
    ],
    buttonText: "Тегін бастау",
    recommended: false,
    color: "var(--muted)",
    type: "free",
  },
  {
    id: "teacher-pro",
    name: "Оқытушы PRO",
    price: "4 900 ₸",
    period: "/айына",
    description: "Мұғалімдер мен репетиторларға арналған толық жоспар.",
    features: [
      "Шексіз AI тест жасау",
      "Студенттер тобын басқару",
      "Кеңейтілген аналитика",
      "PDF форматына жүктеу",
      "Басым қолдау",
    ],
    buttonText: "PRO таңдау",
    recommended: true,
    color: "var(--blue)",
    type: "paid",
  },
  {
    id: "school-business",
    name: "Мектеп / Орталық",
    price: "19 900 ₸",
    period: "/айына",
    description: "Оқу орындары мен ірі орталықтарға арналған тариф.",
    features: [
      "Барлық PRO мүмкіндіктер",
      "Ортақ мектеп базасы",
      "Админ панелі",
      "API интеграциясы",
      "Жеке куратор",
    ],
    buttonText: "Тарифті таңдау",
    recommended: false,
    color: "var(--green)",
    type: "paid",
  },
];

const paymentMethods = [
  {
    id: "kaspi",
    name: "Kaspi Gold",
    description: "Қазақстандағы пайдаланушылар үшін жылдам төлем.",
  },
  {
    id: "card",
    name: "Банк картасы",
    description: "Visa немесе Mastercard картасымен төлеу.",
  },
  {
    id: "invoice",
    name: "WhatsApp арқылы төлем",
    description: "Төлем реквизиттері WhatsApp арқылы жіберіледі.",
  },
];

export default function PricingPage({ user, setUser, showNotif, setPage }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("kaspi");

  const closeCheckout = () => {
    setSelectedPlan(null);
    setSelectedMethod("kaspi");
  };

  const activatePlan = (plan, method) => {
    if (!user) {
      showNotif?.("Алдымен аккаунтқа кіріңіз.");
      setPage?.("login");
      return;
    }

    const paymentMethodLabel = paymentMethods.find((item) => item.id === method)?.name || method;

    const updatedUser = saveUserProfile(user, {
      currentPlan: plan.name,
      currentPlanId: plan.id,
      planPrice: plan.price,
      paymentMethod: paymentMethodLabel,
      planStatus: "Active",
      planActivatedAt: new Date().toISOString(),
    });

    setUser?.(updatedUser);
    showNotif?.(plan.type === "free" ? "Тегін тариф қосылды." : "Тариф пен төлем тәсілі сақталды.");
    closeCheckout();
    setPage?.("profile");
  };

  const handlePlanClick = (plan) => {
    if (plan.type === "free") {
      activatePlan(plan, "free");
      return;
    }

    setSelectedPlan(plan);
  };

  return (
    <div className="container" style={{ padding: "80px 20px", color: "var(--text)" }}>
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "800", marginBottom: "20px" }}>
          Өзіңізге ыңғайлы <span style={{ color: "var(--green)" }}>тарифті</span> таңдаңыз
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1.2rem", maxWidth: "700px", margin: "0 auto" }}>
          Енді тарифтер батырмалары жұмыс істейді: жоспарды таңдауға, төлем тәсілін белгілеуге
          және оны профиліңізге сақтауға болады.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "30px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              background: "var(--surface)",
              padding: "40px",
              borderRadius: "24px",
              border: plan.recommended ? `2px solid ${plan.color}` : "1px solid var(--border)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.3s ease",
              transform: plan.recommended ? "scale(1.05)" : "scale(1)",
            }}
          >
            {plan.recommended && (
              <span
                style={{
                  position: "absolute",
                  top: "-15px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: plan.color,
                  color: "#fff",
                  padding: "5px 20px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Ең тиімді
              </span>
            )}

            <h3 style={{ fontSize: "1.8rem", marginBottom: "10px" }}>{plan.name}</h3>
            <div style={{ marginBottom: "20px" }}>
              <span style={{ fontSize: "2.5rem", fontWeight: "800" }}>{plan.price}</span>
              <span style={{ color: "var(--muted)" }}>{plan.period}</span>
            </div>
            <p style={{ color: "var(--muted)", marginBottom: "30px", fontSize: "0.95rem" }}>{plan.description}</p>

            <ul style={{ listStyle: "none", padding: 0, marginBottom: "40px", flex: 1 }}>
              {plan.features.map((feature) => (
                <li key={feature} style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: plan.color }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePlanClick(plan)}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "12px",
                border: "none",
                backgroundColor: plan.recommended ? plan.color : "rgba(255,255,255,0.05)",
                color: "#fff",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      <div
        style={{
          maxWidth: "1100px",
          margin: "40px auto 0",
          padding: "28px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid var(--border)",
          borderRadius: "22px",
        }}
      >
        <h2 style={{ marginBottom: "18px" }}>Төлем тәсілдері</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              style={{
                background: "#111",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "18px",
              }}
            >
              <div style={{ fontWeight: "700", marginBottom: "8px" }}>{method.name}</div>
              <div style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: "1.6" }}>{method.description}</div>
            </div>
          ))}
        </div>
      </div>

      {selectedPlan && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.72)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 200,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "560px",
              background: "#101010",
              border: "1px solid var(--border)",
              borderRadius: "24px",
              padding: "30px",
            }}
          >
            <h2 style={{ fontSize: "2rem", marginBottom: "10px" }}>{selectedPlan.name}</h2>
            <p style={{ color: "var(--muted)", marginBottom: "6px" }}>
              Бағасы: {selectedPlan.price}
              {selectedPlan.period}
            </p>
            <p style={{ color: "var(--muted)", marginBottom: "24px", lineHeight: "1.6" }}>
              Төлем әдісін таңдаңыз. Бұл таңдау профиліңізге сақталады.
            </p>

            <div style={{ display: "grid", gap: "12px", marginBottom: "26px" }}>
              {paymentMethods.map((method) => {
                const active = selectedMethod === method.id;

                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    style={{
                      textAlign: "left",
                      padding: "16px",
                      borderRadius: "14px",
                      border: active ? "1px solid var(--green)" : "1px solid var(--border)",
                      background: active ? "rgba(57, 255, 20, 0.08)" : "#151515",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: "700", marginBottom: "4px" }}>{method.name}</div>
                    <div style={{ color: "var(--muted)", fontSize: "0.92rem" }}>{method.description}</div>
                  </button>
                );
              })}
            </div>

            {selectedMethod === "invoice" && (
              <div
                style={{
                  background: "#141414",
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  padding: "16px",
                  color: "var(--muted)",
                  marginBottom: "22px",
                  lineHeight: "1.6",
                }}
              >
                WhatsApp для оплаты:{" "}
                <a href="https://wa.me/77767904566" target="_blank" rel="noreferrer" style={{ color: "var(--green)" }}>
                  8 776 790 4566
                </a>
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button type="button" onClick={() => activatePlan(selectedPlan, selectedMethod)} className="btn btn-green" style={{ padding: "14px 22px" }}>
                Төлем тәсілін сақтау
              </button>
              <button
                type="button"
                onClick={closeCheckout}
                className="btn"
                style={{
                  padding: "14px 22px",
                  background: "transparent",
                  color: "white",
                  border: "1px solid var(--border)",
                }}
              >
                Бас тарту
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

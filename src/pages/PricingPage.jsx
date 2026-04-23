import React from "react";

export default function PricingPage() {
  const plans = [
    {
      name: "Студент",
      price: "Тегін",
      description: "Жеке оқушылар мен студенттерге арналған",
      features: [
        "Айына 10 AI тест жасау",
        "Шектеусіз тест тапсыру",
        "Қарапайым статистика",
        "Бұлтты сақтау (100 МБ)"
      ],
      buttonText: "Тегін бастау",
      recommended: false,
      color: "var(--muted)"
    },
    {
      name: "Оқытушы",
      price: "4 900 ₸",
      period: "/айына",
      description: "Мұғалімдер мен репетиторларға арналған",
      features: [
        "Шектеусіз AI тест жасау",
        "Студенттер тобын басқару",
        "Кеңейтілген аналитика",
        "PDF форматында жүктеу",
        "Басымдықты қолдау"
      ],
      buttonText: "Про-ны таңдау",
      recommended: true, // Ортадағы карточканы ерекшелеу
      color: "var(--blue)"
    },
    {
      name: "Мектеп / Орталық",
      price: "19 900 ₸",
      period: "/айына",
      description: "Оқу орындары мен ірі орталықтар үшін",
      features: [
        "Барлық PRO мүмкіндіктер",
        "Ортақ мектеп базасы",
        "Админ панелі",
        "API интеграциясы",
        "Жеке куратор"
      ],
      buttonText: "Байланысу",
      recommended: false,
      color: "var(--green)"
    }
  ];

  return (
    <div className="container" style={{ padding: '80px 20px', color: 'var(--text)' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px' }}>
          Өзіңізге ыңғайлы <span style={{ color: 'var(--green)' }}>тарифті</span> таңдаңыз
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Білім деңгейіңіз бен мақсатыңызға қарай оңтайлы шешімді таңдап, тиімді оқытуды бастаңыз.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '30px',
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        {plans.map((plan, index) => (
          <div 
            key={index} 
            style={{ 
              background: 'var(--surface)', 
              padding: '40px', 
              borderRadius: '24px', 
              border: plan.recommended ? `2px solid ${plan.color}` : '1px solid var(--border)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease',
              transform: plan.recommended ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            {plan.recommended && (
              <span style={{ 
                position: 'absolute', 
                top: '-15px', 
                left: '50%', 
                transform: 'translateX(-50%)', 
                background: plan.color, 
                color: '#fff', 
                padding: '5px 20px', 
                borderRadius: '20px', 
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                Ең тиімді
              </span>
            )}

            <h3 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{plan.name}</h3>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '800' }}>{plan.price}</span>
              <span style={{ color: 'var(--muted)' }}>{plan.period}</span>
            </div>
            <p style={{ color: 'var(--muted)', marginBottom: '30px', fontSize: '0.95rem' }}>{plan.description}</p>
            
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '40px', flex: 1 }}>
              {plan.features.map((feature, i) => (
                <li key={i} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: plan.color }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button style={{ 
              width: '100%', 
              padding: '15px', 
              borderRadius: '12px', 
              border: 'none', 
              backgroundColor: plan.recommended ? plan.color : 'rgba(255,255,255,0.05)', 
              color: '#fff', 
              fontSize: '1rem', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              transition: '0.3s'
            }}>
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '60px', color: 'var(--muted)' }}>
        <p>Сұрақтарыңыз бар ма? <span style={{ color: 'var(--blue)', cursor: 'pointer' }}>Бізге жазыңыз</span></p>
      </div>
    </div>
  );
}
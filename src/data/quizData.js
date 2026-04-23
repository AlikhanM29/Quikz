export const QUIZ_DATA = {
  python: [
    { q: "Python-да айнымалыны қалай жариялаймыз?", options: ["var x = 5", "x = 5", "int x = 5", "let x = 5"], answer: "x = 5" },
    { q: "Қайсысы цикл операторы?", options: ["if", "for", "def", "class"], answer: "for" },
    { q: "Функция қалай анықталады?", options: ["function foo():", "def foo():", "func foo():", "void foo():"], answer: "def foo():" }
  ],
  java: [
    { q: "Java-да класс қалай басталады?", options: ["class MyClass {", "new MyClass {", "def MyClass {", "object MyClass {"], answer: "class MyClass {" },
    { q: "Негізгі метод қалай аталады?", options: ["main()", "start()", "public static void main", "init()"], answer: "public static void main" }
  ],
  web: [
    { q: "HTML-да тақырып тегі?", options: ["<head>", "<h1>", "<title>", "<header>"], answer: "<h1>" },
    { q: "CSS-та түс қалай беріледі?", options: ["text-color: red", "color: red", "font-color: red", "colour: red"], answer: "color: red" }
  ]
};

export const TESTS = [
  { id: "python", title: "Python негіздері", desc: "Синтаксис пен базалық білім.", level: "beginner", icon: "🐍" },
  { id: "java", title: "Java OOP", desc: "Объектіге бағытталған бағдарламалау.", level: "medium", icon: "☕" },
  { id: "web", title: "Web Design", desc: "HTML және CSS негіздері.", level: "beginner", icon: "🌐" }
];
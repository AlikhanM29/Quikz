export const APP_NAME = "QuiKz";

export const FEATURES = [
  { title: "AI қабілеттері", desc: "Жасанды интеллект автоматты түрде сұрақтар жасайды." },
  { title: "Кеңейтілген аналитика", desc: "Толық статистика және прогресті бақылау." },
  { title: "Бұлтты сақтау", desc: "Барлық деректер қауіпсіз серверлерде сақталады." },
  { title: "Ұсыныстар жүйесі", desc: "Жеке даму жоспарын ұсынады." },
];

export const NAV_LINKS = [
  { name: "Мүмкіндіктер", path: "#features" }, // Бұл Navbar-дағы scrollToFeatures функциясын іске қосады
  { name: "Тарифтер", page: "pricing" },      // 'path' орнына 'page' қостық
  { name: "Тесттер", page: "tests" },
  { name: "Көмек", page: "help" },             // Болашақта көмек бетін жасасаң, осылай қалады
];
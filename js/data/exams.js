/* Список вариантов пробного экзамена. Сами задания лежат в exam1.js, exam2.js, exam3.js
   и загружаются только при выборе варианта. Все тексты и вопросы оригинальные. */
const EXAM_LIST = [
  {
    id: "v1", file: "exam1", title: "Вариант 1",
    topics: {
      listening: "аренда коттеджа · общественный сад · шум в городе · история стекла",
      reading: "история карандаша · городские «острова тепла» · перегрузка выбором",
      writing: "линейный график: велосипед в трёх городах · эссе о машинах в центре",
      speaking: "родной город · полезная техника"
    }
  },
  {
    id: "v2", file: "exam2", title: "Вариант 2",
    topics: {
      listening: "курсы языка · парк дикой природы · отчёт о поездке · коралловые рифы",
      reading: "вертикальные фермы · исчезающие языки · как формируются привычки",
      writing: "столбчатая диаграмма: досуг по возрастам · эссе о стареющем населении",
      speaking: "работа или учёба · запомнившаяся поездка"
    }
  },
  {
    id: "v3", file: "exam3", title: "Вариант 3",
    topics: {
      listening: "бюро находок · волонтёры в библиотеке · кафе как бизнес-кейс · миграция птиц",
      reading: "история чая · микропластик · творчество машин",
      writing: "круговые диаграммы: энергия в доме · эссе о выборе специальности",
      speaking: "чтение · учитель, который повлиял на вас"
    }
  }
];

// Бесплатные официальные материалы для практики.
const OFFICIAL_TESTS = [
  { name: "IELTS.org — Academic sample test questions", org: "IELTS (British Council, IDP, Cambridge)", url: "https://ielts.org/take-a-test/preparation-resources/sample-test-questions/academic-test", note: "Официальные примеры заданий Listening, Reading, Writing и Speaking." },
  { name: "British Council — Free practice and mock tests", org: "British Council", url: "https://takeielts.britishcouncil.org/prepare/ielts-free-practice-mock-tests", note: "Бесплатные тесты по каждой части экзамена с ответами." },
  { name: "British Council — IELTS Familiarisation Test", org: "British Council", url: "https://takeielts.britishcouncil.org/prepare/ielts-free-practice-mock-tests/ielts-familiarisation-test", note: "Как выглядит экзамен на компьютере: все четыре части." },
  { name: "British Council — IELTS Ready", org: "British Council", url: "https://takeielts.britishcouncil.org/prepare/ielts-ready", note: "Бесплатные тесты Listening и Reading с баллами; нужна регистрация." },
  { name: "IDP — Free practice tests", org: "IDP", url: "https://ielts.idp.com/prepare/article-free-practice-tests", note: "Пробные тесты Academic и General Training с ответами." },
  { name: "Cambridge English — IELTS preparation", org: "Cambridge University Press & Assessment", url: "https://www.cambridgeenglish.org/exams-and-tests/ielts/preparation/", note: "Материалы и советы от разработчиков экзамена." }
];

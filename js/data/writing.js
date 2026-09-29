/* Задания Writing, полезные фразы и чек-лист. */
const WRITING = {
  task1: [
    {
      id: "t1-internet",
      title: "Line graph — Internet use by age group",
      prompt: "The table below shows the percentage of people in one country who used the internet daily, by age group, in 2005, 2012 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
      table: {
        head: ["Age group", "2005", "2012", "2020"],
        rows: [["16–24", "58%", "86%", "98%"], ["25–44", "41%", "79%", "96%"], ["45–64", "22%", "55%", "84%"], ["65+", "5%", "21%", "57%"]]
      }
    },
    {
      id: "t1-energy",
      title: "Table — Household energy sources",
      prompt: "The table below shows the proportion of household energy that came from four different sources in one city in 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
      table: {
        head: ["Source", "2000", "2020"],
        rows: [["Gas", "54%", "38%"], ["Electricity (grid)", "30%", "27%"], ["Solar", "2%", "24%"], ["Wood / other", "14%", "11%"]]
      }
    }
  ],
  task2: [
    { id: "t2-remote", type: "Discuss both views", prompt: "Some people believe that working from home benefits both employees and employers, while others think it has more disadvantages. Discuss both views and give your own opinion." },
    { id: "t2-tourism", type: "Advantages / disadvantages", prompt: "International tourism has grown rapidly in recent decades. Do the advantages of this trend outweigh the disadvantages?" },
    { id: "t2-uni", type: "Agree / disagree", prompt: "University education should be free for all students. To what extent do you agree or disagree?" },
    { id: "t2-screens", type: "Problem / solution", prompt: "Children today spend more time using electronic devices than playing outdoors. What problems does this cause, and what can be done to address them?" },
    { id: "t2-cities", type: "Two-part question", prompt: "More and more people are moving from rural areas to cities. Why is this happening? Is it a positive or negative development?" },
    { id: "t2-environment", type: "Agree / disagree", prompt: "Individuals can do little to improve the environment; only governments and large companies can make a real difference. To what extent do you agree or disagree?" }
  ],
  phrases: {
    "Введение": ["It is often argued that…", "In recent years, there has been a growing debate about…", "This essay will discuss both views before reaching a conclusion.", "I strongly believe that…"],
    "Аргументы": ["One major advantage of… is that…", "Another compelling reason is…", "This is largely because…", "A clear example of this is…"],
    "Контраргумент": ["On the other hand,…", "Admittedly,…", "Critics of this view point out that…", "Nevertheless,…"],
    "Заключение": ["In conclusion,…", "To sum up, while…, I believe that…", "Overall, the benefits clearly outweigh the drawbacks."],
    "Task 1": ["The table illustrates…", "Overall, it is clear that…", "…rose sharply from X to Y", "…remained stable at around…", "By contrast,…", "…accounted for the largest proportion of…"]
  },
  checklist: [
    "Я ответил(а) на все части вопроса (Task Response)",
    "Есть чёткая позиция во введении и в заключении",
    "Каждый абзац — одна главная идея + пример",
    "Использую связки, но не перебарщиваю (Coherence)",
    "Нет повторов одних и тех же слов — есть синонимы (Lexical Resource)",
    "Есть сложные предложения: придаточные, условные, пассив (Grammar)",
    "Task 1: есть overview с главными тенденциями, без личного мнения",
    "Проверил(а) артикли, времена и согласование подлежащего и сказуемого"
  ]
};

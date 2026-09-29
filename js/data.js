/* Учебные материалы. Все тексты оригинальные и написаны в формате IELTS Academic. */

const READING = [
  {
    id: "bees",
    title: "The Return of the Urban Beekeeper",
    level: "Band 5.5–6.5",
    minutes: 20,
    paragraphs: [
      ["A", "For most of the twentieth century, beekeeping was regarded as an essentially rural activity. Hives were kept on farms and in orchards, where bees had easy access to large fields of flowering crops. Cities, with their concrete surfaces and polluted air, were assumed to be hostile environments for insects of any kind. Over the past two decades, however, this assumption has been turned on its head. Rooftop hives can now be found on hotels, office blocks and even government buildings in London, Paris, New York and Tokyo."],
      ["B", "One reason for the trend is that cities can, surprisingly, offer bees a richer diet than the countryside. Modern agriculture tends to rely on vast areas planted with a single crop, which flowers for only a few weeks each year. Once the blossom is over, bees in these regions may struggle to find food. Urban parks, private gardens, balconies and roadside verges, by contrast, contain an enormous variety of plants that flower at different times, providing a steady supply of nectar and pollen from early spring until late autumn."],
      ["C", "Pesticide use is another factor. Many farmers apply chemical treatments to protect their crops, and some of these substances have been linked to a decline in bee health. In several European cities, local authorities have banned or restricted pesticides in public green spaces, which means urban colonies may be exposed to fewer harmful chemicals than their rural counterparts. Researchers in Paris reported that city hives there produced, on average, considerably more honey per colony than hives in the surrounding farmland."],
      ["D", "Not everyone is convinced that the boom in urban beekeeping is entirely positive. Some ecologists warn that honeybees, which are managed by humans, compete for the same flowers as thousands of species of wild bees. In areas where the number of hives has risen sharply, there may simply not be enough food to go around. A study in London found that the density of hives in parts of the city had grown faster than the availability of flowering plants, raising concerns that wild pollinators were being pushed out."],
      ["E", "For this reason, many experts now argue that the most useful thing city dwellers can do is not to install a hive, but to plant more flowers. Choosing plants that bloom at different points in the year, leaving areas of grass uncut, and avoiding chemical sprays in gardens can all help to support both honeybees and wild species. Some cities have begun to create 'pollinator corridors' — continuous strips of flowering vegetation that allow insects to move safely from one green space to another."],
      ["F", "Whatever its long-term effects, the urban beekeeping movement has undoubtedly raised public awareness. Schools use hives to teach children about ecosystems, and companies that host rooftop colonies often report that employees become more interested in environmental issues. As one beekeeper in Berlin put it, 'The honey is a bonus. The real product is people who start to notice the flowers around them.'"]
    ],
    questions: [
      { type: "info", text: "Questions 1–5. Do the following statements agree with the information given in the passage? Write TRUE, FALSE or NOT GIVEN." },
      { type: "tfng", text: "In the past, cities were thought to be unsuitable places for bees.", answer: "TRUE" },
      { type: "tfng", text: "Rooftop hives are now more common in Tokyo than in London.", answer: "NOT GIVEN" },
      { type: "tfng", text: "Single-crop farms provide food for bees throughout the whole year.", answer: "FALSE" },
      { type: "tfng", text: "Some European cities have limited the use of pesticides in public parks.", answer: "TRUE" },
      { type: "tfng", text: "Hives in Paris produced less honey than hives in nearby rural areas.", answer: "FALSE" },
      { type: "info", text: "Questions 6–9. Choose the correct letter, A, B, C or D." },
      { type: "mcq", text: "What concern do some ecologists have about urban beekeeping?", options: ["Honeybees may spread disease to people.", "Honeybees may take food that wild bees need.", "City honey may contain pollution.", "Rooftop hives may be dangerous in strong winds."], answer: 1 },
      { type: "mcq", text: "According to the London study, the number of hives", options: ["was lower than official records suggested.", "had stayed the same for ten years.", "increased more quickly than the number of flowering plants.", "was highest in areas with the most parks."], answer: 2 },
      { type: "mcq", text: "What do many experts recommend city residents should do?", options: ["Install a hive on every rooftop.", "Buy locally produced honey.", "Grow a wider range of flowering plants.", "Report wild bee nests to the council."], answer: 2 },
      { type: "mcq", text: "The Berlin beekeeper suggests that the main benefit of urban hives is", options: ["the income from selling honey.", "the improvement in air quality.", "the increase in wild bee numbers.", "a change in how people view nature."], answer: 3 },
      { type: "info", text: "Questions 10–13. Complete the sentences. Choose NO MORE THAN TWO WORDS from the passage for each answer." },
      { type: "gap", text: "Urban areas offer bees a supply of nectar and pollen from early spring until late ______.", answer: ["autumn"] },
      { type: "gap", text: "Some cities are creating pollinator ______ so that insects can travel between green spaces.", answer: ["corridors"] },
      { type: "gap", text: "Leaving some areas of ______ uncut can help pollinators.", answer: ["grass"] },
      { type: "gap", text: "Schools use hives to teach children about ______.", answer: ["ecosystems"] }
    ]
  },
  {
    id: "sleep",
    title: "Sleep and the Making of Memories",
    level: "Band 6.5–7.5",
    minutes: 20,
    paragraphs: [
      ["A", "It has long been observed that people who sleep well tend to learn more effectively, but only in recent decades have scientists begun to understand why. The prevailing view today is that sleep is not a passive state in which the brain simply rests. Instead, it is a period of intense activity during which newly acquired information is sorted, strengthened and integrated with existing knowledge — a process researchers call memory consolidation."],
      ["B", "Sleep is made up of several stages that repeat in cycles of roughly ninety minutes. Two of these stages appear to be especially important for memory. During deep, or slow-wave, sleep, the brain produces large, slow electrical waves. Experiments suggest that this stage is crucial for consolidating factual knowledge, such as vocabulary or historical dates. Rapid eye movement (REM) sleep, which is associated with vivid dreaming, seems to play a larger role in emotional memories and in the learning of skills and procedures."],
      ["C", "One of the most influential findings came from studies of the hippocampus, a small structure deep within the brain. Recordings from animals showed that patterns of neural activity produced while the animals explored a maze were 'replayed' during subsequent sleep, often at a much faster speed. This replay is thought to transfer memories from the hippocampus, which acts as a temporary store, to the neocortex, where they can be kept for the long term."],
      ["D", "The practical implications for students are considerable. In one experiment, participants learned pairs of words in the evening and were tested the next morning; they recalled significantly more than a group who learned the same pairs in the morning and were tested after a day awake. Even a short daytime nap of sixty to ninety minutes has been shown to improve performance on some memory tasks, provided it includes a period of slow-wave sleep."],
      ["E", "Conversely, sleep deprivation appears to harm learning in two ways. First, it reduces the brain's capacity to absorb new information the following day; one study estimated a drop of around forty per cent in the ability to form new memories. Second, missing sleep after learning prevents consolidation from taking place, so that material studied late into the night may be poorly retained. The common student habit of staying up all night before an examination may therefore be counterproductive."],
      ["F", "Not all questions have been resolved. Scientists still debate whether sleep actively strengthens memories or mainly protects them from interference by new experiences. It is also unclear why some individuals seem to function well on very little sleep. Nevertheless, the evidence is strong enough that many researchers now describe sleep as an essential part of learning rather than an interruption to it."]
    ],
    questions: [
      { type: "info", text: "Questions 1–5. Which paragraph contains the following information? Write the correct letter, A–F." },
      { type: "para", text: "a description of how brain activity from a task is repeated during sleep", answer: "C" },
      { type: "para", text: "an explanation of why studying all night before a test may not help", answer: "E" },
      { type: "para", text: "a reference to issues that scientists have not yet agreed on", answer: "F" },
      { type: "para", text: "the length of a typical sleep cycle", answer: "B" },
      { type: "para", text: "a comparison between two groups who learned at different times of day", answer: "D" },
      { type: "info", text: "Questions 6–9. Do the following statements agree with the claims of the writer? Write YES, NO or NOT GIVEN." },
      { type: "yng", text: "Sleep is best described as a time when the brain is inactive.", answer: "NO" },
      { type: "yng", text: "REM sleep is more closely linked to learning skills than to learning facts.", answer: "YES" },
      { type: "yng", text: "Naps are more effective than night-time sleep for memory.", answer: "NOT GIVEN" },
      { type: "yng", text: "There is enough evidence to regard sleep as part of the learning process.", answer: "YES" },
      { type: "info", text: "Questions 10–13. Complete the summary. Choose ONE WORD OR A NUMBER from the passage for each answer." },
      { type: "gap", text: "The process by which new information is strengthened during sleep is known as memory ______.", answer: ["consolidation"] },
      { type: "gap", text: "The hippocampus serves as a ______ store for memories.", answer: ["temporary"] },
      { type: "gap", text: "Memories are moved to the ______ for long-term storage.", answer: ["neocortex"] },
      { type: "gap", text: "Lack of sleep may reduce the ability to form new memories by about ______ per cent.", answer: ["forty", "40"] }
    ]
  }
];

const LISTENING = [
  {
    id: "gym",
    title: "Section 1 — Joining a sports centre",
    desc: "Телефонный разговор: заполните анкету нового клиента.",
    voices: { A: "Receptionist", B: "Caller" },
    script: [
      ["A", "Good morning, Riverside Sports Centre. How can I help you?"],
      ["B", "Hi, I'd like to find out about becoming a member, please."],
      ["A", "Of course. I can take a few details now and set up a membership for you. Could I have your name?"],
      ["B", "Yes, it's Daniel Kowalski."],
      ["A", "Could you spell your surname for me?"],
      ["B", "Sure. K, O, W, A, L, S, K, I."],
      ["A", "Thank you. And what's your address, Daniel?"],
      ["B", "It's 42 Hazel Road, in Westbury."],
      ["A", "Hazel, like the tree?"],
      ["B", "That's right, H, A, Z, E, L."],
      ["A", "Lovely. And a contact phone number?"],
      ["B", "My mobile is 0 7 7 0 0, 9 1 5, 3 6 2."],
      ["A", "Great. Now, we have three types of membership. Standard is thirty-two pounds a month and lets you use the gym and pool. Off-peak is twenty-five pounds, but you can only come before four in the afternoon on weekdays. And Premium is forty-five pounds, which includes all fitness classes."],
      ["B", "I work until five, so off-peak won't work for me. I'm not really interested in classes, so I'll go for standard, please."],
      ["A", "No problem. How did you hear about us?"],
      ["B", "A colleague recommended you, actually. She swims here most mornings."],
      ["A", "That's nice to hear. When would you like to start?"],
      ["B", "Could I start next Monday? That's the fourteenth, I think."],
      ["A", "Yes, Monday the fourteenth. You'll need to come in for an induction session before you use the gym equipment. Is there anything we should know about, any injuries?"],
      ["B", "I had a problem with my knee last year, but it's much better now."],
      ["A", "I'll make a note of that for the trainer. Finally, please bring a passport-sized photo for your membership card when you come in."],
      ["B", "Will do. Thanks very much."]
    ],
    questions: [
      { type: "info", text: "Complete the form. Write ONE WORD AND/OR A NUMBER for each answer." },
      { type: "gap", text: "Surname: ______", answer: ["kowalski"] },
      { type: "gap", text: "Address: 42 ______ Road, Westbury", answer: ["hazel"] },
      { type: "gap", text: "Mobile: 07700 ______", answer: ["915362", "915 362"] },
      { type: "gap", text: "Membership type chosen: ______", answer: ["standard"] },
      { type: "gap", text: "Monthly cost: £______", answer: ["32", "thirty-two", "thirty two"] },
      { type: "gap", text: "Heard about the centre from a ______", answer: ["colleague"] },
      { type: "gap", text: "Start date: Monday the ______", answer: ["14th", "14", "fourteenth"] },
      { type: "gap", text: "Health note: previous problem with ______", answer: ["knee", "his knee"] },
      { type: "gap", text: "Must bring: a ______ for the membership card", answer: ["photo", "photograph", "passport-sized photo", "passport photo"] }
    ]
  },
  {
    id: "museum",
    title: "Section 2 — Guided tour of a city museum",
    desc: "Монолог гида: ответьте на вопросы с выбором ответа и заполните пропуски.",
    voices: { A: "Guide" },
    script: [
      ["A", "Good afternoon, everyone, and welcome to the Harbour Museum. My name is Claire and I'll be showing you around today. The tour will last about an hour and a quarter, and we'll finish in the café on the ground floor."],
      ["A", "Before we start, just a few practical points. Photography is allowed in most rooms, but please don't use flash, as it can damage the older paintings. Bags larger than a small backpack need to be left in the lockers next to the main entrance. They cost one pound, which you'll get back when you return the key."],
      ["A", "The museum building itself was originally a customs house, built in 1846, where taxes were collected on goods arriving by ship. It became a museum in 1972, after the port moved further down the river."],
      ["A", "We'll begin on the first floor, in the Maritime Gallery. The highlight there is a model of a nineteenth-century sailing ship, which took a local craftsman eleven years to build. After that, we'll move to the Trade Room, where you can see spices, tea and textiles that passed through the port."],
      ["A", "On the second floor is our newest exhibition, called Voices of the Docks. It's based on interviews with people who worked at the harbour, and you can listen to their stories using the headphones provided. Many visitors tell us it's the most moving part of the museum."],
      ["A", "Finally, a reminder that the museum shop is offering a fifteen per cent discount today for anyone on a guided tour. Just show your tour sticker at the till. Right, if you'd like to follow me up the stairs..."]
    ],
    questions: [
      { type: "info", text: "Questions 1–3. Choose the correct letter, A, B or C." },
      { type: "mcq", text: "How long will the tour last?", options: ["45 minutes", "an hour and a quarter", "an hour and a half"], answer: 1 },
      { type: "mcq", text: "Visitors are asked not to", options: ["take any photographs.", "use flash photography.", "touch the paintings."], answer: 1 },
      { type: "mcq", text: "What was the building originally used for?", options: ["a customs house", "a warehouse for ships", "a sailors' hotel"], answer: 0 },
      { type: "info", text: "Questions 4–8. Write ONE WORD AND/OR A NUMBER for each answer." },
      { type: "gap", text: "Locker fee: £______ (returned later)", answer: ["1", "one"] },
      { type: "gap", text: "The building became a museum in ______", answer: ["1972"] },
      { type: "gap", text: "The model ship took ______ years to build", answer: ["11", "eleven"] },
      { type: "gap", text: "'Voices of the Docks' is based on ______ with harbour workers", answer: ["interviews"] },
      { type: "gap", text: "Shop discount for tour members: ______ %", answer: ["15", "fifteen"] }
    ]
  }
];

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

const SPEAKING = {
  part1: [
    { topic: "Home", qs: ["Do you live in a house or an apartment?", "What is your favourite room in your home? Why?", "Would you like to move to a different home in the future?", "What would you change about where you live?"] },
    { topic: "Work or study", qs: ["Do you work or are you a student?", "Why did you choose that subject / job?", "What do you enjoy most about it?", "Is there anything you would like to change about it?"] },
    { topic: "Weather", qs: ["What's the weather usually like where you live?", "Do you prefer hot or cold weather?", "Does the weather ever affect your mood?", "What do you like to do on rainy days?"] },
    { topic: "Music", qs: ["What kind of music do you like?", "Did you learn to play an instrument as a child?", "Do you prefer listening to music alone or with others?", "Has your taste in music changed over the years?"] },
    { topic: "Technology", qs: ["How often do you use your phone?", "What apps do you use most?", "Could you live without the internet for a week?", "Do you think older people find technology difficult?"] }
  ],
  part2: [
    { title: "Describe a book you have read that you found interesting.", points: ["what the book was", "when you read it", "what it was about", "and explain why you found it interesting."], part3: ["Do people read less than they used to?", "What are the advantages of e-books over printed books?", "Should schools make children read classic literature?"] },
    { title: "Describe a place you visited that you would like to go back to.", points: ["where it was", "when you went there", "what you did there", "and explain why you would like to return."], part3: ["Why do people enjoy travelling to new places?", "How has tourism changed in your country?", "Can tourism damage local culture?"] },
    { title: "Describe a person who has had an important influence on your life.", points: ["who this person is", "how you know them", "what they have done", "and explain how they have influenced you."], part3: ["Who has more influence on young people: parents or friends?", "Are celebrities good role models?", "How do role models change as people get older?"] },
    { title: "Describe a skill you would like to learn.", points: ["what the skill is", "why you want to learn it", "how you would learn it", "and explain how it would help you."], part3: ["Is it better to learn skills from a teacher or online?", "Which skills will be most important in the future?", "Are older people slower at learning new skills?"] },
    { title: "Describe a time when you helped someone.", points: ["who you helped", "when and where it happened", "how you helped them", "and explain how you felt about it."], part3: ["Should people be taught to help others at school?", "Why do some people volunteer their time?", "Do people help neighbours less than in the past?"] }
  ],
  tips: [
    "Part 1: отвечайте 2–3 предложениями — ответ + причина + пример.",
    "Part 2: за 1 минуту подготовки запишите ключевые слова, а не предложения.",
    "Part 2: говорите полные 2 минуты — если закончили раньше, добавьте историю или чувства.",
    "Part 3: давайте развёрнутые ответы, сравнивайте прошлое и настоящее, приводите общие примеры.",
    "Не заучивайте ответы наизусть — экзаменаторы это слышат.",
    "Если не поняли вопрос, можно попросить: \"Could you repeat the question, please?\""
  ]
};

/* Таблицы перевода сырых баллов (из 40) в band — приблизительные, как в официальных пособиях. */
const BAND_TABLES = {
  listening: [[39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5], [16, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [2, 2], [1, 1], [0, 0]],
  readingAcademic: [[39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5], [23, 6], [19, 5.5], [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [2, 2], [1, 1], [0, 0]],
  readingGeneral: [[40, 9], [39, 8.5], [37, 8], [36, 7.5], [34, 7], [32, 6.5], [30, 6], [27, 5.5], [23, 5], [19, 4.5], [15, 4], [12, 3.5], [9, 3], [6, 2.5], [3, 2], [1, 1], [0, 0]]
};

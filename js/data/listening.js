/* Listening в формате IELTS: 4 части, 40 вопросов. Тексты оригинальные.
   speakers: id, имя и пол (для подбора голоса). Части объявляет диктор. */
const LISTENING = {
  readSeconds: 30,   // время на чтение вопросов перед каждой частью
  gapSeconds: 5,     // пауза между частями
  parts: [
    {
      id: "part1",
      title: "Part 1 — Joining a sports centre",
      kind: "Бытовой диалог",
      intro: "Part 1. You will hear a telephone conversation between a receptionist at a sports centre and a man who wants to join. First, you have some time to look at questions 1 to 10.",
      speakers: [
        { id: "A", name: "Receptionist", gender: "f" },
        { id: "B", name: "Daniel", gender: "m" }
      ],
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
        ["B", "That's right. H, A, Z, E, L."],
        ["A", "Lovely. And a contact phone number?"],
        ["B", "My mobile is oh-seven-seven-oh-oh, nine-one-five, three-six-two."],
        ["A", "Great. Now, we have three types of membership. Standard is thirty-two pounds a month and lets you use the gym and the pool. Off-peak is twenty-five pounds, but you can only come before four in the afternoon on weekdays. And Premium is forty-five pounds, which includes all the fitness classes."],
        ["B", "I work until five, so off-peak won't work for me. And I'm not really interested in classes, so I'll go for standard, please."],
        ["A", "No problem. And how did you hear about us?"],
        ["B", "A colleague recommended you, actually. She swims here most mornings."],
        ["A", "That's nice to hear. When would you like to start?"],
        ["B", "Could I start next Monday? That's the fourteenth, I think."],
        ["A", "Yes, Monday the fourteenth. But before you use the gym equipment, you'll need an induction session with one of our trainers. We run them on Tuesday and Wednesday evenings."],
        ["B", "Tuesdays are difficult for me, so Wednesday evening, please."],
        ["A", "Wednesday it is. Is there anything the trainer should know about? Any injuries?"],
        ["B", "I had a problem with my knee last year, but it's much better now."],
        ["A", "I'll make a note of that. Finally, please bring a passport-sized photo for your membership card when you come in."],
        ["B", "Will do. Thanks very much."]
      ],
      questions: [
        { type: "info", text: "Questions 1–10. Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer." },
        { type: "gap", text: "Surname: ______", answer: ["Kowalski"] },
        { type: "gap", text: "Address: 42 ______ Road, Westbury", answer: ["Hazel"] },
        { type: "gap", text: "Mobile: 07700 ______", answer: ["915362", "915 362"] },
        { type: "gap", text: "Membership type: ______", answer: ["standard"] },
        { type: "gap", text: "Monthly cost: £______", answer: ["32", "thirty-two", "thirty two"] },
        { type: "gap", text: "Heard about the centre from a ______", answer: ["colleague"] },
        { type: "gap", text: "Start date: Monday the ______", answer: ["14th", "14", "fourteenth"] },
        { type: "gap", text: "Induction session: ______ evening", answer: ["Wednesday"] },
        { type: "gap", text: "Health note: previous problem with his ______", answer: ["knee"] },
        { type: "gap", text: "Must bring: a ______ for the membership card", answer: ["photo", "photograph", "passport photo"] }
      ]
    },
    {
      id: "part2",
      title: "Part 2 — A guided tour of a museum",
      kind: "Монолог на бытовую тему",
      intro: "Part 2. You will hear a guide talking to a group of visitors at a city museum. First, you have some time to look at questions 11 to 20.",
      speakers: [{ id: "A", name: "Guide", gender: "f" }],
      script: [
        ["A", "Good afternoon, everyone, and welcome to the Harbour Museum. My name is Claire and I'll be showing you around today. The tour will last about an hour and a quarter."],
        ["A", "Before we start, just a few practical points. Photography is allowed in most rooms, but please don't use flash, as it can damage the older paintings. Bags larger than a small backpack need to be left in the lockers next to the main entrance. They cost one pound, which you'll get back when you return the key."],
        ["A", "The building itself was originally a customs house, built in 1846, where taxes were collected on goods arriving by ship. It became a museum in 1972, after the port moved further down the river."],
        ["A", "Now, a quick guide to the layout. Here on the ground floor you'll find the café, which is where our tour will finish. We'll begin upstairs on the first floor, in the Maritime Gallery. The highlight there is a model of a nineteenth-century sailing ship, which took a local craftsman eleven years to build."],
        ["A", "On the second floor is our newest exhibition, called Voices of the Docks. It's based on interviews with people who worked at the harbour, and you can listen to their stories on headphones. Many visitors say it's the most moving part of the museum."],
        ["A", "If you have children with you, they might enjoy the activity room. People often expect it to be on the top floor, but it's actually in the basement, next to the old storage vaults."],
        ["A", "Finally, the museum shop is offering a fifteen per cent discount today for anyone on a guided tour. Just show your tour sticker at the till. Right, if you'd like to follow me up the stairs."]
      ],
      questions: [
        { type: "info", text: "Questions 11–12. Choose the correct letter, A, B or C." },
        { type: "mcq", text: "Visitors are asked not to", options: ["take any photographs.", "use flash photography.", "touch the paintings."], answer: 1 },
        { type: "mcq", text: "What was the building originally used for?", options: ["a customs house", "a warehouse for ships", "a hotel for sailors"], answer: 0 },
        { type: "info", text: "Questions 13–16. Where in the museum is each place? Choose the correct letter, A–D.", list: [["A", "ground floor"], ["B", "first floor"], ["C", "second floor"], ["D", "basement"]] },
        { type: "match", text: "the café", options: "ABCD", answer: "A" },
        { type: "match", text: "the Maritime Gallery", options: "ABCD", answer: "B" },
        { type: "match", text: "Voices of the Docks", options: "ABCD", answer: "C" },
        { type: "match", text: "the children's activity room", options: "ABCD", answer: "D" },
        { type: "info", text: "Questions 17–20. Complete the notes. Write ONE WORD AND/OR A NUMBER for each answer." },
        { type: "gap", text: "Locker fee: £______ (returned later)", answer: ["1", "one"] },
        { type: "gap", text: "The building became a museum in ______", answer: ["1972"] },
        { type: "gap", text: "The model ship took ______ years to build", answer: ["11", "eleven"] },
        { type: "gap", text: "Shop discount for tour members: ______ %", answer: ["15", "fifteen"] }
      ]
    },
    {
      id: "part3",
      title: "Part 3 — Planning a research project",
      kind: "Учебная дискуссия",
      intro: "Part 3. You will hear two students, Maya and Tom, discussing their research project with their tutor. First, you have some time to look at questions 21 to 30.",
      speakers: [
        { id: "A", name: "Tutor", gender: "m" },
        { id: "B", name: "Maya", gender: "f" },
        { id: "C", name: "Tom", gender: "m" }
      ],
      script: [
        ["A", "So, Maya, Tom, how is the project on food waste in the canteen coming along?"],
        ["B", "Quite well, I think. We've decided to focus on lunchtime, because that's when the canteen serves the most meals."],
        ["A", "Sensible. And what's your main research question?"],
        ["C", "At first we wanted to compare waste across all three campus canteens, but that turned out to be far too ambitious for six weeks. So now we're asking why students leave food on their plates in the main canteen."],
        ["A", "Good, that's much more manageable. Have you thought about your methods?"],
        ["B", "Yes, we've got a few ideas. The first is a questionnaire for students."],
        ["A", "Questionnaires are quick to distribute, but people don't always tell the truth about how much they throw away. I suspect the data might be unreliable."],
        ["C", "We also thought about weighing the food that's left on plates each day."],
        ["A", "That would give you hard numbers, which is excellent. In fact, it's probably the most useful thing you could do. Just check with the kitchen manager first."],
        ["B", "What about interviews with the kitchen staff?"],
        ["A", "They'd be interesting, but interviews take a long time to arrange and transcribe. With only six weeks, I think they'd be too time-consuming."],
        ["C", "And we wondered about taking photographs of plates before they're cleared."],
        ["A", "Hmm. Be careful there. If students appear in the pictures without permission, that could cause ethical problems."],
        ["B", "Right. And finally, simply observing students while they eat?"],
        ["A", "Observation is cheap, but on its own it won't tell you why food is wasted. I'd use it only to support your other data."],
        ["C", "Okay. Another thing: we're not sure how to present the results."],
        ["A", "For a project like this, I'd suggest a poster rather than a long written report. The department is holding an exhibition in May."],
        ["B", "A poster sounds good. Tom is better at design than I am."],
        ["C", "That's true, but Maya is much better with statistics, so she's going to do the analysis."],
        ["A", "That sounds like a sensible division of labour. Let's meet again in two weeks to look at your first results."]
      ],
      questions: [
        { type: "info", text: "Questions 21–25. Choose the correct letter, A, B or C." },
        { type: "mcq", text: "Why did the students choose to focus on lunchtime?", options: ["Most meals are served then.", "The canteen is quietest then.", "Their tutor suggested it."], answer: 0 },
        { type: "mcq", text: "Why did they change their original research question?", options: ["The canteen manager refused to help.", "It was too ambitious.", "They found a similar study."], answer: 1 },
        { type: "mcq", text: "Their research question is now about", options: ["the cost of wasted food.", "why students leave food.", "how other universities reduce waste."], answer: 1 },
        { type: "mcq", text: "How does the tutor suggest they present their results?", options: ["in a written report", "in a presentation", "on a poster"], answer: 2 },
        { type: "mcq", text: "Who will be responsible for the statistical analysis?", options: ["Maya", "Tom", "the tutor"], answer: 0 },
        {
          type: "info",
          text: "Questions 26–30. What does the tutor say about each research method? Choose FIVE answers from the list, A–F.",
          list: [["A", "the most useful method"], ["B", "may produce unreliable data"], ["C", "too time-consuming"], ["D", "could cause ethical problems"], ["E", "should only support other data"], ["F", "too expensive"]]
        },
        { type: "match", text: "questionnaire", options: "ABCDEF", answer: "B" },
        { type: "match", text: "weighing leftover food", options: "ABCDEF", answer: "A" },
        { type: "match", text: "interviews with staff", options: "ABCDEF", answer: "C" },
        { type: "match", text: "photographs of plates", options: "ABCDEF", answer: "D" },
        { type: "match", text: "observation", options: "ABCDEF", answer: "E" }
      ]
    },
    {
      id: "part4",
      title: "Part 4 — Lecture: biomimicry in architecture",
      kind: "Академическая лекция",
      intro: "Part 4. You will hear a lecture about biomimicry in architecture. First, you have some time to look at questions 31 to 40.",
      speakers: [{ id: "A", name: "Lecturer", gender: "m" }],
      script: [
        ["A", "Good morning. Today I want to talk about biomimicry, which means designing things by copying ideas from nature. The word comes from the Greek 'bios', meaning life, and 'mimesis', meaning imitation."],
        ["A", "Architects have become increasingly interested in biomimicry because buildings use a huge amount of energy. In many countries, they account for around forty per cent of total energy consumption, much of it for heating and cooling."],
        ["A", "One of the best-known examples is the Eastgate Centre in Harare, Zimbabwe. Its design was inspired by termite mounds. Termites keep the temperature inside their mounds remarkably stable by allowing air to flow through a system of tunnels."],
        ["A", "The Eastgate Centre copies this idea, and as a result, it uses about ninety per cent less energy for cooling than a conventional building of the same size."],
        ["A", "Another source of inspiration is the lotus leaf. Its surface is covered in tiny bumps that cause water to roll off, carrying dirt with it. Engineers have used this principle to develop a paint that keeps buildings clean without chemicals."],
        ["A", "Nature can also help with the problem of strength. Some researchers are studying the structure of bones, which are light but very strong, in order to design beams that use less material."],
        ["A", "Of course, biomimicry has its limitations. Copying a natural system is often expensive at the research stage, and some designs are difficult to build using standard construction methods. There is also a risk that the word is used simply as a marketing tool."],
        ["A", "Nevertheless, I believe biomimicry will play an important role in the future, especially as cities try to adapt to climate change. In the next lecture, we'll look at how plants have inspired new types of solar panels."]
      ],
      questions: [
        { type: "info", text: "Questions 31–40. Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer." },
        { type: "gap", text: "Biomimicry: designing things by copying ideas from ______", answer: ["nature"] },
        { type: "gap", text: "The Greek word 'mimesis' means ______", answer: ["imitation"] },
        { type: "gap", text: "Buildings use about ______ % of total energy in many countries", answer: ["40", "forty"] },
        { type: "gap", text: "Eastgate Centre (Zimbabwe): inspired by ______ mounds", answer: ["termite", "termites"] },
        { type: "gap", text: "Air flows through a system of ______", answer: ["tunnels"] },
        { type: "gap", text: "Uses about 90% less energy for ______", answer: ["cooling"] },
        { type: "gap", text: "Lotus leaf: tiny ______ make water roll off", answer: ["bumps"] },
        { type: "gap", text: "This idea was used to develop a self-cleaning ______", answer: ["paint"] },
        { type: "gap", text: "The structure of ______ is studied to design lighter beams", answer: ["bones", "bone"] },
        { type: "gap", text: "Limitation: often ______ at the research stage", answer: ["expensive", "costly"] }
      ]
    }
  ]
};

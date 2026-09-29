/* Пробный экзамен IELTS Academic — вариант 2. Все тексты и вопросы оригинальные. */
window.EXAMS = window.EXAMS || {};
window.EXAMS.v2 = {
  id: "v2",
  title: "Вариант 2",

  /* ---------------- LISTENING ---------------- */
  listening: {
    parts: [
      {
        id: "part1",
        title: "Part 1 — Enrolling on an evening course",
        kind: "Бытовой диалог",
        intro: "Part 1. You will hear a woman phoning an adult education centre to enrol on a language course. First, you have some time to look at questions 1 to 10.",
        speakers: [{ id: "A", name: "Receptionist", gender: "m" }, { id: "B", name: "Maria", gender: "f" }],
        script: [
          ["A", "Good evening, Hilltop Adult Education Centre. Can I help you?"],
          ["B", "Yes, hello. I'd like to enrol on one of your evening language courses."],
          ["A", "Certainly. Which language are you interested in?"],
          ["B", "I was going to do Spanish, but I've heard that the Spanish group is already full."],
          ["A", "I'm afraid it is. We do still have places in French and Italian."],
          ["B", "Italian, then. My partner's family is from Italy, so it would be really useful."],
          ["A", "Great. And have you studied Italian before?"],
          ["B", "A little. I did a beginners' course two years ago, so I think the intermediate level would be right for me."],
          ["A", "The intermediate group meets once a week. It used to be on Tuesdays, but this year it's moved to Thursday evenings."],
          ["B", "Thursday is fine. What time does it start?"],
          ["A", "Classes run from seven thirty until nine."],
          ["B", "And where are the classes held?"],
          ["A", "In the main building, room B twelve. That's on the first floor."],
          ["B", "B twelve. OK. And how much does it cost?"],
          ["A", "The full fee is two hundred and twenty pounds for the term, but there's a discount for students, which brings it down to one hundred and eighty."],
          ["B", "I'm a student at the university, actually."],
          ["A", "Then it's one hundred and eighty pounds. You'll just need to show your student card on the first evening."],
          ["A", "Can I take your name?"],
          ["B", "It's Maria Kovach. K, O, V, A, C, H."],
          ["A", "Thank you. Is there anything else you'd like to know?"],
          ["B", "Yes. Do I need to bring anything?"],
          ["A", "The coursebook is included in the price, but the teacher recommends that everyone brings a dictionary. A paper one is best, because phones aren't allowed in class."],
          ["B", "No problem."],
          ["A", "And just for our records, how did you hear about the course?"],
          ["B", "I heard an advert on the local radio last week."],
          ["A", "That's good to know. We've only just started advertising there."]
        ],
        questions: [
          { type: "info", text: "Questions 1–10. Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer." },
          { type: "gap", text: "Language: ______", answer: ["Italian"] },
          { type: "gap", text: "Level: ______", answer: ["intermediate"] },
          { type: "gap", text: "Day: ______ evenings", answer: ["Thursday", "Thursdays"] },
          { type: "gap", text: "Class time: ______ – 9 pm", answer: ["7.30", "7:30", "7.30pm", "7:30pm", "seven thirty"] },
          { type: "gap", text: "Room: ______", answer: ["B12", "B 12"] },
          { type: "gap", text: "Fee for the term (with discount): £______", answer: ["180"] },
          { type: "gap", text: "Discount available for ______", answer: ["students", "student"] },
          { type: "gap", text: "Name: Maria ______", answer: ["Kovach"] },
          { type: "gap", text: "Must bring: a ______", answer: ["dictionary"] },
          { type: "gap", text: "Heard about the course on the local ______", answer: ["radio"] }
        ]
      },
      {
        id: "part2",
        title: "Part 2 — Welcome to a wildlife park",
        kind: "Монолог на бытовую тему",
        intro: "Part 2. You will hear a ranger giving information to visitors at a wildlife park. First, you have some time to look at questions 11 to 20.",
        speakers: [{ id: "A", name: "Ranger", gender: "m" }],
        script: [
          ["A", "Welcome to Greenwood Wildlife Park. My name's James and I'm one of the rangers here. Before you set off, I'd like to give you some information to help you make the most of your visit."],
          ["A", "The park was opened in 1985 by a local farmer who wanted to protect animals that were disappearing from the area. Today we care for more than sixty species, and our main aim is conservation rather than entertainment."],
          ["A", "Many of the animals here were born in the park, but some, like our otters, were brought to us after being injured in the wild."],
          ["A", "Feeding times are one of the highlights. The owls are fed at eleven, and the otters at half past two. Please don't feed the animals yourselves, as human food can make them ill."],
          ["A", "If you'd like to see the animals in a different way, we offer a night walk every Friday during the summer. It costs eight pounds and must be booked in advance at the gift shop."],
          ["A", "Unfortunately, the adventure playground is closed today while it's being repaired, but it should reopen next week."],
          ["A", "Now, where to find things. The café is right next to the entrance, so you'll pass it on your way in."],
          ["A", "The picnic area is beside the lake, where there are plenty of tables."],
          ["A", "If you need first aid, go to the rangers' hut, which is in the woodland area, just past the deer."],
          ["A", "The toilets are near the car park, and there are more inside the café."],
          ["A", "And the gift shop, where you book the night walks, is opposite the café. Enjoy your visit."]
        ],
        questions: [
          { type: "info", text: "Questions 11–15. Choose the correct letter, A, B or C." },
          { type: "mcq", text: "What is the main aim of the park?", options: ["entertainment", "conservation", "scientific research"], answer: 1 },
          { type: "mcq", text: "Why did the otters come to the park?", options: ["They were born there.", "They had been injured.", "They came from another zoo."], answer: 1 },
          { type: "mcq", text: "What time are the otters fed?", options: ["11.00", "2.30", "3.30"], answer: 1 },
          { type: "mcq", text: "The night walk", options: ["is free for visitors.", "must be booked at the gift shop.", "takes place every evening."], answer: 1 },
          { type: "mcq", text: "What does the speaker say about the adventure playground?", options: ["It is closed for repairs.", "It is only for children under ten.", "It has moved to a new area."], answer: 0 },
          {
            type: "info",
            text: "Questions 16–20. Where is each place? Choose FIVE answers from the list, A–F.",
            list: [["A", "beside the lake"], ["B", "opposite the café"], ["C", "near the car park"], ["D", "next to the entrance"], ["E", "in the woodland area"], ["F", "behind the owl house"]]
          },
          { type: "match", text: "the café", options: "ABCDEF", answer: "D" },
          { type: "match", text: "the picnic area", options: "ABCDEF", answer: "A" },
          { type: "match", text: "first aid", options: "ABCDEF", answer: "E" },
          { type: "match", text: "the toilets", options: "ABCDEF", answer: "C" },
          { type: "match", text: "the gift shop", options: "ABCDEF", answer: "B" }
        ]
      },
      {
        id: "part3",
        title: "Part 3 — Feedback on a field trip report",
        kind: "Учебная дискуссия",
        intro: "Part 3. You will hear two students, Lucy and Omar, discussing their field trip report with their tutor. First, you have some time to look at questions 21 to 30.",
        speakers: [{ id: "A", name: "Tutor", gender: "f" }, { id: "B", name: "Lucy", gender: "f" }, { id: "C", name: "Omar", gender: "m" }],
        script: [
          ["A", "So, Lucy and Omar, I've read the first draft of your report on the field trip to Seal Bay. Overall, it's a promising start."],
          ["C", "Thank you. We weren't sure whether we'd included enough data."],
          ["A", "The data is fine. What I'd like you to think about more is who the report is for. Remember, the brief said it should be written for the reserve's managers, not for other scientists."],
          ["B", "So we should make it less technical?"],
          ["A", "Exactly. Explain the key terms, and focus on what the managers can actually do."],
          ["B", "We were really surprised by how much litter we found on the beach. We'd expected plastic bottles to be the main problem."],
          ["C", "But it was fishing nets. They made up nearly half of what we collected."],
          ["A", "That's an important finding. Did you record where on the beach the litter was?"],
          ["B", "Only on the second day. On the first day the weather was so bad that we couldn't stay long."],
          ["A", "Then be clear about that in your methods section. Now, the seals. You counted forty-two, is that right?"],
          ["C", "Yes, forty-two adults. There were also some young ones, but they were hard to count from the cliff."],
          ["A", "Good. And you recommend closing part of the beach during the breeding season?"],
          ["B", "Yes, because people walking their dogs were getting quite close to the seals."],
          ["A", "That seems sensible. Let me go through the sections quickly. Your introduction is clear and well organised. I wouldn't change it."],
          ["A", "The methods section, as I said, needs more detail, especially about the weather conditions."],
          ["C", "What about the results?"],
          ["A", "The results section is too long. You've included every single measurement. Put the full tables in an appendix instead."],
          ["B", "And the discussion?"],
          ["A", "The discussion is excellent. It's the best part of the report."],
          ["A", "The recommendations, though, contain a couple of mistakes. You've written that the breeding season is in spring, but for this species it's actually in autumn."],
          ["C", "Oh, I'll check that. Thanks."]
        ],
        questions: [
          { type: "info", text: "Questions 21–25. Choose the correct letter, A, B or C." },
          { type: "mcq", text: "What is the tutor's main concern about the report?", options: ["It does not include enough data.", "It is not written for the right readers.", "It is much too short."], answer: 1 },
          { type: "mcq", text: "What made up nearly half of the litter?", options: ["plastic bottles", "fishing nets", "food packaging"], answer: 1 },
          { type: "mcq", text: "Why did they not record where the litter was on the first day?", options: ["They forgot to do it.", "The weather was very bad.", "They had no equipment."], answer: 1 },
          { type: "mcq", text: "How many adult seals did they count?", options: ["24", "42", "44"], answer: 1 },
          { type: "mcq", text: "Why do they recommend closing part of the beach?", options: ["because of the amount of litter", "because dogs were getting close to the seals", "because the cliffs are unsafe"], answer: 1 },
          {
            type: "info",
            text: "Questions 26–30. What does the tutor say about each section of the report? Choose FIVE answers from the list, A–F.",
            list: [["A", "needs more detail"], ["B", "is clearly organised"], ["C", "is too long"], ["D", "contains some mistakes"], ["E", "is the best part"], ["F", "should be removed"]]
          },
          { type: "match", text: "Introduction", options: "ABCDEF", answer: "B" },
          { type: "match", text: "Methods", options: "ABCDEF", answer: "A" },
          { type: "match", text: "Results", options: "ABCDEF", answer: "C" },
          { type: "match", text: "Discussion", options: "ABCDEF", answer: "E" },
          { type: "match", text: "Recommendations", options: "ABCDEF", answer: "D" }
        ]
      },
      {
        id: "part4",
        title: "Part 4 — Lecture: coral reefs",
        kind: "Академическая лекция",
        intro: "Part 4. You will hear part of a lecture about coral reefs. First, you have some time to look at questions 31 to 40.",
        speakers: [{ id: "A", name: "Lecturer", gender: "m" }],
        script: [
          ["A", "Good afternoon. Today we're looking at coral reefs, which are sometimes described as the rainforests of the sea. Although they cover less than one per cent of the ocean floor, they support around a quarter of all marine species."],
          ["A", "A coral may look like a plant or a rock, but it is actually an animal. Each coral is made up of thousands of tiny creatures called polyps. These polyps build hard skeletons from calcium carbonate, and over thousands of years, these skeletons form the structure of the reef."],
          ["A", "Most reef-building corals live in a partnership with microscopic algae. The algae live inside the coral's tissue and use sunlight to produce food, which they share with the coral. In return, the coral provides the algae with shelter. This is why most reefs are found in shallow, clear water, where there is plenty of light."],
          ["A", "Reefs are also valuable to people. They protect coastlines by reducing the energy of waves during storms, and they support fishing and tourism industries worth billions of dollars a year."],
          ["A", "Unfortunately, reefs face serious threats. The most widespread is coral bleaching. When the water becomes too warm, the coral expels its algae and turns white. If temperatures return to normal quickly, the coral can recover, but if the heat continues, it may die."],
          ["A", "Another threat is ocean acidification. As the oceans absorb carbon dioxide from the atmosphere, the water becomes more acidic, making it harder for corals to build their skeletons."],
          ["A", "There are, however, some reasons for hope. Scientists are experimenting with growing coral fragments in underwater nurseries and then attaching them to damaged reefs. Others are searching for corals that can tolerate higher temperatures, in the hope of breeding more resilient reefs."]
        ],
        questions: [
          { type: "info", text: "Questions 31–40. Complete the notes below. Write ONE WORD ONLY for each answer." },
          { type: "gap", text: "Reefs cover under 1% of the ocean floor but support about a ______ of marine species", answer: ["quarter"] },
          { type: "gap", text: "Corals are made up of tiny creatures called ______", answer: ["polyps"] },
          { type: "gap", text: "Their skeletons are made from calcium ______", answer: ["carbonate"] },
          { type: "gap", text: "Algae inside the coral use ______ to produce food", answer: ["sunlight"] },
          { type: "gap", text: "Most reefs are found in shallow, ______ water", answer: ["clear"] },
          { type: "gap", text: "Reefs protect coasts by reducing the energy of ______", answer: ["waves"] },
          { type: "gap", text: "Bleaching: the coral expels its algae and turns ______", answer: ["white"] },
          { type: "gap", text: "Acidification: oceans absorb carbon ______", answer: ["dioxide"] },
          { type: "gap", text: "Coral fragments are grown in underwater ______", answer: ["nurseries"] },
          { type: "gap", text: "Scientists look for corals that tolerate higher ______", answer: ["temperatures"] }
        ]
      }
    ]
  },

  /* ---------------- READING ---------------- */
  reading: {
    passages: [
      {
        title: "Farming Upwards",
        paragraphs: [
          ["A", "By 2050, the world's population is expected to reach nearly ten billion, and about two-thirds of those people will live in cities. Feeding them will be a major challenge, especially as good farmland is being lost to urban expansion, soil erosion and drought. One proposed solution is vertical farming: growing crops indoors in stacked layers, often inside warehouses or purpose-built towers in the heart of cities. At the same time, agriculture already uses around 70 per cent of the world's fresh water, so any new approach to farming must use resources more efficiently."],
          ["B", "The idea is not entirely new. In 1999, Dickson Despommier, a professor at Columbia University in New York, asked his students to design a building that could feed a population of 50,000 people. Although the project remained theoretical, it attracted wide attention, and the term 'vertical farm' became popular. The first commercial vertical farms appeared about a decade later, most of them growing leafy greens such as lettuce, spinach and herbs. Since then, vertical farms have been built in countries as different as Japan, the United States and Singapore, where land is particularly expensive."],
          ["C", "Vertical farms control every aspect of the growing environment. Instead of sunlight, plants receive light from LED lamps, which can be adjusted to the wavelengths that plants use most efficiently. Most farms do not use soil at all. In hydroponic systems, roots sit in water containing dissolved nutrients, while in aeroponic systems they hang in the air and are sprayed with a nutrient mist. Because water is collected and reused, some farms claim to use up to 95 per cent less water than traditional agriculture. Sensors monitor temperature, humidity and nutrient levels around the clock, and in some farms robots move trays of plants from one level to another."],
          ["D", "Supporters point to several other advantages. Crops can be harvested all year round, regardless of the weather, and because the environment is sealed, there is little need for pesticides. Farms located in cities can also supply supermarkets and restaurants within hours of harvest, reducing transport costs and ensuring that produce is fresh. Yields per square metre can also be many times higher than in an open field, because plants are grown on multiple levels and several harvests are possible each year."],
          ["E", "However, vertical farming faces significant obstacles. The most serious is energy. Artificial lighting and climate control consume large amounts of electricity, and unless this comes from renewable sources, the carbon footprint of vertical farms can exceed that of conventional greenhouses. Building costs are also high, and several well-funded companies have gone bankrupt in recent years. Critics note that the range of crops is limited: staple foods such as wheat and rice, which provide most of the world's calories, are not economical to grow indoors. Labour is another issue: although some tasks can be automated, skilled technicians are needed to maintain the complex equipment."],
          ["F", "For now, most experts see vertical farming as a complement to traditional agriculture rather than a replacement. Its future may depend on falling prices for LED lighting and renewable energy. In regions with limited water or extreme climates, such as parts of the Middle East, it is already proving attractive, and in some cities vertical farms have been built in unusual locations, including disused mines and old railway tunnels."]
        ],
        questions: [
          { type: "info", text: "Questions 1–5. Do the following statements agree with the information given in the passage? Choose TRUE, FALSE or NOT GIVEN." },
          { type: "tfng", text: "By 2050, most of the world's population is expected to live in cities.", answer: "TRUE" },
          { type: "tfng", text: "Despommier's students built a working vertical farm in New York.", answer: "FALSE" },
          { type: "tfng", text: "The first commercial vertical farms mainly grew leafy vegetables.", answer: "TRUE" },
          { type: "tfng", text: "The LED lamps used in vertical farms are cheaper than ordinary light bulbs.", answer: "NOT GIVEN" },
          { type: "tfng", text: "All vertical farms grow plants without soil.", answer: "FALSE" },
          { type: "info", text: "Questions 6–9. Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer." },
          { type: "gap", text: "In aeroponic systems, roots are sprayed with a ______.", answer: ["nutrient mist"] },
          { type: "gap", text: "Because the environment is sealed, there is little need for ______.", answer: ["pesticides"] },
          { type: "gap", text: "Artificial lighting and ______ use large amounts of electricity.", answer: ["climate control"] },
          { type: "gap", text: "Wheat and rice are examples of ______ that are not economical to grow indoors.", answer: ["staple foods"] },
          { type: "info", text: "Questions 10–13. The passage has six paragraphs, A–F. Which paragraph contains the following information? Choose the correct letter, A–F." },
          { type: "para", text: "examples of unusual places where vertical farms have been built", answer: "F" },
          { type: "para", text: "an explanation of how plants can be fed without soil", answer: "C" },
          { type: "para", text: "the reason why produce from vertical farms can be very fresh", answer: "D" },
          { type: "para", text: "how the term 'vertical farm' became widely known", answer: "B" }
        ]
      },
      {
        title: "Lost Voices",
        paragraphs: [
          ["A", "Of the roughly 7,000 languages spoken in the world today, linguists estimate that around 40 per cent are endangered. Many are spoken by only a few hundred people, most of them elderly. When the last fluent speaker of a language dies, a unique way of describing the world disappears with them. Some researchers predict that by the end of this century, half of today's languages may no longer be spoken. Papua New Guinea alone has more than 800 languages, while around half of the world's population speaks one of just a few dozen of the largest ones."],
          ["B", "Languages have always come and gone. Latin, for example, gradually developed into Italian, Spanish, French and other languages. What is different today is the speed and scale of the loss. Globalisation, migration to cities and the spread of national education systems all encourage people to adopt a dominant language, such as English, Spanish or Mandarin, which offers better access to jobs and services. In the past, a language usually changed gradually over many centuries; today, a language can disappear within a single lifetime."],
          ["C", "Often the decline happens within a single family. Parents who speak a minority language may decide that their children will have better opportunities if they are raised in the dominant language. The children may understand their grandparents' language but never learn to speak it themselves, and within one or two generations it can vanish entirely from everyday life. Children themselves sometimes feel embarrassed to speak their parents' language in front of their friends, which speeds up the process."],
          ["D", "The loss matters for several reasons. Languages contain knowledge that is not recorded anywhere else. Indigenous languages, for instance, often have detailed vocabularies for local plants, animals and weather patterns, and this knowledge can be valuable to scientists. Languages are also closely linked to identity: for many communities, losing their language means losing a connection to their history, stories and songs. Each language also provides linguists with evidence about the range of structures that human languages can have, and some grammatical features have been found in only one or two languages in the world."],
          ["E", "Fortunately, decline is not always permanent. The revival of Hebrew, which had not been used as an everyday spoken language for centuries, is the most famous example; today it has millions of native speakers. On a smaller scale, the Maori language in New Zealand was in serious decline by the 1970s. The creation of 'language nests', pre-schools where young children are cared for entirely in Maori, helped to reverse this trend, and the number of young speakers has since grown. In Wales, too, education in Welsh and a Welsh-language television channel have helped to stabilise the number of speakers."],
          ["F", "Technology is now playing a role as well. Linguists use digital recorders to document languages before they disappear, and some communities have developed apps and online dictionaries to teach their languages to young people. Social media, which is often blamed for spreading dominant languages, can also help scattered speakers of a minority language stay in contact and use it every day. Some projects even use video games and online courses to make learning a heritage language more attractive to teenagers."]
        ],
        questions: [
          {
            type: "info",
            text: "Questions 14–19. The passage has six paragraphs, A–F. Choose the correct heading for each paragraph from the list of headings below.",
            list: [["i", "Knowledge and identity at risk"], ["ii", "Successful attempts to bring languages back"], ["iii", "The scale of the problem"], ["iv", "Why governments ban minority languages"], ["v", "How a language is lost at home"], ["vi", "New tools for protecting languages"], ["vii", "An old process at a new speed"], ["viii", "The world's most difficult languages"]]
          },
          { type: "match", text: "Paragraph A", options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"], answer: "iii" },
          { type: "match", text: "Paragraph B", options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"], answer: "vii" },
          { type: "match", text: "Paragraph C", options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"], answer: "v" },
          { type: "match", text: "Paragraph D", options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"], answer: "i" },
          { type: "match", text: "Paragraph E", options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"], answer: "ii" },
          { type: "match", text: "Paragraph F", options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"], answer: "vi" },
          { type: "info", text: "Questions 20–23. Choose the correct letter, A, B, C or D." },
          { type: "mcq", text: "According to paragraph A, what happens when the last speaker of a language dies?", options: ["The language becomes a written language only.", "A unique view of the world is lost.", "Linguists immediately create a dictionary.", "The language is taught in local schools."], answer: 1 },
          { type: "mcq", text: "The writer mentions Latin in order to show that", options: ["languages have always changed over time.", "Latin is still spoken in some places.", "European languages are endangered.", "dominant languages are easy to learn."], answer: 0 },
          { type: "mcq", text: "Why do some parents stop using a minority language with their children?", options: ["The government tells them to.", "They want their children to have better opportunities.", "The grandparents disapprove of it.", "The children refuse to learn it."], answer: 1 },
          { type: "mcq", text: "What were 'language nests'?", options: ["online dictionaries", "pre-schools that used only Maori", "projects to record elderly speakers", "evening classes for adults"], answer: 1 },
          { type: "info", text: "Questions 24–26. Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer." },
          { type: "gap", text: "Indigenous languages often have detailed vocabularies for local plants, animals and ______.", answer: ["weather patterns"] },
          { type: "gap", text: "For centuries, Hebrew had not been used as an everyday ______.", answer: ["spoken language"] },
          { type: "gap", text: "Linguists use ______ to document languages before they disappear.", answer: ["digital recorders"] }
        ]
      },
      {
        title: "The Science of Habits",
        paragraphs: [
          ["A", "Psychologists estimate that around 40 per cent of our daily actions are habits: things we do automatically, without a conscious decision. We rarely think about how we brush our teeth, which route we take to work or when we check our phones. This automatic behaviour is extremely efficient, freeing the brain to concentrate on new or difficult tasks. But it also explains why bad habits are so hard to break."],
          ["B", "Research has identified a basic pattern behind most habits, often described as a loop with three parts. First comes a cue, a trigger that tells the brain to start the behaviour, such as a particular time of day, a place or an emotion. Next comes the routine, the behaviour itself. Finally, there is a reward, which makes the brain more likely to repeat the loop in the future. Over time, the brain begins to anticipate the reward as soon as it detects the cue. The reward does not have to be large; the pleasant feeling of finishing a task or the taste of a snack can be enough."],
          ["C", "How long does it take to form a new habit? A popular claim is that it takes 21 days, but this figure appears to have come from a 1960s book by a plastic surgeon who observed that his patients took about three weeks to get used to their new appearance. A more rigorous study, published in 2009 by Phillippa Lally and colleagues at University College London, followed 96 volunteers as they tried to adopt a new daily behaviour, such as drinking a glass of water after breakfast. On average, it took 66 days for the behaviour to become automatic, although the range was enormous, from 18 to 254 days. The participants recorded each day whether they had performed the behaviour and how automatic it felt, which allowed the researchers to see exactly when it became a habit."],
          ["D", "The same study produced another encouraging finding: missing a single day did not significantly affect the process. This suggests that people who occasionally fail should not give up. What matters is repetition in a consistent context. Simple behaviours, such as drinking water, became automatic much faster than complex ones, such as doing fifty sit-ups."],
          ["E", "These findings have practical implications for anyone trying to change their behaviour. Experts recommend attaching a new habit to an existing one, a strategy sometimes called 'habit stacking': for example, practising vocabulary while waiting for the kettle to boil. Making the desired behaviour easier also helps. People who want to eat more fruit are more likely to do so if it is placed on the kitchen table rather than hidden in a drawer. Another useful technique is to plan exactly when and where a behaviour will happen, for example 'I will go for a run at seven o'clock on Monday, Wednesday and Friday', rather than simply intending to exercise more."],
          ["F", "Breaking bad habits is more difficult, because the old loop never completely disappears from the brain. Rather than trying to eliminate a habit, researchers suggest identifying its cue and reward, and then replacing the routine with a healthier one. Someone who snacks when bored in the afternoon, for instance, might go for a short walk instead, which provides a similar break from work. Stress and tiredness make old habits more likely to return, which is why many people find it harder to resist temptation late in the day."],
          ["G", "Some scientists warn against focusing too much on individual willpower. Our environment, they argue, shapes our habits more than we realise. Changes such as healthier food in school canteens or better cycle lanes can make good habits easier for everyone, not just for those with strong self-control."]
        ],
        questions: [
          { type: "info", text: "Questions 27–32. Do the following statements agree with the claims of the writer? Choose YES, NO or NOT GIVEN." },
          { type: "yng", text: "Habits allow the brain to focus on other activities.", answer: "YES" },
          { type: "yng", text: "Most people are aware of the cues that trigger their habits.", answer: "NOT GIVEN" },
          { type: "yng", text: "The '21 days' figure is based on reliable scientific evidence.", answer: "NO" },
          { type: "yng", text: "Every volunteer in Lally's study took longer than two months to form a habit.", answer: "NO" },
          { type: "yng", text: "Simple behaviours became automatic more quickly than complex ones.", answer: "YES" },
          { type: "yng", text: "Changes to the environment can help people who lack self-control.", answer: "YES" },
          { type: "info", text: "Questions 33–36. Choose the correct letter, A, B, C or D." },
          { type: "mcq", text: "In a habit loop, the cue is", options: ["the behaviour itself.", "a trigger that starts the behaviour.", "the reward that follows.", "a conscious decision."], answer: 1 },
          { type: "mcq", text: "Where did the '21 days' claim originally come from?", options: ["a study of university volunteers", "a surgeon's observations of his patients", "a psychology textbook", "a survey of athletes"], answer: 1 },
          { type: "mcq", text: "What does 'habit stacking' involve?", options: ["starting several new habits at once", "linking a new habit to an existing one", "rewarding yourself after each success", "keeping a diary of your habits"], answer: 1 },
          { type: "mcq", text: "Researchers suggest that the best way to deal with a bad habit is to", options: ["remove its cue completely.", "rely on willpower.", "replace the routine with a healthier one.", "ignore the reward."], answer: 2 },
          { type: "info", text: "Questions 37–40. Complete the summary. Choose ONE WORD ONLY from the passage for each answer." },
          { type: "gap", text: "In the 2009 study, 96 ______ tried to adopt a new daily behaviour.", answer: ["volunteers"] },
          { type: "gap", text: "On average, it took 66 ______ for the behaviour to become automatic.", answer: ["days"] },
          { type: "gap", text: "What matters most is repetition in a consistent ______.", answer: ["context"] },
          { type: "gap", text: "Someone who snacks when ______ might go for a short walk instead.", answer: ["bored"] }
        ]
      }
    ]
  },

  /* ---------------- WRITING ---------------- */
  writing: {
    task1: {
      prompt: "The chart below shows the average number of hours per week that people in one country spent on three leisure activities, by age group. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
      chart: {
        type: "bar",
        title: "Hours per week spent on leisure activities",
        unit: "h",
        max: 30,
        labels: ["16–24", "25–44", "45–64", "65+"],
        series: [
          { name: "Watching TV", values: [12, 14, 17, 25] },
          { name: "Using the internet", values: [22, 15, 9, 4] },
          { name: "Sport and exercise", values: [6, 4, 3, 2] }
        ]
      }
    },
    task2: {
      prompt: "In many countries, people are living longer than ever before. What problems does an ageing population cause, and what solutions can you suggest? Give reasons for your answer and include any relevant examples from your own knowledge or experience."
    }
  },

  /* ---------------- SPEAKING ---------------- */
  speaking: {
    part1: [
      { topic: "Work or studies", qs: ["Do you work or are you a student?", "Why did you choose that job or subject?", "What do you find most interesting about it?", "What would you like to do in the future?"] },
      { topic: "Weekends", qs: ["What do you usually do at weekends?", "Do you prefer busy or relaxing weekends?", "How were your weekends different when you were a child?", "Is there anything new you would like to try at the weekend?"] }
    ],
    part2: {
      title: "Describe a journey that you remember well.",
      points: ["where you went", "how you travelled", "who you went with", "and explain why you remember this journey."],
      followUp: "Would you like to make the same journey again?"
    },
    part3: [
      "Why do you think people enjoy travelling to other countries?",
      "How has tourism changed in your country in recent years?",
      "Can tourism have a negative effect on local communities?",
      "Do you think people will travel more or less in the future? Why?",
      "Is it better to travel alone or with other people?"
    ]
  }
};

/* Пробный экзамен IELTS Academic — вариант 3. Все тексты и вопросы оригинальные. */
window.EXAMS = window.EXAMS || {};
window.EXAMS.v3 = {
  id: "v3",
  title: "Вариант 3",

  /* ---------------- LISTENING ---------------- */
  listening: {
    parts: [
      {
        id: "part1",
        title: "Part 1 — Reporting lost property",
        kind: "Бытовой диалог",
        intro: "Part 1. You will hear a man reporting a lost bag at a railway station lost property office. First, you have some time to look at questions 1 to 10.",
        speakers: [{ id: "A", name: "Clerk", gender: "f" }, { id: "B", name: "Samuel", gender: "m" }],
        script: [
          ["A", "Good morning, Central Station lost property. How can I help?"],
          ["B", "Hi. I left my bag on a train yesterday and I'm hoping someone found it."],
          ["A", "I'm sorry to hear that. Let me fill in a report for you. What kind of bag is it?"],
          ["B", "It's a laptop bag. Black, with a shoulder strap."],
          ["A", "And when did you travel?"],
          ["B", "Yesterday, the ninth of March."],
          ["A", "Which train were you on?"],
          ["B", "I got on at Bath, but the train started in Bristol."],
          ["A", "And do you know what time it left Bristol?"],
          ["B", "It left Bath at nine fifteen, so it must have left Bristol at about quarter to nine."],
          ["A", "Let me check. Yes, that's the eight forty-five from Bristol. Do you remember where you were sitting?"],
          ["B", "In carriage D, near the doors."],
          ["A", "What was inside the bag?"],
          ["B", "My laptop, obviously, a pair of headphones and a notebook with my work notes."],
          ["A", "Is there anything that would help us identify it?"],
          ["B", "Yes, there's a small keyring attached to the zip. It's shaped like a fish."],
          ["A", "That's helpful. Can I have your name?"],
          ["B", "It's Samuel Okafor. That's O, K, A, F, O, R."],
          ["A", "And a phone number?"],
          ["B", "It's oh-seven-eight-two-three, six-one-four, five-nine-oh."],
          ["A", "Thank you. If the bag is handed in, we'll call you. When you come to collect it, please bring some photo ID. There's also a small handling fee of three pounds."],
          ["B", "That's fine. Thanks for your help."]
        ],
        questions: [
          { type: "info", text: "Questions 1–10. Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer." },
          { type: "gap", text: "Item: a black ______ bag", answer: ["laptop"] },
          { type: "gap", text: "Date of travel: ______ March", answer: ["9th", "9", "ninth"] },
          { type: "gap", text: "The train started in: ______", answer: ["Bristol"] },
          { type: "gap", text: "Departure time from there: ______", answer: ["8.45", "8:45", "8.45am", "8:45am"] },
          { type: "gap", text: "Carriage: ______", answer: ["D"] },
          { type: "gap", text: "Contents: laptop, ______ and a notebook", answer: ["headphones"] },
          { type: "gap", text: "Identifying feature: a fish-shaped ______ on the zip", answer: ["keyring", "key ring", "key-ring"] },
          { type: "gap", text: "Name: Samuel ______", answer: ["Okafor"] },
          { type: "gap", text: "Phone: 07823 ______", answer: ["614590", "614 590"] },
          { type: "gap", text: "Handling fee: £______", answer: ["3", "three"] }
        ]
      },
      {
        id: "part2",
        title: "Part 2 — Volunteering at the city library",
        kind: "Монолог на бытовую тему",
        intro: "Part 2. You will hear a volunteer coordinator talking to new volunteers at a city library. First, you have some time to look at questions 11 to 20.",
        speakers: [{ id: "A", name: "Helen", gender: "f" }],
        script: [
          ["A", "Hello everyone, and thank you for volunteering at City Library. I'm Helen, the volunteer coordinator. This morning I'll explain how things work here."],
          ["A", "First of all, the library has changed a lot in recent years. We still lend books, of course, but our visitor numbers have actually risen since we started offering more community activities, and that's why we need volunteers like you."],
          ["A", "Each of you will receive a volunteer badge. Please wear it at all times while you're in the building, so that members of the public know who to ask for help."],
          ["A", "We ask volunteers to commit to at least one session a week for three months. If you can't come, please let us know by email at least a day in advance."],
          ["A", "You won't be handling money or dealing with overdue fines. Those are handled by staff only. What you will do is help people find what they need and support our activities."],
          ["A", "So let me tell you about the activities. Our homework club for secondary school students runs on Monday afternoons."],
          ["A", "The reading group for adults meets on Wednesday evenings. At the moment they're reading a collection of short stories."],
          ["A", "Rhyme time, for babies and toddlers, is on Friday mornings. It's very popular, so we always need extra help."],
          ["A", "Computer help sessions, where volunteers show older people how to use email and video calls, are also on Mondays, but in the morning."],
          ["A", "The chess club meets on Saturday afternoons."],
          ["A", "And finally, the language café, where people can practise speaking English, used to be on Fridays, but it has moved to Wednesdays this term."]
        ],
        questions: [
          { type: "info", text: "Questions 11–14. Choose the correct letter, A, B or C." },
          { type: "mcq", text: "Why has the number of library visitors increased?", options: ["The library opens for longer hours.", "There are more community activities.", "The library has moved to a new building."], answer: 1 },
          { type: "mcq", text: "Volunteers must wear their badge", options: ["only during events.", "at all times in the building.", "when they use the computers."], answer: 1 },
          { type: "mcq", text: "The minimum commitment for volunteers is", options: ["one session a week for three months.", "two sessions a week for one month.", "one session a month for a year."], answer: 0 },
          { type: "mcq", text: "What will volunteers NOT do?", options: ["help with activities", "handle money", "help people find books"], answer: 1 },
          {
            type: "info",
            text: "Questions 15–20. On which day does each activity take place? Choose the correct letter, A–D. You may use any letter more than once.",
            list: [["A", "Monday"], ["B", "Wednesday"], ["C", "Friday"], ["D", "Saturday"]]
          },
          { type: "match", text: "homework club", options: "ABCD", answer: "A" },
          { type: "match", text: "reading group", options: "ABCD", answer: "B" },
          { type: "match", text: "rhyme time", options: "ABCD", answer: "C" },
          { type: "match", text: "computer help", options: "ABCD", answer: "A" },
          { type: "match", text: "chess club", options: "ABCD", answer: "D" },
          { type: "match", text: "language café", options: "ABCD", answer: "B" }
        ]
      },
      {
        id: "part3",
        title: "Part 3 — A business case study",
        kind: "Учебная дискуссия",
        intro: "Part 3. You will hear two business students, Jack and Priya, discussing a case study about a small café. First, you have some time to look at questions 21 to 30.",
        speakers: [{ id: "A", name: "Jack", gender: "m" }, { id: "B", name: "Priya", gender: "f" }],
        script: [
          ["A", "Priya, have you finished reading the case study about the Blue Door Café?"],
          ["B", "Yes, last night. It's a great example for our assignment on how small businesses recover."],
          ["A", "Agreed. What struck me was how close it came to closing. Two years ago it was losing money every month."],
          ["B", "And the owner said the main problem wasn't the food or the rent. It was that nobody knew the café existed, because it's on a side street."],
          ["A", "Right. So the first thing she did was put up a sign on the main road. Then she changed the menu. She cut it from forty dishes to about twelve."],
          ["B", "I thought that was risky, but the main benefit was that it reduced food waste a lot."],
          ["A", "And she started opening in the evenings, but that didn't last long."],
          ["B", "No, there weren't enough customers after six, so she went back to daytime hours."],
          ["A", "Do you think we should focus on her use of social media?"],
          ["B", "I'd rather focus on her relationship with customers. That seems to be what really made the difference."],
          ["A", "Fair enough. Our lecturer did say not to just describe marketing. When is the assignment due? I thought it was the fifth."],
          ["B", "No, it's the fifteenth. And it should be two thousand words."],
          ["A", "OK. Let's list the changes and what happened after each one."],
          ["B", "The loyalty card, where every tenth coffee is free, was actually suggested by customers in a survey."],
          ["A", "And the new coffee machine was expensive at first, although it paid for itself within a year."],
          ["B", "The outdoor seating area definitely increased profits, especially in summer."],
          ["A", "The book exchange shelf didn't really make any difference to sales, though customers seemed to like it."],
          ["B", "And the staff uniforms. The staff didn't like them at all, so she dropped them after a month."]
        ],
        questions: [
          { type: "info", text: "Questions 21–25. Choose the correct letter, A, B or C." },
          { type: "mcq", text: "What was the café's main problem two years ago?", options: ["the quality of the food", "people did not know about it", "the rent was too high"], answer: 1 },
          { type: "mcq", text: "What was the main benefit of the shorter menu?", options: ["faster service", "less food waste", "lower prices"], answer: 1 },
          { type: "mcq", text: "Why did the café stop opening in the evenings?", options: ["The staff did not want to work late.", "There were too few customers.", "The neighbours complained."], answer: 1 },
          { type: "mcq", text: "What will the students focus on in their assignment?", options: ["the café's use of social media", "the café's relationship with customers", "the changes to the menu"], answer: 1 },
          { type: "mcq", text: "When is the assignment due?", options: ["on the 5th", "on the 15th", "on the 25th"], answer: 1 },
          {
            type: "info",
            text: "Questions 26–30. What do the students say about each change the café made? Choose FIVE answers from the list, A–F.",
            list: [["A", "increased profits"], ["B", "was expensive at first"], ["C", "was suggested by customers"], ["D", "was copied by other cafés"], ["E", "had no effect on sales"], ["F", "was unpopular with staff"]]
          },
          { type: "match", text: "the loyalty card", options: "ABCDEF", answer: "C" },
          { type: "match", text: "the coffee machine", options: "ABCDEF", answer: "B" },
          { type: "match", text: "the outdoor seating", options: "ABCDEF", answer: "A" },
          { type: "match", text: "the book exchange shelf", options: "ABCDEF", answer: "E" },
          { type: "match", text: "the staff uniforms", options: "ABCDEF", answer: "F" }
        ]
      },
      {
        id: "part4",
        title: "Part 4 — Lecture: how birds find their way",
        kind: "Академическая лекция",
        intro: "Part 4. You will hear part of a lecture about how migrating birds navigate. First, you have some time to look at questions 31 to 40.",
        speakers: [{ id: "A", name: "Lecturer", gender: "f" }],
        script: [
          ["A", "Today I'm going to talk about one of the great mysteries of the natural world: how migrating birds find their way. Every year, billions of birds travel thousands of kilometres between their breeding and wintering grounds, often returning to exactly the same place."],
          ["A", "The Arctic tern holds the record for the longest migration. It travels from the Arctic to the Antarctic and back again each year, a round trip of around seventy thousand kilometres."],
          ["A", "Scientists believe that birds use several methods of navigation. The first is the sun. Birds that fly during the day can use the position of the sun, combined with an internal clock, to work out direction."],
          ["A", "Many species, however, migrate at night. Experiments in planetariums in the 1960s showed that young birds learn the pattern of stars around the North Star, which does not move across the sky, and use it as a fixed point."],
          ["A", "A third method involves the Earth's magnetic field. Birds appear to be able to sense it, possibly through special proteins in their eyes. This allows them to navigate even when the sky is cloudy."],
          ["A", "Landmarks also play a role. Experienced birds recognise coastlines, rivers and mountain ranges, especially near the end of their journey."],
          ["A", "Finally, there is growing evidence that some birds use smell. When researchers blocked the sense of smell in shearwaters, a type of seabird, the birds had difficulty finding their way home across the open sea."],
          ["A", "Migration is extremely demanding. Before departure, many birds eat so much that they almost double their body weight, storing the energy as fat."],
          ["A", "Unfortunately, human activity is making migration more dangerous. Bright lights in cities can confuse birds flying at night, and millions die each year after colliding with buildings. Some cities now switch off unnecessary lights during the migration seasons."]
        ],
        questions: [
          { type: "info", text: "Questions 31–40. Complete the notes below. Write ONE WORD ONLY for each answer." },
          { type: "gap", text: "Arctic tern: round trip of about 70,000 ______ each year", answer: ["kilometres", "kilometers", "km"] },
          { type: "gap", text: "Day: position of the sun combined with an internal ______", answer: ["clock"] },
          { type: "gap", text: "Night: young birds learn the pattern of ______", answer: ["stars"] },
          { type: "gap", text: "This was shown in experiments in ______ in the 1960s", answer: ["planetariums", "planetaria"] },
          { type: "gap", text: "Magnetic field: possibly sensed through proteins in the ______", answer: ["eyes"] },
          { type: "gap", text: "This works even when the sky is ______", answer: ["cloudy"] },
          { type: "gap", text: "Landmarks: coastlines, rivers and ______ ranges", answer: ["mountain"] },
          { type: "gap", text: "Shearwaters: researchers blocked their sense of ______", answer: ["smell"] },
          { type: "gap", text: "Before departure, birds store energy as ______", answer: ["fat"] },
          { type: "gap", text: "Some cities switch off unnecessary ______ during migration", answer: ["lights"] }
        ]
      }
    ]
  },

  /* ---------------- READING ---------------- */
  reading: {
    passages: [
      {
        title: "The Journey of Tea",
        paragraphs: [
          ["A", "Tea is the most widely consumed drink in the world after water. According to a well-known Chinese legend, it was discovered in 2737 BC by the emperor Shen Nong, when leaves from a wild tree blew into a pot of water he was boiling. Whether or not the story is true, there is clear evidence that tea was being drunk in south-west China more than two thousand years ago, initially as a medicine rather than for pleasure. Today, billions of cups are drunk every day, and the global tea industry employs millions of people, many of them on small family farms."],
          ["B", "During the Tang dynasty (618–907), tea became part of everyday life in China. In the eighth century, a scholar named Lu Yu wrote The Classic of Tea, the first book devoted entirely to the subject, describing how to grow, prepare and serve it. At this time, tea leaves were usually pressed into hard cakes, which could be transported easily. Pieces were broken off, ground into powder and whisked into hot water. Lu Yu also wrote about the quality of water, arguing that water from mountain streams produced the best tea."],
          ["C", "Tea reached Japan in the ninth century, brought back by Buddhist monks who had studied in China. The monks valued it because it helped them stay awake during long periods of meditation. Over the following centuries, the Japanese developed an elaborate tea ceremony, in which every movement, from cleaning the utensils to serving the guests, follows strict rules. In later centuries the ceremony became an important part of the education of wealthy families, and it is still widely practised in Japan today."],
          ["D", "Europeans did not encounter tea until the sixteenth century, when Portuguese traders visited China. The Dutch began importing it in 1610, but it was the British who became its most enthusiastic consumers. Tea became fashionable in England after 1662, when Catherine of Braganza, a Portuguese princess who was already fond of it, married King Charles II. At first, it was extremely expensive and heavily taxed, so it was often smuggled into the country, and some shopkeepers mixed it with other leaves to increase their profits."],
          ["E", "Britain's demand for tea had important consequences. To pay for it, the British East India Company exported opium to China, a trade that eventually led to war between the two countries in the 1840s. At the same time, the British wanted to end their dependence on China. In 1848, the botanist Robert Fortune travelled secretly into the Chinese countryside, disguised as a Chinese merchant, and smuggled thousands of tea plants and seeds to India. Within a few decades, India, and later Sri Lanka, had become major producers. Fortune's journey is sometimes described as one of the most successful acts of industrial espionage in history."],
          ["F", "Today, tea is grown in more than sixty countries. Although all true tea comes from a single plant species, Camellia sinensis, the way the leaves are processed produces very different drinks. Green tea is heated soon after picking to prevent oxidation, while black tea is left to oxidise fully, which gives it a darker colour and stronger flavour. Herbal 'teas', such as mint or camomile, are not technically tea at all, since they do not come from this plant. Other varieties, such as oolong, are only partly oxidised, giving them a flavour somewhere between green and black tea."]
        ],
        questions: [
          { type: "info", text: "Questions 1–6. Do the following statements agree with the information given in the passage? Choose TRUE, FALSE or NOT GIVEN." },
          { type: "tfng", text: "Tea was first drunk in China as a medicine.", answer: "TRUE" },
          { type: "tfng", text: "The Classic of Tea was written during the Tang dynasty.", answer: "TRUE" },
          { type: "tfng", text: "Buddhist monks in Japan drank tea to help them sleep.", answer: "FALSE" },
          { type: "tfng", text: "Tea was more expensive in England than in the Netherlands.", answer: "NOT GIVEN" },
          { type: "tfng", text: "Some shopkeepers in England added other leaves to tea.", answer: "TRUE" },
          { type: "tfng", text: "Robert Fortune travelled openly as a British scientist.", answer: "FALSE" },
          { type: "info", text: "Questions 7–10. Complete the notes. Choose ONE WORD ONLY from the passage for each answer." },
          { type: "gap", text: "In the Tang dynasty, leaves were pressed into hard ______.", answer: ["cakes"] },
          { type: "gap", text: "Pieces were ground into ______ and whisked into hot water.", answer: ["powder"] },
          { type: "gap", text: "In the Japanese tea ceremony, every movement follows strict ______.", answer: ["rules"] },
          { type: "gap", text: "Green tea is heated soon after picking to prevent ______.", answer: ["oxidation"] },
          { type: "info", text: "Questions 11–13. Choose the correct letter, A, B, C or D." },
          { type: "mcq", text: "Why did tea become fashionable in England after 1662?", options: ["The tax on tea was reduced.", "A new queen was already fond of it.", "Dutch traders promoted it.", "Doctors recommended it."], answer: 1 },
          { type: "mcq", text: "Why did the East India Company export opium to China?", options: ["to pay for tea", "to start a war", "to help Chinese farmers", "to replace tea in Britain"], answer: 0 },
          { type: "mcq", text: "According to the writer, herbal teas", options: ["contain Camellia sinensis.", "are processed like green tea.", "are not true tea.", "were first made in India."], answer: 2 }
        ]
      },
      {
        title: "The Invisible Problem",
        paragraphs: [
          ["A", "Plastic waste floating in the ocean has become a familiar image, but some of the most worrying pollution is almost invisible. Microplastics, defined as plastic particles smaller than five millimetres, have been found everywhere scientists have looked: in deep ocean trenches, in Arctic ice, in the air of remote mountain regions and even in human blood. They have also been detected in bottled water, sea salt and honey."],
          ["B", "Microplastics come from two main sources. Primary microplastics are manufactured at a small size, such as the tiny beads that were once added to face scrubs and toothpaste. Secondary microplastics form when larger items, such as bottles and bags, break down under the influence of sunlight, waves and wind. A surprisingly large amount also comes from everyday activities: synthetic clothing releases thousands of fibres every time it is washed, and car tyres shed particles as they wear against the road. Paint from ships and buildings, and even the rubber granules used on artificial sports pitches, add to the total."],
          ["C", "Because microplastics are so small, they are easily eaten by marine animals, from tiny plankton to large whales. Laboratory studies have shown that they can block the digestive systems of small creatures and reduce their ability to feed and reproduce. Microplastics can also absorb harmful chemicals from the surrounding water, which may then pass up the food chain to the fish and shellfish that people eat. Seabirds and turtles are also at risk, since they may mistake small pieces of plastic for food."],
          ["D", "The effects on human health are still uncertain. Researchers estimate that an average person may consume tens of thousands of particles each year through food, drinking water and the air. Some laboratory studies suggest that the particles could cause inflammation in human cells, but scientists stress that more research is needed before firm conclusions can be drawn. Part of the difficulty is that microplastics vary greatly in size, shape and chemical make-up, which makes it hard to compare the results of different studies."],
          ["E", "Some governments have already taken action. Several countries, including the United Kingdom and the United States, have banned microbeads in cosmetics. The European Union has also restricted the sale of products containing intentionally added microplastics. France has passed a law requiring new washing machines to be fitted with filters that capture fibres from 2025. However, these measures address only a small share of the problem, since most microplastics come from the breakdown of larger waste."],
          ["F", "Many experts therefore argue that the most effective solution is to reduce the amount of plastic produced in the first place. Improving recycling, designing products that last longer and developing materials that break down safely are all part of the answer. Individuals can contribute too, for example by washing synthetic clothes less often and at lower temperatures, which reduces the number of fibres released. Some clothing companies are also experimenting with natural fibres and new fabrics that shed fewer particles."]
        ],
        questions: [
          {
            type: "info",
            text: "Questions 14–19. The passage has six paragraphs, A–F. Choose the correct heading for each paragraph from the list of headings below.",
            list: [["i", "An uncertain risk to people"], ["ii", "Where the particles come from"], ["iii", "Found in every environment"], ["iv", "Recycling in developing countries"], ["v", "Legal measures and their limits"], ["vi", "Harm to ocean life"], ["vii", "Tackling the problem at its source"], ["viii", "How plastic was invented"]]
          },
          { type: "match", text: "Paragraph A", options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"], answer: "iii" },
          { type: "match", text: "Paragraph B", options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"], answer: "ii" },
          { type: "match", text: "Paragraph C", options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"], answer: "vi" },
          { type: "match", text: "Paragraph D", options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"], answer: "i" },
          { type: "match", text: "Paragraph E", options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"], answer: "v" },
          { type: "match", text: "Paragraph F", options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"], answer: "vii" },
          { type: "info", text: "Questions 20–24. Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer." },
          { type: "gap", text: "Microplastics are particles smaller than five ______.", answer: ["millimetres", "millimeters", "mm"] },
          { type: "gap", text: "Tiny beads were once added to face scrubs and ______.", answer: ["toothpaste"] },
          { type: "gap", text: "Larger items break down because of sunlight, waves and ______.", answer: ["wind"] },
          { type: "gap", text: "Car ______ shed particles as they wear against the road.", answer: ["tyres", "tires"] },
          { type: "gap", text: "From 2025, new washing machines in France must have ______ that capture fibres.", answer: ["filters"] },
          { type: "info", text: "Questions 25–26. Choose the correct letter, A, B, C or D." },
          { type: "mcq", text: "According to laboratory studies, microplastics can", options: ["help small sea creatures grow.", "block the digestive systems of small creatures.", "change the colour of fish.", "make whales migrate."], answer: 1 },
          { type: "mcq", text: "How can individuals reduce fibre pollution?", options: ["by buying more synthetic clothes", "by washing synthetic clothes less often", "by washing clothes at higher temperatures", "by driving on smoother roads"], answer: 1 }
        ]
      },
      {
        title: "Can Machines Be Creative?",
        paragraphs: [
          ["A", "For most of history, creativity has been regarded as a uniquely human quality. In the 1840s, Ada Lovelace, who wrote what is often considered the first computer program, argued that a machine could never originate anything; it could only do what it was told. For more than a century, her view went largely unchallenged. Today, however, computers compose music, write poetry and produce paintings that sell for large sums, and the question of whether machines can be creative is being debated more intensely than ever. In 1950, the mathematician Alan Turing discussed her remark and suggested that machines might one day surprise their creators."],
          ["B", "Part of the difficulty lies in defining creativity. The British cognitive scientist Margaret Boden has proposed an influential definition: a creative idea is one that is new, surprising and valuable. She also distinguishes between three types of creativity. Combinational creativity produces unfamiliar combinations of familiar ideas; exploratory creativity involves searching within an existing style or set of rules; and transformational creativity changes the rules themselves, making possible ideas that could not have been thought of before. Boden argues that computers are already capable of the first two types, but that the third remains extremely rare, even among humans."],
          ["C", "Early experiments in computer art were largely exploratory. In the 1970s, the painter Harold Cohen created a program called AARON, which produced drawings according to rules he had written. Over several decades, AARON's work was exhibited in major galleries. Cohen himself, however, refused to describe the program as creative, insisting that he was the artist and AARON was simply his tool. The drawings became more complex over time as Cohen added new rules, allowing the program to draw people and plants and, later, to use colour."],
          ["D", "In music, the composer David Cope developed software that analysed the works of composers such as Bach and generated new pieces in the same style. In a famous test, audiences were asked to identify which of several pieces had been written by Bach and which by the computer, and many listeners guessed wrongly. Cope argued that this showed that the difference between human and machine creativity was smaller than people liked to believe. Some musicians reacted angrily, and Cope later reported receiving hostile letters. His program worked by breaking existing pieces into small fragments and recombining them according to patterns it had identified."],
          ["E", "Recent advances in artificial intelligence have intensified the debate. Modern systems learn from enormous collections of existing texts and images, rather than following rules written by a programmer. They can generate a poem or a picture in seconds, and the results are often impressive. Yet critics point out that these systems depend entirely on human-made material: they recombine patterns found in their training data and have no intentions, experiences or emotions of their own. For these critics, a work of art is valuable partly because it expresses something about the person who made it. There are also legal questions: some artists have complained that their work was used to train such systems without their permission."],
          ["F", "Others take a more practical view. Whether or not machines are truly creative, they argue, they are clearly useful tools that can help people to be more creative, for example by suggesting ideas or producing quick sketches. Just as photography did not replace painting but changed it, artificial intelligence may transform creative work without making human artists unnecessary. What seems certain is that the question Ada Lovelace raised almost two centuries ago is far from settled."]
        ],
        questions: [
          {
            type: "info",
            text: "Questions 27–31. Match each statement with the correct person or group, A–E.",
            list: [["A", "Ada Lovelace"], ["B", "Margaret Boden"], ["C", "Harold Cohen"], ["D", "David Cope"], ["E", "critics of modern AI"]]
          },
          { type: "match", text: "A machine can only do what it is instructed to do.", options: "ABCDE", answer: "A" },
          { type: "match", text: "A computer program should be regarded as the artist's tool.", options: "ABCDE", answer: "C" },
          { type: "match", text: "Computers can already achieve some kinds of creativity.", options: "ABCDE", answer: "B" },
          { type: "match", text: "Modern AI systems have no intentions or emotions of their own.", options: "ABCDE", answer: "E" },
          { type: "match", text: "Human and machine creativity are less different than people think.", options: "ABCDE", answer: "D" },
          { type: "info", text: "Questions 32–36. Do the following statements agree with the information given in the passage? Choose TRUE, FALSE or NOT GIVEN." },
          { type: "tfng", text: "Lovelace's opinion was widely challenged soon after she expressed it.", answer: "FALSE" },
          { type: "tfng", text: "AARON's drawings were shown in major galleries.", answer: "TRUE" },
          { type: "tfng", text: "Cope's software could only imitate the music of Bach.", answer: "FALSE" },
          { type: "tfng", text: "Some musicians reacted negatively to Cope's work.", answer: "TRUE" },
          { type: "tfng", text: "Modern AI tools are more popular with professional artists than older programs were.", answer: "NOT GIVEN" },
          { type: "info", text: "Questions 37–40. Choose the correct letter, A, B, C or D." },
          { type: "mcq", text: "According to Boden, a creative idea must be", options: ["new, surprising and valuable.", "produced by a human being.", "based on existing rules.", "popular with the public."], answer: 0 },
          { type: "mcq", text: "Exploratory creativity involves", options: ["combining familiar ideas in unfamiliar ways.", "searching within an existing style.", "changing the rules completely.", "copying the work of others."], answer: 1 },
          { type: "mcq", text: "How do modern AI systems differ from AARON?", options: ["They learn from large collections of existing material.", "They follow rules written by a programmer.", "They can only produce drawings.", "They work more slowly."], answer: 0 },
          { type: "mcq", text: "What is the writer's conclusion?", options: ["Machines will soon replace human artists.", "The question of machine creativity is still open.", "Photography has replaced painting.", "Ada Lovelace was completely right."], answer: 1 }
        ]
      }
    ]
  },

  /* ---------------- WRITING ---------------- */
  writing: {
    task1: {
      prompt: "The pie charts below show how household energy was used in one country in 1990 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
      chart: {
        type: "pie",
        title: "Household energy use by purpose (%)",
        unit: "%",
        labels: ["Heating", "Hot water", "Appliances and electronics", "Lighting", "Cooking"],
        series: [
          { name: "1990", values: [55, 20, 12, 8, 5] },
          { name: "2020", values: [42, 18, 24, 6, 10] }
        ]
      }
    },
    task2: {
      prompt: "Some people believe that university students should be free to study any subject they like. Others think that they should only be allowed to study subjects that will be useful in the future, such as science and technology. Discuss both views and give your own opinion."
    }
  },

  /* ---------------- SPEAKING ---------------- */
  speaking: {
    part1: [
      { topic: "Reading", qs: ["Do you enjoy reading? Why or why not?", "What kind of things do you usually read?", "Did you read a lot when you were a child?", "Do you prefer reading on paper or on a screen?"] },
      { topic: "Your neighbourhood", qs: ["Can you describe the area where you live?", "What facilities are there near your home?", "Do you know your neighbours well?", "What would you change about your neighbourhood?"] }
    ],
    part2: {
      title: "Describe a teacher who had an important influence on you.",
      points: ["who the teacher was", "what subject they taught", "what they were like", "and explain why they influenced you."],
      followUp: "Are you still in contact with this teacher?"
    },
    part3: [
      "What qualities make a good teacher?",
      "How has the role of teachers changed because of technology?",
      "Should schools focus more on practical skills or academic subjects?",
      "Do you think students learn better in groups or alone?",
      "How might education be different in twenty years' time?"
    ]
  }
};

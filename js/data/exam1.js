/* Пробный экзамен IELTS Academic — вариант 1. Все тексты и вопросы оригинальные. */
window.EXAMS = window.EXAMS || {};
window.EXAMS.v1 = {
  id: "v1",
  title: "Вариант 1",

  /* ---------------- LISTENING ---------------- */
  listening: {
    parts: [
      {
        id: "part1",
        title: "Part 1 — Booking a holiday cottage",
        kind: "Бытовой диалог",
        intro: "Part 1. You will hear a woman at a holiday rental company talking to a man who wants to book a cottage. First, you have some time to look at questions 1 to 10.",
        speakers: [{ id: "A", name: "Agent", gender: "f" }, { id: "B", name: "Peter", gender: "m" }],
        script: [
          ["A", "Good afternoon, Lakeside Holiday Lets. This is Sarah speaking. How can I help?"],
          ["B", "Hello. I'm interested in renting one of your cottages this summer."],
          ["A", "Lovely. Let me take some details. What's your name, please?"],
          ["B", "Peter Hollis. That's H, O, L, L, I, S."],
          ["A", "Thank you, Mr Hollis. And how many people will be staying?"],
          ["B", "At first it was going to be four of us, but my sister's son is coming too, so it's two adults and three children."],
          ["A", "So five altogether. Do you have a particular cottage in mind?"],
          ["B", "A friend recommended one called Oak Cottage, but I think that might be too small for us."],
          ["A", "Yes, Oak Cottage only sleeps four. For five people I'd suggest Willow Cottage. It has three bedrooms and a garden that goes right down to the lake."],
          ["B", "Willow Cottage sounds perfect."],
          ["A", "And when would you like to arrive?"],
          ["B", "We were thinking of Saturday the twenty-third of July."],
          ["A", "Let me check. Yes, it's free from the twenty-third. How long would you like to stay?"],
          ["B", "A week, so seven nights."],
          ["A", "That's fine. The price in July is eighty-five pounds a night. In August it goes up to ninety-five, so you've chosen a good time."],
          ["B", "Great. We'll be bringing our dog. Is that a problem?"],
          ["A", "Not at all. Dogs are welcome, but there's an extra cleaning charge of twenty pounds for the whole stay."],
          ["B", "That's reasonable. Are there any shops nearby?"],
          ["A", "There's a small shop at the marina, but the nearest supermarket is in the village of Brampton, about ten minutes by car."],
          ["B", "Could you spell that?"],
          ["A", "B, R, A, M, P, T, O, N."],
          ["B", "Thanks. And how do we get the keys? We probably won't arrive until quite late."],
          ["A", "That's no problem. The keys are in a key box by the front door. The code is four, seven, one, nine."],
          ["B", "Four, seven, one, nine. Got it."],
          ["A", "Finally, to confirm the booking, we need a deposit. Could you pay it by Friday?"],
          ["B", "Yes, I'll do it online tomorrow."],
          ["A", "Wonderful. I'll email you all the details."]
        ],
        questions: [
          { type: "info", text: "Questions 1–10. Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer." },
          { type: "gap", text: "Customer name: Peter ______", answer: ["Hollis"] },
          { type: "gap", text: "Number of guests: ______", answer: ["5", "five"] },
          { type: "gap", text: "Cottage: ______ Cottage", answer: ["Willow"] },
          { type: "gap", text: "Arrival: Saturday ______ July", answer: ["23rd", "23", "twenty-third"] },
          { type: "gap", text: "Length of stay: ______ nights", answer: ["7", "seven"] },
          { type: "gap", text: "Price per night: £______", answer: ["85", "eighty-five"] },
          { type: "gap", text: "Extra cleaning charge for the dog: £______", answer: ["20", "twenty"] },
          { type: "gap", text: "Nearest supermarket: in the village of ______", answer: ["Brampton"] },
          { type: "gap", text: "Key box code: ______", answer: ["4719"] },
          { type: "gap", text: "Deposit to be paid by ______", answer: ["Friday"] }
        ]
      },
      {
        id: "part2",
        title: "Part 2 — A community garden open day",
        kind: "Монолог на бытовую тему",
        intro: "Part 2. You will hear a man on a local radio programme talking about an open day at a community garden. First, you have some time to look at questions 11 to 20.",
        speakers: [{ id: "A", name: "Tom Harris", gender: "m" }],
        script: [
          ["A", "Good morning, and thanks for having me on the programme. I'm Tom Harris, and I coordinate the Riverside Community Garden. I'm here to tell you about our open day, which takes place on Sunday the fourteenth of May."],
          ["A", "The garden started twelve years ago on a piece of land that used to be a car park. Today we have more than two hundred members, and most of them live within walking distance."],
          ["A", "The open day runs from ten until four. Entry is free, but we do ask for a small donation. In the past we've used the money for tools, and last year it paid for a new shed. This year we're hoping to buy a rainwater tank."],
          ["A", "Parking is very limited, so we're encouraging people to come by bike, and there'll be a secure area for bicycles. If you really must drive, the supermarket on Mill Lane has kindly offered its car park."],
          ["A", "Children are very welcome, but please note that under-twelves need to be with an adult at all times, especially near the water."],
          ["A", "Now, let me take you on a quick tour. As you come in through the main gate, you'll find volunteers who'll be leading guided walks every hour, so that's a good place to start."],
          ["A", "Just beyond that is the orchard. Our apple trees did very well this year, and you'll be able to taste several unusual varieties that you won't find in the shops."],
          ["A", "To the left of the orchard is the pond. It's home to frogs, newts and dragonflies, and one of our members, who is a biologist, will be there with nets and magnifying glasses so you can look at the wildlife in the water."],
          ["A", "The greenhouse will be busy. People always ask to buy the plants we grow there, so this year we're finally selling tomato and pepper seedlings."],
          ["A", "Next to it is the bee garden. We have a special glass-sided hive, so you can watch the bees working without any danger of being stung."],
          ["A", "We had hoped to run a composting workshop as well, but unfortunately the volunteer who normally leads it is away that weekend."],
          ["A", "And finally, in the community kitchen, our chef will show you how to make soup from the vegetables we've grown. There'll be sessions at twelve and at two. We hope to see you there."]
        ],
        questions: [
          { type: "info", text: "Questions 11–14. Choose the correct letter, A, B or C." },
          { type: "mcq", text: "The community garden was created on land that had been", options: ["a car park.", "a school playing field.", "a factory site."], answer: 0 },
          { type: "mcq", text: "This year, donations will be used to buy", options: ["new tools.", "a new shed.", "a rainwater tank."], answer: 2 },
          { type: "mcq", text: "Visitors who come by car should park", options: ["near the main gate.", "at a supermarket.", "in the street."], answer: 1 },
          { type: "mcq", text: "What does the speaker say about children?", options: ["They must stay with an adult.", "They have to pay a small fee.", "They need to book in advance."], answer: 0 },
          {
            type: "info",
            text: "Questions 15–20. What can visitors do at each place in the garden? Choose SIX answers from the list, A–G.",
            list: [["A", "buy young plants"], ["B", "watch a cooking demonstration"], ["C", "taste fruit"], ["D", "watch insects safely"], ["E", "join a guided walk"], ["F", "learn about composting"], ["G", "look at water wildlife"]]
          },
          { type: "match", text: "the main gate", options: "ABCDEFG", answer: "E" },
          { type: "match", text: "the orchard", options: "ABCDEFG", answer: "C" },
          { type: "match", text: "the pond", options: "ABCDEFG", answer: "G" },
          { type: "match", text: "the greenhouse", options: "ABCDEFG", answer: "A" },
          { type: "match", text: "the bee garden", options: "ABCDEFG", answer: "D" },
          { type: "match", text: "the community kitchen", options: "ABCDEFG", answer: "B" }
        ]
      },
      {
        id: "part3",
        title: "Part 3 — Planning a presentation on noise",
        kind: "Учебная дискуссия",
        intro: "Part 3. You will hear two students, Anna and Ben, discussing a presentation they are preparing about noise pollution. First, you have some time to look at questions 21 to 30.",
        speakers: [{ id: "A", name: "Anna", gender: "f" }, { id: "B", name: "Ben", gender: "m" }],
        script: [
          ["B", "Hi Anna. Have you got a minute to talk about our presentation on noise pollution?"],
          ["A", "Sure. I've been reading quite a lot. I didn't realise how serious the health effects are."],
          ["B", "Me neither. The article that surprised me most was about sleep. Apparently, people living near airports often don't wake up when a plane passes, but their heart rate still goes up every time."],
          ["A", "I read that one too. I think it should be our starting point, because everyone can relate to poor sleep."],
          ["B", "Agreed. What about our own data? Our tutor said we should include some original research."],
          ["A", "I've already started. I borrowed a sound meter from the physics department and measured noise levels around the campus."],
          ["B", "Where did you take the readings?"],
          ["A", "In the library, the canteen and next to the main road. The surprising thing was that the canteen was actually louder than the road at lunchtime."],
          ["B", "That's a great finding. People will be shocked."],
          ["A", "The problem is that we only have one day of measurements. I'm not sure it's enough."],
          ["B", "We could present it as a limitation. It's better to be honest about it than to leave the data out, and we don't really have time to collect more."],
          ["A", "OK. And how long should the presentation be? I thought fifteen minutes."],
          ["B", "The guidelines say twelve minutes, and then three minutes for questions."],
          ["A", "Right. Should we use slides?"],
          ["B", "Yes, but not too many words. Last time our slides were far too crowded. Maybe we could begin by playing a short recording of traffic noise, just to get everyone's attention."],
          ["A", "I love that idea. Much better than starting with a question."],
          ["A", "Let's divide the work. I'll write the section on health effects, since I've read the most about it."],
          ["B", "Then I'll do the part on solutions, like quieter road surfaces and better insulation."],
          ["A", "Who's going to make the charts from the sound meter data?"],
          ["B", "I'm better with spreadsheets, so leave that to me."],
          ["A", "Fine. Then I'll find a good recording of traffic noise."],
          ["B", "And the introduction?"],
          ["A", "Let's write that together once everything else is done."],
          ["B", "And the conclusion too, I suppose."],
          ["A", "Actually, I'd rather you did the conclusion. You're much better at summarising than I am."],
          ["B", "OK, fair enough."]
        ],
        questions: [
          { type: "info", text: "Questions 21–25. Choose the correct letter, A, B or C." },
          { type: "mcq", text: "What surprised Ben most in his reading?", options: ["how aircraft noise affects the hearts of sleeping people", "how many people live near airports", "how expensive noise insulation is"], answer: 0 },
          { type: "mcq", text: "Which place was the noisiest at lunchtime?", options: ["the library", "the canteen", "the main road"], answer: 1 },
          { type: "mcq", text: "What do they decide to do about their limited data?", options: ["collect more measurements", "mention it as a limitation", "leave it out of the presentation"], answer: 1 },
          { type: "mcq", text: "How long will the presentation itself last?", options: ["12 minutes", "15 minutes", "18 minutes"], answer: 0 },
          { type: "mcq", text: "How will they begin the presentation?", options: ["with a question for the audience", "with a recording of noise", "with a chart of their results"], answer: 1 },
          { type: "info", text: "Questions 26–30. Who will do each task? Write A, B or C.", list: [["A", "Anna"], ["B", "Ben"], ["C", "both Anna and Ben"]] },
          { type: "match", text: "the section on health effects", options: "ABC", answer: "A" },
          { type: "match", text: "the charts", options: "ABC", answer: "B" },
          { type: "match", text: "the recording", options: "ABC", answer: "A" },
          { type: "match", text: "the introduction", options: "ABC", answer: "C" },
          { type: "match", text: "the conclusion", options: "ABC", answer: "B" }
        ]
      },
      {
        id: "part4",
        title: "Part 4 — Lecture: a short history of glass",
        kind: "Академическая лекция",
        intro: "Part 4. You will hear part of a lecture about the history of glass. First, you have some time to look at questions 31 to 40.",
        speakers: [{ id: "A", name: "Lecturer", gender: "f" }],
        script: [
          ["A", "Today's lecture is about glass, a material we use every day but rarely think about. Glass is made mainly from sand, which is heated to a very high temperature until it melts."],
          ["A", "The earliest known glass objects are beads that were made in Mesopotamia about four and a half thousand years ago. At first, glass was so rare that it was treated like a precious stone and worn as jewellery."],
          ["A", "A major breakthrough came around two thousand years ago, when craftsmen discovered glassblowing. By blowing air through a metal tube into melted glass, they could produce thin containers quickly. As a result, glass became cheap enough for ordinary people to use for storing food and drink."],
          ["A", "In the Middle Ages, glass was used to create the famous coloured windows in European cathedrals. The colours came from adding small amounts of metals. For example, copper produced a blue-green colour, while gold, surprisingly, produced red."],
          ["A", "Clear, flat glass for ordinary windows remained expensive for centuries. In England, houses were even taxed according to the number of windows they had, and some owners blocked their windows up to avoid paying."],
          ["A", "In the twentieth century, a new method called the float process changed everything. Melted glass was poured onto a bath of liquid tin, where it spread out to form a perfectly flat sheet. This method is still used for almost all window glass today."],
          ["A", "Modern research focuses on making glass stronger and more useful. The glass in smartphone screens, for instance, is treated with chemicals to make it resistant to scratches. Another promising area is smart glass, which can darken automatically in bright sunlight, reducing the need for air conditioning."],
          ["A", "Finally, glass is one of the easiest materials to recycle, because it can be melted and reused again and again without losing quality."]
        ],
        questions: [
          { type: "info", text: "Questions 31–40. Complete the notes below. Write ONE WORD ONLY for each answer." },
          { type: "gap", text: "Main ingredient of glass: ______", answer: ["sand"] },
          { type: "gap", text: "Earliest glass objects: ______ made in Mesopotamia", answer: ["beads"] },
          { type: "gap", text: "Early glass was treated like a precious ______", answer: ["stone"] },
          { type: "gap", text: "Glassblowing: air blown through a metal ______", answer: ["tube"] },
          { type: "gap", text: "Glass became cheap enough for storing food and ______", answer: ["drink"] },
          { type: "gap", text: "Cathedral windows: colours created by adding small amounts of ______", answer: ["metals", "metal"] },
          { type: "gap", text: "Gold produced the colour ______", answer: ["red"] },
          { type: "gap", text: "In England, houses were taxed on the number of ______", answer: ["windows"] },
          { type: "gap", text: "Float process: melted glass poured onto liquid ______", answer: ["tin"] },
          { type: "gap", text: "Smart glass darkens automatically in bright ______", answer: ["sunlight"] }
        ]
      }
    ]
  },

  /* ---------------- READING ---------------- */
  reading: {
    passages: [
      {
        title: "The Humble Pencil",
        paragraphs: [
          ["A", "Few everyday objects are as familiar, or as overlooked, as the pencil. Billions are produced each year, yet most people have little idea how they are made or where the idea came from. The story begins in the 1560s in Borrowdale, a valley in the north of England, where a large deposit of an unusual black mineral was discovered. Local shepherds found that it left a dark mark on stone, and they began using it to mark their sheep. The discovery was not immediately recognised as important. For many years the material was used only by people in the valley, and it was a long time before anyone elsewhere took an interest in it."],
          ["B", "At the time, nobody understood what the substance was. Because it looked similar to lead, it was called 'plumbago', from the Latin word for lead, and this confusion explains why the core of a pencil is still often called its 'lead' today, even though it contains none. It was only in 1779 that the Swedish chemist Carl Scheele showed that the mineral was actually a form of carbon. Ten years later it was given the name graphite, from a Greek word meaning 'to write'. Graphite is made entirely of carbon atoms arranged in flat layers. These layers slide easily over one another, which is why graphite leaves a mark when it is pressed against paper."],
          ["C", "The Borrowdale graphite was exceptionally pure and could be cut into thin sticks without any further treatment. However, these sticks were fragile and made users' hands dirty, so people began wrapping them in string or sheepskin. Later, craftsmen in Italy are thought to have placed the graphite inside a hollowed-out piece of wood, creating something close to the modern pencil. The mineral became so valuable that the mine was guarded, and in 1752 the British Parliament made stealing graphite a crime punishable by imprisonment. Even so, smuggling continued, and some miners are said to have hidden pieces of graphite in their clothing as they left work."],
          ["D", "Other countries, lacking a supply of pure graphite, had to find another solution. In 1795, during a war that cut France off from English supplies, the French engineer Nicolas-Jacques Conté developed a method of mixing powdered graphite with clay and baking the mixture in a kiln. This process had two major advantages. First, it allowed lower-quality graphite to be used. Second, by changing the proportion of clay, manufacturers could control how hard or soft the pencil was. More clay produced a harder, lighter line, while less clay produced a softer, darker one. Conté's method is essentially the one still used today. Today, pencils are graded using a system of letters and numbers. 'H' pencils are hard, 'B' pencils are soft and black, and 'HB' pencils fall in the middle, which makes them the most common choice for everyday writing."],
          ["E", "The shape of the pencil has also evolved. Early wooden pencils were often round, but they had a tendency to roll off desks. Hexagonal pencils, which are easier to grip and stay where they are put, gradually became the standard. The famous yellow colour has a surprising origin: in the 1890s, an American company began painting its pencils yellow to suggest that they contained high-quality graphite from China, a country associated with the colour. The strategy was so successful that competitors soon copied it. Another important addition was the eraser. In 1858, an American inventor received a patent for attaching a small piece of rubber to the end of a pencil, an idea that is now so common that many people assume pencils have always been made this way."],
          ["F", "Despite the rise of digital devices, the pencil remains remarkably popular. It works in extreme temperatures and even without gravity, which is why astronauts have used pencils in space. Artists value the range of tones that different grades can produce, and many writers still prefer to draft their work by hand. In many countries, pencils are also the standard tool for children learning to write and for students taking multiple-choice examinations, since their marks can easily be read by scanning machines. Perhaps most importantly, a pencil mark can be erased, making it the ideal tool for anyone who expects to make mistakes."]
        ],
        questions: [
          { type: "info", text: "Questions 1–5. Do the following statements agree with the information given in the passage? Choose TRUE, FALSE or NOT GIVEN." },
          { type: "tfng", text: "Shepherds in Borrowdale used the mineral to mark their animals.", answer: "TRUE" },
          { type: "tfng", text: "The core of a modern pencil contains a small amount of real lead.", answer: "FALSE" },
          { type: "tfng", text: "The Borrowdale graphite had to be mixed with other materials before it could be used.", answer: "FALSE" },
          { type: "tfng", text: "Italian craftsmen were the first people to sell pencils commercially.", answer: "NOT GIVEN" },
          { type: "tfng", text: "In eighteenth-century Britain, stealing graphite could lead to prison.", answer: "TRUE" },
          { type: "info", text: "Questions 6–9. Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer." },
          { type: "gap", text: "Conté mixed powdered graphite with ______ and baked it in a kiln.", answer: ["clay"] },
          { type: "gap", text: "Conté's process meant that ______ graphite could be used.", answer: ["lower-quality", "lower quality"] },
          { type: "gap", text: "Using more clay produces a harder and ______ line.", answer: ["lighter"] },
          { type: "gap", text: "Round pencils had a tendency to ______ off desks.", answer: ["roll"] },
          { type: "info", text: "Questions 10–13. Choose the correct letter, A, B, C or D." },
          { type: "mcq", text: "Why were early graphite sticks wrapped in string or sheepskin?", options: ["to make them look more attractive", "because they broke easily and were dirty to hold", "to protect them from thieves", "because wood was too expensive"], answer: 1 },
          { type: "mcq", text: "Why did Conté develop his method?", options: ["He wanted to make pencils more cheaply than the English.", "France could no longer obtain English graphite.", "The Borrowdale mine had closed.", "Artists asked him for softer pencils."], answer: 1 },
          { type: "mcq", text: "In the 1890s, pencils were painted yellow in order to", options: ["make them easier to find on a desk.", "match the colour of a company logo.", "suggest that the graphite came from China.", "copy a successful competitor."], answer: 2 },
          { type: "mcq", text: "According to the writer, the most important advantage of the pencil is that", options: ["it can be used in space.", "it produces many different tones.", "its marks can be removed.", "it is cheaper than a pen."], answer: 2 }
        ]
      },
      {
        title: "Urban Heat Islands",
        paragraphs: [
          ["A", "On a hot summer afternoon, the centre of a large city can be several degrees warmer than the surrounding countryside. This phenomenon, known as the urban heat island effect, was first described in the early nineteenth century by Luke Howard, an amateur scientist who recorded temperatures in and around London. He noticed that the city was consistently warmer, especially at night. Two centuries later, with more than half of the world's population living in urban areas, the effect has become a serious concern. Since Howard's time, researchers have used weather stations and satellites to measure the effect in cities all over the world. The difference is usually greatest in large, densely built cities and on calm, clear nights, when heat escapes most slowly."],
          ["B", "Several factors combine to create urban heat islands. Dark surfaces such as asphalt roads and roofs absorb large amounts of sunlight during the day and release it slowly as heat after sunset. Tall buildings trap this heat and block the wind that might otherwise carry it away. In addition, cars, air conditioners and factories all produce waste heat. Finally, cities have far fewer trees and plants than rural areas, which means there is less evaporation from leaves to cool the air. Even the layout of streets matters: narrow streets lined with tall buildings, sometimes called 'urban canyons', reduce the amount of heat that can escape into the sky at night."],
          ["C", "The consequences go well beyond discomfort. During heatwaves, hospitals in cities report sharp increases in admissions, particularly among elderly people and those with heart or breathing problems. Higher temperatures also speed up the chemical reactions that produce ground-level ozone, a pollutant that irritates the lungs. Moreover, as residents switch on air conditioners, demand for electricity rises, which can lead to power cuts at the very moment that cooling is most needed. Wildlife is affected too. Some insects and birds have been observed changing their behaviour in warmer city centres, and urban trees often come into leaf earlier in spring than those in the countryside."],
          ["D", "One of the simplest responses is to change the colour of surfaces. Light-coloured materials reflect more sunlight and therefore stay cooler. In Los Angeles, some streets have been coated with a grey reflective paint, and measurements suggest that their surface temperature has fallen by around five degrees. 'Cool roofs', painted white or covered with reflective materials, can similarly reduce the temperature inside buildings, lowering the need for air conditioning. Such measures are relatively cheap and can be introduced quickly, which makes them attractive to city governments with limited budgets. However, their benefits depend on the surfaces staying clean, since dirt reduces their ability to reflect light."],
          ["E", "Another approach is to bring nature back into the city. Planting trees along streets provides shade and increases evaporation. Green roofs, covered with grasses and small plants, insulate buildings and absorb rainwater. Singapore is often cited as a leader in this area: the city has introduced rules requiring new developments to replace any green space lost during construction, often in the form of rooftop gardens or plant-covered walls. Parks help as well: studies have found that a large park can be several degrees cooler than the streets around it, and the cooling effect can extend into nearby neighbourhoods. Fountains and restored rivers can have a similar effect."],
          ["F", "Nevertheless, experts warn that there is no single solution. Reflective surfaces can create glare for pedestrians and drivers, and trees need water, which may be scarce in dry regions. Researchers therefore argue that city planners must consider local conditions carefully, combining different strategies rather than relying on any one method. Some cities have begun to produce detailed temperature maps, street by street, so that measures can be targeted at the areas where the most vulnerable residents live. As climate change brings more frequent heatwaves, finding the right combination is likely to become increasingly urgent."]
        ],
        questions: [
          {
            type: "info",
            text: "Questions 14–19. The passage has six paragraphs, A–F. Choose the correct heading for each paragraph from the list of headings below.",
            list: [["i", "How nature can cool cities"], ["ii", "The origins of a modern problem"], ["iii", "Why cities trap heat"], ["iv", "A plan to move people out of cities"], ["v", "The dangers of urban heat"], ["vi", "Choosing a mix of measures"], ["vii", "Cooling cities by changing surfaces"], ["viii", "The rising cost of air conditioning"]]
          },
          { type: "match", text: "Paragraph A", options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"], answer: "ii" },
          { type: "match", text: "Paragraph B", options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"], answer: "iii" },
          { type: "match", text: "Paragraph C", options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"], answer: "v" },
          { type: "match", text: "Paragraph D", options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"], answer: "vii" },
          { type: "match", text: "Paragraph E", options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"], answer: "i" },
          { type: "match", text: "Paragraph F", options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"], answer: "vi" },
          { type: "info", text: "Questions 20–23. Complete the summary. Choose ONE WORD ONLY from the passage for each answer." },
          { type: "gap", text: "Luke Howard found that London was warmer than the countryside, particularly at ______.", answer: ["night"] },
          { type: "gap", text: "Tall buildings trap heat and block the ______.", answer: ["wind"] },
          { type: "gap", text: "Because cities have few plants, there is less ______ to cool the air.", answer: ["evaporation"] },
          { type: "gap", text: "High temperatures increase a pollutant called ground-level ______.", answer: ["ozone"] },
          { type: "info", text: "Questions 24–26. Choose the correct letter, A, B, C or D." },
          { type: "mcq", text: "What happened to the streets in Los Angeles that were coated with reflective paint?", options: ["Drivers complained about the colour.", "Their surface temperature decreased.", "They had to be repainted every year.", "Air pollution in the area fell."], answer: 1 },
          { type: "mcq", text: "Singapore requires new developments to", options: ["have white roofs.", "plant trees along every street.", "replace any green space that is lost.", "use less air conditioning."], answer: 2 },
          { type: "mcq", text: "What is the main point of paragraph F?", options: ["Reflective surfaces are dangerous.", "Trees are unsuitable for dry cities.", "Different methods should be combined.", "Climate change cannot be stopped."], answer: 2 }
        ]
      },
      {
        title: "The Paradox of Choice",
        paragraphs: [
          ["A", "It seems obvious that having more options is a good thing. If a café offers twenty types of coffee instead of three, customers are more likely to find exactly what they want. Economists have traditionally assumed that people make rational decisions, and that additional choices can only increase satisfaction, since anyone who does not want them can simply ignore them. Over the past twenty-five years, however, psychologists have challenged this assumption. Their doubts arose partly because shops, restaurants and online services were competing to offer ever larger ranges of products, and it was not clear that customers were any happier as a result."],
          ["B", "The most famous study in this area was carried out in a Californian supermarket in 2000 by Sheena Iyengar and Mark Lepper. On one day, shoppers passing a tasting table were offered samples from a selection of 24 jams; on another day, the table displayed only six. The larger display attracted more attention: 60 per cent of passers-by stopped, compared with 40 per cent for the smaller one. Yet when it came to buying, the results were reversed. Only 3 per cent of those who saw 24 jams made a purchase, while 30 per cent of those who saw six did so."],
          ["C", "Iyengar and Lepper called this 'choice overload'. Their explanation was that comparing many similar options requires considerable mental effort. When the effort becomes too great, people may postpone the decision or avoid it altogether. The psychologist Barry Schwartz later popularised the idea in a best-selling book, arguing that an abundance of options can also make people less happy with the choices they do make, because they keep wondering whether one of the alternatives would have been better. He also suggested that when there are many options, people's expectations rise, so that even a good choice can feel disappointing."],
          ["D", "Not all researchers have found the same effect. In 2010, a team led by Benjamin Scheibehenne analysed the results of fifty experiments on choice overload and found that, on average, the size of the effect was close to zero. In some studies more choice reduced purchases, but in others it increased them. This led some commentators to conclude that choice overload was a myth. Others pointed out that many of the earlier experiments had involved small groups of university students, who might not behave in the same way as ordinary shoppers."],
          ["E", "More recent work suggests a more nuanced picture. Choice overload appears to depend on the circumstances. It is most likely to occur when people have no clear preferences in advance, when the options are difficult to compare, and when they are under time pressure. By contrast, experts who know exactly what they are looking for, such as experienced wine buyers, are rarely troubled by large selections. The way options are presented also matters: when a large range is organised into clear categories, people are much less likely to feel overwhelmed."],
          ["F", "These findings have practical implications. Some companies have reduced the number of products they offer and seen sales rise. Online shops often help customers by providing filters, recommendations or a small number of 'featured' items, which make large ranges easier to navigate. Governments, too, have applied the research: when employees are automatically enrolled in a pension plan with a sensible default option, far more of them save for retirement than when they must choose from a long list."],
          ["G", "For individuals, the lesson may be to recognise when a decision is worth the effort. Schwartz distinguishes between 'maximisers', who try to find the best possible option, and 'satisficers', who are content with one that is good enough. His research suggests that satisficers, although they may make slightly worse choices, tend to feel more satisfied with them. In everyday life, this might mean setting a time limit for minor decisions, such as choosing a restaurant, while saving careful research for important ones, such as choosing a job or a place to live."]
        ],
        questions: [
          { type: "info", text: "Questions 27–31. The passage has seven paragraphs, A–G. Which paragraph contains the following information? Choose the correct letter, A–G." },
          { type: "para", text: "an example of how a government has used findings about choice", answer: "F" },
          { type: "para", text: "a description of the conditions in which the effect is strongest", answer: "E" },
          { type: "para", text: "figures showing how many people bought a product", answer: "B" },
          { type: "para", text: "a reference to a traditional belief about decision-making", answer: "A" },
          { type: "para", text: "an analysis that combined the results of many studies", answer: "D" },
          { type: "info", text: "Questions 32–35. Do the following statements agree with the claims of the writer? Choose YES, NO or NOT GIVEN." },
          { type: "yng", text: "Economists traditionally believed that extra choices could not make people worse off.", answer: "YES" },
          { type: "yng", text: "Schwartz's book was based only on the supermarket study.", answer: "NOT GIVEN" },
          { type: "yng", text: "Scheibehenne's analysis proved that choice overload does not exist.", answer: "NO" },
          { type: "yng", text: "Experienced wine buyers are often confused by large selections.", answer: "NO" },
          { type: "info", text: "Questions 36–40. Complete the summary. Choose ONE WORD OR A NUMBER from the passage for each answer." },
          { type: "gap", text: "In the jam study, 30 per cent of shoppers who saw ______ jams bought one.", answer: ["six", "6"] },
          { type: "gap", text: "Comparing many similar options requires considerable mental ______.", answer: ["effort"] },
          { type: "gap", text: "When overloaded, people may ______ the decision or avoid it altogether.", answer: ["postpone"] },
          { type: "gap", text: "Online shops help customers with filters and ______.", answer: ["recommendations"] },
          { type: "gap", text: "'Satisficers' are content with an option that is good ______.", answer: ["enough"] }
        ]
      }
    ]
  },

  /* ---------------- WRITING ---------------- */
  writing: {
    task1: {
      prompt: "The graph below shows the percentage of commuters who cycled to work in three cities between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
      chart: {
        type: "line",
        title: "Commuters cycling to work (%)",
        unit: "%",
        max: 50,
        labels: ["2000", "2005", "2010", "2015", "2020"],
        series: [
          { name: "Northport", values: [22, 25, 31, 36, 41] },
          { name: "Easton", values: [15, 14, 12, 11, 13] },
          { name: "Westfield", values: [5, 7, 12, 20, 27] }
        ]
      }
    },
    task2: {
      prompt: "Some people think that cities should ban private cars from their centres completely. To what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience."
    }
  },

  /* ---------------- SPEAKING ---------------- */
  speaking: {
    part1: [
      { topic: "Your hometown", qs: ["Where is your hometown?", "What do you like most about living there?", "Has your hometown changed much since you were a child?", "Would you like to live there in the future? Why or why not?"] },
      { topic: "Daily routine", qs: ["What does a typical weekday look like for you?", "Are you a morning person or an evening person?", "Is there anything in your routine you would like to change?", "Do you prefer to plan your day or be spontaneous?"] }
    ],
    part2: {
      title: "Describe a piece of technology that you find useful.",
      points: ["what it is", "when you started using it", "how you use it", "and explain why you find it useful."],
      followUp: "Do you think you will still be using it in five years?"
    },
    part3: [
      "How has technology changed the way people communicate in your country?",
      "Do you think older people find it harder to learn new technology? Why?",
      "Are there any disadvantages to relying too much on technology?",
      "Should children be taught to use technology from an early age?",
      "What kind of technology do you think will be most important in the future?"
    ]
  }
};

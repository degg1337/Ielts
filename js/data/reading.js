/* Тексты для Reading (оригинальные, в формате IELTS Academic). */
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

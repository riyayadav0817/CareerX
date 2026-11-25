const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' });

const Question = require('../models/Question');
const CodingProblem = require('../models/CodingProblem');
const MockTest = require('../models/MockTest');
const CompanyTrack = require('../models/CompanyTrack');
const PrepProgress = require('../models/PrepProgress');
const User = require('../models/User');

const seedPlacementData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerx_db';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for Placement Prep seeding...');

    // Clear previous prep data
    await Promise.all([
      Question.deleteMany({}),
      CodingProblem.deleteMany({}),
      MockTest.deleteMany({}),
      CompanyTrack.deleteMany({}),
    ]);

    console.log('Cleared existing placement preparation collections.');

    // 1. APTITUDE QUESTIONS (Covering all 12 requested topics)
    const aptitudeQuestions = [
      {
        category: 'aptitude',
        topic: 'Number System',
        difficulty: 'Easy',
        title: 'Divisibility and Remainders',
        question: 'What is the remainder when 2^31 is divided by 5?',
        options: [
          { id: 'A', text: '1' },
          { id: 'B', text: '2' },
          { id: 'C', text: '3' },
          { id: 'D', text: '4' },
        ],
        correctOption: 'C',
        formula: 'Cyclicity of 2 mod 5 is 4: 2^1=2, 2^2=4, 2^3=8≡3, 2^4=16≡1.',
        explanation: 'The powers of 2 modulo 5 cycle in periods of 4: (2, 4, 3, 1). We divide the exponent 31 by 4: 31 = 4*7 + 3. The remainder is 3, so 2^31 ≡ 2^3 ≡ 8 ≡ 3 (mod 5).',
        companyTags: ['TCS', 'Infosys', 'Wipro'],
      },
      {
        category: 'aptitude',
        topic: 'Percentages',
        difficulty: 'Easy',
        title: 'Successive Percentage Change',
        question: 'If the price of a commodity increases by 25% and consumption decreases by 20%, what is the net percentage change in expenditure?',
        options: [
          { id: 'A', text: '5% Increase' },
          { id: 'B', text: '0% (No Change)' },
          { id: 'C', text: '5% Decrease' },
          { id: 'D', text: '2% Decrease' },
        ],
        correctOption: 'B',
        formula: 'Net Change = a + b + (a * b) / 100',
        explanation: 'Using the formula a = +25, b = -20: Net = 25 - 20 + (25 * -20) / 100 = 5 - 5 = 0%. Expenditure remains completely unchanged.',
        companyTags: ['Cognizant', 'Capgemini'],
      },
      {
        category: 'aptitude',
        topic: 'Profit and Loss',
        difficulty: 'Medium',
        title: 'Markup and Discount',
        question: 'A shopkeeper marks his goods 40% above cost price and allows a discount of 25% on marked price. What is his profit percentage?',
        options: [
          { id: 'A', text: '5%' },
          { id: 'B', text: '8%' },
          { id: 'C', text: '10%' },
          { id: 'D', text: '15%' },
        ],
        correctOption: 'A',
        formula: 'SP = CP * (1 + Markup%) * (1 - Discount%)',
        explanation: 'Let CP = 100. Marked Price MP = 140. Discount = 25% of 140 = 35. Selling Price SP = 140 - 35 = 105. Profit = 105 - 100 = 5%.',
        companyTags: ['TCS', 'Accenture'],
      },
      {
        category: 'aptitude',
        topic: 'Simple and Compound Interest',
        difficulty: 'Medium',
        title: 'CI vs SI Difference',
        question: 'The difference between compound interest and simple interest on a sum for 2 years at 10% per annum is $65. What is the principal sum?',
        options: [
          { id: 'A', text: '$6,000' },
          { id: 'B', text: '$6,500' },
          { id: 'C', text: '$7,000' },
          { id: 'D', text: '$7,500' },
        ],
        correctOption: 'B',
        formula: 'Difference for 2 years = P * (R / 100)^2',
        explanation: '65 = P * (10 / 100)^2 => 65 = P * (1 / 100) => P = 65 * 100 = $6,500.',
        companyTags: ['Infosys', 'Wipro'],
      },
      {
        category: 'aptitude',
        topic: 'Ratio and Proportion',
        difficulty: 'Easy',
        title: 'Compound Ratios',
        question: 'If A : B = 3 : 4 and B : C = 8 : 9, find the ratio A : C.',
        options: [
          { id: 'A', text: '1 : 2' },
          { id: 'B', text: '2 : 3' },
          { id: 'C', text: '3 : 5' },
          { id: 'D', text: '4 : 5' },
        ],
        correctOption: 'B',
        formula: '(A / C) = (A / B) * (B / C)',
        explanation: '(A / C) = (3 / 4) * (8 / 9) = 24 / 36 = 2 / 3. Hence A : C = 2 : 3.',
        companyTags: ['TCS', 'Capgemini'],
      },
      {
        category: 'aptitude',
        topic: 'Time and Work',
        difficulty: 'Medium',
        title: 'Combined Work Efficiency',
        question: 'A can complete a project in 12 days and B can do it in 18 days. If they work together, how many days will they take to finish the work?',
        options: [
          { id: 'A', text: '6.5 days' },
          { id: 'B', text: '7.2 days' },
          { id: 'C', text: '8 days' },
          { id: 'D', text: '9.4 days' },
        ],
        correctOption: 'B',
        formula: 'Total Days = (A * B) / (A + B)',
        explanation: 'Combined days = (12 * 18) / (12 + 18) = 216 / 30 = 7.2 days.',
        companyTags: ['Infosys', 'Amazon', 'TCS'],
      },
      {
        category: 'aptitude',
        topic: 'Time, Speed and Distance',
        difficulty: 'Medium',
        title: 'Relative Speed of Trains',
        question: 'Two trains 140 m and 160 m long run at speeds of 60 km/h and 40 km/h respectively in opposite directions on parallel tracks. How long do they take to cross each other?',
        options: [
          { id: 'A', text: '9.6 seconds' },
          { id: 'B', text: '10.8 seconds' },
          { id: 'C', text: '12 seconds' },
          { id: 'D', text: '14.4 seconds' },
        ],
        correctOption: 'B',
        formula: 'Time = Total Distance / Relative Speed. Convert km/h to m/s by * (5 / 18).',
        explanation: 'Total Distance = 140 + 160 = 300 m. Relative Speed = 60 + 40 = 100 km/h = 100 * (5 / 18) = 250 / 9 m/s. Time = 300 / (250 / 9) = (300 * 9) / 250 = 10.8 seconds.',
        companyTags: ['TCS', 'Accenture'],
      },
      {
        category: 'aptitude',
        topic: 'Probability',
        difficulty: 'Medium',
        title: 'Card Deck Probability',
        question: 'Two cards are drawn together from a standard deck of 52 cards. What is the probability that both are Kings?',
        options: [
          { id: 'A', text: '1 / 221' },
          { id: 'B', text: '1 / 169' },
          { id: 'C', text: '4 / 663' },
          { id: 'D', text: '1 / 13' },
        ],
        correctOption: 'A',
        formula: 'P = 4C2 / 52C2',
        explanation: '4C2 = 6. 52C2 = (52 * 51) / 2 = 1326. P = 6 / 1326 = 1 / 221.',
        companyTags: ['Google', 'Amazon', 'Infosys'],
      },
      {
        category: 'aptitude',
        topic: 'Permutation and Combination',
        difficulty: 'Hard',
        title: 'Word Letter Arrangements',
        question: 'In how many different ways can the letters of the word "LEADING" be arranged such that vowels always appear together?',
        options: [
          { id: 'A', text: '360' },
          { id: 'B', text: '480' },
          { id: 'C', text: '720' },
          { id: 'D', text: '5040' },
        ],
        correctOption: 'C',
        formula: 'Arrangements = (Consonants + 1 group)! * (Vowels)!',
        explanation: 'Vowels: E, A, I (3 vowels). Consonants: L, D, N, G (4 consonants). Treat {E, A, I} as 1 item. Total items = 4 + 1 = 5. Ways to arrange 5 items = 5! = 120. Vowels can arrange among themselves in 3! = 6 ways. Total ways = 120 * 6 = 720.',
        companyTags: ['Microsoft', 'Amazon'],
      },
      {
        category: 'aptitude',
        topic: 'Averages',
        difficulty: 'Easy',
        title: 'Weighted Average Replacement',
        question: 'The average weight of 8 men increases by 1.5 kg when a new man replaces one weighing 65 kg. What is the weight of the new man?',
        options: [
          { id: 'A', text: '72 kg' },
          { id: 'B', text: '75 kg' },
          { id: 'C', text: '77 kg' },
          { id: 'D', text: '80 kg' },
        ],
        correctOption: 'C',
        formula: 'New Weight = Replaced Weight + (Total Count * Increase in Avg)',
        explanation: 'Total increase in weight = 8 * 1.5 kg = 12 kg. Weight of the new man = 65 + 12 = 77 kg.',
        companyTags: ['Wipro', 'Cognizant'],
      },
      {
        category: 'aptitude',
        topic: 'Mixtures and Allegations',
        difficulty: 'Medium',
        title: 'Milk and Water Dilution',
        question: 'A container holds 40 litres of pure milk. From this, 4 litres of milk was taken out and replaced with water. This process was repeated further two times. How much milk is now contained in the container?',
        options: [
          { id: 'A', text: '26.34 litres' },
          { id: 'B', text: '29.16 litres' },
          { id: 'C', text: '30.50 litres' },
          { id: 'D', text: '32.40 litres' },
        ],
        correctOption: 'B',
        formula: 'Remaining Liquid = Initial * [1 - (x / V)]^n',
        explanation: 'Remaining milk = 40 * [1 - (4 / 40)]^3 = 40 * (9 / 10)^3 = 40 * 0.729 = 29.16 litres.',
        companyTags: ['TCS', 'Infosys'],
      },
      {
        category: 'aptitude',
        topic: 'Data Interpretation',
        difficulty: 'Hard',
        title: 'Table Chart Analysis',
        question: 'In a company of 500 employees, 45% are in Engineering, 25% in Sales, 20% in Product, and 10% in Operations. If 60% of Engineering and 40% of Sales employees are remote, what is the total number of remote employees in these two departments combined?',
        options: [
          { id: 'A', text: '165' },
          { id: 'B', text: '175' },
          { id: 'C', text: '185' },
          { id: 'D', text: '195' },
        ],
        correctOption: 'C',
        formula: 'Remote = (Eng * 0.6) + (Sales * 0.4)',
        explanation: 'Engineering count = 45% of 500 = 225. Remote Eng = 0.6 * 225 = 135. Sales count = 25% of 500 = 125. Remote Sales = 0.4 * 125 = 50. Total = 135 + 50 = 185.',
        companyTags: ['TCS', 'Accenture', 'Amazon'],
      },
    ];

    // 2. LOGICAL REASONING (Covering all 10 requested topics)
    const reasoningQuestions = [
      {
        category: 'reasoning',
        topic: 'Coding and Decoding',
        difficulty: 'Easy',
        title: 'Letter Shifting Cipher',
        question: 'In a certain code language, if "SYSTEM" is coded as "SYSMET" and "NEARER" is coded as "AENRER", then how will "FRACTION" be coded?',
        options: [
          { id: 'A', text: 'CARFNOIT' },
          { id: 'B', text: 'CRAFNOIT' },
          { id: 'C', text: 'CARFTION' },
          { id: 'D', text: 'ARFCNOIT' },
        ],
        correctOption: 'A',
        explanation: 'The word is divided into two equal halves of 4 letters each: "FRAC" and "TION". Each half is reversed: "FRAC" becomes "CARF", and "TION" becomes "NOIT". Joining them gives "CARFNOIT".',
        companyTags: ['TCS', 'Wipro', 'Infosys'],
      },
      {
        category: 'reasoning',
        topic: 'Blood Relations',
        difficulty: 'Medium',
        title: 'Pointing to a Photograph',
        question: 'Pointing to a photograph, a woman says: "He is the only son of the wife of my father-in-law." How is the man in the photograph related to the woman?',
        options: [
          { id: 'A', text: 'Brother' },
          { id: 'B', text: 'Brother-in-law' },
          { id: 'C', text: 'Husband' },
          { id: 'D', text: 'Father' },
        ],
        correctOption: 'C',
        explanation: 'Wife of woman\'s father-in-law is her mother-in-law. The "only son" of her mother-in-law is the woman\'s husband.',
        companyTags: ['Cognizant', 'Capgemini'],
      },
      {
        category: 'reasoning',
        topic: 'Direction Sense',
        difficulty: 'Easy',
        title: 'Compass Walking Path',
        question: 'Rohan walks 12 km North, turns right and walks 5 km. How far is he from his starting point?',
        options: [
          { id: 'A', text: '13 km' },
          { id: 'B', text: '15 km' },
          { id: 'C', text: '17 km' },
          { id: 'D', text: '11 km' },
        ],
        correctOption: 'A',
        formula: 'Distance = sqrt(North^2 + East^2)',
        explanation: 'By the Pythagorean theorem: Distance = sqrt(12^2 + 5^2) = sqrt(144 + 25) = sqrt(169) = 13 km.',
        companyTags: ['TCS', 'Infosys'],
      },
      {
        category: 'reasoning',
        topic: 'Seating Arrangements',
        difficulty: 'Medium',
        title: 'Circular Seating Logic',
        question: 'Six friends A, B, C, D, E, and F sit around a circular table facing the center. A is opposite D. B is immediately to the right of A. E is between D and B. Who is sitting immediately to the left of A?',
        options: [
          { id: 'A', text: 'C' },
          { id: 'B', text: 'F' },
          { id: 'C', text: 'E' },
          { id: 'D', text: 'Either C or F' },
        ],
        correctOption: 'D',
        explanation: 'Since positions for C and F are not specified relative to A\'s left, either C or F can occupy the position directly to A\'s left.',
        companyTags: ['Wipro', 'Amazon'],
      },
      {
        category: 'reasoning',
        topic: 'Puzzles',
        difficulty: 'Hard',
        title: 'Day and Floor Scheduling',
        question: 'Five developers (P, Q, R, S, T) deploy code on Monday through Friday, one per day. P deploys before R. Q deploys on Wednesday. T deploys immediately after R. Who deploys on Monday?',
        options: [
          { id: 'A', text: 'P' },
          { id: 'B', text: 'S' },
          { id: 'C', text: 'T' },
          { id: 'D', text: 'Cannot be determined' },
        ],
        correctOption: 'A',
        explanation: 'Q is Wednesday. R and T must be consecutive (R then T), so they must occupy Thursday and Friday. Thus P and S occupy Monday and Tuesday. Since P must deploy before R, and if S is Tuesday, P must be Monday.',
        companyTags: ['Google', 'Microsoft'],
      },
      {
        category: 'reasoning',
        topic: 'Syllogisms',
        difficulty: 'Medium',
        title: 'Venn Diagram Deductions',
        question: 'Statements: (1) All laptops are machines. (2) Some machines are portable. Conclusions: I. Some laptops are portable. II. No laptop is portable.',
        options: [
          { id: 'A', text: 'Only conclusion I follows' },
          { id: 'B', text: 'Only conclusion II follows' },
          { id: 'C', text: 'Either I or II follows' },
          { id: 'D', text: 'Neither I nor II follows' },
        ],
        correctOption: 'C',
        explanation: 'Since the relationship between Laptops and Portable is indeterminate, Conclusions I and II form a complementary pair ("Some" and "No"). Therefore, Either I or II follows.',
        companyTags: ['TCS', 'Infosys'],
      },
      {
        category: 'reasoning',
        topic: 'Number and Alphabet Series',
        difficulty: 'Easy',
        title: 'Alternating Number Patterns',
        question: 'Find the next number in the series: 4, 9, 25, 49, 121, ___?',
        options: [
          { id: 'A', text: '144' },
          { id: 'B', text: '169' },
          { id: 'C', text: '196' },
          { id: 'D', text: '225' },
        ],
        correctOption: 'B',
        explanation: 'The numbers are squares of consecutive prime numbers: 2^2=4, 3^2=9, 5^2=25, 7^2=49, 11^2=121. The next prime number is 13, so 13^2 = 169.',
        companyTags: ['Accenture', 'Capgemini'],
      },
      {
        category: 'reasoning',
        topic: 'Analogies',
        difficulty: 'Easy',
        title: 'Semantic Analogies',
        question: 'Clock : Time :: Thermometer : ?',
        options: [
          { id: 'A', text: 'Heat' },
          { id: 'B', text: 'Radiation' },
          { id: 'C', text: 'Temperature' },
          { id: 'D', text: 'Energy' },
        ],
        correctOption: 'C',
        explanation: 'A clock measures time; a thermometer measures temperature.',
        companyTags: ['Wipro', 'TCS'],
      },
      {
        category: 'reasoning',
        topic: 'Data Sufficiency',
        difficulty: 'Hard',
        title: 'Age Determination Sufficiency',
        question: 'Is X older than Y? Statement 1: X is 3 years older than Z. Statement 2: Z is younger than Y.',
        options: [
          { id: 'A', text: 'Statement 1 alone is sufficient' },
          { id: 'B', text: 'Statement 2 alone is sufficient' },
          { id: 'C', text: 'Both statements together are sufficient' },
          { id: 'D', text: 'Statements 1 and 2 together are NOT sufficient' },
        ],
        correctOption: 'D',
        explanation: 'From (1): X = Z + 3. From (2): Z < Y. We do not know whether X > Y (e.g., if Z=10, X=13, Y could be 12 (X>Y) or 15 (X<Y)). Therefore, data is insufficient.',
        companyTags: ['Amazon', 'Infosys'],
      },
      {
        category: 'reasoning',
        topic: 'Logical Deductions',
        difficulty: 'Medium',
        title: 'Cause and Effect',
        question: 'Statement I: Municipal corporation declared a 48-hour water cut. Statement II: Major pipeline maintenance work is underway.',
        options: [
          { id: 'A', text: 'Statement I is cause and Statement II is effect' },
          { id: 'B', text: 'Statement II is cause and Statement I is effect' },
          { id: 'C', text: 'Both are independent causes' },
          { id: 'D', text: 'Both are effects of independent causes' },
        ],
        correctOption: 'B',
        explanation: 'The pipeline repair work (Statement II) is the direct cause that resulted in the water cut (Statement I).',
        companyTags: ['TCS', 'Cognizant'],
      },
    ];

    // 3. VERBAL ABILITY (Covering all 8 requested topics)
    const verbalQuestions = [
      {
        category: 'verbal',
        topic: 'Grammar',
        difficulty: 'Easy',
        title: 'Subject-Verb Agreement',
        question: 'Neither the manager nor the software engineers ___ able to resolve the production outage.',
        options: [
          { id: 'A', text: 'was' },
          { id: 'B', text: 'were' },
          { id: 'C', text: 'is' },
          { id: 'D', text: 'has been' },
        ],
        correctOption: 'B',
        explanation: 'When subjects are connected by "neither... nor", the verb agrees with the closer subject ("software engineers", which is plural), hence "were".',
        companyTags: ['TCS', 'Infosys'],
      },
      {
        category: 'verbal',
        topic: 'Vocabulary',
        difficulty: 'Medium',
        title: 'Contextual Word Usage',
        question: 'The CEO gave an ___ response that left analysts uncertain about the quarterly forecast.',
        options: [
          { id: 'A', text: 'Unequivocal' },
          { id: 'B', text: 'Ambiguous' },
          { id: 'C', text: 'Articulate' },
          { id: 'D', text: 'Lucid' },
        ],
        correctOption: 'B',
        explanation: '"Ambiguous" means open to more than one interpretation or unclear, which matches the context of leaving analysts uncertain.',
        companyTags: ['Wipro', 'Accenture'],
      },
      {
        category: 'verbal',
        topic: 'Synonyms and Antonyms',
        difficulty: 'Easy',
        title: 'Antonym Identification',
        question: 'Select the antonym for the word "EPHEMERAL":',
        options: [
          { id: 'A', text: 'Transient' },
          { id: 'B', text: 'Perpetual' },
          { id: 'C', text: 'Fleeting' },
          { id: 'D', text: 'Momentary' },
        ],
        correctOption: 'B',
        explanation: '"Ephemeral" means lasting for a very short time. Its direct opposite is "Perpetual" (lasting forever).',
        companyTags: ['Capgemini', 'Cognizant'],
      },
      {
        category: 'verbal',
        topic: 'Reading Comprehension',
        difficulty: 'Hard',
        title: 'Inference Analysis',
        question: 'Passage: "Autonomous systems reduce human latency but introduce probabilistic failure modes that require formal verification." What is the author\'s primary implication?',
        options: [
          { id: 'A', text: 'Autonomous systems are inherently unsafe and should be discontinued.' },
          { id: 'B', text: 'Automation speed gains necessitate mathematically rigorous safety protocols.' },
          { id: 'C', text: 'Human operators are always faster than autonomous agents.' },
          { id: 'D', text: 'Formal verification eliminates all software latency.' },
        ],
        correctOption: 'B',
        explanation: 'The author balances the speed benefits of autonomy with the requirement for rigorous verification to handle probabilistic failures.',
        companyTags: ['Amazon', 'Google'],
      },
      {
        category: 'verbal',
        topic: 'Sentence Correction',
        difficulty: 'Medium',
        title: 'Modifier Placement',
        question: 'Choose the grammatically correct sentence:',
        options: [
          { id: 'A', text: 'Walking through the server room, the loud hum of fans deafened the technician.' },
          { id: 'B', text: 'Walking through the server room, the technician was deafened by the loud hum of fans.' },
          { id: 'C', text: 'While walking through the server room, the fans deafened him loudly.' },
          { id: 'D', text: 'The loud hum of fans walking through the server room deafened him.' },
        ],
        correctOption: 'B',
        explanation: 'Option A has a dangling modifier (fans weren\'t walking). Option B correctly places "the technician" directly after the participial phrase.',
        companyTags: ['TCS', 'Infosys'],
      },
      {
        category: 'verbal',
        topic: 'Para Jumbles',
        difficulty: 'Medium',
        title: 'Coherent Paragraph Assembly',
        question: 'Arrange the sentences in logical order:\n1. Distributed databases distribute data over multiple physical nodes.\n2. This replication ensures high availability during hardware crashes.\n3. However, maintaining strict consistency across nodes requires quorum protocols.\n4. Consequently, engineers must balance consistency and latency.',
        options: [
          { id: 'A', text: '1 - 2 - 3 - 4' },
          { id: 'B', text: '2 - 1 - 3 - 4' },
          { id: 'C', text: '1 - 3 - 2 - 4' },
          { id: 'D', text: '4 - 1 - 2 - 3' },
        ],
        correctOption: 'A',
        explanation: 'Statement 1 defines distributed databases. Statement 2 explains replication benefits. Statement 3 introduces the consistency drawback. Statement 4 concludes the tradeoff.',
        companyTags: ['Wipro', 'Amazon'],
      },
      {
        category: 'verbal',
        topic: 'Fill in the Blanks',
        difficulty: 'Easy',
        title: 'Collocations and Prepositions',
        question: 'The lead architect was adept ___ designing fault-tolerant distributed microservices.',
        options: [
          { id: 'A', text: 'in' },
          { id: 'B', text: 'at' },
          { id: 'C', text: 'with' },
          { id: 'D', text: 'for' },
        ],
        correctOption: 'B',
        explanation: 'The adjective "adept" is idiomatic with the preposition "at" (or "in", but "adept at [gerund/skill]" is standard).',
        companyTags: ['Accenture', 'TCS'],
      },
      {
        category: 'verbal',
        topic: 'Error Detection',
        difficulty: 'Medium',
        title: 'Tense and Conditional Consistency',
        question: 'Identify the segment with an error: "If the QA team (A) / would have tested the edge cases (B) / the bug would not have occurred (C) / in production (D)."',
        options: [
          { id: 'A', text: 'A' },
          { id: 'B', text: 'B' },
          { id: 'C', text: 'C' },
          { id: 'D', text: 'D' },
        ],
        correctOption: 'B',
        explanation: 'In third conditional clauses, the if-clause uses the past perfect tense: "If the QA team had tested", not "would have tested".',
        companyTags: ['Infosys', 'Capgemini'],
      },
    ];

    // 4. CORE COMPUTER SCIENCE (Covering all 6 requested topics)
    const coreCsQuestions = [
      {
        category: 'core-cs',
        topic: 'DBMS and SQL',
        difficulty: 'Medium',
        title: 'ACID Isolation Levels',
        question: 'Which transaction isolation level prevents Dirty Reads and Non-Repeatable Reads, but still allows Phantom Reads in SQL?',
        options: [
          { id: 'A', text: 'Read Uncommitted' },
          { id: 'B', text: 'Read Committed' },
          { id: 'C', text: 'Repeatable Read' },
          { id: 'D', text: 'Serializable' },
        ],
        correctOption: 'C',
        explanation: 'Repeatable Read guarantees that data read by a transaction cannot be changed by another transaction, preventing non-repeatable reads. However, range queries may still encounter phantom row insertions.',
        companyTags: ['Google', 'Amazon', 'Microsoft'],
      },
      {
        category: 'core-cs',
        topic: 'Operating Systems',
        difficulty: 'Medium',
        title: 'Deadlock Necessary Conditions',
        question: 'Which of the following is NOT one of the four necessary Coffman conditions for a deadlock to occur?',
        options: [
          { id: 'A', text: 'Mutual Exclusion' },
          { id: 'B', text: 'Hold and Wait' },
          { id: 'C', text: 'Preemption Permitted' },
          { id: 'D', text: 'Circular Wait' },
        ],
        correctOption: 'C',
        explanation: 'The four Coffman conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. If preemption is permitted, deadlocks can be broken!',
        companyTags: ['Microsoft', 'Infosys', 'TCS'],
      },
      {
        category: 'core-cs',
        topic: 'Computer Networks',
        difficulty: 'Easy',
        title: 'TCP 3-Way Handshake',
        question: 'What is the correct sequence of packets sent during a standard TCP connection establishment?',
        options: [
          { id: 'A', text: 'ACK -> SYN -> SYN-ACK' },
          { id: 'B', text: 'SYN -> SYN-ACK -> ACK' },
          { id: 'C', text: 'SYN -> ACK -> ACK-DATA' },
          { id: 'D', text: 'FIN -> ACK -> FIN-ACK' },
        ],
        correctOption: 'B',
        explanation: 'Client sends SYN, Server responds with SYN-ACK, and Client completes connection with ACK.',
        companyTags: ['Amazon', 'Cisco', 'Wipro'],
      },
      {
        category: 'core-cs',
        topic: 'Object-Oriented Programming',
        difficulty: 'Easy',
        title: 'Polymorphism Types',
        question: 'Method Overloading in languages like Java and C++ is an example of:',
        options: [
          { id: 'A', text: 'Runtime / Dynamic Polymorphism' },
          { id: 'B', text: 'Compile-time / Static Polymorphism' },
          { id: 'C', text: 'Encapsulation' },
          { id: 'D', text: 'Multiple Inheritance' },
        ],
        correctOption: 'B',
        explanation: 'Method overloading is resolved at compile time based on parameter signatures (static binding). Method overriding is dynamic polymorphism.',
        companyTags: ['TCS', 'Infosys', 'Capgemini'],
      },
      {
        category: 'core-cs',
        topic: 'Software Engineering',
        difficulty: 'Medium',
        title: 'Agile vs Waterfall Cycles',
        question: 'In software architecture, what does the Single Responsibility Principle (SRP) dictate?',
        options: [
          { id: 'A', text: 'A class should only have one instance running in memory.' },
          { id: 'B', text: 'A module or class should have one, and only one, reason to change.' },
          { id: 'C', text: 'A function must take only one single parameter.' },
          { id: 'D', text: 'A database should contain only one table per schema.' },
        ],
        correctOption: 'B',
        explanation: 'SRP states that a class should gather functions that change for the same reason and have only one actor/reason to be modified.',
        companyTags: ['Amazon', 'Google'],
      },
      {
        category: 'core-cs',
        topic: 'Computer Architecture',
        difficulty: 'Hard',
        title: 'Pipeline Hazards',
        question: 'What type of hazard occurs in an instruction pipeline when an instruction depends on the result of a previous instruction that is still in execution?',
        options: [
          { id: 'A', text: 'Structural Hazard' },
          { id: 'B', text: 'Data Hazard (RAW)' },
          { id: 'C', text: 'Control / Branch Hazard' },
          { id: 'D', text: 'Cache Miss Hazard' },
        ],
        correctOption: 'B',
        explanation: 'A Read-After-Write (RAW) data hazard occurs when instructions need data before it has been written back to the register.',
        companyTags: ['Intel', 'Microsoft'],
      },
    ];

    const allQuestions = [
      ...aptitudeQuestions,
      ...reasoningQuestions,
      ...verbalQuestions,
      ...coreCsQuestions,
    ];

    const createdQuestions = await Question.insertMany(allQuestions);
    console.log(`Seeded ${createdQuestions.length} practice MCQs.`);

    // 5. CODING & DSA PROBLEMS (Covering 10 requested topics)
    const codingProblems = [
      {
        title: 'Two Sum',
        slug: 'two-sum',
        difficulty: 'Easy',
        category: 'Arrays & Strings',
        description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
        inputFormat: 'nums = [2,7,11,15], target = 9',
        outputFormat: '[0,1]',
        constraints: [
          '2 <= nums.length <= 10^4',
          '-10^9 <= nums[i] <= 10^9',
          '-10^9 <= target <= 10^9',
        ],
        sampleTestCases: [
          { input: '[2,7,11,15], 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
          { input: '[3,2,4], 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' },
        ],
        hiddenTestCases: [
          { input: '[3,3], 6', output: '[0,1]' },
          { input: '[1,5,8,12], 13', output: '[0,3]' },
        ],
        starterTemplates: {
          javascript: `function solution(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
          python: `def solution(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i\n    return []`,
          java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[]{0, 1};\n    }\n}`,
          cpp: `#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n    return {0, 1};\n}`,
        },
        hints: ['Use a hash map to look up complements in O(1) time.'],
        solutionExplanation: 'Store values in a hash map as key and index as value. For every number, check if (target - num) exists in the map.',
        companyTags: ['Amazon', 'Google', 'TCS', 'Infosys'],
      },
      {
        title: 'Longest Substring Without Repeating Characters',
        slug: 'longest-substring-without-repeating',
        difficulty: 'Medium',
        category: 'Arrays & Strings',
        description: 'Given a string `s`, find the length of the longest substring without duplicate characters.',
        inputFormat: 's = "abcabcbb"',
        outputFormat: '3',
        constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
        sampleTestCases: [
          { input: '"abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
          { input: '"bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
        ],
        hiddenTestCases: [
          { input: '"pwwkew"', output: '3' },
          { input: '""', output: '0' },
        ],
        starterTemplates: {
          javascript: `function solution(s) {\n  let maxLen = 0, start = 0;\n  const map = new Map();\n  for (let i = 0; i < s.length; i++) {\n    if (map.has(s[i]) && map.get(s[i]) >= start) {\n      start = map.get(s[i]) + 1;\n    }\n    map.set(s[i], i);\n    maxLen = Math.max(maxLen, i - start + 1);\n  }\n  return maxLen;\n}`,
          python: `def solution(s):\n    seen = {}\n    start = max_len = 0\n    for i, c in enumerate(s):\n        if c in seen and seen[c] >= start:\n            start = seen[c] + 1\n        seen[c] = i\n        max_len = max(max_len, i - start + 1)\n    return max_len`,
          java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Your code here\n        return 0;\n    }\n}`,
          cpp: `#include <string>\n#include <unordered_map>\nusing namespace std;\n\nint lengthOfLongestSubstring(string s) {\n    // Your code here\n    return 0;\n}`,
        },
        hints: ['Use sliding window with two pointers.'],
        solutionExplanation: 'Maintain a window [start, i] and record the last seen index of each character.',
        companyTags: ['Amazon', 'Microsoft', 'Google'],
      },
      {
        title: 'Reverse Linked List',
        slug: 'reverse-linked-list',
        difficulty: 'Easy',
        category: 'Linked Lists',
        description: 'Given the head of a singly linked list represented as an array of values, reverse the list and return the reversed array.',
        inputFormat: '[1,2,3,4,5]',
        outputFormat: '[5,4,3,2,1]',
        constraints: ['0 <= node count <= 5000'],
        sampleTestCases: [
          { input: '[1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: 'Reversed order of elements.' },
          { input: '[1,2]', output: '[2,1]', explanation: 'Reversed elements.' },
        ],
        hiddenTestCases: [
          { input: '[]', output: '[]' },
        ],
        starterTemplates: {
          javascript: `function solution(arr) {\n  return arr.reverse();\n}`,
          python: `def solution(arr):\n    return arr[::-1]`,
          java: `// Linked list reversal logic\nclass Solution {}`,
          cpp: `// Linked list reversal logic\nclass Solution {};`,
        },
        hints: ['Iteratively change next pointers with prev, curr, next.'],
        solutionExplanation: 'Can be solved iteratively in O(N) time and O(1) space by tracking previous node.',
        companyTags: ['TCS', 'Infosys', 'Accenture'],
      },
      {
        title: 'Valid Parentheses',
        slug: 'valid-parentheses',
        difficulty: 'Easy',
        category: 'Stacks & Queues',
        description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.',
        inputFormat: 's = "()[]{}"',
        outputFormat: 'true',
        constraints: ['1 <= s.length <= 10^4'],
        sampleTestCases: [
          { input: '"()[]{}"', output: 'true', explanation: 'All brackets close in proper order.' },
          { input: '"(]"', output: 'false', explanation: 'Mismatched brackets.' },
        ],
        hiddenTestCases: [
          { input: '"([)]"', output: 'false' },
          { input: '"{[]}"', output: 'true' },
        ],
        starterTemplates: {
          javascript: `function solution(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (let c of s) {\n    if (c === '(' || c === '{' || c === '[') stack.push(c);\n    else if (stack.pop() !== map[c]) return false;\n  }\n  return stack.length === 0;\n}`,
          python: `def solution(s):\n    stack = []\n    m = {')': '(', '}': '{', ']': '['}\n    for c in s:\n        if c in '({[':\n            stack.append(c)\n        elif not stack or stack.pop() != m[c]:\n            return False\n    return not stack`,
          java: `class Solution {}`,
          cpp: `class Solution {};`,
        },
        hints: ['Push opening brackets to stack; pop and match upon closing bracket.'],
        solutionExplanation: 'Standard Stack problem. Time complexity O(N), Space complexity O(N).',
        companyTags: ['Amazon', 'Google', 'TCS'],
      },
      {
        title: 'Maximum Subarray (Kadane’s Algorithm)',
        slug: 'maximum-subarray-kadane',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        description: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.',
        inputFormat: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        outputFormat: '6',
        constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
        sampleTestCases: [
          { input: '[-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
          { input: '[1]', output: '1', explanation: 'Single element.' },
        ],
        hiddenTestCases: [
          { input: '[5,4,-1,7,8]', output: '23' },
          { input: '[-1]', output: '-1' },
        ],
        starterTemplates: {
          javascript: `function solution(nums) {\n  let maxSoFar = nums[0], currMax = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currMax = Math.max(nums[i], currMax + nums[i]);\n    maxSoFar = Math.max(maxSoFar, currMax);\n  }\n  return maxSoFar;\n}`,
          python: `def solution(nums):\n    max_so_far = curr = nums[0]\n    for x in nums[1:]:\n        curr = max(x, curr + x)\n        max_so_far = max(max_so_far, curr)\n    return max_so_far`,
          java: `class Solution {}`,
          cpp: `class Solution {};`,
        },
        hints: ['Calculate local maximum ending at index i, updating global maximum.'],
        solutionExplanation: 'Kadane’s algorithm runs in O(N) time and O(1) extra space.',
        companyTags: ['Amazon', 'Microsoft', 'Infosys'],
      },
      {
        title: 'Coin Change',
        slug: 'coin-change',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        description: 'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins that you need to make up that amount.',
        inputFormat: 'coins = [1,2,5], amount = 11',
        outputFormat: '3',
        constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
        sampleTestCases: [
          { input: '[1,2,5], 11', output: '3', explanation: '11 = 5 + 5 + 1 (3 coins)' },
          { input: '[2], 3', output: '-1', explanation: 'Cannot form amount 3 with coin 2.' },
        ],
        hiddenTestCases: [
          { input: '[1], 0', output: '0' },
          { input: '[1,2], 4', output: '2' },
        ],
        starterTemplates: {
          javascript: `function solution(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let coin of coins) {\n    for (let i = coin; i <= amount; i++) {\n      dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}`,
          python: `def solution(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for c in coins:\n        for i in range(c, amount + 1):\n            dp[i] = min(dp[i], dp[i - c] + 1)\n    return dp[amount] if dp[amount] != float('inf') else -1`,
          java: `class Solution {}`,
          cpp: `class Solution {};`,
        },
        hints: ['Build dp array where dp[i] is minimum coins to make amount i.'],
        solutionExplanation: 'Bottom-up DP with time complexity O(coins.length * amount).',
        companyTags: ['Google', 'Amazon', 'Microsoft'],
      },
    ];

    const createdProblems = await CodingProblem.insertMany(codingProblems);
    console.log(`Seeded ${createdProblems.length} Coding Problems.`);

    // 6. COMPANY PREPARATION TRACKS (All 9 requested companies)
    const companyTracks = [
      {
        companyName: 'Tata Consultancy Services (TCS)',
        slug: 'tcs',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg',
        tagline: 'Leading Global IT Services & Digital Transformation Partner',
        overview: 'TCS is India\'s largest IT exporter and one of the biggest recruiters of engineering talent. The National Qualifier Test (NQT) is the primary gateway for TCS Ninja (3.3 - 3.6 LPA) and TCS Digital (7 - 7.5 LPA) profiles.',
        selectionProcess: [
          { roundNumber: 1, title: 'TCS NQT Online Cognitive & Technical Exam', duration: '165 mins', description: 'Covers Numerical Ability, Reasoning Ability, Verbal Ability, Advanced Quantitative & Reasoning, and 2 Hands-on Coding Problems.' },
          { roundNumber: 2, title: 'Technical Interview', duration: '30-45 mins', description: 'Core CS subjects (DBMS, OOP, OS), deep dive into your final year project, and live problem solving.' },
          { roundNumber: 3, title: 'Managerial & HR Interview', duration: '20-30 mins', description: 'Relocation willingness, shift flexibility, communication skills, and behavioral assessments.' },
        ],
        examPattern: [
          { section: 'Numerical Ability', questionCount: 20, durationMinutes: 25, marks: 20, negativeMarking: 'No' },
          { section: 'Verbal Ability', questionCount: 25, durationMinutes: 25, marks: 25, negativeMarking: 'No' },
          { section: 'Reasoning Ability', questionCount: 20, durationMinutes: 25, marks: 20, negativeMarking: 'No' },
          { section: 'Advanced Technical & Coding', questionCount: 2, durationMinutes: 45, marks: 30, negativeMarking: 'No' },
        ],
        syllabus: [
          { category: 'Quantitative Aptitude', topics: ['Number Systems', 'Percentages', 'Time and Work', 'Speed, Time and Distance', 'Probability', 'Mixtures'] },
          { category: 'Logical Reasoning', topics: ['Coding-Decoding', 'Blood Relations', 'Data Sufficiency', 'Syllogisms', 'Seating Arrangements'] },
          { category: 'Hands-on Coding', topics: ['Array Manipulations', 'String Parsing', 'Number Logic (Primes, Palindromes)', 'Recursion'] },
        ],
        technicalInterviewQuestions: [
          { question: 'What is normalization in DBMS and explain 1NF, 2NF, 3NF with an example?', answer: 'Normalization organizes data to reduce redundancy and improve data integrity. 1NF removes repeating groups, 2NF removes partial dependency on composite keys, and 3NF eliminates transitive dependencies.', topic: 'DBMS', difficulty: 'Medium' },
          { question: 'Difference between Abstract Class and Interface in Java / OOP?', answer: 'An abstract class can have state (instance variables) and constructors, and supports single inheritance. An interface defines a contract with abstract/default methods and allows multiple inheritance.', topic: 'OOP', difficulty: 'Easy' },
          { question: 'Explain how indexing improves SQL SELECT queries and the tradeoff during INSERTs.', answer: 'Indexes use B+ trees to find rows in O(log N) disk reads. Tradeoff: Every write (INSERT/UPDATE/DELETE) must update the B+ tree, adding write overhead.', topic: 'DBMS', difficulty: 'Medium' },
        ],
        hrInterviewQuestions: [
          { question: 'Are you comfortable working in night shifts or relocating to another city?', sampleAnswer: 'Yes, absolutely. Early in my career, exposure to diverse projects, cross-timezone client collaboration, and learning from different teams is my top priority.', tips: 'Always express flexibility and enthusiasm for global client projects.' },
          { question: 'Where do you see yourself in 3 years at TCS?', sampleAnswer: 'In 3 years, I aspire to have developed deep architectural expertise in cloud technologies and full-stack development, moving toward a technical lead role.', tips: 'Highlight continuous upskilling and long-term commitment.' },
        ],
      },
      {
        companyName: 'Infosys',
        slug: 'infosys',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg',
        tagline: 'Navigate Your Next with Global Digital Consulting',
        overview: 'Infosys recruits fresh talent through InfyTQ and campus placement drives for Systems Engineer (3.6 LPA), Digital Specialist Engineer (6.25 LPA), and Specialist Programmer (9.5 LPA).',
        selectionProcess: [
          { roundNumber: 1, title: 'Online Assessment', duration: '100 mins', description: 'Reasoning Ability, Technical Mathematical Ability, Verbal Ability, Pseudo-code, and Puzzle Solving.' },
          { roundNumber: 2, title: 'Technical Interview', duration: '30-40 mins', description: 'Algorithmic logic, SQL queries, data structures, and resume project walkthrough.' },
          { roundNumber: 3, title: 'HR & Culture Alignment', duration: '15-20 mins', description: 'Communication clarity, adaptability to training at Mysore campus, and problem-solving mindset.' },
        ],
        examPattern: [
          { section: 'Reasoning Ability', questionCount: 15, durationMinutes: 25, marks: 15, negativeMarking: 'No' },
          { section: 'Mathematical Ability', questionCount: 10, durationMinutes: 35, marks: 10, negativeMarking: 'No' },
          { section: 'Verbal Ability', questionCount: 20, durationMinutes: 20, marks: 20, negativeMarking: 'No' },
          { section: 'Pseudocode & Puzzles', questionCount: 9, durationMinutes: 20, marks: 15, negativeMarking: 'No' },
        ],
        syllabus: [
          { category: 'Pseudocode', topics: ['Bitwise operations', 'Recursion tracing', 'Loop iterations', 'Array indexing'] },
          { category: 'Reasoning', topics: ['Puzzles', 'Data Interpretation', 'Syllogisms', 'Logical Deductions'] },
        ],
        technicalInterviewQuestions: [
          { question: 'What is a Primary Key versus a Unique Key in SQL?', answer: 'A Primary Key uniquely identifies each row and does not accept NULL values. A Unique Key also enforces uniqueness but accepts one NULL value.', topic: 'DBMS', difficulty: 'Easy' },
          { question: 'Explain process synchronization and semaphores in Operating Systems.', answer: 'Semaphores are integer variables used to control access to shared critical sections by multiple processes. A binary semaphore acts like a mutex lock.', topic: 'OS', difficulty: 'Medium' },
        ],
        hrInterviewQuestions: [
          { question: 'Why Infosys?', sampleAnswer: 'Infosys has the world’s benchmark corporate university in Mysore and a renowned training curriculum. I want to build a rock-solid engineering foundation with enterprise-scale technologies.', tips: 'Mention the Mysore campus training legacy.' },
        ],
      },
      {
        companyName: 'Wipro',
        slug: 'wipro',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Logo.svg',
        tagline: 'Ambition Realized: IT, Consulting & Business Process Services',
        overview: 'Wipro recruits through the Elite National Talent Hunt (NTH) for Project Engineer roles (3.5 LPA - 6.5 LPA Turbo).',
        selectionProcess: [
          { roundNumber: 1, title: 'Elite NTH Online Test', duration: '128 mins', description: 'Aptitude Test (Quantitative, Logical, English), Written Communication Test (Essay), and Online Coding (2 programs).' },
          { roundNumber: 2, title: 'Technical Interview', duration: '30 mins', description: 'Object-oriented programming, data structures, and explanation of written code.' },
          { roundNumber: 3, title: 'HR Round', duration: '15 mins', description: 'Employment bond agreement, relocation, and career aspirations.' },
        ],
        examPattern: [
          { section: 'Aptitude & Logical', questionCount: 30, durationMinutes: 48, marks: 30, negativeMarking: 'No' },
          { section: 'Written Communication (Essay)', questionCount: 1, durationMinutes: 20, marks: 20, negativeMarking: 'No' },
          { section: 'Coding Assessment', questionCount: 2, durationMinutes: 60, marks: 50, negativeMarking: 'No' },
        ],
        syllabus: [
          { category: 'Aptitude', topics: ['Ratio and Proportion', 'Time and Work', 'Percentages', 'Permutations'] },
          { category: 'Coding', topics: ['Strings', 'Sorting', 'Matrix operations', 'Dynamic arrays'] },
        ],
        technicalInterviewQuestions: [
          { question: 'Explain method overriding and the concept of runtime polymorphism.', answer: 'Method overriding happens when a subclass provides a specific implementation of a method already defined in its superclass, resolved at runtime using vtables.', topic: 'OOP', difficulty: 'Easy' },
        ],
        hrInterviewQuestions: [
          { question: 'Tell me about an instance when you had to adapt to a sudden change.', sampleAnswer: 'During our college hackathon, our selected API went down 4 hours before submission. I quickly evaluated alternatives and rebuilt our data layer with a mock server, enabling us to pitch successfully.', tips: 'Use the STAR method.' },
        ],
      },
      {
        companyName: 'Accenture',
        slug: 'accenture',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg',
        tagline: 'High Performance. Delivered.',
        overview: 'Accenture recruits for Associate Software Engineer (4.5 LPA) and Advanced Associate Software Engineer (6.5 LPA) across India.',
        selectionProcess: [
          { roundNumber: 1, title: 'Cognitive & Technical Assessment', duration: '90 mins', description: 'Critical thinking, English ability, pseudo-code, cloud computing basics, and security.' },
          { roundNumber: 2, title: 'Coding Assessment (Mandatory if Stage 1 passed)', duration: '45 mins', description: '2 Coding questions testing data structure logic.' },
          { roundNumber: 3, title: 'Communication Assessment & Virtual Interview', duration: '30 mins', description: 'Speech-based AI test assessing pronunciation, sentence mastery, and HR interview.' },
        ],
        examPattern: [
          { section: 'Cognitive & Critical Thinking', questionCount: 50, durationMinutes: 50, marks: 50, negativeMarking: 'No' },
          { section: 'Technical & Pseudo-code', questionCount: 40, durationMinutes: 40, marks: 40, negativeMarking: 'No' },
          { section: 'Hands-on Coding', questionCount: 2, durationMinutes: 45, marks: 30, negativeMarking: 'No' },
        ],
        syllabus: [
          { category: 'Technical Basics', topics: ['Cloud computing fundamentals', 'Network security', 'MS Office & web architecture'] },
        ],
        technicalInterviewQuestions: [
          { question: 'What is the difference between synchronous and asynchronous operations?', answer: 'Synchronous operations block execution until completion. Asynchronous operations run in the background and use callbacks, promises, or async/await to handle completion without freezing the main thread.', topic: 'Software Engineering', difficulty: 'Easy' },
        ],
        hrInterviewQuestions: [
          { question: 'How do you handle working with tight deadlines?', sampleAnswer: 'I prioritize tasks based on impact, eliminate distractions, and communicate blockers proactively to peers and leads.', tips: 'Mention prioritization frameworks.' },
        ],
      },
      {
        companyName: 'Capgemini',
        slug: 'capgemini',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Capgemini_201x_logo.svg',
        tagline: 'Get the Future You Want',
        overview: 'Capgemini evaluates candidates using gamified aptitude tests, behavioral profiling, and technical rounds for Analyst and Senior Analyst roles (4.0 - 7.5 LPA).',
        selectionProcess: [
          { roundNumber: 1, title: 'Technical Assessment & Pseudocode', duration: '30 mins', description: 'Data structures, algorithm complexity, pseudocode logic.' },
          { roundNumber: 2, title: 'Gamified Cognitive Aptitude', duration: '24 mins', description: '4 interactive mini-games measuring spatial reasoning, inductive logic, and reaction time.' },
          { roundNumber: 3, title: 'Spoken English & Technical Interview', duration: '30-40 mins', description: 'Interactive tech evaluation and project presentation.' },
        ],
        examPattern: [
          { section: 'Pseudocode & Data Structures', questionCount: 30, durationMinutes: 30, marks: 30, negativeMarking: 'No' },
          { section: 'Gamified Cognitive Tests', questionCount: 4, durationMinutes: 24, marks: 40, negativeMarking: 'No' },
          { section: 'English Communication Test', questionCount: 30, durationMinutes: 30, marks: 30, negativeMarking: 'No' },
        ],
        syllabus: [
          { category: 'Pseudocode', topics: ['Tree traversals', 'Graph representations', 'Array rotation', 'Bitwise masking'] },
        ],
        technicalInterviewQuestions: [
          { question: 'What is the time complexity of searching an element in a Hash Table vs a Binary Search Tree?', answer: 'Hash Table search is O(1) average time, O(N) worst case with heavy collisions. A balanced BST (AVL or Red-Black) is guaranteed O(log N).', topic: 'DSA', difficulty: 'Medium' },
        ],
        hrInterviewQuestions: [
          { question: 'What do you know about Capgemini’s key industries?', sampleAnswer: 'Capgemini is a leader in cloud transformation, digital engineering, and financial services, serving major global banking, aerospace, and energy enterprises.', tips: 'Review their recent acquisitions and sustainability reports.' },
        ],
      },
      {
        companyName: 'Cognizant',
        slug: 'cognizant',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg',
        tagline: 'Engineering Modern Businesses to Improve Everyday Life',
        overview: 'Cognizant recruits for GenC (4.0 LPA), GenC Elevate (4.5 LPA), and GenC Next (6.75 LPA) through multi-tier assessments.',
        selectionProcess: [
          { roundNumber: 1, title: 'GenC Aptitude & Skill Assessment', duration: '100 mins', description: 'Quantitative Ability, Analytical Ability, and Verbal Ability.' },
          { roundNumber: 2, title: 'GenC Next Coding Assessment', duration: '60 mins', description: 'Advanced algorithms, greedy strategies, and dynamic programming.' },
          { roundNumber: 3, title: 'Technical & HR Discussion', duration: '30 mins', description: 'Database design, resume verification, and cultural fit.' },
        ],
        examPattern: [
          { section: 'Quantitative Ability', questionCount: 25, durationMinutes: 35, marks: 25, negativeMarking: 'No' },
          { section: 'Logical Reasoning', questionCount: 20, durationMinutes: 35, marks: 20, negativeMarking: 'No' },
          { section: 'Verbal Ability', questionCount: 20, durationMinutes: 30, marks: 20, negativeMarking: 'No' },
        ],
        syllabus: [
          { category: 'Quantitative', topics: ['Profit & Loss', 'Averages', 'Simple Interest', 'Work & Wages'] },
        ],
        technicalInterviewQuestions: [
          { question: 'Explain Joins in SQL: INNER, LEFT, RIGHT, and FULL OUTER JOIN.', answer: 'INNER JOIN returns matching rows in both tables. LEFT JOIN returns all rows from the left table and matched rows from the right. RIGHT JOIN is the inverse. FULL OUTER JOIN returns all rows with NULL where matches do not exist.', topic: 'DBMS', difficulty: 'Easy' },
        ],
        hrInterviewQuestions: [
          { question: 'How do you prioritize when you have multiple competing assignments?', sampleAnswer: 'I use the Eisenhower Matrix to separate urgent versus important tasks, establish milestones, and align with my manager early.', tips: 'Demonstrate organizational maturity.' },
        ],
      },
      {
        companyName: 'Amazon',
        slug: 'amazon',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        tagline: 'Earth’s Most Customer-Centric Company',
        overview: 'Amazon recruits Software Development Engineers (SDE-1, 30 - 45 LPA CTC) through rigorous online coding assessments and loop interviews anchored on the 16 Leadership Principles.',
        selectionProcess: [
          { roundNumber: 1, title: 'Online Assessment (OA 1 & 2)', duration: '120 mins', description: '2 Medium-Hard DSA Coding Problems + Work Simulation Assessment.' },
          { roundNumber: 2, title: 'Technical Phone Screen / Interview 1', duration: '60 mins', description: 'DSA, complexity analysis, and 1-2 Leadership Principle questions.' },
          { roundNumber: 3, title: 'Onsite Virtual Loop (3-4 rounds)', duration: '4 x 60 mins', description: 'Data Structures, Object-Oriented Design, Low-Level System Design, and deep behavioral STAR probing.' },
        ],
        examPattern: [
          { section: 'Online Coding Problem 1', questionCount: 1, durationMinutes: 35, marks: 50, negativeMarking: 'No' },
          { section: 'Online Coding Problem 2', questionCount: 1, durationMinutes: 35, marks: 50, negativeMarking: 'No' },
          { section: 'Work Simulation & LP Assessment', questionCount: 20, durationMinutes: 30, marks: 50, negativeMarking: 'No' },
        ],
        syllabus: [
          { category: 'DSA Topics', topics: ['Trees & Graphs (BFS/DFS, Dijkstra)', 'Dynamic Programming', 'Heaps & Priority Queues', 'Monotonic Stacks', 'Two Pointers'] },
          { category: 'Leadership Principles', topics: ['Customer Obsession', 'Ownership', 'Bias for Action', 'Deliver Results', 'Dive Deep'] },
        ],
        technicalInterviewQuestions: [
          { question: 'How would you design an LRU (Least Recently Used) Cache with O(1) get and put operations?', answer: 'Combine a Hash Map with a Doubly Linked List. The hash map provides O(1) key lookups to list nodes, while the doubly linked list allows O(1) removal and insertion at the head when an item is accessed or evicted.', topic: 'System Design / DSA', difficulty: 'Hard' },
          { question: 'Given a stream of integers, how do you find the median dynamically in O(log N) time per insertion?', answer: 'Use two heaps: a Max-Heap for the lower half of numbers and a Min-Heap for the upper half. Keep the heap sizes balanced within a difference of 1.', topic: 'DSA', difficulty: 'Hard' },
        ],
        hrInterviewQuestions: [
          { question: 'Tell me about a time you took calculated risk without all the information (Bias for Action).', sampleAnswer: 'In our capstone project, our initial hosting plan exceeded budget. Rather than wait 2 weeks for university approvals, I researched serverless architecture, migrated our backend to AWS Lambda free tier in 48 hours, and saved 100% of our hosting cost while keeping launch on track.', tips: 'Anchor your answer deeply in the STAR method and metrics.' },
        ],
      },
      {
        companyName: 'Google',
        slug: 'google',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
        tagline: 'Organize the World’s Information & Make it Universally Accessible',
        overview: 'Google recruits Software Engineers (L3, 35 - 55 LPA CTC) with a relentless focus on clean code, algorithmic mastery, scalability, and "Googleyness".',
        selectionProcess: [
          { roundNumber: 1, title: 'Google Online Challenge (GOC)', duration: '60 mins', description: '2 High-difficulty algorithmic problems testing advanced dynamic programming, graphs, and combinatorics.' },
          { roundNumber: 2, title: 'Technical Phone Screen', duration: '45 mins', description: 'Live coding on Google Docs / Interview Sandbox testing problem solving and asymptotic bounds.' },
          { roundNumber: 3, title: 'Onsite Loop (4-5 rounds)', duration: '5 x 45 mins', description: 'Advanced algorithms, system design / concurrency, and Googleyness & Leadership evaluation.' },
        ],
        examPattern: [
          { section: 'Algorithmic Problem 1', questionCount: 1, durationMinutes: 30, marks: 50, negativeMarking: 'No' },
          { section: 'Algorithmic Problem 2', questionCount: 1, durationMinutes: 30, marks: 50, negativeMarking: 'No' },
        ],
        syllabus: [
          { category: 'Advanced Algorithms', topics: ['Dynamic Programming with Bitmasks', 'Segment Trees & Fenwick Trees', 'Topological Sort', 'Tries', 'Union Find'] },
        ],
        technicalInterviewQuestions: [
          { question: 'How do you detect a cycle in a directed graph using DFS and color-coding?', answer: 'Use three colors: White (unvisited), Gray (currently visiting / on call stack), Black (fully processed). If DFS visits a Gray node, a back-edge exists, proving a cycle.', topic: 'Graphs', difficulty: 'Medium' },
          { question: 'Explain how Trie data structures are used in autocomplete search systems.', answer: 'A Trie stores strings character by character in tree nodes. Autocomplete traverses to the prefix node and performs BFS/DFS or inspects pre-computed top-K recommendations stored at each node.', topic: 'DSA', difficulty: 'Medium' },
        ],
        hrInterviewQuestions: [
          { question: 'Tell me about a time you made a mistake and what you learned from it.', sampleAnswer: 'I once accidentally pushed a debug API key to a public GitHub repo. The moment I noticed, I revoked the key immediately, created rotated secrets in environment variables, and introduced pre-commit git hooks across our team to scan for exposed secrets automatically.', tips: 'Show humility, rapid remediation, and systemic preventive improvements.' },
        ],
      },
      {
        companyName: 'Microsoft',
        slug: 'microsoft',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
        tagline: 'Empower Every Person and Every Organization to Achieve More',
        overview: 'Microsoft hires Software Engineers (L59/L60, 30 - 45 LPA CTC) through the Microsoft Online Assessment and multi-stage technical interviews.',
        selectionProcess: [
          { roundNumber: 1, title: 'Online Assessment on Codility', duration: '70-90 mins', description: '2-3 algorithmic problems focusing on edge cases, string manipulations, and dynamic arrays.' },
          { roundNumber: 2, title: 'Technical Interview Rounds (3-4 rounds)', duration: '3 x 45 mins', description: 'Data structures, Low-Level Design (OOP patterns), edge case testing, and clean production coding.' },
          { roundNumber: 3, title: 'AA (As-Appropriate) Director Round', duration: '45 mins', description: 'System vision, growth mindset, and technical depth discussion.' },
        ],
        examPattern: [
          { section: 'Algorithmic Problem 1', questionCount: 1, durationMinutes: 25, marks: 33, negativeMarking: 'No' },
          { section: 'Algorithmic Problem 2', questionCount: 1, durationMinutes: 25, marks: 33, negativeMarking: 'No' },
          { section: 'Algorithmic Problem 3', questionCount: 1, durationMinutes: 25, marks: 34, negativeMarking: 'No' },
        ],
        syllabus: [
          { category: 'Key Topics', topics: ['Trees & BSTs', 'Linked Lists', 'String Parsing', 'Design Patterns (Factory, Singleton, Observer)', 'Concurrency'] },
        ],
        technicalInterviewQuestions: [
          { question: 'Given a binary tree, how do you find the Lowest Common Ancestor (LCA) of two given nodes?', answer: 'Recursively search left and right subtrees. If the root matches either node, return root. If both left and right recursive calls return non-null values, the current root is the LCA. Otherwise, return the non-null child.', topic: 'Trees', difficulty: 'Medium' },
          { question: 'What is a race condition and how can mutexes or atomic operations resolve it?', answer: 'A race condition occurs when concurrent threads access and modify shared memory without synchronization, producing non-deterministic bugs. Mutex locks enforce mutual exclusion, while atomic operations use hardware CAS (Compare-And-Swap) without locking.', topic: 'OS & Concurrency', difficulty: 'Medium' },
        ],
        hrInterviewQuestions: [
          { question: 'How do you foster a Growth Mindset in your everyday coding?', sampleAnswer: 'I view bugs and failed builds not as setbacks, but as valuable telemetry on how our systems behave under stress. I love reading open source PR reviews and learning from senior engineers.', tips: 'Satya Nadella’s core cultural principle is the Growth Mindset (Learn-It-All vs Know-It-All).' },
        ],
      },
    ];

    const createdTracks = await CompanyTrack.insertMany(companyTracks);
    console.log(`Seeded ${createdTracks.length} Company Preparation Tracks.`);

    // 7. MOCK TESTS (Full Assessments and Category Drills)
    const mockTests = [
      {
        title: 'Full Placement Assessment Simulator',
        slug: 'full-placement-assessment-simulator',
        description: 'Comprehensive 45-minute multi-section assessment mirroring modern campus recruitment tests. Covers Quantitative Aptitude, Logical Reasoning, Verbal Ability, and Core Computer Science.',
        category: 'full-assessment',
        companyTag: 'Universal Tech Assessment',
        durationMinutes: 45,
        totalMarks: 100,
        negativeMarking: 0.25,
        questions: createdQuestions.slice(0, 15).map(q => q._id),
        difficulty: 'Medium',
        attemptsCount: 218,
      },
      {
        title: 'TCS NQT Full Mock Test 2026',
        slug: 'tcs-nqt-full-mock-test-2026',
        description: 'Tailored specifically to the latest TCS National Qualifier Test pattern with Aptitude, Reasoning, and Verbal sections.',
        category: 'company-special',
        companyTag: 'TCS',
        durationMinutes: 30,
        totalMarks: 75,
        negativeMarking: 0,
        questions: createdQuestions.filter(q => q.companyTags.includes('TCS')).slice(0, 12).map(q => q._id),
        difficulty: 'Medium',
        attemptsCount: 384,
      },
      {
        title: 'Infosys Placement Simulator & Logical Challenge',
        slug: 'infosys-placement-simulator',
        description: 'Practice high-frequency mathematical, logical puzzle, and pseudocode question formats encountered in Infosys drives.',
        category: 'company-special',
        companyTag: 'Infosys',
        durationMinutes: 30,
        totalMarks: 60,
        negativeMarking: 0,
        questions: createdQuestions.filter(q => q.companyTags.includes('Infosys')).slice(0, 10).map(q => q._id),
        difficulty: 'Medium',
        attemptsCount: 195,
      },
      {
        title: 'Quantitative Aptitude Speed & Accuracy Drill',
        slug: 'quantitative-aptitude-speed-drill',
        description: 'Timed drill testing speed calculation, percentages, profit & loss, and time-speed-distance.',
        category: 'aptitude',
        companyTag: 'General Aptitude',
        durationMinutes: 20,
        totalMarks: 50,
        negativeMarking: 0.25,
        questions: createdQuestions.filter(q => q.category === 'aptitude').slice(0, 8).map(q => q._id),
        difficulty: 'Medium',
        attemptsCount: 142,
      },
      {
        title: 'Logical Reasoning & Analytical Masterclass',
        slug: 'logical-reasoning-championship',
        description: 'Test your puzzle solving, blood relations, seating arrangements, and syllogism deduction abilities.',
        category: 'reasoning',
        companyTag: 'General Reasoning',
        durationMinutes: 20,
        totalMarks: 50,
        negativeMarking: 0.25,
        questions: createdQuestions.filter(q => q.category === 'reasoning').slice(0, 8).map(q => q._id),
        difficulty: 'Medium',
        attemptsCount: 165,
      },
      {
        title: 'Core CS: DBMS, OS & Networking Diagnostic',
        slug: 'core-cs-technical-diagnostic',
        description: 'Essential technical questions on ACID properties, deadlocks, TCP handshakes, and OOP principles asked in engineering interviews.',
        category: 'core-cs',
        companyTag: 'Technical Screening',
        durationMinutes: 20,
        totalMarks: 50,
        negativeMarking: 0.25,
        questions: createdQuestions.filter(q => q.category === 'core-cs').map(q => q._id),
        difficulty: 'Medium',
        attemptsCount: 230,
      },
    ];

    const createdTests = await MockTest.insertMany(mockTests);
    console.log(`Seeded ${createdTests.length} Mock Tests.`);

    // 8. INITIALIZE PREP PROGRESS FOR DEMO CANDIDATE (seeker@careerx.com)
    const seeker = await User.findOne({ email: 'seeker@careerx.com' });
    if (seeker) {
      await PrepProgress.findOneAndUpdate(
        { user: seeker._id },
        {
          user: seeker._id,
          streakDays: 5,
          lastActiveDate: new Date(),
          completedQuestionsCount: 48,
          correctQuestionsCount: 41,
          categoryStats: {
            aptitude: { attempted: 20, correct: 18 },
            reasoning: { attempted: 14, correct: 12 },
            verbal: { attempted: 8, correct: 7 },
            coreCs: { attempted: 6, correct: 4 },
            coding: { solved: 4, attempted: 5 },
          },
          weakTopics: ['Data Interpretation', 'Syllogisms', 'Dynamic Programming', 'SQL Joins'],
          dailyChallenge: {
            date: new Date().toISOString().split('T')[0],
            targetQuestions: 5,
            completedQuestions: 4,
            isCompleted: false,
          },
          upcomingGoals: [
            { title: 'Complete 25 Aptitude Questions', targetDate: new Date(Date.now() + 7 * 86400000), isCompleted: false },
            { title: 'Score 80%+ in TCS NQT Mock Test', targetDate: new Date(Date.now() + 10 * 86400000), isCompleted: false },
            { title: 'Solve 10 Array & String Coding Problems', targetDate: new Date(Date.now() + 14 * 86400000), isCompleted: false },
          ],
        },
        { upsert: true, new: true }
      );
      console.log('Initialized candidate learning progress for demo user.');
    }

    console.log('========================================================');
    console.log('✅ CareerX Placement Preparation Ecosystem Seeded Successfully!');
    console.log('========================================================');

    process.exit(0);
  } catch (err) {
    console.error('Error during placement prep seeding:', err);
    process.exit(1);
  }
};

seedPlacementData();

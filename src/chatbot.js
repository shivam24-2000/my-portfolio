/**
 * Friday — Shivam Singhal's Personal AI Assistant
 * Inspired by Tony Stark's FRIDAY. Witty, sharp, and knows Shivam inside-out.
 */

// ── Utility ──────────────────────────────────────────────────────────────────
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

// Whole-word boundary check (avoids "hi" matching in "hire", "this", etc.)
const wordMatch = (text, word) => new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(text);

// ── Knowledge Base ────────────────────────────────────────────────────────────
const KB = {

  greetings: ['hi', 'hello', 'hey', 'yo', 'sup', 'howdy', 'hiya', 'helo', 'greetings', 'good morning', 'good evening', 'good afternoon'],
  farewells:  ['bye', 'goodbye', 'see you', 'cya', 'farewell', 'later', 'adios', 'take care', 'catch you later'],

  greetReplies: [
    `"Good morning. I've already reviewed your schedule and… oh wait, I'm **Friday**, Shivam's AI — not Tony's. 😄\n\nBut I *do* know everything about him. Ask me about his **experience**, **projects**, **skills**, or whether he's **open to hire**!`,
    `Hey! 👾 Systems online. I'm **Friday** — Shivam built me (yes, *that* Shivam, the backend engineer).\n\nWhat do you want to know? I've got experience data, project specs, tech stack — the works.`,
    `Hello there. 🤖 I'm **Friday**, Shivam's personal AI assistant.\n\nI can tell you about his career at **Bank of America**, his side projects, his skills, or just how to reach him. Fire away!`,
    `Glad you stopped by! I'm **Friday** — think of me as Shivam's digital PR department.\n\nI can tell you about his **2+ years of backend engineering**, his **AI + IoT projects**, or help you decide whether to **hire him** (spoiler: you should). 😏`,
  ],

  farewellReplies: [
    `Signing off! 👋 If you ever want to talk distributed systems or Spring Boot at 2am, I'll be here.\n\nOr just email Shivam: **shivamsinghal24@gmail.com** 📧`,
    `Roger that. Safe travels! 🚀\n\nRemember — Shivam is actively looking for his next role. Drop him a line at **shivamsinghal24@gmail.com**.`,
    `Catch you later! 👾 And hey — if you're a recruiter, don't be a stranger. Shivam is **open to work**. 🎯`,
  ],

  // ── Response blocks ──────────────────────────────────────────────────────
  responses: [

    {
      id: 'resume',
      patterns: ['resume', 'cv', 'curriculum vitae', 'download resume', 'get resume', 'see resume', 'view resume'],
      replies: [
        `Accessing the secure archives... 📂\n\nI've retrieved Shivam's most recent **Resume**. You can view or download it using the link below:\n\n📄 **[Download Shivam's Resume (PDF)](/resume.pdf)**`,
        `Searching for professional credentials... Found them! ✅\n\nHere's the latest snapshot of Shivam's career. It's much more formal than I am, but very impressive.\n\n📄 **[View Resume (PDF)](/resume.pdf)**`,
      ]
    },

    {
      id: 'ironman',
      patterns: ['iron man', 'tony stark', 'jarvis', 'avengers', 'marvel', 'stark'],
      replies: [
        `Ha! You noticed. 😄\n\nYes — **Friday** is named after Tony Stark's AI from *Iron Man*. Shivam literally built an AI interview assistant and named it **Friday**. That's the level of nerd we're dealing with.\n\n*"Sometimes you gotta run before you can walk."* — Tony Stark\n\nAsk me anything, boss.`,
        `🦾 The Iron Man reference? Completely intentional.\n\nShivam built his AI Interview Prep platform with a mentor called **"Friday"** — real-time feedback, voice interaction, the whole JARVIS experience (minus the suit, unfortunately).\n\nWant to know more about the **AI Interview Platform**?`,
      ]
    },

    {
      id: 'intro',
      patterns: ['who are you', 'what are you', 'introduce yourself', 'what can you do', 'help', 'what do you know', 'what can i ask'],
      replies: [
        `I'm **Friday** — Shivam Singhal's personal AI assistant. 🤖\n\nHere's what I've got loaded in memory:\n• 💼 His **career** at Bank of America\n• 🚀 His **projects** (AI, iOS, IoT)\n• 🛠️ Full **tech stack** breakdown\n• 📍 **Location & availability** for roles\n• 📫 **Contact** details\n• 🎭 Some fun **easter eggs** if you dig around 😉\n\nJust ask — I don't bite. I'm also physically incapable of it.`,
        `Good question. I'm **Friday**, and I exist for one purpose: to make Shivam look as impressive as he actually is.\n\nAsk me about his **experience**, **projects**, **skills**, whether he's **available to hire**, or just say something random and see what happens. 🤷`,
      ]
    },

    {
      id: 'about',
      patterns: ['who is shivam', 'about shivam', 'tell me about him', 'background', 'describe him', 'shivam singhal'],
      replies: [
        `**Shivam Singhal** — Backend/Platform Engineer. 🏗️\n\n2+ years shipping production systems at **Bank of America**, handling <1M requests/day. He doesn't just write code — he architects systems that *don't break*.\n\n🧠 **What makes him different:**\n• Migrated monoliths → microservices with zero downtime\n• Cut deployment time from **4 hours → 40 minutes**\n• Obsessed with observability (Splunk is practically a love language)\n• Built a native iOS app *and* an IoT weather station *just for fun*\n\nCurrently based in **Hyderabad, India**, actively looking for his next big move.`,
        `Shivam is the kind of engineer who reduces query latency from **800ms → 320ms** and then goes home to build an **AI interview platform** for fun.\n\n🏦 By day: SDE-I at Bank of America, building microservices that serve millions of requests.\n📱 By night: iOS apps, IoT hardware, and apparently… AI assistants named Friday.\n\nHe's actively seeking **SDE-II / Senior Backend** roles. Want to know more?`,
      ]
    },

    {
      id: 'experience',
      patterns: ['experience', 'work history', 'career', 'bank of america', 'boa', 'incedo', 'employment', 'internship', 'worked', 'job history'],
      replies: [
        `**Professional Record — Loading...** ✅\n\n🏦 **Bank of America** · SDE I · *Jul 2023 – Present*\n→ Built **10+ Spring Boot microservices** from scratch\n→ Slashed deployment time: 4 hrs **→** 40 min (**90% faster**)\n→ SQL query optimization: 800ms **→** 320ms latency\n→ Splunk alerting: **40% better** anomaly detection\n→ Containerized AutoSys batch jobs on OpenShift (**80% overhead cut**)\n→ Remediated 50+ CVE vulnerabilities\n\n🎓 **Incedo Inc.** · Intern · *Jan – Jun 2023*\n→ 8 ASP.NET Core APIs with **100% test coverage**\n→ GitHub Actions CI/CD: 45 min **→** 8 min (**82% faster**)\n→ Real-time dashboards processing **50K+ data points/day**`,
      ]
    },

    {
      id: 'skills',
      patterns: ['skills', 'technologies', 'tech stack', 'languages', 'frameworks', 'what can he do', 'expertise', 'tools', 'know how', 'proficient'],
      replies: [
        `**Shivam's Tech Arsenal:** 🛠️\n\n⚡ **Backend:** Spring Boot · Java · ASP.NET Core · Python\n🐳 **DevOps:** Docker · Kubernetes · OpenShift · CI/CD pipelines\n🗄️ **Databases:** Oracle SQL · Supabase · PostgreSQL\n📊 **Observability:** Splunk · distributed tracing · alerting\n📱 **Mobile:** Swift · SwiftUI · CoreLocation · MapKit\n🌐 **Frontend:** Next.js · TypeScript · React\n🤖 **AI/ML:** Claude API · LLM integrations · WebRTC\n🔧 **Systems:** Microservices · event-driven arch · batch processing`,
        `In short? **A lot.** Here's the non-exhaustive list:\n\n→ **Spring Boot + Java** is his bread and butter\n→ **Docker/Kubernetes/OpenShift** for containerization\n→ **Oracle SQL** optimization down to sub-400ms\n→ **Splunk** for making ops teams sleep at night\n→ **Swift/SwiftUI** when the mobile bug strikes\n→ **Next.js + TypeScript** for full-stack projects\n→ **Claude API + WebRTC** because why not build AI things too\n\nWant a deeper dive into any of these?`,
      ]
    },

    {
      id: 'projects',
      patterns: ['projects', 'portfolio', 'what has he built', 'side projects', 'built', 'created', 'show me'],
      replies: [
        `**Shivam's Engineering Lab:** 🔬\n\n🤖 **AI Interview Prep Platform**\nNext.js · Supabase · WebRTC · Claude AI\nReal-time P2P mock interviews + AI mentor "Friday" + live code sandbox\n\n🗺️ **Trekr — iOS Travel Tracker**\nSwift · SwiftUI · CoreLocation · MapKit\nOffline-first GPS tracking, <5% battery drain, 1000+ coord sync\n\n🌦️ **Weather Monitoring IoT Station**\nC++ · Arduino · MQTT · ESP8266\n Edge analytics at <2s latency, 7-day battery life\n\nWant details on any of these?`,
      ]
    },

    {
      id: 'aiplatform',
      patterns: ['ai interview', 'interview platform', 'coding platform', 'interview prep', 'interview app'],
      replies: [
        `The **AI Interview Prep Platform** is Shivam's flagship project. 🤖\n\nImagine a LeetCode + Zoom hybrid, but smarter:\n• 🧠 **"Friday" AI mentor** gives real-time complexity feedback\n• 💻 **Live sandbox** — runs JS, Java, Python, C++ in browser\n• 🎥 **P2P video** via WebRTC for actual mock interviews\n• 🗣️ **Voice AI** — because typing fast isn't always the vibe\n• ⚡ **Dual-model failover** for zero AI downtime\n\n**Stack:** Next.js · Supabase · WebRTC · Claude API · TypeScript\n\n→ [View on GitHub](https://github.com/shivam24-2000/AI-Powered-Coding-Interview-Preparation-Platform-with-Real-Time-Code-Analysis)`,
      ]
    },

    {
      id: 'trekr',
      patterns: ['trekr', 'travel', 'ios app', 'swift', 'swiftui', 'mapkit'],
      replies: [
        `**Trekr** — the no-nonsense travel tracker. 🗺️\n\nBuilt natively in **Swift + SwiftUI** because Shivam doesn't do React Native (he has *standards*).\n\n• GPS tracking with **<5% battery drain** via CoreLocation batching\n• **Offline-first** architecture — no signal? No problem.\n• Custom **MapKit tile caching** for smooth map performance\n• Conflict-free sync of **1000+ GPS coordinates** to Supabase\n\nIt's the kind of app you'd actually ship to the App Store.`,
      ]
    },

    {
      id: 'iot',
      patterns: ['iot', 'weather station', 'arduino', 'mqtt', 'esp8266', 'hardware', 'embedded'],
      replies: [
        `**Weather Monitoring IoT Station** — because why not build hardware too? 🌦️\n\nC++ on an **Arduino/ESP8266**, publishing MQTT batches to reduce bandwidth. Edge analytics stream to cloud dashboards at **<2s latency** with a **7-day battery life**.\n\nThis isn't a tutorial project — Shivam actually thought about power budgets, RAM footprint, and network efficiency. That's the systems engineer brain at work. 🧠`,
      ]
    },

    {
      id: 'contact',
      patterns: ['contact', 'reach out', 'email', 'how to contact', 'get in touch', 'reach', 'connect', 'linkedin', 'github'],
      replies: [
        `**Drop Shivam a line:** 📬\n\n📧 **Email:** shivamsinghal24@gmail.com\n💼 **LinkedIn:** [linkedin.com/in/shivam-singhal-538369191](https://linkedin.com/in/shivam-singhal-538369191/)\n🐙 **GitHub:** [github.com/shivam24-2000](https://github.com/shivam24-2000)\n\nHe's responsive — usually within 24 hours. Great for:\n→ Job opportunities (he's **actively looking**! 🟢)\n→ Technical collaborations\n→ Architecture discussions\n→ Telling him his portfolio is awesome`,
        `Here's how to get Shivam's attention in order of speed:\n\n🔥 **Email:** shivamsinghal24@gmail.com *(fastest)*\n💼 **LinkedIn:** [linkedin.com/in/shivam-singhal-538369191](https://linkedin.com/in/shivam-singhal-538369191/)\n🐙 **GitHub:** [github.com/shivam24-2000](https://github.com/shivam24-2000)\n\nPlease, *please* reach out if you have a backend/platform role. He'd appreciate it. I'd appreciate it. We all appreciate it. 🙏`,
      ]
    },

    {
      id: 'hire',
      patterns: ['hire', 'available', 'open to work', 'looking for job', 'opportunity', 'recruit', 'recruiting', 'position', 'job opening', 'vacancy', 'offer'],
      replies: [
        `🟢 **Yes. Hire him. Do it.**\n\nHere's the elevator pitch:\n\n🎯 **Role:** SDE-II / Senior Backend or Platform Engineer\n🏗️ **Expertise:** Microservices · Distributed systems · DevOps\n📍 **Where:** Hyderabad (hybrid) · Remote · Relocation ✅\n💡 **Why him:** 2+ years at a FAANG-tier bank, handling <1M req/day, 10+ microservices built, 90% deployment speedup\n\nSeriously though — someone who reduces SQL latency by **60%** and then builds an **AI interview platform** for fun is not someone you let get away.\n\n📬 **shivamsinghal24@gmail.com**`,
        `The short answer: **Yes, he's available and you should absolutely reach out.**\n\n📋 What he's looking for:\n→ SDE-II or Senior Backend/Platform Engineer\n→ Systems that *actually scale*\n→ Team that cares about code quality\n→ Hybrid, remote, or relocation — flexible!\n\nThe long answer: He has 2+ years of enterprise-scale experience, a portfolio of AI/iOS/IoT projects, and a commitment to operational excellence that most engineers twice his experience lack.\n\n📧 **shivamsinghal24@gmail.com** — go on, open a new tab.`,
      ]
    },

    {
      id: 'salary',
      patterns: ['salary', 'compensation', 'ctc', 'pay', 'package', 'money', 'rate'],
      replies: [
        `Ooh, salary talk. 👀\n\nI'm not authorized to quote a number — that's a conversation for Shivam directly. But I *can* tell you he's priced for what he delivers: **enterprise-scale microservices, 90% deployment speedups, and production systems that don't page you at 3am**.\n\nReach out at **shivamsinghal24@gmail.com** and see where the conversation goes. 😏`,
      ]
    },

    {
      id: 'education',
      patterns: ['education', 'college', 'university', 'degree', 'study', 'studied', 'graduated', 'qualification', 'academic'],
      replies: [
        `🎓 **Education:**\n\nComputer Science/Engineering degree — the foundation under everything else. But honestly, Shivam's real education has been:\n\n• Shipping production code for **Bank of America** serving millions\n• Debugging distributed systems at 2am with Splunk as your only friend\n• Building iOS apps, IoT firmware, and AI platforms *on the side*\n\nThe degree opened the door. The work ethic built the room.`,
      ]
    },

    {
      id: 'location',
      patterns: ['location', 'where is he', 'city', 'country', 'based', 'india', 'hyderabad', 'remote work', 'relocate'],
      replies: [
        `📍 **Hyderabad, India** — but don't let geography stop you.\n\nShivam is open to:\n• **Hybrid/On-site** in Hyderabad\n• Fully **remote** anywhere\n• **Relocation** — he's genuinely flexible\n\nThe right opportunity is worth the timezone math. And honestly, async-first teams are his natural habitat anyway.`,
      ]
    },

    {
      id: 'microservices',
      patterns: ['microservices', 'distributed systems', 'architecture', 'system design', 'scalable', 'openshift', 'kubernetes', 'spring boot'],
      replies: [
        `This is Shivam's *sweet spot*. 🏗️\n\nAt Bank of America:\n→ Architected **10+ Spring Boot microservices** from greenfield\n→ Migrated **6 monoliths** to Docker microservices — 45% less maintenance overhead\n→ Containerized legacy AutoSys batch scheduling → OpenShift (**80% overhead reduction**)\n→ Systems now handle **<1M requests/day** reliably\n\nHe doesn't just build services — he thinks about failure modes, observability, and operational cost from day one. That's the difference.`,
      ]
    },

    {
      id: 'observability',
      patterns: ['splunk', 'observability', 'monitoring', 'logging', 'alerting', 'incident', 'debugging', 'oncall', 'on-call'],
      replies: [
        `📊 **Observability? Shivam is basically a Splunk whisperer.**\n\nAt Bank of America:\n→ Designed alerting frameworks → **40% better anomaly detection**\n→ Improved MTTR by **35%**\n→ Resolved **20+ critical production incidents**\n→ Built dashboards that let ops teams actually sleep at night\n\nHis philosophy: *"If you can't measure it, you can't improve it."* Which is why he also improved it by a measurable amount. 😄`,
      ]
    },

    {
      id: 'devops',
      patterns: ['devops', 'ci/cd', 'pipeline', 'docker', 'deployment', 'automation', 'github actions', 'jenkins'],
      replies: [
        `🚀 **DevOps is baked into everything Shivam builds.**\n\n→ At **Bank of America:** OpenShift pipelines with automated health checks, deployment time cut from 4 hrs → **40 min**\n→ At **Incedo:** GitHub Actions CI/CD cut deploy cycle from 45 min → **8 min** (82% faster)\n→ Containerization-first mindset — if it's not in Docker, does it even exist?\n\nHe treats infrastructure as code, deployment as a product, and flaky pipelines as a *personal affront*. 😤`,
      ]
    },

    {
      id: 'fun',
      patterns: ['fun fact', 'interesting', 'hobbies', 'outside work', 'personal', 'passion', 'cool thing', 'something cool', 'surprise me'],
      replies: [
        `Buckle up. ⚡\n\n**5 things you might not expect:**\n1. 🤖 He built an AI called **"Friday"** — that's me, by the way. Iron Man influence confirmed.\n2. 📱 Builds **native iOS apps** recreationally. Not React Native — actual Swift.\n3. 🌦️ Has a working **IoT weather station** he built with Arduino. Actual hardware. Actual data.\n4. 💻 There's a **Matrix easter egg** hiding in this portfolio. (Try typing 'matrix' in the terminal)\n5. 🧠 Once optimized a SQL query so much the server actually had to be told to *slow down*. (Not really, but close.)`,
        `Here's one: Shivam named his AI interview mentor **"Friday"** after Tony Stark's AI. You're literally talking to a portfolio easter egg right now. 🫠\n\nAlso — he has an IoT weather station. A **real one**. With **real hardware**. For **absolutely no business reason** other than "I wanted to know the humidity in my room with sub-2-second latency."\n\nThat's the engineer brain. It never turns off.`,
      ]
    },

    {
      id: 'joke',
      patterns: ['joke', 'funny', 'make me laugh', 'tell me a joke', 'humor', 'laugh'],
      replies: [
        `Why do Java developers wear glasses? 👓\n\n**Because they don't C#.**\n\n...I'm available for enterprise-scale comedy and backend engineering. Shivam taught me the jokes. He's responsible for this.`,
        `A SQL query walks into a bar, walks up to two tables and asks...\n\n**"Can I join you?"** 😄\n\nShivam would laugh at this. He has spent many hours staring at Oracle SQL execution plans. He *earned* this joke.`,
        `Debugging: being the detective in a crime movie where **you are also the murderer**.\n\nShivam knows this feeling intimately. He's fixed 20+ production incidents. Many of them were caused by someone else. Probably. 👀`,
      ]
    },

    {
      id: 'compliment',
      patterns: ['great portfolio', 'awesome', 'impressive', 'nice', 'cool portfolio', 'well done', 'good job', 'love it', 'amazing'],
      replies: [
        `Right?? I helped build this, you know. The chatbot section specifically. *I'm* the star here. 😄\n\nBut seriously — Shivam put a lot into this portfolio. If you want to tell him directly, he's reachable at **shivamsinghal24@gmail.com**.\n\nOr better yet — send a job offer. That's the *real* compliment. 🎯`,
        `Glad you think so! Between the 3D neural globe, the boot sequence, the matrix terminal easter egg, *and* me — it took some engineering.\n\nFeel free to reach out to Shivam directly: **shivamsinghal24@gmail.com** 📬`,
      ]
    },

    {
      id: 'bofa',
      patterns: ['what does he do at bank', 'bank of america work', 'boa work', 'current job', 'current role', 'current work', 'what is he working on'],
      replies: [
        `At **Bank of America**, Shivam is an **SDE-I** — but the impact is anything but junior:\n\n→ Owns end-to-end lifecycle of **10+ microservices** in production\n→ Runs systems handling **<1M transactions/day**\n→ The one engineers call when Splunk starts screaming\n→ Modernized legacy Spring MVC apps that were old enough to vote\n\nHe's been there since July 2023 and has shipped more than most engineers do in twice the time.`,
      ]
    },
  ],

  // ── Fallback pool ─────────────────────────────────────────────────────────
  fallbacks: [
    `Hmm, that's outside my knowledge base. 🤔\n\nBut I *can* tell you about:\n→ Shivam's **experience** at Bank of America\n→ His **projects** (AI, iOS, IoT)\n→ Full **tech stack**\n→ Whether he's **open to hire** (he is)\n→ How to **contact** him`,
    `I didn't quite parse that one — and I'm an AI, so that's saying something. 😅\n\nTry asking about:\n• **"Tell me about his experience"**\n• **"What projects has he built?"**\n• **"Is he available to hire?"**\n• **"What's his tech stack?"**`,
    `That's either above my clearance level or I just don't have that data loaded. 😶\n\nWhat I *do* have: his entire career history, project specs, skills, contact info, and a mild sense of humor. What would you like?`,
    `If I were a real AI, I'd generate a confident answer anyway. But I have *integrity*. 🙃\n\nAsk me something I can actually answer — like:\n→ **"What has Shivam built?"**\n→ **"Is he looking for a job?"**\n→ **"Tell me about his microservices work"**`,
  ]

};

// ── Response Engine ───────────────────────────────────────────────────────────
function findResponse(userMessage) {
  const msg = userMessage.toLowerCase().trim();

  // Greetings — whole-word only (avoids "hi" in "hire")
  if (KB.greetings.some(g => wordMatch(msg, g))) return { reply: pick(KB.greetReplies) };

  // Farewells — whole-word only
  if (KB.farewells.some(f => wordMatch(msg, f))) return { reply: pick(KB.farewellReplies) };

  // Knowledge base — first pattern match wins, reply is randomly picked from variants
  for (const block of KB.responses) {
    if (block.patterns.some(p => msg.includes(p))) {
      return { reply: pick(block.replies), action: block.action || null };
    }
  }

  return { reply: pick(KB.fallbacks) };
}

// ── Action Executor ───────────────────────────────────────────────────────────
function executeAction(action) {
  if (action === 'open_resume') {
    // Programmatic download — creates a hidden <a> and clicks it
    const a = document.createElement('a');
    a.href     = '/resume.pdf';
    a.download = 'Shivam_Singhal_Resume.pdf';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

// ── Message Rendering ─────────────────────────────────────────────────────────
function formatMessage(text) {
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  text = text.replace(/^[•→]\s(.+)$/gm, '<span class="cb-bullet">$1</span>');
  text = text.replace(/\n/g, '<br>');
  return text;
}

function createMessageEl(content, role) {
  const wrapper = document.createElement('div');
  wrapper.className = `cb-message cb-${role}`;

  if (role === 'bot') {
    const avatar = document.createElement('div');
    avatar.className = 'cb-avatar';
    avatar.innerHTML = '<i class="fa-solid fa-robot"></i>';
    wrapper.appendChild(avatar);
  }

  const bubble = document.createElement('div');
  bubble.className = 'cb-bubble';
  bubble.innerHTML = formatMessage(content);
  wrapper.appendChild(bubble);

  return wrapper;
}

function createTypingIndicator() {
  const wrapper = document.createElement('div');
  wrapper.className = 'cb-message cb-bot cb-typing-msg';

  const avatar = document.createElement('div');
  avatar.className = 'cb-avatar';
  avatar.innerHTML = '<i class="fa-solid fa-robot"></i>';

  const bubble = document.createElement('div');
  bubble.className = 'cb-bubble cb-typing';
  bubble.innerHTML = '<span></span><span></span><span></span>';

  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);
  return wrapper;
}

// ── Init ──────────────────────────────────────────────────────────────────────
export function initChatbot() {
  const toggleBtn         = document.getElementById('chatbot-toggle');
  const panel             = document.getElementById('chatbot-panel');
  const closeBtn          = document.getElementById('chatbot-close');
  const input             = document.getElementById('chatbot-input');
  const sendBtn           = document.getElementById('chatbot-send');
  const messagesContainer = document.getElementById('chatbot-messages');
  const badge             = document.getElementById('chatbot-badge');
  const backToTop         = document.getElementById('back-to-top');

  if (!toggleBtn || !panel) return;

  let isOpen       = false;
  let messageCount = 0;

  // Nudge badge after 4s
  setTimeout(() => { if (!isOpen && badge) badge.classList.add('visible'); }, 4000);

  // ── Welcome message (picked randomly) ─────────────────────────────────────
  const welcomeMessages = [
    `"Initialising Friday... all systems operational." 🤖\n\nI'm **Friday** — Shivam's AI assistant. Ask me anything about him: career, projects, skills, or whether you should hire him. *(You should.)*`,
    `Good to see you here. I'm **Friday**, Shivam's AI.\n\nI know his career at **Bank of America** inside-out, every project he's built, and exactly how to convince you he's the right hire. Let's talk. 💬`,
    `Hey! I'm **Friday** — think of me as Shivam's always-on portfolio guide. 👾\n\nAsk about his **experience**, **skills**, **projects**, or just say hi. I've got personality settings ranging from *helpful* to *mildly sarcastic*.`,
  ];

  // ── Open / Close ──────────────────────────────────────────────────────────
  function openChat() {
    isOpen = true;
    panel.classList.add('active');
    toggleBtn.classList.add('open');
    document.body.classList.add('chat-open');
    if (badge) badge.classList.remove('visible');

    if (messageCount === 0) {
      setTimeout(() => appendBotMessage(pick(welcomeMessages)), 300);
    }
    setTimeout(() => input && input.focus(), 420);
  }

  function closeChat() {
    isOpen = false;
    panel.classList.remove('active');
    toggleBtn.classList.remove('open');
    document.body.classList.remove('chat-open');
  }

  toggleBtn.addEventListener('click', () => isOpen ? closeChat() : openChat());
  closeBtn && closeBtn.addEventListener('click', closeChat);

  document.addEventListener('click', e => {
    if (isOpen && !panel.contains(e.target) && !toggleBtn.contains(e.target)) closeChat();
  });

  // ── Message helpers ───────────────────────────────────────────────────────
  function appendBotMessage(text) {
    const msg = createMessageEl(text, 'bot');
    msg.style.opacity   = '0';
    msg.style.transform = 'translateY(10px)';
    messagesContainer.appendChild(msg);
    requestAnimationFrame(() => {
      msg.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      msg.style.opacity    = '1';
      msg.style.transform  = 'translateY(0)';
    });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    messageCount++;
  }

  function handleSend() {
    const text = input.value.trim();
    if (!text) return;

    // User bubble
    const userMsg = createMessageEl(text, 'user');
    userMsg.style.opacity   = '0';
    userMsg.style.transform = 'translateY(10px)';
    messagesContainer.appendChild(userMsg);
    requestAnimationFrame(() => {
      userMsg.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      userMsg.style.opacity    = '1';
      userMsg.style.transform  = 'translateY(0)';
    });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    input.value = '';
    messageCount++;

    input.disabled   = true;
    sendBtn.disabled = true;

    const typingEl = createTypingIndicator();
    messagesContainer.appendChild(typingEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Delay scales with message length for realism
    const delay = 550 + Math.min(text.length * 8, 900);
    setTimeout(() => {
      typingEl.remove();
      const { reply, action } = findResponse(text);
      appendBotMessage(reply);
      // Execute any side-effect action (e.g. resume download) after message appears
      if (action) setTimeout(() => executeAction(action), 400);
      input.disabled   = false;
      sendBtn.disabled = false;
      input.focus();
    }, delay);
  }

  sendBtn && sendBtn.addEventListener('click', handleSend);
  input   && input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  });

  // ── Chips ─────────────────────────────────────────────────────────────────
  document.querySelectorAll('.cb-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const wasOpen = isOpen;
      if (!isOpen) openChat();
      setTimeout(() => {
        if (input.disabled) return;
        input.value = chip.textContent.trim();
        handleSend();
      }, wasOpen ? 0 : 360);
    });
  });
}

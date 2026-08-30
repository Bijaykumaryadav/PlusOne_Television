const ABOUT_KEY = "plusone_about_content";
const CAREER_KEY = "plusone_career_content";

const defaultAboutContent = {
  heroTitle: "About Sidha Reporting",
  heroSubtitle:
    "Nepal's trusted source for honest, fearless, and independent journalism since 2016.",
  heroImage: "",
  messageTitle: "Message from the Editor",
  messageText:
    "We believe in reporting with integrity, clarity, and a deep respect for the public we serve.",
  infoTitle: "Why readers trust us",
  infoText:
    "Our newsroom is grounded in fact-checking, field reporting, and accountability to the communities we cover.",
  missionTitle: "Journalism That Serves the People",
  missionText:
    "Sidha Reporting was founded with a single purpose: to deliver news that is direct, unfiltered, and in service of the Nepali people.",
  quote: "Our job is not to tell people what to think, but to give them what they need to think for themselves.",
  quoteAuthor: "Rajesh Sharma, Editor in Chief",
  stats: [
    { value: "10,000+", label: "Articles Published" },
    { value: "500K+", label: "Monthly Readers" },
    { value: "25+", label: "Districts Covered" },
    { value: "8+", label: "Years of Service" },
  ],
  team: [
    { name: "Rajesh Sharma", role: "Editor in Chief", avatar: "https://i.pravatar.cc/150?img=11", message: "", info: "" },
    { name: "Priya Thapa", role: "Senior Reporter", avatar: "https://i.pravatar.cc/150?img=47", message: "", info: "" },
    { name: "Bikash Rai", role: "Head of Technology", avatar: "https://i.pravatar.cc/150?img=15", message: "", info: "" },
    { name: "Sita Gurung", role: "Multimedia Editor", avatar: "https://i.pravatar.cc/150?img=45", message: "", info: "" },
  ],
  contact: [
    { label: "Email", value: "contact@sidhareporting.com" },
    { label: "Phone", value: "+977 01-4XXXXXX" },
    { label: "Address", value: "Kathmandu, Nepal" },
  ],
};

const defaultCareerContent = {
  heroTitle: "Join Sidha Reporting",
  heroSubtitle:
    "Be part of Nepal's most trusted news platform. Help us tell the stories that matter.",
  values: [
    { title: "Truth First", desc: "We are committed to honest, accurate, and unbiased reporting at all times." },
    { title: "Inclusive Team", desc: "We celebrate diversity and believe great journalism comes from diverse perspectives." },
    { title: "People Driven", desc: "Our team is our greatest asset. We invest in your growth and wellbeing." },
  ],
  jobs: [
    {
      id: 1,
      title: "Senior Reporter",
      department: "Editorial",
      location: "Kathmandu, Nepal",
      type: "Full-time",
      description:
        "We are looking for an experienced reporter to cover breaking news and in-depth stories across Nepal.",
      requirements: [
        "5+ years of journalism experience",
        "Excellent written and verbal communication",
        "Ability to work under tight deadlines",
        "Experience with digital media",
      ],
    },
    {
      id: 2,
      title: "Video Journalist",
      department: "Media",
      location: "Kathmandu, Nepal",
      type: "Full-time",
      description:
        "Join our growing video team to produce compelling video content for our digital platforms.",
      requirements: [
        "3+ years video production experience",
        "Proficiency in video editing software",
        "Strong storytelling skills",
        "Experience with live streaming",
      ],
    },
  ],
};

function readContent(storageKey, fallback) {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch (error) {
    console.error("Failed to read content from localStorage", error);
    return fallback;
  }
}

function writeContent(storageKey, value) {
  if (typeof window === "undefined") return value;
  window.localStorage.setItem(storageKey, JSON.stringify(value));
  return value;
}

export function getAboutContent() {
  return readContent(ABOUT_KEY, defaultAboutContent);
}

export function saveAboutContent(content) {
  return writeContent(ABOUT_KEY, { ...defaultAboutContent, ...content });
}

export function getCareerContent() {
  return readContent(CAREER_KEY, defaultCareerContent);
}

export function saveCareerContent(content) {
  return writeContent(CAREER_KEY, { ...defaultCareerContent, ...content });
}

export function getDefaultAboutContent() {
  return structuredClone(defaultAboutContent);
}

export function getDefaultCareerContent() {
  return structuredClone(defaultCareerContent);
}

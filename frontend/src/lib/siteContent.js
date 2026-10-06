import privateClient, { publicClient } from "@/services/axiosInstance";

const LEGACY_ABOUT_KEY = "plusone_about_content";
const LEGACY_CAREER_KEY = "plusone_career_content";

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

function readLegacyContent(storageKey) {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Failed to read legacy site content", error);
    return null;
  }
}

async function fetchContent(key, fallback) {
  const { data } = await publicClient.get(`/site-content/${key}`);
  return {
    exists: data.exists,
    content: { ...fallback, ...(data.data || {}) },
  };
}

export async function getAboutContent() {
  const result = await fetchContent("about", defaultAboutContent);
  return result.content;
}

export async function getAboutContentForAdmin() {
  const result = await fetchContent("about", defaultAboutContent);
  const legacyContent = readLegacyContent(LEGACY_ABOUT_KEY);
  if (!result.exists && legacyContent) {
    return saveAboutContent({ ...defaultAboutContent, ...legacyContent });
  }
  return result.content;
}

export async function saveAboutContent(content) {
  const value = { ...defaultAboutContent, ...content };
  const { data } = await privateClient.put("/site-content/about", value);
  if (typeof window !== "undefined") window.localStorage.removeItem(LEGACY_ABOUT_KEY);
  return { ...defaultAboutContent, ...data.data };
}

export async function getCareerContent() {
  const result = await fetchContent("career", defaultCareerContent);
  return result.content;
}

export async function getCareerContentForAdmin() {
  const result = await fetchContent("career", defaultCareerContent);
  const legacyContent = readLegacyContent(LEGACY_CAREER_KEY);
  if (!result.exists && legacyContent) {
    return saveCareerContent({ ...defaultCareerContent, ...legacyContent });
  }
  return result.content;
}

export async function saveCareerContent(content) {
  const value = { ...defaultCareerContent, ...content };
  const { data } = await privateClient.put("/site-content/career", value);
  if (typeof window !== "undefined") window.localStorage.removeItem(LEGACY_CAREER_KEY);
  return { ...defaultCareerContent, ...data.data };
}

export function getDefaultAboutContent() {
  return structuredClone(defaultAboutContent);
}

export function getDefaultCareerContent() {
  return structuredClone(defaultCareerContent);
}

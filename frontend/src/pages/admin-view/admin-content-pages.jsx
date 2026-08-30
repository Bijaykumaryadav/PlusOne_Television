import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, FileText, Plus, Save, Trash2, UserRound, Image as ImageIcon } from "lucide-react";
import { getAboutContent, getCareerContent, saveAboutContent, saveCareerContent, getDefaultAboutContent, getDefaultCareerContent } from "@/lib/siteContent";

const panelStyle = "rounded-xl border border-slate-200 bg-white shadow-sm";

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

function AdminContentPages() {
  const [activeTab, setActiveTab] = useState("about");
  const [aboutContent, setAboutContent] = useState(getDefaultAboutContent());
  const [careerContent, setCareerContent] = useState(getDefaultCareerContent());

  useEffect(() => {
    setAboutContent(getAboutContent());
    setCareerContent(getCareerContent());
  }, []);

  const saveAbout = async () => {
    saveAboutContent(aboutContent);
    setAboutContent(getAboutContent());
    toast.success("About page saved successfully");
  };

  const saveCareer = async () => {
    saveCareerContent(careerContent);
    setCareerContent(getCareerContent());
    toast.success("Career page saved successfully");
  };

  const updateAboutArray = (key, index, field, value) => {
    setAboutContent((prev) => ({
      ...prev,
      [key]: (prev[key] || []).map((item, idx) => idx === index ? { ...item, [field]: value } : item),
    }));
  };

  const addAboutItem = (key, shape) => {
    setAboutContent((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), shape],
    }));
  };

  const removeAboutItem = (key, index) => {
    setAboutContent((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((_, idx) => idx !== index),
    }));
  };

  const updateCareerJob = (index, field, value) => {
    setCareerContent((prev) => ({
      ...prev,
      jobs: (prev.jobs || []).map((job, idx) => idx === index ? { ...job, [field]: value } : job),
    }));
  };

  const updateCareerRequirement = (jobIndex, reqIndex, value) => {
    setCareerContent((prev) => ({
      ...prev,
      jobs: (prev.jobs || []).map((job, idx) => idx === jobIndex
        ? { ...job, requirements: (job.requirements || []).map((req, reqIdx) => reqIdx === reqIndex ? value : req) }
        : job),
    }));
  };

  const addCareerJob = () => {
    setCareerContent((prev) => ({
      ...prev,
      jobs: [...(prev.jobs || []), { id: Date.now(), title: "", department: "", location: "", type: "Full-time", description: "", requirements: [""] }],
    }));
  };

  const removeCareerJob = (index) => {
    setCareerContent((prev) => ({
      ...prev,
      jobs: (prev.jobs || []).filter((_, idx) => idx !== index),
    }));
  };

  const addRequirement = (jobIndex) => {
    setCareerContent((prev) => ({
      ...prev,
      jobs: (prev.jobs || []).map((job, idx) => idx === jobIndex ? { ...job, requirements: [...(job.requirements || []), ""] } : job),
    }));
  };

  const removeRequirement = (jobIndex, reqIndex) => {
    setCareerContent((prev) => ({
      ...prev,
      jobs: (prev.jobs || []).map((job, idx) => idx === jobIndex ? { ...job, requirements: (job.requirements || []).filter((_, index) => index !== reqIndex) } : job),
    }));
  };

  const handleHeroImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setAboutContent((prev) => ({ ...prev, heroImage: dataUrl }));
  };

  const handleTeamAvatarUpload = async (event, index) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    updateAboutArray("team", index, "avatar", dataUrl);
  };

  const renderAboutFields = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Hero title</span>
          <input value={aboutContent.heroTitle || ""} onChange={(e) => setAboutContent((prev) => ({ ...prev, heroTitle: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Hero subtitle</span>
          <input value={aboutContent.heroSubtitle || ""} onChange={(e) => setAboutContent((prev) => ({ ...prev, heroSubtitle: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </label>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2 mb-3">
          <ImageIcon className="h-4 w-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">Hero image (optional)</span>
        </div>
        <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="w-full rounded-md border border-slate-300 px-3 py-2" />
        <div className="mt-3">
          {aboutContent.heroImage ? (
            <img src={aboutContent.heroImage} alt="Hero preview" className="h-40 w-full rounded-lg object-cover border border-slate-200" />
          ) : (
            <div className="h-40 w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-sm text-slate-500">
              No hero image uploaded yet
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Mission title</span>
          <input value={aboutContent.missionTitle || ""} onChange={(e) => setAboutContent((prev) => ({ ...prev, missionTitle: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Mission text</span>
          <textarea value={aboutContent.missionText || ""} onChange={(e) => setAboutContent((prev) => ({ ...prev, missionText: e.target.value }))} rows={4} className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Message title (optional)</span>
          <input value={aboutContent.messageTitle || ""} onChange={(e) => setAboutContent((prev) => ({ ...prev, messageTitle: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Message text (optional)</span>
          <textarea value={aboutContent.messageText || ""} onChange={(e) => setAboutContent((prev) => ({ ...prev, messageText: e.target.value }))} rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Info title (optional)</span>
          <input value={aboutContent.infoTitle || ""} onChange={(e) => setAboutContent((prev) => ({ ...prev, infoTitle: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Info text (optional)</span>
          <textarea value={aboutContent.infoText || ""} onChange={(e) => setAboutContent((prev) => ({ ...prev, infoText: e.target.value }))} rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Quote</span>
          <textarea value={aboutContent.quote || ""} onChange={(e) => setAboutContent((prev) => ({ ...prev, quote: e.target.value }))} rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Quote author</span>
          <input value={aboutContent.quoteAuthor || ""} onChange={(e) => setAboutContent((prev) => ({ ...prev, quoteAuthor: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </label>
      </div>

      <Card className={panelStyle}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <span className="flex items-center gap-2"><Badge className="bg-slate-100 text-slate-700">Stats</Badge></span>
            <Button type="button" size="sm" variant="outline" onClick={() => addAboutItem("stats", { value: "", label: "" })}><Plus className="h-4 w-4 mr-1" /> Add</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(aboutContent.stats || []).map((stat, index) => (
            <div key={index} className="grid md:grid-cols-[1fr_1.5fr_auto] gap-3 items-end border border-slate-200 rounded-lg p-3">
              <input value={stat.value || ""} onChange={(e) => updateAboutArray("stats", index, "value", e.target.value)} placeholder="10,000+" className="w-full rounded-md border border-slate-300 px-3 py-2" />
              <input value={stat.label || ""} onChange={(e) => updateAboutArray("stats", index, "label", e.target.value)} placeholder="Articles Published" className="w-full rounded-md border border-slate-300 px-3 py-2" />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeAboutItem("stats", index)} className="text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className={panelStyle}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <span className="flex items-center gap-2"><UserRound className="h-5 w-5" /> Team Members</span>
            <Button type="button" size="sm" variant="outline" onClick={() => addAboutItem("team", { name: "", role: "", avatar: "", message: "", info: "" })}><Plus className="h-4 w-4 mr-1" /> Add</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(aboutContent.team || []).map((person, index) => (
            <div key={index} className="space-y-3 border border-slate-200 rounded-lg p-3">
              <div className="grid md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
                <input value={person.name || ""} onChange={(e) => updateAboutArray("team", index, "name", e.target.value)} placeholder="Name" className="w-full rounded-md border border-slate-300 px-3 py-2" />
                <input value={person.role || ""} onChange={(e) => updateAboutArray("team", index, "role", e.target.value)} placeholder="Role" className="w-full rounded-md border border-slate-300 px-3 py-2" />
                <input value={person.avatar || ""} onChange={(e) => updateAboutArray("team", index, "avatar", e.target.value)} placeholder="Avatar URL" className="w-full rounded-md border border-slate-300 px-3 py-2" />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeAboutItem("team", index)} className="text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <input value={person.message || ""} onChange={(e) => updateAboutArray("team", index, "message", e.target.value)} placeholder="Short message (optional)" className="w-full rounded-md border border-slate-300 px-3 py-2" />
                <input value={person.info || ""} onChange={(e) => updateAboutArray("team", index, "info", e.target.value)} placeholder="Extra info (optional)" className="w-full rounded-md border border-slate-300 px-3 py-2" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Upload avatar image (optional)</label>
                <input type="file" accept="image/*" onChange={(event) => handleTeamAvatarUpload(event, index)} className="w-full rounded-md border border-slate-300 px-3 py-2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className={panelStyle}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <span className="flex items-center gap-2"><FileText className="h-5 w-5" /> Contact</span>
            <Button type="button" size="sm" variant="outline" onClick={() => addAboutItem("contact", { label: "", value: "" })}><Plus className="h-4 w-4 mr-1" /> Add</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(aboutContent.contact || []).map((item, index) => (
            <div key={index} className="grid md:grid-cols-[0.8fr_1.5fr_auto] gap-3 items-end border border-slate-200 rounded-lg p-3">
              <input value={item.label || ""} onChange={(e) => updateAboutArray("contact", index, "label", e.target.value)} placeholder="Email" className="w-full rounded-md border border-slate-300 px-3 py-2" />
              <input value={item.value || ""} onChange={(e) => updateAboutArray("contact", index, "value", e.target.value)} placeholder="contact@sidhareporting.com" className="w-full rounded-md border border-slate-300 px-3 py-2" />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeAboutItem("contact", index)} className="text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveAbout}><Save className="h-4 w-4 mr-2" /> Save About Page</Button>
      </div>
    </div>
  );

  const renderCareerFields = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Hero title</span>
          <input value={careerContent.heroTitle || ""} onChange={(e) => setCareerContent((prev) => ({ ...prev, heroTitle: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Hero subtitle</span>
          <input value={careerContent.heroSubtitle || ""} onChange={(e) => setCareerContent((prev) => ({ ...prev, heroSubtitle: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </label>
      </div>

      <Card className={panelStyle}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <span className="flex items-center gap-2"><Briefcase className="h-5 w-5" /> Values</span>
            <Button type="button" size="sm" variant="outline" onClick={() => setCareerContent((prev) => ({ ...prev, values: [...(prev.values || []), { title: "", desc: "" }] }))}><Plus className="h-4 w-4 mr-1" /> Add</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(careerContent.values || []).map((value, index) => (
            <div key={index} className="grid md:grid-cols-[1fr_2fr_auto] gap-3 items-end border border-slate-200 rounded-lg p-3">
              <input value={value.title || ""} onChange={(e) => setCareerContent((prev) => ({ ...prev, values: (prev.values || []).map((item, idx) => idx === index ? { ...item, title: e.target.value } : item) }))} placeholder="Title" className="w-full rounded-md border border-slate-300 px-3 py-2" />
              <input value={value.desc || ""} onChange={(e) => setCareerContent((prev) => ({ ...prev, values: (prev.values || []).map((item, idx) => idx === index ? { ...item, desc: e.target.value } : item) }))} placeholder="Description" className="w-full rounded-md border border-slate-300 px-3 py-2" />
              <Button type="button" variant="ghost" size="icon" onClick={() => setCareerContent((prev) => ({ ...prev, values: (prev.values || []).filter((_, idx) => idx !== index) }))} className="text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className={panelStyle}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <span className="flex items-center gap-2"><Briefcase className="h-5 w-5" /> Job Openings</span>
            <Button type="button" size="sm" variant="outline" onClick={addCareerJob}><Plus className="h-4 w-4 mr-1" /> Add Job</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {(careerContent.jobs || []).map((job, index) => (
            <div key={job.id || index} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4">
              <div className="grid md:grid-cols-2 gap-3">
                <input value={job.title || ""} onChange={(e) => updateCareerJob(index, "title", e.target.value)} placeholder="Job title" className="w-full rounded-md border border-slate-300 px-3 py-2" />
                <input value={job.department || ""} onChange={(e) => updateCareerJob(index, "department", e.target.value)} placeholder="Department" className="w-full rounded-md border border-slate-300 px-3 py-2" />
                <input value={job.location || ""} onChange={(e) => updateCareerJob(index, "location", e.target.value)} placeholder="Location" className="w-full rounded-md border border-slate-300 px-3 py-2" />
                <input value={job.type || ""} onChange={(e) => updateCareerJob(index, "type", e.target.value)} placeholder="Full-time" className="w-full rounded-md border border-slate-300 px-3 py-2" />
              </div>
              <textarea value={job.description || ""} onChange={(e) => updateCareerJob(index, "description", e.target.value)} rows={3} placeholder="Job description" className="w-full rounded-md border border-slate-300 px-3 py-2" />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Requirements</span>
                  <Button type="button" size="sm" variant="outline" onClick={() => addRequirement(index)}><Plus className="h-4 w-4 mr-1" /> Add</Button>
                </div>
                {(job.requirements || []).map((requirement, reqIndex) => (
                  <div key={reqIndex} className="flex gap-2 items-center">
                    <input value={requirement || ""} onChange={(e) => updateCareerRequirement(index, reqIndex, e.target.value)} placeholder="Requirement" className="w-full rounded-md border border-slate-300 px-3 py-2" />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeRequirement(index, reqIndex)} className="text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button type="button" variant="destructive" size="sm" onClick={() => removeCareerJob(index)}><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveCareer}><Save className="h-4 w-4 mr-2" /> Save Careers Page</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-2 md:p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Content Pages</h1>
          <p className="text-sm text-slate-500 mt-1">Manage About Us and Careers content from the admin side.</p>
        </div>
      </div>

      <div className="inline-flex rounded-full bg-slate-100 p-1">
        <button type="button" onClick={() => setActiveTab("about")} className={`rounded-full px-4 py-2 text-sm font-medium ${activeTab === "about" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}>
          About Us
        </button>
        <button type="button" onClick={() => setActiveTab("career")} className={`rounded-full px-4 py-2 text-sm font-medium ${activeTab === "career" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}>
          Careers
        </button>
      </div>

      {activeTab === "about" ? renderAboutFields() : renderCareerFields()}
    </div>
  );
}

export default AdminContentPages;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus, Edit2, Trash2, ExternalLink, Image, FolderKanban, X, PlusCircle, Check, GitBranch, Briefcase, Zap } from "lucide-react";

const API = "http://localhost:5000";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");
  const username = localStorage.getItem("admin_username") || "Admin";

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ── Projects State ──
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState("Frontend");
  const [formDesc, setFormDesc] = useState("");
  const [formGithub, setFormGithub] = useState("");
  const [formLive, setFormLive] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  // ── Skills State ──
  const [skills, setSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [skillInput, setSkillInput] = useState("");
  const [skillSubmitLoading, setSkillSubmitLoading] = useState(false);

  // ── Services State ──
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [serviceSubmitLoading, setServiceSubmitLoading] = useState(false);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchProjects();
    fetchServices();
    fetchSkills();
  }, [token, navigate]);

  // ── Project Handlers ──
  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);
      const res = await fetch(`${API}/api/projects`);
      const data = await res.json();
      setProjects(data);
    } catch { setError("Failed to load projects."); }
    finally { setProjectsLoading(false); }
  };

  const openAddProject = () => {
    setEditingProject(null); setFormTitle(""); setFormType("Frontend");
    setFormDesc(""); setFormGithub(""); setFormLive("");
    setSelectedFile(null); setImagePreview("");
    setIsProjectModalOpen(true);
  };

  const openEditProject = (p) => {
    setEditingProject(p); setFormTitle(p.title); setFormType(p.type);
    setFormDesc(p.desc); setFormGithub(p.githubLink || ""); setFormLive(p.liveLink || "");
    setSelectedFile(null); setImagePreview(p.imageUrl || "");
    setIsProjectModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault(); setError(""); setSuccessMsg(""); setSubmitLoading(true);
    const formData = new FormData();
    formData.append("title", formTitle); formData.append("type", formType);
    formData.append("desc", formDesc); formData.append("githubLink", formGithub);
    formData.append("liveLink", formLive);
    if (selectedFile) formData.append("image", selectedFile);
    const url = editingProject ? `${API}/api/projects/${editingProject._id}` : `${API}/api/projects`;
    try {
      const res = await fetch(url, { method: editingProject ? "PUT" : "POST", headers: { Authorization: `Bearer ${token}` }, body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save project.");
      setSuccessMsg(editingProject ? "Project updated!" : "Project added!");
      setIsProjectModalOpen(false); fetchProjects();
    } catch (err) { setError(err.message); }
    finally { setSubmitLoading(false); }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    setError(""); setSuccessMsg("");
    try {
      const res = await fetch(`${API}/api/projects/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete.");
      setSuccessMsg("Project deleted."); fetchProjects();
    } catch (err) { setError(err.message); }
  };

  // ── Service Handlers ──
  const fetchServices = async () => {
    try {
      setServicesLoading(true);
      const res = await fetch(`${API}/api/services`);
      const data = await res.json();
      setServices(data);
    } catch { setError("Failed to load services."); }
    finally { setServicesLoading(false); }
  };

  const openAddService = () => {
    setEditingService(null); setServiceTitle(""); setServiceDesc("");
    setIsServiceModalOpen(true);
  };

  const openEditService = (s) => {
    setEditingService(s); setServiceTitle(s.title); setServiceDesc(s.desc);
    setIsServiceModalOpen(true);
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault(); setError(""); setSuccessMsg(""); setServiceSubmitLoading(true);
    const url = editingService ? `${API}/api/services/${editingService._id}` : `${API}/api/services`;
    try {
      const res = await fetch(url, {
        method: editingService ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ title: serviceTitle, desc: serviceDesc }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save service.");
      setSuccessMsg(editingService ? "Service updated!" : "Service added!");
      setIsServiceModalOpen(false); fetchServices();
    } catch (err) { setError(err.message); }
    finally { setServiceSubmitLoading(false); }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    setError(""); setSuccessMsg("");
    try {
      const res = await fetch(`${API}/api/services/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete.");
      setSuccessMsg("Service deleted."); fetchServices();
    } catch (err) { setError(err.message); }
  };

  // ── Skills Handlers ──
  const fetchSkills = async () => {
    try {
      setSkillsLoading(true);
      const res = await fetch(`${API}/api/skills`);
      const data = await res.json();
      setSkills(data);
    } catch { setError("Failed to load skills."); }
    finally { setSkillsLoading(false); }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault(); setError(""); setSuccessMsg(""); setSkillSubmitLoading(true);
    try {
      const res = await fetch(`${API}/api/skills`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ name: skillInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add skill.");
      setSuccessMsg("Skill added!"); setSkillInput(""); fetchSkills();
    } catch (err) { setError(err.message); }
    finally { setSkillSubmitLoading(false); }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm("Delete this skill?")) return;
    setError(""); setSuccessMsg("");
    try {
      const res = await fetch(`${API}/api/skills/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete.");
      setSuccessMsg("Skill deleted."); fetchSkills();
    } catch (err) { setError(err.message); }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_username");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/40 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-6 w-6 text-teal-400" />
            <h1 className="text-xl font-bold tracking-tight">Admin <span className="text-teal-400">Dashboard</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400 hidden sm:inline-block">Welcome, <span className="text-slate-200 font-semibold">{username}</span></span>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 border border-slate-700 px-3 py-1.5 rounded-lg text-sm transition cursor-pointer">
              <LogOut className="h-4 w-4" /><span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError("")}><X className="h-4 w-4" /></button>
          </div>
        )}
        {successMsg && (
          <div className="bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
            <span className="flex items-center gap-2"><Check className="h-4 w-4" />{successMsg}</span>
            <button onClick={() => setSuccessMsg("")}><X className="h-4 w-4" /></button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-800">
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition cursor-pointer ${activeTab === "projects" ? "border-teal-400 text-teal-400" : "border-transparent text-slate-400 hover:text-white"}`}
          >
            <FolderKanban className="h-4 w-4" /> Projects
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition cursor-pointer ${activeTab === "services" ? "border-teal-400 text-teal-400" : "border-transparent text-slate-400 hover:text-white"}`}
          >
            <Briefcase className="h-4 w-4" /> Services
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition cursor-pointer ${activeTab === "skills" ? "border-teal-400 text-teal-400" : "border-transparent text-slate-400 hover:text-white"}`}
          >
            <Zap className="h-4 w-4" /> Skills
          </button>
        </div>

        {/* ── PROJECTS TAB ── */}
        {activeTab === "projects" && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">Project Management</h2>
                <p className="text-slate-400 text-sm mt-1">Add, update or delete portfolio projects.</p>
              </div>
              <button onClick={openAddProject} className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2.5 rounded-lg transition cursor-pointer">
                <Plus className="h-5 w-5" /><span>Add Project</span>
              </button>
            </div>

            {projectsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <span className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></span>
                <p className="text-slate-400 text-sm">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="border border-dashed border-slate-800 rounded-2xl py-16 text-center">
                <FolderKanban className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-300">No Projects Found</h3>
                <button onClick={openAddProject} className="mt-6 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-4 py-2 rounded-lg text-sm transition cursor-pointer">Get Started</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div key={project._id} className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition">
                    <div className="h-48 bg-slate-950 flex items-center justify-center overflow-hidden relative group">
                      {project.imageUrl ? (
                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      ) : (
                        <div className="flex flex-col items-center text-slate-600 gap-1">
                          <Image className="h-8 w-8" /><span className="text-xs">No Image</span>
                        </div>
                      )}
                      <span className="absolute top-3 left-3 bg-slate-900/90 text-teal-400 text-xs px-2.5 py-1 rounded-full font-bold border border-slate-800">{project.type}</span>
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{project.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">{project.desc}</p>
                      </div>
                      <div className="flex gap-4 pt-4 border-t border-slate-800/80">
                        {project.githubLink && (
                          <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition">
                            <GitBranch className="h-3.5 w-3.5" /><span>GitHub</span>
                          </a>
                        )}
                        {project.liveLink && (
                          <a href={project.liveLink} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-teal-400 flex items-center gap-1.5 transition">
                            <ExternalLink className="h-3.5 w-3.5" /><span>Live Demo</span>
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="bg-slate-950/60 border-t border-slate-800/80 px-6 py-3 flex justify-end gap-3">
                      <button onClick={() => openEditProject(project)} className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition cursor-pointer"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => handleDeleteProject(project._id)} className="p-1.5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded transition cursor-pointer"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── SERVICES TAB ── */}
        {activeTab === "services" && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">Services Management</h2>
                <p className="text-slate-400 text-sm mt-1">Add, update or delete portfolio services.</p>
              </div>
              <button onClick={openAddService} className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2.5 rounded-lg transition cursor-pointer">
                <Plus className="h-5 w-5" /><span>Add Service</span>
              </button>
            </div>

            {servicesLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <span className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></span>
                <p className="text-slate-400 text-sm">Loading services...</p>
              </div>
            ) : services.length === 0 ? (
              <div className="border border-dashed border-slate-800 rounded-2xl py-16 text-center">
                <Briefcase className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-300">No Services Found</h3>
                <button onClick={openAddService} className="mt-6 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-4 py-2 rounded-lg text-sm transition cursor-pointer">Get Started</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div key={service._id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-slate-700 transition">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Briefcase className="h-5 w-5 text-teal-400" />
                        <h3 className="text-lg font-bold text-white line-clamp-1">{service.title}</h3>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-4">{service.desc}</p>
                    </div>
                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-800/80">
                      <button onClick={() => openEditService(service)} className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition cursor-pointer"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => handleDeleteService(service._id)} className="p-1.5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded transition cursor-pointer"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {/* ── SKILLS TAB ── */}
        {activeTab === "skills" && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">Skills Management</h2>
                <p className="text-slate-400 text-sm mt-1">Add or remove technical skills shown on portfolio.</p>
              </div>
            </div>

            {/* Add Skill Form */}
            <form onSubmit={handleAddSkill} className="flex gap-3 mb-8">
              <input
                type="text" required value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                placeholder="e.g. TypeScript"
                className="flex-1 bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-2.5 outline-none focus:border-teal-400 transition text-sm"
              />
              <button type="submit" disabled={skillSubmitLoading} className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2.5 rounded-lg transition cursor-pointer disabled:opacity-50">
                {skillSubmitLoading ? <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" /> : <><Plus className="h-4 w-4" /> Add Skill</>}
              </button>
            </form>

            {skillsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <span className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></span>
                <p className="text-slate-400 text-sm">Loading skills...</p>
              </div>
            ) : skills.length === 0 ? (
              <div className="border border-dashed border-slate-800 rounded-2xl py-16 text-center">
                <Zap className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-300">No Skills Found</h3>
                <p className="text-slate-500 text-sm mt-1">Add your first skill above.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {skills.map(skill => (
                  <div key={skill._id} className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 hover:border-slate-700 transition">
                    <Zap className="h-3.5 w-3.5 text-teal-400" />
                    <span className="text-sm font-semibold text-white">{skill.name}</span>
                    <button onClick={() => handleDeleteSkill(skill._id)} className="ml-1 text-slate-500 hover:text-red-400 transition cursor-pointer">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* ── Project Modal ── */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-lg text-white">{editingProject ? "Edit Project" : "Add New Project"}</h3>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleProjectSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">Title *</label>
                <input type="text" required value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 outline-none focus:border-teal-400 transition text-sm" placeholder="e.g. Blinkit Clone" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">Type *</label>
                  <select value={formType} onChange={(e) => setFormType(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2.5 outline-none focus:border-teal-400 transition text-sm cursor-pointer">
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Fullstack">Fullstack</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">Image</label>
                  <label className="flex items-center justify-center bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg px-3 py-2.5 cursor-pointer transition text-sm">
                    <PlusCircle className="h-4 w-4 mr-2" /><span>Choose</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>
              {imagePreview && (
                <div className="relative border border-slate-800 rounded-lg overflow-hidden h-36 bg-slate-950">
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => { setSelectedFile(null); setImagePreview(""); }} className="absolute top-2 right-2 bg-slate-950/80 hover:bg-red-500 text-white p-1 rounded-full"><X className="h-3.5 w-3.5" /></button>
                </div>
              )}
              <div>
                <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">Description *</label>
                <textarea required rows="4" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 outline-none focus:border-teal-400 transition text-sm resize-none" placeholder="Project description..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">GitHub URL</label>
                  <input type="url" value={formGithub} onChange={(e) => setFormGithub(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 outline-none focus:border-teal-400 transition text-sm" placeholder="https://github.com/..." />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">Live URL</label>
                  <input type="url" value={formLive} onChange={(e) => setFormLive(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 outline-none focus:border-teal-400 transition text-sm" placeholder="https://..." />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsProjectModalOpen(false)} className="hover:bg-slate-800 text-slate-300 font-semibold px-4 py-2 rounded-lg text-sm border border-slate-800 transition cursor-pointer">Cancel</button>
                <button type="submit" disabled={submitLoading} className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition cursor-pointer flex items-center justify-center min-w-[100px] disabled:opacity-50">
                  {submitLoading ? <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span> : editingProject ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Service Modal ── */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-lg text-white">{editingService ? "Edit Service" : "Add New Service"}</h3>
              <button onClick={() => setIsServiceModalOpen(false)} className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleServiceSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">Title *</label>
                <input type="text" required value={serviceTitle} onChange={(e) => setServiceTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 outline-none focus:border-teal-400 transition text-sm" placeholder="e.g. Frontend Development" />
              </div>
              <div>
                <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">Description *</label>
                <textarea required rows="4" value={serviceDesc} onChange={(e) => setServiceDesc(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 outline-none focus:border-teal-400 transition text-sm resize-none" placeholder="Service description..." />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsServiceModalOpen(false)} className="hover:bg-slate-800 text-slate-300 font-semibold px-4 py-2 rounded-lg text-sm border border-slate-800 transition cursor-pointer">Cancel</button>
                <button type="submit" disabled={serviceSubmitLoading} className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition cursor-pointer flex items-center justify-center min-w-[100px] disabled:opacity-50">
                  {serviceSubmitLoading ? <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span> : editingService ? "Save Changes" : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

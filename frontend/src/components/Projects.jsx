"use client";

import { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import { projectsData as initialProjectsData } from "@/data/projects";
import { useEditor } from "@/context/EditorContext";

import { API_BASE_URL } from "@/config/api";

export default function Projects() {
    const { isEditMode } = useEditor();
    const [projectsData, setProjectsData] = useState(initialProjectsData);

    useEffect(() => {
        const handleGlobalSave = async () => {
            if (!isEditMode) return;

            const content = `export const projectsData = ${JSON.stringify(projectsData, null, 4)};\n`;

            try {
                await fetch(`${API_BASE_URL}/save-content`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        filename: "data/projects.js",
                        content: content
                    }),
                });
            } catch (error) {
                console.error("Failed to save projects:", error);
            }
        };

        window.addEventListener("portfolio-save-all", handleGlobalSave);
        return () => window.removeEventListener("portfolio-save-all", handleGlobalSave);
    }, [projectsData, isEditMode]);

    const handleProjectUpdate = (index, field, value) => {
        const newProjects = [...projectsData.projects];
        newProjects[index][field] = value;
        setProjectsData({ ...projectsData, projects: newProjects });
    };

    const handleTechUpdate = (pIndex, tIndex, value) => {
        const newProjects = [...projectsData.projects];
        newProjects[pIndex].tech[tIndex] = value;
        setProjectsData({ ...projectsData, projects: newProjects });
    };

    const updateHeader = (field, value) => {
        setProjectsData({ ...projectsData, [field]: value });
    };

    return (
        <section id="projects" className="py-20 relative">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="section-title">
                        <span
                            className={`outline-none ${isEditMode ? 'ring-2 ring-purple-500/50 rounded-lg p-1 bg-white/5' : ''}`}
                            contentEditable={isEditMode}
                            suppressContentEditableWarning
                            onBlur={(e) => updateHeader("title", e.target.innerText)}
                        >
                            {projectsData.title}
                        </span> <span className="gradient-text">Projects</span>
                    </h2>
                    <p
                        className={`section-subtitle outline-none ${isEditMode ? 'ring-2 ring-purple-500/50 rounded-lg p-1 bg-white/5 mt-4' : ''}`}
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                        onBlur={(e) => updateHeader("subtitle", e.target.innerText)}
                    >
                        {projectsData.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projectsData.projects.filter(p => p.overview).map((project, index) => (
                        <div key={project.slug} className="animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                            <ProjectCard
                                project={project}
                                onUpdate={(field, value) => handleProjectUpdate(index, field, value)}
                                onTechUpdate={(tIndex, value) => handleTechUpdate(index, tIndex, value)}
                            />
                        </div>
                    ))}
                    {isEditMode && (
                        <button
                            onClick={() => {
                                const newP = [...projectsData.projects];
                                newP.push({
                                    slug: "new-project",
                                    title: "New Project",
                                    subtitle: "Project subtitle",
                                    description: "Description of the new project...",
                                    tech: ["React", "Next.js"],
                                    icon: "⭐",
                                    overview: true
                                });
                                setProjectsData({ ...projectsData, projects: newP });
                            }}
                            className="glass-card flex flex-col items-center justify-center p-8 border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 transition-all min-h-[400px] group"
                        >
                            <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-3xl text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all mb-4">
                                +
                            </div>
                            <span className="text-purple-400 font-bold uppercase tracking-wider text-sm group-hover:text-purple-300">Add Project</span>
                        </button>
                    )}
                </div>

                <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '450ms' }}>
                    <a href="/projects" className="btn-glow inline-block">
                        View All Projects
                    </a>
                </div>
            </div>
        </section>
    );
}

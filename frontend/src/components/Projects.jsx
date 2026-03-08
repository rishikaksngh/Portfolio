"use client";

import { useState, useEffect } from "react";
import { projects as initialProjects } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import { useEditor } from "@/context/EditorContext";

export default function Projects() {
    const { isEditMode } = useEditor();
    const [projects, setProjects] = useState(initialProjects);

    useEffect(() => {
        const handleGlobalSave = async () => {
            if (!isEditMode) return;

            const content = `export const projects = ${JSON.stringify(projects, null, 4)};\n`;

            try {
                await fetch("http://localhost:5001/save-content", {
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
    }, [projects, isEditMode]);

    const addProject = () => {
        const newProject = {
            title: "New Project",
            slug: "new-project",
            description: "Describe your project here...",
            icon: "🚀",
            tech: ["React", "Tailwind"],
            links: { github: "#", live: "#" }
        };
        setProjects([...projects, newProject]);
    };

    const removeProject = (index) => {
        setProjects(projects.filter((_, i) => i !== index));
    };

    return (
        <section id="projects" className="max-w-6xl mx-auto py-20 px-4">
            <div className="text-center mb-12">
                <h2 className="section-title">
                    <span
                        className={`outline-none ${isEditMode ? 'ring-2 ring-purple-500/50 rounded-lg p-1 bg-white/5' : ''}`}
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                    >
                        Featured
                    </span> <span className="gradient-text">Projects</span>
                </h2>
                <p
                    className={`section-subtitle outline-none ${isEditMode ? 'ring-2 ring-purple-500/50 rounded-lg p-1 bg-white/5 mt-4' : ''}`}
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                >
                    Things I&apos;ve built that I&apos;m proud of
                </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
                {projects.map((project, index) => (
                    <ProjectCard
                        key={index}
                        project={project}
                        isEditMode={isEditMode}
                        onRemove={() => removeProject(index)}
                        onUpdate={(field, value) => {
                            const newProjects = [...projects];
                            newProjects[index] = { ...newProjects[index], [field]: value };
                            setProjects(newProjects);
                        }}
                    />
                ))}

                {isEditMode && (
                    <button
                        onClick={addProject}
                        className="glass-card flex flex-col items-center justify-center p-12 border-2 border-dashed border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/5 transition-all group min-h-[300px]"
                    >
                        <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 text-3xl mb-4 group-hover:scale-110 transition-transform">
                            +
                        </div>
                        <span className="text-sm font-black text-purple-400 uppercase tracking-widest">Add New Project</span>
                    </button>
                )}
            </div>
        </section>
    );
}

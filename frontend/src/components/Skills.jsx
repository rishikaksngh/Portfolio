"use client";

import { useState, useEffect } from "react";
import { skillsData as initialSkillsData } from "@/data/skills";
import { useEditor } from "@/context/EditorContext";

import { API_BASE_URL } from "@/config/api";

export default function Skills() {
    const { isEditMode } = useEditor();
    const [skillsData, setSkillsData] = useState(initialSkillsData);

    useEffect(() => {
        const handleGlobalSave = async () => {
            if (!isEditMode) return;

            const content = `export const skillsData = ${JSON.stringify(skillsData, null, 4)};\n`;

            try {
                await fetch(`${API_BASE_URL}/save-content`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        filename: "data/skills.js",
                        content: content
                    }),
                });
            } catch (error) {
                console.error("Failed to save skills:", error);
            }
        };

        window.addEventListener("portfolio-save-all", handleGlobalSave);
        return () => window.removeEventListener("portfolio-save-all", handleGlobalSave);
    }, [skillsData, isEditMode]);

    const addCategory = () => {
        const newCategory = {
            title: "New Category",
            icon: "🔧",
            skills: ["Skill 1", "Skill 2"]
        };
        setSkillsData({
            ...skillsData,
            skillCategories: [...skillsData.skillCategories, newCategory]
        });
    };

    const removeCategory = (index) => {
        setSkillsData({
            ...skillsData,
            skillCategories: skillsData.skillCategories.filter((_, i) => i !== index)
        });
    };

    const updateCategory = (index, field, value) => {
        const newCategories = [...skillsData.skillCategories];
        newCategories[index][field] = value;
        setSkillsData({ ...skillsData, skillCategories: newCategories });
    };

    const updateSkill = (cIndex, sIndex, value) => {
        const newCategories = [...skillsData.skillCategories];
        newCategories[cIndex].skills[sIndex] = value;
        setSkillsData({ ...skillsData, skillCategories: newCategories });
    };

    const addSkill = (cIndex) => {
        const newCategories = [...skillsData.skillCategories];
        newCategories[cIndex].skills.push("New Skill");
        setSkillsData({ ...skillsData, skillCategories: newCategories });
    };

    const removeSkill = (cIndex, sIndex) => {
        const newCategories = [...skillsData.skillCategories];
        newCategories[cIndex].skills = newCategories[cIndex].skills.filter((_, i) => i !== sIndex);
        setSkillsData({ ...skillsData, skillCategories: newCategories });
    };

    const updateHeader = (field, value) => {
        setSkillsData({ ...skillsData, [field]: value });
    };

    return (
        <section id="skills" className="py-20 relative">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="section-title">
                        <span
                            className={`outline-none ${isEditMode ? 'ring-2 ring-purple-500/50 rounded-lg p-1 bg-white/5' : ''}`}
                            contentEditable={isEditMode}
                            suppressContentEditableWarning
                            onBlur={(e) => updateHeader("title", e.target.innerText)}
                        >
                            {skillsData.title}
                        </span> <span className="gradient-text">Skills</span>
                    </h2>
                    <p
                        className={`section-subtitle outline-none ${isEditMode ? 'ring-2 ring-purple-500/50 rounded-lg p-1 bg-white/5 mt-4' : ''}`}
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                        onBlur={(e) => updateHeader("subtitle", e.target.innerText)}
                    >
                        {skillsData.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {skillsData.skillCategories.map((category, index) => (
                        <div key={index} className="glass-card p-6 flex flex-col group relative">
                            {isEditMode && (
                                <button
                                    onClick={() => removeCategory(index)}
                                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                >
                                    ×
                                </button>
                            )}
                            <div className="flex items-center gap-3 mb-6">
                                <span
                                    className={`text-2xl outline-none ${isEditMode ? 'ring-2 ring-purple-500/30 rounded p-1' : ''}`}
                                    contentEditable={isEditMode}
                                    suppressContentEditableWarning
                                    onBlur={(e) => updateCategory(index, 'icon', e.target.innerText)}
                                >
                                    {category.icon}
                                </span>
                                <h3
                                    className={`text-xl font-semibold text-white outline-none w-full ${isEditMode ? 'ring-2 ring-purple-500/30 rounded px-2' : ''}`}
                                    contentEditable={isEditMode}
                                    suppressContentEditableWarning
                                    onBlur={(e) => updateCategory(index, 'title', e.target.innerText)}
                                >
                                    {category.title}
                                </h3>
                            </div>

                            <div className="flex flex-wrap gap-2 flex-grow">
                                {category.skills.map((skill, sIndex) => (
                                    <div key={sIndex} className="relative group/skill inline-block">
                                        <span
                                            className={`tech-badge inline-block outline-none min-w-[40px] ${isEditMode ? 'ring-1 ring-purple-500/50' : ''}`}
                                            contentEditable={isEditMode}
                                            suppressContentEditableWarning
                                            onBlur={(e) => updateSkill(index, sIndex, e.target.innerText)}
                                        >
                                            {skill}
                                        </span>
                                        {isEditMode && (
                                            <button
                                                onClick={() => removeSkill(index, sIndex)}
                                                className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] opacity-0 group-hover/skill:opacity-100 transition-opacity z-20"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {isEditMode && (
                                    <button
                                        onClick={() => addSkill(index)}
                                        className="tech-badge bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
                                    >
                                        + Add
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {isEditMode && (
                        <button
                            onClick={addCategory}
                            className="glass-card flex flex-col items-center justify-center p-6 border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/5 transition-all group min-h-[200px]"
                        >
                            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-2xl text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all mb-3 text-center">
                                +
                            </div>
                            <span className="text-purple-400 font-bold uppercase tracking-wider text-xs group-hover:text-purple-300 text-center">Add Category</span>
                        </button>
                    )}
                </div>
            </div>
            {isEditMode && (
                <div className="mt-12 text-center text-[10px] text-purple-400/50 uppercase tracking-[0.4em] font-black animate-pulse">
                    Global Editing Fully Initialized • All components interactive
                </div>
            )}
        </section>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useEditor } from "@/context/EditorContext";
import { skillCategories as initialCategories } from "@/data/skills";

export default function Skills() {
    const { isEditMode } = useEditor();
    const [categories, setCategories] = useState(initialCategories);

    useEffect(() => {
        const handleGlobalSave = async () => {
            if (!isEditMode) return;

            const content = `export const skillCategories = ${JSON.stringify(categories, null, 4)};\n`;

            try {
                await fetch("http://localhost:5001/save-content", {
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
    }, [categories, isEditMode]);

    const addSkill = (catIndex) => {
        const newCategories = [...categories];
        newCategories[catIndex].skills.push("New Skill");
        setCategories(newCategories);
    };

    const removeSkill = (catIndex, skillIndex) => {
        const newCategories = [...categories];
        newCategories[catIndex].skills.splice(skillIndex, 1);
        setCategories(newCategories);
    };

    const addCategory = () => {
        setCategories([
            ...categories,
            {
                title: "New Category",
                icon: "⚡",
                skills: ["Skill 1"]
            }
        ]);
    };

    const removeCategory = (index) => {
        setCategories(categories.filter((_, i) => i !== index));
    };

    const updateCategory = (index, field, value) => {
        const newCategories = [...categories];
        newCategories[index][field] = value;
        setCategories(newCategories);
    };

    const updateSkill = (catIndex, skillIndex, value) => {
        const newCategories = [...categories];
        newCategories[catIndex].skills[skillIndex] = value;
        setCategories(newCategories);
    };


    return (
        <section id="skills" className="max-w-6xl mx-auto py-20 px-4">
            <div className="text-center mb-12">
                <h2 className="section-title">
                    <span
                        className={`outline-none ${isEditMode ? 'ring-2 ring-purple-500/50 rounded-lg p-1 bg-white/5' : ''}`}
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                    >
                        Skills &
                    </span> <span className="gradient-text">Technologies</span>
                </h2>
                <p
                    className={`section-subtitle outline-none transition-all ${isEditMode ? 'ring-2 ring-purple-500/50 rounded-lg p-2 bg-white/5 mx-auto max-w-fit mt-4' : ''}`}
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                >
                    Technologies and tools I work with
                </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
                {categories.map((category, catIndex) => (
                    <div key={catIndex} className="glass-card p-6 text-center group relative">
                        {isEditMode && (
                            <button
                                onClick={() => removeCategory(catIndex)}
                                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                                ×
                            </button>
                        )}
                        <span
                            className={`text-3xl mb-4 block outline-none ${isEditMode ? 'ring-1 ring-purple-500/30 rounded' : ''}`}
                            contentEditable={isEditMode}
                            suppressContentEditableWarning
                            onBlur={(e) => updateCategory(catIndex, 'icon', e.target.innerText)}
                        >
                            {category.icon}
                        </span>
                        <h3
                            className={`text-lg font-semibold text-white mb-4 outline-none ${isEditMode ? 'ring-2 ring-purple-500/50 rounded p-1 bg-white/5' : ''}`}
                            contentEditable={isEditMode}
                            suppressContentEditableWarning
                            onBlur={(e) => updateCategory(catIndex, 'title', e.target.innerText)}
                        >
                            {category.title}
                        </h3>
                        <div className="flex flex-wrap justify-center gap-2">
                            {category.skills.map((skill, skillIndex) => (
                                <span
                                    key={skillIndex}
                                    className={`skill-badge border border-white/5 outline-none relative group/skill ${isEditMode ? 'ring-1 ring-purple-500/30 pr-6' : ''}`}
                                    contentEditable={isEditMode}
                                    suppressContentEditableWarning
                                    onBlur={(e) => updateSkill(catIndex, skillIndex, e.target.innerText)}
                                >
                                    {skill}
                                    {isEditMode && (
                                        <button
                                            onClick={() => removeSkill(catIndex, skillIndex)}
                                            className="absolute right-1 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-500 font-bold px-1"
                                        >
                                            ×
                                        </button>
                                    )}
                                </span>
                            ))}
                            {isEditMode && (
                                <button
                                    onClick={() => addSkill(catIndex)}
                                    className="w-8 h-8 rounded-full border border-dashed border-purple-500/30 flex items-center justify-center text-purple-400 hover:bg-purple-500/10 transition-colors"
                                    title="Add skill"
                                >
                                    +
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {isEditMode && (
                    <button
                        onClick={addCategory}
                        className="glass-card flex flex-col items-center justify-center p-6 border-2 border-dashed border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/5 transition-all group min-h-[200px]"
                    >
                        <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 text-2xl mb-2 group-hover:scale-110 transition-transform">
                            +
                        </div>
                        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest leading-tight">Add Skill Category</span>
                    </button>
                )}
            </div>

            {isEditMode && (
                <div className="mt-12 text-center text-[10px] text-purple-400/50 uppercase tracking-[0.4em] font-black animate-pulse">
                    Global Editing Fully Initialized • All components interactive
                </div>
            )}
        </section>
    );
}

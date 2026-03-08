"use client";

import { useState, useEffect } from "react";
import { hackathons as initialHackathons } from "@/data/experience";
import { useEditor } from "@/context/EditorContext";

export default function Experience() {
    const { isEditMode } = useEditor();
    const [hackathons, setHackathons] = useState(initialHackathons);

    useEffect(() => {
        const handleGlobalSave = async () => {
            if (!isEditMode) return;

            const content = `export const hackathons = ${JSON.stringify(hackathons, null, 4)};\n`;

            try {
                await fetch("http://localhost:5001/save-content", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        filename: "data/experience.js",
                        content: content
                    }),
                });
            } catch (error) {
                console.error("Failed to save experience:", error);
            }
        };

        window.addEventListener("portfolio-save-all", handleGlobalSave);
        return () => window.removeEventListener("portfolio-save-all", handleGlobalSave);
    }, [hackathons, isEditMode]);

    const addHackathon = () => {
        setHackathons([
            ...hackathons,
            {
                title: "New Hackathon",
                icon: "🚀",
                description: "Describe your hackathon experience here...",
                tech: ["Next.js", "React"]
            }
        ]);
    };

    const removeHackathon = (index) => {
        setHackathons(hackathons.filter((_, i) => i !== index));
    };

    const updateHackathon = (index, field, value) => {
        const newHackathons = [...hackathons];
        newHackathons[index][field] = value;
        setHackathons(newHackathons);
    };


    const updateTech = (hIndex, tIndex, newValue) => {
        const newHackathons = [...hackathons];
        newHackathons[hIndex].tech[tIndex] = newValue;
        setHackathons(newHackathons);
    };

    return (
        <section id="experience" className="max-w-6xl mx-auto py-20 px-4">
            <div className="text-center mb-16">
                <h2 className="section-title">
                    <span
                        className={`outline-none ${isEditMode ? 'ring-2 ring-purple-500/50 rounded-lg p-1 bg-white/5' : ''}`}
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                    >
                        Hackathon
                    </span> <span className="gradient-text">Experience</span>
                </h2>
                <p
                    className={`section-subtitle outline-none ${isEditMode ? 'ring-2 ring-purple-500/50 rounded-lg p-1 bg-white/5 mt-4' : ''}`}
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                >
                    Participation in competitive software development events and collaborative problem-solving.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:max-w-6xl mx-auto">
                {hackathons.map((h, i) => (
                    <div key={i} className="glass-card p-6 md:p-8 flex flex-col gap-6 group relative">
                        {isEditMode && (
                            <button
                                onClick={() => removeHackathon(i)}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg shadow-red-500/20"
                            >
                                ×
                            </button>
                        )}
                        <div className="flex items-center gap-4">
                            <div
                                className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-3xl border border-white/5 group-hover:border-purple-500/30 transition-all outline-none ${isEditMode ? 'ring-2 ring-purple-500/30' : ''}`}
                                contentEditable={isEditMode}
                                suppressContentEditableWarning
                                onBlur={(e) => updateHackathon(i, 'icon', e.target.innerText)}
                            >
                                {h.icon}
                            </div>
                            <h3
                                className={`text-2xl font-bold text-white group-hover:text-purple-400 transition-colors outline-none ${isEditMode ? 'ring-2 ring-purple-500/30 rounded px-2' : ''}`}
                                contentEditable={isEditMode}
                                suppressContentEditableWarning
                                onBlur={(e) => updateHackathon(i, 'title', e.target.innerText)}
                            >
                                {h.title}
                            </h3>
                        </div>

                        <p
                            className={`text-zinc-400 leading-relaxed outline-none ${isEditMode ? 'ring-2 ring-purple-500/30 rounded p-2 bg-white/5 whitespace-pre-wrap' : ''}`}
                            contentEditable={isEditMode}
                            suppressContentEditableWarning
                            onBlur={(e) => updateHackathon(i, 'description', e.target.innerText)}
                        >
                            {h.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-auto">
                            {h.tech.map((t, idx) => (
                                <span
                                    key={idx}
                                    className={`tech-badge outline-none ${isEditMode ? 'ring-1 ring-purple-500/30 min-w-[20px]' : ''}`}
                                    contentEditable={isEditMode}
                                    suppressContentEditableWarning
                                    onBlur={(e) => updateTech(i, idx, e.target.innerText)}
                                >
                                    {t}
                                </span>
                            ))}
                            {isEditMode && (
                                <button
                                    onClick={() => {
                                        const newH = [...hackathons];
                                        newH[i].tech.push("New Tag");
                                        setHackathons(newH);
                                    }}
                                    className="tech-badge bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
                                >
                                    +
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {isEditMode && (
                    <button
                        onClick={addHackathon}
                        className="glass-card p-12 text-center flex flex-col items-center justify-center border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/5 transition-all group min-h-[250px]"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 text-3xl mb-4 group-hover:scale-110 transition-transform shadow-xl shadow-purple-500/10">
                            +
                        </div>
                        <span className="text-sm font-black text-purple-400 uppercase tracking-[0.2em]">Add Experience</span>
                    </button>
                )}
            </div>

            {isEditMode && (
                <div className="mt-12 text-center text-xs text-purple-400/50 uppercase tracking-[0.3em] font-black animate-pulse">
                    Click any field to edit its content in real-time
                </div>
            )}
        </section>
    );
}

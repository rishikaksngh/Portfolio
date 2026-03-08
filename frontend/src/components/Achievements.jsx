"use client";

import { useState, useEffect } from "react";
import { useEditor } from "@/context/EditorContext";
import { achievementsData as initialAchievements } from "@/data/achievements";

export default function Achievements() {
    const { isEditMode } = useEditor();
    const [achievements, setAchievements] = useState(initialAchievements);

    useEffect(() => {
        const handleGlobalSave = async () => {
            if (!isEditMode) return;

            const content = `export const achievementsData = ${JSON.stringify(achievements, null, 4)};\n`;

            try {
                await fetch("http://localhost:5001/save-content", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        filename: "data/achievements.js",
                        content: content
                    }),
                });
            } catch (error) {
                console.error("Failed to save achievements:", error);
            }
        };

        window.addEventListener("portfolio-save-all", handleGlobalSave);
        return () => window.removeEventListener("portfolio-save-all", handleGlobalSave);
    }, [achievements, isEditMode]);

    const addAchievement = () => {
        setAchievements([
            ...achievements,
            {
                title: "New Achievement",
                icon: "🏆",
                color: "from-purple-500 to-blue-500",
            }
        ]);
    };

    const updateAchievement = (index, field, value) => {
        const newAchievements = [...achievements];
        newAchievements[index][field] = value;
        setAchievements(newAchievements);
    };

    return (
        <section id="achievements" className="max-w-6xl mx-auto py-20 px-4">
            <div className="text-center mb-12">
                <h2 className="section-title">
                    <span
                        className={`gradient-text outline-none ${isEditMode ? 'ring-2 ring-purple-500/50 rounded-lg p-1 bg-white/5' : ''}`}
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                    >
                        Achievements
                    </span>
                </h2>
                <p
                    className={`section-subtitle outline-none ${isEditMode ? 'ring-2 ring-purple-500/50 rounded-lg p-1 bg-white/5 mt-4' : ''}`}
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                >
                    Wins beyond the code
                </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto stagger-children">
                {achievements.map((a, index) => (
                    <div key={index} className="glass-card p-6 text-center group relative">
                        {isEditMode && (
                            <button
                                onClick={() => setAchievements(achievements.filter((_, i) => i !== index))}
                                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                                ×
                            </button>
                        )}
                        <div
                            className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${a.color} bg-opacity-10 mb-4 text-3xl group-hover:scale-110 transition-transform duration-300 outline-none ${isEditMode ? 'ring-2 ring-purple-500/30' : ''}`}
                            contentEditable={isEditMode}
                            suppressContentEditableWarning
                            onBlur={(e) => updateAchievement(index, 'icon', e.target.innerText)}
                        >
                            {a.icon}
                        </div>
                        <h3
                            className={`text-sm font-medium text-zinc-300 outline-none ${isEditMode ? 'ring-2 ring-purple-500/30 rounded p-1 bg-white/5' : ''}`}
                            contentEditable={isEditMode}
                            suppressContentEditableWarning
                            onBlur={(e) => updateAchievement(index, 'title', e.target.innerText)}
                        >
                            {a.title}
                        </h3>
                    </div>
                ))}

                {isEditMode && (
                    <button
                        onClick={addAchievement}
                        className="glass-card p-6 text-center flex flex-col items-center justify-center border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/5 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 text-2xl mb-2 group-hover:scale-110 transition-transform">
                            +
                        </div>
                        <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Add Achievement</span>
                    </button>
                )}
            </div>

            {isEditMode && (
                <div className="mt-8 text-center text-[10px] text-purple-400/50 uppercase tracking-[0.2em] font-bold animate-pulse">
                    Click any element to edit icon or text
                </div>
            )}
        </section>
    );
}

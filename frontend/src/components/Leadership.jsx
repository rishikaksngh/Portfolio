"use client";

import { useState, useEffect } from "react";
import { useEditor } from "@/context/EditorContext";
import { responsibilitiesData as initialResponsibilities } from "@/data/leadership";

import { API_BASE_URL } from "@/config/api";

export default function Leadership() {
    const { isEditMode } = useEditor();
    const [responsibilities, setResponsibilities] = useState(initialResponsibilities);

    useEffect(() => {
        const handleGlobalSave = async () => {
            if (!isEditMode) return;

            const content = `export const responsibilitiesData = ${JSON.stringify(responsibilities, null, 4)};\n`;

            try {
                await fetch(`${API_BASE_URL}/save-content`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        filename: "data/leadership.js",
                        content: content
                    }),
                });
            } catch (error) {
                console.error("Failed to save leadership responsibilities:", error);
            }
        };

        window.addEventListener("portfolio-save-all", handleGlobalSave);
        return () => window.removeEventListener("portfolio-save-all", handleGlobalSave);
    }, [responsibilities, isEditMode]);

    const addResponsibility = () => {
        setResponsibilities([...responsibilities, "New Responsibility"]);
    };

    const removeResponsibility = (index) => {
        setResponsibilities(responsibilities.filter((_, i) => i !== index));
    };

    const updateResponsibility = (index, value) => {
        const newR = [...responsibilities];
        newR[index] = value;
        setResponsibilities(newR);
    };

    return (
        <section id="leadership" className="max-w-6xl mx-auto py-20 px-4">
            <div className="text-center mb-12">
                <h2 className="section-title">
                    <span className="gradient-text">Leadership</span>
                </h2>
                <p className="section-subtitle">Roles where I lead and make an impact</p>
            </div>

            <div className="max-w-2xl mx-auto">
                <div className="glass-card p-8 text-center group relative">
                    <span className="text-4xl mb-4 block">🎓</span>
                    <h3 className="text-xl font-semibold text-white mb-1">
                        Secretary — Council of Cultural Affairs
                    </h3>
                    <p className="text-purple-400 text-sm mb-6">
                        JK Lakshmipat University
                    </p>

                    <div className="space-y-3">
                        {responsibilities.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 group/item relative"
                            >
                                <svg
                                    className="w-5 h-5 text-purple-400 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span
                                    className={`text-zinc-300 text-sm flex-1 text-left outline-none ${isEditMode ? 'ring-1 ring-purple-500/30 px-1' : ''}`}
                                    contentEditable={isEditMode}
                                    suppressContentEditableWarning
                                    onBlur={(e) => updateResponsibility(index, e.target.innerText)}
                                >
                                    {item}
                                </span>
                                {isEditMode && (
                                    <button
                                        onClick={() => removeResponsibility(index)}
                                        className="w-5 h-5 rounded-full bg-red-500/20 text-red-500 text-[10px] flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}

                        {isEditMode && (
                            <button
                                onClick={addResponsibility}
                                className="w-full py-2 rounded-lg border border-dashed border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-widest hover:bg-purple-500/5 hover:border-purple-500/60 transition-all"
                            >
                                + Add Responsibility
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

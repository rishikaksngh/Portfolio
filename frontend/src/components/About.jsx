"use client";

import { useState, useEffect } from "react";
import { useEditor } from "@/context/EditorContext";
import { learningItemsData as initialLearningItems } from "@/data/about";

export default function About() {
    const { isEditMode } = useEditor();
    const [learningItems, setLearningItems] = useState(initialLearningItems);

    useEffect(() => {
        const handleGlobalSave = async () => {
            if (!isEditMode) return;

            const content = `export const learningItemsData = ${JSON.stringify(learningItems, null, 4)};\n`;

            try {
                await fetch("http://localhost:5001/save-content", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        filename: "data/about.js",
                        content: content
                    }),
                });
            } catch (error) {
                console.error("Failed to save about items:", error);
            }
        };

        window.addEventListener("portfolio-save-all", handleGlobalSave);
        return () => window.removeEventListener("portfolio-save-all", handleGlobalSave);
    }, [learningItems, isEditMode]);

    return (
        <section id="about" className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="section-title">
                    About <span className="gradient-text">Me</span>
                </h2>
                <p
                    className={`section-subtitle outline-none transition-all ${isEditMode ? 'ring-2 ring-purple-500/50 rounded-lg p-2 bg-white/5 mx-auto max-w-fit' : ''}`}
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                >
                    A glimpse into who I am and what drives me
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Bio Card */}
                <div className="glass-card p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-2xl">👩‍💻</span>
                        <h3
                            className={`text-xl font-semibold text-white outline-none ${isEditMode ? 'ring-2 ring-purple-500/50 rounded-lg p-1 bg-white/5' : ''}`}
                            contentEditable={isEditMode}
                            suppressContentEditableWarning
                        >
                            Who I Am
                        </h3>
                    </div>
                    <div
                        className={`text-zinc-400 leading-relaxed mb-4 outline-none ${isEditMode ? 'ring-2 ring-purple-500/50 rounded-lg p-2 bg-white/5' : ''}`}
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                    >
                        <p className="mb-4">
                            I&apos;m a second-year Computer Science student specializing in
                            Artificial Intelligence and Machine Learning. I&apos;m passionate about
                            building intelligent systems that can make a real impact.
                        </p>
                        <p>
                            My journey in tech started with curiosity about how algorithms can
                            learn from data and grow into systems that solve meaningful
                            problems — from fraud detection to civic engagement platforms.
                        </p>
                    </div>
                </div>

                {/* Currently Learning Card */}
                <div className="glass-card p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-2xl">📚</span>
                        <h3
                            className={`text-xl font-semibold text-white outline-none ${isEditMode ? 'ring-2 ring-purple-500/50 rounded-lg p-1 bg-white/5' : ''}`}
                            contentEditable={isEditMode}
                            suppressContentEditableWarning
                        >
                            Currently Learning
                        </h3>
                    </div>
                    <div className="space-y-3 stagger-children">
                        {learningItems.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 group"
                            >
                                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex-shrink-0" />
                                <span
                                    className={`text-zinc-300 text-sm outline-none w-full ${isEditMode ? 'ring-1 ring-purple-500/30 rounded px-1' : ''}`}
                                    contentEditable={isEditMode}
                                    suppressContentEditableWarning
                                    onBlur={(e) => {
                                        const newItems = [...learningItems];
                                        newItems[index] = e.target.innerText;
                                        setLearningItems(newItems);
                                    }}
                                >
                                    {item}
                                </span>
                                {isEditMode && (
                                    <button
                                        onClick={() => setLearningItems(learningItems.filter((_, i) => i !== index))}
                                        className="opacity-0 group-hover:opacity-100 text-red-500/50 hover:text-red-500 transition-opacity text-xs"
                                        title="Remove item"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        {isEditMode && (
                            <button
                                onClick={() => setLearningItems([...learningItems, "New Learning Item"])}
                                className="w-full py-2 border border-dashed border-purple-500/20 rounded-lg text-xs text-purple-400 hover:bg-purple-500/5 transition-colors"
                            >
                                + Add Learning Item
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

"use client";

import Link from "next/link";
import { useState } from "react";

export default function ProjectCard({ project, isEditMode, onRemove, onUpdate }) {
    const [tech, setTech] = useState(project.tech);

    const updateTech = (index, newValue) => {
        const newTech = [...tech];
        newTech[index] = newValue;
        setTech(newTech);
        if (onUpdate) onUpdate('tech', newTech);
    };

    const addTech = () => {
        setTech([...tech, "New Tag"]);
    };

    return (
        <div className="glass-card flex flex-col h-full group relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_80px_rgba(0,0,0,0.4)]">
            {isEditMode && (
                <button
                    onClick={onRemove}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-xl shadow-red-500/20 active:scale-95"
                >
                    ×
                </button>
            )}

            <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-6">
                    <span
                        className={`text-4xl outline-none ${isEditMode ? 'ring-2 ring-purple-500/30' : ''}`}
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                        onBlur={(e) => onUpdate && onUpdate('icon', e.target.innerText)}
                    >
                        {project.icon}
                    </span>
                    <div className="flex flex-wrap gap-2 justify-end max-w-[60%]">
                        {tech.slice(0, 3).map((t, i) => (
                            <span
                                key={i}
                                className={`tech-badge text-[10px] outline-none ${isEditMode ? 'ring-1 ring-purple-500/30 min-w-[30px]' : ''}`}
                                contentEditable={isEditMode}
                                suppressContentEditableWarning
                                onBlur={(e) => updateTech(i, e.target.innerText)}
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                </div>

                <h3
                    className={`text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors outline-none ${isEditMode ? 'ring-2 ring-purple-500/30 rounded px-2 bg-white/5' : ''}`}
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => onUpdate && onUpdate('title', e.target.innerText)}
                >
                    {project.title}
                </h3>

                <p
                    className={`text-zinc-400 text-sm leading-relaxed mb-6 outline-none ${isEditMode ? 'ring-2 ring-purple-500/30 rounded p-2 bg-white/5 min-h-[4em]' : ''}`}
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => onUpdate && onUpdate('description', e.target.innerText)}
                >
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                    {tech.map((t, i) => (
                        <span
                            key={i}
                            className={`px-2 py-1 text-[10px] uppercase tracking-wider font-semibold bg-white/5 text-zinc-500 rounded border border-white/5 outline-none ${isEditMode ? 'ring-1 ring-purple-500/30 min-w-[20px]' : ''}`}
                            contentEditable={isEditMode}
                            suppressContentEditableWarning
                            onBlur={(e) => updateTech(i, e.target.innerText)}
                        >
                            {t}
                        </span>
                    ))}
                    {isEditMode && (
                        <button
                            onClick={addTech}
                            className="px-2 py-1 text-[10px] uppercase tracking-wider font-semibold bg-purple-500/10 text-purple-400 rounded border border-purple-500/30 hover:bg-purple-500/20 transition-colors"
                        >
                            + Tag
                        </button>
                    )}
                </div>
            </div>

            <div className={`p-6 pt-0 mt-4 transition-all ${isEditMode ? 'opacity-50 pointer-events-none' : ''}`}>
                <Link
                    href={`/projects/${project.slug}`}
                    className="w-full py-2.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 border border-white/5 hover:border-purple-500/30 text-white text-sm font-medium transition-all flex items-center justify-center gap-2 group/btn"
                >
                    Project Overview
                    <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}

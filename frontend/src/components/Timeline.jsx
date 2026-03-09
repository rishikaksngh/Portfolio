"use client";

import { useEffect, useRef, useState } from "react";
import { timelineData as initialTimelineData } from "@/data/timeline";
import { useEditor } from "@/context/EditorContext";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

const typeConfig = {
    education: {
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
        ),
        color: "from-blue-500 to-cyan-500",
        glow: "blue",
    },
    project: {
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        ),
        color: "from-purple-500 to-pink-500",
        glow: "purple",
    },
    hackathon: {
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        color: "from-amber-500 to-orange-500",
        glow: "amber",
    },
    leadership: {
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        color: "from-emerald-500 to-teal-500",
        glow: "emerald",
    },
};

function TimelineCard({ item, index, isEditMode, onRemove, onUpdate }) {
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("timeline-visible");
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.15 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const config = typeConfig[item.type] || typeConfig.project;
    const isLeft = index % 2 === 0;

    return (
        <div
            ref={ref}
            className={`timeline-card relative flex items-start gap-6 md:gap-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
        >
            {/* Card content */}
            <div className={`flex-1 ${isLeft ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"}`}>
                <div className="glass-card p-5 md:p-6 group relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                    {/* Gradient top accent */}
                    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${config.color} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />

                    {isEditMode && (
                        <button
                            onClick={() => onRemove(index)}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                        >
                            ×
                        </button>
                    )}

                    {/* Year badge */}
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-3 bg-gradient-to-r ${config.color} bg-opacity-10 border border-white/5`}>
                        <span
                            className={`text-white/80 outline-none ${isEditMode ? 'ring-1 ring-purple-500/30 px-1 min-w-[30px]' : ''}`}
                            contentEditable={isEditMode}
                            suppressContentEditableWarning
                            onBlur={(e) => onUpdate && onUpdate('year', e.target.innerText)}
                        >
                            {item.year}
                        </span>
                        {(item.ongoing || isEditMode) && (
                            <span
                                className={`flex items-center gap-1 ml-1 cursor-pointer outline-none ${item.ongoing ? 'text-green-400' : 'text-zinc-600'}`}
                                onClick={() => { if (isEditMode && onUpdate) onUpdate('ongoing', !item.ongoing); }}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${item.ongoing ? 'bg-green-400 animate-pulse' : 'bg-zinc-600'}`} />
                                {item.ongoing ? 'Present' : 'Ended'}
                            </span>
                        )}
                    </div>

                    <h3
                        className={`text-base md:text-lg font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors outline-none ${isEditMode ? 'ring-2 ring-purple-500/30 rounded px-2 bg-white/5' : ''}`}
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                        onBlur={(e) => onUpdate && onUpdate('title', e.target.innerText)}
                    >
                        {item.title}
                    </h3>

                    {(item.subtitle || isEditMode) && (
                        <p
                            className={`text-xs text-purple-400 mb-2 outline-none ${isEditMode ? 'ring-1 ring-purple-500/30 rounded px-1 min-h-[1em]' : ''}`}
                            contentEditable={isEditMode}
                            suppressContentEditableWarning
                            onBlur={(e) => onUpdate && onUpdate('subtitle', e.target.innerText)}
                        >
                            {item.subtitle}
                        </p>
                    )}

                    <p
                        className={`text-sm text-zinc-400 leading-relaxed outline-none ${isEditMode ? 'ring-2 ring-purple-500/30 rounded p-2 bg-white/5' : ''}`}
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                        onBlur={(e) => onUpdate && onUpdate('description', e.target.innerText)}
                    >
                        {item.description}
                    </p>
                </div>
            </div>

            {/* Center dot — visible on md+ */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-5 z-10 flex-col items-center">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    {config.icon}
                </div>
            </div>

            {/* Mobile icon — shown below md */}
            <div className={`md:hidden absolute left-0 top-5 z-10 w-9 h-9 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center text-white shadow-lg`}>
                {config.icon}
            </div>

            {/* Spacer for opposite side — desktop only */}
            <div className="hidden md:block flex-1" />
        </div>
    );
}

export default function Timeline() {
    const { isEditMode } = useEditor();
    const [timelineData, setTimelineData] = useState(initialTimelineData);

    useEffect(() => {
        const handleGlobalSave = async () => {
            if (!isEditMode) return;

            const content = `export const timelineData = ${JSON.stringify(timelineData, null, 4)};\n`;

            try {
                await fetch(`${API_BASE_URL}/save-content`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        filename: "data/timeline.js",
                        content: content
                    }),
                });
            } catch (error) {
                console.error("Failed to save timeline:", error);
            }
        };

        window.addEventListener("portfolio-save-all", handleGlobalSave);
        return () => window.removeEventListener("portfolio-save-all", handleGlobalSave);
    }, [timelineData, isEditMode]);

    const addEvent = () => {
        const newEvent = {
            year: "2024",
            title: "New Milestone",
            subtitle: "Location/Institution",
            description: "Briefly describe this milestone...",
            type: "project",
            ongoing: false
        };
        setTimelineData({
            ...timelineData,
            events: [...timelineData.events, newEvent]
        });
    };

    const removeEvent = (index) => {
        setTimelineData({
            ...timelineData,
            events: timelineData.events.filter((_, i) => i !== index)
        });
    };

    const updateEvent = (index, field, value) => {
        const newEvents = [...timelineData.events];
        newEvents[index] = { ...newEvents[index], [field]: value };
        setTimelineData({ ...timelineData, events: newEvents });
    };

    const updateHeader = (field, value) => {
        setTimelineData({ ...timelineData, [field]: value });
    };

    return (
        <section id="journey" className="max-w-6xl mx-auto py-20 px-4">
            <div className="text-center mb-14">
                <h2 className="section-title">
                    <span
                        className={`outline-none ${isEditMode ? 'ring-2 ring-purple-500/50 rounded-lg p-1 bg-white/5' : ''}`}
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                        onBlur={(e) => updateHeader("title", e.target.innerText)}
                    >
                        {timelineData.title}
                    </span> <span className="gradient-text">Journey</span>
                </h2>
                <p
                    className={`section-subtitle outline-none ${isEditMode ? 'ring-2 ring-purple-500/50 rounded-lg p-1 bg-white/5 mt-4' : ''}`}
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => updateHeader("subtitle", e.target.innerText)}
                >
                    {timelineData.subtitle}
                </p>
            </div>

            <div className="relative pl-12 md:pl-0 lg:max-w-5xl mx-auto">
                {/* Vertical line — mobile left, desktop center */}
                <div className="absolute left-[17px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/60 via-cyan-500/40 to-purple-500/10" />

                <div className="space-y-10 md:space-y-12">
                    {timelineData.events.map((item, i) => (
                        <TimelineCard
                            key={i}
                            item={item}
                            index={i}
                            isEditMode={isEditMode}
                            onRemove={removeEvent}
                            onUpdate={(field, value) => updateEvent(i, field, value)}
                        />
                    ))}
                </div>

                {isEditMode && (
                    <div className="flex justify-center mt-12 relative z-20">
                        <button
                            onClick={addEvent}
                            className="px-8 py-3 rounded-2xl bg-zinc-900 border-2 border-dashed border-purple-500/30 text-purple-400 font-bold uppercase tracking-widest hover:border-purple-500 hover:bg-purple-500/5 transition-all flex items-center gap-2 group"
                        >
                            <span className="text-xl group-hover:scale-125 transition-transform">+</span>
                            Add Journey Event
                        </button>
                    </div>
                )}

                {/* Terminal dot */}
                {!isEditMode && (
                    <div className="absolute left-[13px] md:left-1/2 md:-translate-x-1/2 -bottom-2 w-3 h-3 rounded-full bg-purple-500 animate-pulse-glow" />
                )}
            </div>
        </section>
    );
}

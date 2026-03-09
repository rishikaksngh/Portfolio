"use client";

import { useState, useEffect } from "react";
import { useEditor } from "@/context/EditorContext";
import { heroData as initialHeroData } from "@/data/hero";

import { API_BASE_URL } from "@/config/api";

export default function Hero() {
    const { isEditMode } = useEditor();
    const [hero, setHero] = useState(initialHeroData);
    const [roleIndex, setRoleIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);

    const [profileImage, setProfileImage] = useState("/profile.jpg");

    useEffect(() => {
        // Prevent SSR hydration mismatch by adding cache-buster only on the client
        setProfileImage(`/profile.jpg?t=${new Date().getTime()}`);
    }, []);

    useEffect(() => {
        const handleGlobalSave = async () => {
            if (!isEditMode) return;
            const content = `export const heroData = ${JSON.stringify(hero, null, 4)};\n`;
            try {
                await fetch(`${API_BASE_URL}/save-content`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        filename: "data/hero.js",
                        content: content
                    }),
                });
            } catch (error) {
                console.error("Failed to save hero data:", error);
            }
        };

        window.addEventListener("portfolio-save-all", handleGlobalSave);
        return () => window.removeEventListener("portfolio-save-all", handleGlobalSave);
    }, [hero, isEditMode]);

    useEffect(() => {
        const handleTyping = () => {
            const currentRole = hero.roles[roleIndex] || "";
            if (isDeleting) {
                setDisplayText(currentRole.substring(0, displayText.length - 1));
                setTypingSpeed(50);
            } else {
                setDisplayText(currentRole.substring(0, displayText.length + 1));
                setTypingSpeed(150);
            }

            if (!isDeleting && displayText === currentRole) {
                setTimeout(() => setIsDeleting(true), 2000);
            } else if (isDeleting && displayText === "") {
                setIsDeleting(false);
                setRoleIndex((roleIndex + 1) % hero.roles.length);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [displayText, isDeleting, roleIndex, hero.roles, typingSpeed]);

    const updateHero = (field, value) => {
        setHero(prev => ({ ...prev, [field]: value }));
    };

    const updatePhotoFrame = (field, value) => {
        setHero(prev => ({
            ...prev,
            photoFrame: { ...prev.photoFrame, [field]: parseFloat(value) }
        }));
    };

    return (
        <section id="home" className="min-h-screen flex items-center justify-center pt-20">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
                {/* Text Content */}
                <div className="flex-1 text-center md:text-left animate-fade-in-up">
                    <div className="inline-block px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
                        Welcome to my portfolio
                    </div>

                    <h1
                        className={`text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight outline-none transition-all ${isEditMode ? 'ring-2 ring-purple-500/50 rounded-lg p-2 bg-white/5 shadow-[0_0_20px_rgba(168,85,247,0.1)]' : ''
                            }`}
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                            const html = e.target.innerHTML;
                            const textSpanMatch = html.match(/<span[^>]*>(.*?)<\/span>/i);
                            const name = textSpanMatch ? textSpanMatch[1] : e.target.innerText.replace("Hi, I'm ", "").trim();
                            updateHero('name', name);
                        }}
                    >
                        Hi, I'm <span className="gradient-text pointer-events-none">{hero.name}</span>
                    </h1>

                    <div className="text-xl md:text-3xl font-semibold text-zinc-300 mb-8 h-8">
                        <span className="text-purple-400">{displayText}</span>
                        <span className="inline-block w-1 h-8 bg-purple-500 ml-1 animate-pulse">|</span>
                    </div>

                    <p
                        className={`text-lg text-zinc-400 mb-10 max-w-xl mx-auto md:mx-0 leading-relaxed outline-none transition-all ${isEditMode ? 'ring-2 ring-purple-500/50 rounded-lg p-2 bg-white/5 shadow-[0_0_20px_rgba(168,85,247,0.1)]' : ''
                            }`}
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                        onBlur={(e) => updateHero('description', e.target.innerText)}
                    >
                        {hero.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <a href="#projects" className="btn-glow text-center">
                            View My Work
                        </a>
                        <a href="#contact" className="btn-outline text-center">
                            Get In Touch
                        </a>
                    </div>

                    {/* Editor Hint */}
                    {isEditMode && (
                        <div className="mt-8 flex items-center gap-2 text-xs text-purple-400 animate-pulse font-mono">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>LIVE EDIT MODE ACTIVE — Click text to modify</span>
                        </div>
                    )}
                </div>

                {/* Profile Image with Glow */}
                <div className="flex-1 flex flex-col justify-center items-center animate-float relative z-10 w-full">
                    <div className="profile-glow w-64 h-64 md:w-80 md:h-80 rounded-full p-1 shadow-2xl relative mb-6">
                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#0a0a0f] relative">
                            <img
                                src={profileImage}
                                alt="Rishika Singh"
                                className="w-full h-full object-cover transition-transform"
                                style={{
                                    transform: `scale(${hero.photoFrame?.scale || 1})`,
                                    objectPosition: `${hero.photoFrame?.x || 50}% ${hero.photoFrame?.y || 50}%`
                                }}
                                onError={(e) => {
                                    e.currentTarget.src = "https://ui-avatars.com/api/?name=Rishika+Singh&background=8b5cf6&color=fff&size=512";
                                }}
                            />
                        </div>
                    </div>

                    {/* Frame Adjustment Controls (Edit Mode Only) */}
                    {isEditMode && (
                        <div className="w-full max-w-xs bg-zinc-900/90 backdrop-blur-md rounded-xl border border-white/10 p-4 shadow-2xl relative z-20">
                            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                                Adjust Photo Frame
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-zinc-500">Zoom</span>
                                        <span className="text-purple-400 font-mono">{hero.photoFrame?.scale?.toFixed(2)}x</span>
                                    </div>
                                    <input
                                        type="range" min="0.5" max="3" step="0.05"
                                        value={hero.photoFrame?.scale || 1}
                                        onChange={(e) => updatePhotoFrame('scale', e.target.value)}
                                        className="w-full accent-purple-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-zinc-500">Pan X</span>
                                            <span className="text-purple-400 font-mono">{hero.photoFrame?.x || 50}%</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="100" step="1"
                                            value={hero.photoFrame?.x || 50}
                                            onChange={(e) => updatePhotoFrame('x', e.target.value)}
                                            className="w-full accent-purple-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-zinc-500">Pan Y</span>
                                            <span className="text-purple-400 font-mono">{hero.photoFrame?.y || 50}%</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="100" step="1"
                                            value={hero.photoFrame?.y || 50}
                                            onChange={(e) => updatePhotoFrame('y', e.target.value)}
                                            className="w-full accent-purple-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

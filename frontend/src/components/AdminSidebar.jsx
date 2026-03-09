"use client";

import { useState } from "react";
import { useEditor } from "@/context/EditorContext";
import Link from "next/link";

import { API_BASE_URL } from "@/config/api";

const navLinks = [
    { label: "Home", href: "/#home", icon: "🏠" },
    { label: "About", href: "/#about", icon: "👤" },
    { label: "Skills", href: "/#skills", icon: "⚡" },
    { label: "Projects", href: "/#projects", icon: "🚀" },
    { label: "Journey", href: "/#journey", icon: "🗺️" },
    { label: "Experience", href: "/#experience", icon: "🏆" },
    { label: "Leadership", href: "/#leadership", icon: "🤝" },
    { label: "Achievements", href: "/#achievements", icon: "🌟" },
    { label: "Contact", href: "/#contact", icon: "📧" },
];

export default function AdminSidebar() {
    const { isEditMode, toggleEditMode, isSidebarOpen, toggleSidebar, setSidebarOpen, saveAll } = useEditor();
    const [uploading, setUploading] = useState(false);

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${API_BASE_URL}/upload-profile`, {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                alert("Profile photo updated! Refreshing page... 🔄");
                window.location.reload();
            } else {
                alert("Failed to upload profile photo.");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error connecting to upload service.");
        } finally {
            setUploading(false);
            setSidebarOpen(false);
        }
    };

    const handleSave = async () => {
        setUploading(true);
        try {
            // Trigger global save event
            saveAll();
            setSidebarOpen(false);
            alert("Changes persisted successfully! ✨");
        } catch (error) {
            console.error("Save error:", error);
            alert("Failed to persist changes.");
        } finally {
            setUploading(false);
            toggleEditMode();
        }
    };

    return (
        <>
            {/* Status indicator (only visible when editing) */}
            {isEditMode && !isSidebarOpen && (
                <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[60] px-2 py-1 rounded bg-green-500 text-[8px] font-bold text-black animate-pulse shadow-[0_0_20px_rgba(34,197,94,0.4)] tracking-tighter">
                    EDITING
                </div>
            )}

            {/* Slide-over Menu */}
            <div
                className={`fixed top-0 right-0 h-full w-84 z-[55] bg-zinc-950/95 backdrop-blur-2xl border-l border-white/5 transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) shadow-[-20px_0_60px_rgba(0,0,0,0.8)] flex flex-col ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="p-8 pt-24 h-full flex flex-col">
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-3 select-none pointer-events-none">
                                <img
                                    src="/logo-dark.png"
                                    alt="Logo"
                                    className="h-10 w-auto mix-blend-screen brightness-150"
                                />
                                <div>
                                    <h1 className="text-xl font-black text-white tracking-tighter leading-none opacity-0 h-0 w-0">PORTFOLIO</h1>
                                    <p className="text-[10px] text-purple-400 font-bold tracking-[0.2em] mt-1">CONTROL CENTER</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-12 custom-scrollbar">
                        {/* Navigation Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Navigation</p>
                                <button onClick={() => setSidebarOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all group"
                                    >
                                        <span className="text-lg opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all">{link.icon}</span>
                                        <span className="flex-1 text-sm font-semibold text-zinc-400 group-hover:text-white transition-colors">{link.label}</span>
                                        <svg className="w-4 h-4 text-zinc-800 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* CMS Controls */}
                        <div className="space-y-6">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">Management Toolkit</p>

                            <div className="space-y-4">
                                <label className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer ${isEditMode ? 'bg-purple-600/10 border border-purple-500/30' : 'bg-white/5 border border-white/5 hover:border-white/10'}`}>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-zinc-200">Live Editor</span>
                                        <span className="text-[10px] text-zinc-500">Toggle on-page modification</span>
                                    </div>
                                    <button
                                        onClick={toggleEditMode}
                                        className={`w-12 h-6 rounded-full transition-all relative ring-2 ring-white/5 ${isEditMode ? 'bg-purple-600' : 'bg-zinc-800'}`}
                                    >
                                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${isEditMode ? 'translate-x-6' : ''}`} />
                                    </button>
                                </label>

                                <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${uploading ? 'bg-purple-600/20 border-purple-500/50 scale-95' : 'bg-transparent border-zinc-800 hover:bg-white/5 hover:border-purple-500/30'
                                    }`}>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        disabled={uploading}
                                    />
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shadow-inner">
                                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-zinc-200">Replace Profile</span>
                                        <span className="text-[10px] text-zinc-500 font-mono uppercase">{uploading ? "Uploading..." : "Click to select"}</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Quick Save Action */}
                    <div className="mt-auto pt-8 border-t border-white/5">
                        {isEditMode ? (
                            <button
                                onClick={handleSave}
                                disabled={uploading}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-sm shadow-2xl shadow-purple-900/40 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {uploading ? "SAVING..." : "COMMIT CHANGES"}
                            </button>
                        ) : (
                            <div className="py-4 text-center">
                                <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest select-none">Revision: V2.5.8-STABLE</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Overlay backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 transition-opacity animate-in fade-in duration-500"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </>
    );
}

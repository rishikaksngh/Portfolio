"use client";

import { useState, useEffect } from "react";
import { useEditor } from "@/context/EditorContext";
import { contactInfoData } from "@/data/contact";

export default function ContactForm() {
    const { isEditMode } = useEditor();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    // Editable Contact State
    const [contactInfo, setContactInfo] = useState(contactInfoData);

    useEffect(() => {
        const handleGlobalSave = async () => {
            if (!isEditMode) return;

            const content = `export const contactInfoData = ${JSON.stringify(contactInfo, null, 4)};\n`;

            try {
                await fetch("http://localhost:5001/save-content", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        filename: "data/contact.js",
                        content: content
                    }),
                });
            } catch (error) {
                console.error("Failed to save contact info:", error);
            }
        };

        window.addEventListener("portfolio-save-all", handleGlobalSave);
        return () => window.removeEventListener("portfolio-save-all", handleGlobalSave);
    }, [contactInfo, isEditMode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        if (isEditMode) return; // Prevent submission in edit mode
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const res = await fetch("http://localhost:5001/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (res.ok) {
                setStatus({ type: "success", message: data.message });
                setFormData({ name: "", email: "", message: "" });
            } else {
                setStatus({ type: "error", message: data.error || "Something went wrong." });
            }
        } catch {
            setStatus({ type: "error", message: "Could not connect to the server." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="max-w-6xl mx-auto py-20 px-4">
            <div className="text-center mb-12">
                <h2 className="section-title">
                    <span
                        className={`outline-none ${isEditMode ? 'ring-2 ring-purple-500/50 rounded-lg p-1 bg-white/5' : ''}`}
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                    >
                        Get In
                    </span> <span className="gradient-text">Touch</span>
                </h2>
                <p
                    className={`section-subtitle outline-none ${isEditMode ? 'ring-2 ring-purple-500/50 rounded-lg p-1 bg-white/5 mt-4' : ''}`}
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                >
                    Have a question or want to collaborate? Reach out!
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Contact Info */}
                <div className="space-y-6">
                    <div className="glass-card p-6 relative group">
                        <h3
                            className={`text-lg font-semibold text-white mb-4 outline-none ${isEditMode ? 'ring-2 ring-purple-500/30 rounded px-2' : ''}`}
                            contentEditable={isEditMode}
                            suppressContentEditableWarning
                        >
                            Contact Info
                        </h3>
                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <a
                                    href={`mailto:${contactInfo.email}`}
                                    onClick={(e) => isEditMode && e.preventDefault()}
                                    className={`flex items-center gap-3 text-zinc-400 hover:text-purple-400 transition-colors group/link ${isEditMode ? 'cursor-text' : ''}`}
                                >
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span
                                        className={`text-sm outline-none ${isEditMode ? 'ring-1 ring-purple-500/30 px-1 rounded bg-white/5 min-w-[100px]' : ''}`}
                                        contentEditable={isEditMode}
                                        suppressContentEditableWarning
                                        onBlur={(e) => setContactInfo({ ...contactInfo, email: e.target.innerText })}
                                    >
                                        {contactInfo.email}
                                    </span>
                                </a>
                                {isEditMode && <span className="text-[10px] text-zinc-600 ml-8 uppercase font-bold tracking-widest">Email Address</span>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className={`flex items-center gap-3 text-zinc-400 hover:text-purple-400 transition-colors ${isEditMode ? 'cursor-text' : ''}`}>
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span
                                        className={`text-sm outline-none ${isEditMode ? 'ring-1 ring-purple-500/30 px-1 rounded bg-white/5 min-w-[100px]' : ''}`}
                                        contentEditable={isEditMode}
                                        suppressContentEditableWarning
                                        onBlur={(e) => setContactInfo({ ...contactInfo, phone: e.target.innerText })}
                                    >
                                        {contactInfo.phone}
                                    </span>
                                </div>
                                {isEditMode && <span className="text-[10px] text-zinc-600 ml-8 uppercase font-bold tracking-widest">Phone Number</span>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <a
                                    href={contactInfo.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => isEditMode && e.preventDefault()}
                                    className={`flex items-center gap-3 text-zinc-400 hover:text-purple-400 transition-colors ${isEditMode ? 'cursor-text' : ''}`}
                                >
                                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                    <span
                                        className={`text-sm outline-none ${isEditMode ? 'ring-1 ring-purple-500/30 px-1 rounded bg-white/5 min-w-[100px]' : ''}`}
                                        contentEditable={isEditMode}
                                        suppressContentEditableWarning
                                        onBlur={(e) => setContactInfo({ ...contactInfo, github: e.target.innerText })}
                                    >
                                        GitHub
                                    </span>
                                </a>
                                {isEditMode && <span className="text-[10px] text-zinc-600 ml-8 uppercase font-bold tracking-widest leading-tight">GitHub URL: <span className="text-zinc-500 break-all">{contactInfo.github}</span></span>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <a
                                    href={contactInfo.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => isEditMode && e.preventDefault()}
                                    className={`flex items-center gap-3 text-zinc-400 hover:text-purple-400 transition-colors ${isEditMode ? 'cursor-text' : ''}`}
                                >
                                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                    <span
                                        className={`text-sm outline-none ${isEditMode ? 'ring-1 ring-purple-500/30 px-1 rounded bg-white/5 min-w-[100px]' : ''}`}
                                        contentEditable={isEditMode}
                                        suppressContentEditableWarning
                                        onBlur={(e) => setContactInfo({ ...contactInfo, linkedin: e.target.innerText })}
                                    >
                                        LinkedIn
                                    </span>
                                </a>
                                {isEditMode && <span className="text-[10px] text-zinc-600 ml-8 uppercase font-bold tracking-widest leading-tight">LinkedIn URL: <span className="text-zinc-500 break-all">{contactInfo.linkedin}</span></span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5 relative group">
                    {isEditMode && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex items-center justify-center p-8 text-center rounded-2xl border border-purple-500/30">
                            <span className="text-xs font-black text-purple-400 uppercase tracking-[0.3em] leading-relaxed">
                                Form disabled while in Live Edit Mode
                            </span>
                        </div>
                    )}
                    <div>
                        <label htmlFor="name" className="block text-sm text-zinc-400 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg bg-[#0a0a0f] border border-purple-500/20 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                            placeholder="Your name"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm text-zinc-400 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg bg-[#0a0a0f] border border-purple-500/20 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                            placeholder="your@email.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm text-zinc-400 mb-2">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg bg-[#0a0a0f] border border-purple-500/20 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                            placeholder="Your message..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || isEditMode}
                        className="w-full btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Sending...
                            </span>
                        ) : (
                            "Send Message"
                        )}
                    </button>

                    {status && (
                        <div
                            className={`p-3 rounded-lg text-sm text-center ${status.type === "success"
                                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                                }`}
                        >
                            {status.message}
                        </div>
                    )}
                </form>
            </div>
        </section>
    );
}

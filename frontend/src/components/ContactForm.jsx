"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useEditor } from "@/context/EditorContext";
import { contactInfoData } from "@/data/contact";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

export default function ContactForm() {
    const { isEditMode } = useEditor();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const statusTimeoutRef = useRef(null);

    // Auto-dismiss success/error notification after 8 seconds
    useEffect(() => {
        if (status) {
            if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
            statusTimeoutRef.current = setTimeout(() => setStatus(null), 8000);
        }
        return () => {
            if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
        };
    }, [status]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = useCallback(async (e) => {
        if (isEditMode) return;
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        // Client-side validation
        const { name, email, subject, message } = formData;
        if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
            setStatus({ type: "error", message: "Please fill in all required fields." });
            setLoading(false);
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.trim())) {
            setStatus({ type: "error", message: "Please enter a valid email address." });
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    subject: subject.trim(),
                    message: message.trim(),
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                setStatus({
                    type: "success",
                    message: "Message sent successfully. I will get back to you soon.",
                });
                setFormData({ name: "", email: "", subject: "", message: "" });
            } else {
                setStatus({
                    type: "error",
                    message: data?.error || "Failed to send message. Please try again later.",
                });
            }
        } catch (error) {
            setStatus({
                type: "error",
                message: "Connection error. Please check your network.",
            });
        } finally {
            setLoading(false);
        }
    }, [isEditMode, formData]);

    return (
        <section id="contact" className="py-24 bg-zinc-50 relative overflow-hidden">
            {/* Soft decorative background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">
                        {contactInfoData.title}
                    </h2>
                    <p className="text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
                        {contactInfoData.subtitle}
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-12 items-start">
                    {/* Contact Form Card */}
                    <div className="lg:col-span-3 bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white/50 p-8 md:p-10 transform hover:scale-[1.005] transition-all duration-500">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 ml-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your name"
                                        className="w-full px-5 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none text-zinc-900 placeholder:text-zinc-400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 ml-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your email address"
                                        className="w-full px-5 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none text-zinc-900 placeholder:text-zinc-400"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-zinc-700 ml-1">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    placeholder="Collaboration / Opportunity / Question"
                                    className="w-full px-5 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none text-zinc-900 placeholder:text-zinc-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-zinc-700 ml-1">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    placeholder="Write your message here"
                                    className="w-full px-5 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none text-zinc-900 placeholder:text-zinc-400 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-3 ${loading ? 'bg-zinc-400' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-purple-500/25 hover:scale-[1.02]'}`}
                            >
                                {loading && (
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {loading ? "Sending Message..." : "Send Message"}
                            </button>

                            {status && (
                                <div className={`mt-6 p-4 rounded-2xl text-center font-medium animate-in fade-in slide-in-from-top-2 duration-500 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                    {status.message}
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Direct Contact Side Cards */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white/50 p-8 md:p-10">
                            <h3 className="text-2xl font-bold text-zinc-900 mb-6">Direct Contact</h3>

                            <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
                                {contactInfoData.note}
                            </p>

                            <div className="space-y-6">
                                {/* Email Row */}
                                <a
                                    href={`mailto:${contactInfoData.email}`}
                                    className="flex items-center gap-5 group p-4 -m-4 rounded-2xl transition-all duration-300 hover:bg-zinc-50"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">Email Me</p>
                                        <p className="text-zinc-900 font-semibold group-hover:text-purple-600 transition-colors">{contactInfoData.email}</p>
                                    </div>
                                </a>

                                {/* Phone Row */}
                                <div className="flex items-center gap-5 group p-4 -m-4 rounded-2xl transition-all duration-300">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">Call Me</p>
                                        <p className="text-zinc-900 font-semibold">{contactInfoData.phone}</p>
                                    </div>
                                </div>

                                {/* LinkedIn Row */}
                                <a
                                    href={contactInfoData.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-5 group p-4 -m-4 rounded-2xl transition-all duration-300 hover:bg-zinc-50"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">LinkedIn</p>
                                        <p className="text-zinc-900 font-semibold group-hover:text-indigo-600 transition-colors">Rishika Singh</p>
                                    </div>
                                </a>

                                {/* GitHub Row */}
                                <a
                                    href={contactInfoData.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-5 group p-4 -m-4 rounded-2xl transition-all duration-300 hover:bg-zinc-50"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">GitHub</p>
                                        <p className="text-zinc-900 font-semibold group-hover:text-black transition-colors">@rishikaksngh</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Visual element to balance the height */}
                        <div className="hidden lg:block bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-[32px] p-8 border border-zinc-100">
                            <div className="flex flex-col h-full justify-center text-center">
                                <p className="text-sm text-zinc-400 italic font-medium">
                                    "Striving to build intelligent solutions that bridge the gap between human needs and AI potential."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-in {
                    animation: fade-in 0.6s ease-out forwards;
                }
            `}</style>
        </section>
    );
}

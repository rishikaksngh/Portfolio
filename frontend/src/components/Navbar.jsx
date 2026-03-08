"use client";

import { useState, useEffect } from "react";
import { useEditor } from "@/context/EditorContext";

const navLinks = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Journey", href: "#journey" },
    { label: "Experience", href: "#experience" },
    { label: "Leadership", href: "#leadership" },
    { label: "Achievements", href: "#achievements" },
    { label: "Contact", href: "#contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { toggleSidebar, isSidebarOpen } = useEditor();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center group cursor-default">
                    <img
                        src="/logo-dark.png"
                        alt="RS Logo"
                        className="h-10 w-auto mix-blend-screen brightness-150 transition-transform"
                    />
                </div>

                {/* Right Navigation & Control Toggle */}
                <div className="flex items-center gap-6 lg:gap-8">
                    {/* Desktop Nav Links */}
                    <div className="hidden xl:flex items-center gap-6 lg:gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-200 relative group"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 group-hover:w-full transition-all duration-300" />
                            </a>
                        ))}
                    </div>

                    {/* Sidebar / Control Center Toggle (3-Line UI) */}
                    <button
                        onClick={() => {
                            const isAuth = sessionStorage.getItem("isAdminAuthenticated");
                            if (isAuth === "true") {
                                toggleSidebar();
                            } else {
                                const pwd = window.prompt("Enter Admin Password to access Control Center:");
                                if (pwd === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "001905rishi")) {
                                    sessionStorage.setItem("isAdminAuthenticated", "true");
                                    toggleSidebar();
                                } else if (pwd !== null) {
                                    alert("Incorrect password!");
                                }
                            }
                        }}
                        className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex flex-col items-center justify-center gap-1 hover:scale-105 hover:border-purple-500/50 transition-all duration-300 group overflow-hidden relative"
                        aria-label="Toggle Control Center"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className={`w-5 h-0.5 bg-purple-400 transition-all transform ${isSidebarOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                        <div className={`w-5 h-0.5 bg-purple-400 transition-all ${isSidebarOpen ? 'opacity-0' : 'opacity-100'}`} />
                        <div className={`w-5 h-0.5 bg-purple-400 transition-all transform ${isSidebarOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                    </button>
                </div>
            </div>
        </nav>
    );
}

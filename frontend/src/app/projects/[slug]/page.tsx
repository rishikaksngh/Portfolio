"use client";

import { use } from "react";
import Link from "next/link";
import { projectsData } from "@/data/projects";
import { notFound } from "next/navigation";

export default function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const project = projectsData.projects.find((p) => p.slug === slug);

    if (!project) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-purple-100 pb-20">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link
                        href="/#projects"
                        className="flex items-center gap-3 text-sm font-medium text-zinc-500 hover:text-purple-600 transition-colors group"
                    >
                        <img
                            src="/logo-light.png"
                            alt="Logo"
                            className="w-10 h-10 object-contain mix-blend-multiply"
                        />
                        <div className="flex items-center gap-2">
                            <svg
                                className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Projects
                        </div>
                    </Link>
                    <span className="text-zinc-300">/</span>
                    <span className="text-sm font-semibold text-zinc-900">{project.title}</span>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 pt-16">
                {/* Hero Section */}
                <header className="mb-20 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-zinc-50 border border-zinc-100 text-4xl mb-8 shadow-sm">
                        {project.icon}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-4">
                        {project.title}
                    </h1>
                    <p className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
                        {project.subtitle}
                    </p>
                </header>

                <div className="space-y-12">
                    {/* Problem & Solution Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <section className="p-8 rounded-3xl bg-zinc-50 border border-zinc-100">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-4">Problem</h2>
                            <p className="text-zinc-700 leading-relaxed font-medium">
                                {project.problem}
                            </p>
                        </section>
                        <section className="p-8 rounded-3xl bg-purple-600 text-white shadow-xl shadow-purple-200">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-purple-200 mb-4">Solution</h2>
                            <p className="leading-relaxed font-medium">
                                {project.solution}
                            </p>
                        </section>
                    </div>

                    {/* Key Features */}
                    <section className="p-8 rounded-3xl border border-zinc-100 bg-white">
                        <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-purple-600 rounded-full" />
                            Key Features
                        </h2>
                        <ul className="grid sm:grid-cols-2 gap-4">
                            {project.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-700 text-sm font-medium">
                                    <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Tech & Concepts */}
                    <section className="p-8 rounded-3xl border border-zinc-100 bg-white">
                        <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-zinc-900 rounded-full" />
                            Technologies / Concepts Used
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {project.techConcepts.map((concept, i) => (
                                <span key={i} className="px-4 py-2 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-700 text-sm font-semibold">
                                    {concept}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* What I Learned */}
                    <section className="p-8 rounded-3xl border border-zinc-100 bg-zinc-50">
                        <h2 className="text-lg font-bold text-zinc-900 mb-6">What I Learned</h2>
                        <div className="space-y-4">
                            {project.learnings.map((learning, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white border border-zinc-100 shadow-sm">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                                        0{i + 1}
                                    </span>
                                    <p className="text-zinc-600 text-sm leading-relaxed self-center">
                                        {learning}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Footer CTA */}
                <footer className="mt-20 pt-12 border-t border-zinc-100 text-center">
                    <Link
                        href="/#projects"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition-all shadow-lg hover:shadow-zinc-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Projects
                    </Link>
                </footer>
            </main>
        </div>
    );
}

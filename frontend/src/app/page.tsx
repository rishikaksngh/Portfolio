"use client";

import Hero from "@/components/Hero";
import About from "@/components/About";
import Timeline from "@/components/Timeline";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Leadership from "@/components/Leadership";
import Achievements from "@/components/Achievements";
import ContactForm from "@/components/ContactForm";

export default function Home() {
    return (
        <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Timeline />
            <Experience />
            <Leadership />
            <Achievements />
            <ContactForm />
        </main>
    );
}

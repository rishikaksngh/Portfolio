"use client";

import { createContext, useContext, useState, useEffect } from "react";

const EditorContext = createContext();

export function EditorProvider({ children }) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const toggleEditMode = () => setIsEditMode(!isEditMode);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const setSidebarOpen = (val) => setIsSidebarOpen(val);

    const saveAll = () => {
        // Dispatch a custom event that components can listen to
        const event = new CustomEvent("portfolio-save-all");
        window.dispatchEvent(event);
        setHasUnsavedChanges(false);
    };

    return (
        <EditorContext.Provider value={{
            isEditMode,
            toggleEditMode,
            isSidebarOpen,
            toggleSidebar,
            setSidebarOpen,
            hasUnsavedChanges,
            setHasUnsavedChanges,
            saveAll
        }}>
            {children}
        </EditorContext.Provider>
    );
}

export const useEditor = () => useContext(EditorContext);

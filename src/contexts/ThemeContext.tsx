import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Theme = "light" | "dark" | "professional";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  moduleTheme?: Theme;
  setModuleTheme: (theme: Theme | undefined) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("ceigall-theme") as Theme;
    return stored || "light";
  });
  
  const [moduleTheme, setModuleTheme] = useState<Theme | undefined>(undefined);

  useEffect(() => {
    const root = document.documentElement;
    const activeTheme = moduleTheme || theme;
    
    // Remove all theme classes
    root.classList.remove("light", "dark", "professional");
    
    // Add active theme class
    root.classList.add(activeTheme);
    
    // Store preference
    localStorage.setItem("ceigall-theme", theme);
  }, [theme, moduleTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, moduleTheme, setModuleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

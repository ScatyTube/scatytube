import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "classic" | "novatube";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("scatytube-theme");
    return (saved as Theme) || "classic";
  });

  useEffect(() => {
    localStorage.setItem("scatytube-theme", theme);
    
    // Apply theme class to document
    document.documentElement.classList.remove("theme-classic", "theme-novatube");
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

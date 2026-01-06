import { useEffect } from "react";
import { useTheme, type Theme } from "@/contexts/ThemeContext";

/**
 * Hook for fullscreen modules to control their own theme
 * Automatically resets to global theme when component unmounts
 * 
 * @param moduleTheme - The theme to use for this module (optional)
 * 
 * @example
 * // In a fullscreen module component
 * function MyModule() {
 *   useModuleTheme("dark"); // Forces dark theme for this module
 *   return <div>Module content</div>;
 * }
 */
export function useModuleTheme(moduleTheme?: Theme) {
  const { setModuleTheme } = useTheme();

  useEffect(() => {
    if (moduleTheme) {
      setModuleTheme(moduleTheme);
    }

    // Reset to global theme when component unmounts
    return () => {
      setModuleTheme(undefined);
    };
  }, [moduleTheme, setModuleTheme]);
}

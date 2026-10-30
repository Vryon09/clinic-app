import React, { createContext, useContext, useEffect, useState } from "react";

export type TextSize = "small" | "medium" | "large" | "extra-large";

export interface TextSizeOption {
  value: TextSize;
  label: string;
  percentage: string;
  pixelEquivalent: string;
  description: string;
}

export const TEXT_SIZE_OPTIONS: TextSizeOption[] = [
  {
    value: "small",
    label: "Small",
    percentage: "87.5%",
    pixelEquivalent: "14px",
    description: "Compact text density to display more information on screen",
  },
  {
    value: "medium",
    label: "Medium",
    percentage: "100%",
    pixelEquivalent: "16px",
    description: "Standard balanced text size for general use (Default)",
  },
  {
    value: "large",
    label: "Large",
    percentage: "112.5%",
    pixelEquivalent: "18px",
    description: "Larger text for comfortable reading and reduced eye strain",
  },
  {
    value: "extra-large",
    label: "Extra Large",
    percentage: "125%",
    pixelEquivalent: "20px",
    description: "Maximum text size for optimal visibility and accessibility",
  },
];

export const TEXT_SIZE_PERCENTAGES: Record<TextSize, string> = {
  small: "87.5%",
  medium: "100%",
  large: "112.5%",
  "extra-large": "125%",
};

export interface TextSizeContextType {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  resetTextSize: () => void;
  options: TextSizeOption[];
}

const TextSizeContext = createContext<TextSizeContextType | undefined>(undefined);

const STORAGE_KEY = "clinicsync-text-size";

export function TextSizeProvider({ children }: { children: React.ReactNode }) {
  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (
        saved === "small" ||
        saved === "medium" ||
        saved === "large" ||
        saved === "extra-large"
      ) {
        return saved;
      }
    } catch {
      // LocalStorage error fallback
    }
    return "medium";
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, textSize);
    } catch {
      // ignore storage error
    }

    const root = document.documentElement;
    root.setAttribute("data-text-size", textSize);
    root.style.fontSize = TEXT_SIZE_PERCENTAGES[textSize];
  }, [textSize]);

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
  };

  const resetTextSize = () => {
    setTextSizeState("medium");
  };

  return (
    <TextSizeContext.Provider
      value={{
        textSize,
        setTextSize,
        resetTextSize,
        options: TEXT_SIZE_OPTIONS,
      }}
    >
      {children}
    </TextSizeContext.Provider>
  );
}

export function useTextSize(): TextSizeContextType {
  const context = useContext(TextSizeContext);
  if (!context) {
    throw new Error("useTextSize must be used within a TextSizeProvider");
  }
  return context;
}

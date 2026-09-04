"use client"

import * as React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface UserPreferences {
  theme: "light" | "dark" | "system"
  primaryColor: string
  currency: string
  dateFormat: string
}

const defaultSettings: UserPreferences = {
  theme: "system",
  primaryColor: "#6366F1",
  currency: "USD",
  dateFormat: "MM/DD/YYYY"
}

type ColorContextType = {
  primaryColor: string
  setPrimaryColor: (color: string) => void
}

const ColorContext = createContext<ColorContextType | undefined>(undefined)

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const [primaryColor, setPrimaryColorState] = useState(defaultSettings.primaryColor)

  useEffect(() => {
    const saved = localStorage.getItem("inkviz_primary_color")
    if (saved && saved !== "#000000") {
      setPrimaryColorState(saved)
    } else {
      setPrimaryColorState("#6366F1")
      localStorage.setItem("inkviz_primary_color", "#6366F1")
    }
  }, [])

  const setPrimaryColor = (color: string) => {
    setPrimaryColorState(color)
    localStorage.setItem("inkviz_primary_color", color)
  }

  useEffect(() => {
    const activeColor = primaryColor === "#000000" || !primaryColor ? "#6366F1" : primaryColor
    const hex = activeColor.replace("#", "")
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)
      const yiq = (r * 299 + g * 587 + b * 114) / 1000

      document.documentElement.style.setProperty("--primary", activeColor)
      document.documentElement.style.setProperty(
        "--primary-foreground",
        yiq >= 140 ? "#0f172a" : "#ffffff"
      )
    }
  }, [primaryColor])

  return (
    <ColorContext.Provider value={{ primaryColor, setPrimaryColor }}>
      {children}
    </ColorContext.Provider>
  )
}

export function useColor() {
  const context = useContext(ColorContext)
  if (!context) {
    throw new Error("useColor must be used within a ColorProvider")
  }
  return context
}

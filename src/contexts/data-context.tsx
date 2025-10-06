"use client"

import { createContext, useContext, useEffect, type ReactNode } from "react"
import { DataStore } from "@/lib/data-store"

interface DataContextType {
  initializeData: () => void
  clearData: () => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Initialize default data on app start
    DataStore.initializeDefaultData()
  }, [])

  const initializeData = () => {
    DataStore.initializeDefaultData()
  }

  const clearData = () => {
    DataStore.clearAllData()
    // Reinitialize with default data
    DataStore.initializeDefaultData()
  }

  return <DataContext.Provider value={{ initializeData, clearData }}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

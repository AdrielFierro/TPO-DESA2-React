"use client"

import { useState, useEffect, useCallback } from "react"
import { DataStore } from "@/lib/data-store"
import type { MenuItem } from "@/lib/types"

export function useMenuItems(type?: "plato" | "bebida" | "postre") {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMenuItems = useCallback(() => {
    try {
      setLoading(true)
      const items = type ? DataStore.getMenuItemsByType(type) : DataStore.getMenuItems()
      setMenuItems(items)
      setError(null)
    } catch (err) {
      setError("Error loading menu items")
      console.error("Error loading menu items:", err)
    } finally {
      setLoading(false)
    }
  }, [type])

  useEffect(() => {
    loadMenuItems()
  }, [loadMenuItems])

  const addMenuItem = useCallback(
    (item: MenuItem) => {
      try {
        DataStore.addMenuItem(item)
        loadMenuItems() // Refresh the list
        return true
      } catch (err) {
        setError("Error adding menu item")
        console.error("Error adding menu item:", err)
        return false
      }
    },
    [loadMenuItems],
  )

  const updateMenuItem = useCallback(
    (id: string, updates: Partial<MenuItem>) => {
      try {
        DataStore.updateMenuItem(id, updates)
        loadMenuItems() // Refresh the list
        return true
      } catch (err) {
        setError("Error updating menu item")
        console.error("Error updating menu item:", err)
        return false
      }
    },
    [loadMenuItems],
  )

  const deleteMenuItem = useCallback(
    (id: string) => {
      try {
        DataStore.deleteMenuItem(id)
        loadMenuItems() // Refresh the list
        return true
      } catch (err) {
        setError("Error deleting menu item")
        console.error("Error deleting menu item:", err)
        return false
      }
    },
    [loadMenuItems],
  )

  return {
    menuItems,
    loading,
    error,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    refresh: loadMenuItems,
  }
}

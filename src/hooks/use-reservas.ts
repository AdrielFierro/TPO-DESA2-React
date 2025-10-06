"use client"

import { useState, useEffect, useCallback } from "react"
import { DataStore } from "@/lib/data-store"
import type { Reserva } from "@/lib/types"

export function useReservas(userEmail?: string) {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadReservas = useCallback(() => {
    try {
      setLoading(true)
      const allReservas = userEmail ? DataStore.getReservasByUser(userEmail) : DataStore.getReservas()
      setReservas(allReservas)
      setError(null)
    } catch (err) {
      setError("Error loading reservations")
      console.error("Error loading reservas:", err)
    } finally {
      setLoading(false)
    }
  }, [userEmail])

  useEffect(() => {
    loadReservas()
  }, [loadReservas])

  const addReserva = useCallback(
    (reserva: Reserva) => {
      try {
        DataStore.addReserva(reserva)
        loadReservas() // Refresh the list
        return true
      } catch (err) {
        setError("Error adding reservation")
        console.error("Error adding reserva:", err)
        return false
      }
    },
    [loadReservas],
  )

  const updateReserva = useCallback(
    (id: string, updates: Partial<Reserva>) => {
      try {
        DataStore.updateReserva(id, updates)
        loadReservas() // Refresh the list
        return true
      } catch (err) {
        setError("Error updating reservation")
        console.error("Error updating reserva:", err)
        return false
      }
    },
    [loadReservas],
  )

  const deleteReserva = useCallback(
    (id: string) => {
      try {
        DataStore.deleteReserva(id)
        loadReservas() // Refresh the list
        return true
      } catch (err) {
        setError("Error deleting reservation")
        console.error("Error deleting reserva:", err)
        return false
      }
    },
    [loadReservas],
  )

  const getReservaById = useCallback((id: string) => {
    return DataStore.getReservaById(id)
  }, [])

  return {
    reservas,
    loading,
    error,
    addReserva,
    updateReserva,
    deleteReserva,
    getReservaById,
    refresh: loadReservas,
  }
}

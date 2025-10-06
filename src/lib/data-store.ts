import type { Reserva, MenuItem, MenuDelDia } from "./types"
import { MENU_ITEMS } from "./types"

// Storage keys
const STORAGE_KEYS = {
  RESERVAS: "restaurant-reservas",
  MENU_ITEMS: "restaurant-menu-items",
  MENU_SEMANAL: "restaurant-menu-semanal",
  STATS: "restaurant-stats",
} as const

// Data persistence utilities
export class DataStore {
  private static getFromStorage<T>(key: string, defaultValue: T): T {
    if (typeof window === "undefined") return defaultValue

    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : defaultValue
    } catch (error) {
      console.error(`Error reading from storage key ${key}:`, error)
      return defaultValue
    }
  }

  private static saveToStorage<T>(key: string, data: T): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error(`Error saving to storage key ${key}:`, error)
    }
  }

  // Reservations management
  static getReservas(): Reserva[] {
    return this.getFromStorage(STORAGE_KEYS.RESERVAS, [])
  }

  static saveReservas(reservas: Reserva[]): void {
    this.saveToStorage(STORAGE_KEYS.RESERVAS, reservas)
  }

  static addReserva(reserva: Reserva): void {
    const reservas = this.getReservas()
    reservas.push(reserva)
    this.saveReservas(reservas)
  }

  static updateReserva(id: string, updates: Partial<Reserva>): void {
    const reservas = this.getReservas()
    const index = reservas.findIndex((r) => r.id === id)
    if (index !== -1) {
      reservas[index] = { ...reservas[index], ...updates }
      this.saveReservas(reservas)
    }
  }

  static deleteReserva(id: string): void {
    const reservas = this.getReservas()
    const filtered = reservas.filter((r) => r.id !== id)
    this.saveReservas(filtered)
  }

  static getReservaById(id: string): Reserva | null {
    const reservas = this.getReservas()
    return reservas.find((r) => r.id === id) || null
  }

  static getReservasByUser(email: string): Reserva[] {
    const reservas = this.getReservas()
    return reservas.filter((r) => r.comensalEmail === email)
  }

  // Menu items management
  static getMenuItems(): MenuItem[] {
    return this.getFromStorage(STORAGE_KEYS.MENU_ITEMS, [])
  }

  static saveMenuItems(items: MenuItem[]): void {
    this.saveToStorage(STORAGE_KEYS.MENU_ITEMS, items)
  }

  static addMenuItem(item: MenuItem): void {
    const items = this.getMenuItems()
    items.push(item)
    this.saveMenuItems(items)
  }

  static updateMenuItem(id: string, updates: Partial<MenuItem>): void {
    const items = this.getMenuItems()
    const index = items.findIndex((i) => i.id === id)
    if (index !== -1) {
      items[index] = { ...items[index], ...updates }
      this.saveMenuItems(items)
    }
  }

  static deleteMenuItem(id: string): void {
    const items = this.getMenuItems()
    const filtered = items.filter((i) => i.id !== id)
    this.saveMenuItems(filtered)
  }

  static getMenuItemsByType(type: "plato" | "bebida" | "postre"): MenuItem[] {
    const items = this.getMenuItems()
    return items.filter((i) => i.type === type && i.available)
  }

  // Weekly menu management
  static getMenuSemanal(): Record<string, MenuDelDia[]> {
    return this.getFromStorage(STORAGE_KEYS.MENU_SEMANAL, {})
  }

  static saveMenuSemanal(menu: Record<string, MenuDelDia[]>): void {
    this.saveToStorage(STORAGE_KEYS.MENU_SEMANAL, menu)
  }

  static getMenuForWeek(weekKey: string): MenuDelDia[] {
    const menuSemanal = this.getMenuSemanal()
    return menuSemanal[weekKey] || []
  }

  static saveMenuForWeek(weekKey: string, menu: MenuDelDia[]): void {
    const menuSemanal = this.getMenuSemanal()
    menuSemanal[weekKey] = menu
    this.saveMenuSemanal(menuSemanal)
  }

  // Statistics and analytics
  static getStats(): Record<string, any> {
    return this.getFromStorage(STORAGE_KEYS.STATS, {})
  }

  static updateStats(stats: Record<string, any>): void {
    const currentStats = this.getStats()
    const updatedStats = { ...currentStats, ...stats }
    this.saveToStorage(STORAGE_KEYS.STATS, updatedStats)
  }

  // Initialize with default data if empty
  static initializeDefaultData(): void {
    // Initialize menu items if empty
    const menuItems = this.getMenuItems()
    if (menuItems.length === 0) {
      this.saveMenuItems(MENU_ITEMS)
    }

    // Initialize some sample reservations if empty
    const reservas = this.getReservas()
    if (reservas.length === 0) {
      const sampleReservas: Reserva[] = [
        {
          id: "RES001",
          comensalEmail: "comensal@demo.com",
          sede: { id: "centro", name: "Sede Centro", address: "Calle Principal 123", capacity: 50 },
          turno: { id: "almuerzo", name: "Almuerzo", startTime: "12:00", endTime: "15:00" },
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Tomorrow
          menuDelDia: {
            id: "menu001",
            date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            turno: { id: "almuerzo", name: "Almuerzo", startTime: "12:00", endTime: "15:00" },
            plato: {
              id: "plato1",
              name: "Pollo a la Plancha",
              description: "Pechuga de pollo con vegetales",
              price: 15000,
              type: "plato",
              available: true,
            },
            bebida: {
              id: "bebida2",
              name: "Jugo Natural",
              description: "Jugo de frutas frescas",
              price: 4000,
              type: "bebida",
              available: true,
            },
            postre: {
              id: "postre1",
              name: "Flan Casero",
              description: "Flan tradicional con caramelo",
              price: 5000,
              type: "postre",
              available: true,
            },
            totalPrice: 24000,
          },
          status: "confirmada",
          createdAt: new Date().toISOString(),
          qrCode: "QR001",
        },
        {
          id: "RES002",
          comensalEmail: "comensal@demo.com",
          sede: { id: "norte", name: "Sede Norte", address: "Avenida Norte 456", capacity: 40 },
          turno: { id: "cena", name: "Cena", startTime: "19:00", endTime: "22:00" },
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 3 days from now
          menuDelDia: {
            id: "menu002",
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            turno: { id: "cena", name: "Cena", startTime: "19:00", endTime: "22:00" },
            plato: {
              id: "plato2",
              name: "Pescado al Horno",
              description: "Filete de pescado con papas",
              price: 18000,
              type: "plato",
              available: true,
            },
            bebida: {
              id: "bebida1",
              name: "Agua Natural",
              description: "Botella 500ml",
              price: 2000,
              type: "bebida",
              available: true,
            },
            postre: {
              id: "postre2",
              name: "Helado",
              description: "Dos bolas de helado",
              price: 4500,
              type: "postre",
              available: true,
            },
            totalPrice: 24500,
          },
          status: "pendiente",
          createdAt: new Date().toISOString(),
          qrCode: "QR002",
        },
      ]
      this.saveReservas(sampleReservas)
    }
  }

  // Clear all data (for testing/reset)
  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  }
}



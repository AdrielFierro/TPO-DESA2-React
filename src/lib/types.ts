export interface Sede {
  id: string
  name: string
  address: string
  capacity: number
}

export interface Turno {
  id: string
  name: string
  startTime: string
  endTime: string
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  type: "plato" | "bebida" | "postre"
  available: boolean
}

export interface MenuDelDia {
  id: string
  date: string
  turno: Turno
  plato: MenuItem
  bebida: MenuItem
  postre: MenuItem
  totalPrice: number
}

export interface Reserva {
  id: string
  comensalEmail: string
  sede: Sede
  turno: Turno
  date: string
  menuDelDia: MenuDelDia
  status: "pendiente" | "confirmada" | "pagada" | "completada" | "cancelada"
  createdAt: string
  qrCode?: string
}

// Mock data
export const SEDES: Sede[] = [
  {
    id: "centro",
    name: "Sede Centro",
    address: "Calle Principal 123",
    capacity: 50,
  },
  {
    id: "norte",
    name: "Sede Norte",
    address: "Avenida Norte 456",
    capacity: 40,
  },
]

export const TURNOS: Turno[] = [
  {
    id: "almuerzo",
    name: "Almuerzo",
    startTime: "12:00",
    endTime: "15:00",
  },
  {
    id: "cena",
    name: "Cena",
    startTime: "19:00",
    endTime: "22:00",
  },
]

export const MENU_ITEMS: MenuItem[] = [
  // Platos
  {
    id: "plato1",
    name: "Pollo a la Plancha",
    description: "Pechuga de pollo con vegetales",
    price: 15000,
    type: "plato",
    available: true,
  },
  {
    id: "plato2",
    name: "Pescado al Horno",
    description: "Filete de pescado con papas",
    price: 18000,
    type: "plato",
    available: true,
  },
  {
    id: "plato3",
    name: "Pasta Carbonara",
    description: "Pasta con salsa cremosa y tocino",
    price: 14000,
    type: "plato",
    available: true,
  },
  // Bebidas
  {
    id: "bebida1",
    name: "Agua Natural",
    description: "Botella 500ml",
    price: 2000,
    type: "bebida",
    available: true,
  },
  {
    id: "bebida2",
    name: "Jugo Natural",
    description: "Jugo de frutas frescas",
    price: 4000,
    type: "bebida",
    available: true,
  },
  {
    id: "bebida3",
    name: "Gaseosa",
    description: "Bebida gaseosa 350ml",
    price: 3000,
    type: "bebida",
    available: true,
  },
  // Postres
  {
    id: "postre1",
    name: "Flan Casero",
    description: "Flan tradicional con caramelo",
    price: 5000,
    type: "postre",
    available: true,
  },
  {
    id: "postre2",
    name: "Helado",
    description: "Dos bolas de helado",
    price: 4500,
    type: "postre",
    available: true,
  },
  {
    id: "postre3",
    name: "Torta del Dia",
    description: "Porcion de torta especial",
    price: 6000,
    type: "postre",
    available: true,
  },
]

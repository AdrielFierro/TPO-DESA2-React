export type UserRole = "comensal" | "cajero" | "chef"

export interface User {
  email: string
  role: UserRole
  name: string
}

// Mock users for demo
export const DEMO_USERS: Record<string, User> = {
  "comensal@demo.com": {
    email: "comensal@demo.com",
    role: "comensal",
    name: "Usuario Comensal",
  },
  "cajero@demo.com": {
    email: "cajero@demo.com",
    role: "cajero",
    name: "Cajero Demo",
  },
  "chef@chef.com": {
    email: "chef@chef.com",
    role: "chef",
    name: "Chef Demo",
  },
}

export function authenticateUser(email: string, password: string): User | null {
  // Simple demo authentication - in real app this would be secure
  if (password === "demo123" && DEMO_USERS[email]) {
    return DEMO_USERS[email]
  }
  return null
}

export function getWorkspaceRoute(role: UserRole): string {
  switch (role) {
    case "comensal":
      return "/comensal"
    case "cajero":
      return "/cajero"
    case "chef":
      return "/chef"
    default:
      return "/"
  }
}

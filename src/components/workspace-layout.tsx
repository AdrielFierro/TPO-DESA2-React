import type React from "react"
import { useMemo } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogOut, User, Home, ArrowLeft } from "lucide-react"
import { getWorkspaceRoute } from "@/lib/auth"

interface WorkspaceLayoutProps {
  children: React.ReactNode
  title: string
  allowedRole?: string
}

export function WorkspaceLayout({ children, title, allowedRole }: WorkspaceLayoutProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleGoHome = () => {
    if (user) {
      navigate(getWorkspaceRoute(user.role))
    }
  }

  const workspaceNames = useMemo(
    () => ({
      comensal: "Portal del Comensal",
      cajero: "Sistema de Cajero",
      chef: "Sistema del Chef",
    }),
    [],
  )

  const isWorkspaceHome = user ? location.pathname === getWorkspaceRoute(user.role) : false

  if (allowedRole && user?.role !== allowedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-destructive mb-2">Acceso denegado</h1>
            <p className="text-muted-foreground mb-4">
              No tienes permisos para acceder a esta seccion. Tu rol actual es <Badge variant="outline">{user?.role}</Badge>{" "}
              pero se requiere <Badge variant="outline">{allowedRole}</Badge>.
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={handleGoHome}>
              <Home className="h-4 w-4 mr-2" />
              Ir a mi workspace
            </Button>
            <Button onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesion
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isWorkspaceHome && (
              <Button variant="ghost" size="sm" onClick={handleGoHome}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Inicio
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-primary">{title}</h1>
              {user && (
                <p className="text-sm text-muted-foreground">
                  {workspaceNames[user.role as keyof typeof workspaceNames]}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span>{user?.name}</span>
              <Badge variant="secondary" className="text-xs">
                {user?.role}
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesion
            </Button>
          </div>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}

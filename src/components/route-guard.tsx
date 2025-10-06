import type React from "react"
import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { getWorkspaceRoute, type UserRole } from "@/lib/auth"

interface RouteGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole
  redirectTo?: string
}

export function RouteGuard({ children, requiredRole, redirectTo }: RouteGuardProps) {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isLoading) return

    if (!user && requiredRole) {
      navigate("/", { replace: true })
      return
    }

    if (user && requiredRole && user.role !== requiredRole) {
      const userWorkspace = getWorkspaceRoute(user.role)
      navigate(redirectTo || userWorkspace, { replace: true })
      return
    }

    if (user && location.pathname === "/") {
      navigate(getWorkspaceRoute(user.role), { replace: true })
    }
  }, [user, isLoading, requiredRole, navigate, location.pathname, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (!user && !requiredRole) {
    return <>{children}</>
  }

  if (user && (!requiredRole || user.role === requiredRole)) {
    return <>{children}</>
  }

  return null
}

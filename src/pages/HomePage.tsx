import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/login-form"
import { RouteGuard } from "@/components/route-guard"
import { getWorkspaceRoute } from "@/lib/auth"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && user) {
      navigate(getWorkspaceRoute(user.role))
    }
  }, [user, isLoading, navigate])

  return (
    <RouteGuard>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Cargando...</p>
          </div>
        </div>
      ) : user ? null : (
        <LoginForm />
      )}
    </RouteGuard>
  )
}

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { authenticateUser, getWorkspaceRoute } from "@/lib/auth"
import { useAuth } from "@/contexts/auth-context"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const user = authenticateUser(email, password)

    if (user) {
      login(user)
      navigate(getWorkspaceRoute(user.role))
    } else {
      setError("Credenciales invalidas. Use demo123 como contrasena.")
    }

    setIsLoading(false)
  }

  const quickLogin = (userEmail: string) => {
    setEmail(userEmail)
    setPassword("demo123")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Sistema de Restaurante</CardTitle>
          <CardDescription>Ingrese sus credenciales para acceder</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contrasena</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Ingrese su contrasena"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Iniciando sesion..." : "Iniciar sesion"}
            </Button>
          </form>

          <div className="mt-6 space-y-2">
            <p className="text-sm text-muted-foreground text-center">Usuarios de demostracion:</p>
            <div className="grid gap-2">
              <Button variant="outline" size="sm" onClick={() => quickLogin("comensal@demo.com")} className="text-xs">
                Comensal: comensal@demo.com
              </Button>
              <Button variant="outline" size="sm" onClick={() => quickLogin("cajero@demo.com")} className="text-xs">
                Cajero: cajero@demo.com
              </Button>
              <Button variant="outline" size="sm" onClick={() => quickLogin("chef@chef.com")} className="text-xs">
                Chef: chef@chef.com
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

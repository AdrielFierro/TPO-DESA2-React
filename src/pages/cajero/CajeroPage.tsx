import { useNavigate } from "react-router-dom"
import { useState, type KeyboardEvent } from "react"
import { WorkspaceLayout } from "@/components/workspace-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, QrCode, Clock, CheckCircle } from "lucide-react"

export default function CajeroPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"id" | "qr">("id")

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/cajero/reserva/${searchQuery}?type=${searchType}`)
    }
  }

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch()
    }
  }

  const stats = [
    {
      title: "Reservas Hoy",
      value: "24",
      description: "Reservas programadas",
      icon: Clock,
      color: "text-blue-600",
    },
    {
      title: "Procesadas",
      value: "18",
      description: "Ya confirmadas",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Pendientes",
      value: "6",
      description: "Por procesar",
      icon: Search,
      color: "text-orange-600",
    },
  ]

  return (
    <WorkspaceLayout title="Sistema de Cajero" allowedRole="cajero">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Bienvenido al Sistema de Cajero</h2>
          <p className="text-lg text-muted-foreground">Busca y procesa las reservas de los clientes</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Reserva
            </CardTitle>
            <CardDescription>Ingresa el ID o escanea el codigo QR del cliente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <Button
                variant={searchType === "id" ? "default" : "outline"}
                onClick={() => setSearchType("id")}
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Por ID
              </Button>
              <Button
                variant={searchType === "qr" ? "default" : "outline"}
                onClick={() => setSearchType("qr")}
                className="flex items-center gap-2"
              >
                <QrCode className="h-4 w-4" />
                Codigo QR
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search">{searchType === "id" ? "ID de Reserva" : "Codigo QR"}</Label>
              <div className="flex gap-2">
                <Input
                  id="search"
                  placeholder={searchType === "id" ? "Ej: RES001, RES002..." : "Escanea o ingresa codigo"}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={!searchQuery.trim()}>
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Acceso rapido - Reservas de prueba</h4>
              <div className="flex flex-wrap gap-2">
                {["RES001", "RES002", "RES003"].map((id) => (
                  <Badge
                    key={id}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => {
                      setSearchQuery(id)
                      setSearchType("id")
                    }}
                  >
                    {id}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Instrucciones de uso</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-medium text-foreground mb-2">Busqueda por ID</h4>
                <ul className="space-y-1">
                  <li>Solicita el numero de reserva</li>
                  <li>Ingresa el ID en el buscador</li>
                  <li>Verifica los datos mostrados</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Codigo QR</h4>
                <ul className="space-y-1">
                  <li>Solicita el codigo al cliente</li>
                  <li>Escanea o ingresa el codigo manualmente</li>
                  <li>Procede con la confirmacion</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </WorkspaceLayout>
  )
}

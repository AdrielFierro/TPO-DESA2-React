import { useNavigate } from "react-router-dom"
import { WorkspaceLayout } from "@/components/workspace-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Plus, Settings, ChefHat, Clock, TrendingUp } from "lucide-react"

export default function ChefPage() {
  const navigate = useNavigate()

  const menuOptions = [
    {
      title: "Ver o editar semana",
      description: "Gestiona el menu de la semana actual y proximas",
      icon: Calendar,
      action: () => navigate("/chef/semana"),
      color: "bg-primary text-primary-foreground",
    },
    {
      title: "Crear proxima semana",
      description: "Planifica el menu para la siguiente semana",
      icon: Plus,
      action: () => navigate("/chef/semana/nueva"),
      color: "bg-secondary text-secondary-foreground",
    },
    {
      title: "ABM consumibles",
      description: "Administra platos, bebidas y postres disponibles",
      icon: Settings,
      action: () => navigate("/chef/consumibles"),
      color: "bg-accent text-accent-foreground",
    },
  ]

  const stats = [
    {
      title: "Platos activos",
      value: "12",
      description: "En el menu actual",
      icon: ChefHat,
      color: "text-blue-600",
    },
    {
      title: "Semanas planificadas",
      value: "3",
      description: "Proximas semanas",
      icon: Calendar,
      color: "text-green-600",
    },
    {
      title: "Reservas hoy",
      value: "24",
      description: "Para menus actuales",
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Popularidad",
      value: "85%",
      description: "Satisfaccion promedio",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ]

  return (
    <WorkspaceLayout title="Sistema del Chef" allowedRole="chef">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Panel de control</h2>
          <p className="text-lg text-muted-foreground">
            Gestiona menus, planifica semanas y administra consumibles
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </div>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {menuOptions.map((option, index) => {
            const Icon = option.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={option.action}>
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 rounded-full ${option.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base mb-4">{option.description}</CardDescription>
                  <Button className="w-full bg-transparent" variant="outline">
                    Acceder
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Menu de esta semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Lunes - Almuerzo</p>
                    <p className="text-sm text-muted-foreground">Pollo a la Plancha</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Editar
                  </Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Lunes - Cena</p>
                    <p className="text-sm text-muted-foreground">Pescado al Horno</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Editar
                  </Button>
                </div>
                <div className="text-center pt-2">
                  <Button variant="link" onClick={() => navigate("/chef/semana")}>
                    Ver semana completa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                Consumibles populares
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Pollo a la Plancha</p>
                    <p className="text-sm text-muted-foreground">Reservado 15 veces</p>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Popular</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Jugo Natural</p>
                    <p className="text-sm text-muted-foreground">Reservado 12 veces</p>
                  </div>
                  <span className="text-sm text-blue-600 font-medium">Tendencia</span>
                </div>
                <div className="text-center pt-2">
                  <Button variant="link" onClick={() => navigate("/chef/consumibles")}>
                    Ver todos los consumibles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Guia rapida</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-medium text-foreground mb-2">Gestion semanal</h4>
                <ul className="space-y-1">
                  <li>Planifica menus por dia y turno</li>
                  <li>Asigna platos, bebidas y postres</li>
                  <li>Revisa y ajusta precios</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Consumibles</h4>
                <ul className="space-y-1">
                  <li>Crea nuevos platos y bebidas</li>
                  <li>Actualiza precios y disponibilidad</li>
                  <li>Organiza por categorias</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Planificacion</h4>
                <ul className="space-y-1">
                  <li>Crea menus con anticipacion</li>
                  <li>Revisa estadisticas de popularidad</li>
                  <li>Optimiza segun demanda</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </WorkspaceLayout>
  )
}

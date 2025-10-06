import { WorkspaceLayout } from "@/components/workspace-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Menu, Clock, MapPin } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function ComensalPage() {
  const navigate = useNavigate()

  const menuOptions = [
    {
      title: "Ver Menu",
      description: "Consulta nuestro menu del dia y opciones disponibles",
      icon: Menu,
      action: () => navigate("/comensal/menu"),
      color: "bg-primary text-primary-foreground",
    },
    {
      title: "Reservar",
      description: "Haz una nueva reserva seleccionando sede, horario y menu",
      icon: Calendar,
      action: () => navigate("/comensal/reservar"),
      color: "bg-secondary text-secondary-foreground",
    },
    {
      title: "Mis Reservas",
      description: "Consulta y gestiona tus reservas activas",
      icon: Clock,
      action: () => navigate("/comensal/reservas"),
      color: "bg-accent text-accent-foreground",
    },
  ]

  return (
    <WorkspaceLayout title="Portal del Comensal" allowedRole="comensal">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Bienvenido al Sistema de Reservas</h2>
          <p className="text-lg text-muted-foreground">Selecciona una opcion para comenzar</p>
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
                  <CardDescription className="text-center text-base">{option.description}</CardDescription>
                  <Button className="w-full mt-4 bg-transparent" variant="outline">
                    Acceder
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 bg-card rounded-lg p-6 border">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Informacion de Sedes
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-primary">Sede Centro</h4>
              <p className="text-muted-foreground">Calle Principal 123</p>
              <p className="text-muted-foreground">Horarios: 12:00 - 15:00 / 19:00 - 22:00</p>
            </div>
            <div>
              <h4 className="font-medium text-primary">Sede Norte</h4>
              <p className="text-muted-foreground">Avenida Norte 456</p>
              <p className="text-muted-foreground">Horarios: 12:00 - 15:00 / 19:00 - 22:00</p>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  )
}



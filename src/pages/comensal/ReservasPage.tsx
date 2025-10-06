import { WorkspaceLayout } from "@/components/workspace-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, MapPin, QrCode, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { useReservas } from "@/hooks/use-reservas"

export default function ReservasPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { reservas, loading, error } = useReservas(user?.email)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmada":
        return <Badge className="bg-green-500 text-white">Confirmada</Badge>
      case "pendiente":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-600">
            Pendiente
          </Badge>
        )
      case "pagada":
        return <Badge className="bg-blue-500 text-white">Pagada</Badge>
      case "completada":
        return <Badge className="bg-primary text-primary-foreground">Completada</Badge>
      case "cancelada":
        return <Badge variant="destructive">Cancelada</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <WorkspaceLayout title="Mis Reservas" allowedRole="comensal">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando reservas...</p>
            </div>
          </div>
        </div>
      </WorkspaceLayout>
    )
  }

  if (error) {
    return (
      <WorkspaceLayout title="Mis Reservas" allowedRole="comensal">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
          </div>
        </div>
      </WorkspaceLayout>
    )
  }

  return (
    <WorkspaceLayout title="Mis Reservas" allowedRole="comensal">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/comensal")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-primary">Mis Reservas</h2>
              <p className="text-muted-foreground">Gestiona tus reservas activas</p>
            </div>
          </div>

          <Button onClick={() => navigate("/comensal/reservar")}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Reserva
          </Button>
        </div>

        {reservas.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tienes reservas</h3>
              <p className="text-muted-foreground mb-4">
                Crea tu primera reserva para comenzar a disfrutar nuestros servicios
              </p>
              <Button onClick={() => navigate("/comensal/reservar")}>Hacer Primera Reserva</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reservas.map((reserva) => (
              <Card key={reserva.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Reserva #{reserva.id}
                        {getStatusBadge(reserva.status)}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{formatDate(reserva.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-primary">{formatPrice(reserva.menuDelDia.totalPrice)}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Informacion de Sede y Horario */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-primary flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Sede y Horario
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p className="font-medium">{reserva.sede.name}</p>
                        <p className="text-muted-foreground">{reserva.sede.address}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{reserva.turno.name}</span>
                          <span className="text-muted-foreground">
                            ({reserva.turno.startTime} - {reserva.turno.endTime})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu Seleccionado */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-primary">Menu Seleccionado</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>{reserva.menuDelDia.plato.name}</span>
                          <span className="text-muted-foreground">{formatPrice(reserva.menuDelDia.plato.price)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{reserva.menuDelDia.bebida.name}</span>
                          <span className="text-muted-foreground">{formatPrice(reserva.menuDelDia.bebida.price)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{reserva.menuDelDia.postre.name}</span>
                          <span className="text-muted-foreground">{formatPrice(reserva.menuDelDia.postre.price)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-primary">Acciones</h4>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          <QrCode className="h-4 w-4 mr-2" />
                          Ver Codigo QR
                        </Button>
                        {reserva.status === "pendiente" && (
                          <>
                            <Button size="sm" className="w-full">
                              Confirmar Pago
                            </Button>
                            <Button variant="destructive" size="sm" className="w-full">
                              Cancelar Reserva
                            </Button>
                          </>
                        )}
                        {reserva.status === "confirmada" && (
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            Modificar Reserva
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Informacion Adicional */}
        <Card className="mt-8 bg-muted/50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Informacion Importante</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-medium text-foreground mb-2">Politicas de Reserva</h4>
                <ul className="space-y-1">
                  <li>- Las reservas deben confirmarse con 24h de anticipacion</li>
                  <li>- El pago se realiza al momento de la confirmacion</li>
                  <li>- Cancelaciones gratuitas hasta 2 horas antes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Codigo QR</h4>
                <ul className="space-y-1">
                  <li>- Presenta tu codigo QR al llegar al restaurante</li>
                  <li>- El codigo se genera despues del pago</li>
                  <li>- Guarda una captura de pantalla como respaldo</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </WorkspaceLayout>
  )
}



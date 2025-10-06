import { WorkspaceLayout } from "@/components/workspace-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Clock, MapPin } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { MENU_ITEMS, SEDES, TURNOS } from "@/lib/types"

export default function MenuPage() {
  const navigate = useNavigate()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getItemsByType = (type: "plato" | "bebida" | "postre") => {
    return MENU_ITEMS.filter((item) => item.type === type && item.available)
  }

  return (
    <WorkspaceLayout title="Menu del Dia" allowedRole="comensal">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate("/comensal")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-primary">Menu Disponible</h2>
            <p className="text-muted-foreground">Consulta nuestras opciones del dia</p>
          </div>
        </div>

        {/* Informacion de Horarios */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horarios de Servicio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {TURNOS.map((turno) => (
                <div key={turno.id} className="flex items-center gap-3">
                  <Badge variant="outline" className="px-3 py-1">
                    {turno.name}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {turno.startTime} - {turno.endTime}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sedes Disponibles */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Sedes Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {SEDES.map((sede) => (
                <div key={sede.id} className="p-4 border rounded-lg">
                  <h4 className="font-medium">{sede.name}</h4>
                  <p className="text-sm text-muted-foreground">{sede.address}</p>
                  <p className="text-xs text-muted-foreground mt-1">Capacidad: {sede.capacity} personas</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Menu por Categorias */}
        <Tabs defaultValue="platos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="platos">Platos Principales</TabsTrigger>
            <TabsTrigger value="bebidas">Bebidas</TabsTrigger>
            <TabsTrigger value="postres">Postres</TabsTrigger>
          </TabsList>

          <TabsContent value="platos" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getItemsByType("plato").map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <Badge className="bg-primary text-primary-foreground">{formatPrice(item.price)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="mt-3">
                      <Badge variant="outline" className="text-xs">
                        Disponible
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bebidas" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getItemsByType("bebida").map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <Badge className="bg-secondary text-secondary-foreground">{formatPrice(item.price)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="mt-3">
                      <Badge variant="outline" className="text-xs">
                        Disponible
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="postres" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getItemsByType("postre").map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <Badge className="bg-accent text-accent-foreground">{formatPrice(item.price)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="mt-3">
                      <Badge variant="outline" className="text-xs">
                        Disponible
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-primary mb-2">?Listo para hacer tu reserva?</h3>
              <p className="text-muted-foreground mb-4">Selecciona tu sede, horario y menu favorito</p>
              <Button size="lg" onClick={() => navigate("/comensal/reservar")}>
                Hacer Reserva
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </WorkspaceLayout>
  )
}



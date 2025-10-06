import { WorkspaceLayout } from "@/components/workspace-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { ArrowLeft, CalendarIcon, Save, Copy } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function NuevaSemanaPage() {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [weekName, setWeekName] = useState("")

  const handleCreateWeek = () => {
    if (selectedDate && weekName) {
      // Here would be the logic to create a new week
      alert(`Nueva semana "${weekName}" creada para ${selectedDate.toLocaleDateString()}`)
      navigate("/chef/semana")
    }
  }

  const handleCopyFromCurrent = () => {
    if (confirm("?Copiar la configuracion de la semana actual?")) {
      alert("Configuracion copiada. Puedes editarla segun necesites.")
    }
  }

  return (
    <WorkspaceLayout title="Crear Nueva Semana" allowedRole="chef">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate("/chef/semana")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-primary">Crear Nueva Semana</h2>
            <p className="text-muted-foreground">Planifica el menu para una nueva semana</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Week Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Configuracion de Semana
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weekName">Nombre de la Semana</Label>
                <Input
                  id="weekName"
                  value={weekName}
                  onChange={(e) => setWeekName(e.target.value)}
                  placeholder="Ej: Semana del 15-21 Diciembre"
                />
              </div>

              <div className="space-y-2">
                <Label>Fecha de Inicio (Lunes)</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date.getDay() !== 1 || date < new Date()}
                  className="rounded-md border"
                />
              </div>

              {selectedDate && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Resumen de la Semana</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Inicio:</strong>{" "}
                    {selectedDate.toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Fin:</strong>{" "}
                    {new Date(selectedDate.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Opciones de Creacion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 bg-transparent"
                  onClick={handleCopyFromCurrent}
                >
                  <Copy className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Copiar Semana Actual</p>
                    <p className="text-sm text-muted-foreground">
                      Duplica la configuracion de menus de la semana actual
                    </p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 bg-transparent"
                  onClick={() => {
                    if (selectedDate && weekName) {
                      navigate(`/chef/semana?new=${encodeURIComponent(weekName)}`)
                    }
                  }}
                  disabled={!selectedDate || !weekName}
                >
                  <CalendarIcon className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Crear Semana Vacia</p>
                    <p className="text-sm text-muted-foreground">Comienza con una semana sin menus asignados</p>
                  </div>
                </Button>
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full" onClick={handleCreateWeek} disabled={!selectedDate || !weekName}>
                  <Save className="h-4 w-4 mr-2" />
                  Crear Nueva Semana
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Instrucciones</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-medium text-foreground mb-2">Planificacion</h4>
                <ul className="space-y-1">
                  <li>- Selecciona un lunes como fecha de inicio</li>
                  <li>- Asigna un nombre descriptivo a la semana</li>
                  <li>- Puedes copiar configuraciones existentes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Despues de Crear</h4>
                <ul className="space-y-1">
                  <li>- Asigna menus para cada dia y turno</li>
                  <li>- Revisa precios y disponibilidad</li>
                  <li>- Publica cuando este completa</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </WorkspaceLayout>
  )
}



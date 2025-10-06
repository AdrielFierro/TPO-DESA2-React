import { WorkspaceLayout } from "@/components/workspace-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Calendar, Edit, Plus, Clock, ChefHat } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { MENU_ITEMS, TURNOS, type MenuItem, type Turno } from "@/lib/types"

interface MenuAssignment {
  day: string
  turno: Turno
  plato: MenuItem | null
  bebida: MenuItem | null
  postre: MenuItem | null
}

const DAYS_OF_WEEK = [
  { key: "lunes", name: "Lunes" },
  { key: "martes", name: "Martes" },
  { key: "miercoles", name: "Miercoles" },
  { key: "jueves", name: "Jueves" },
  { key: "viernes", name: "Viernes" },
  { key: "sabado", name: "Sabado" },
  { key: "domingo", name: "Domingo" },
]

export default function SemanaPage() {
  const navigate = useNavigate()
  const [selectedWeek, setSelectedWeek] = useState("actual")
  const [menuAssignments, setMenuAssignments] = useState<MenuAssignment[]>(() => {
    // Initialize with some mock data
    const assignments: MenuAssignment[] = []
    DAYS_OF_WEEK.forEach((day) => {
      TURNOS.forEach((turno) => {
        assignments.push({
          day: day.key,
          turno,
          plato:
            day.key === "lunes" && turno.id === "almuerzo" ? MENU_ITEMS.find((i) => i.id === "plato1") || null : null,
          bebida:
            day.key === "lunes" && turno.id === "almuerzo" ? MENU_ITEMS.find((i) => i.id === "bebida2") || null : null,
          postre:
            day.key === "lunes" && turno.id === "almuerzo" ? MENU_ITEMS.find((i) => i.id === "postre1") || null : null,
        })
      })
    })
    return assignments
  })

  const [editingAssignment, setEditingAssignment] = useState<MenuAssignment | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPlato, setSelectedPlato] = useState<string>("")
  const [selectedBebida, setSelectedBebida] = useState<string>("")
  const [selectedPostre, setSelectedPostre] = useState<string>("")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getAssignment = (day: string, turnoId: string) => {
    return menuAssignments.find((a) => a.day === day && a.turno.id === turnoId)
  }

  const getTotalPrice = (assignment: MenuAssignment) => {
    return (assignment.plato?.price || 0) + (assignment.bebida?.price || 0) + (assignment.postre?.price || 0)
  }

  const handleEditAssignment = (assignment: MenuAssignment) => {
    setEditingAssignment(assignment)
    setSelectedPlato(assignment.plato?.id || "")
    setSelectedBebida(assignment.bebida?.id || "")
    setSelectedPostre(assignment.postre?.id || "")
    setIsDialogOpen(true)
  }

  const handleSaveAssignment = () => {
    if (!editingAssignment) return

    const plato = MENU_ITEMS.find((i) => i.id === selectedPlato) || null
    const bebida = MENU_ITEMS.find((i) => i.id === selectedBebida) || null
    const postre = MENU_ITEMS.find((i) => i.id === selectedPostre) || null

    setMenuAssignments((prev) =>
      prev.map((a) =>
        a.day === editingAssignment.day && a.turno.id === editingAssignment.turno.id
          ? { ...a, plato, bebida, postre }
          : a,
      ),
    )

    setIsDialogOpen(false)
    setEditingAssignment(null)
  }

  const getItemsByType = (type: "plato" | "bebida" | "postre") => {
    return MENU_ITEMS.filter((item) => item.type === type && item.available)
  }

  const isAssignmentComplete = (assignment: MenuAssignment) => {
    return assignment.plato && assignment.bebida && assignment.postre
  }

  const getCompletionStats = () => {
    const total = menuAssignments.length
    const completed = menuAssignments.filter(isAssignmentComplete).length
    return { completed, total, percentage: Math.round((completed / total) * 100) }
  }

  const stats = getCompletionStats()

  return (
    <WorkspaceLayout title="Gestion Semanal de Menus" allowedRole="chef">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/chef")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-primary">Planificacion Semanal</h2>
              <p className="text-muted-foreground">Gestiona los menus por dia y turno</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="actual">Semana Actual</SelectItem>
                <SelectItem value="proxima">Proxima Semana</SelectItem>
                <SelectItem value="siguiente">Semana Siguiente</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => navigate("/chef/semana/nueva")}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Semana
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-xl font-bold">
                {stats.completed}/{stats.total}
              </p>
              <p className="text-sm text-muted-foreground">Menus Completos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold">{stats.percentage}%</div>
              <p className="text-sm text-muted-foreground">Completado</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <ChefHat className="h-6 w-6 text-secondary mx-auto mb-2" />
              <p className="text-xl font-bold">{DAYS_OF_WEEK.length}</p>
              <p className="text-sm text-muted-foreground">Dias</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-xl font-bold">{TURNOS.length}</p>
              <p className="text-sm text-muted-foreground">Turnos</p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Menu Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Menu de la{" "}
              {selectedWeek === "actual"
                ? "Semana Actual"
                : selectedWeek === "proxima"
                  ? "Proxima Semana"
                  : "Semana Siguiente"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-8 gap-2 min-w-[800px]">
                {/* Header */}
                <div className="font-medium text-center p-2">Dia / Turno</div>
                {TURNOS.map((turno) => (
                  <div key={turno.id} className="font-medium text-center p-2 bg-muted/50 rounded">
                    <div>{turno.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {turno.startTime} - {turno.endTime}
                    </div>
                  </div>
                ))}

                {/* Days and Assignments */}
                {DAYS_OF_WEEK.map((day) => (
                  <>
                    <div key={day.key} className="font-medium p-2 bg-muted/30 rounded flex items-center">
                      {day.name}
                    </div>
                    {TURNOS.map((turno) => {
                      const assignment = getAssignment(day.key, turno.id)
                      const isComplete = assignment && isAssignmentComplete(assignment)

                      return (
                        <Card
                          key={`${day.key}-${turno.id}`}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            isComplete ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                          }`}
                          onClick={() => assignment && handleEditAssignment(assignment)}
                        >
                          <CardContent className="p-3 space-y-2">
                            {assignment && isComplete ? (
                              <>
                                <div className="space-y-1">
                                  <p className="text-xs font-medium truncate">{assignment.plato?.name}</p>
                                  <p className="text-xs text-muted-foreground truncate">{assignment.bebida?.name}</p>
                                  <p className="text-xs text-muted-foreground truncate">{assignment.postre?.name}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                  <Badge variant="outline" className="text-xs">
                                    {formatPrice(getTotalPrice(assignment))}
                                  </Badge>
                                  <Edit className="h-3 w-3 text-muted-foreground" />
                                </div>
                              </>
                            ) : (
                              <div className="text-center py-4">
                                <Plus className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                                <p className="text-xs text-muted-foreground">Sin asignar</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Assignment Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                Editar Menu - {editingAssignment && DAYS_OF_WEEK.find((d) => d.key === editingAssignment.day)?.name}{" "}
                {editingAssignment?.turno.name}
              </DialogTitle>
              <DialogDescription>Selecciona los consumibles para este dia y turno</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Plato Principal</label>
                <Select value={selectedPlato} onValueChange={setSelectedPlato}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar plato" />
                  </SelectTrigger>
                  <SelectContent>
                    {getItemsByType("plato").map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} - {formatPrice(item.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Bebida</label>
                <Select value={selectedBebida} onValueChange={setSelectedBebida}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar bebida" />
                  </SelectTrigger>
                  <SelectContent>
                    {getItemsByType("bebida").map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} - {formatPrice(item.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Postre</label>
                <Select value={selectedPostre} onValueChange={setSelectedPostre}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar postre" />
                  </SelectTrigger>
                  <SelectContent>
                    {getItemsByType("postre").map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} - {formatPrice(item.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPlato && selectedBebida && selectedPostre && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium mb-2">Precio Total del Menu</p>
                    <p className="text-xl font-bold text-primary">
                      {formatPrice(
                        (MENU_ITEMS.find((i) => i.id === selectedPlato)?.price || 0) +
                          (MENU_ITEMS.find((i) => i.id === selectedBebida)?.price || 0) +
                          (MENU_ITEMS.find((i) => i.id === selectedPostre)?.price || 0),
                      )}
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveAssignment} disabled={!selectedPlato || !selectedBebida || !selectedPostre}>
                  Guardar Menu
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </WorkspaceLayout>
  )
}



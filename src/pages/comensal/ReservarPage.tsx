import { useState } from "react"
import { WorkspaceLayout } from "@/components/workspace-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { ArrowLeft, ArrowRight, MapPin, Clock, CalendarIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { SEDES, TURNOS, MENU_ITEMS, type Sede, type Turno, type MenuItem } from "@/lib/types"

type Step = "sede" | "fecha" | "turno" | "menu" | "confirmacion"

export default function ReservarPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<Step>("sede")
  const [selectedSede, setSelectedSede] = useState<Sede | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null)
  const [selectedMenu, setSelectedMenu] = useState<{
    plato: MenuItem | null
    bebida: MenuItem | null
    postre: MenuItem | null
  }>({
    plato: null,
    bebida: null,
    postre: null,
  })

  const steps: { key: Step; title: string; completed: boolean }[] = [
    { key: "sede", title: "Sede", completed: !!selectedSede },
    { key: "fecha", title: "Fecha", completed: !!selectedDate },
    { key: "turno", title: "Turno", completed: !!selectedTurno },
    { key: "menu", title: "Menu", completed: !!(selectedMenu.plato && selectedMenu.bebida && selectedMenu.postre) },
    { key: "confirmacion", title: "Confirmar", completed: false },
  ]

  const currentStepIndex = steps.findIndex((step) => step.key === currentStep)

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].key)
    }
  }

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].key)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case "sede":
        return !!selectedSede
      case "fecha":
        return !!selectedDate
      case "turno":
        return !!selectedTurno
      case "menu":
        return !!(selectedMenu.plato && selectedMenu.bebida && selectedMenu.postre)
      default:
        return false
    }
  }

  const getTotalPrice = () => {
    const { plato, bebida, postre } = selectedMenu
    return (plato?.price || 0) + (bebida?.price || 0) + (postre?.price || 0)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "sede":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Selecciona una Sede</h3>
            <div className="grid gap-4">
              {SEDES.map((sede) => (
                <Card
                  key={sede.id}
                  className={`cursor-pointer transition-all ${
                    selectedSede?.id === sede.id ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedSede(sede)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">{sede.name}</h4>
                        <p className="text-sm text-muted-foreground">{sede.address}</p>
                        <p className="text-xs text-muted-foreground">Capacidad: {sede.capacity} personas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "fecha":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Selecciona una Fecha</h3>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                className="rounded-md border"
              />
            </div>
            {selectedDate && (
              <div className="text-center">
                <Badge variant="secondary" className="text-sm">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {selectedDate.toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Badge>
              </div>
            )}
          </div>
        )

      case "turno":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Selecciona un Turno</h3>
            <div className="grid gap-4">
              {TURNOS.map((turno) => (
                <Card
                  key={turno.id}
                  className={`cursor-pointer transition-all ${
                    selectedTurno?.id === turno.id ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedTurno(turno)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">{turno.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {turno.startTime} - {turno.endTime}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "menu":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Selecciona tu Menu</h3>

            {(["plato", "bebida", "postre"] as const).map((tipo) => (
              <div key={tipo} className="space-y-3">
                <h4 className="font-medium capitalize text-primary">{tipo}s Disponibles</h4>
                <div className="grid gap-3">
                  {MENU_ITEMS.filter((item) => item.type === tipo).map((item) => (
                    <Card
                      key={item.id}
                      className={`cursor-pointer transition-all ${
                        selectedMenu[tipo]?.id === item.id ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-md"
                      }`}
                      onClick={() => setSelectedMenu((prev) => ({ ...prev, [tipo]: item }))}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">{item.name}</h5>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <Badge variant="outline">{formatPrice(item.price)}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}

            {selectedMenu.plato && selectedMenu.bebida && selectedMenu.postre && (
              <Card className="bg-secondary/10 border-secondary">
                <CardContent className="p-4">
                  <h4 className="font-medium text-secondary mb-2">Resumen del Menu</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>{selectedMenu.plato.name}</span>
                      <span>{formatPrice(selectedMenu.plato.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{selectedMenu.bebida.name}</span>
                      <span>{formatPrice(selectedMenu.bebida.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{selectedMenu.postre.name}</span>
                      <span>{formatPrice(selectedMenu.postre.price)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>{formatPrice(getTotalPrice())}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )

      case "confirmacion":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Confirmar Reserva</h3>

            <Card>
              <CardHeader>
                <CardTitle>Detalles de la Reserva</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-primary mb-2">Sede y Horario</h5>
                    <p className="text-sm">{selectedSede?.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedSede?.address}</p>
                    <p className="text-sm">
                      {selectedDate?.toLocaleDateString("es-ES")} - {selectedTurno?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedTurno?.startTime} - {selectedTurno?.endTime}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-medium text-primary mb-2">Menu Seleccionado</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>{selectedMenu.plato?.name}</span>
                        <span>{formatPrice(selectedMenu.plato?.price || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{selectedMenu.bebida?.name}</span>
                        <span>{formatPrice(selectedMenu.bebida?.price || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{selectedMenu.postre?.name}</span>
                        <span>{formatPrice(selectedMenu.postre?.price || 0)}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-medium text-base">
                        <span>Total a Pagar</span>
                        <span className="text-primary">{formatPrice(getTotalPrice())}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => {
                      // Here would be the reservation creation logic
                      alert("Reserva creada exitosamente! Redirigiendo a Mis Reservas...")
                      navigate("/comensal/reservas")
                    }}
                  >
                    Confirmar Reserva
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <WorkspaceLayout title="Nueva Reserva" allowedRole="comensal">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.key} className="flex items-center">
                <div
                  className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${
                    step.completed
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step.key
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground"
                  }
                `}
                >
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm ${currentStep === step.key ? "font-medium" : ""}`}>{step.title}</span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${step.completed ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="p-6">{renderStepContent()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={prevStep} disabled={currentStepIndex === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/comensal")}>
              Cancelar
            </Button>

            {currentStep !== "confirmacion" && (
              <Button onClick={nextStep} disabled={!canProceed()}>
                Siguiente
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  )
}



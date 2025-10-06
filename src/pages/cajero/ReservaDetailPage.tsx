import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { WorkspaceLayout } from "@/components/workspace-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, User, Menu, CreditCard, CheckCircle, XCircle, Loader } from "lucide-react"

type ReservationRecord = Record<string, any>

type PaymentStatus = "pending" | "sufficient" | "insufficient" | "processing" | "completed" | "failed"

const MOCK_RESERVATIONS: ReservationRecord = {
  RES001: {
    id: "RES001",
    comensalName: "Juan Perez",
    comensalEmail: "juan.perez@email.com",
    date: "2024-12-15",
    turno: { name: "Almuerzo", startTime: "12:00", endTime: "15:00" },
    sede: { name: "Sede Centro", address: "Calle Principal 123" },
    menu: {
      plato: { name: "Pollo a la Plancha", price: 15000 },
      bebida: { name: "Jugo Natural", price: 4000 },
      postre: { name: "Flan Casero", price: 5000 },
    },
    status: "confirmada",
    totalPrice: 24000,
    qrCode: "QR001",
  },
  RES002: {
    id: "RES002",
    comensalName: "Maria Garcia",
    comensalEmail: "maria.garcia@email.com",
    date: "2024-12-18",
    turno: { name: "Cena", startTime: "19:00", endTime: "22:00" },
    sede: { name: "Sede Norte", address: "Avenida Norte 456" },
    menu: {
      plato: { name: "Pescado al Horno", price: 18000 },
      bebida: { name: "Agua Natural", price: 2000 },
      postre: { name: "Helado", price: 4500 },
    },
    status: "pendiente",
    totalPrice: 24500,
    qrCode: "QR002",
  },
  RES003: {
    id: "RES003",
    comensalName: "Carlos Lopez",
    comensalEmail: "carlos.lopez@email.com",
    date: "2024-12-20",
    turno: { name: "Almuerzo", startTime: "12:00", endTime: "15:00" },
    sede: { name: "Sede Centro", address: "Calle Principal 123" },
    menu: {
      plato: { name: "Pasta Carbonara", price: 14000 },
      bebida: { name: "Gaseosa", price: 3000 },
      postre: { name: "Torta del Dia", price: 6000 },
    },
    status: "confirmada",
    totalPrice: 23000,
    qrCode: "QR003",
  },
}

export default function ReservaDetailPage() {
  const navigate = useNavigate()
  const params = useParams()
  const [searchParams] = useSearchParams()
  const reservaId = params.id ?? ""
  const searchType = searchParams.get("type") ?? "id"

  const [reserva, setReserva] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending")
  const [orderNumber, setOrderNumber] = useState<string | null>(null)

  const formattedReservationId = useMemo(() => reservaId.toUpperCase(), [reservaId])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setReserva(MOCK_RESERVATIONS[formattedReservationId])
      setLoading(false)
    }, 1000)

    return () => window.clearTimeout(timeout)
  }, [formattedReservationId])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  const handlePaymentValidation = (status: PaymentStatus) => {
    setPaymentStatus("processing")

    window.setTimeout(() => {
      setPaymentStatus(status)

      if (status === "completed") {
        const orderNum = `ORD${Date.now().toString().slice(-6)}`
        setOrderNumber(orderNum)
      }
    }, 2000)
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
      default:
        return (
          <Badge variant="outline" className="border-slate-400 text-slate-600">
            {status}
          </Badge>
        )
    }
  }

  if (loading) {
    return (
      <WorkspaceLayout title="Detalle de Reserva" allowedRole="cajero">
        <div className="flex items-center justify-center h-[60vh]">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </WorkspaceLayout>
    )
  }

  if (!reserva) {
    return (
      <WorkspaceLayout title="Detalle de Reserva" allowedRole="cajero">
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <XCircle className="h-12 w-12 text-destructive mx-auto" />
            <div>
              <h2 className="text-xl font-semibold">Reserva no encontrada</h2>
              <p className="text-muted-foreground">
                No encontramos la reserva {formattedReservationId}. Verifica el identificador ingresado.
              </p>
            </div>
            <Button onClick={() => navigate("/cajero")}>Volver</Button>
          </CardContent>
        </Card>
      </WorkspaceLayout>
    )
  }

  return (
    <WorkspaceLayout title="Detalle de Reserva" allowedRole="cajero">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate("/cajero")}> 
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-primary">Reserva {reserva.id}</h2>
            <p className="text-sm text-muted-foreground">
              Resultado de busqueda por {searchType === "qr" ? "codigo QR" : "ID"}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Datos del comensal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="text-lg font-semibold">{reserva.comensalName}</p>
                </div>
                <Badge variant="secondary">{getStatusBadge(reserva.status)}</Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Fecha</p>
                  <p className="text-base font-medium">{formatDate(reserva.date)}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Turno</p>
                  <p className="text-base font-medium">
                    {reserva.turno.name} ({reserva.turno.startTime} - {reserva.turno.endTime})
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Sede</p>
                  <p className="text-base font-medium">{reserva.sede.name}</p>
                  <p className="text-sm text-muted-foreground">{reserva.sede.address}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Codigo QR</p>
                  <p className="text-base font-medium">{reserva.qrCode}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Menu className="h-5 w-5" />
                Menu reservado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{reserva.menu.plato.name}</p>
                    <p className="text-sm text-muted-foreground">Plato principal</p>
                  </div>
                  <Badge variant="outline">{formatPrice(reserva.menu.plato.price)}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{reserva.menu.bebida.name}</p>
                    <p className="text-sm text-muted-foreground">Bebida</p>
                  </div>
                  <Badge variant="outline">{formatPrice(reserva.menu.bebida.price)}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{reserva.menu.postre.name}</p>
                    <p className="text-sm text-muted-foreground">Postre</p>
                  </div>
                  <Badge variant="outline">{formatPrice(reserva.menu.postre.price)}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Card className="w-full bg-primary/5 border-primary/20">
                  <CardContent className="p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Total a pagar</p>
                    <p className="text-3xl font-bold text-primary">{formatPrice(reserva.totalPrice)}</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Validacion de pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paymentStatus === "pending" && (
              <div className="space-y-4">
                <p className="text-muted-foreground">Selecciona el estado del pago del cliente:</p>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 bg-transparent"
                    onClick={() => handlePaymentValidation("completed")}
                  >
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <span>Saldo suficiente</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 bg-transparent"
                    onClick={() => handlePaymentValidation("insufficient")}
                  >
                    <XCircle className="h-6 w-6 text-red-600" />
                    <span>Saldo insuficiente</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 bg-transparent"
                    onClick={() => handlePaymentValidation("processing")}
                  >
                    <Loader className="h-6 w-6 text-blue-600" />
                    <span>Pago en curso</span>
                  </Button>
                </div>
              </div>
            )}

            {paymentStatus === "processing" && (
              <div className="text-center py-8">
                <Loader className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-lg font-medium">Procesando pago...</p>
                <p className="text-muted-foreground">Por favor espere</p>
              </div>
            )}

            {paymentStatus === "completed" && orderNumber && (
              <div className="text-center py-8 space-y-4">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-green-600 mb-2">Pago procesado exitosamente</p>
                  <p className="text-muted-foreground">Se genero el pedido</p>
                </div>
                <Card className="bg-green-50 border-green-200 max-w-md mx-auto">
                  <CardContent className="p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Numero de pedido</p>
                    <p className="text-3xl font-bold text-green-600">{orderNumber}</p>
                    <p className="text-sm text-muted-foreground mt-2">Entrega este numero al cliente</p>
                  </CardContent>
                </Card>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => navigate("/cajero")}>Procesar nueva reserva</Button>
                  <Button variant="outline" onClick={() => window.print()}>
                    Imprimir comprobante
                  </Button>
                </div>
              </div>
            )}

            {paymentStatus === "insufficient" && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Saldo insuficiente:</strong> el cliente no tiene fondos suficientes. Solicita otro metodo de pago.
                </AlertDescription>
              </Alert>
            )}

            {paymentStatus === "failed" && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Error en el pago:</strong> no se pudo procesar el pago. Intenta nuevamente o contacta soporte.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </WorkspaceLayout>
  )
}


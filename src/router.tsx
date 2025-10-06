import { createBrowserRouter } from "react-router-dom"
import HomePage from "@/pages/HomePage"
import CajeroPage from "@/pages/cajero/CajeroPage"
import ReservaDetailPage from "@/pages/cajero/ReservaDetailPage"
import ChefPage from "@/pages/chef/ChefPage"
import ConsumiblesPage from "@/pages/chef/ConsumiblesPage"
import SemanaPage from "@/pages/chef/SemanaPage"
import SemanaNuevaPage from "@/pages/chef/SemanaNuevaPage"
import ComensalPage from "@/pages/comensal/ComensalPage"
import MenuPage from "@/pages/comensal/MenuPage"
import ReservarPage from "@/pages/comensal/ReservarPage"
import ReservasPage from "@/pages/comensal/ReservasPage"
import { RouteGuard } from "@/components/route-guard"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/cajero",
    element: (
      <RouteGuard requiredRole="cajero">
        <CajeroPage />
      </RouteGuard>
    ),
  },
  {
    path: "/cajero/reserva/:id",
    element: (
      <RouteGuard requiredRole="cajero">
        <ReservaDetailPage />
      </RouteGuard>
    ),
  },
  {
    path: "/chef",
    element: (
      <RouteGuard requiredRole="chef">
        <ChefPage />
      </RouteGuard>
    ),
  },
  {
    path: "/chef/consumibles",
    element: (
      <RouteGuard requiredRole="chef">
        <ConsumiblesPage />
      </RouteGuard>
    ),
  },
  {
    path: "/chef/semana",
    element: (
      <RouteGuard requiredRole="chef">
        <SemanaPage />
      </RouteGuard>
    ),
  },
  {
    path: "/chef/semana/nueva",
    element: (
      <RouteGuard requiredRole="chef">
        <SemanaNuevaPage />
      </RouteGuard>
    ),
  },
  {
    path: "/comensal",
    element: (
      <RouteGuard requiredRole="comensal">
        <ComensalPage />
      </RouteGuard>
    ),
  },
  {
    path: "/comensal/menu",
    element: (
      <RouteGuard requiredRole="comensal">
        <MenuPage />
      </RouteGuard>
    ),
  },
  {
    path: "/comensal/reservar",
    element: (
      <RouteGuard requiredRole="comensal">
        <ReservarPage />
      </RouteGuard>
    ),
  },
  {
    path: "/comensal/reservas",
    element: (
      <RouteGuard requiredRole="comensal">
        <ReservasPage />
      </RouteGuard>
    ),
  },
])

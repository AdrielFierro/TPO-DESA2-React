import { WorkspaceLayout } from "@/components/workspace-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Edit, Trash2, Search, ChefHat, Coffee, Cake } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMenuItems } from "@/hooks/use-menu-items"
import type { MenuItem } from "@/lib/types"

export default function ConsumiblesPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const { menuItems, loading, error, addMenuItem, updateMenuItem, deleteMenuItem } = useMenuItems()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    type: "plato" as "plato" | "bebida" | "postre",
    available: true,
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const filteredItems = (type: "plato" | "bebida" | "postre") => {
    return menuItems
      .filter((item) => item.type === type)
      .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  const handleSave = () => {
    const newItem: MenuItem = {
      id: editingItem?.id || `item_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: Number.parseInt(formData.price),
      type: formData.type,
      available: formData.available,
    }

    if (editingItem) {
      updateMenuItem(editingItem.id, newItem)
    } else {
      addMenuItem(newItem)
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      type: item.type,
      available: item.available,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("?Estas seguro de que quieres eliminar este consumible?")) {
      deleteMenuItem(id)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      type: "plato",
      available: true,
    })
    setEditingItem(null)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "plato":
        return <ChefHat className="h-4 w-4" />
      case "bebida":
        return <Coffee className="h-4 w-4" />
      case "postre":
        return <Cake className="h-4 w-4" />
      default:
        return null
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "plato":
        return "bg-primary text-primary-foreground"
      case "bebida":
        return "bg-secondary text-secondary-foreground"
      case "postre":
        return "bg-accent text-accent-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  if (loading) {
    return (
      <WorkspaceLayout title="Gestion de Consumibles" allowedRole="chef">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando consumibles...</p>
            </div>
          </div>
        </div>
      </WorkspaceLayout>
    )
  }

  if (error) {
    return (
      <WorkspaceLayout title="Gestion de Consumibles" allowedRole="chef">
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
    <WorkspaceLayout title="Gestion de Consumibles" allowedRole="chef">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/chef")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-primary">Administracion de Consumibles</h2>
              <p className="text-muted-foreground">Gestiona platos, bebidas y postres</p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Consumible
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Editar Consumible" : "Nuevo Consumible"}</DialogTitle>
                <DialogDescription>
                  {editingItem ? "Modifica los datos del consumible" : "Agrega un nuevo plato, bebida o postre"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Nombre del consumible"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripcion</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Descripcion del consumible"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "plato" | "bebida" | "postre") =>
                        setFormData((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plato">Plato</SelectItem>
                        <SelectItem value="bebida">Bebida</SelectItem>
                        <SelectItem value="postre">Postre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio (COP)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} disabled={!formData.name || !formData.price}>
                    {editingItem ? "Actualizar" : "Crear"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar consumibles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Consumibles by Category */}
        <Tabs defaultValue="platos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="platos" className="flex items-center gap-2">
              <ChefHat className="h-4 w-4" />
              Platos ({filteredItems("plato").length})
            </TabsTrigger>
            <TabsTrigger value="bebidas" className="flex items-center gap-2">
              <Coffee className="h-4 w-4" />
              Bebidas ({filteredItems("bebida").length})
            </TabsTrigger>
            <TabsTrigger value="postres" className="flex items-center gap-2">
              <Cake className="h-4 w-4" />
              Postres ({filteredItems("postre").length})
            </TabsTrigger>
          </TabsList>

          {(["plato", "bebida", "postre"] as const).map((tipo) => (
            <TabsContent key={tipo} value={`${tipo}s`} className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems(tipo).map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(item.type)}
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                        </div>
                        <Badge className={getTypeColor(item.type)}>{formatPrice(item.price)}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant={item.available ? "default" : "secondary"}>
                          {item.available ? "Disponible" : "No disponible"}
                        </Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredItems(tipo).length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    {getTypeIcon(tipo)}
                    <h3 className="text-lg font-semibold mb-2 mt-4">
                      No hay {tipo}s {searchQuery ? "que coincidan con la busqueda" : "disponibles"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery ? "Intenta con otros terminos de busqueda" : `Crea tu primer ${tipo} para comenzar`}
                    </p>
                    {!searchQuery && (
                      <Button onClick={() => setIsDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Crear {tipo}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <ChefHat className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{filteredItems("plato").length}</p>
              <p className="text-sm text-muted-foreground">Platos Disponibles</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Coffee className="h-8 w-8 text-secondary mx-auto mb-2" />
              <p className="text-2xl font-bold">{filteredItems("bebida").length}</p>
              <p className="text-sm text-muted-foreground">Bebidas Disponibles</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Cake className="h-8 w-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold">{filteredItems("postre").length}</p>
              <p className="text-sm text-muted-foreground">Postres Disponibles</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </WorkspaceLayout>
  )
}



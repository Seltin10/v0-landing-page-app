"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { addActivity } from "@/lib/activities"
import { useRouter } from "next/navigation"

export function ActivityForm({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    formData.append("userId", userId)

    const result = await addActivity(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      e.currentTarget.reset()
      router.refresh()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Atividade</CardTitle>
        <CardDescription>Adicione manualmente uma atividade física</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertDescription>Atividade registrada com sucesso!</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="activity_type">Tipo de Atividade</Label>
            <Select name="activity_type" required disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="running">Corrida</SelectItem>
                <SelectItem value="cycling">Ciclismo</SelectItem>
                <SelectItem value="swimming">Natação</SelectItem>
                <SelectItem value="sports_plus">SPORTS+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="distance">Distância (km)</Label>
              <Input
                id="distance"
                name="distance"
                type="number"
                step="0.1"
                min="0.1"
                placeholder="5.0"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duração (minutos)</Label>
              <Input id="duration" name="duration" type="number" min="1" placeholder="30" required disabled={loading} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="calories">Calorias (opcional)</Label>
              <Input id="calories" name="calories" type="number" min="0" placeholder="300" disabled={loading} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                required
                disabled={loading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registrando..." : "Registrar Atividade"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

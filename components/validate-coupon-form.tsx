"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { validateCoupon } from "@/lib/partner-actions"
import { useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"

export function ValidateCouponForm({ partnerId }: { partnerId: number }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState<any>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    formData.append("partnerId", partnerId.toString())

    const result = await validateCoupon(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(result.coupon)
      setLoading(false)
      e.currentTarget.reset()
      router.refresh()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Validar Cupom</CardTitle>
        <CardDescription>Digite o código de resgate do cliente</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <div className="space-y-1">
                  <p className="font-semibold">Cupom validado com sucesso!</p>
                  <p className="text-sm">Cliente: {success.user_name}</p>
                  <p className="text-sm">Cupom: {success.coupon_title}</p>
                  <p className="text-sm">
                    Desconto:{" "}
                    {success.discount_type === "percentage"
                      ? `${success.discount_value}%`
                      : success.discount_type === "fixed"
                        ? `R$ ${success.discount_value}`
                        : "Brinde"}
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="code">Código de Resgate</Label>
            <Input
              id="code"
              name="code"
              type="text"
              placeholder="XXXXXXXX"
              required
              disabled={loading}
              className="text-lg font-mono tracking-wider uppercase"
              maxLength={8}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Validando..." : "Validar Cupom"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

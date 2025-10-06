"use client"

import { useState } from "react"
import { updateLGPDConsent } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ConsentForm({ userId }: { userId: string }) {
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit() {
    if (!accepted) {
      setError("Você precisa aceitar os termos para continuar")
      return
    }

    setLoading(true)
    setError("")

    const result = await updateLGPDConsent(userId, true)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Termos de Uso e Privacidade</CardTitle>
        <CardDescription>Leia e aceite nossos termos para continuar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="bg-muted p-4 rounded-lg max-h-64 overflow-y-auto space-y-3 text-sm">
          <h3 className="font-semibold">Coleta e Uso de Dados (LGPD)</h3>
          <p>
            O iRun coleta e processa seus dados pessoais de acordo com a Lei Geral de Proteção de Dados (LGPD).
            Coletamos informações como nome, email, dados de atividades físicas e localização para fornecer nossos
            serviços.
          </p>

          <h3 className="font-semibold">Dados Coletados</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Informações de cadastro (nome, email, telefone)</li>
            <li>Dados de atividades físicas (corrida, ciclismo, natação)</li>
            <li>Dados de saúde do Apple Health / Google Fit (com sua autorização)</li>
            <li>Localização durante atividades</li>
            <li>Histórico de recompensas e cupons</li>
          </ul>

          <h3 className="font-semibold">Seus Direitos</h3>
          <p>
            Você tem direito a acessar, corrigir, excluir ou exportar seus dados a qualquer momento. Também pode revogar
            seu consentimento e solicitar a exclusão completa da sua conta.
          </p>

          <h3 className="font-semibold">Compartilhamento de Dados</h3>
          <p>
            Seus dados são compartilhados apenas com parceiros comerciais quando você resgata cupons, e apenas as
            informações necessárias para validação da recompensa.
          </p>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="consent"
            checked={accepted}
            onCheckedChange={(checked) => setAccepted(checked as boolean)}
            disabled={loading}
          />
          <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
            Li e aceito os Termos de Uso e Política de Privacidade do iRun, e autorizo o tratamento dos meus dados
            pessoais conforme descrito acima, de acordo com a LGPD.
          </Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={!accepted || loading} className="w-full">
          {loading ? "Processando..." : "Aceitar e Continuar"}
        </Button>
      </CardFooter>
    </Card>
  )
}

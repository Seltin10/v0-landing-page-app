"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { MessageSquare, Loader2, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FeedbackFormProps {
  userId: number
  hasSubmitted?: boolean
}

export function FeedbackForm({ userId, hasSubmitted = false }: FeedbackFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(hasSubmitted)

  // Form state
  const [motivationScale, setMotivationScale] = useState<number>(3)
  const [rewardRanking, setRewardRanking] = useState({
    descontos: 1,
    cashback: 2,
    produtos: 3,
    experiencias: 4,
    doacoes: 5,
  })
  const [valuePerception, setValuePerception] = useState<number>(3)
  const [partnerImportance, setPartnerImportance] = useState<number>(3)
  const [easeOfUse, setEaseOfUse] = useState<number>(3)
  const [favoriteFeature, setFavoriteFeature] = useState("")
  const [improvementSuggestion, setImprovementSuggestion] = useState("")
  const [paymentWillingness, setPaymentWillingness] = useState("")
  const [acceptablePriceRange, setAcceptablePriceRange] = useState("")
  const [competitorComparison, setCompetitorComparison] = useState("")
  const [uniqueFeature, setUniqueFeature] = useState("")
  const [recommendationLikelihood, setRecommendationLikelihood] = useState<number>(5)
  const [usageFrequency, setUsageFrequency] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!paymentWillingness || !acceptablePriceRange || !usageFrequency) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todas as perguntas obrigatórias.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          motivationScale,
          rewardRanking,
          valuePerception,
          partnerImportance,
          easeOfUse,
          favoriteFeature,
          improvementSuggestion,
          paymentWillingness,
          acceptablePriceRange,
          competitorComparison,
          uniqueFeature,
          recommendationLikelihood,
          usageFrequency,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao enviar feedback")
      }

      setSubmitted(true)
      toast({
        title: "Feedback enviado!",
        description: "Obrigado pela sua contribuição!",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar seu feedback. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-900">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
            <div>
              <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">Obrigado!</h3>
              <p className="text-green-800 dark:text-green-200">
                Sua contribuição é a nossa linha de chegada. Juntos, vamos mais longe!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <CardTitle>Sua Opinião é o Mais Importante!</CardTitle>
        </div>
        <CardDescription>
          Seu feedback nos ajudará a construir o melhor aplicativo de recompensas para praticantes de atividades
          físicas. Leva apenas 2 minutos!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Eixo 1: Motivação e Engajamento */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Motivação e Engajamento</h3>

            <div className="space-y-3">
              <Label>1. O quanto você se sente motivado(a) a praticar atividades físicas com recompensas?</Label>
              <div className="space-y-2">
                <Slider
                  value={[motivationScale]}
                  onValueChange={(value) => setMotivationScale(value[0])}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 - Nada motivado</span>
                  <span className="font-semibold text-primary">{motivationScale}</span>
                  <span>5 - Muito motivado</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>2. Ordene os tipos de recompensa por preferência (1 = mais preferido, 5 = menos preferido)</Label>
              <div className="grid gap-3">
                {Object.entries(rewardRanking).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="capitalize">
                      {key === "descontos"
                        ? "Descontos"
                        : key === "cashback"
                          ? "Cashback"
                          : key === "produtos"
                            ? "Produtos Grátis"
                            : key === "experiencias"
                              ? "Experiências"
                              : "Doações"}
                    </span>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={value}
                      onChange={(e) =>
                        setRewardRanking({ ...rewardRanking, [key]: Number.parseInt(e.target.value) || 1 })
                      }
                      className="w-16 px-2 py-1 border rounded text-center"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Eixo 2: Proposta de Valor */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Proposta de Valor</h3>

            <div className="space-y-3">
              <Label>3. Como você avalia a proposta de ganhar recompensas por atividades físicas?</Label>
              <div className="space-y-2">
                <Slider
                  value={[valuePerception]}
                  onValueChange={(value) => setValuePerception(value[0])}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 - Pouco atrativa</span>
                  <span className="font-semibold text-primary">{valuePerception}</span>
                  <span>5 - Muito atrativa</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>4. Qual a importância de ter parceiros conhecidos oferecendo recompensas?</Label>
              <div className="space-y-2">
                <Slider
                  value={[partnerImportance]}
                  onValueChange={(value) => setPartnerImportance(value[0])}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 - Pouco importante</span>
                  <span className="font-semibold text-primary">{partnerImportance}</span>
                  <span>5 - Muito importante</span>
                </div>
              </div>
            </div>
          </div>

          {/* Eixo 3: Experiência do Usuário */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Experiência do Usuário</h3>

            <div className="space-y-3">
              <Label>5. Como você avalia a facilidade de uso do aplicativo?</Label>
              <div className="space-y-2">
                <Slider
                  value={[easeOfUse]}
                  onValueChange={(value) => setEaseOfUse(value[0])}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 - Difícil</span>
                  <span className="font-semibold text-primary">{easeOfUse}</span>
                  <span>5 - Muito fácil</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="favoriteFeature">6. Qual funcionalidade você mais gostou? (Opcional)</Label>
              <Textarea
                id="favoriteFeature"
                value={favoriteFeature}
                onChange={(e) => setFavoriteFeature(e.target.value)}
                placeholder="Descreva a funcionalidade que você mais gostou..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="improvementSuggestion">7. O que você mudaria ou melhoraria? (Opcional)</Label>
              <Textarea
                id="improvementSuggestion"
                value={improvementSuggestion}
                onChange={(e) => setImprovementSuggestion(e.target.value)}
                placeholder="Suas sugestões de melhoria..."
                rows={3}
              />
            </div>
          </div>

          {/* Eixo 4: Modelo de Negócio */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Modelo de Negócio</h3>

            <div className="space-y-3">
              <Label>8. Você pagaria por uma versão premium com mais benefícios? *</Label>
              <RadioGroup value={paymentWillingness} onValueChange={setPaymentWillingness}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="pay-yes" />
                  <Label htmlFor="pay-yes" className="font-normal cursor-pointer">
                    Sim
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="talvez" id="pay-maybe" />
                  <Label htmlFor="pay-maybe" className="font-normal cursor-pointer">
                    Talvez
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="pay-no" />
                  <Label htmlFor="pay-no" className="font-normal cursor-pointer">
                    Não
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>9. Qual faixa de preço você considera aceitável para uma assinatura mensal? *</Label>
              <RadioGroup value={acceptablePriceRange} onValueChange={setAcceptablePriceRange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0-10" id="price-1" />
                  <Label htmlFor="price-1" className="font-normal cursor-pointer">
                    R$ 0-10
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="10-20" id="price-2" />
                  <Label htmlFor="price-2" className="font-normal cursor-pointer">
                    R$ 10-20
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="20-30" id="price-3" />
                  <Label htmlFor="price-3" className="font-normal cursor-pointer">
                    R$ 20-30
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30+" id="price-4" />
                  <Label htmlFor="price-4" className="font-normal cursor-pointer">
                    Acima de R$ 30
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Eixo 5: Diferenciação e Competitividade */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Diferenciação e Competitividade</h3>

            <div className="space-y-2">
              <Label htmlFor="competitorComparison">
                10. Você usa outros apps de fitness? Como o iRun se compara? (Opcional)
              </Label>
              <Textarea
                id="competitorComparison"
                value={competitorComparison}
                onChange={(e) => setCompetitorComparison(e.target.value)}
                placeholder="Compare com outros aplicativos que você usa..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="uniqueFeature">11. O que tornaria o iRun único para você? (Opcional)</Label>
              <Textarea
                id="uniqueFeature"
                value={uniqueFeature}
                onChange={(e) => setUniqueFeature(e.target.value)}
                placeholder="Que funcionalidade única você gostaria de ver..."
                rows={3}
              />
            </div>
          </div>

          {/* Eixo 6: Viabilidade e Escalabilidade */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Viabilidade e Escalabilidade</h3>

            <div className="space-y-3">
              <Label>12. Em uma escala de 0 a 10, qual a probabilidade de você recomendar o iRun?</Label>
              <div className="space-y-2">
                <Slider
                  value={[recommendationLikelihood]}
                  onValueChange={(value) => setRecommendationLikelihood(value[0])}
                  min={0}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 - Não recomendaria</span>
                  <span className="font-semibold text-primary">{recommendationLikelihood}</span>
                  <span>10 - Recomendaria muito</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>13. Com que frequência você usaria o iRun? *</Label>
              <RadioGroup value={usageFrequency} onValueChange={setUsageFrequency}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="diariamente" id="freq-daily" />
                  <Label htmlFor="freq-daily" className="font-normal cursor-pointer">
                    Diariamente
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="semanalmente" id="freq-weekly" />
                  <Label htmlFor="freq-weekly" className="font-normal cursor-pointer">
                    Semanalmente
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mensalmente" id="freq-monthly" />
                  <Label htmlFor="freq-monthly" className="font-normal cursor-pointer">
                    Mensalmente
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="raramente" id="freq-rarely" />
                  <Label htmlFor="freq-rarely" className="font-normal cursor-pointer">
                    Raramente
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar Feedback"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Ticket } from "lucide-react"
import Image from "next/image"

const MOCK_PARTNERS = [
  // Restaurantes
  {
    id: 1,
    name: "Restaurante Sabor & Saúde",
    category: "Restaurantes",
    logo_url: "/restaurant-logo.png",
    coupon_count: 3,
    coupons: [
      { id: 1, type: "percentage", value: 15, description: "15% OFF" },
      { id: 2, type: "fixed", value: 25, description: "R$ 25 OFF" },
      { id: 3, type: "percentage", value: 20, description: "20% OFF" },
    ],
  },
  {
    id: 2,
    name: "Pizzaria Bella Napoli",
    category: "Restaurantes",
    logo_url: "/pizza-logo.png",
    coupon_count: 2,
    coupons: [
      { id: 1, type: "percentage", value: 10, description: "10% OFF" },
      { id: 2, type: "fixed", value: 30, description: "R$ 30 OFF" },
    ],
  },
  {
    id: 3,
    name: "Café Energia",
    category: "Restaurantes",
    logo_url: "/cafe-logo.png",
    coupon_count: 1,
    coupons: [{ id: 1, type: "percentage", value: 15, description: "15% OFF" }],
  },

  // Lojas Esportivas
  {
    id: 4,
    name: "SportMax",
    category: "Lojas Esportivas",
    logo_url: "/sports-store-logo.png",
    coupon_count: 5,
    coupons: [
      { id: 1, type: "percentage", value: 20, description: "20% OFF" },
      { id: 2, type: "fixed", value: 50, description: "R$ 50 OFF" },
      { id: 3, type: "percentage", value: 15, description: "15% OFF" },
      { id: 4, type: "fixed", value: 100, description: "R$ 100 OFF" },
      { id: 5, type: "percentage", value: 25, description: "25% OFF" },
    ],
  },
  {
    id: 5,
    name: "Corrida & Cia",
    category: "Lojas Esportivas",
    logo_url: "/running-store-logo.jpg",
    coupon_count: 4,
    coupons: [
      { id: 1, type: "percentage", value: 15, description: "15% OFF" },
      { id: 2, type: "fixed", value: 40, description: "R$ 40 OFF" },
      { id: 3, type: "percentage", value: 20, description: "20% OFF" },
      { id: 4, type: "fixed", value: 60, description: "R$ 60 OFF" },
    ],
  },
  {
    id: 6,
    name: "Bike Shop Pro",
    category: "Lojas Esportivas",
    logo_url: "/bike-shop-logo.jpg",
    coupon_count: 3,
    coupons: [
      { id: 1, type: "percentage", value: 10, description: "10% OFF" },
      { id: 2, type: "fixed", value: 75, description: "R$ 75 OFF" },
      { id: 3, type: "percentage", value: 18, description: "18% OFF" },
    ],
  },

  // Roupas e Vestuário
  {
    id: 7,
    name: "Moda Fitness",
    category: "Roupas e Vestuário",
    logo_url: "/fitness-clothing-logo.jpg",
    coupon_count: 6,
    coupons: [
      { id: 1, type: "percentage", value: 25, description: "25% OFF" },
      { id: 2, type: "fixed", value: 35, description: "R$ 35 OFF" },
      { id: 3, type: "percentage", value: 15, description: "15% OFF" },
      { id: 4, type: "fixed", value: 50, description: "R$ 50 OFF" },
      { id: 5, type: "percentage", value: 30, description: "30% OFF" },
      { id: 6, type: "fixed", value: 20, description: "R$ 20 OFF" },
    ],
  },
  {
    id: 8,
    name: "Active Wear",
    category: "Roupas e Vestuário",
    logo_url: "/activewear-logo.jpg",
    coupon_count: 4,
    coupons: [
      { id: 1, type: "percentage", value: 20, description: "20% OFF" },
      { id: 2, type: "fixed", value: 45, description: "R$ 45 OFF" },
      { id: 3, type: "percentage", value: 15, description: "15% OFF" },
      { id: 4, type: "fixed", value: 30, description: "R$ 30 OFF" },
    ],
  },
  {
    id: 9,
    name: "Estilo Urbano",
    category: "Roupas e Vestuário",
    logo_url: "/urban-clothing-logo.jpg",
    coupon_count: 2,
    coupons: [
      { id: 1, type: "percentage", value: 12, description: "12% OFF" },
      { id: 2, type: "fixed", value: 25, description: "R$ 25 OFF" },
    ],
  },

  // Suplementos
  {
    id: 10,
    name: "Nutri Suplementos",
    category: "Suplementos",
    logo_url: "/supplements-logo.jpg",
    coupon_count: 7,
    coupons: [
      { id: 1, type: "percentage", value: 20, description: "20% OFF" },
      { id: 2, type: "fixed", value: 50, description: "R$ 50 OFF" },
      { id: 3, type: "percentage", value: 15, description: "15% OFF" },
      { id: 4, type: "fixed", value: 30, description: "R$ 30 OFF" },
      { id: 5, type: "percentage", value: 25, description: "25% OFF" },
      { id: 6, type: "fixed", value: 40, description: "R$ 40 OFF" },
      { id: 7, type: "percentage", value: 10, description: "10% OFF" },
    ],
  },
  {
    id: 11,
    name: "Proteína Max",
    category: "Suplementos",
    logo_url: "/protein-logo.jpg",
    coupon_count: 5,
    coupons: [
      { id: 1, type: "percentage", value: 18, description: "18% OFF" },
      { id: 2, type: "fixed", value: 35, description: "R$ 35 OFF" },
      { id: 3, type: "percentage", value: 22, description: "22% OFF" },
      { id: 4, type: "fixed", value: 60, description: "R$ 60 OFF" },
      { id: 5, type: "percentage", value: 15, description: "15% OFF" },
    ],
  },
  {
    id: 12,
    name: "Vita Store",
    category: "Suplementos",
    logo_url: "/vitamins-logo.jpg",
    coupon_count: 3,
    coupons: [
      { id: 1, type: "percentage", value: 15, description: "15% OFF" },
      { id: 2, type: "fixed", value: 25, description: "R$ 25 OFF" },
      { id: 3, type: "percentage", value: 20, description: "20% OFF" },
    ],
  },

  // Eventos
  {
    id: 13,
    name: "Maratona São Paulo",
    category: "Eventos",
    logo_url: "/marathon-logo.png",
    coupon_count: 2,
    coupons: [
      { id: 1, type: "percentage", value: 10, description: "10% OFF" },
      { id: 2, type: "fixed", value: 50, description: "R$ 50 OFF" },
    ],
  },
  {
    id: 14,
    name: "Corrida das Cores",
    category: "Eventos",
    logo_url: "/color-run-logo.jpg",
    coupon_count: 1,
    coupons: [{ id: 1, type: "percentage", value: 15, description: "15% OFF" }],
  },
  {
    id: 15,
    name: "Triathlon Brasil",
    category: "Eventos",
    logo_url: "/triathlon-logo.jpg",
    coupon_count: 2,
    coupons: [
      { id: 1, type: "percentage", value: 12, description: "12% OFF" },
      { id: 2, type: "fixed", value: 40, description: "R$ 40 OFF" },
    ],
  },

  // Serviços Gerais
  {
    id: 16,
    name: "Personal Trainer Online",
    category: "Serviços Gerais",
    logo_url: "/personal-trainer-logo.jpg",
    coupon_count: 4,
    coupons: [
      { id: 1, type: "percentage", value: 20, description: "20% OFF" },
      { id: 2, type: "fixed", value: 100, description: "R$ 100 OFF" },
      { id: 3, type: "percentage", value: 15, description: "15% OFF" },
      { id: 4, type: "fixed", value: 50, description: "R$ 50 OFF" },
    ],
  },
  {
    id: 17,
    name: "Fisioterapia Esportiva",
    category: "Serviços Gerais",
    logo_url: "/physiotherapy-logo.jpg",
    coupon_count: 3,
    coupons: [
      { id: 1, type: "percentage", value: 15, description: "15% OFF" },
      { id: 2, type: "fixed", value: 60, description: "R$ 60 OFF" },
      { id: 3, type: "percentage", value: 25, description: "25% OFF" },
    ],
  },
  {
    id: 18,
    name: "Nutricionista Fit",
    category: "Serviços Gerais",
    logo_url: "/nutritionist-logo.jpg",
    coupon_count: 2,
    coupons: [
      { id: 1, type: "percentage", value: 10, description: "10% OFF" },
      { id: 2, type: "fixed", value: 40, description: "R$ 40 OFF" },
    ],
  },

  // Saúde e Beleza
  {
    id: 19,
    name: "Spa Relaxamento",
    category: "Saúde e Beleza",
    logo_url: "/spa-logo.png",
    coupon_count: 5,
    coupons: [
      { id: 1, type: "percentage", value: 20, description: "20% OFF" },
      { id: 2, type: "fixed", value: 80, description: "R$ 80 OFF" },
      { id: 3, type: "percentage", value: 15, description: "15% OFF" },
      { id: 4, type: "fixed", value: 50, description: "R$ 50 OFF" },
      { id: 5, type: "percentage", value: 25, description: "25% OFF" },
    ],
  },
  {
    id: 20,
    name: "Clínica Estética Corpo Perfeito",
    category: "Saúde e Beleza",
    logo_url: "/aesthetic-clinic-logo.jpg",
    coupon_count: 4,
    coupons: [
      { id: 1, type: "percentage", value: 18, description: "18% OFF" },
      { id: 2, type: "fixed", value: 100, description: "R$ 100 OFF" },
      { id: 3, type: "percentage", value: 22, description: "22% OFF" },
      { id: 4, type: "fixed", value: 70, description: "R$ 70 OFF" },
    ],
  },
  {
    id: 21,
    name: "Massagem Terapêutica",
    category: "Saúde e Beleza",
    logo_url: "/massage-logo.jpg",
    coupon_count: 3,
    coupons: [
      { id: 1, type: "percentage", value: 15, description: "15% OFF" },
      { id: 2, type: "fixed", value: 45, description: "R$ 45 OFF" },
      { id: 3, type: "percentage", value: 20, description: "20% OFF" },
    ],
  },
]

const CATEGORIES = [
  "Todos",
  "Restaurantes",
  "Lojas Esportivas",
  "Roupas e Vestuário",
  "Suplementos",
  "Eventos",
  "Serviços Gerais",
  "Saúde e Beleza",
]

export default function PartnersPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")

  const filteredPartners =
    selectedCategory === "Todos" ? MOCK_PARTNERS : MOCK_PARTNERS.filter((p) => p.category === selectedCategory)

  return (
    <div className="min-h-screen bg-background pb-20">
      <DashboardHeader user={{ name: "Usuário" }} />
      <main className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl mb-1 font-normal">Parceiros</h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Conheça nossos parceiros e os cupons disponíveis
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap text-xs"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPartners.map((partner) => (
            <Card key={partner.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <Image
                      src={partner.logo_url || "/placeholder.svg"}
                      alt={partner.name}
                      width={56}
                      height={56}
                      className="rounded-lg object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base leading-tight">{partner.name}</CardTitle>
                    <CardDescription className="mt-1 text-xs">{partner.category}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Ticket className="h-3.5 w-3.5" />
                    <span>Cupons disponíveis:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {partner.coupons.map((coupon) => (
                      <Badge
                        key={coupon.id}
                        variant={coupon.type === "percentage" ? "default" : "secondary"}
                        className="text-xs font-semibold"
                      >
                        {coupon.description}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-muted-foreground">Total de cupons</span>
                  <Badge variant="outline" className="font-semibold text-xs">
                    {partner.coupon_count}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredPartners.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-sm text-muted-foreground">Nenhum parceiro disponível nesta categoria</p>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}

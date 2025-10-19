"use client"

import { Card } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function PartnerAdBanner() {
  const ad = {
    id: 1,
    partnerName: "Nike Running",
    title: "20% OFF em Tênis de Corrida",
    description: "Válido para membros iRun Clube+",
    imageUrl: "/nike-running-shoes-advertisement.jpg",
    ctaText: "Ver Oferta",
    ctaUrl: "/partners",
  }

  return (
    <Link href={ad.ctaUrl}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-2 border-primary/20">
        <div className="flex items-center gap-4 p-4">
          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
            <Image src={ad.imageUrl || "/placeholder.svg"} alt={ad.partnerName} fill className="object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-primary mb-1">PARCEIRO DESTAQUE</div>
            <h3 className="font-bold text-base mb-1 truncate">{ad.title}</h3>
            <p className="text-xs text-muted-foreground mb-2">{ad.description}</p>
            <div className="flex items-center gap-1 text-xs font-semibold text-primary">
              {ad.ctaText}
              <ChevronRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

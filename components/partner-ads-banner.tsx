"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Partner {
  id: number
  name: string
  logo_url: string
  category: string
}

interface PartnerAdsBannerProps {
  partners: Partner[]
}

export function PartnerAdsBanner({ partners }: PartnerAdsBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (partners.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % partners.length)
    }, 5000) // Change ad every 5 seconds

    return () => clearInterval(interval)
  }, [partners.length])

  if (partners.length === 0) {
    return null
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + partners.length) % partners.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % partners.length)
  }

  const currentPartner = partners[currentIndex]

  return (
    <div className="relative w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg overflow-hidden shadow-sm border border-blue-100 dark:border-blue-900">
      <div className="relative h-32 sm:h-40 flex items-center justify-center p-4">
        {/* Partner Logo/Image */}
        <div className="relative w-full h-full flex items-center justify-center">
          {currentPartner.logo_url ? (
            <Image
              src={currentPartner.logo_url || "/placeholder.svg"}
              alt={`${currentPartner.name} - Parceiro iRun`}
              fill
              className="object-contain"
              priority
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="text-2xl sm:text-3xl text-blue-600 dark:text-blue-400 font-semibold">
                {currentPartner.name}
              </div>
              {currentPartner.category && (
                <div className="text-xs sm:text-sm text-muted-foreground">{currentPartner.category}</div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        {partners.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 shadow-md"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 shadow-md"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Indicator Dots */}
      {partners.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {partners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? "w-6 bg-blue-600 dark:bg-blue-400"
                  : "w-1.5 bg-blue-300 dark:bg-blue-700 hover:bg-blue-400 dark:hover:bg-blue-600"
              }`}
              aria-label={`Ir para parceiro ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Partner Label */}
      <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 dark:bg-gray-800/90 rounded text-[10px] font-medium text-muted-foreground">
        Parceiro iRun
      </div>
    </div>
  )
}

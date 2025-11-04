"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Car, BikeIcon, Bus, TreeDeciduous, Info } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface EcoCalculatorProps {
  totalRunning: number
  totalCycling: number
}

type TransportType = "car" | "motorcycle" | "bus"

// UK Government GHG Conversion Factors 2024 (DEFRA/BEIS/DESNZ)
const EMISSION_FACTORS = {
  car: 165, // g CO2e/km (gasoline, medium size)
  motorcycle: 114, // g CO2e/km (medium size)
  bus: 130, // g CO2e/passenger-km (urban, outside London)
}

const SUBSTITUTION_PROBABILITY = 0.3 // 30% default
const TREE_RATE = 2.5 // g CO2/hour absorbed by a tree

export function EcoCalculator({ totalRunning, totalCycling }: EcoCalculatorProps) {
  const [selectedTransport, setSelectedTransport] = useState<TransportType>("car")

  const transportLabels = {
    car: "Carro",
    motorcycle: "Moto",
    bus: "Ônibus",
  }

  const transportIcons = {
    car: Car,
    motorcycle: BikeIcon,
    bus: Bus,
  }

  // Calculate total distance (running + cycling)
  const totalDistance = totalRunning + totalCycling

  // Calculate CO2 emissions avoided
  const emissionFactor = EMISSION_FACTORS[selectedTransport]
  const co2AvoidedPre = totalDistance * emissionFactor // in grams
  const co2Avoided = co2AvoidedPre * SUBSTITUTION_PROBABILITY // in grams

  // Calculate tree hours
  const treeHours = co2Avoided / TREE_RATE

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-900">iRun ECO+</CardTitle>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Info className="h-4 w-4 text-green-700" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Sobre o iRun ECO+</DialogTitle>
                <DialogDescription>Metodologia e informações técnicas</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">O que é o iRun ECO+?</h4>
                  <p className="text-muted-foreground">
                    O iRun ECO+ estima as emissões de CO₂ evitadas quando você realiza atividades físicas (corrida,
                    caminhada ou pedalada) em substituição a um deslocamento motorizado.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Metodologia de Cálculo</h4>
                  <p className="text-muted-foreground mb-2">
                    Utilizamos os fatores de emissão oficiais do governo do Reino Unido (UK Government GHG Conversion
                    Factors 2024 - DEFRA/BEIS/DESNZ):
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li>Carro (gasolina, médio): 165 g CO₂e/km</li>
                    <li>Motocicleta (média): 114 g CO₂e/km</li>
                    <li>Ônibus urbano: 130 g CO₂e/passageiro-km</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Fórmula</h4>
                  <p className="text-muted-foreground">
                    CO₂ evitado = distância (km) × fator de emissão × probabilidade de substituição (30%)
                  </p>
                  <p className="text-muted-foreground mt-2">Horas de árvore = CO₂ evitado (g) / 2,5 g/h</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    * Uma árvore absorve aproximadamente 22 kg CO₂/ano ≈ 2,5 g/h
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <h4 className="font-semibold mb-2 text-amber-900">Importante</h4>
                  <p className="text-xs text-amber-800">
                    Estes valores são estimativas educacionais de "emissões evitadas" e não equivalem a créditos de
                    carbono. Os fatores são médias do inventário oficial do governo do Reino Unido (DEFRA 2024),
                    expressos em CO₂e (equivalente de CO₂). O valor para ônibus é por passageiro-km, metodologicamente
                    mais correto para fins de emissões evitadas por indivíduo.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Fontes Oficiais</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground ml-2">
                    <li>Greenhouse gas reporting: conversion factors 2024 (DEFRA)</li>
                    <li>Conversion factors 2024 — condensed set (planilha XLS)</li>
                    <li>Methodology document 2024 (PDF)</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription className="text-green-700">
          Calculadora de emissões de CO₂ evitadas (estimativa educacional)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs text-green-800 mb-2 font-semibold">Selecione o meio de transporte:</p>
          <div className="flex gap-2">
            {(["car", "motorcycle", "bus"] as const).map((transport) => {
              const Icon = transportIcons[transport]
              return (
                <button
                  key={transport}
                  onClick={() => setSelectedTransport(transport)}
                  className={`flex-1 flex flex-col items-center gap-2 px-3 py-3 rounded-lg font-semibold transition-all text-sm ${
                    selectedTransport === transport
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-white text-green-700 hover:bg-green-100 border border-green-200"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {transportLabels[transport]}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="h-4 w-4 text-green-600" />
              <p className="text-green-800 font-semibold text-sm">CO₂ Evitado</p>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {co2Avoided >= 1000 ? `${(co2Avoided / 1000).toFixed(2)} kg` : `${co2Avoided.toFixed(0)} g`}
            </p>
            <p className="text-xs text-green-600 mt-1 font-normal">De {totalDistance.toFixed(1)} km percorridos</p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TreeDeciduous className="h-4 w-4 text-green-600" />
              <p className="text-green-800 font-semibold text-sm">Equivalente em Árvores</p>
            </div>
            <p className="text-2xl font-bold text-green-900">{treeHours.toFixed(1)} h</p>
            <p className="text-xs text-green-600 mt-1 font-normal">Horas de absorção de CO₂</p>
          </div>
        </div>

        <div className="bg-white/50 rounded-lg p-3 border border-green-200">
          <p className="text-xs text-green-700 leading-relaxed font-thin">
            <span className="font-semibold">Metodologia:</span> Fatores de emissão do UK Government GHG Conversion
            Factors 2024 (DEFRA). Probabilidade de substituição: 30%. Taxa de absorção: 2,5 g CO₂/h por árvore.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

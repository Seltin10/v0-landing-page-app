import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Oswald, Roboto } from "next/font/google"

const oswald = Oswald({
  weight: "500",
  subsets: ["latin"],
  display: "swap",
})

const roboto = Roboto({
  weight: "500",
  subsets: ["latin"],
  display: "swap",
})

export default async function HomePage() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b2396] to-[#d9a520]">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
          <div className="mb-4">
            <div className="flex flex-col items-center">
              <h1 className={`${oswald.className} text-8xl font-medium text-white leading-none tracking-tight italic`}>
                <span className="inline-block">
                  <span className="relative inline-block">i</span>
                  Run
                </span>
              </h1>
              <p className={`${roboto.className} text-2xl font-medium text-white mt-1`}>
                Clube<sup className="text-lg">+</sup>
              </p>
            </div>
          </div>
          <p className="text-white/90 max-w-2xl leading-6 font-extralight text-base">O clube que transforma saúde em recompensa</p>
          <p className="text-lg text-white/80 max-w-xl">
            {""}
          </p>
          <div className="flex gap-4 mt-8">
            <Button asChild size="lg" variant="secondary">
              <Link href="/signup">Começar Agora</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <Link href="/login">Já tenho conta</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

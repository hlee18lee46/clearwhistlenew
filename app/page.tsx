"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Shield, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type AnimatedBubble = {
  x: string
  y: string
  scale: number
  rotate: number
  duration: number
}

export default function LandingPage() {
  const router = useRouter()
  const [bubbles, setBubbles] = useState<AnimatedBubble[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Generate random positions only on the client side
  useEffect(() => {
    const generatedBubbles = Array.from({ length: 5 }, () => ({
      x: `${Math.random() * 100 - 50}%`,
      y: `${Math.random() * 100}%`,
      scale: Math.random() * 0.5 + 0.5,
      rotate: Math.random() * 360,
      duration: Math.random() * 20 + 15,
    }))

    setBubbles(generatedBubbles)
    setIsLoaded(true)
  }, [])

  // Optional auto-redirect after animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      // Uncomment to enable auto-redirect
      // router.push('/home')
    }, 10000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-emerald-50 to-white overflow-hidden">
      <div className="container max-w-5xl mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
  transition={{
    type: "tween",             // ✅ supports multiple keyframes
    repeat: Infinity,
    duration: 2,
    ease: "easeInOut"
  }}          className="flex justify-center mb-8"
        >
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, 0] }}
              transition={{ delay: 0.3, duration: 0.8, type: "tween" }}
            >
              <Shield className="h-12 w-12 text-emerald-600" />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-3xl font-bold"
            >
              ClearWhistle
            </motion.span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold text-center mb-6"
        >
          Speak Truth <span className="text-emerald-600">Without Fear</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-xl text-center text-gray-600 max-w-2xl mx-auto mb-12"
        >
          Anonymous whistleblowing with blockchain verification. Your identity stays hidden while your voice is heard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-6">
            <Link href="/home">
              Enter Platform
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Animated background elements - only rendered after client-side initialization */}
      <div className="absolute inset-0 overflow-hidden">
        {isLoaded &&
          bubbles.map((bubble, i) => (
            <motion.div
              key={i}
              initial={{
                x: bubble.x,
                y: bubble.y,
                opacity: 0.1,
                scale: bubble.scale,
              }}
              animate={{
                y: [`${Number.parseInt(bubble.y)}%`, `${Math.random() * 100}%`],
                rotate: bubble.rotate,
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: bubble.duration,
                ease: "easeInOut",
              }}
              className="absolute w-64 h-64 rounded-full bg-emerald-200 filter blur-3xl"
              style={{ zIndex: 0 }}
            />
          ))}
      </div>
    </div>
  )
}

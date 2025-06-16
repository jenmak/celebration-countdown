"use client"

import { useEffect, useState } from "react"

interface Balloon {
  id: number
  x: number
  y: number
  size: number
  delay: number
  color: string
}

export function BalloonAnimation() {
  const [balloons, setBalloons] = useState<Balloon[]>([])

  useEffect(() => {
    const colors = ["#F5CCD4", "#9ED1BF", "#B4D4E7"] // Pastel pink, mint, and blue from logo
    const newBalloons = Array.from({ length: 12 }, (_, i) => ({ // Increased from 8 to 12 balloons
      id: i,
      x: Math.random() * 80 + 10, // 10-90% of screen width
      y: Math.random() * 60 + 10, // 10-70% of screen height
      size: Math.random() * 120 + 60, // Random size between 60 and 180
      delay: Math.random() * 2, // Random delay between 0-2s
      color: colors[i % colors.length] // Alternate between the three colors
    }))
    setBalloons(newBalloons)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {balloons.map((balloon) => (
        <div
          key={balloon.id}
          style={{
            position: "absolute",
            left: `${balloon.x}%`,
            top: `${balloon.y}%`,
            width: `${balloon.size}px`,
            height: `${balloon.size * 2}px`, // Increased height for taller balloon
            transformOrigin: "center bottom",
            animation: `float ${3 + balloon.delay}s ease-in-out infinite`,
            zIndex: 1
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            {/* Balloon */}
            <div
              style={{
                width: "100%",
                height: "85%", // Increased height for more circular shape
                backgroundColor: balloon.color,
                borderRadius: "50%",
                position: "relative",
                boxShadow: "inset -10px -10px 20px rgba(0,0,0,0.1)"
              }}
            />
            {/* Tie */}
            <div
              style={{
                width: "15%", // Made tie smaller
                height: "8%", // Made tie smaller
                backgroundColor: balloon.color,
                position: "relative",
                top: "-2px",
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)"
              }}
            />
            {/* String */}
            <svg
              width="2"
              height="100%"
              style={{
                position: "relative",
                top: "-2px"
              }}
            >
              <path
                d={`M 1 0 Q 3 ${balloon.size * 0.2} 1 ${balloon.size * 0.4} Q -1 ${balloon.size * 0.6} 1 ${balloon.size * 0.8} Q 3 ${balloon.size} 1 ${balloon.size * 1.6}`}
                stroke="white"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      ))}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  )
} 
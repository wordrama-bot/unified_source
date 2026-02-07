'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Share2 } from 'lucide-react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useGetMyWrappedQuery } from '@/redux/api/wrapped';
import { TodayLeaderboard } from '@/sections/leaderboards'

export default function WordramaWrapped() {
  const { data: wrappedData, isLoading, isError } = useGetMyWrappedQuery();
  const { toast } = useToast()
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = 6
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Mock data - replace with actual user data in a real application
  function getMonthFromStr(monthStr: string) {
    if (!monthStr) return '';
    const [, month] = monthStr.split('-');
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[parseInt(month) - 1] || '';
  }

  const userData = {
    favoriteStartWord: wrappedData?.favoriteStartingWord || 'PINKY',
    challengesComplete: wrappedData?.challengesCompleted || 0,
    challengeCoins: wrappedData?.challengeCoinReward || 0,
    challengeXp: wrappedData?.challengeXpReward || 0,
    mostWinsMonth: getMonthFromStr(wrappedData?.mostWinsMonth),
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides)
    }, 3000) // Change slide every 3 seconds

    return () => clearTimeout(timer)
  }, [currentSlide])

  const slides = [
    {
      title: "Wordrama Wrapped 🎮",
      content: (
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-2"
          >
            {wrappedData?.data?.totalGames || 0}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm"
          >
            Games Played
          </motion.div>
        </div>
      )
    },
    {
      title: "Wordsmith 📚",
      content: (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold mb-2"
          >
            {wrappedData?.data?.longestWinWord}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm"
          >
            Hardest Word
          </motion.div>
        </div>
      )
    },
    {
      title: "On Fire 🔥",
      content: (
        <div className="text-center">
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-3xl font-bold mb-2"
          >
            {wrappedData?.data?.bestStreak || 0}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm"
          >
            Longest Streak
          </motion.div>
        </div>
      )
    },
    {
      title: "Challenge Accepted 🏆",
      content: (
        <div className="text-center">
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-3xl font-bold mb-2"
          >
            { wrappedData?.data?.challengesCompleted || 0 }
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm"
          >
            Achievements Earned
          </motion.div>
        </div>
      )
    },
    {
      title: "Busy bee 🐝",
      content: (
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-2"
          >
            {getMonthFromStr(wrappedData?.data?.mostWinsMonth)}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm"
          >
            was your most successful month
          </motion.div>
        </div>
      )
    },
    {
      title: "Word Wizard 🧙‍♂️",
      content: (
        <div className="grid grid-cols-2 gap-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-2xl font-bold">{wrappedData?.data?.averageGuessCount || 4}</div>
            <div className="text-sm">Avg. Guesses</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-2xl font-bold">{wrappedData?.data?.favoriteStartingWord || 'PINKY'}</div>
            <div className="text-sm">Favorite Start</div>
          </motion.div>
        </div>
      )
    }
  ]

  const generateImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size for Instagram Story
    canvas.width = 1080
    canvas.height = 1920

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#4ade80')
    gradient.addColorStop(1, '#3b82f6')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add semi-transparent overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Load and draw the Wordrama logo
    const logo = new Image()
    logo.crossOrigin = "anonymous"
    logo.onload = () => {
      const logoWidth = 600
      const logoHeight = (logo.height / logo.width) * logoWidth
      ctx.drawImage(logo, (canvas.width - logoWidth) / 2, 50, logoWidth, logoHeight)

      // Set text styles
      ctx.fillStyle = 'white'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Add stats
      ctx.font = 'bold 100px Arial'
      const stats = [
        `${wrappedData?.data?.totalGames} Games Played`,
        '',
        `Longest Streak: ${wrappedData?.data?.bestStreak || 0}`,
        '',
        `Avg. Guesses: ${wrappedData?.data?.averageGuessCount}`,
        '',
        'Hardest Word:',
        `${wrappedData?.data?.longestWinWord}`,
        '',
        'Favorite Start:',
        `${wrappedData?.data?.favoriteStartingWord}`,
        '',
        `${wrappedData?.data?.challengesCompleted}`,
        'Challenges Complete'
      ]
      stats.forEach((stat, index) => {
        ctx.fillText(stat, canvas.width / 2, logoHeight + 250 + index * 80)
      })

      // Add footer
      ctx.font = '30px Arial'
      ctx.fillText('https://wordrama.io', canvas.width / 2, canvas.height - 150)
      ctx.fillText('Share your Wordrama year!', canvas.width / 2, canvas.height - 100)

      // Trigger the sharing process after the image is fully generated
      shareImage(canvas)
    }
    logo.src = 'https://utfs.io/f/vieUBZcrouNZQrdaKfbRj7hpV6g4Axl20D3nvSc9I1BEkdqr'
  }

  const shareImage = (canvas: HTMLCanvasElement) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'wordrama-wrapped.png', { type: 'image/png' })
        if (navigator.share) {
          navigator.share({
            files: [file],
            title: 'My Wordrama Wrapped',
            text: 'Check out my Wordrama year in review!'
          }).then(() => {
            toast({
              title: "Shared successfully!",
              description: "Your Wordrama Wrapped has been shared.",
            })
          }).catch((error) => {
            console.error('Error sharing:', error)
            downloadImage(blob)
          })
        } else {
          downloadImage(blob)
        }
      }
    }, 'image/png')
  }

  const downloadImage = (blob: Blob) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'wordrama-wrapped.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast({
      title: "Image downloaded!",
      description: "Your Wordrama Wrapped image has been downloaded.",
    })
  }

  const handleShare = () => {
    toast({
      title: "Generating image...",
      description: "Please wait while we create your Wordrama Wrapped image.",
    })
    generateImage()
  }

  return !isError ? (
    !isLoading && (
      <Card className="bg-bg border-black">
      {// <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-green-400 to-blue-500 text-white overflow-hidden">
      }
        <CardContent className="p-6">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center justify-center">
              {slides[currentSlide].title}
            </h2>
            {slides[currentSlide].content}
          </motion.div>
        </CardContent>
        <CardFooter className="flex justify-between items-center mt-28 rounded bg-gradient-to-r from-pink-500 to-purple-500 p-6">
          <div className="flex items-center space-x-2 text-white">
            <Share2 className="h-6 w-6 fill-current" />
            <span className="text-lg font-semibold">Share to socials</span>
          </div>
          <Button onClick={handleShare} className="bg-white text-purple-600 hover:bg-gray-100">
            Share
          </Button>
        </CardFooter>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </Card>
    )
  ) : <TodayLeaderboard />
}

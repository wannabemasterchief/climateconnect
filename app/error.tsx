"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        We apologize for the inconvenience. Please try again later.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}

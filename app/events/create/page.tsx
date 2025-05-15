"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"

const topics = [
  "renewable energy",
  "carbon capture",
  "sustainable agriculture",
  "clean transportation",
  "water conservation",
  "waste management",
  "climate policy",
  "education",
  "other",
]

export default function CreateEventPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    is_virtual: false,
    location: "",
    topic: "",
    website: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        throw new Error("You must be logged in to create an event")
      }

      // Combine date and time
      const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`)
      const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`)

      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        throw new Error("Invalid date or time format")
      }

      if (endDateTime < startDateTime) {
        throw new Error("End date/time must be after start date/time")
      }

      const { error } = await supabase.from("events").insert({
        title: formData.title,
        description: formData.description,
        start_date: startDateTime.toISOString(),
        end_date: endDateTime.toISOString(),
        is_virtual: formData.is_virtual,
        location: formData.location,
        topic: formData.topic,
        website: formData.website,
        user_id: session.user.id,
      })

      if (error) {
        throw error
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      setError(error.message || "An error occurred while creating the event")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create Event</h1>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{error}</div>}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="E.g., Climate Innovation Summit 2023"
            />
          </div>

          <div>
            <Label htmlFor="topic">Topic</Label>
            <Select value={formData.topic} onValueChange={(value) => handleSelectChange("topic", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic.charAt(0).toUpperCase() + topic.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                name="start_time"
                type="time"
                value={formData.start_time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                name="end_time"
                type="time"
                value={formData.end_time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_virtual"
              checked={formData.is_virtual}
              onCheckedChange={(checked) => handleSwitchChange("is_virtual", checked)}
            />
            <Label htmlFor="is_virtual">This is a virtual event</Label>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder={
                formData.is_virtual ? "E.g., Zoom (details will be sent to registrants)" : "E.g., San Francisco, CA"
              }
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe the event in detail..."
              className="min-h-[200px]"
            />
          </div>

          <div>
            <Label htmlFor="website">Event Website</Label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="E.g., https://example.com/event"
            />
          </div>

          <div className="flex justify-end">
            <Button type="button" variant="outline" className="mr-2" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

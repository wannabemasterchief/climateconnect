"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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

export default function CreatePartnershipPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "teammate",
    topic: "",
    location: "",
    contact_email: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        throw new Error("You must be logged in to create a partnership")
      }

      const { error } = await supabase.from("partnerships").insert({
        ...formData,
        user_id: session.user.id,
      })

      if (error) {
        throw error
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      setError(error.message || "An error occurred while creating the partnership")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create Partnership Opportunity</h1>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{error}</div>}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="E.g., Seeking Technical Co-founder for Climate Tech Startup"
            />
          </div>

          <div>
            <Label htmlFor="type">Partnership Type</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) => handleSelectChange("type", value)}
              className="flex flex-wrap gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="teammate" id="teammate" />
                <Label htmlFor="teammate" className="font-normal">
                  Find Teammate
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="investor" id="investor" />
                <Label htmlFor="investor" className="font-normal">
                  Find Investor
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="project" id="project" />
                <Label htmlFor="project" className="font-normal">
                  Join Project
                </Label>
              </div>
            </RadioGroup>
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

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe the partnership opportunity in detail..."
              className="min-h-[200px]"
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="E.g., San Francisco, CA or Remote"
            />
          </div>

          <div>
            <Label htmlFor="contact_email">Contact Email</Label>
            <Input
              id="contact_email"
              name="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={handleChange}
              placeholder="E.g., contact@example.com"
            />
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="E.g., https://example.com"
            />
          </div>

          <div className="flex justify-end">
            <Button type="button" variant="outline" className="mr-2" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? "Creating..." : "Create Partnership"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

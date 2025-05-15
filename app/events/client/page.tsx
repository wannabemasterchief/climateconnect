"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { EventCard } from "@/components/ui-components/event-card"
import { FilterSidebar } from "@/components/ui-components/filter-sidebar"
import { createClient } from "@/lib/supabase/client"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Database } from "@/lib/types/supabase"

type Event = Database["public"]["Tables"]["events"]["Row"]

// Filter options
const eventTypes = [
  { id: "in-person", label: "In-Person" },
  { id: "virtual", label: "Virtual" },
]

const topics = [
  { id: "renewable energy", label: "Renewable Energy" },
  { id: "carbon capture", label: "Carbon Capture" },
  { id: "sustainable agriculture", label: "Sustainable Agriculture" },
  { id: "clean transportation", label: "Clean Transportation" },
  { id: "water conservation", label: "Water Conservation" },
  { id: "waste management", label: "Waste Management" },
  { id: "climate policy", label: "Climate Policy" },
]

const locations = [
  { id: "san francisco", label: "San Francisco, CA" },
  { id: "new york", label: "New York, NY" },
  { id: "washington", label: "Washington, DC" },
  { id: "madison", label: "Madison, WI" },
  { id: "detroit", label: "Detroit, MI" },
  { id: "amsterdam", label: "Amsterdam, Netherlands" },
  { id: "london", label: "London, UK" },
  { id: "paris", label: "Paris, France" },
  { id: "dubai", label: "Dubai, UAE" },
]

export default function EventsClientPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    types: [],
    topics: [],
    location: [],
  })
  const [activeTab, setActiveTab] = useState("upcoming")

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Initialize filters from URL params
  useEffect(() => {
    const tab = searchParams.get("tab") || "upcoming"
    const types = searchParams.get("types")?.split(",") || []
    const topics = searchParams.get("topics")?.split(",") || []
    const location = searchParams.get("location") ? [searchParams.get("location") as string] : []
    const search = searchParams.get("search") || ""

    setActiveTab(tab)
    setSelectedFilters({
      types: types,
      topics: topics,
      location: location,
    })
    setSearchTerm(search)
  }, [searchParams])

  // Fetch events
  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)
      const { data, error } = await supabase.from("events").select("*")

      if (error) {
        console.error("Error fetching events:", error)
      } else {
        setEvents(data || [])
      }
      setLoading(false)
    }

    fetchEvents()
  }, [])

  // Apply filters
  useEffect(() => {
    let results = events
    const now = new Date().toISOString()

    // Filter by upcoming/past
    if (activeTab === "upcoming") {
      results = results.filter((event) => event.start_date >= now)
      results.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
    } else {
      results = results.filter((event) => event.start_date < now)
      results.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      results = results.filter(
        (event) => event.title.toLowerCase().includes(term) || event.description.toLowerCase().includes(term),
      )
    }

    // Filter by type (virtual/in-person)
    if (selectedFilters.types.length > 0) {
      results = results.filter((event) => {
        if (selectedFilters.types.includes("virtual") && event.is_virtual) {
          return true
        }
        if (selectedFilters.types.includes("in-person") && !event.is_virtual) {
          return true
        }
        return false
      })
    }

    // Filter by topic
    if (selectedFilters.topics.length > 0) {
      results = results.filter((event) => selectedFilters.topics.some((topic) => event.topic.includes(topic)))
    }

    // Filter by location
    if (selectedFilters.location.length > 0) {
      results = results.filter(
        (event) =>
          !event.is_virtual &&
          event.location &&
          selectedFilters.location.some((location) => event.location?.toLowerCase().includes(location.toLowerCase())),
      )
    }

    setFilteredEvents(results)
  }, [events, searchTerm, selectedFilters, activeTab])

  // Update URL with filters
  const updateUrl = () => {
    const params = new URLSearchParams()

    params.set("tab", activeTab)

    if (selectedFilters.types.length > 0) {
      params.set("types", selectedFilters.types.join(","))
    }

    if (selectedFilters.topics.length > 0) {
      params.set("topics", selectedFilters.topics.join(","))
    }

    if (selectedFilters.location.length > 0) {
      params.set("location", selectedFilters.location[0])
    }

    if (searchTerm) {
      params.set("search", searchTerm)
    }

    router.push(`/events/client?${params.toString()}`)
  }

  const handleFilterChange = (filterName: string, value: string, isChecked: boolean) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[filterName] || []

      const newFilters = {
        ...prev,
        [filterName]: isChecked ? [...currentValues, value] : currentValues.filter((v) => v !== value),
      }

      setTimeout(() => updateUrl(), 0)
      return newFilters
    })
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setTimeout(() => updateUrl(), 500)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedFilters({
      types: [],
      topics: [],
      location: [],
    })
    router.push(`/events/client?tab=${activeTab}`)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("tab", value)
      router.push(`/events/client?${params.toString()}`)
    }, 0)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Climate Events</h1>
        <p className="text-gray-600">Discover climate-focused events, conferences, and networking opportunities.</p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <FilterSidebar
            title="Filter Events"
            filters={[
              { name: "types", options: eventTypes },
              { name: "topics", options: topics },
              { name: "location", options: locations },
            ]}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onSearchChange={handleSearchChange}
            onClearFilters={clearFilters}
            showSearch={true}
          />
        </div>

        <div className="md:col-span-3">
          {loading ? (
            <div className="text-center py-12">
              <p>Loading events...</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No events found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search terms.</p>
              <button onClick={clearFilters} className="text-green-600 hover:text-green-700 font-medium">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

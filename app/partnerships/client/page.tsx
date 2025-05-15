"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PartnershipCard } from "@/components/ui-components/partnership-card"
import { FilterSidebar } from "@/components/ui-components/filter-sidebar"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/types/supabase"

type Partnership = Database["public"]["Tables"]["partnerships"]["Row"]

// Filter options
const partnershipTypes = [
  { id: "teammate", label: "Find Teammate" },
  { id: "investor", label: "Find Investor" },
  { id: "project", label: "Join Project" },
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
  { id: "remote", label: "Remote" },
  { id: "san francisco", label: "San Francisco, CA" },
  { id: "new york", label: "New York, NY" },
  { id: "washington", label: "Washington, DC" },
  { id: "boulder", label: "Boulder, CO" },
  { id: "austin", label: "Austin, TX" },
  { id: "portland", label: "Portland, OR" },
  { id: "los angeles", label: "Los Angeles, CA" },
]

export default function PartnershipsClientPage() {
  const [partnerships, setPartnerships] = useState<Partnership[]>([])
  const [filteredPartnerships, setFilteredPartnerships] = useState<Partnership[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    type: [],
    topics: [],
    location: [],
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Initialize filters from URL params
  useEffect(() => {
    const types = searchParams.get("types")?.split(",") || []
    const topics = searchParams.get("topics")?.split(",") || []
    const location = searchParams.get("location") ? [searchParams.get("location") as string] : []
    const search = searchParams.get("search") || ""

    setSelectedFilters({
      type: types,
      topics: topics,
      location: location,
    })

    setSearchTerm(search)
  }, [searchParams])

  // Fetch partnerships
  useEffect(() => {
    async function fetchPartnerships() {
      setLoading(true)
      const { data, error } = await supabase.from("partnerships").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching partnerships:", error)
      } else {
        setPartnerships(data || [])
      }
      setLoading(false)
    }

    fetchPartnerships()
  }, [])

  // Apply filters
  useEffect(() => {
    let results = partnerships

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      results = results.filter(
        (partnership) =>
          partnership.title.toLowerCase().includes(term) || partnership.description.toLowerCase().includes(term),
      )
    }

    // Filter by type
    if (selectedFilters.type.length > 0) {
      results = results.filter((partnership) => selectedFilters.type.includes(partnership.type))
    }

    // Filter by topic
    if (selectedFilters.topics.length > 0) {
      results = results.filter((partnership) =>
        selectedFilters.topics.some((topic) => partnership.topic.includes(topic)),
      )
    }

    // Filter by location
    if (selectedFilters.location.length > 0) {
      results = results.filter(
        (partnership) =>
          partnership.location &&
          selectedFilters.location.some((location) =>
            partnership.location?.toLowerCase().includes(location.toLowerCase()),
          ),
      )
    }

    setFilteredPartnerships(results)
  }, [partnerships, searchTerm, selectedFilters])

  // Update URL with filters
  const updateUrl = () => {
    const params = new URLSearchParams()

    if (selectedFilters.type.length > 0) {
      params.set("types", selectedFilters.type.join(","))
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

    router.push(`/partnerships/client?${params.toString()}`)
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
      type: [],
      topics: [],
      location: [],
    })
    router.push("/partnerships/client")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Partnership Opportunities</h1>
        <p className="text-gray-600">Find teammates, investors, or join exciting climate projects.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <FilterSidebar
            title="Filter Partnerships"
            filters={[
              { name: "type", options: partnershipTypes },
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
              <p>Loading partnerships...</p>
            </div>
          ) : filteredPartnerships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPartnerships.map((partnership) => (
                <PartnershipCard key={partnership.id} partnership={partnership} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No partnerships found</h3>
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

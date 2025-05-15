import { createClient } from "@/lib/supabase/server"
import { PartnershipCard } from "@/components/ui-components/partnership-card"
import { FilterSidebar } from "@/components/ui-components/filter-sidebar"

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

export default async function PartnershipsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createClient()

  // Build query based on search params
  let query = supabase.from("partnerships").select("*")

  // Apply type filter
  const types = searchParams.types ? String(searchParams.types).split(",") : []
  if (types.length > 0) {
    query = query.in("type", types)
  }

  // Apply topic filter
  const topicParams = searchParams.topics ? String(searchParams.topics).split(",") : []
  if (topicParams.length > 0) {
    // For simplicity, we'll just filter by the first topic
    // In a real app, you might want to use a more complex query or tags
    if (topicParams.length === 1) {
      query = query.ilike("topic", `%${topicParams[0]}%`)
    } else {
      // This is a simplified approach - in a real app you might use a different strategy
      query = query.or(topicParams.map((topic) => `topic.ilike.%${topic}%`).join(","))
    }
  }

  // Apply location filter
  const location = searchParams.location ? String(searchParams.location) : null
  if (location) {
    query = query.ilike("location", `%${location}%`)
  }

  // Apply search term
  const search = searchParams.search ? String(searchParams.search) : null
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }

  // Order by created_at
  query = query.order("created_at", { ascending: false })

  // Execute query
  const { data: partnerships, error } = await query

  if (error) {
    console.error("Error fetching partnerships:", error)
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
            selectedFilters={{
              type: types,
              topics: topicParams,
              location: location ? [location] : [],
            }}
            onFilterChange={() => {}}
            onSearchChange={() => {}}
            onClearFilters={() => {}}
            showSearch={true}
          />
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Note: This is a server-rendered page. To use the filters, please use the client-side version at{" "}
              <a href="/partnerships/client" className="underline">
                /partnerships/client
              </a>
            </p>
          </div>
        </div>

        <div className="md:col-span-3">
          {partnerships && partnerships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partnerships.map((partnership) => (
                <PartnershipCard key={partnership.id} partnership={partnership} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No partnerships found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search terms.</p>
              <a href="/partnerships" className="text-green-600 hover:text-green-700 font-medium">
                Clear all filters
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { createClient } from "@/lib/supabase/server"
import { EventCard } from "@/components/ui-components/event-card"
import { FilterSidebar } from "@/components/ui-components/filter-sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createClient()

  // Determine if we're showing upcoming or past events
  const showTab = searchParams.tab || "upcoming"
  const now = new Date().toISOString()

  // Build query based on search params
  let query = supabase.from("events").select("*")

  // Filter by upcoming/past
  if (showTab === "upcoming") {
    query = query.gte("start_date", now).order("start_date", { ascending: true })
  } else {
    query = query.lt("start_date", now).order("start_date", { ascending: false })
  }

  // Apply event type filter (virtual/in-person)
  const types = searchParams.types ? String(searchParams.types).split(",") : []
  if (types.includes("virtual")) {
    query = query.eq("is_virtual", true)
  } else if (types.includes("in-person")) {
    query = query.eq("is_virtual", false)
  }

  // Apply topic filter
  const topicParams = searchParams.topics ? String(searchParams.topics).split(",") : []
  if (topicParams.length > 0) {
    // For simplicity, we'll just filter by the first topic
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

  // Execute query
  const { data: events, error } = await query

  if (error) {
    console.error("Error fetching events:", error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Climate Events</h1>
        <p className="text-gray-600">Discover climate-focused events, conferences, and networking opportunities.</p>
      </div>

      <Tabs defaultValue={showTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="upcoming" asChild>
            <a href="/events?tab=upcoming">Upcoming Events</a>
          </TabsTrigger>
          <TabsTrigger value="past" asChild>
            <a href="/events?tab=past">Past Events</a>
          </TabsTrigger>
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
            selectedFilters={{
              types: types,
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
              <a href="/events/client" className="underline">
                /events/client
              </a>
            </p>
          </div>
        </div>

        <div className="md:col-span-3">
          {events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No events found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search terms.</p>
              <a href={`/events?tab=${showTab}`} className="text-green-600 hover:text-green-700 font-medium">
                Clear all filters
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

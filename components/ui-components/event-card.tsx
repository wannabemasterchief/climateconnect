import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Globe } from "lucide-react"
import type { Database } from "@/lib/types/supabase"

type Event = Database["public"]["Tables"]["events"]["Row"]

export function EventCard({ event }: { event: Event }) {
  // Format dates
  const startDate = new Date(event.start_date)
  const endDate = new Date(event.end_date)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const dateDisplay =
    startDate.toDateString() === endDate.toDateString()
      ? formatDate(startDate)
      : `${formatDate(startDate)} - ${formatDate(endDate)}`

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex items-center text-sm font-medium text-green-600 mb-2">
          <Calendar size={16} className="mr-1" />
          {dateDisplay}
        </div>
        <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-gray-100 px-2 py-1 rounded text-sm">{event.topic}</span>
          {event.is_virtual ? (
            <span className="bg-gray-100 px-2 py-1 rounded text-sm flex items-center">
              <Globe size={14} className="mr-1" /> Virtual
            </span>
          ) : event.location ? (
            <span className="bg-gray-100 px-2 py-1 rounded text-sm flex items-center">
              <MapPin size={14} className="mr-1" /> {event.location}
            </span>
          ) : null}
        </div>
      </div>
      <div className="px-6 pb-6">
        <Link href={`/events/${event.id}`}>
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  )
}

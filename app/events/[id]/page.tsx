import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, MapPin, Globe, Video } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function EventDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()

  const { data: event, error } = await supabase.from("events").select("*").eq("id", params.id).single()

  if (error || !event) {
    notFound()
  }

  // Format dates
  const startDate = new Date(event.start_date)
  const endDate = new Date(event.end_date)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isSameDay = startDate.toDateString() === endDate.toDateString()

  const dateDisplay = isSameDay ? formatDate(startDate) : `${formatDate(startDate)} - ${formatDate(endDate)}`

  const timeDisplay = `${formatTime(startDate)} - ${formatTime(endDate)}`

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/events" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
        <ArrowLeft size={16} className="mr-1" /> Back to Events
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {event.is_virtual ? "Virtual Event" : "In-Person Event"}
            </span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
              {event.topic}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-6">{event.title}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar size={20} className="mr-3 text-gray-400 mt-0.5" />
                <div>
                  <h3 className="font-medium">Date</h3>
                  <p>{dateDisplay}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock size={20} className="mr-3 text-gray-400 mt-0.5" />
                <div>
                  <h3 className="font-medium">Time</h3>
                  <p>{timeDisplay}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {event.is_virtual ? (
                <div className="flex items-start">
                  <Video size={20} className="mr-3 text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Virtual Event</h3>
                    <p>This event will be held online</p>
                  </div>
                </div>
              ) : event.location ? (
                <div className="flex items-start">
                  <MapPin size={20} className="mr-3 text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p>{event.location}</p>
                  </div>
                </div>
              ) : null}

              {event.website && (
                <div className="flex items-start">
                  <Globe size={20} className="mr-3 text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Website</h3>
                    <a
                      href={event.website.startsWith("http") ? event.website : `https://${event.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700"
                    >
                      Visit event website
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <h2 className="text-xl font-semibold mb-4">About This Event</h2>
            <p className="whitespace-pre-line">{event.description}</p>
          </div>

          <div className="mt-8">
            <Button className="bg-green-600 hover:bg-green-700">Register for This Event</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Calendar, Globe } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { PartnershipCard } from "@/components/ui-components/partnership-card"
import { EventCard } from "@/components/ui-components/event-card"

export default async function Home() {
  const supabase = createClient()

  // Fetch recent partnerships and events
  const { data: recentPartnerships } = await supabase
    .from("partnerships")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3)

  const { data: upcomingEvents } = await supabase
    .from("events")
    .select("*")
    .gte("start_date", new Date().toISOString())
    .order("start_date", { ascending: true })
    .limit(3)

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Accelerate Climate Action Through Collaboration</h1>
            <p className="text-xl mb-8">
              Connect with climate innovators, investors, and changemakers to build a sustainable future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/partnerships">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                  Find Partnerships
                </Button>
              </Link>
              <Link href="/events">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Discover Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How ClimateConnect Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Find Partnerships</h3>
              <p className="text-gray-600">
                Connect with potential teammates, investors, or join exciting climate projects.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Attend Events</h3>
              <p className="text-gray-600">
                Discover climate-focused events, conferences, and networking opportunities.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Make an Impact</h3>
              <p className="text-gray-600">
                Collaborate on solutions that address the climate crisis and create a sustainable future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Partnerships */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Recent Partnership Opportunities</h2>
            <Link href="/partnerships" className="text-green-600 hover:text-green-700 flex items-center">
              View all <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {recentPartnerships && recentPartnerships.length > 0 ? (
              recentPartnerships.map((partnership) => (
                <PartnershipCard key={partnership.id} partnership={partnership} />
              ))
            ) : (
              <div className="md:col-span-3 text-center py-8">
                <p className="text-gray-500">No partnerships available yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Upcoming Events</h2>
            <Link href="/events" className="text-green-600 hover:text-green-700 flex items-center">
              View all <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {upcomingEvents && upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              <div className="md:col-span-3 text-center py-8">
                <p className="text-gray-500">No upcoming events available yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join ClimateConnect today and be part of the global community working towards a sustainable future.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

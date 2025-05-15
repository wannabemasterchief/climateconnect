import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const user = session.user

  // Fetch user's partnerships
  const { data: userPartnerships } = await supabase
    .from("partnerships")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch user's events
  const { data: userEvents } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", user.id)
    .order("start_date", { ascending: true })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-2">Welcome, {user.email}</h2>
          <p className="text-gray-600 mb-4">Manage your climate partnerships and events from your dashboard.</p>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/profile">Edit Profile</Link>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-2">My Partnerships</h2>
          <p className="text-gray-600 mb-4">You have {userPartnerships?.length || 0} partnership opportunities.</p>
          <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
            <Link href="/partnerships/create">Create New Partnership</Link>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-2">My Events</h2>
          <p className="text-gray-600 mb-4">You have {userEvents?.length || 0} events.</p>
          <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
            <Link href="/events/create">Create New Event</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Partnerships</h2>
            <Link href="/partnerships/create" className="text-green-600 hover:text-green-700 text-sm font-medium">
              + Add New
            </Link>
          </div>

          {userPartnerships && userPartnerships.length > 0 ? (
            <div className="space-y-4">
              {userPartnerships.map((partnership) => (
                <div key={partnership.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="font-medium mb-1">{partnership.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {partnership.type} • {partnership.topic}
                  </p>
                  <div className="flex justify-end">
                    <Link
                      href={`/partnerships/${partnership.id}/edit`}
                      className="text-sm text-green-600 hover:text-green-700"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
              <p className="text-gray-500 mb-4">You haven't created any partnerships yet.</p>
              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <Link href="/partnerships/create">Create Your First Partnership</Link>
              </Button>
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Events</h2>
            <Link href="/events/create" className="text-green-600 hover:text-green-700 text-sm font-medium">
              + Add New
            </Link>
          </div>

          {userEvents && userEvents.length > 0 ? (
            <div className="space-y-4">
              {userEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="font-medium mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(event.start_date).toLocaleDateString()} • {event.topic}
                  </p>
                  <div className="flex justify-end">
                    <Link href={`/events/${event.id}/edit`} className="text-sm text-green-600 hover:text-green-700">
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
              <p className="text-gray-500 mb-4">You haven't created any events yet.</p>
              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <Link href="/events/create">Create Your First Event</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, MapPin, Mail, Globe } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function PartnershipDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()

  const { data: partnership, error } = await supabase.from("partnerships").select("*").eq("id", params.id).single()

  if (error || !partnership) {
    notFound()
  }

  // Format date
  const createdAt = new Date(partnership.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/partnerships" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
        <ArrowLeft size={16} className="mr-1" /> Back to Partnerships
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
              {partnership.type}
            </span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
              {partnership.topic}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-4">{partnership.title}</h1>

          <div className="flex items-center text-gray-500 text-sm mb-6">
            <Calendar size={16} className="mr-1" />
            <span>Posted on {createdAt}</span>

            {partnership.location && (
              <>
                <span className="mx-2">•</span>
                <MapPin size={16} className="mr-1" />
                <span>{partnership.location}</span>
              </>
            )}
          </div>

          <div className="prose max-w-none mb-8">
            <p className="whitespace-pre-line">{partnership.description}</p>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>

            <div className="space-y-3">
              {partnership.contact_email && (
                <div className="flex items-center">
                  <Mail size={18} className="mr-2 text-gray-400" />
                  <a href={`mailto:${partnership.contact_email}`} className="text-green-600 hover:text-green-700">
                    {partnership.contact_email}
                  </a>
                </div>
              )}

              {partnership.website && (
                <div className="flex items-center">
                  <Globe size={18} className="mr-2 text-gray-400" />
                  <a
                    href={
                      partnership.website.startsWith("http") ? partnership.website : `https://${partnership.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700"
                  >
                    {partnership.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <Button className="bg-green-600 hover:bg-green-700">Contact About This Opportunity</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

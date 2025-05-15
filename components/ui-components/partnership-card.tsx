import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Database } from "@/lib/types/supabase"

type Partnership = Database["public"]["Tables"]["partnerships"]["Row"]

export function PartnershipCard({ partnership }: { partnership: Partnership }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="p-6 flex-grow">
        <div className="text-sm font-medium text-green-600 mb-2">{partnership.type}</div>
        <h3 className="text-lg font-semibold mb-2">{partnership.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{partnership.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-gray-100 px-2 py-1 rounded text-sm">{partnership.topic}</span>
          {partnership.location && (
            <span className="bg-gray-100 px-2 py-1 rounded text-sm">{partnership.location}</span>
          )}
        </div>
      </div>
      <div className="px-6 pb-6">
        <Link href={`/partnerships/${partnership.id}`}>
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  )
}

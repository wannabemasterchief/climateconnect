"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

interface FilterOption {
  id: string
  label: string
}

interface FilterSidebarProps {
  title: string
  filters: {
    name: string
    options: FilterOption[]
  }[]
  selectedFilters: Record<string, string[]>
  onFilterChange: (filterName: string, value: string, isChecked: boolean) => void
  onSearchChange?: (value: string) => void
  onClearFilters: () => void
  showSearch?: boolean
}

export function FilterSidebar({
  title,
  filters,
  selectedFilters,
  onFilterChange,
  onSearchChange,
  onClearFilters,
  showSearch = true,
}: FilterSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    if (onSearchChange) {
      onSearchChange(value)
    }
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    onClearFilters()
  }

  const hasActiveFilters = Object.values(selectedFilters).some((values) => values.length > 0) || searchTerm.length > 0

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-8 px-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <X size={14} className="mr-1" /> Clear
          </Button>
        )}
      </div>

      {showSearch && (
        <div className="relative mb-6">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Search..." className="pl-8" value={searchTerm} onChange={handleSearchChange} />
        </div>
      )}

      <div className="space-y-6">
        {filters.map((filter) => (
          <div key={filter.name}>
            <h3 className="font-medium mb-2">{filter.name}</h3>
            <div className="space-y-2">
              {filter.options.map((option) => (
                <div key={option.id} className="flex items-center">
                  <Checkbox
                    id={`${filter.name}-${option.id}`}
                    checked={selectedFilters[filter.name]?.includes(option.id) || false}
                    onCheckedChange={(checked) => {
                      onFilterChange(filter.name, option.id, checked === true)
                    }}
                  />
                  <Label htmlFor={`${filter.name}-${option.id}`} className="ml-2 text-sm font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

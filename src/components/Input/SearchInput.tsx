"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'

interface SearchInputProps {
  handleSearch: (searchTerm: string, tags: string[]) => void
}

const SearchInput: React.FC<SearchInputProps> = ({ handleSearch }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [tags, setTags] = useState<string[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    if (value.includes(",")) {
      const newTags = value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "" && !tags.includes(tag))
      setTags([...tags, ...newTags])
      setSearchTerm("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (searchTerm.trim()) {
        setTags([...tags, searchTerm.trim()])
        setSearchTerm("")
        handleSearch(searchTerm, [...tags, searchTerm.trim()])
      } else {
        handleSearch(searchTerm, tags)
      }
    }
  }

  return (
    <div className="flex w-[100vw] gap-4 p-4">
      <div className="flex flex-wrap items-center w-full gap-2 border rounded-md md:w-1/2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center gap-1 px-2 py-1 text-sm rounded-md bg-secondary text-secondary-foreground"
          >
            <span>{tag}</span>
            <button
              onClick={() => removeTag(tag)}
              className="hover:text-foreground text-muted-foreground"
            >
              <X className="w-3 h-3" />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </div>
        ))}
        <Input
          type="text"
          placeholder={tags.length === 0 ? "Search by zipcode" : ""}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 border-none shadow-none focus-visible:ring-0"
        />
      </div>
      <div className="flex justify-end">
        <Button size={'lg'} onClick={() => handleSearch(searchTerm, tags)}>Search</Button>
      </div>
    </div>
  )
}

export default SearchInput


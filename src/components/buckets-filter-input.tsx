'use client'
import { useState, useEffect } from 'react' // Import useState and useEffect
import { useRouter, useSearchParams } from 'next/navigation'
import { Bucket } from "@/lib/b2-mock-api"

export default function BucketsFilterInput() {
    
    const router = useRouter()
    const searchParams = useSearchParams()
    
    // Get the initial filter value from the URL search params
    const initialFilter = searchParams.get('filter') || ''

    // Use a local state to control the input's value for immediate feedback
    const [inputValue, setInputValue] = useState(initialFilter)

    // Effect to update inputValue when the URL's filter changes (e.g., via browser back/forward)
    useEffect(() => {
        setInputValue(initialFilter)
    }, [initialFilter]) // Depend on initialFilter (which comes from searchParams)

    // Debounce logic
    useEffect(() => {
        const handler = setTimeout(() => {
            // Only update the URL if the inputValue is different from the current URL filter
            // This prevents unnecessary router.replace calls when component re-renders
            if (inputValue === initialFilter) {
                return;
            }

            const newFilter = inputValue
            const params = new URLSearchParams(searchParams.toString())

            if (newFilter) {
                params.set('filter', newFilter)
            } else {
                params.delete('filter')
            }
            router.replace(`?${params.toString()}`)
        }, 500) // Debounce delay: 500ms

        // Cleanup: Clear the timeout if the component unmounts or inputValue changes
        return () => {
            clearTimeout(handler)
        }
    }, [inputValue, router, searchParams, initialFilter]) // Depend on inputValue, router, searchParams, and initialFilter

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value) // Update local state immediately
    }
    
    return (
        <div className="flex items-center gap-2 mb-2">
            <input
                type="text"
                placeholder="Filter buckets"
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                value={inputValue} // Input value controlled by local state
                onKeyUp={e => e.key === 'Escape' && setInputValue('')}
                onChange={handleFilterChange}
            />
        </div>
    )
    
}

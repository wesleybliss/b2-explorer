'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { Bucket } from '@/lib/b2-mock-api'
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSkeleton } from '@/components/ui/sidebar'

interface BucketListProps {
  buckets: Bucket[];
}

export function BucketList({ buckets }: BucketListProps) {
    
    const pathname = usePathname()
    const searchParams = useSearchParams()
    
    // Get the filter value from the URL search params
    const filter = searchParams.get('filter') || ''
    
    const filteredBuckets = filter
        ? buckets.filter(bucket => bucket.name.toLowerCase().includes(filter))
        : buckets
    
    return (
        <SidebarMenu>
            {filteredBuckets.map(bucket => {
                const isActive = pathname === `/dashboard/bucket/${bucket.name}`
                
                return (
                    <SidebarMenuItem key={bucket.id}>
                        <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            tooltip={{ children: bucket.name }}>
                            <Link href={`/dashboard/bucket/${bucket.name}`}>
                                <span>{bucket.name}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                )
            })}
        </SidebarMenu>
    )
}

BucketList.Skeleton = function BucketListSkeleton() {
    return (
        <div className="p-2">
            <div className="flex flex-col gap-1">
                <SidebarMenuSkeleton showIcon />
                <SidebarMenuSkeleton showIcon />
                <SidebarMenuSkeleton showIcon />
                <SidebarMenuSkeleton showIcon />
            </div>
        </div>
    )
}

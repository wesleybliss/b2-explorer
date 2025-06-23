import { getBuckets } from '@/lib/b2-mock-api'
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarTrigger, SidebarContent } from '@/components/ui/sidebar'
import { BucketList } from '@/components/bucket-list'
import { Suspense } from 'react'

export default async function DashboardLayout({
    children,
}: {
  children: React.ReactNode;
}) {
    const buckets = await getBuckets()
    
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <div className="flex items-center gap-2 p-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6 text-primary">
                            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                        </svg>
                        <span className="font-semibold font-headline text-lg group-data-[collapsible=icon]:hidden">B2 Explorer</span>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <Suspense fallback={<BucketList.Skeleton />}>
                        <BucketList buckets={buckets} />
                    </Suspense>
                </SidebarContent>
            </Sidebar>
            <SidebarInset>
                <header className="flex items-center gap-2 p-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
                    <SidebarTrigger />
                    <h2 className="text-lg font-semibold font-headline tracking-tight">File Browser</h2>
                </header>
                <main className="flex-1">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

import { Suspense } from 'react'
import { LoginForm } from '@/components/login-form'

export default function Home() {
    return (
        <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-8">
            <div className="flex flex-col items-center space-y-2 text-center mb-8">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-12 w-12 text-primary">
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                    <path d="m3.3 7 8.7 5 8.7-5"></path>
                    <path d="M12 22V12"></path>
                </svg>
                <h1 className="text-4xl font-bold font-headline">B2 Explorer</h1>
                <p className="text-muted-foreground">A simple interface to browse your Backblaze B2 buckets.</p>
            </div>
            <Suspense fallback={<div>Loading form...</div>}>
                <LoginForm />
            </Suspense>
        </main>
    )
}

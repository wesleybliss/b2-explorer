import { FolderOpen } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 items-center justify-center" style={{ height: 'calc(100vh - 65px)' }}>
      <div className="text-center space-y-4 p-4">
        <FolderOpen className="mx-auto h-24 w-24 text-muted-foreground/50" strokeWidth={1} />
        <h2 className="text-2xl font-semibold font-headline">Select a Bucket</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Choose a bucket from the navigation panel on the left to start browsing your files.
        </p>
      </div>
    </div>
  );
}

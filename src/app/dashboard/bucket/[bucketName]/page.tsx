import { getFiles } from "@/lib/b2-mock-api";
import { FileBrowser } from "@/components/file-browser";
import { Info } from "lucide-react";

interface PageProps {
  params: {
    bucketName: string;
  };
}

export default async function BucketPage({ params }: PageProps) {
  const files = await getFiles(params.bucketName);

  if (files.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center" style={{ height: 'calc(100vh - 65px)' }}>
        <div className="text-center space-y-4 p-4">
          <Info className="mx-auto h-24 w-24 text-muted-foreground/50" strokeWidth={1} />
          <h2 className="text-2xl font-semibold font-headline">Empty Bucket</h2>
          <p className="text-muted-foreground">This bucket does not contain any files.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <FileBrowser files={files} />
    </div>
  );
}

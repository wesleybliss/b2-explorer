export interface Bucket {
  id: string;
  name: string;
}

export interface B2File {
  id: string;
  name: string;
  size: number; // in bytes
  lastModified: string;
}

const buckets: Bucket[] = [
  { id: "bucket-1", name: "photos-backup" },
  { id: "bucket-2", name: "project-archives" },
  { id: "bucket-3", name: "website-assets" },
  { id: "bucket-4", name: "personal-documents" },
];

const files: Record<string, B2File[]> = {
  "photos-backup": [
    { id: "file-1a", name: "vacation-2023.zip", size: 1024 * 1024 * 500, lastModified: "2023-10-26" },
    { id: "file-1b", name: "family-gathering.jpg", size: 1024 * 1024 * 5, lastModified: "2023-08-15" },
    { id: "file-1c", name: "new-years-eve.mov", size: 1024 * 1024 * 1200, lastModified: "2024-01-01" },
  ],
  "project-archives": [
    { id: "file-2a", name: "project-alpha-final.zip", size: 1024 * 1024 * 250, lastModified: "2022-12-20" },
    { id: "file-2b", name: "project-beta-wireframes.pdf", size: 1024 * 1024 * 15, lastModified: "2023-02-10" },
  ],
  "website-assets": [
    { id: "file-3a", name: "logo.svg", size: 1024 * 10, lastModified: "2024-03-01" },
    { id: "file-3b", name: "hero-image.png", size: 1024 * 800, lastModified: "2024-03-05" },
    { id: "file-3c", name: "main.css", size: 1024 * 150, lastModified: "2024-03-10" },
  ],
  "personal-documents": [
     { id: "file-4a", name: "resume.pdf", size: 1024 * 200, lastModified: "2024-02-28" },
     { id: "file-4b", name: "tax-returns-2023.pdf", size: 1024 * 1024 * 2, lastModified: "2024-03-11" },
  ],
};

export const getBuckets = async (): Promise<Bucket[]> => {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 500));
  return buckets;
};

export const getFiles = async (bucketName: string): Promise<B2File[]> => {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 800));
  return files[bucketName] || [];
};

"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { File, ArrowUpDown } from "lucide-react";
import type { B2File } from "@/lib/b2-mock-api";
import { formatBytes } from "@/lib/utils";

type SortKey = keyof B2File;
type SortDirection = "asc" | "desc";

interface FileBrowserProps {
  files: B2File[];
}

export function FileBrowser({ files }: FileBrowserProps) {
  const [sortKey, setSortKey] = React.useState<SortKey>("name");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedFiles = React.useMemo(() => {
    return [...files].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [files, sortKey, sortDirection]);

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />;
    }
    return sortDirection === 'asc' ? 
      <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg> :
      <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
  };

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <span className="sr-only">Icon</span>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("name")} className="px-2">
                Name
                {renderSortIcon("name")}
              </Button>
            </TableHead>
            <TableHead className="w-[150px]">
              <Button variant="ghost" onClick={() => handleSort("size")} className="w-full justify-end px-2">
                Size
                {renderSortIcon("size")}
              </Button>
            </TableHead>
            <TableHead className="hidden md:table-cell w-[200px]">
              <Button variant="ghost" onClick={() => handleSort("lastModified")} className="w-full justify-end px-2">
                Last Modified
                {renderSortIcon("lastModified")}
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedFiles.map((file) => (
            <TableRow key={file.id} className="transition-colors hover:bg-accent/50">
              <TableCell className="pl-4">
                <File className="h-5 w-5 text-muted-foreground" />
              </TableCell>
              <TableCell className="font-medium">{file.name}</TableCell>
              <TableCell className="text-right tabular-nums">{formatBytes(file.size)}</TableCell>
              <TableCell className="hidden md:table-cell text-right text-muted-foreground">{file.lastModified}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { File, Folder } from "lucide-react";
import type { B2File } from "@/lib/b2-mock-api";
import { formatBytes } from "@/lib/utils";

// Data structure for the file tree
interface FileNode {
  type: 'file';
  name: string;
  file: B2File;
}

interface FolderNode {
  type: 'folder';
  name: string;
  children: TreeNode[];
}

type TreeNode = FileNode | FolderNode;

// Helper function to build the tree
function buildFileTree(files: B2File[]): TreeNode[] {
  const root: FolderNode = { type: 'folder', name: 'root', children: [] };

  files.forEach(file => {
    // an empty file name can result from folder markers ending in "/"
    if (!file.name) return;
    const parts = file.name.split('/').filter(Boolean);
    let currentNode: FolderNode = root;

    parts.forEach((part, index) => {
      const isLastPart = index === parts.length - 1;

      if (isLastPart && !file.name.endsWith('/')) {
        // It's a file, unless it's a folder marker
        currentNode.children.push({
          type: 'file',
          name: part,
          file: file,
        });
      } else {
        // It's a folder
        let folderNode = currentNode.children.find(
          (node): node is FolderNode => node.type === 'folder' && node.name === part
        );

        if (!folderNode) {
          folderNode = {
            type: 'folder',
            name: part,
            children: [],
          };
          currentNode.children.push(folderNode);
        }
        currentNode = folderNode;
      }
    });
  });

  // Sort children: folders first, then files, both alphabetically
  const sortNodes = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.type === 'folder' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'folder') return 1;
      return a.name.localeCompare(b.name);
    });
    // Recursively sort children of folders
    nodes.forEach(node => {
      if (node.type === 'folder') {
        sortNodes(node.children);
      }
    });
  };

  sortNodes(root.children);

  return root.children;
}

// Recursive component to render the tree nodes
const FileTree: React.FC<{ nodes: TreeNode[] }> = ({ nodes }) => {
  if (!nodes || nodes.length === 0) {
    return null;
  }
  
  const folders = nodes.filter((node): node is FolderNode => node.type === 'folder');
  const files = nodes.filter((node): node is FileNode => node.type === 'file');

  return (
    <>
      <Accordion type="multiple" className="w-full">
        {folders.map((folder, index) => (
          <AccordionItem value={`${folder.name}-${index}`} key={`${folder.name}-${index}`} className="border-b-0">
            <AccordionTrigger className="hover:no-underline hover:bg-accent rounded-md px-2 py-1.5">
              <div className="flex items-center gap-2">
                <Folder className="h-5 w-5 text-blue-500" />
                <span className="font-normal text-sm">{folder.name}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-6 pt-1 pb-0">
              <FileTree nodes={folder.children} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {files.map((fileNode, index) => (
        <div key={`${fileNode.name}-${index}`} className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-accent/50 text-sm">
           <div className="flex items-center gap-2">
                <File className="h-5 w-5 text-muted-foreground" />
                <span className="font-normal">{fileNode.name}</span>
            </div>
            <div className="flex items-center gap-6 text-muted-foreground">
                <span className="w-[100px] text-right tabular-nums">{formatBytes(fileNode.file.size)}</span>
                <span className="w-[150px] text-right hidden md:block">{fileNode.file.lastModified}</span>
            </div>
        </div>
      ))}
    </>
  );
};


interface FileBrowserProps {
  files: B2File[];
}

export function FileBrowser({ files }: FileBrowserProps) {
  const fileTree = React.useMemo(() => buildFileTree(files), [files]);

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="flex items-center justify-between p-4 border-b font-medium text-sm text-muted-foreground">
        <div>Name</div>
        <div className="flex items-center gap-6">
          <div className="w-[100px] text-right">Size</div>
          <div className="w-[150px] text-right hidden md:block">Last Modified</div>
        </div>
      </div>
      <div className="p-2 space-y-1">
        <FileTree nodes={fileTree} />
      </div>
    </div>
  );
}
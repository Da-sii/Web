"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface SourcesDialogProps {
  sources: string[];
}

export function SourcesDialog({ sources }: SourcesDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="mt-3 cursor-pointer self-start text-xs text-gray-400 underline"
        >
          출처 자세히 보기
        </button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="gap-3 rounded-2xl px-5 py-5 sm:max-w-xs"
      >
        <DialogTitle className="text-sm font-bold">출처</DialogTitle>
        <ul className="flex flex-col gap-2 pl-1 text-sm">
          {sources.map((url) => (
            <li key={url} className="flex gap-2">
              <span
                aria-hidden
                className="mt-2 size-1 shrink-0 rounded-full bg-foreground"
              />
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 break-all text-green600 underline underline-offset-2"
              >
                {displayUrl(url)}
              </a>
            </li>
          ))}
        </ul>
        <DialogClose asChild>
          <button
            type="button"
            className="-mx-5 -mb-5 mt-2 cursor-pointer border-t border-gray100 py-3 text-center text-sm font-semibold text-green600"
          >
            확인
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

function displayUrl(raw: string) {
  return raw.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

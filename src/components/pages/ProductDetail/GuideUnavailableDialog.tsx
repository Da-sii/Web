"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface GuideUnavailableDialogProps {
  trigger: ReactNode;
}

export function GuideUnavailableDialog({ trigger }: GuideUnavailableDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="gap-3 rounded-2xl px-5 py-5 sm:max-w-xs"
      >
        <DialogTitle className="sr-only">성분 가이드 안내</DialogTitle>
        <p className="py-2 text-center text-sm">
          성분 가이드가 아직 등록되지 않았습니다.
        </p>
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

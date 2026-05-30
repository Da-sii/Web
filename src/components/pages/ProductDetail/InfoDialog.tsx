"use client";

import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type InfoKind = "functional" | "other";

const COPY: Record<InfoKind, { title: string; body: ReactNode }> = {
  functional: {
    title: "성분 정보의 출처",
    body: (
      <p className="text-sm leading-6">
        본 정보는 식품의약품안전처 건강기능식품 및 영양성분 기준을 참고했습니다.
        <br />
        (
        <a
          href="https://www.foodsafetykorea.go.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green600 underline"
        >
          https://www.foodsafetykorea.go.kr
        </a>
        )
      </p>
    ),
  },
  other: {
    title: "기타 원료?",
    body: (
      <p className="text-sm leading-6">
        해당 원료는 식품의약품안전처 기준 건강기능식품 기능성 안전 대상에 포함되지
        않은 원료입니다.
      </p>
    ),
  },
};

interface InfoDialogProps {
  kind: InfoKind;
  trigger: ReactNode;
}

export function InfoDialog({ kind, trigger }: InfoDialogProps) {
  const [open, setOpen] = useState(false);
  const copy = COPY[kind];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="gap-3 rounded-2xl px-5 py-5 sm:max-w-xs"
      >
        <DialogTitle className="text-sm font-bold">{copy.title}</DialogTitle>
        {copy.body}
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

"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  submitAdvertisementInquiry,
  type AdvertisementInquiryType,
  type AdvertisementLaunchStatus,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const INQUIRY_TYPES: ReadonlyArray<{ label: string; value: AdvertisementInquiryType }> = [
  { label: "국내 광고 문의", value: "domestic" },
  { label: "글로벌 광고 문의", value: "global" },
  { label: "기타 문의 (제휴 등)", value: "other" },
];

const LAUNCH_STATUSES: ReadonlyArray<{ label: string; value: AdvertisementLaunchStatus }> = [
  { label: "출시 완료", value: "launched" },
  { label: "미출시 (1개월 내 출시 예정)", value: "within_1_month" },
  { label: "미출시 (3개월 내 출시 예정)", value: "within_3_months" },
  { label: "미출시 (3개월 이상 소요 예정)", value: "over_3_months" },
];

const CONTENT_MIN = 20;
const CONTENT_MAX = 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function InquiryPage() {
  const router = useRouter();
  const [inquiryType, setInquiryType] = useState<AdvertisementInquiryType | null>(null);
  const [brandName, setBrandName] = useState("");
  const [launchStatus, setLaunchStatus] = useState<AdvertisementLaunchStatus | null>(null);
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const emailValid = email.length === 0 || EMAIL_PATTERN.test(email);

  const isSubmittable = useMemo(() => {
    if (!inquiryType) return false;
    if (brandName.trim().length === 0) return false;
    if (!launchStatus) return false;
    if (content.trim().length < CONTENT_MIN) return false;
    if (name.trim().length === 0) return false;
    if (phone.trim().length === 0) return false;
    if (!EMAIL_PATTERN.test(email)) return false;
    if (!agreed) return false;
    return true;
  }, [inquiryType, brandName, launchStatus, content, name, phone, email, agreed]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSubmittable || submitting) return;
    setSubmitting(true);
    try {
      await submitAdvertisementInquiry({
        inquiry_type: inquiryType!,
        brand_name: brandName.trim(),
        launch_status: launchStatus!,
        inquiry_content: content.trim(),
        name: name.trim(),
        contact_number: phone.trim(),
        email: email.trim(),
      });
      toast.success("문의가 접수되었습니다. 영업일 기준 1일 내로 답변드리겠습니다.");
      router.back();
    } catch {
      toast.error("문의 접수에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex min-h-full flex-col">
      <div className="flex-1 px-5 pt-2 pb-6">
        <h2 className="text-2xl font-extrabold">다시, 광고 문의하기</h2>
        <p className="mt-3 text-sm leading-5 text-gray-500">
          광고 및 제휴 관련 문의사항이 있으신 경우, 하기 폼을 입력해주시면
          <br />
          담당자가 확인 후 영업일 기준 1일 내로 답변드리겠습니다.
        </p>

        <Section label="문의 유형">
          <ul className="flex flex-col gap-2.5">
            {INQUIRY_TYPES.map(({ label, value }) => (
              <li key={value}>
                <CheckOption
                  checked={inquiryType === value}
                  onSelect={() => setInquiryType(value)}
                  label={label}
                />
              </li>
            ))}
          </ul>
        </Section>

        <Divider />

        <Section label="담당 브랜드명">
          <Input
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="담당 브랜드명을 입력해주세요."
            className="h-12 rounded-xl px-4"
          />
        </Section>

        <Divider />

        <Section label="브랜드 출시 여부">
          <ul className="flex flex-col gap-2.5">
            {LAUNCH_STATUSES.map(({ label, value }) => (
              <li key={value}>
                <CheckOption
                  checked={launchStatus === value}
                  onSelect={() => setLaunchStatus(value)}
                  label={label}
                />
              </li>
            ))}
          </ul>
        </Section>

        <Divider />

        <Section label="문의 내용">
          <div className="relative">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, CONTENT_MAX))}
              placeholder="광고 진행 예정일 및 목적을 자세하게 작성해주세요."
              className="min-h-36 rounded-xl px-4 py-3 pb-9 text-sm"
            />
            <span className="pointer-events-none absolute right-4 bottom-3 text-xs text-gray-400">
              <span className="text-gray-700">{content.length}</span> / {CONTENT_MAX.toLocaleString()} (최소 {CONTENT_MIN}자)
            </span>
          </div>
        </Section>

        <Divider />

        <Section label="성함">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="성함을 입력해주세요."
            className="h-12 rounded-xl px-4"
          />
        </Section>

        <Divider />

        <Section label="연락처">
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="연락처를 입력해주세요."
            className="h-12 rounded-xl px-4"
          />
        </Section>

        <Divider />

        <Section label="이메일 주소">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 주소를 입력해주세요."
            aria-invalid={!emailValid}
            className="h-12 rounded-xl px-4"
          />
          <p
            className={cn(
              "mt-2 flex items-center gap-1 text-xs",
              email.length === 0
                ? "text-gray-400"
                : emailValid
                  ? "text-green600"
                  : "text-red",
            )}
          >
            이메일 형식 <Check className="size-3" />
          </p>
        </Section>

        <Divider />

        <div className="flex w-full items-center justify-between py-3 text-sm">
          <button
            type="button"
            onClick={() => setAgreed((v) => !v)}
            aria-pressed={agreed}
            className="flex items-center gap-1.5"
          >
            <span className="text-red">*</span>
            <Check
              className={cn(
                "size-4",
                agreed ? "text-green600" : "text-gray-300",
              )}
            />
            <span className="text-gray-700">개인정보 수집 및 이용 동의</span>
          </button>
          <Link
            href="/terms/privacy"
            aria-label="개인정보 수집 및 이용 동의 자세히 보기"
            className="flex items-center"
          >
            <ChevronRight className="size-4 text-gray-400" />
          </Link>
        </div>
      </div>

      <div className="sticky bottom-0 border-t bg-background px-5 py-3">
        <Button
          type="submit"
          disabled={!isSubmittable || submitting}
          className={cn(
            "h-12 w-full rounded-xl text-base font-semibold",
            isSubmittable
              ? "bg-green600 text-white hover:bg-green600/90"
              : "bg-gray-200 text-gray-500",
          )}
        >
          {submitting ? "제출 중..." : "제출하기"}
        </Button>
      </div>
    </form>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h3 className="mb-3 flex items-center gap-1 text-sm font-bold">
        <span className="text-red">*</span>
        {label}
      </h3>
      {children}
    </section>
  );
}

function Divider() {
  return <hr className="mt-6 border-gray-100" />;
}

function CheckOption({
  checked,
  onSelect,
  label,
}: {
  checked: boolean;
  onSelect: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={checked}
      className="flex w-full items-center gap-2 text-left text-sm"
    >
      <Check
        className={cn(
          "size-4 shrink-0",
          checked ? "text-green600" : "text-gray-300",
        )}
      />
      <span className={cn(checked ? "text-gray-900" : "text-gray-400")}>
        {label}
      </span>
    </button>
  );
}

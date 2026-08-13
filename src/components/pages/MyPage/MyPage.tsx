import Link from "next/link";
import Icon from "@/components/commons/Icon/Icon";
import { APP_VERSION, SUPPORT_EMAIL } from "@/lib/app-store";
import { AppInstallCard } from "./AppInstallCard";

interface MenuLink {
  label: string;
  href: string;
  external?: boolean;
}

const GUIDE_LINKS: MenuLink[] = [
  { label: "서비스 이용 약관", href: "/terms/footerService" },
  { label: "개인정보 처리방침", href: "/terms/footerPrivacyUsage" },
  { label: "리뷰 운영 정책", href: "/terms/footerReviewPolicy" },
];

const CONTACT_LINKS: MenuLink[] = [
  { label: "광고/제휴 문의", href: "/inquiry" },
];

function SettingSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col">
      <h2 className="px-1 pb-1 text-xs font-bold text-gray-400">{title}</h2>
      <div className="flex flex-col divide-y divide-gray100">{children}</div>
    </section>
  );
}

function SettingLink({ label, href, external }: MenuLink) {
  const content = (
    <>
      <span className="text-sm text-gray900">{label}</span>
      <Icon icon="IC_ArrowRight" size="xs" className="text-gray-400" />
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        className="flex items-center justify-between py-4"
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className="flex items-center justify-between py-4">
      {content}
    </Link>
  );
}

function SettingValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-4">
      <span className="text-sm text-gray900">{label}</span>
      <span className="text-sm text-gray-400">{value}</span>
    </div>
  );
}

/**
 * 웹에는 로그인/내 리뷰가 없다. 앱 마이페이지의 계정 영역은 앱 설치 유도 카드가 대신하고,
 * 나머지는 앱과 동일한 약관·문의·버전 정보만 노출한다.
 */
export function MyPage() {
  return (
    <div className="flex flex-col gap-7 px-5 py-5">
      <AppInstallCard />

      <SettingSection title="안내">
        {GUIDE_LINKS.map((item) => (
          <SettingLink key={item.href} {...item} />
        ))}
      </SettingSection>

      <SettingSection title="문의">
        {CONTACT_LINKS.map((item) => (
          <SettingLink key={item.href} {...item} />
        ))}
        <SettingValue label="문의 메일" value={SUPPORT_EMAIL} />
      </SettingSection>

      <SettingSection title="앱 정보">
        <SettingValue label="버전 정보" value={`V ${APP_VERSION}`} />
      </SettingSection>
    </div>
  );
}

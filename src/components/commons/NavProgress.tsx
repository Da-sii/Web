"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";

/**
 * 페이지 이동 피드백.
 *
 * 라우트마다 loading.tsx 스켈레톤이 있지만 그 스켈레톤은 1초 뒤에야 나타난다
 * (globals.css `.delay-appear`). 그 첫 1초를 이 상단 바가 메운다.
 *
 * `useLinkStatus` 는 <Link> 의 자손에서만 동작하므로, 각 링크 안에 리포터를 심고
 * 상태를 컨텍스트로 끌어올려 폰 컬럼 상단에 하나의 바로 그린다.
 */

interface NavProgressContextValue {
  isPending: boolean;
  setPending: (key: string, pending: boolean) => void;
}

const NavProgressContext = createContext<NavProgressContextValue | null>(null);

let reporterId = 0;

export function NavProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pendingKeys, setPendingKeys] = useState<Set<string>>(new Set());
  const pathname = usePathname();
  // 이동이 커밋되면(=pathname이 바뀌면) 남아 있는 대기 상태를 모두 버린다.
  const [committedPath, setCommittedPath] = useState(pathname);

  const setPending = useCallback((key: string, pending: boolean) => {
    setPendingKeys((prev) => {
      if (pending === prev.has(key)) return prev;
      const next = new Set(prev);
      if (pending) next.add(key);
      else next.delete(key);
      return next;
    });
  }, []);

  // 렌더 중 상태 조정 — 이펙트로 처리하면 한 프레임 동안 바가 남는다.
  if (committedPath !== pathname) {
    setCommittedPath(pathname);
    if (pendingKeys.size > 0) setPendingKeys(new Set());
  }

  const value = useMemo(
    () => ({ isPending: pendingKeys.size > 0, setPending }),
    [pendingKeys, setPending],
  );

  return (
    <NavProgressContext.Provider value={value}>
      {children}
    </NavProgressContext.Provider>
  );
}

/**
 * router.push / startTransition 처럼 <Link> 밖에서 일어나는 이동을 바에 반영한다.
 * Provider 밖에서 호출해도 안전하게 no-op 이 된다.
 */
export function useNavProgress() {
  const ctx = useContext(NavProgressContext);
  const [key] = useState(() => `nav-${++reporterId}`);
  const setPending = ctx?.setPending;

  return useCallback(
    (pending: boolean) => setPending?.(key, pending),
    [setPending, key],
  );
}

/** <Link> 안에 넣는 대기 상태 리포터. 화면에는 아무것도 그리지 않는다. */
function LinkPendingReporter() {
  const ctx = useContext(NavProgressContext);
  const { pending } = useLinkStatus();
  const [key] = useState(() => `link-${++reporterId}`);
  const setPending = ctx?.setPending;

  useEffect(() => {
    setPending?.(key, pending);
    return () => setPending?.(key, false);
  }, [setPending, key, pending]);

  return null;
}

type PendingLinkProps = React.ComponentProps<typeof Link>;

/** 이동 대기 상태를 상단 바에 알리는 <Link>. 그 외에는 next/link 와 동일하다. */
export function PendingLink({ children, ...props }: PendingLinkProps) {
  return (
    <Link {...props}>
      {children}
      <LinkPendingReporter />
    </Link>
  );
}

export function NavProgressBar() {
  const ctx = useContext(NavProgressContext);
  if (!ctx?.isPending) return null;

  return (
    <div
      role="progressbar"
      aria-label="페이지 이동 중"
      aria-busy="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-50 h-0.5 overflow-hidden"
    >
      <div className="nav-progress-bar h-full w-full origin-left bg-green500" />
    </div>
  );
}

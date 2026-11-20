"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { createRecommendations } from "@/lib/api";
import { questions, buildSurveyPayload, type RecommendationResponse } from "@/lib/recommendation";
import { ANDROID_STORE_URL, IOS_STORE_URL } from "@/lib/app-store";
import { toCdnUrl } from "@/lib/cdn";
import { Button } from "@/components/ui/button";

export function RecommendationPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef(false);
  const visible = questions.filter(q => step === 1 ? q.id <= 3 : q.id > 3);
  const complete = visible.every(q => Array.isArray(answers[q.id]) ? answers[q.id].length > 0 : !!answers[q.id]);
  function reset() { setStep(0); setAnswers({}); setResult(null); setError(""); }
  async function submit() {
    if (pending.current || !questions.every(q => answers[q.id]?.length)) return;
    pending.current = true; setBusy(true); setError("");
    try { setResult(await createRecommendations(buildSurveyPayload(answers))); }
    catch (e) { setError(e instanceof Error ? e.message : "request-failed"); }
    finally { pending.current = false; setBusy(false); }
  }
  return <section className="flex flex-col gap-6 px-5 py-8">
    <h1 className="text-2xl font-bold">내 몸에 맞는 보조제 추천</h1>
    {busy ? <p role="status">내 상황에 맞는 성분을 분석하고 있어요…</p> : result ? <>
      <h2 className="text-xl font-bold">맞춤 성분 추천</h2>
      {result.recommendations.length === 0 && <p>추천 결과가 없습니다. 다시 시도해주세요.</p>}
      {result.recommendations.map((item, index) => {
        const score = Number.isFinite(item.fit_score) ? Math.max(0, Math.min(100, item.fit_score)) : 0;
        return <article key={item.ingredient_id} className="flex flex-col gap-3 rounded-2xl border p-4">
          <h3 className="text-lg font-bold">{index + 1}. {item.ingredient_name}</h3>
          <p>{item.intro}</p><p className="rounded-lg bg-green50 p-3">{item.reason}</p>
          <label>적합도 {score}% <progress className="w-full" max={100} value={score} /></label>
          <h4 className="font-bold">이 성분 함유 제품</h4>
          <div className="flex gap-3 overflow-x-auto">{(item.products ?? []).map(product =>
            <Link className="w-28 shrink-0" key={product.id} href={`/products/${product.id}`}>
              {product.thumbnail ? <img src={toCdnUrl(product.thumbnail)} alt={product.name} className="aspect-square w-full rounded-lg object-cover" /> : <div className="aspect-square rounded-lg bg-gray100" />}
              <p className="text-xs text-gray500">{product.company}</p><p className="text-sm">{product.name}</p>
            </Link>)}</div>
          {!item.products?.length && <p>관련 제품을 준비 중입니다.</p>}
        </article>;
      })}
      <Button onClick={reset}>다시 추천 받기</Button>
    </> : step === 0 ? <>
      <p>9가지 질문으로 내 건강 상태와 생활 습관에 최적화된 성분을 추천해드려요.</p>
      <ol className="space-y-4"><li>1. 기본 정보 입력 — 건강 목표, 나이대, 성별</li><li>2. 생활 습관 확인 — 운동, 카페인, 수면, 식사 등</li><li>3. 맞춤 성분 추천</li></ol>
      <p>[필수] 맞춤 분석 민감정보 수집 및 이용 동의 <Link className="underline" href="/terms/recommendationPrivacy" target="_blank">보기</Link></p>
      <Button onClick={() => setStep(1)}>동의 후 시작하기</Button>
      <Link href="/">다음에 하기</Link>
    </> : <>
      <p>{step === 1 ? "1. 기본 정보" : "2. 생활 습관"}</p>
      {visible.map(q => <fieldset key={q.id} className="space-y-3">
        <legend className="font-bold">{q.id}. {q.title}</legend>
        {q.subtitle && <p className="text-sm text-gray500">{q.subtitle}</p>}
        <div className="flex flex-wrap gap-2">{q.options.map(option => {
          const current = answers[q.id];
          const selected = Array.isArray(current) ? current.includes(option) : current === option;
          return <Button key={option} variant={selected ? "default" : "outline"} aria-pressed={selected} onClick={() => setAnswers(prev => {
            const old = Array.isArray(prev[q.id]) ? prev[q.id] as string[] : [];
            return { ...prev, [q.id]: q.multiple ? (old.includes(option) ? old.filter(x => x !== option) : [...old, option]) : option };
          })}>{option}</Button>;
        })}</div>
      </fieldset>)}
      {error && <div role="alert">{error === "guest-unavailable" ? <><p>현재 웹에서는 비회원 추천을 이용할 수 없습니다. 앱에서 추천받아보세요.</p><a className="underline mr-4" href={ANDROID_STORE_URL}>Android 앱</a><a className="underline" href={IOS_STORE_URL}>iOS 앱</a></> : <p>추천을 불러오지 못했어요. 다시 시도해주세요.</p>}</div>}
      <div className="flex gap-3"><Button variant="outline" onClick={() => { setStep(step - 1); setError(""); }}>이전</Button>
        <Button disabled={!complete} onClick={() => step === 1 ? setStep(2) : void submit()}>{step === 1 ? "다음" : error ? "다시 시도" : "추천 받기"}</Button>
      </div>
    </>}
  </section>;
}

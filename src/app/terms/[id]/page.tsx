import { notFound } from "next/navigation";
import { Markdown } from "@/components/commons/Markdown";
import { TERMS, getTermById } from "@/lib/terms";

interface TermsPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return TERMS.map((term) => ({ id: term.id }));
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { id } = await params;
  const term = getTermById(id);
  if (!term) notFound();

  return (
    <article className="px-5 py-6">
      <Markdown content={term.content} />
    </article>
  );
}

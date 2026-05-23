export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <section className="p-6">
      <h1 className="text-lg font-bold">제품 {id} 상세</h1>
    </section>
  );
}

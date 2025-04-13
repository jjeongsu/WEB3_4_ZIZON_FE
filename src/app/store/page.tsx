import StoreMainTemplate from '@/components/templates/store/storeMain/StoreMainTemplate';

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<{
    search: string;
  }>;
}) {
  const { search } = await searchParams;
  return (
    <div className=" flex justify-center">
      <StoreMainTemplate searchKeyword={search} />
    </div>
  );
}

export function SkeletonLine({ width = 'w-full', height = 'h-4' }) {
  return <div className={`${width} ${height} bg-gray-200 rounded animate-pulse`} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
      <SkeletonLine height="h-6" width="w-3/4" />
      <SkeletonLine width="w-full" />
      <SkeletonLine width="w-5/6" />
      <SkeletonLine height="h-10" width="w-1/3" />
    </div>
  );
}

export default SkeletonCard;

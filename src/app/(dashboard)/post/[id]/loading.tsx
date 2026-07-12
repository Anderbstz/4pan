export default function PostLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-2/3 bg-muted rounded animate-pulse" />
      <div className="h-3 w-full bg-muted rounded animate-pulse" />
      <div className="h-3 w-5/6 bg-muted rounded animate-pulse" />
      <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
      <div className="h-3 w-full bg-muted rounded animate-pulse" />
      <div className="flex gap-2 mt-4">
        <div className="h-8 w-16 bg-muted rounded animate-pulse" />
        <div className="h-8 w-16 bg-muted rounded animate-pulse" />
      </div>
      <div className="mt-8 space-y-4">
        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border border-border rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-muted animate-pulse" />
              <div className="h-3 w-20 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-3 w-full bg-muted rounded animate-pulse" />
            <div className="h-3 w-4/6 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            <div className="h-3 w-24 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
          <div className="h-3 bg-muted rounded animate-pulse w-full" />
          <div className="h-3 bg-muted rounded animate-pulse w-5/6" />
          <div className="flex gap-2 mt-2">
            <div className="h-6 w-12 bg-muted rounded animate-pulse" />
            <div className="h-6 w-12 bg-muted rounded animate-pulse" />
            <div className="h-6 w-12 bg-muted rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

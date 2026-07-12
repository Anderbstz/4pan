export default function PerfilLoading() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="border border-border rounded-lg p-6 space-y-4">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-24 w-24 rounded-full bg-muted animate-pulse" />
          <div className="h-5 w-32 bg-muted rounded animate-pulse" />
          <div className="h-3 w-20 bg-muted rounded animate-pulse" />
        </div>
      </div>
      <div className="border border-border rounded-lg p-6 space-y-4">
        <div className="h-5 w-24 bg-muted rounded animate-pulse" />
        <div className="h-9 w-full bg-muted rounded animate-pulse" />
        <div className="h-9 w-full bg-muted rounded animate-pulse" />
        <div className="h-9 w-24 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}

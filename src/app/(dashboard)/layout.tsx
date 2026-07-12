import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "./sidebar";
import { MobileSectionBar } from "./mobile-sections";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex-1 flex gap-0 md:gap-6 max-w-5xl mx-auto w-full px-4 py-4 md:py-6">
        <Suspense fallback={null}>
          <Sidebar />
        </Suspense>
        <div className="flex-1 min-w-0">
          <Suspense fallback={null}>
            <MobileSectionBar />
          </Suspense>
          {children}
        </div>
      </div>
    </>
  );
}

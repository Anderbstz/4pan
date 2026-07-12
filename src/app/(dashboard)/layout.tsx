import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "./sidebar";
import { MobileSectionBar } from "./mobile-sections";
import { RightSidebar, RightSidebarSkeleton } from "./right-sidebar";
import { SearchInput } from "@/components/search-input";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex-1 flex gap-0 md:gap-6 max-w-5xl lg:max-w-7xl mx-auto w-full px-4 py-4 md:py-6">
        <Suspense fallback={null}>
          <Sidebar />
        </Suspense>
        <div className="flex-1 min-w-0">
          <Suspense fallback={null}>
            <MobileSectionBar />
          </Suspense>
          <div className="sm:hidden mb-4">
            <SearchInput />
          </div>
          {children}
        </div>
        <Suspense fallback={<RightSidebarSkeleton />}>
          <RightSidebar />
        </Suspense>
      </div>
    </>
  );
}

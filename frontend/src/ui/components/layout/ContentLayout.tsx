import type { ReactNode } from "react";
import { useLocation } from "react-router";

function ContentLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8">
        <h1 className="text-xl font-semibold text-slate-900 capitalize">
          {location.pathname.replace("/", "").split("/")[0]}
        </h1>
        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-xs font-medium text-slate-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div>{children}</div>
      </div>
    </main>
  );
}

export default ContentLayout;

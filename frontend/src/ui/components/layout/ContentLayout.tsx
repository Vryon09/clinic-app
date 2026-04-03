import type { ReactNode } from "react";

function ContentLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <div className="h-full flex-1 overflow-y-auto p-8">
        <div className="h-full">{children}</div>
      </div>
    </main>
  );
}

export default ContentLayout;

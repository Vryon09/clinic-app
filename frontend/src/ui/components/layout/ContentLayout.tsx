import type { ReactNode } from "react";

function ContentLayout({ children }: { children: ReactNode }) {
  return (
    <main className="w-full max-w-7xl mx-auto flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-12 transition-all">
      {children}
    </main>
  );
}

export default ContentLayout;

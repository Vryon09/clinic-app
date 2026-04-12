import type { ReactNode } from "react";

function ContentLayout({ children }: { children: ReactNode }) {
  return <main className="w-full flex-1 px-8 pt-8">{children}</main>;
}

export default ContentLayout;

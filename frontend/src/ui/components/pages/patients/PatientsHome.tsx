import PatientsTable from "./PatientsTable";
import AddPatient from "./AddPatient";
import { Search, X } from "lucide-react";
import { Input } from "../../shadcn/input";
import { useState } from "react";

function PatientsHome() {
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className="space-y-6 pb-8">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              Patient Directory
            </h1>
            <span className="border-border bg-muted/60 text-muted-foreground inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[11px] font-medium">
              Clinical Records
            </span>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Manage active patient charts, demographics, and encounter histories.
          </p>
        </div>

        <AddPatient />
      </div>

      {/* Toolbar / Search Bar */}
      <div className="border-border bg-card flex flex-col justify-between gap-3 rounded-lg border p-2.5 shadow-2xs sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Search by patient name, phone number, or address..."
            className="border-border bg-background placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/20 h-8.5 w-full rounded-md pr-8 pl-9 text-xs focus-visible:ring-1"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer"
              title="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Patients Table */}
      <PatientsTable searchInput={searchInput} />
    </div>
  );
}

export default PatientsHome;

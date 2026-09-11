import PatientsTable from "./PatientsTable";
import AddPatient from "./AddPatient";
import { Search, X } from "lucide-react";
import { Input } from "../../shadcn/input";
import { useState } from "react";

function PatientsHome() {
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className="space-y-6 pb-6">
      {/* Header section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Patient Directory & Queue
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-primary">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Active Cohort
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage current active patients, encounters, lab assignments, and demographic records.
          </p>
        </div>

        <AddPatient />
      </div>

      {/* Toolbar / Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-3 shadow-2xs">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Search by patient name, phone number, or address..."
            className="h-9 w-full rounded-lg border-border/80 bg-background/50 pl-9 pr-8 text-xs placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/20"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
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

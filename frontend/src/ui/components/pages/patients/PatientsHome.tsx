import PatientsTable from "./PatientsTable";
import AddPatient from "./AddPatient";
import PatientFilterPopover from "./PatientFilterPopover";
import { Search, X, RotateCcw } from "lucide-react";
import { Input } from "../../shadcn/input";
import { Badge } from "../../shadcn/badge";
import { Button } from "../../shadcn/button";
import { useState } from "react";
import type { PatientFilterParams } from "@/types/PatientType";

function PatientsHome() {
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<PatientFilterParams>({
    sex: "",
    minAge: "",
    maxAge: "",
    hasAllergies: "all",
  });

  const handleFilterChange = (updated: Partial<PatientFilterParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      sex: "",
      minAge: "",
      maxAge: "",
      hasAllergies: "all",
    });
  };

  // Count active filters (excluding search)
  const activeFilterCount =
    (filters.sex ? 1 : 0) +
    (filters.hasAllergies && filters.hasAllergies !== "all" ? 1 : 0) +
    (filters.minAge !== "" && filters.minAge !== undefined ? 1 : 0) +
    (filters.maxAge !== "" && filters.maxAge !== undefined ? 1 : 0);

  return (
    <div className="space-y-6 pb-8">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              Patient Directory
            </h1>
            <span className="border-border bg-muted/60 text-muted-foreground inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium">
              Clinical Records
            </span>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Manage active patient charts, demographics, and encounter histories.
          </p>
        </div>

        <AddPatient />
      </div>

      {/* Toolbar / Search Bar & Filter */}
      <div className="space-y-2.5">
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

          <div className="flex items-center gap-2">
            <PatientFilterPopover
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              activeCount={activeFilterCount}
            />
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 px-0.5">
            <span className="text-[11px] font-medium text-muted-foreground">
              Active filters:
            </span>

            {filters.sex && (
              <Badge
                variant="secondary"
                className="h-6 gap-1 border border-border/80 px-2 text-[11px] font-normal"
              >
                <span>Sex: {filters.sex === "MALE" ? "Male" : "Female"}</span>
                <button
                  type="button"
                  onClick={() => handleFilterChange({ sex: "" })}
                  className="hover:text-foreground cursor-pointer"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}

            {filters.hasAllergies && filters.hasAllergies !== "all" && (
              <Badge
                variant="secondary"
                className="h-6 gap-1 border border-border/80 px-2 text-[11px] font-normal"
              >
                <span>
                  Allergies: {filters.hasAllergies === "yes" ? "With Allergies" : "No Allergies"}
                </span>
                <button
                  type="button"
                  onClick={() => handleFilterChange({ hasAllergies: "all" })}
                  className="hover:text-foreground cursor-pointer"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}

            {(filters.minAge !== "" || filters.maxAge !== "") && (
              <Badge
                variant="secondary"
                className="h-6 gap-1 border border-border/80 px-2 text-[11px] font-normal"
              >
                <span>
                  Age:{" "}
                  {filters.minAge !== "" && filters.maxAge !== ""
                    ? `${filters.minAge} - ${filters.maxAge} yrs`
                    : filters.minAge !== ""
                    ? `≥ ${filters.minAge} yrs`
                    : `≤ ${filters.maxAge} yrs`}
                </span>
                <button
                  type="button"
                  onClick={() => handleFilterChange({ minAge: "", maxAge: "" })}
                  className="hover:text-foreground cursor-pointer"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-5 px-1.5 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer gap-1"
            >
              <RotateCcw className="size-2.5" />
              <span>Clear all</span>
            </Button>
          </div>
        )}
      </div>

      {/* Patients Table */}
      <PatientsTable searchInput={searchInput} filters={filters} />
    </div>
  );
}

export default PatientsHome;

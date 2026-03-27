import PatientsTable from "./PatientsTable";
import AddPatient from "./AddPatient";
import { Search } from "lucide-react";
import { Input } from "../../shadcn/input";
import { useState } from "react";

function PatientsHome() {
  const [searchInput, setSearchInput] = useState("");

  return (
    <div>
      <div className="flex justify-between">
        <div className="relative h-10 w-80">
          <span className="absolute top-1/2 left-2 -translate-y-1/2">
            <Search size={20} className="text-neutral-400" />
          </span>
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Enter patient's name or phone number"
            className="h-full w-full pl-10"
          />
        </div>
        <AddPatient />
      </div>
      <PatientsTable searchInput={searchInput} />
    </div>
  );
}

export default PatientsHome;

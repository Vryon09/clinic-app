import { handleSearchPatients } from "@/services/apiPatients";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "../../shadcn/input";
import { Card } from "../../shadcn/card";
import type { IPatient } from "@/types/PatientType";
import { Button } from "../../shadcn/button";
import { useNavigate } from "react-router";

function SelectPatient() {
  const [searchInput, setSearchInput] = useState("");

  const { data: patients, isPending } = useQuery<IPatient[]>({
    queryFn: () => handleSearchPatients({ search: searchInput }),
    queryKey: ["searchedPatients", searchInput],
  });

  const navigate = useNavigate();

  return (
    <div>
      <Input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="search"
      />

      <div>
        {isPending && <p>Searching...</p>}
        {patients?.map((patient) => (
          <Card key={patient.id} className="flex flex-row justify-between">
            <p>{patient.firstName}</p>
            <Button
              onClick={() => navigate(`/consultations/${patient.id}`)}
              className="cursor-pointer"
            >
              Select Patient
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default SelectPatient;

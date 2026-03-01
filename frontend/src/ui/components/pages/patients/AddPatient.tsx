import { Plus } from "lucide-react";
import { Button } from "../../shadcn/button";
import { useState } from "react";
import { useAddPatient } from "@/services/apiPatients";
import PatientForm from "./PatientForm";

function AddPatient() {
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const { mutate: handleAddPatient } = useAddPatient();

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setIsAdding(true)} className="cursor-pointer">
          <Plus /> <span>Add Patient</span>
        </Button>
      </div>

      <PatientForm
        action="create"
        handlePatient={(data) => handleAddPatient(data)}
        initialValues={{
          firstName: "",
          lastName: "",
          phone: "",
          address: "",
          sex: "MALE",
          dateOfBirth: new Date(),
          middleName: "",
        }}
        isOpen={isAdding}
        setIsOpen={setIsAdding}
      />
    </>
  );
}

export default AddPatient;

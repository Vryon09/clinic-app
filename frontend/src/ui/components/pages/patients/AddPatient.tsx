import { UserPlus } from "lucide-react";
import { Button } from "../../shadcn/button";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAddPatient } from "@/services/apiPatients";
import PatientForm from "./PatientForm";

function AddPatient({ className }: { className?: string }) {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const navigate = useNavigate();

  const { mutate: handleAddPatient } = useAddPatient();

  return (
    <div className={className}>
      <Button
        onClick={() => setIsAdding(true)}
        className="h-9 gap-2 rounded-lg px-3.5 text-xs font-semibold shadow-xs transition-all hover:shadow-sm cursor-pointer"
      >
        <UserPlus className="size-4" />
        <span>Register Patient</span>
      </Button>

      <PatientForm
        action="create"
        handlePatient={(data) =>
          handleAddPatient(data, {
            onSuccess: (newPatient) => {
              if (newPatient?.id) {
                navigate(`/patients/${newPatient.id}`);
              }
            },
          })
        }
        initialValues={{
          firstName: "",
          lastName: "",
          phone: "",
          address: "",
          sex: "MALE",
          dateOfBirth: new Date(),
          middleName: "",
          allergies: "",
        }}
        isOpen={isAdding}
        setIsOpen={() => setIsAdding((prev) => !prev)}
      />
    </div>
  );
}

export default AddPatient;

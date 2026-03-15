import { handleGetPatient } from "@/services/apiPatients";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import VisitDetailsForm from "./visitDetailsForm";
import VitalSignsForm from "./VitalSignsForm";

function ConsultationsForm() {
  const { patientId } = useParams() as {
    patientId: string;
  };

  const { data: patient, isPending: isPatientLoading } = useQuery({
    queryFn: () => handleGetPatient({ id: patientId }),
    queryKey: ["patient", patientId],
  });

  if (isPatientLoading) return <p>Loading...</p>;

  return (
    <div>
      <div>
        <p>New Consultation</p>
        <p>
          Patient:{" "}
          {`${patient.lastName}, ${patient.firstName}${patient.middleName ? ` ${patient.middleName.slice(0, 1)}.` : ""}`}
        </p>
      </div>

      <div className="flex w-full gap-4">
        <VisitDetailsForm />
        <VitalSignsForm />
      </div>
    </div>
  );
}

export default ConsultationsForm;

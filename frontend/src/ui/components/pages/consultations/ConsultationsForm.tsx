import { handleGetPatient } from "@/services/apiPatients";
import { useQuery } from "@tanstack/react-query";
import VisitDetailsForm from "./VisitDetailsForm";
import VitalSignsForm from "./VitalSignsForm";
import { Button } from "../../shadcn/button";
import { useLocation, useNavigate, useParams } from "react-router";
import { useAddRecord, useUpdateRecord } from "@/services/apiRecords";
import { useVisitDetailsForm } from "@/hooks/useVisitDetailsForm";
import RecordMedicationForm from "./RecordMedicationForm";

function ConsultationsForm() {
  const { patientId, consultationId } = useParams() as {
    patientId: string;
    consultationId: string;
  };

  const { data: patient, isPending: isPatientLoading } = useQuery({
    queryFn: () => handleGetPatient({ id: patientId }),
    queryKey: ["patient", patientId],
  });

  const location = useLocation();
  const formType = location.pathname.split("/").at(-1) as "edit" | "new";

  const { mutate: handleAddRecord } = useAddRecord();
  const { mutate: handleUpdateRecord } = useUpdateRecord();

  const navigate = useNavigate();

  const {
    handleSubmit: visitDetailsHandleSubmit,
    onSubmit: visitDetailsOnSubmit,
    isRecordLoading,
    register,
    recordMedicationField,
    addMedication,
    deleteMedication,
    getValues,
    setValue,
  } = useVisitDetailsForm({
    consultationId,
    patientId,
    formType,
    handleAddRecord,
    handleUpdateRecord,
    navigate,
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

      <form onSubmit={visitDetailsHandleSubmit(visitDetailsOnSubmit)}>
        <div className="grid w-full grid-cols-2 gap-4">
          <VisitDetailsForm register={register} />
          <VitalSignsForm register={register} />
          <RecordMedicationForm
            recordMedicationField={recordMedicationField}
            addMedication={addMedication}
            deleteMedication={deleteMedication}
            register={register}
            getValues={getValues}
            setValue={setValue}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" className="cursor-pointer">
            Cancel
          </Button>
          <Button disabled={isRecordLoading} className="cursor-pointer">
            Complete Consultation
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ConsultationsForm;

import CaseDialog from "../consultationForms/CaseDialog";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addCaseSchema, type AddCaseInput } from "@/schemas/caseSchema";
import { useUpdateCase } from "@/services/apiCase";
import type { ICase } from "@/types/CaseType";
import type { Dispatch, SetStateAction } from "react";

function CaseCardDialog({
  caseItem,
  isUpdatingCase,
  setIsUpdatingCase,
}: {
  caseItem: ICase;
  isUpdatingCase: boolean;
  setIsUpdatingCase: Dispatch<SetStateAction<boolean>>;
}) {
  const { patientId } = useParams() as {
    patientId: string;
  };

  const {
    register: caseRegister,
    control: caseControl,
    handleSubmit: caseHandleSubmit,
    reset: caseReset,
  } = useForm({
    resolver: zodResolver(addCaseSchema),
    defaultValues: {
      caseName: caseItem.caseName,
      doctorId: caseItem.doctor.id,
    },
  });

  const { mutate: handleUpdateCase } = useUpdateCase(patientId);

  function caseOnSubmit(caseData: AddCaseInput) {
    handleUpdateCase({
      caseName: caseData.caseName,
      doctorId: caseData.doctorId,
      patientId,
      caseId: caseItem.id,
    });

    setIsUpdatingCase(false);
    caseReset();
  }

  return (
    <CaseDialog
      caseControl={caseControl}
      caseHandleSubmit={caseHandleSubmit}
      caseOnSubmit={caseOnSubmit}
      caseRegister={caseRegister}
      isAddingCase={isUpdatingCase}
      setIsAddingCase={setIsUpdatingCase}
      action="update"
    />
  );
}

export default CaseCardDialog;

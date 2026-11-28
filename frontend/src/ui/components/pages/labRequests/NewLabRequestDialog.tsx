import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Check, Printer, Save, Search, Square } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../shadcn/dialog";
import { Button } from "../../shadcn/button";
import { Input } from "../../shadcn/input";
import { Label } from "../../shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shadcn/select";
import { handleGetDoctors } from "@/services/apiAuth";
import { handleGetCases } from "@/services/apiCase";
import {
  parseCustomTests,
  parseSelectedTests,
  useCreateLabRequest,
  useUpdateLabRequest,
} from "@/services/apiLabRequests";
import { useAuth } from "@/hooks/useAuth";
import { useAccess } from "@/hooks/useAccess";
import { formatUserName } from "@/lib/utils";
import type { IDoctor } from "@/types/User";
import type { ICase } from "@/types/CaseType";
import type {
  ILabRequest,
  ILabRequestCustomTests,
  ILabRequestSelectedTests,
  LabRequestCategoryKey,
} from "@/types/LabRequestType";
import { LAB_REQUEST_CATEGORIES } from "./labRequestCatalog";

interface NewLabRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  editingRequest?: ILabRequest | null;
}

export function NewLabRequestDialog({
  open,
  onOpenChange,
  patientId,
  editingRequest,
}: NewLabRequestDialogProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [requestDate, setRequestDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [selectedTests, setSelectedTests] = useState<ILabRequestSelectedTests>(
    {},
  );
  const [customTests, setCustomTests] = useState<ILabRequestCustomTests>({});
  const [otherExaminations, setOtherExaminations] = useState("");

  const { isHidden } = useAccess();

  const { data: doctors = [] } = useQuery<IDoctor[]>({
    queryFn: handleGetDoctors,
    queryKey: ["doctors"],
    enabled: open,
  });

  const { data: cases = [] } = useQuery<ICase[]>({
    queryFn: () => handleGetCases({ patientId }),
    queryKey: ["cases", patientId],
    enabled: open && !isHidden("patients.consultations"),
  });

  const { mutate: createLabRequest, isPending: isCreating } =
    useCreateLabRequest();
  const { mutate: updateLabRequest, isPending: isUpdating } =
    useUpdateLabRequest();

  useEffect(() => {
    if (!open) return;

    if (editingRequest) {
      setSelectedTests(parseSelectedTests(editingRequest.selectedTests));
      setCustomTests(parseCustomTests(editingRequest.customTests));
      setOtherExaminations(editingRequest.otherExaminations || "");
      setRequestDate(dayjs(editingRequest.requestDate).format("YYYY-MM-DD"));
      setDoctorId(editingRequest.doctorId || "");
    } else {
      setSelectedTests({});
      setCustomTests({});
      setOtherExaminations("");
      setRequestDate(dayjs().format("YYYY-MM-DD"));

      if (user?.role === "DOCTOR") {
        setDoctorId(user.id);
      } else {
        const caseWithDoc = cases.find((c) => c.doctor?.id);
        if (caseWithDoc?.doctor?.id) {
          setDoctorId(caseWithDoc.doctor.id);
        } else if (doctors.length > 0) {
          setDoctorId(doctors[0].id);
        }
      }
    }
    setSearch("");
  }, [open, editingRequest, user, cases, doctors]);

  const toggleTest = (category: LabRequestCategoryKey, testName: string) => {
    setSelectedTests((prev) => {
      const current = prev[category] || [];
      const exists = current.includes(testName);
      return {
        ...prev,
        [category]: exists
          ? current.filter((t) => t !== testName)
          : [...current, testName],
      };
    });
  };

  const totalSelected = useMemo(() => {
    const counts = Object.values(selectedTests).reduce(
      (sum, arr) => sum + (arr?.length || 0),
      0,
    );
    const custom =
      (customTests.bloodChemistryOthers?.trim() ? 1 : 0) +
      (customTests.xrayOthers?.trim() ? 1 : 0) +
      (otherExaminations.trim() ? 1 : 0);
    return counts + custom;
  }, [selectedTests, customTests, otherExaminations]);

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return LAB_REQUEST_CATEGORIES;
    return LAB_REQUEST_CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => item.toLowerCase().includes(q)),
    })).filter((cat) => cat.items.length > 0 || cat.title.toLowerCase().includes(q));
  }, [search]);

  const handleSubmit = (andPrint: boolean) => {
    if (editingRequest) {
      updateLabRequest(
        {
          id: editingRequest.id,
          doctorId: doctorId || null,
          requestDate: new Date(requestDate).toISOString(),
          selectedTests,
          customTests,
          otherExaminations,
        },
        {
          onSuccess: (updated) => {
            onOpenChange(false);
            if (andPrint) {
              navigate(
                `/patients/${patientId}/lab-requests/print?requestId=${updated.id}&mode=digital`,
              );
            }
          },
        },
      );
    } else {
      createLabRequest(
        {
          patientId,
          doctorId: doctorId || null,
          requestDate: new Date(requestDate).toISOString(),
          selectedTests,
          customTests,
          otherExaminations,
        },
        {
          onSuccess: (created) => {
            onOpenChange(false);
            if (andPrint) {
              navigate(
                `/patients/${patientId}/lab-requests/print?requestId=${created.id}&mode=digital`,
              );
            }
          },
        },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col overflow-hidden p-0">
        <DialogHeader className="border-b border-border/60 px-6 py-4">
          <DialogTitle className="text-base font-bold">
            {editingRequest ? "Edit Laboratory Request" : "New Laboratory Request"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Select tests digitally below, or print a blank referral slip to check
            manually by pen.
          </DialogDescription>
        </DialogHeader>

        {/* Top metadata + search */}
        <div className="grid grid-cols-1 gap-3 border-b border-border/60 bg-muted/20 px-6 py-3 sm:grid-cols-3">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Requesting Physician</Label>
            <Select value={doctorId} onValueChange={setDoctorId}>
              <SelectTrigger className="h-8.5 text-xs">
                <SelectValue placeholder="Select physician" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id} className="text-xs">
                    {formatUserName(doc, {
                      includeMiddle: true,
                      useMiddleInitial: true,
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold">Request Date</Label>
            <Input
              type="date"
              value={requestDate}
              onChange={(e) => setRequestDate(e.target.value)}
              className="h-8.5 text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold">Filter Tests</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute top-2.5 left-2.5 size-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search CBC, FBS, Chest..."
                className="h-8.5 pl-8 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Scrollable Test Checklist */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredCategories.map((cat) => (
              <div
                key={cat.key}
                className="rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs"
              >
                <div className="mb-2.5 flex items-center justify-between border-b border-border/60 pb-1.5">
                  <h3 className="text-xs font-extrabold tracking-wide text-primary uppercase">
                    {cat.title}
                  </h3>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {selectedTests[cat.key]?.length || 0} selected
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {cat.items.map((item) => {
                    const checked = Boolean(selectedTests[cat.key]?.includes(item));
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleTest(cat.key, item)}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-xs transition-colors ${
                          checked
                            ? "border-primary/40 bg-primary/10 font-semibold text-foreground"
                            : "border-transparent hover:bg-muted/60 text-muted-foreground"
                        }`}
                      >
                        <span
                          className={`inline-flex size-4 shrink-0 items-center justify-center rounded border ${
                            checked
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background"
                          }`}
                        >
                          {checked && <Check className="size-3 stroke-[3]" />}
                        </span>
                        <span className="truncate">{item}</span>
                      </button>
                    );
                  })}
                </div>

                {cat.hasOthers && cat.othersFieldKey && (
                  <div className="mt-2.5 border-t border-border/50 pt-2">
                    <Label className="text-[11px] font-medium text-muted-foreground">
                      Others ({cat.title})
                    </Label>
                    <Input
                      value={customTests[cat.othersFieldKey] || ""}
                      onChange={(e) =>
                        setCustomTests((prev) => ({
                          ...prev,
                          [cat.othersFieldKey!]: e.target.value,
                        }))
                      }
                      placeholder={`Specify other ${cat.title.toLowerCase()} tests...`}
                      className="mt-1 h-8 text-xs"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-1.5 rounded-xl border border-border/80 bg-card p-3.5">
            <Label className="text-xs font-semibold">
              Specify other examination/s
            </Label>
            <Input
              value={otherExaminations}
              onChange={(e) => setOtherExaminations(e.target.value)}
              placeholder="Write any additional diagnostic examinations or instructions..."
              className="h-9 text-xs"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 bg-muted/20 px-6 py-3 sm:justify-between">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                navigate(`/patients/${patientId}/lab-requests/print?mode=manual`);
              }}
              className="cursor-pointer gap-1.5 text-xs font-semibold"
            >
              <Square className="size-3.5" />
              Print Blank Slip (Manual)
            </Button>
            {totalSelected > 0 && (
              <span className="text-xs font-medium text-muted-foreground">
                {totalSelected} selected
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isCreating || isUpdating}
              onClick={() => handleSubmit(false)}
              className="cursor-pointer gap-1.5 text-xs font-semibold"
            >
              <Save className="size-3.5" />
              {editingRequest ? "Save Changes" : "Save Request"}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isCreating || isUpdating}
              onClick={() => handleSubmit(true)}
              className="cursor-pointer gap-1.5 text-xs font-semibold"
            >
              <Printer className="size-3.5" />
              {editingRequest ? "Save & Print" : "Save & Print Slip"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

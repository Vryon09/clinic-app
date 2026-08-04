import { Database, Import } from "lucide-react";
import { Button } from "../../shadcn/button";
import { useRef, useState } from "react";
import { SignupForm } from "../../forms/SignupForm";
import { Input } from "../../shadcn/input";
import { useRestoreBackup } from "@/services/apiBackup";

function WelcomeScreen() {
  const [isStartingNew, setIsStartingNew] = useState<boolean>(false);
  const backupButtonRef = useRef<HTMLInputElement | null>(null);

  const { mutate: handleRestoreBackup } = useRestoreBackup();

  const handleClick = () => backupButtonRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    console.log(file);
    handleRestoreBackup({ file });
  };

  if (isStartingNew) return <SignupForm />;

  return (
    <div className="space-y-10">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-5xl font-semibold">Welcome to ClinicSync</h1>
        <p>What would you like to do?</p>
      </div>

      <div className="flex flex-col gap-4">
        <Button onClick={() => setIsStartingNew(true)}>
          <Database /> Start new clinic
        </Button>

        <div>
          <Input
            ref={backupButtonRef}
            type="file"
            className="hidden"
            onChange={handleChange}
          />

          <Button className="w-full" onClick={handleClick}>
            <Import />
            Import backup
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;

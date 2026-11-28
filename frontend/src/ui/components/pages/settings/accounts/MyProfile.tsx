import { Edit } from "lucide-react";
import { formatUserName } from "@/lib/utils";
import { Button } from "../../../shadcn/button";
import { Card } from "../../../shadcn/card";
import { useState } from "react";
import { useAccess } from "@/hooks/useAccess";
import PasswordDialog from "./PasswordDialog";
import { Spinner } from "../../../shadcn/spinner";
import LicenseNumDialog from "./LicenseNumDialog";
import FullNameDialog from "./FullNameDialog";
import UsernameDialog from "./UsernameDialog";
import SignatureSection from "./SignatureSection";

function MyProfile() {
  const [isChangingUsername, setIsChangingUsername] = useState<boolean>(false);
  const [isChangingFullName, setIsChangingFullName] = useState<boolean>(false);
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [isChangingLicenseNum, setIsChangingLicenseNum] =
    useState<boolean>(false);

  const { user, isUserLoading, can } = useAccess();
  const isAttending = can("clinical:attending");

  return (
    <Card className="rounded-xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
      {isUserLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner className="size-8 text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">My Profile</h2>
            <p className="text-xs text-muted-foreground">
              Update your account details and authentication information
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className={isAttending ? "lg:col-span-2 space-y-4" : "lg:col-span-3 space-y-4"}>
              <div className="flex items-center gap-3 p-4 rounded-xl border border-border/80 bg-muted/20">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {user?.username}
                  </h3>
                  <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {user?.roleName || user?.role}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-border/80 bg-card p-4 divide-y divide-border/60">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Username
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {user?.username}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 rounded-lg text-xs"
                    onClick={() => setIsChangingUsername(true)}
                  >
                    <Edit className="size-3.5" /> Edit
                  </Button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Full Name
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {formatUserName(user, { includeMiddle: true }) || "—"}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 rounded-lg text-xs"
                    onClick={() => setIsChangingFullName(true)}
                  >
                    <Edit className="size-3.5" /> Edit
                  </Button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Password
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      ••••••••••••••••
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 rounded-lg text-xs"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    <Edit className="size-3.5" /> Change
                  </Button>
                </div>

                {isAttending && (
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        License Number
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {user?.licenseNum || "N/A"}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5 rounded-lg text-xs"
                      onClick={() => setIsChangingLicenseNum(true)}
                    >
                      <Edit className="size-3.5" /> Edit
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {isAttending && (
              <div className="lg:col-span-1">
                <SignatureSection />
              </div>
            )}
          </div>

          <UsernameDialog
            open={isChangingUsername}
            onOpenChange={setIsChangingUsername}
            user={user!}
            isUserLoading={isUserLoading}
          />

          <FullNameDialog
            open={isChangingFullName}
            onOpenChange={setIsChangingFullName}
            user={user!}
            isUserLoading={isUserLoading}
          />

          <PasswordDialog
            open={isChangingPassword}
            onOpenChange={setIsChangingPassword}
          />

          <LicenseNumDialog
            open={isChangingLicenseNum}
            onOpenChange={setIsChangingLicenseNum}
            user={user!}
            isUserLoading={isUserLoading}
          />
        </div>
      )}
    </Card>
  );
}

export default MyProfile;

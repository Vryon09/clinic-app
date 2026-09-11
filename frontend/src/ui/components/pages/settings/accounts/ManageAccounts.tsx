import { Edit, Plus } from "lucide-react";
import { Button } from "../../../shadcn/button";
import { Card } from "../../../shadcn/card";
import { Separator } from "../../../shadcn/separator";

import { useQuery } from "@tanstack/react-query";
import { handleGetUsers } from "@/services/apiAuth";
import type { IUser } from "@/types/User";
import UsersTable from "./UsersTable";
import { useState } from "react";
import UserDialog from "./UserDialog";
import { useAuth } from "@/hooks/useAuth";
import PasswordDialog from "./PasswordDialog";
import { Spinner } from "../../../shadcn/spinner";
import LicenseNumDialog from "./LicenseNumDialog";
import FullNameDialog from "./FullNameDialog";
import UsernameDialog from "./UsernameDialog";
import SignatureSection from "./SignatureSection";

function ManageAccounts() {
  // const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isChangingUsername, setIsChangingUsername] = useState<boolean>(false);
  const [isChangingFullName, setIsChangingFullName] = useState<boolean>(false);
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [isChangingLicenseNum, setIsChangingLicenseNum] =
    useState<boolean>(false);
  const [isAddingUser, setIsAddingUser] = useState<boolean>(false);
  const { data: users, isPending: isUsersLoading } = useQuery<IUser[]>({
    queryFn: handleGetUsers,
    queryKey: ["users"],
  });

  const { user, isUserLoading } = useAuth();

  return (
    <Card className="rounded-xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
      {user?.role !== "DOCTOR" && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Manage Accounts</h2>
              <p className="text-xs text-muted-foreground">
                Create and manage user access for your clinic
              </p>
            </div>

            <Button
              size="sm"
              className="gap-1.5 h-9 rounded-lg font-semibold shadow-xs"
              onClick={() => setIsAddingUser((prev) => !prev)}
              disabled={isUsersLoading || isUserLoading}
            >
              <Plus className="size-4" /> Add User
            </Button>

            <UserDialog
              isUserDialogOpen={isAddingUser}
              setIsUserDialogOpen={setIsAddingUser}
              action="create"
              initialValues={{
                username: "",
                role: "DOCTOR",
                id: "",
                licenseNum: "",
                isActive: true,
                firstName: "",
                middleName: "",
                lastName: "",
              }}
            />
          </div>
          <Separator className="bg-border/60" />
        </>
      )}

      {isUsersLoading || isUserLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner className="size-8 text-primary" />
        </div>
      ) : (
        <>
          {user?.role !== "DOCTOR" && (
            <>
              <UsersTable users={users!} />
              <Separator className="bg-border/60" />
            </>
          )}

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Manage Profile</h2>
              <p className="text-xs text-muted-foreground">
                Update your account details and authentication information
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl border border-border/80 bg-muted/20">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg">
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">{user?.username}</h3>
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-border/80 bg-card p-4 divide-y divide-border/60">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Username</p>
                      <p className="text-sm font-semibold text-foreground">{user?.username}</p>
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
                      <p className="text-xs font-medium text-muted-foreground">Full Name</p>
                      <p className="text-sm font-semibold text-foreground">
                        {user?.firstName} {user?.middleName} {user?.lastName}
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
                      <p className="text-xs font-medium text-muted-foreground">Password</p>
                      <p className="text-sm font-semibold text-foreground">••••••••••••••••</p>
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

                  {user?.role === "DOCTOR" && (
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">License Number</p>
                        <p className="text-sm font-semibold text-foreground">{user.licenseNum || "N/A"}</p>
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

              {user?.role === "DOCTOR" && (
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
        </>
      )}
    </Card>
  );
}

export default ManageAccounts;

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
    <Card className="space-y-4 px-8 py-4">
      <div className="flex justify-between">
        <div>
          <p className="text-2xl font-semibold">Manage Accounts</p>
          <p className="text-sm text-neutral-500">
            Create and manage user access for your clinic
          </p>
        </div>

        <Button
          onClick={() => setIsAddingUser((prev) => !prev)}
          disabled={isUsersLoading || isUserLoading}
        >
          <Plus /> Add User
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

      <Separator />

      {isUsersLoading || isUserLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner className="size-8" />
        </div>
      ) : (
        <>
          <UsersTable
            users={users!}
            // selectedUser={selectedUser}
            // setSelectedUser={setSelectedUser}
          />

          <Separator />

          <div>
            <p className="text-2xl font-semibold">Manage Profile</p>
            <p className="text-sm text-neutral-500">
              Update your account information
            </p>
          </div>

          <div className="flex justify-between">
            <div className="flex flex-col">
              <p className="text-2xl font-semibold">{user?.username}</p>
              <p className="text-xs text-neutral-500">{user?.role}</p>
            </div>

            <Card className="flex w-100 flex-col gap-4 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs">Username</p>
                  <p className="font-semibold">{user?.username}</p>
                </div>

                <Button
                  size="xs"
                  onClick={() => {
                    setIsChangingUsername(true);
                  }}
                >
                  <Edit /> Edit
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs">Full name</p>
                  <p className="font-semibold">
                    {user?.firstName} {user?.middleName} {user?.lastName}
                  </p>
                </div>

                <Button
                  size="xs"
                  onClick={() => {
                    setIsChangingFullName(true);
                  }}
                >
                  <Edit /> Edit
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs">Password</p>
                  <p className="font-semibold">••••••••••••••••</p>
                </div>

                <Button
                  size="xs"
                  onClick={() => {
                    setIsChangingPassword(true);
                  }}
                >
                  <Edit /> Edit
                </Button>
              </div>

              {user?.role === "DOCTOR" && (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs">License Number</p>
                    <p className="font-semibold">{user.licenseNum}</p>
                  </div>

                  <Button
                    size="xs"
                    onClick={() => {
                      setIsChangingLicenseNum(true);
                    }}
                  >
                    <Edit /> Edit
                  </Button>
                </div>
              )}
            </Card>

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

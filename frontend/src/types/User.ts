export interface IUser {
  id: string;
  username: string;
  role: "ADMIN" | "DOCTOR" | "ASSISTANT";
  licenseNum: string;
  isActive: boolean;
}
export interface IMe extends IUser {
  password: string;
}

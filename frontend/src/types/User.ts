export interface IUser {
  id: string;
  username: string;
  role: "ADMIN" | "DOCTOR" | "ASSISTANT";
}

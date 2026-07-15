export interface IActivityLog {
  createdAt: Date;
  action: string;
  details: string;
  id: string;
  module: string;
  target: string;
  userId: string;
}

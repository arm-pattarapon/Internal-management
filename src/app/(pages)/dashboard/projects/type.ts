export type Users = {
  readonly _id: string;
  email: string;
  name: string;
};

export type Members = {
  readonly _id: string;
  readonly name: string;
  role: string;
};

interface LeadInterface {
  _id: string;
  name: string;
}

export type Project = {
  readonly _id: string;
  statusId: string;
  name: string;
  type: string;
  description: string;
  note: string;
  projectManager: LeadInterface;
  businessanalystLead: LeadInterface;
  developerLead: LeadInterface;
  users: Members[];
  startDate: Date | null;
  dueDate: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

export type Status = {
  readonly _id: string;
  title: string;
};

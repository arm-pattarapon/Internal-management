
export type Users = {
    readonly _id: string;
    readonly username: string
    role:string
}

export type Project = {
    readonly _id: string;
    statusId: string;
    name: string;
    type: string;
    description: string;
    projectManager: Users;
    businessAnalystLead: Users;
    developerLead: Users;
    users: Users[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export type Status = {
    readonly _id: string;
    title: string;
}
export type Id = string | number;

export type Project = {
    readonly id: Id;
    columnId: Id;
    title: string;
    description: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
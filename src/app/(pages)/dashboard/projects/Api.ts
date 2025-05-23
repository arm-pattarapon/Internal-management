import axios from "axios";
import { Project, Status, Users } from "./type";

export async function getStatusData():Promise<Status[]>{
    const status = await axios.get<Status[]>(`${process.env.NEXT_PUBLIC_API_URL}/project-status/findAll`)
        .then(response => response.data);
    return status;
}

export async function getCardData() {
    const card = await axios.get<Project[]>(`${process.env.NEXT_PUBLIC_API_URL}/projects/card`).then(res=>res.data)
    return card
}

export async function getAllUsers() {
    const response = await axios.get<Users[]>(`${process.env.NEXT_PUBLIC_API_URL}/user`)
    return response.data;
}

export async function deleteStatus(id:string) {
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/project-status/${id}`)
}

export async function deleteProjectById(_id:string) {
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/projects/delete`, {
        data: { ids: [_id] },
        headers: { "Content-Type": "application/json" }
    })
    
}

export async function createStatus(title:string) {
    const newStatus = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/project-status`,
        {title},
        { headers: { "Content-Type": "application/json" } }
    )
    return newStatus
}

export async function updateStatus(_id:string, title:string) {
    axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/project-status`,
        {
            _id,title
        },
        { headers: { "Content-Type": "application/json" } }
    )
}

export async function updateProjectStatus(_id:string, statusId: string) {
    axios.put(`${process.env.NEXT_PUBLIC_API_URL}/projects/update`,
        [{_id,statusId}],
        {headers: { "Content-Type": "application/json" }}
    )
}

export async function updateProject(project:any) {
    axios.put(`${process.env.NEXT_PUBLIC_API_URL}/projects/update`,
        [project],
        {headers: { "Content-Type": "application/json" }}
    )
}
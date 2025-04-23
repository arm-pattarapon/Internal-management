import axios from "axios";
import { Project, Status } from "./type";

export async function getStatusData():Promise<Status[]>{
    console.log('start get status');
    
    const status = await axios.get<Status[]>(`${process.env.NEXT_PUBLIC_API_URL}/project-status/findAll`)
        .then(response => response.data);
    return status;
}

export async function getCardData() {
    const card = await axios.get<Project[]>(`${process.env.NEXT_PUBLIC_API_URL}/projects/card`).then(res=>res.data)
    console.log('card: ',card);
    
    return card
}

export async function deleteStatus(id:string) {
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/project-status/${id}`)
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
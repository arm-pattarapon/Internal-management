import axios from "axios";
import { Status } from "./type";

export async function getStatusData():Promise<Status[]>{
    const status = await axios.get<Status[]>(`${process.env.NEXT_PUBLIC_API_URL}/project-status/findAll`)
        .then(response => response.data);
    return status;
}
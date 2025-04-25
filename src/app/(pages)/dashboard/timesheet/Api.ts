/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Timesheet } from "./type";

export async function getAllTimeSheet() {
  const response = await axios.get<Timesheet[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/project-timesheets/findAll`
  );
  return response.data;
}

export async function getOneTimeSheet(data: any) {
  const response = await axios.get<Timesheet[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/project-timesheets/findOne`,
    data
  );
  return response.data;
}

export async function createTimeSheet(data: any) {
  const { task, remark, time, user, project } = data;
  const newStatus = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/project-timesheets/create`,
    {
      task: task,
      remark: remark,
      time: time,
      user: user,
      project: project,
    },
    { headers: { "Content-Type": "application/json" } }
  );
  return newStatus;
}

export async function updateTimeSheet(data: any) {
  //   const { _id, task, remark, time, user, project } = data;
  axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/project-timesheets/update`,
    data,
    { headers: { "Content-Type": "application/json" } }
  );
}

export async function deleteTimeSheet(data: any) {
  axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/project-timesheets/delete`,
    data
  );
}

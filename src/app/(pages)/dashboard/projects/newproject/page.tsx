"use client";
import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import DatePicker, { registerLocale } from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

registerLocale("en", enUS);

export default function NewProjectsPage() {
  const [title, setTitle] = React.useState("");
  const [type, setType] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());

  const [pm, setPM] = React.useState("");
  const [ba, setBA] = React.useState("");
  const [dev, setDEV] = React.useState("");

  const handleSubmit = async () => {
    const data = [
      {
        name: title,
        type: type,
        description: description,
        note: "test", // หรือให้ผู้ใช้กรอกก็ได้
        statusId: "680765f9f20e6af89664fbee", // สมมุติว่าเป็น default status
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        projectManager: pm,
        businessanalystLead: ba,
        developerLead: dev,
      },
    ];
  
    try {
      const res = await fetch("/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      if (!res.ok) throw new Error("Failed to submit");
  
      const result = await res.json();
      console.log("Success:", result);
      alert("Project created successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    }
  };
  

  return (
    <div className="p-10 max-w-5xl mx-auto bg-white shadow-md rounded-md border border-gray-200">
      {/* Grid of Inputs */}
      <div className="grid grid-cols-4 gap-8 mb-6">
        <div className="space-y-2">
          <Label className="text-base font-semibold">Project Title</Label>
          <Input
            placeholder="ThaiOil"
            className="rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-base font-semibold">Project Type</Label>
          <Input
            placeholder="Full-custom"
            className="rounded-md"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold">Start Date</Label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-3 text-gray-500 h-4 w-4" />
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date || new Date())}
              dateFormat="dd/MM/yyyy"
              locale="en"
              className="w-full border rounded-md pl-9 pr-3 py-2"
              calendarStartDay={1}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold">End Date</Label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-3 text-gray-500 h-4 w-4" />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date || new Date())}
              dateFormat="dd/MM/yyyy"
              locale="en"
              className="w-full border rounded-md pl-9 pr-3 py-2"
              calendarStartDay={1}
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <Label className="text-base font-semibold">Project Description</Label>
        <Textarea
          placeholder="Lorem Ipsum is simply dummy text..."
          className="mt-2 rounded-md"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <Label className="text-base font-semibold">Project Roles</Label>
        <Card className="mt-2 bg-gray-50 border rounded-md">
          <CardContent className="p-4 space-y-4">
            <div>
              <Label className="text-sm font-medium">Team Lead</Label>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm text-muted-foreground space-y-1">
                <Label className="text-sm font-medium">PM.</Label>
                <Select onValueChange={setPM}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select PM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="black">Mr. Blacksnow</SelectItem>
                    <SelectItem value="white">Mr. Whitesnow</SelectItem>
                    <SelectItem value="green">Mr. Greensnow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <Label className="text-sm font-medium">BA.</Label>
                <Select onValueChange={setBA}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select BA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="black">Mr. Blacksnow</SelectItem>
                    <SelectItem value="white">Mr. Whitesnow</SelectItem>
                    <SelectItem value="green">Mr. Greensnow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <Label className="text-sm font-medium">DEV.</Label>
                <Select onValueChange={setDEV}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select DEV" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="black">Mr. Blacksnow</SelectItem>
                    <SelectItem value="white">Mr. Whitesnow</SelectItem>
                    <SelectItem value="green">Mr. Greensnow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Link href="./">
          <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
            cancel
          </Button>
        </Link>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
          Create
        </Button>
      </div>
    </div>
  );
}

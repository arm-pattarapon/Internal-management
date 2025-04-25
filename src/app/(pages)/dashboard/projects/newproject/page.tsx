"use client";
import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export default function NewProjectsPage() {
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [startDateOpen, setStartDateOpen] = React.useState(false);
  const [endDateOpen, setEndDateOpen] = React.useState(false);

  return (
    <div className="p-10 max-w-5xl mx-auto bg-white shadow-md rounded-md border border-gray-200">
      <div className="grid grid-cols-4 gap-8 mb-6">
        <div className="space-y-2">
          <Label className="text-base font-semibold">Project Title</Label>
          <Input placeholder="ThaiOil" className="rounded-md" />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold">Project Type</Label>
          <Input placeholder="Full-custom" className="rounded-md" />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold">Start Date</Label>
          <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal rounded-md"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(startDate, "dd/MM/yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  setStartDate(date || new Date());
                  setStartDateOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold">End Date</Label>
          <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal rounded-md"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(endDate, "dd/MM/yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  setEndDate(date || new Date());
                  setEndDateOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="mb-6">
        <Label className="text-base font-semibold">Project Description</Label>
        <Textarea
          placeholder="Lorem Ipsum is simply dummy text..."
          className="mt-2 rounded-md"
          rows={3}
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
                <Select>
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
                <Select>
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
                <Select>
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
        <Button className="bg-blue-600 hover:bg-blue-700">Create</Button>
      </div>
    </div>
  );
}

// components/timesheets/EntryFormModal.tsx
"use client";

import { Info, Minus, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type EntryFormValues = {
  date: string;
  project: string;
  workType: string;
  description: string;
  hours: number;
};

const PROJECT_OPTIONS = ["Project Alpha", "Project Beta", "Project Gamma"];
const WORK_TYPE_OPTIONS = [
  "Bug fixes",
  "Development",
  "Testing",
  "Documentation",
  "Meetings",
];

const MIN_HOURS = 0;
const MAX_HOURS = 24;

export function EntryFormModal({
  open,
  onOpenChange,
  values,
  onChange,
  onSubmit,
  isSubmitting,
  error,
  isEditing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  values: EntryFormValues;
  onChange: (values: EntryFormValues) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error: string;
  isEditing: boolean;
}) {
  function updateField<K extends keyof EntryFormValues>(
    key: K,
    value: EntryFormValues[K],
  ) {
    onChange({ ...values, [key]: value });
  }

  function adjustHours(delta: number) {
    const next = Math.min(MAX_HOURS, Math.max(MIN_HOURS, values.hours + delta));
    updateField("hours", next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl gap-0 p-0">
        <DialogHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
          <DialogTitle className="text-base font-semibold">
            {isEditing ? "Edit Entry" : "Add New Entry"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 px-6 py-5">
          {/* Project */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label className="text-sm font-medium text-gray-900">
                Select Project <span className="text-red-500">*</span>
              </Label>
            </div>

            <Select
              value={values.project}
              onValueChange={(value) => updateField("project", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Project Name" />
              </SelectTrigger>
              <SelectContent position="popper">
                {PROJECT_OPTIONS.map((project) => (
                  <SelectItem key={project} value={project}>
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type of work */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label className="text-sm font-medium text-gray-900">
                Type of Work <span className="text-red-500">*</span>
              </Label>
            </div>

            <Select
              value={values.workType}
              onValueChange={(value) => updateField("workType", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Bug fixes" />
              </SelectTrigger>
              <SelectContent position="popper">
                {WORK_TYPE_OPTIONS.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Task description */}
          <div className="space-y-2">
            <Label
              id="description-label"
              className="text-sm font-medium text-gray-900"
            >
              Task description <span className="text-red-500">*</span>
            </Label>

            <Textarea
              id="description-label"
              placeholder="Write text here ..."
              value={values.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="min-h-25 resize-none"
            />

            <p className="text-xs text-gray-400">A note for extra info</p>
          </div>

          {/* Hours stepper */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              Hours <span className="text-red-500">*</span>
            </Label>

            <div className="flex w-fit items-center rounded-md border">
              <button
                type="button"
                onClick={() => adjustHours(-1)}
                className="flex h-9 w-9 items-center justify-center rounded-l-md cursor-pointer bg-gray-100 text-gray-500 hover:text-gray-900"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>

              <div className="flex h-9 w-12 items-center justify-center border-x text-sm">
                {values.hours}
              </div>

              <button
                type="button"
                onClick={() => adjustHours(1)}
                className="flex h-9 w-9 items-center justify-center rounded-r-md cursor-pointer bg-gray-100 text-gray-500 hover:text-gray-900"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <div className="flex gap-3 border-t px-6 py-4">
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-[#3159dd] hover:bg-[#284dcc]"
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Save changes"
                : "Add entry"}
          </Button>

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DropdownProps } from "react-day-picker";

interface DateTimePickerField {
  value: Date | undefined;
  onChange: (date: Date) => void;
}

export type DateTimePickerProps = {
  field: DateTimePickerField;
  className?: string;
} & React.ComponentProps<typeof DayPicker>;

function DateTimePicker({ className, field, ...props }: DateTimePickerProps) {
  function handleDateSelect(date: Date | undefined) {
    if (date) {
      field.onChange(date);
    }
  }

  function handleTimeChange(type: "hour" | "minute" | "ampm", value: string) {
    const currentDate = field.value || new Date();
    let newDate = new Date(currentDate);

    if (type === "hour") {
      const hour = parseInt(value, 10);
      newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    } else if (type === "ampm") {
      const hours = newDate.getHours();
      if (value === "AM" && hours >= 12) {
        newDate.setHours(hours - 12);
      } else if (value === "PM" && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }

    field.onChange(newDate);
  }
  return (
    <div className="sm:flex">
      <Calendar
        mode="single"
        selected={field.value}
        {...props}
        onSelect={handleDateSelect}
        initialFocus
      />
      <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
        <ScrollArea className="w-64 sm:w-auto">
          <div className="flex sm:flex-col p-2">
            {Array.from({ length: 12 }, (_, i) => i + 1)
              .reverse()
              .map((hour) => (
                <Button
                  key={hour}
                  size="icon"
                  variant={
                    field.value && field.value.getHours() % 12 === hour % 12
                      ? "default"
                      : "ghost"
                  }
                  className="sm:w-full shrink-0 aspect-square"
                  onClick={() => handleTimeChange("hour", hour.toString())}
                >
                  {hour}
                </Button>
              ))}
          </div>
          <ScrollBar orientation="horizontal" className="sm:hidden" />
        </ScrollArea>
        <ScrollArea className="w-64 sm:w-auto">
          <div className="flex sm:flex-col p-2">
            {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
              <Button
                key={minute}
                size="icon"
                variant={
                  field.value && field.value.getMinutes() === minute
                    ? "default"
                    : "ghost"
                }
                className="sm:w-full shrink-0 aspect-square"
                onClick={() => handleTimeChange("minute", minute.toString())}
              >
                {minute.toString().padStart(2, "0")}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="sm:hidden" />
        </ScrollArea>
        <ScrollArea className="">
          <div className="flex sm:flex-col p-2">
            {["AM", "PM"].map((ampm) => (
              <Button
                key={ampm}
                size="icon"
                variant={
                  field.value &&
                  ((ampm === "AM" && field.value.getHours() < 12) ||
                    (ampm === "PM" && field.value.getHours() >= 12))
                    ? "default"
                    : "ghost"
                }
                className="sm:w-full shrink-0 aspect-square"
                onClick={() => handleTimeChange("ampm", ampm)}
              >
                {ampm}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

DateTimePicker.displayName = "DateTimePicker";

export { DateTimePicker };

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { useDateSelector } from "@/hooks/useDateSelector";

console.log("✅ DateSelector v2 - Using Select component!");

interface DateSelectorProps {
  onDateSelect: (date: string | null, dateRange: string | null, includeAll: boolean) => void;
  selectedDate?: string;
  selectedDateRange?: string;
  includeAllDates?: boolean;
}

export default function DateSelector({
  onDateSelect,
  selectedDate,
  selectedDateRange,
  includeAllDates
}: DateSelectorProps) {
  const { displayLabel } = useDateSelector(selectedDate, selectedDateRange, includeAllDates);
  console.log("🎯 DateSelector with Select - label:", displayLabel);

  const handleChange = (value: string) => {
    console.log("📌 Selected value:", value);
    if (value === 'all') {
      onDateSelect(null, null, true);
    } else {
      onDateSelect(null, value as any, false);
    }
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <Select 
        value={includeAllDates ? 'all' : (selectedDateRange || '')}
        onValueChange={handleChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a date range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tenders (No Filter)</SelectItem>
          <SelectItem value="last_2_days">Last 2 Days</SelectItem>
          <SelectItem value="last_5_days">Last 5 Days</SelectItem>
          <SelectItem value="last_7_days">Last 7 Days</SelectItem>
          <SelectItem value="last_30_days">Last 30 Days</SelectItem>
          <SelectItem value="last_year">Last Year</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

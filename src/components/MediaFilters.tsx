import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown, User, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface MediaFiltersProps {
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  onSortChange: (sort: string) => void;
  onPeopleFilter: (people: string[]) => void;
  currentSort: string;
  availablePeople?: string[];
}

export function MediaFilters({
  onDateRangeChange,
  onSortChange,
  onPeopleFilter,
  currentSort,
  availablePeople = [],
}: MediaFiltersProps) {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

  const handleQuickDateFilter = (type: string) => {
    const now = new Date();
    let from: Date | undefined;
    let to: Date | undefined = now;

    switch (type) {
      case "last30":
        from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "thisMonth":
        from = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "lastMonth":
        from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        to = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case "thisQuarter":
        const quarter = Math.floor(now.getMonth() / 3);
        from = new Date(now.getFullYear(), quarter * 3, 1);
        break;
      case "lastQuarter":
        const lastQuarter = Math.floor(now.getMonth() / 3) - 1;
        const quarterYear = lastQuarter < 0 ? now.getFullYear() - 1 : now.getFullYear();
        const adjustedQuarter = lastQuarter < 0 ? 3 : lastQuarter;
        from = new Date(quarterYear, adjustedQuarter * 3, 1);
        to = new Date(quarterYear, adjustedQuarter * 3 + 3, 0);
        break;
      case "thisYear":
        from = new Date(now.getFullYear(), 0, 1);
        break;
      case "lastYear":
        from = new Date(now.getFullYear() - 1, 0, 1);
        to = new Date(now.getFullYear() - 1, 11, 31);
        break;
      default:
        from = undefined;
        to = undefined;
    }

    setDateRange({ from, to });
    onDateRangeChange({ from, to });
  };

  const handlePeopleToggle = (person: string) => {
    const newSelection = selectedPeople.includes(person)
      ? selectedPeople.filter(p => p !== person)
      : [...selectedPeople, person];
    setSelectedPeople(newSelection);
    onPeopleFilter(newSelection);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Date Range Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Date Range
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 bg-background">
          <DropdownMenuLabel>Quick Filters</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleQuickDateFilter("last30")}>
            <Clock className="h-4 w-4 mr-2" />
            Last 30 Days
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Months</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleQuickDateFilter("thisMonth")}>
            This Month
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleQuickDateFilter("lastMonth")}>
            Last Month
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Quarters</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleQuickDateFilter("thisQuarter")}>
            This Quarter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleQuickDateFilter("lastQuarter")}>
            Last Quarter
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Years</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleQuickDateFilter("thisYear")}>
            This Year
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleQuickDateFilter("lastYear")}>
            Last Year
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="w-full justify-start font-normal">
                <Calendar className="h-4 w-4 mr-2" />
                Custom Range
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-background" align="start">
              <CalendarComponent
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => {
                  setDateRange({ from: range?.from, to: range?.to });
                  onDateRangeChange({ from: range?.from, to: range?.to });
                }}
                numberOfMonths={2}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sort Options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            Sort By
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-background">
          <DropdownMenuItem onClick={() => onSortChange("date-desc")}>
            Newest First
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("date-asc")}>
            Oldest First
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("title-asc")}>
            Title (A-Z)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("title-desc")}>
            Title (Z-A)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("size-desc")}>
            Largest First
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("size-asc")}>
            Smallest First
          </DropdownMenuItem>
          {availablePeople.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onSortChange("people-desc")}>
                Most People Detected
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* People Filter */}
      {availablePeople.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <User className="h-4 w-4" />
              People {selectedPeople.length > 0 && `(${selectedPeople.length})`}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-72 overflow-y-auto bg-background">
            <DropdownMenuLabel>Filter by People</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availablePeople.map((person) => (
              <DropdownMenuItem
                key={person}
                onClick={() => handlePeopleToggle(person)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2 w-full">
                  <div
                    className={cn(
                      "h-4 w-4 rounded border",
                      selectedPeople.includes(person)
                        ? "bg-primary border-primary"
                        : "border-muted-foreground"
                    )}
                  />
                  {person}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Clear Filters */}
      {(dateRange.from || selectedPeople.length > 0) && (
        <Button
          variant="ghost"
          onClick={() => {
            setDateRange({ from: undefined, to: undefined });
            setSelectedPeople([]);
            onDateRangeChange({ from: undefined, to: undefined });
            onPeopleFilter([]);
            onSortChange("date-desc");
          }}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
}

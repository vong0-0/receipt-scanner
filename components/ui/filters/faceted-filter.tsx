import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";

interface FacetedFilterProps<T extends string> {
  title: string;
  options: T[];
  selected: T[];
  setSelected: (value: T[]) => void;
  renderIcon?: (option: T) => React.ReactNode;
  facets: Record<string, number>;
}

export function FacetedFilter<T extends string>({
  title,
  options,
  selected,
  setSelected,
  renderIcon,
  facets,
}: FacetedFilterProps<T>) {
  function toggle(value: T) {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    setSelected(next);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {selected.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              {selected.length > 1 ? (
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {selected.length} selected
                </Badge>
              ) : (
                selected.map((s) => (
                  <Badge
                    key={s}
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {s}
                  </Badge>
                ))
              )}
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected.includes(option);
                return (
                  <CommandItem key={option} onSelect={() => toggle(option)}>
                    <Checkbox checked={isSelected} className="mr-2" />
                    {renderIcon?.(option)}
                    <span>{option}</span>
                    <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs text-muted-foreground">
                      {facets[option] ?? 0}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selected.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => setSelected([])}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

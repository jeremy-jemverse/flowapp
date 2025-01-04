import * as React from "react";
import { Input, type InputProps } from "./input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps extends Omit<InputProps, "type" | "icon"> {
  onClear?: () => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onClear, ...props }, ref) => {
    const hasValue = value && value.toString().length > 0;

    return (
      <Input
        type="search"
        className={cn("pr-8", className)}
        icon={
          hasValue ? (
            <X
              className="h-4 w-4 cursor-pointer hover:text-foreground"
              onClick={onClear}
            />
          ) : (
            <Search className="h-4 w-4" />
          )
        }
        value={value}
        onChange={onChange}
        ref={ref}
        {...props}
      />
    );
  }
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
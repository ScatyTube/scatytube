import { useState } from "react";
import { Palette } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const StyleSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const handleSelect = (newTheme: "classic" | "novatube") => {
    setTheme(newTheme);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="btn-2007 flex items-center gap-1">
          <Palette size={12} />
          Styles
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0" align="end">
        <div className="box-header-2007">Styles</div>
        <div className="p-2 space-y-1 bg-card">
          <button
            onClick={() => handleSelect("classic")}
            className={`w-full text-left px-3 py-2 text-[11px] rounded transition-colors ${
              theme === "classic"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-foreground"
            }`}
          >
            Classic
          </button>
          <button
            onClick={() => handleSelect("novatube")}
            className={`w-full text-left px-3 py-2 text-[11px] rounded transition-colors ${
              theme === "novatube"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-foreground"
            }`}
          >
            NovaTube
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default StyleSwitcher;

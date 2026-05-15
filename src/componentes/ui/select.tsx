import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type SelectCtx = {
  value: string;
  onValueChange: (v: string) => void;
  open: boolean;
  setOpen: (o: boolean) => void;
  labels: Record<string, string>;
  registerLabel: (value: string, label: string) => void;
};

const Ctx = createContext<SelectCtx>({
  value: "",
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
  labels: {},
  registerLabel: () => {},
});

export function Select({
  value,
  onValueChange,
  children,
}: {
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const ref = useRef<HTMLDivElement>(null);

  const registerLabel = (v: string, label: string) => {
    setLabels((prev) => (prev[v] === label ? prev : { ...prev, [v]: label }));
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <Ctx.Provider value={{ value, onValueChange, open, setOpen, labels, registerLabel }}>
      <div ref={ref} className="relative">
        {children}
      </div>
    </Ctx.Provider>
  );
}

export function SelectTrigger({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open, setOpen } = useContext(Ctx);
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={`flex h-9 w-full items-center justify-between rounded-sm border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 ${className}`}
    >
      {children}
      <ChevronDown className="w-4 h-4 opacity-50 shrink-0 ml-2" />
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value, labels } = useContext(Ctx);
  const display = value ? (labels[value] ?? value) : undefined;
  return (
    <span className={display ? "" : "text-muted-foreground"}>
      {display ?? placeholder}
    </span>
  );
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  const { open } = useContext(Ctx);
  if (!open) return null;
  return (
    <div className="absolute z-50 mt-1 w-full min-w-[8rem] rounded-sm border border-border bg-white shadow-md">
      <div className="py-1">{children}</div>
    </div>
  );
}

export function SelectItem({
  value,
  children,
  className = "",
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { onValueChange, setOpen, value: selected, registerLabel } = useContext(Ctx);

  const label = typeof children === "string" ? children : String(children ?? value);
  useEffect(() => { registerLabel(value, label); }, [value, label]);

  return (
    <button
      type="button"
      onClick={() => { onValueChange(value); setOpen(false); }}
      className={`w-full text-left px-3 py-1.5 text-sm hover:bg-slate-100 transition-colors ${
        selected === value ? "font-medium bg-slate-50" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}

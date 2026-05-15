import React from "react";
import { LucideIcon } from "lucide-react";

interface AuthLayoutProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-border p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-navy-900 flex items-center justify-center mb-4">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
        {children}
        {footer && (
          <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
        )}
      </div>
    </div>
  );
}

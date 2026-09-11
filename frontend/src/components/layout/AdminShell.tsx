"use client";

import React, { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <div className="hidden md:block w-64 shrink-0 bg-slate-900">
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-3 sm:p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* Mobile vẫn để AdminSidebar tự render drawer */}
      <div className="md:hidden">
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
    </div>
  );
}
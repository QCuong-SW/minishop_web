import React from "react";
import Link from "next/link";
import { PackageOpen, LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  actionText,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-shopee-orange mb-4 shadow-inner">
        <Icon className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && (
        actionHref ? (
          <Link
            href={actionHref}
            className="px-6 py-2.5 bg-shopee-orange text-white font-semibold text-sm rounded-xl shadow hover:bg-shopee-hover hover:shadow-md transition active:scale-95"
          >
            {actionText}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onAction}
            className="px-6 py-2.5 bg-shopee-orange text-white font-semibold text-sm rounded-xl shadow hover:bg-shopee-hover hover:shadow-md transition active:scale-95"
          >
            {actionText}
          </button>
        )
      )}
    </div>
  );
}

import React from "react";

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-pulse flex flex-col">
      <div className="w-full aspect-square bg-slate-200" />
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-3.5 bg-slate-200 rounded w-1/3" />
          <div className="h-4 bg-slate-200 rounded w-5/6" />
          <div className="h-4 bg-slate-200 rounded w-4/6" />
        </div>
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="h-5 bg-slate-200 rounded w-1/2" />
            <div className="h-3 bg-slate-200 rounded w-1/4" />
          </div>
          <div className="h-9 bg-slate-200 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      {Array.from({ length: cols }).map((_, idx) => (
        <td key={idx} className="p-4">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export function DetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto animate-pulse">
      <div className="space-y-4">
        <div className="aspect-square bg-slate-200 rounded-3xl" />
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square bg-slate-200 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 rounded w-3/4" />
        <div className="h-5 bg-slate-200 rounded w-1/3" />
        <div className="h-10 bg-slate-200 rounded-2xl w-1/2" />
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-2/3" />
        </div>
        <div className="h-12 bg-slate-200 rounded-2xl w-full" />
      </div>
    </div>
  );
}

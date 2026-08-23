import Link from "next/link";
import { LayoutDashboard, Package, FolderTree, ShoppingBag, Ticket, CalendarCheck, Users, ArrowLeft } from "lucide-react";

export function AdminSidebar() {
  const menu = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Sản phẩm", href: "/admin/products", icon: Package },
    { label: "Danh mục", href: "/admin/categories", icon: FolderTree },
    { label: "Đơn hàng", href: "/admin/orders", icon: ShoppingBag },
    { label: "Mã giảm giá", href: "/admin/coupons", icon: Ticket },
    { label: "Lịch Showroom", href: "/admin/appointments", icon: CalendarCheck },
    { label: "Khách hàng", href: "/admin/users", icon: Users },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen p-4 flex flex-col justify-between">
      <div>
        <div className="text-xl font-bold text-white mb-8 px-2 flex items-center gap-2">
          <span>⚙️ Admin Panel</span>
        </div>
        <nav className="space-y-1">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-slate-800 hover:text-white transition"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <Link href="/" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Về trang khách
      </Link>
    </aside>
  );
}

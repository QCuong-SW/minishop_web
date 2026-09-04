import { AdminShell } from "@/components/layout/AdminShell";
import { AdminGuard } from "@/components/auth/AdminGuard";

export const metadata = {
  title: "Quản Trị Hệ Thống — MiniShop Admin",
  description: "Trang quản trị toàn diện cho MiniShop E-commerce",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}

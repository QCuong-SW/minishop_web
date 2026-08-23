import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md space-y-6">
        <h1 className="text-2xl font-bold text-center text-slate-800">Đăng Ký Tài Khoản</h1>
        <p className="text-center text-xs text-slate-500">
          Đã có tài khoản? <Link href="/login" className="text-shopee-orange font-semibold">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}

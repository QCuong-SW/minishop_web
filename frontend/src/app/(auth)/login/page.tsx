import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md space-y-6">
        <h1 className="text-2xl font-bold text-center text-slate-800">Đăng Nhập Shopee Mini</h1>
        <div className="space-y-4">
          <button className="w-full py-2.5 bg-shopee-orange text-white font-bold rounded-lg hover:bg-shopee-hover">
            1-Click Demo Login (Khách hàng)
          </button>
          <button className="w-full py-2.5 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900">
            1-Click Demo Login (Admin)
          </button>
        </div>
        <p className="text-center text-xs text-slate-500">
          Chưa có tài khoản? <Link href="/register" className="text-shopee-orange font-semibold">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}

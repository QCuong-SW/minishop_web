export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">📊 Tổng Quan Kinh Doanh (Dashboard)</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase">Tổng Doanh Thu</p>
          <p className="text-2xl font-black text-slate-800 mt-2">15.420.000 đ</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase">Tổng Đơn Hàng</p>
          <p className="text-2xl font-black text-slate-800 mt-2">128</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase">Sản Phẩm</p>
          <p className="text-2xl font-black text-slate-800 mt-2">45</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase">Khách Hàng</p>
          <p className="text-2xl font-black text-slate-800 mt-2">64</p>
        </div>
      </div>
    </div>
  );
}

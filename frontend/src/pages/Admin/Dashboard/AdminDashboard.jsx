import {
  AlertCircle,
  AlertTriangle,
  Boxes,
  CircleDollarSign,
  Clock3,
  LoaderCircle,
  Package,
  RefreshCw,
  ShoppingCart,
  Users,
  XCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";

import AdminStatCard from "@/components/admin/dashboard/AdminStatCard";
import AdminRevenueChart from "@/components/admin/dashboard/AdminRevenueChart";
import AdminRecentOrders from "@/components/admin/dashboard/AdminRecentOrders";
import AdminTopProducts from "@/components/admin/dashboard/AdminTopProducts";

import useAdminDashboard from "../../../hooks/useAdminDashboard";

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function formatNumber(value) {
  return (Number(value) || 0).toLocaleString("en-IN");
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const {
    statistics,
    recentOrders,
    monthlyRevenue,
    topProducts,
    loading,
    error,
    refresh,
  } = useAdminDashboard();

  if (loading) {
    return <AdminDashboardLoading />;
  }

  if (error) {
    return <AdminDashboardError message={error} onRetry={refresh} />;
  }

  return (
    <main className="min-h-full bg-slate-50 p-4 dark:bg-slate-950 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-[1600px]">
        <AdminPageHeader
          title="Dashboard"
          description="Monitor real store performance, orders, customers and inventory."
          actionLabel="Add product"
          onAction={() => navigate("/admin/products/new")}
        >
          <button
            type="button"
            onClick={refresh}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:border-emerald-200 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <RefreshCw size={16} />

            <span className="hidden sm:inline">Refresh</span>
          </button>
        </AdminPageHeader>

        <DashboardStatistics statistics={statistics} />

        <section className="mt-6">
          <AdminRevenueChart data={monthlyRevenue} />
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
          <AdminRecentOrders orders={recentOrders} />

          <AdminTopProducts products={topProducts} />
        </section>
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

function DashboardStatistics({ statistics }) {
  return (
    <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        title="Total Revenue"
        value={formatPrice(statistics.totalRevenue)}
        icon={CircleDollarSign}
        color="emerald"
        description="Paid and delivered orders"
      />

      <AdminStatCard
        title="Orders"
        value={formatNumber(statistics.totalOrders)}
        icon={ShoppingCart}
        color="blue"
        description="All customer orders"
      />

      <AdminStatCard
        title="Customers"
        value={formatNumber(statistics.totalCustomers)}
        icon={Users}
        color="violet"
        description="Registered customer accounts"
      />

      <AdminStatCard
        title="Products"
        value={formatNumber(statistics.totalProducts)}
        icon={Package}
        color="amber"
        description={`${formatNumber(
          statistics.activeProducts,
        )} active products`}
      />

      <AdminStatCard
        title="Pending Orders"
        value={formatNumber(statistics.pendingOrders)}
        icon={Clock3}
        color="amber"
        description="Pending, confirmed or processing"
      />

      <AdminStatCard
        title="Low Stock"
        value={formatNumber(statistics.lowStockProducts)}
        icon={AlertTriangle}
        color="amber"
        description="Active products with 1–5 units"
      />

      <AdminStatCard
        title="Out of Stock"
        value={formatNumber(statistics.outOfStockProducts)}
        icon={XCircle}
        color="red"
        description="Active products with zero units"
      />

      <AdminStatCard
        title="Inventory Units"
        value={formatNumber(statistics.inventoryUnits)}
        icon={Boxes}
        color="emerald"
        description="Units across active products"
      />
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Loading
|--------------------------------------------------------------------------
*/

function AdminDashboardLoading() {
  return (
    <main
      className="min-h-full bg-slate-50 p-4 dark:bg-slate-950 sm:p-6 lg:p-8"
      role="status"
      aria-label="Loading admin dashboard"
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="flex items-center gap-3">
          <LoaderCircle size={22} className="animate-spin text-emerald-600" />

          <div>
            <div className="h-7 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

            <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({
            length: 8,
          }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))}
        </div>

        <div className="mt-6 h-96 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />

          <div className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
        </div>
      </div>
    </main>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

          <div className="h-7 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>

        <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>

      <div className="mt-4 h-3 w-36 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Error
|--------------------------------------------------------------------------
*/

function AdminDashboardError({ message, onRetry }) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 p-5 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-500/10">
          <AlertCircle size={25} />
        </div>

        <h1 className="mt-4 text-xl font-bold text-slate-950 dark:text-white">
          Unable to load dashboard
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          <RefreshCw size={16} />
          Try again
        </button>
      </div>
    </main>
  );
}

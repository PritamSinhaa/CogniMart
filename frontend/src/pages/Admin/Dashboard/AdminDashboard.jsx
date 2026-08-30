import {
  AlertTriangle,
  Boxes,
  CircleDollarSign,
  Clock3,
  Package,
  ShoppingCart,
  Users,
  XCircle,
} from "lucide-react";

import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import AdminStatCard from "@/components/admin/dashboard/AdminStatCard";
import AdminRevenueChart from "@/components/admin/dashboard/AdminRevenueChart";
import AdminRecentOrders from "@/components/admin/dashboard/AdminRecentOrders";
import AdminTopProducts from "@/components/admin/dashboard/AdminTopProducts";
import AdminAIInsights from "@/components/admin/dashboard/AdminAIInsights";

export default function AdminDashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-[1600px]">
        {/* ==========================================================
            PAGE HEADER
        ========================================================== */}

        <AdminPageHeader
          title="Dashboard"
          description="Monitor your store performance, orders, customers, and AI-powered insights."
          actionLabel="Add product"
          onAction={() => console.log("Add product")}
        />

        {/* ==========================================================
            STAT CARDS
        ========================================================== */}

        <section
          className="
            mt-6
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          <AdminStatCard
            title="Total Revenue"
            value="₹12,84,500"
            icon={CircleDollarSign}
            color="emerald"
            change="+12.8%"
            trend="up"
          />

          <AdminStatCard
            title="Orders"
            value="1,248"
            icon={ShoppingCart}
            color="blue"
            change="+8.4%"
            trend="up"
          />

          <AdminStatCard
            title="Customers"
            value="8,492"
            icon={Users}
            color="violet"
            change="+14.2%"
            trend="up"
          />

          <AdminStatCard
            title="Products"
            value="1,284"
            icon={Package}
            color="amber"
            change="+3.1%"
            trend="up"
          />

          <AdminStatCard
            title="Pending Orders"
            value="48"
            icon={Clock3}
            color="amber"
            description="Orders waiting for processing"
          />

          <AdminStatCard
            title="Low Stock"
            value="23"
            icon={AlertTriangle}
            color="amber"
            description="Products need restocking"
          />

          <AdminStatCard
            title="Out of Stock"
            value="7"
            icon={XCircle}
            color="red"
            description="Products unavailable"
          />

          <AdminStatCard
            title="Inventory Units"
            value="24,892"
            icon={Boxes}
            color="emerald"
            change="+5.6%"
            trend="up"
          />
        </section>
        <section className="mt-6">
          <AdminRevenueChart />
        </section>
        <section className="mt-6">
          <AdminRecentOrders />
        </section>
        <section
          className="
    mt-6
    grid
    grid-cols-1
    gap-6
    xl:grid-cols-[1.5fr_1fr]
  "
        >
          <AdminRecentOrders />

          <AdminTopProducts />
        </section>

        <section className="mt-6">
          <AdminAIInsights />
        </section>
      </div>
    </div>
  );
}

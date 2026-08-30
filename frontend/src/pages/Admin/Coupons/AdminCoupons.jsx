import {
  CalendarDays,
  Check,
  Edit3,
  MoreHorizontal,
  Percent,
  Plus,
  Search,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
const initialCoupons = [
  {
    id: "CPN-001",
    code: "WELCOME20",
    type: "Percentage",
    value: 20,
    minOrder: 999,
    usageLimit: 500,
    used: 184,
    expires: "Dec 31, 2026",
    status: "Active",
  },
  {
    id: "CPN-002",
    code: "SAVE500",
    type: "Fixed",
    value: 500,
    minOrder: 2999,
    usageLimit: 200,
    used: 76,
    expires: "Nov 30, 2026",
    status: "Active",
  },
  {
    id: "CPN-003",
    code: "FESTIVE25",
    type: "Percentage",
    value: 25,
    minOrder: 1499,
    usageLimit: 1000,
    used: 623,
    expires: "Oct 15, 2026",
    status: "Active",
  },
  {
    id: "CPN-004",
    code: "TECH1000",
    type: "Fixed",
    value: 1000,
    minOrder: 4999,
    usageLimit: 100,
    used: 100,
    expires: "Sep 30, 2026",
    status: "Inactive",
  },
  {
    id: "CPN-005",
    code: "NEWUSER10",
    type: "Percentage",
    value: 10,
    minOrder: 499,
    usageLimit: 1000,
    used: 341,
    expires: "Jan 31, 2027",
    status: "Active",
  },
];
const statusOptions = ["All", "Active", "Inactive"];
export default function AdminCoupons() {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [form, setForm] = useState({
    code: "",
    type: "Percentage",
    value: "",
    minOrder: "",
    usageLimit: "",
    expires: "",
    status: "Active",
  });
  const filteredCoupons = useMemo(() => {
    const query = search.trim().toLowerCase();
    return coupons.filter((coupon) => {
      const matchesSearch =
        !query ||
        coupon.code.toLowerCase().includes(query) ||
        coupon.id.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "All" || coupon.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [coupons, search, statusFilter]);
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(
    (coupon) => coupon.status === "Active",
  ).length;
  const inactiveCoupons = coupons.filter(
    (coupon) => coupon.status === "Inactive",
  ).length;
  const totalUsage = coupons.reduce((total, coupon) => total + coupon.used, 0);
  const openCreateModal = () => {
    setEditingCoupon(null);
    setForm({
      code: "",
      type: "Percentage",
      value: "",
      minOrder: "",
      usageLimit: "",
      expires: "",
      status: "Active",
    });
    setShowModal(true);
  };
  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrder: coupon.minOrder,
      usageLimit: coupon.usageLimit,
      expires: coupon.expires,
      status: coupon.status,
    });
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const code = form.code.trim().toUpperCase();
    if (
      !code ||
      !form.value ||
      !form.minOrder ||
      !form.usageLimit ||
      !form.expires
    ) {
      return;
    }
    if (editingCoupon) {
      setCoupons((current) =>
        current.map((coupon) =>
          coupon.id === editingCoupon.id
            ? {
                ...coupon,
                code,
                type: form.type,
                value: Number(form.value),
                minOrder: Number(form.minOrder),
                usageLimit: Number(form.usageLimit),
                expires: form.expires,
                status: form.status,
              }
            : coupon,
        ),
      );
    } else {
      const newCoupon = {
        id: `CPN-${String(coupons.length + 1).padStart(3, "0")}`,
        code,
        type: form.type,
        value: Number(form.value),
        minOrder: Number(form.minOrder),
        usageLimit: Number(form.usageLimit),
        used: 0,
        expires: form.expires,
        status: form.status,
      };
      setCoupons((current) => [newCoupon, ...current]);
    }
    closeModal();
  };
  const toggleStatus = (couponId) => {
    setCoupons((current) =>
      current.map((coupon) =>
        coupon.id === couponId
          ? {
              ...coupon,
              status: coupon.status === "Active" ? "Inactive" : "Active",
            }
          : coupon,
      ),
    );
  };
  const deleteCoupon = (couponId) => {
    setCoupons((current) => current.filter((coupon) => coupon.id !== couponId));
  };
  return (
    <>
      {" "}
      <main className=" min-h-full bg-slate-50 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7 xl:px-10 dark:bg-slate-950 ">
        {" "}
        <div className="mx-auto w-full max-w-[1400px]">
          {" "}
          {/* HEADER */}{" "}
          <div className=" flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ">
            {" "}
            <div>
              {" "}
              <p className=" text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400 ">
                {" "}
                Marketing{" "}
              </p>{" "}
              <h1 className=" mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-[26px] dark:text-white ">
                {" "}
                Coupons{" "}
              </h1>{" "}
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {" "}
                Create and manage promotional discounts for your customers.{" "}
              </p>{" "}
            </div>{" "}
            <button
              type="button"
              onClick={openCreateModal}
              className=" inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 "
            >
              {" "}
              <Plus size={15} /> Create coupon{" "}
            </button>{" "}
          </div>{" "}
          {/* STATS */}{" "}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {" "}
            <CouponStat
              icon={Tag}
              label="Total coupons"
              value={totalCoupons}
              description="All promotional codes"
            />{" "}
            <CouponStat
              icon={Check}
              label="Active coupons"
              value={activeCoupons}
              description="Currently available"
              success
            />{" "}
            <CouponStat
              icon={X}
              label="Inactive"
              value={inactiveCoupons}
              description="Disabled promotions"
              warning
            />{" "}
            <CouponStat
              icon={Percent}
              label="Total usage"
              value={totalUsage.toLocaleString("en-IN")}
              description="Coupon redemptions"
            />{" "}
          </div>{" "}
          {/* FILTER BAR */}{" "}
          <section className=" mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 ">
            {" "}
            <div className=" flex flex-col gap-3 lg:flex-row lg:items-center ">
              {" "}
              <div className="relative min-w-0 flex-1">
                {" "}
                <Search
                  size={17}
                  className=" pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 "
                />{" "}
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search coupon code..."
                  className=" h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white "
                />{" "}
              </div>{" "}
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className=" h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 "
              >
                {" "}
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {" "}
                    {option === "All" ? "All status" : option}{" "}
                  </option>
                ))}{" "}
              </select>{" "}
            </div>{" "}
          </section>{" "}
          {/* COUPON TABLE */}{" "}
          <section className=" mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 ">
            {" "}
            <div className=" flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800 ">
              {" "}
              <div>
                {" "}
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  {" "}
                  All coupons{" "}
                </h2>{" "}
                <p className="mt-0.5 text-xs text-slate-400">
                  {" "}
                  Manage discounts and promotional campaigns.{" "}
                </p>{" "}
              </div>{" "}
              <span className="text-xs font-semibold text-slate-400">
                {" "}
                {filteredCoupons.length} coupons{" "}
              </span>{" "}
            </div>{" "}
            {/* DESKTOP */}{" "}
            <div className="hidden overflow-x-auto md:block">
              {" "}
              <table className="w-full min-w-[1050px]">
                {" "}
                <thead>
                  {" "}
                  <tr className=" border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/50 ">
                    {" "}
                    <CouponHeader> Coupon </CouponHeader>{" "}
                    <CouponHeader> Discount </CouponHeader>{" "}
                    <CouponHeader> Minimum order </CouponHeader>{" "}
                    <CouponHeader> Usage </CouponHeader>{" "}
                    <CouponHeader> Expires </CouponHeader>{" "}
                    <CouponHeader> Status </CouponHeader>{" "}
                    <CouponHeader align="right"> Actions </CouponHeader>{" "}
                  </tr>{" "}
                </thead>{" "}
                <tbody>
                  {" "}
                  {filteredCoupons.map((coupon) => (
                    <tr
                      key={coupon.id}
                      className=" border-b border-slate-100 last:border-0 hover:bg-slate-50/70 dark:border-slate-800/80 dark:hover:bg-slate-800/30 "
                    >
                      {" "}
                      <td className="px-5 py-4">
                        {" "}
                        <div className="flex items-center gap-3">
                          {" "}
                          <div className=" flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 ">
                            {" "}
                            <Tag size={15} />{" "}
                          </div>{" "}
                          <div>
                            {" "}
                            <p className="text-sm font-bold tracking-wide text-slate-900 dark:text-white">
                              {" "}
                              {coupon.code}{" "}
                            </p>{" "}
                            <p className="mt-0.5 text-[10px] text-slate-400">
                              {" "}
                              {coupon.id}{" "}
                            </p>{" "}
                          </div>{" "}
                        </div>{" "}
                      </td>{" "}
                      <td className="px-5 py-4">
                        {" "}
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {" "}
                          {coupon.type === "Percentage"
                            ? `${coupon.value}% OFF`
                            : `₹${Number(coupon.value).toLocaleString("en-IN")} OFF`}{" "}
                        </p>{" "}
                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {" "}
                          {coupon.type}{" "}
                        </p>{" "}
                      </td>{" "}
                      <td className="px-5 py-4">
                        {" "}
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {" "}
                          ₹{" "}
                          {Number(coupon.minOrder).toLocaleString("en-IN")}{" "}
                        </span>{" "}
                      </td>{" "}
                      <td className="px-5 py-4">
                        {" "}
                        <div className="min-w-[110px]">
                          {" "}
                          <div className="flex items-center justify-between text-[10px]">
                            {" "}
                            <span className="font-semibold text-slate-600 dark:text-slate-300">
                              {" "}
                              {coupon.used}{" "}
                            </span>{" "}
                            <span className="text-slate-400">
                              {" "}
                              / {coupon.usageLimit}{" "}
                            </span>{" "}
                          </div>{" "}
                          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            {" "}
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{
                                width: `${Math.min((coupon.used / coupon.usageLimit) * 100, 100)}%`,
                              }}
                            />{" "}
                          </div>{" "}
                        </div>{" "}
                      </td>{" "}
                      <td className="px-5 py-4">
                        {" "}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          {" "}
                          <CalendarDays size={13} /> {coupon.expires}{" "}
                        </div>{" "}
                      </td>{" "}
                      <td className="px-5 py-4">
                        {" "}
                        <CouponStatus status={coupon.status} />{" "}
                      </td>{" "}
                      <td className="px-5 py-4">
                        {" "}
                        <div className="flex justify-end gap-1">
                          {" "}
                          <CouponAction
                            label="Edit coupon"
                            onClick={() => openEditModal(coupon)}
                          >
                            {" "}
                            <Edit3 size={14} />{" "}
                          </CouponAction>{" "}
                          <CouponAction
                            label={
                              coupon.status === "Active"
                                ? "Deactivate coupon"
                                : "Activate coupon"
                            }
                            onClick={() => toggleStatus(coupon.id)}
                          >
                            {" "}
                            {coupon.status === "Active" ? (
                              <X size={14} />
                            ) : (
                              <Check size={14} />
                            )}{" "}
                          </CouponAction>{" "}
                          <CouponAction
                            label="Delete coupon"
                            danger
                            onClick={() => deleteCoupon(coupon.id)}
                          >
                            {" "}
                            <Trash2 size={14} />{" "}
                          </CouponAction>{" "}
                        </div>{" "}
                      </td>{" "}
                    </tr>
                  ))}{" "}
                </tbody>{" "}
              </table>{" "}
            </div>{" "}
            {/* MOBILE */}{" "}
            <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
              {" "}
              {filteredCoupons.map((coupon) => (
                <article key={coupon.id} className="p-4">
                  {" "}
                  <div className="flex items-start justify-between gap-3">
                    {" "}
                    <div className="flex min-w-0 items-center gap-3">
                      {" "}
                      <div className=" flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 ">
                        {" "}
                        <Tag size={15} />{" "}
                      </div>{" "}
                      <div className="min-w-0">
                        {" "}
                        <p className="truncate text-sm font-bold tracking-wide text-slate-900 dark:text-white">
                          {" "}
                          {coupon.code}{" "}
                        </p>{" "}
                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {" "}
                          {coupon.id}{" "}
                        </p>{" "}
                      </div>{" "}
                    </div>{" "}
                    <CouponStatus status={coupon.status} />{" "}
                  </div>{" "}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {" "}
                    <CouponInfo
                      label="Discount"
                      value={
                        coupon.type === "Percentage"
                          ? `${coupon.value}% OFF`
                          : `₹${Number(coupon.value).toLocaleString("en-IN")} OFF`
                      }
                    />{" "}
                    <CouponInfo
                      label="Minimum order"
                      value={`₹${Number(coupon.minOrder).toLocaleString("en-IN")}`}
                    />{" "}
                    <CouponInfo
                      label="Usage"
                      value={`${coupon.used} / ${coupon.usageLimit}`}
                    />{" "}
                    <CouponInfo label="Expires" value={coupon.expires} />{" "}
                  </div>{" "}
                  <div className="mt-4">
                    {" "}
                    <div className="flex items-center justify-between text-[10px]">
                      {" "}
                      <span className="font-semibold text-slate-500">
                        {" "}
                        Usage{" "}
                      </span>{" "}
                      <span className="text-slate-400">
                        {" "}
                        {Math.round(
                          (coupon.used / coupon.usageLimit) * 100,
                        )}{" "}
                        %{" "}
                      </span>{" "}
                    </div>{" "}
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      {" "}
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{
                          width: `${Math.min((coupon.used / coupon.usageLimit) * 100, 100)}%`,
                        }}
                      />{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="mt-4 flex gap-2">
                    {" "}
                    <button
                      type="button"
                      onClick={() => openEditModal(coupon)}
                      className=" flex h-9 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300 "
                    >
                      {" "}
                      <Edit3 size={13} /> Edit{" "}
                    </button>{" "}
                    <button
                      type="button"
                      onClick={() => toggleStatus(coupon.id)}
                      className=" flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-400 "
                    >
                      {" "}
                      {coupon.status === "Active" ? (
                        <X size={13} />
                      ) : (
                        <Check size={13} />
                      )}{" "}
                    </button>{" "}
                    <button
                      type="button"
                      onClick={() => deleteCoupon(coupon.id)}
                      className=" flex h-9 w-9 items-center justify-center rounded-xl border border-red-100 text-red-500 dark:border-red-900/50 dark:text-red-400 "
                      aria-label="Delete coupon"
                    >
                      {" "}
                      <Trash2 size={13} />{" "}
                    </button>{" "}
                  </div>{" "}
                </article>
              ))}{" "}
            </div>{" "}
            {!filteredCoupons.length && (
              <div className="px-6 py-16 text-center">
                {" "}
                <div className=" mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 ">
                  {" "}
                  <Tag size={20} />{" "}
                </div>{" "}
                <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                  {" "}
                  No coupons found{" "}
                </h3>{" "}
                <p className="mt-1 text-xs text-slate-400">
                  {" "}
                  Try changing your search or filter.{" "}
                </p>{" "}
              </div>
            )}{" "}
          </section>{" "}
        </div>{" "}
      </main>{" "}
      {/* CREATE / EDIT MODAL */}{" "}
      {showModal && (
        <div
          className=" fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 px-4 py-6 backdrop-blur-sm "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          {" "}
          <div className=" w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 ">
            {" "}
            <div className=" flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800 ">
              {" "}
              <div>
                {" "}
                <h2 className="text-base font-bold text-slate-950 dark:text-white">
                  {" "}
                  {editingCoupon ? "Edit coupon" : "Create coupon"}{" "}
                </h2>{" "}
                <p className="mt-0.5 text-xs text-slate-400">
                  {" "}
                  Configure your promotional discount.{" "}
                </p>{" "}
              </div>{" "}
              <button
                type="button"
                onClick={closeModal}
                className=" flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white "
                aria-label="Close"
              >
                {" "}
                <X size={17} />{" "}
              </button>{" "}
            </div>{" "}
            <form onSubmit={handleSubmit}>
              {" "}
              <div className="space-y-4 p-5">
                {" "}
                {/* Code */}{" "}
                <div>
                  {" "}
                  <label
                    htmlFor="coupon-code"
                    className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    {" "}
                    Coupon code{" "}
                  </label>{" "}
                  <input
                    id="coupon-code"
                    type="text"
                    value={form.code}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        code: event.target.value,
                      }))
                    }
                    placeholder="e.g. WELCOME20"
                    className=" h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold uppercase tracking-wide text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white "
                  />{" "}
                </div>{" "}
                {/* Type + Value */}{" "}
                <div className="grid gap-4 sm:grid-cols-2">
                  {" "}
                  <FormField label="Discount type" htmlFor="coupon-type">
                    {" "}
                    <select
                      id="coupon-type"
                      value={form.type}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          type: event.target.value,
                        }))
                      }
                      className={inputClass}
                    >
                      {" "}
                      <option value="Percentage"> Percentage </option>{" "}
                      <option value="Fixed"> Fixed amount </option>{" "}
                    </select>{" "}
                  </FormField>{" "}
                  <FormField
                    label={
                      form.type === "Percentage"
                        ? "Discount percentage"
                        : "Discount amount"
                    }
                    htmlFor="coupon-value"
                  >
                    {" "}
                    <input
                      id="coupon-value"
                      type="number"
                      min="0"
                      value={form.value}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          value: event.target.value,
                        }))
                      }
                      placeholder={form.type === "Percentage" ? "20" : "500"}
                      className={inputClass}
                    />{" "}
                  </FormField>{" "}
                </div>{" "}
                {/* Minimum + Usage */}{" "}
                <div className="grid gap-4 sm:grid-cols-2">
                  {" "}
                  <FormField
                    label="Minimum order amount"
                    htmlFor="coupon-min-order"
                  >
                    {" "}
                    <div className="relative">
                      {" "}
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                        {" "}
                        ₹{" "}
                      </span>{" "}
                      <input
                        id="coupon-min-order"
                        type="number"
                        min="0"
                        value={form.minOrder}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            minOrder: event.target.value,
                          }))
                        }
                        placeholder="999"
                        className={`${inputClass} pl-7`}
                      />{" "}
                    </div>{" "}
                  </FormField>{" "}
                  <FormField label="Usage limit" htmlFor="coupon-usage">
                    {" "}
                    <input
                      id="coupon-usage"
                      type="number"
                      min="1"
                      value={form.usageLimit}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          usageLimit: event.target.value,
                        }))
                      }
                      placeholder="500"
                      className={inputClass}
                    />{" "}
                  </FormField>{" "}
                </div>{" "}
                {/* Expiry + Status */}{" "}
                <div className="grid gap-4 sm:grid-cols-2">
                  {" "}
                  <FormField label="Expiry date" htmlFor="coupon-expiry">
                    {" "}
                    <input
                      id="coupon-expiry"
                      type="date"
                      value={form.expires}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          expires: event.target.value,
                        }))
                      }
                      className={inputClass}
                    />{" "}
                  </FormField>{" "}
                  <FormField label="Status" htmlFor="coupon-status">
                    {" "}
                    <select
                      id="coupon-status"
                      value={form.status}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          status: event.target.value,
                        }))
                      }
                      className={inputClass}
                    >
                      {" "}
                      <option value="Active"> Active </option>{" "}
                      <option value="Inactive"> Inactive </option>{" "}
                    </select>{" "}
                  </FormField>{" "}
                </div>{" "}
              </div>{" "}
              <div className=" flex justify-end gap-2 border-t border-slate-200 bg-slate-50/70 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/40 ">
                {" "}
                <button
                  type="button"
                  onClick={closeModal}
                  className=" h-9 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-600 hover:bg-white dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900 "
                >
                  {" "}
                  Cancel{" "}
                </button>{" "}
                <button
                  type="submit"
                  className=" h-9 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-700 "
                >
                  {" "}
                  {editingCoupon ? "Save changes" : "Create coupon"}{" "}
                </button>{" "}
              </div>{" "}
            </form>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </>
  );
}
const inputClass = ` h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white `;
function FormField({ label, htmlFor, children }) {
  return (
    <div>
      {" "}
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
      >
        {" "}
        {label}{" "}
      </label>{" "}
      {children}{" "}
    </div>
  );
}
function CouponStat({
  icon: Icon,
  label,
  value,
  description,
  success,
  warning,
}) {
  const iconClass = success
    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
    : warning
      ? "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
      : "bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400";
  return (
    <div className=" rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 ">
      {" "}
      <div className="flex items-center justify-between">
        {" "}
        <p className="text-xs text-slate-400"> {label} </p>{" "}
        <div
          className={` flex h-8 w-8 items-center justify-center rounded-xl ${iconClass} `}
        >
          {" "}
          <Icon size={15} />{" "}
        </div>{" "}
      </div>{" "}
      <p className="mt-3 text-xl font-bold text-slate-950 dark:text-white">
        {" "}
        {value}{" "}
      </p>{" "}
      <p className="mt-1 text-[11px] text-slate-400"> {description} </p>{" "}
    </div>
  );
}
function CouponHeader({ children, align }) {
  return (
    <th
      className={` px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 ${align === "right" ? "text-right" : "text-left"} `}
    >
      {" "}
      {children}{" "}
    </th>
  );
}
function CouponStatus({ status }) {
  const active = status === "Active";
  return (
    <span
      className={` inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${active ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"} `}
    >
      {" "}
      {status}{" "}
    </span>
  );
}
function CouponAction({ children, label, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={` flex h-8 w-8 items-center justify-center rounded-lg transition ${danger ? "text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30" : "text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"} `}
    >
      {" "}
      {children}{" "}
    </button>
  );
}
function CouponInfo({ label, value }) {
  return (
    <div>
      {" "}
      <p className="text-[10px] text-slate-400"> {label} </p>{" "}
      <p className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
        {" "}
        {value}{" "}
      </p>{" "}
    </div>
  );
}

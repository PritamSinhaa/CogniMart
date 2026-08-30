import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Boxes,
  PackageCheck,
  PackageX,
  RefreshCw,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";

const inventoryData = [
  {
    id: "PRD-1001",
    name: "Wireless Headphones",
    category: "Electronics",
    stock: 8,
    reorderLevel: 15,
    sold: 142,
    movement: "Fast",
    price: 2499,
  },
  {
    id: "PRD-1002",
    name: "Gaming Keyboard",
    category: "Electronics",
    stock: 24,
    reorderLevel: 10,
    sold: 118,
    movement: "Fast",
    price: 3499,
  },
  {
    id: "PRD-1003",
    name: "Smart Watch Pro",
    category: "Wearables",
    stock: 0,
    reorderLevel: 12,
    sold: 96,
    movement: "Fast",
    price: 5999,
  },
  {
    id: "PRD-1004",
    name: "USB-C Hub",
    category: "Accessories",
    stock: 43,
    reorderLevel: 15,
    sold: 87,
    movement: "Fast",
    price: 1899,
  },
  {
    id: "PRD-1005",
    name: "Mechanical Mouse",
    category: "Electronics",
    stock: 6,
    reorderLevel: 12,
    sold: 79,
    movement: "Fast",
    price: 2299,
  },
  {
    id: "PRD-1006",
    name: "Laptop Stand",
    category: "Accessories",
    stock: 31,
    reorderLevel: 10,
    sold: 54,
    movement: "Normal",
    price: 1499,
  },
  {
    id: "PRD-1007",
    name: "Bluetooth Speaker",
    category: "Audio",
    stock: 14,
    reorderLevel: 10,
    sold: 42,
    movement: "Normal",
    price: 2799,
  },
  {
    id: "PRD-1008",
    name: "Webcam Full HD",
    category: "Electronics",
    stock: 3,
    reorderLevel: 10,
    sold: 68,
    movement: "Fast",
    price: 3199,
  },
  {
    id: "PRD-1009",
    name: "Office Chair",
    category: "Furniture",
    stock: 18,
    reorderLevel: 8,
    sold: 19,
    movement: "Slow",
    price: 8999,
  },
  {
    id: "PRD-1010",
    name: "Desk Lamp",
    category: "Home",
    stock: 2,
    reorderLevel: 8,
    sold: 31,
    movement: "Normal",
    price: 1299,
  },
];

const statusOptions = ["All", "In Stock", "Low Stock", "Out of Stock"];

const movementOptions = ["All", "Fast", "Normal", "Slow"];

function getStockStatus(product) {
  if (product.stock === 0) return "Out of Stock";
  if (product.stock <= product.reorderLevel) return "Low Stock";
  return "In Stock";
}

function getStockClasses(status) {
  switch (status) {
    case "In Stock":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400";

    case "Low Stock":
      return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400";

    case "Out of Stock":
      return "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400";

    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
  }
}

function getMovementClasses(movement) {
  switch (movement) {
    case "Fast":
      return "text-emerald-600 dark:text-emerald-400";

    case "Slow":
      return "text-red-500 dark:text-red-400";

    default:
      return "text-slate-500 dark:text-slate-400";
  }
}

export default function AdminInventory() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [movement, setMovement] = useState("All");

  const [stock, setStock] = useState(
    Object.fromEntries(
      inventoryData.map((product) => [product.id, product.stock]),
    ),
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return inventoryData.filter((product) => {
      const currentStock = stock[product.id] ?? 0;

      const productStatus = getStockStatus({
        ...product,
        stock: currentStock,
      });

      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      const matchesStatus = status === "All" || productStatus === status;

      const matchesMovement =
        movement === "All" || product.movement === movement;

      return matchesSearch && matchesStatus && matchesMovement;
    });
  }, [search, status, movement, stock]);

  const totalProducts = inventoryData.length;

  const totalUnits = Object.values(stock).reduce(
    (sum, quantity) => sum + quantity,
    0,
  );

  const lowStockCount = inventoryData.filter(
    (product) =>
      stock[product.id] > 0 && stock[product.id] <= product.reorderLevel,
  ).length;

  const outOfStockCount = inventoryData.filter(
    (product) => stock[product.id] === 0,
  ).length;

  const fastMovingCount = inventoryData.filter(
    (product) => product.movement === "Fast",
  ).length;

  const updateStock = (productId, amount) => {
    setStock((current) => ({
      ...current,
      [productId]: Math.max(0, (current[productId] ?? 0) + amount),
    }));
  };

  return (
    <main
      className="
        min-h-full
        bg-slate-50
        px-4
        py-5
        sm:px-6
        sm:py-6
        lg:px-8
        lg:py-7
        xl:px-10
        dark:bg-slate-950
      "
    >
      <div className="mx-auto w-full max-w-[1400px]">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <p
              className="
                text-[11px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-emerald-600
                dark:text-emerald-400
              "
            >
              Inventory
            </p>

            <h1
              className="
                mt-1
                text-2xl
                font-bold
                tracking-tight
                text-slate-950
                sm:text-[26px]
                dark:text-white
              "
            >
              Inventory management
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Monitor stock levels and identify products that need attention.
            </p>
          </div>

          <button
            type="button"
            className="
              inline-flex
              h-10
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-emerald-600
              px-4
              text-xs
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-emerald-700
              sm:w-auto
            "
          >
            <RefreshCw size={14} />
            Update inventory
          </button>
        </div>

        {/* ======================================================
            SUMMARY CARDS
        ====================================================== */}

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <InventoryStat
            icon={Boxes}
            label="Total products"
            value={totalProducts}
            description={`${totalUnits} units in stock`}
          />

          <InventoryStat
            icon={AlertTriangle}
            label="Low stock"
            value={lowStockCount}
            description="Products need restocking"
            warning
          />

          <InventoryStat
            icon={PackageX}
            label="Out of stock"
            value={outOfStockCount}
            description="Products unavailable"
            danger
          />

          <InventoryStat
            icon={TrendingUp}
            label="Fast moving"
            value={fastMovingCount}
            description="High-demand products"
            success
          />
        </div>

        {/* ======================================================
            AI RECOMMENDATION
        ====================================================== */}

        <section
          className="
            mt-5
            overflow-hidden
            rounded-2xl
            border
            border-emerald-100
            bg-emerald-50/70
            p-5
            shadow-sm
            dark:border-emerald-900/60
            dark:bg-emerald-950/20
          "
        >
          <div
            className="
              flex
              flex-col
              gap-4
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div className="flex items-start gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-white
                  text-emerald-600
                  shadow-sm
                  dark:bg-slate-900
                  dark:text-emerald-400
                "
              >
                <Sparkles size={18} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    AI inventory recommendation
                  </h2>

                  <span
                    className="
                      rounded-full
                      bg-emerald-100
                      px-2
                      py-0.5
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-emerald-700
                      dark:bg-emerald-900/60
                      dark:text-emerald-400
                    "
                  >
                    AI
                  </span>
                </div>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-600 dark:text-slate-400">
                  Wireless Headphones are down to 8 units while recent demand
                  remains high. CogniMart recommends restocking 25 units before
                  the next sales cycle.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="
                inline-flex
                h-9
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-emerald-600
                px-3
                text-xs
                font-semibold
                text-white
                transition
                hover:bg-emerald-700
              "
            >
              Restock 25 units
              <ArrowUp size={14} />
            </button>
          </div>
        </section>

        {/* ======================================================
            FILTER BAR
        ====================================================== */}

        <section
          className="
            mt-5
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-4
            shadow-sm
            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          <div
            className="
              flex
              flex-col
              gap-3
              lg:flex-row
              lg:items-center
            "
          >
            <div className="relative min-w-0 flex-1">
              <Search
                size={17}
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products, categories or product ID..."
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  pl-10
                  pr-3
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-emerald-500
                  focus:bg-white
                  focus:ring-2
                  focus:ring-emerald-500/10
                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-white
                  dark:focus:bg-slate-950
                "
              />
            </div>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="
                h-11
                rounded-xl
                border
                border-slate-200
                bg-white
                px-3
                text-sm
                font-medium
                text-slate-700
                outline-none
                focus:border-emerald-500
                focus:ring-2
                focus:ring-emerald-500/10
                dark:border-slate-700
                dark:bg-slate-950
                dark:text-slate-300
              "
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "All" ? "All stock" : option}
                </option>
              ))}
            </select>

            <select
              value={movement}
              onChange={(event) => setMovement(event.target.value)}
              className="
                h-11
                rounded-xl
                border
                border-slate-200
                bg-white
                px-3
                text-sm
                font-medium
                text-slate-700
                outline-none
                focus:border-emerald-500
                focus:ring-2
                focus:ring-emerald-500/10
                dark:border-slate-700
                dark:bg-slate-950
                dark:text-slate-300
              "
            >
              {movementOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "All" ? "All movement" : `${option} moving`}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* ======================================================
            INVENTORY TABLE
        ====================================================== */}

        <section
          className="
            mt-5
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-slate-200
              px-5
              py-4
              dark:border-slate-800
            "
          >
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Stock overview
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                Monitor current inventory levels.
              </p>
            </div>

            <span className="text-xs font-semibold text-slate-400">
              {filteredProducts.length} products
            </span>
          </div>

          {/* Desktop */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr
                  className="
                    border-b
                    border-slate-200
                    bg-slate-50/80
                    dark:border-slate-800
                    dark:bg-slate-950/50
                  "
                >
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Product
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Category
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Current stock
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Reorder level
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Movement
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => {
                  const currentStock = stock[product.id] ?? 0;

                  const stockStatus = getStockStatus({
                    ...product,
                    stock: currentStock,
                  });

                  return (
                    <tr
                      key={product.id}
                      className="
                        border-b
                        border-slate-100
                        last:border-0
                        hover:bg-slate-50/70
                        dark:border-slate-800/80
                        dark:hover:bg-slate-800/30
                      "
                    >
                      {/* Product */}

                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {product.name}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-400">
                            {product.id}
                          </p>
                        </div>
                      </td>

                      {/* Category */}

                      <td className="px-5 py-4">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {product.category}
                        </span>
                      </td>

                      {/* Current stock */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`
                              text-sm
                              font-bold
                              ${
                                currentStock === 0
                                  ? "text-red-600 dark:text-red-400"
                                  : currentStock <= product.reorderLevel
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "text-slate-900 dark:text-white"
                              }
                            `}
                          >
                            {currentStock}
                          </span>

                          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700">
                            <button
                              type="button"
                              onClick={() => updateStock(product.id, -1)}
                              className="
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                text-slate-400
                                hover:bg-slate-50
                                hover:text-slate-700
                                dark:hover:bg-slate-800
                              "
                              aria-label={`Decrease ${product.name} stock`}
                            >
                              <ArrowDown size={12} />
                            </button>

                            <button
                              type="button"
                              onClick={() => updateStock(product.id, 1)}
                              className="
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                border-l
                                border-slate-200
                                text-slate-400
                                hover:bg-slate-50
                                hover:text-emerald-600
                                dark:border-slate-700
                                dark:hover:bg-slate-800
                              "
                              aria-label={`Increase ${product.name} stock`}
                            >
                              <ArrowUp size={12} />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Reorder */}

                      <td className="px-5 py-4">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {product.reorderLevel}
                        </span>
                      </td>

                      {/* Movement */}

                      <td className="px-5 py-4">
                        <span
                          className={`
                            inline-flex
                            items-center
                            gap-1.5
                            text-xs
                            font-bold
                            ${getMovementClasses(product.movement)}
                          `}
                        >
                          {product.movement === "Fast" && (
                            <TrendingUp size={13} />
                          )}

                          {product.movement === "Slow" && (
                            <TrendingDown size={13} />
                          )}

                          {product.movement}
                        </span>
                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">
                        <span
                          className={`
                            inline-flex
                            rounded-full
                            px-2.5
                            py-1
                            text-[10px]
                            font-bold
                            ${getStockClasses(stockStatus)}
                          `}
                        >
                          {stockStatus}
                        </span>
                      </td>

                      {/* Action */}

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          className="
                            inline-flex
                            h-8
                            items-center
                            gap-1.5
                            rounded-lg
                            bg-slate-100
                            px-2.5
                            text-xs
                            font-semibold
                            text-slate-700
                            transition
                            hover:bg-emerald-50
                            hover:text-emerald-700
                            dark:bg-slate-800
                            dark:text-slate-300
                            dark:hover:bg-emerald-950/40
                            dark:hover:text-emerald-400
                          "
                        >
                          <PackageCheck size={13} />
                          Restock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ====================================================
              MOBILE
          ==================================================== */}

          <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
            {filteredProducts.map((product) => {
              const currentStock = stock[product.id] ?? 0;

              const stockStatus = getStockStatus({
                ...product,
                stock: currentStock,
              });

              return (
                <article key={product.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                        {product.name}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        {product.id} · {product.category}
                      </p>
                    </div>

                    <span
                      className={`
                        shrink-0
                        rounded-full
                        px-2.5
                        py-1
                        text-[10px]
                        font-bold
                        ${getStockClasses(stockStatus)}
                      `}
                    >
                      {stockStatus}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] text-slate-400">
                        Current stock
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`
                            text-sm
                            font-bold
                            ${
                              currentStock === 0
                                ? "text-red-600 dark:text-red-400"
                                : currentStock <= product.reorderLevel
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-slate-900 dark:text-white"
                            }
                          `}
                        >
                          {currentStock}
                        </span>

                        <div className="flex rounded-lg border border-slate-200 dark:border-slate-700">
                          <button
                            type="button"
                            onClick={() => updateStock(product.id, -1)}
                            className="flex h-7 w-7 items-center justify-center text-slate-400"
                          >
                            <ArrowDown size={12} />
                          </button>

                          <button
                            type="button"
                            onClick={() => updateStock(product.id, 1)}
                            className="
                              flex
                              h-7
                              w-7
                              items-center
                              justify-center
                              border-l
                              border-slate-200
                              text-slate-400
                              dark:border-slate-700
                            "
                          >
                            <ArrowUp size={12} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400">
                        Reorder level
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                        {product.reorderLevel}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400">Movement</p>

                      <p
                        className={`
                          mt-1
                          inline-flex
                          items-center
                          gap-1
                          text-xs
                          font-bold
                          ${getMovementClasses(product.movement)}
                        `}
                      >
                        {product.movement === "Fast" && (
                          <TrendingUp size={12} />
                        )}

                        {product.movement === "Slow" && (
                          <TrendingDown size={12} />
                        )}

                        {product.movement}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400">Sold</p>

                      <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                        {product.sold}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="
                      mt-4
                      flex
                      h-9
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-slate-200
                      text-xs
                      font-semibold
                      text-slate-700
                      transition
                      hover:bg-slate-50
                      dark:border-slate-700
                      dark:text-slate-300
                      dark:hover:bg-slate-800
                    "
                  >
                    <PackageCheck size={14} />
                    Restock product
                  </button>
                </article>
              );
            })}
          </div>

          {/* Empty state */}

          {!filteredProducts.length && (
            <div className="px-6 py-16 text-center">
              <div
                className="
                  mx-auto
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-slate-100
                  text-slate-400
                  dark:bg-slate-800
                "
              >
                <Boxes size={20} />
              </div>

              <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                No inventory found
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </section>

        {/* ======================================================
            INVENTORY INSIGHTS
        ====================================================== */}

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <InsightCard
            icon={AlertTriangle}
            title="Low stock attention"
            description="3 products are below their recommended reorder level."
            action="Review low stock"
            warning
          />

          <InsightCard
            icon={TrendingDown}
            title="Slow-moving inventory"
            description="Office Chair has the lowest recent sales velocity and may need a promotion."
            action="View slow movers"
          />
        </div>
      </div>
    </main>
  );
}

function InventoryStat({
  icon: Icon,
  label,
  value,
  description,
  warning,
  danger,
  success,
}) {
  const iconClass = danger
    ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
    : warning
      ? "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
      : success
        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
        : "bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400";

  const valueClass = danger
    ? "text-red-600 dark:text-red-400"
    : warning
      ? "text-amber-600 dark:text-amber-400"
      : success
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-slate-950 dark:text-white";

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">{label}</p>

        <div
          className={`
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-xl
            ${iconClass}
          `}
        >
          <Icon size={15} />
        </div>
      </div>

      <p
        className={`
          mt-3
          text-xl
          font-bold
          ${valueClass}
        `}
      >
        {value}
      </p>

      <p className="mt-1 text-[11px] text-slate-400">{description}</p>
    </div>
  );
}

function InsightCard({
  icon: Icon,
  title,
  description,
  action,
  warning = false,
}) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-4
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <div className="flex items-start gap-3">
        <div
          className={`
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            ${
              warning
                ? "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                : "bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
            }
          `}
        >
          <Icon size={16} />
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        className="
          hidden
          shrink-0
          rounded-lg
          px-2.5
          py-2
          text-[11px]
          font-semibold
          text-emerald-600
          hover:bg-emerald-50
          sm:block
          dark:text-emerald-400
          dark:hover:bg-emerald-950/30
        "
      >
        {action}
      </button>
    </div>
  );
}

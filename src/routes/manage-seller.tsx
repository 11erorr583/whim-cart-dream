import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Truck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Store,
  DollarSign,
  Layers,
  ArrowUpRight,
  Filter,
} from "lucide-react";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { SellerProductForm } from "@/components/fictional/SellerProductForm";
import { formatCoins } from "@/lib/fictional-config";
import { useSeller } from "@/state/seller";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/manage-seller")({
  head: () => ({
    meta: [
      { title: "Merchant Operations & Order Manager — Whim Cart" },
      {
        name: "description",
        content:
          "Manage your store inventory, track incoming customer orders, fulfill shipments with tracking numbers, and view sales performance.",
      },
      { property: "og:title", content: "Merchant Operations — Whim Cart" },
      {
        property: "og:description",
        content: "Complete seller inventory, order dispatch, and financial overview.",
      },
    ],
  }),
  component: ManageSellerPage,
});

type TabType = "inventory" | "orders" | "financials";

function ManageSellerPage() {
  const { products, profile, orders, updateProduct, deleteProduct, updateOrderStatus, hydrated } =
    useSeller();

  const [activeTab, setActiveTab] = useState<TabType>("inventory");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inventorySearch, setInventorySearch] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [courierInput, setCourierInput] = useState<{ [orderId: string]: string }>({});

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      p.category.toLowerCase().includes(inventorySearch.toLowerCase()),
  );

  const totalRevenue = orders.reduce((sum, o) => sum + o.subtotal, 0);
  const pendingOrders = orders.filter((o) => o.status === "processing");
  const shippedOrders = orders.filter((o) => o.status === "shipped");
  const deliveredOrders = orders.filter((o) => o.status === "delivered");

  return (
    <PageShell wide>
      {/* Toast Notification */}
      {statusMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-800 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{statusMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <Store className="w-4 h-4 text-emerald-600" />
            <span>{profile.displayName || "Merchant Studio"}</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
              Verified Merchant
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Seller Management Module
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/seller-profile"
            className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors"
          >
            Store Profile & Policies
          </Link>
          <Link
            to="/sell"
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Gross Marketplace Sales</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
            {formatCoins(totalRevenue)}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">100% payout rate</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Active Products</span>
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
            {products.length}
          </p>
          <span className="text-[11px] text-slate-500">Live in marketplace</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Pending Orders</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
            {pendingOrders.length}
          </p>
          <span className="text-[11px] text-amber-600 font-medium">Requires dispatch</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Fulfilled & In Transit</span>
            <Truck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
            {shippedOrders.length + deliveredOrders.length}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">99.8% on-time delivery</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mt-8 flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("inventory")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "inventory"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Product Catalog & Inventory ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "orders"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Order Fulfillment ({orders.length})</span>
          {pendingOrders.length > 0 && <span className="w-2 h-2 rounded-full bg-amber-500" />}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("financials")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "financials"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Financials & Payouts</span>
        </button>
      </div>

      {/* TAB 1: Inventory & Product Catalog */}
      {activeTab === "inventory" && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                placeholder="Search products by title or category..."
                className="w-full pl-9 pr-3.5 py-2 bg-white rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900"
              />
            </div>

            <Link
              to="/sell"
              className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Listing</span>
            </Link>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
              <Package className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No products found</p>
              <p className="text-xs text-slate-500">
                You haven't listed any items matching this query.
              </p>
              <Link
                to="/sell"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold"
              >
                Upload First Item
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors"
                  >
                    {editingId === product.id ? (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <SellerProductForm
                          initial={{
                            name: product.name,
                            blurb: product.blurb,
                            category: product.category,
                            price: product.price,
                            comparePrice: product.comparePrice,
                            inventory: product.inventory,
                            sku: product.sku,
                            images: product.images,
                            description: product.description,
                            specifications: product.specifications,
                          }}
                          submitLabel="Save Changes"
                          onCancel={() => setEditingId(null)}
                          onSubmit={(draft) => {
                            updateProduct(product.id, draft);
                            setEditingId(null);
                            showNotification(`Listing "${draft.name}" updated successfully.`);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                            {product.images && product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  if (!target.src.includes("photo-1523275335684-37898b6baf30")) {
                                    target.src =
                                      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80";
                                  }
                                }}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-2xl">{product.emoji || "📦"}</span>
                            )}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
                                {product.category}
                              </span>
                              {product.sku && (
                                <span className="text-[11px] text-slate-400 font-mono">
                                  SKU: {product.sku}
                                </span>
                              )}
                            </div>
                            <h3 className="text-sm font-bold text-slate-900">
                              <Link
                                to="/product/$productId"
                                params={{ productId: product.id }}
                                className="hover:text-emerald-700 transition-colors"
                              >
                                {product.name}
                              </Link>
                            </h3>
                            <p className="text-xs text-slate-500 line-clamp-1">{product.blurb}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                          <div className="text-right">
                            <span className="text-sm font-extrabold text-slate-900 font-display block">
                              {formatCoins(product.price)}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Stock: {product.inventory ?? 25} units
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingId(product.id)}
                              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                              title="Edit product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                deleteProduct(product.id);
                                showNotification(`"${product.name}" removed from store.`);
                              }}
                              className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Order Fulfillment & Dispatch */}
      {activeTab === "orders" && (
        <div className="mt-6 space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
              <ShoppingBag className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No customer orders yet</p>
              <p className="text-xs text-slate-500">
                When shoppers buy products from your store or catalog, orders appear here for
                fulfillment and tracking number assignment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const isProcessing = order.status === "processing";
                const isShipped = order.status === "shipped";
                const isDelivered = order.status === "delivered";

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 font-mono">
                            {order.orderNumber}
                          </span>
                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase",
                              isProcessing && "bg-amber-100 text-amber-800",
                              isShipped && "bg-blue-100 text-blue-800",
                              isDelivered && "bg-emerald-100 text-emerald-800",
                            )}
                          >
                            {order.status}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          Placed on {new Date(order.createdAt).toLocaleDateString()} by{" "}
                          <strong className="text-slate-700">{order.customerName}</strong>
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-500 block">Total Settlement</span>
                        <span className="text-base font-extrabold text-slate-900 font-display">
                          {formatCoins(order.subtotal)}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                        Ordered Items
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs"
                          >
                            <span className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0">
                              {item.quantity}x
                            </span>
                            <span className="font-semibold text-slate-900 truncate">
                              {item.productName}
                            </span>
                            <span className="ml-auto font-mono text-slate-700">
                              {formatCoins(item.unitPrice * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Destination & Courier Action */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 text-xs">
                      <div className="text-slate-600">
                        <span className="font-semibold text-slate-800">Ship to: </span>
                        {order.shippingAddress}
                      </div>

                      <div className="flex items-center gap-2">
                        {isProcessing && (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="e.g. FEDEX-98214"
                              value={courierInput[order.id] || ""}
                              onChange={(e) =>
                                setCourierInput((prev) => ({
                                  ...prev,
                                  [order.id]: e.target.value,
                                }))
                              }
                              className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono w-36"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const tracking = courierInput[order.id] || "TRK-983192-US";
                                updateOrderStatus(order.id, "shipped", tracking);
                                showNotification(`Order ${order.orderNumber} marked as Shipped!`);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Dispatch & Add Tracking</span>
                            </button>
                          </div>
                        )}

                        {isShipped && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-blue-700 font-mono font-semibold">
                              Tracking: {order.trackingNumber}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                updateOrderStatus(order.id, "delivered");
                                showNotification(`Order ${order.orderNumber} confirmed Delivered!`);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Mark Delivered</span>
                            </button>
                          </div>
                        )}

                        {isDelivered && (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Fulfillment Complete
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Financial Overview & Settlement */}
      {activeTab === "financials" && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span>Merchant Settlement & Payout Balance</span>
            </h3>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Available for Next Payout</span>
                <span className="text-3xl font-extrabold text-slate-900 font-display">
                  {formatCoins(totalRevenue)}
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Settling to: {profile.payoutAccount || "Direct Deposit (Default)"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => showNotification("Automatic payout scheduled for upcoming Friday.")}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
              >
                Request Early Transfer
              </button>
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Recent Settlement Batches
              </h4>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 block">
                      Automated Weekly Clearing #1042
                    </span>
                    <span className="text-slate-400 text-[11px]">Processed via ACH Direct</span>
                  </div>
                  <span className="font-bold text-emerald-700 font-mono">Completed</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 block">
                      Automated Weekly Clearing #1041
                    </span>
                    <span className="text-slate-400 text-[11px]">Processed via ACH Direct</span>
                  </div>
                  <span className="font-bold text-emerald-700 font-mono">Completed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Store className="w-4 h-4 text-emerald-600" />
              <span>Merchant Tier Status</span>
            </h4>

            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-600">Store Level:</span>
                <span className="text-emerald-700">Tier 2 Top Rated</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Dispute Rate:</span>
                <span className="text-slate-900 font-mono">0.00%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Dispatch Speed:</span>
                <span className="text-slate-900 font-mono">&lt; 24h average</span>
              </div>
            </div>

            <FictionalNotice
              title="Merchant Clearing House"
              description="Orders and balances simulate standard ecommerce transactions with local merchant persistence."
            />
          </div>
        </div>
      )}
    </PageShell>
  );
}

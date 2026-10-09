import { useCallback, useEffect, useRef, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { api } from "../auth.js";
import { dateTimeFmt, numberFmt, timeAgo } from "../utils/format.js";
import { PAGE_SIZES, Pager, RoleTabs } from "./Users.jsx";
import "./pages.css";
import "./Users.css";
import "./Orders.css";

// `id` matches the order `status` enum in delivery_api; "all" sends no filter.
const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "preparing", label: "Preparing" },
  { id: "ready_for_pickup", label: "Ready for pickup" },
  { id: "picked_up", label: "On the way" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

const STATUS_LABELS = Object.fromEntries(STATUS_TABS.map((tab) => [tab.id, tab.label]));

const moneyFmt = new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 });

export default function Orders() {
  const { token } = useOutletContext();
  const [params, setParams] = useSearchParams();
  const directoryRef = useRef(null);

  const active = STATUS_TABS.find((tab) => tab.id === params.get("status")) ?? STATUS_TABS[0];
  const page = Math.max(1, Number.parseInt(params.get("page"), 10) || 1);
  const pageSize = PAGE_SIZES.find((size) => String(size) === params.get("size")) ?? PAGE_SIZES[0];

  const updateParams = useCallback(
    (changes) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(changes)) {
            if (value === null || value === "") next.delete(key);
            else next.set(key, String(value));
          }
          return next;
        },
        { replace: true }
      ),
    [setParams]
  );

  const [reloadKey, setReloadKey] = useState(0);
  const [list, setList] = useState({ status: "loading", tab: null, rows: [], pagination: null, error: "" });

  useEffect(() => {
    let cancelled = false;
    setList((prev) => ({ ...prev, status: "loading" }));
    const search = new URLSearchParams({ page, limit: pageSize });
    if (active.id !== "all") search.set("status", active.id);

    api(`/api/orders?${search}`, { token, raw: true })
      .then((res) => {
        if (cancelled) return;
        setList({ status: "ready", tab: active.id, rows: res.data, pagination: res.pagination, error: "" });
      })
      .catch((error) => {
        if (cancelled) return;
        setList({ status: "error", tab: active.id, rows: [], pagination: null, error: error.message });
      });
    return () => {
      cancelled = true;
    };
  }, [token, active.id, page, pageSize, reloadKey]);

  // A stale link or a shrinking list can leave us past the last page.
  const lastPage = list.pagination?.totalPages ?? 0;
  useEffect(() => {
    if (list.status === "ready" && lastPage > 0 && page > lastPage) {
      updateParams({ page: lastPage > 1 ? lastPage : null });
    }
  }, [list.status, lastPage, page, updateParams]);

  const goToPage = (next) => {
    updateParams({ page: next > 1 ? next : null });
    const card = directoryRef.current;
    if (card && card.getBoundingClientRect().top < 0) card.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const total = list.pagination?.total ?? 0;
  const startIndex = list.pagination ? (list.pagination.page - 1) * list.pagination.limit : 0;
  const showSkeleton = list.status === "loading" && list.tab !== active.id;
  const refreshing = list.status === "loading" && !showSkeleton;
  const noun = active.id === "all" ? "orders" : `${active.label.toLowerCase()} orders`;

  return (
    <section className="page users">
      <header className="users__head">
        <h1 className="page__title">Orders</h1>
      </header>

      <RoleTabs
        tabs={STATUS_TABS.map((tab) => ({ ...tab, icon: null }))}
        counts={null}
        activeId={active.id}
        onSelect={(id) => updateParams({ status: id === "all" ? null : id, page: null })}
        label="Order status"
      />

      <div
        id={`panel-${active.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${active.id}`}
        className={`directory${refreshing ? " is-refreshing" : ""}`}
        ref={directoryRef}
      >
        <div className="directory__bar">
          <div className="directory__title">
            <span className="directory__icon">
              <ReceiptIcon />
            </span>
            <div>
              <h2>{active.id === "all" ? "All orders" : active.label}</h2>
              <p>
                {list.status === "ready"
                  ? `${numberFmt.format(total)} ${total === 1 ? "order" : "orders"}`
                  : "Loading…"}
              </p>
            </div>
          </div>
          <div className="directory__tools">
            <button type="button" className="btn orders__refresh" onClick={() => setReloadKey((k) => k + 1)}>
              <RefreshIcon /> Refresh
            </button>
          </div>
        </div>

        {list.status === "error" ? (
          <div className="directory__state">
            <span className="directory__state-icon directory__state-icon--danger">
              <AlertIcon />
            </span>
            <p className="directory__state-title">Couldn't load {noun}</p>
            <p className="directory__state-hint">{list.error}</p>
            <button type="button" className="btn" onClick={() => setReloadKey((k) => k + 1)}>
              <RefreshIcon /> Try again
            </button>
          </div>
        ) : showSkeleton ? (
          <OrderTable rows={null} />
        ) : list.rows.length === 0 ? (
          <div className="directory__state">
            <span className="directory__state-icon">
              <ReceiptIcon />
            </span>
            <p className="directory__state-title">No {noun} yet</p>
            <p className="directory__state-hint">Orders placed by customers will appear here.</p>
          </div>
        ) : (
          <OrderTable rows={list.rows} startIndex={startIndex} />
        )}

        {list.pagination && list.pagination.total > 0 && list.status !== "error" && (
          <Pager
            pagination={list.pagination}
            onPage={goToPage}
            onPageSize={(size) => updateParams({ size: size === PAGE_SIZES[0] ? null : size, page: null })}
          />
        )}
      </div>
    </section>
  );
}

function OrderTable({ rows, startIndex = 0 }) {
  const items = rows ?? Array.from({ length: 4 }, (_, index) => ({ id: `skeleton-${index}` }));

  return (
    <table className="utable otable">
      <thead>
        <tr>
          <th scope="col" className="utable__no">No</th>
          <th scope="col">Order</th>
          <th scope="col">Customer</th>
          <th scope="col">Rider</th>
          <th scope="col">Items</th>
          <th scope="col">Total</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        {items.map((order, index) =>
          rows ? (
            <tr key={order.id} style={{ "--i": index }}>
              <td className="utable__no">
                <span className="utable__num">{startIndex + index + 1}</span>
              </td>
              <td className="otable__order" data-label="Order">
                <strong>{order.order_number}</strong>
                <span className="muted" title={dateTimeFmt.format(new Date(order.createdAt))}>
                  {timeAgo(order.createdAt)}
                </span>
              </td>
              <td data-label="Customer">
                {order.customer?.full_name ?? <span className="muted">Unknown</span>}
                {order.customer?.phone && <span className="muted otable__sub">{order.customer.phone}</span>}
              </td>
              <td data-label="Rider">{order.rider?.full_name ?? <span className="muted">Unassigned</span>}</td>
              <td data-label="Items">{numberFmt.format(order.items?.reduce((sum, item) => sum + (item.quantity ?? 1), 0) ?? 0)}</td>
              <td data-label="Total" className="otable__total">
                {moneyFmt.format(Number(order.total) || 0)}
              </td>
              <td data-label="Status">
                <span className={`status order-status order-status--${order.status}`}>
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
              </td>
            </tr>
          ) : (
            <tr key={order.id} className="utable__skeleton" aria-hidden="true">
              <td className="utable__no">
                <span className="skeleton skeleton--num" />
              </td>
              <td>
                <span className="skeleton skeleton--name" />
              </td>
              <td>
                <span className="skeleton skeleton--line" />
              </td>
              <td>
                <span className="skeleton skeleton--line" />
              </td>
              <td>
                <span className="skeleton skeleton--num" />
              </td>
              <td>
                <span className="skeleton skeleton--line" />
              </td>
              <td>
                <span className="skeleton skeleton--pill" />
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}

const svgProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

function ReceiptIcon() {
  return (
    <svg {...svgProps}>
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-3-2-2 2-2-2-2 2-2-2-3 2V4a1 1 0 0 1 1-1Z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5M12 16.5h.01" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg {...svgProps} width={16} height={16}>
      <path d="M20 11a8 8 0 0 0-14.6-4.5M4 4v4h4M4 13a8 8 0 0 0 14.6 4.5M20 20v-4h-4" />
    </svg>
  );
}

import { useEffect, useState } from "react";
import { api, mediaUrl } from "../auth.js";
import Modal from "../components/Modal.jsx";
import { dateTimeFmt, timeAgo } from "../utils/format.js";
import "./OrderDialog.css";

const moneyFmt = new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 });

export const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Accepted",
  preparing: "Preparing",
  ready_for_pickup: "Ready for pickup",
  picked_up: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

// The one next step the shop takes from each status.
const NEXT_STEP = {
  pending: { status: "confirmed", label: "Accept order" },
  confirmed: { status: "preparing", label: "Start preparing" },
  preparing: { status: "ready_for_pickup", label: "Ready for pickup" },
  ready_for_pickup: { status: "picked_up", label: "Mark on the way" },
  picked_up: { status: "delivered", label: "Mark delivered" },
};

const FLOW = ["pending", "confirmed", "preparing", "ready_for_pickup", "picked_up", "delivered"];
const DESK_ROLES = ["shop_owner", "staff"];

export default function OrderDialog({ order: initial, token, me, onClose, onChanged }) {
  const [order, setOrder] = useState(initial);
  const [riders, setRiders] = useState(null);
  const [riderId, setRiderId] = useState(initial.rider_id ?? "");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState("");
  const canAct = DESK_ROLES.includes(me?.role);

  useEffect(() => {
    let cancelled = false;
    api(`/api/orders/${initial.id}`, { token })
      .then((fresh) => !cancelled && setOrder(fresh))
      .catch((err) => !cancelled && setError(err.message));
    if (canAct) {
      api("/api/orders/shop-riders", { token })
        .then((list) => !cancelled && setRiders(list))
        .catch(() => !cancelled && setRiders([]));
    }
    return () => {
      cancelled = true;
    };
  }, [initial.id, token, canAct]);

  const refresh = async (message) => {
    const fresh = await api(`/api/orders/${order.id}`, { token });
    setOrder(fresh);
    setRiderId(fresh.rider_id ?? "");
    onChanged(fresh, message);
  };

  const run = async (key, request, message) => {
    setBusy(key);
    setError("");
    try {
      await request();
      await refresh(message);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setBusy("");
    }
  };

  const setStatus = (status, extra = {}) =>
    run(status, () => api(`/api/orders/${order.id}/status`, { token, method: "PUT", body: { status, ...extra } }), `${order.order_number} · ${STATUS_LABELS[status]}`);

  const assign = () =>
    run(
      "rider",
      () => api(`/api/orders/${order.id}/assign-rider`, { token, method: "PUT", body: { rider_id: riderId } }),
      `${order.order_number} · rider assigned`
    );

  const open = !["delivered", "cancelled"].includes(order.status);
  const next = NEXT_STEP[order.status];
  const step = FLOW.indexOf(order.status);
  const items = order.items ?? [];
  const pin = order.delivery_latitude != null && order.delivery_longitude != null;

  return (
    <Modal labelledBy="order-title" onClose={onClose} busy={Boolean(busy)} size="order">
      <div className="od">
        <header className="od__head">
          <span className={`status order-status order-status--${order.status}`}>{STATUS_LABELS[order.status] ?? order.status}</span>
          <h2 id="order-title" className="modal__title">
            {order.order_number}
          </h2>
          <p className="modal__subtitle" title={dateTimeFmt.format(new Date(order.createdAt))}>
            Placed {timeAgo(order.createdAt)} · {dateTimeFmt.format(new Date(order.createdAt))}
          </p>
        </header>

        {order.status !== "cancelled" && (
          <ol className="od__flow" aria-label="Progress">
            {FLOW.map((status, index) => (
              <li key={status} className={index < step ? "is-done" : index === step ? "is-now" : ""}>
                <span />
                {STATUS_LABELS[status]}
              </li>
            ))}
          </ol>
        )}

        {error && (
          <div className="modal__alert" role="alert">
            <span>{error}</span>
          </div>
        )}

        <div className="od__grid">
          <section className="od__card">
            <h3>Items</h3>
            <ul className="od__items">
              {items.map((item) => (
                <li key={item.id}>
                  <span className="od__thumb">{item.image ? <img src={mediaUrl(item.image)} alt="" /> : item.quantity}</span>
                  <span className="od__item-name">
                    <strong>
                      {item.quantity} × {item.name ?? item.menu_item?.name ?? "Item"}
                    </strong>
                    {item.unit && <small>{item.unit}</small>}
                  </span>
                  <span className="od__money">{moneyFmt.format(Number(item.subtotal) || 0)}</span>
                </li>
              ))}
            </ul>
            <div className="od__total">
              <span>Total</span>
              <strong>{moneyFmt.format(Number(order.total) || 0)}</strong>
            </div>
            <p className="od__hint">Cash on delivery. Payment isn&apos;t taken online yet.</p>
          </section>

          <section className="od__card">
            <h3>Deliver to</h3>
            <p className="od__who">
              <strong>{order.customer?.full_name ?? "Customer"}</strong>
              {order.customer?.phone && <a href={`tel:${order.customer.phone}`}>{order.customer.phone}</a>}
            </p>
            <p>{order.delivery_address}</p>
            {order.delivery_place && order.delivery_place !== order.delivery_address && <p className="od__muted">{order.delivery_place}</p>}
            {pin && (
              <a
                className="od__map"
                href={`https://www.google.com/maps/search/?api=1&query=${Number(order.delivery_latitude)},${Number(order.delivery_longitude)}`}
                target="_blank"
                rel="noreferrer"
              >
                Open the pin in Google Maps
              </a>
            )}
            {order.notes && (
              <div className="od__note">
                <small>Note</small>
                <p>{order.notes}</p>
              </div>
            )}
            {order.cancel_reason && order.status === "cancelled" && (
              <div className="od__note od__note--danger">
                <small>Cancelled</small>
                <p>{order.cancel_reason}</p>
              </div>
            )}
          </section>
        </div>

        <section className="od__card od__rider">
          <h3>Rider</h3>
          {!canAct || !open ? (
            <p>{order.rider?.full_name ?? <span className="od__muted">No rider assigned</span>}</p>
          ) : riders === null ? (
            <p className="od__muted">Loading riders…</p>
          ) : riders.length === 0 ? (
            <p className="od__muted">
              {order.rider?.full_name ? `${order.rider.full_name} · ` : ""}Add shop riders under Users to assign deliveries. You can still mark the order on the way yourself.
            </p>
          ) : (
            <div className="od__assign">
              <select value={riderId} onChange={(event) => setRiderId(event.target.value)} aria-label="Rider">
                <option value="">Pick a rider</option>
                {riders.map((rider) => (
                  <option key={rider.id} value={rider.id}>
                    {rider.full_name}
                    {rider.phone ? ` · ${rider.phone}` : ""}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="modal__btn modal__btn--ghost"
                onClick={assign}
                disabled={!riderId || riderId === order.rider_id || Boolean(busy)}
              >
                {busy === "rider" ? "Assigning…" : order.rider_id ? "Change rider" : "Assign rider"}
              </button>
            </div>
          )}
        </section>

        {canAct && open && (
          <>
            {cancelling ? (
              <div className="od__cancel">
                <label htmlFor="cancel-reason">Why are you cancelling? The customer sees this.</label>
                <textarea
                  id="cancel-reason"
                  rows={2}
                  maxLength={300}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="e.g. Out of 13 kg cylinders today"
                />
                <div className="modal__actions">
                  <button type="button" className="modal__btn modal__btn--ghost" onClick={() => setCancelling(false)} disabled={Boolean(busy)}>
                    Keep order
                  </button>
                  <button
                    type="button"
                    className="modal__btn modal__btn--danger"
                    disabled={Boolean(busy)}
                    onClick={async () => {
                      if (await setStatus("cancelled", { cancel_reason: reason.trim() || "Cancelled by the shop" })) setCancelling(false);
                    }}
                  >
                    {busy === "cancelled" ? "Cancelling…" : "Cancel order"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="modal__actions od__actions">
                <button type="button" className="modal__btn modal__btn--ghost od__decline" onClick={() => setCancelling(true)} disabled={Boolean(busy)}>
                  {order.status === "pending" ? "Decline" : "Cancel order"}
                </button>
                {next && (
                  <button type="button" className="modal__btn modal__btn--primary" onClick={() => setStatus(next.status)} disabled={Boolean(busy)}>
                    {busy === next.status && <span className="modal__spinner" aria-hidden="true" />}
                    {next.label}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}

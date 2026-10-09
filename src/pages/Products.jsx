import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { api } from "../auth.js";
import { BoxIcon, ConfirmDialog, PlusIcon, StoreIcon } from "../components/FormParts.jsx";
import { numberFmt } from "../utils/format.js";
import { CATEGORY_BY_ID } from "../utils/shop.jsx";
import { AlertIcon, CheckCircleIcon, EyeIcon, ProductCard, RefreshIcon, SearchIcon } from "./Shop.jsx";
import { RoleTabs, SearchBox } from "./Users.jsx";
import "./pages.css";
import "./Users.css";
import "./Shop.css";

export default function Products() {
  const { user, token } = useOutletContext();
  const isOwner = user.role === "shop_owner";
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [reloadKey, setReloadKey] = useState(0);
  const [data, setData] = useState({ status: "loading", shop: null, rows: [], error: "" });
  const [dialog, setDialog] = useState(null);
  const [toast, setToast] = useState(null);
  const [query, setQuery] = useState("");
  const [busyIds, setBusyIds] = useState(() => new Set());

  // Editors hand their success message over in navigation state; show it once, then drop it.
  useEffect(() => {
    const message = location.state?.toast;
    if (!message) return;
    setToast({ id: Date.now(), message });
    navigate(`${location.pathname}${location.search}`, { replace: true, state: null });
  }, [location.state, location.pathname, location.search, navigate]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    let cancelled = false;
    setData((prev) => ({ ...prev, status: "loading" }));
    Promise.all([api("/api/shops/mine", { token }), api("/api/shops/mine/products", { token })])
      .then(([shop, rows]) => !cancelled && setData({ status: "ready", shop, rows, error: "" }))
      .catch((error) => !cancelled && setData({ status: "error", shop: null, rows: [], error: error.message }));
    return () => {
      cancelled = true;
    };
  }, [token, reloadKey]);

  const notify = (message) => setToast({ id: Date.now(), message });
  const setRows = (update) => setData((prev) => ({ ...prev, rows: update(prev.rows) }));

  const { shop, rows } = data;
  const categories = shop?.categories ?? [];
  const activeCategory = categories.includes(params.get("category")) ? params.get("category") : "all";
  const selectCategory = useCallback(
    (id) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (id === "all") next.delete("category");
          else next.set("category", id);
          return next;
        },
        { replace: true }
      ),
    [setParams]
  );

  const counts = useMemo(() => {
    const result = { all: rows.length };
    for (const id of categories) result[id] = rows.filter((p) => p.category === id).length;
    return result;
  }, [rows, categories]);

  const visible = useMemo(() => {
    const needle = query.toLowerCase();
    return rows.filter(
      (p) =>
        (activeCategory === "all" || p.category === activeCategory) &&
        (!needle || p.name.toLowerCase().includes(needle) || p.description?.toLowerCase().includes(needle))
    );
  }, [rows, activeCategory, query]);

  const tabs = [
    { id: "all", label: "All products", icon: <BoxIcon /> },
    ...categories.map((id) => ({ id, label: CATEGORY_BY_ID[id]?.label ?? id, icon: CATEGORY_BY_ID[id]?.icon })),
  ];

  const toggleAvailable = async (product) => {
    const next = !product.is_available;
    const flip = (value) => setRows((list) => list.map((r) => (r.id === product.id ? { ...r, is_available: value } : r)));
    setBusyIds((prev) => new Set(prev).add(product.id));
    flip(next);
    const form = new FormData();
    form.append("is_available", String(next));
    try {
      await api(`/api/shops/mine/products/${product.id}`, { token, method: "PUT", body: form });
      notify(`${product.name} is now ${next ? "available" : "unavailable"}.`);
    } catch (error) {
      flip(!next);
      notify(error.message);
    } finally {
      setBusyIds((prev) => {
        const copy = new Set(prev);
        copy.delete(product.id);
        return copy;
      });
    }
  };

  const loading = data.status === "loading" && !shop;

  return (
    <section className="page shop-page">
      <header className="users__head">
        <div>
          <h1 className="page__title">Products</h1>
          <p className="page__subtitle">
            {shop ? `Everything ${shop.name} sells.` : "Everything your shop sells."}
          </p>
        </div>
        {!isOwner && shop && (
          <span className="readonly-badge">
            <EyeIcon /> View only
          </span>
        )}
      </header>

      {data.status === "error" ? (
        <div className="directory">
          <div className="directory__state">
            <span className="directory__state-icon directory__state-icon--danger">
              <AlertIcon />
            </span>
            <p className="directory__state-title">Couldn't load your products</p>
            <p className="directory__state-hint">{data.error}</p>
            <button type="button" className="btn" onClick={() => setReloadKey((k) => k + 1)}>
              <RefreshIcon /> Try again
            </button>
          </div>
        </div>
      ) : !loading && !shop ? (
        <div className="shop-empty">
          <span className="shop-empty__icon">
            <StoreIcon />
          </span>
          <h2>{isOwner ? "Set up your shop first" : "No shop yet"}</h2>
          <p>
            {isOwner
              ? "Products belong to your shop. Create your shop profile and pick what you sell, then add products here."
              : "Your shop owner hasn't set up the shop yet. Its products will appear here once they do."}
          </p>
          {isOwner && (
            <Link to="/shop/new" className="users__create">
              <PlusIcon />
              <span>Create shop profile</span>
            </Link>
          )}
        </div>
      ) : (
        <section className="products" aria-label="Products">
          <div className="products__head">
            <p className="products__meta">
              {data.status === "ready"
                ? `${numberFmt.format(rows.length)} ${rows.length === 1 ? "product" : "products"} · ${numberFmt.format(
                    rows.filter((p) => p.is_available).length
                  )} available`
                : "Loading…"}
            </p>
            <div className="products__tools">
              <SearchBox value={query} onSearch={setQuery} placeholder="Search products…" />
              {isOwner && (
                <Link to="/products/new" className="users__create">
                  <PlusIcon />
                  <span>Add product</span>
                </Link>
              )}
            </div>
          </div>

          {categories.length > 1 && (
            <RoleTabs tabs={tabs} counts={counts} activeId={activeCategory} onSelect={selectCategory} label="Product categories" />
          )}

          {data.status === "loading" ? (
            <div className="pgrid">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="pcard pcard--skeleton" aria-hidden="true">
                  <span className="pcard__media skeleton" />
                  <div className="pcard__body">
                    <span className="skeleton skeleton--name" />
                    <span className="skeleton skeleton--line" />
                  </div>
                </div>
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="products__empty">
              <span className="directory__state-icon">
                {query ? <SearchIcon /> : CATEGORY_BY_ID[activeCategory]?.icon ?? <BoxIcon />}
              </span>
              <p className="directory__state-title">
                {query
                  ? "No matching products"
                  : activeCategory === "all"
                    ? "No products yet"
                    : `No ${CATEGORY_BY_ID[activeCategory]?.label.toLowerCase()} products yet`}
              </p>
              <p className="directory__state-hint">
                {query
                  ? `Nothing matches “${query}”.`
                  : isOwner
                    ? "Add the things you sell so customers can order them."
                    : "Products your shop owner adds will appear here."}
              </p>
              {isOwner && !query && (
                <Link to="/products/new" className="btn">
                  <PlusIcon /> Add product
                </Link>
              )}
            </div>
          ) : (
            <div className="pgrid">
              {visible.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  canEdit={isOwner}
                  busy={busyIds.has(product.id)}
                  onEdit={() => navigate(`/products/${product.id}/edit`)}
                  onDelete={() => setDialog({ product })}
                  onToggle={() => toggleAvailable(product)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {dialog && (
        <ConfirmDialog
          title="Delete product?"
          message={`${dialog.product.name} will be removed from your shop. This can't be undone.`}
          confirmLabel="Delete product"
          onClose={() => setDialog(null)}
          onConfirm={async () => {
            await api(`/api/shops/mine/products/${dialog.product.id}`, { token, method: "DELETE" });
            setRows((list) => list.filter((r) => r.id !== dialog.product.id));
            notify(`${dialog.product.name} was deleted.`);
          }}
        />
      )}

      {toast && (
        <div key={toast.id} className="toast" role="status">
          <CheckCircleIcon />
          <span>{toast.message}</span>
        </div>
      )}
    </section>
  );
}

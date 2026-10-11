import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { api, mediaUrl } from "../auth.js";
import ShopProfile from "../components/ShopProfile.jsx";
import ShopReviews from "../components/ShopReviews.jsx";
import { CameraIcon, ConfirmDialog, PlusIcon, StoreIcon, TrashIcon } from "../components/FormParts.jsx";
import { ChevronIcon, productImages } from "../components/ProductGallery.jsx";
import { numberFmt } from "../utils/format.js";
import { CATEGORY_BY_ID, MARKER_ICONS, moneyFmt } from "../utils/shop.jsx";
import "./pages.css";
import "./Users.css";
import "./Shop.css";

export default function Shop() {
  const { user, token, onShopChange } = useOutletContext();
  const isOwner = user.role === "shop_owner";
  const location = useLocation();
  const navigate = useNavigate();

  const [reloadKey, setReloadKey] = useState(0);
  const [shop, setShop] = useState({ status: "loading", data: null, error: "" });
  const [products, setProducts] = useState({ status: "loading", rows: [], error: "" });
  const [dialog, setDialog] = useState(null);
  const [toast, setToast] = useState(null);

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
    setShop((prev) => ({ ...prev, status: "loading" }));
    setProducts((prev) => ({ ...prev, status: "loading" }));

    Promise.all([api("/api/shops/mine", { token }), api("/api/shops/mine/products", { token })])
      .then(([shopData, productRows]) => {
        if (cancelled) return;
        onShopChange(shopData);
        setShop({ status: "ready", data: shopData, error: "" });
        setProducts({ status: "ready", rows: productRows, error: "" });
      })
      .catch((error) => {
        if (cancelled) return;
        setShop({ status: "error", data: null, error: error.message });
        setProducts({ status: "error", rows: [], error: error.message });
      });
    return () => {
      cancelled = true;
    };
  }, [token, reloadKey, onShopChange]);

  const notify = (message) => setToast({ id: Date.now(), message });

  const shopData = shop.data;
  const available = products.rows.filter((p) => p.is_available).length;

  return (
    <section className="page shop-page">
      <header className="users__head">
        <div>
          <h1 className="page__title">Shop</h1>
          <p className="page__subtitle">{isOwner ? "Your shop's profile, as customers and staff see it." : "The shop you work in."}</p>
        </div>
        {!isOwner && shopData && (
          <span className="readonly-badge">
            <EyeIcon /> View only
          </span>
        )}
      </header>

      {shop.status === "loading" && !shopData ? (
        <ShopSkeleton />
      ) : shop.status === "error" ? (
        <div className="directory">
          <div className="directory__state">
            <span className="directory__state-icon directory__state-icon--danger">
              <AlertIcon />
            </span>
            <p className="directory__state-title">Couldn't load your shop</p>
            <p className="directory__state-hint">{shop.error}</p>
            <button type="button" className="btn" onClick={() => setReloadKey((k) => k + 1)}>
              <RefreshIcon /> Try again
            </button>
          </div>
        </div>
      ) : !shopData ? (
        <div className="shop-empty">
          <span className="shop-empty__icon">
            <StoreIcon />
          </span>
          <h2>{isOwner ? "Set up your shop profile" : "No shop profile yet"}</h2>
          <p>
            {isOwner
              ? "Add your logo, contacts, location and what you sell — water, gas, fast food or all three. Then start listing products."
              : "Your shop owner hasn't set up the shop profile yet. It will appear here once they do."}
          </p>
          {isOwner && (
            <Link to="/shop/new" className="users__create">
              <PlusIcon />
              <span>Create shop profile</span>
            </Link>
          )}
        </div>
      ) : (
        <>
          <ShopProfile
            shop={shopData}
            actions={
              isOwner && (
                <>
                  <Link to="/shop/edit" className="shop-action">
                    <PencilIcon /> Edit profile
                  </Link>
                  <button
                    type="button"
                    className="shop-action shop-action--danger"
                    onClick={() => setDialog({ type: "delete-shop", name: shopData.name, products: products.rows.length })}
                    aria-label="Delete shop"
                    title="Delete shop"
                  >
                    <TrashIcon />
                    <span className="shop-action__label">Delete</span>
                  </button>
                </>
              )
            }
          />

          <Link to="/products" className="shop-products-link">
            <span className="shop-products-link__pins" aria-hidden="true">
              {shopData.categories.map((id) => (
                <img key={id} src={MARKER_ICONS[id]} alt="" />
              ))}
            </span>
            <span className="shop-products-link__text">
              <strong>Products</strong>
              <span>
                {products.status === "ready"
                  ? `${numberFmt.format(products.rows.length)} ${products.rows.length === 1 ? "product" : "products"} · ${numberFmt.format(available)} available`
                  : "Loading…"}
              </span>
            </span>
            <span className="shop-products-link__go">
              {isOwner ? "Manage products" : "View products"} <ArrowRightIcon />
            </span>
          </Link>

          <ShopReviews endpoint="/api/shops/mine/reviews" token={token} shop={shopData} canReply={isOwner} />
        </>
      )}

      {dialog?.type === "delete-shop" && (
        <ConfirmDialog
          title="Delete your shop?"
          message={`${dialog.name} and all ${dialog.products} of its products will be permanently deleted. Staff will no longer see a shop profile.`}
          confirmLabel="Delete shop"
          onClose={() => setDialog(null)}
          onConfirm={async () => {
            await api("/api/shops/mine", { token, method: "DELETE" });
            onShopChange(null);
            setShop({ status: "ready", data: null, error: "" });
            setProducts({ status: "ready", rows: [], error: "" });
            notify("Your shop was deleted.");
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

export function ProductCard({ product, index, canEdit, busy, onEdit, onDelete, onToggle }) {
  const category = CATEGORY_BY_ID[product.category];
  const images = productImages(product);
  const stock = product.stock_quantity;
  const stockLabel =
    stock === null || stock === undefined ? null : stock === 0 ? "Out of stock" : `${numberFmt.format(stock)} in stock`;

  return (
    <article className={`pcard pcard--${product.category}${product.is_available ? "" : " is-off"}`} style={{ "--i": index }}>
      <div className="pcard__media">
        {images.length ? (
          <ProductPhotos images={images} name={product.name} />
        ) : (
          <span className="pcard__placeholder">{category?.icon}</span>
        )}
        <span className={`pcard__chip cat-chip cat-chip--${product.category}`}>
          {category?.icon}
          {category?.label}
        </span>
        {!product.is_available && <span className="pcard__off">Unavailable</span>}
      </div>

      <div className="pcard__body">
        <div className="pcard__title-row">
          <h3 className="pcard__name">{product.name}</h3>
          {product.unit && <span className="pcard__unit">{product.unit}</span>}
        </div>
        {product.description && <p className="pcard__desc">{product.description}</p>}
        <div className="pcard__foot">
          <strong className="pcard__price">{moneyFmt.format(Number(product.price) || 0)}</strong>
          {stockLabel && <span className={`pcard__stock${stock === 0 ? " is-empty" : ""}`}>{stockLabel}</span>}
        </div>
      </div>

      {canEdit && (
        <div className="pcard__actions">
          <label className="pcard__toggle">
            <input
              type="checkbox"
              role="switch"
              className="switch"
              checked={product.is_available}
              disabled={busy}
              onChange={onToggle}
              aria-label={`${product.name} available to order`}
            />
            <span>{product.is_available ? "Available" : "Hidden"}</span>
          </label>
          <div className="row-actions">
            <button type="button" className="row-action row-action--edit" onClick={onEdit} aria-label={`Edit ${product.name}`} title="Edit">
              <PencilIcon />
            </button>
            <button type="button" className="row-action pcard__delete" onClick={onDelete} aria-label={`Delete ${product.name}`} title="Delete">
              <TrashIcon />
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

const SWIPE_PX = 40;

function ProductPhotos({ images, name }) {
  const [current, setCurrent] = useState(0);
  const [touchX, setTouchX] = useState(null);
  const index = Math.min(current, images.length - 1);
  const many = images.length > 1;
  const go = (to) => setCurrent((to + images.length) % images.length);

  return (
    <div
      className="pcard__photos"
      onTouchStart={many ? (event) => setTouchX(event.touches[0].clientX) : undefined}
      onTouchEnd={
        many
          ? (event) => {
              const delta = event.changedTouches[0].clientX - (touchX ?? event.changedTouches[0].clientX);
              if (Math.abs(delta) > SWIPE_PX) go(index + (delta < 0 ? 1 : -1));
              setTouchX(null);
            }
          : undefined
      }
    >
      <div className="pcard__track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {images.map((src, i) => (
          <img
            key={src}
            src={mediaUrl(src)}
            alt={many ? `${name}, photo ${i + 1} of ${images.length}` : name}
            loading="lazy"
            draggable={false}
            aria-hidden={i !== index}
          />
        ))}
      </div>
      {many && (
        <>
          <button type="button" className="pcard__nav pcard__nav--prev" onClick={() => go(index - 1)} aria-label="Previous photo">
            <ChevronIcon dir="left" />
          </button>
          <button type="button" className="pcard__nav pcard__nav--next" onClick={() => go(index + 1)} aria-label="Next photo">
            <ChevronIcon dir="right" />
          </button>
          <span className="pcard__count" aria-hidden="true">
            <CameraIcon /> {index + 1}/{images.length}
          </span>
          <span className="pcard__dots" aria-hidden="true">
            {images.map((src, i) => (
              <span key={src} className={i === index ? "is-on" : ""} />
            ))}
          </span>
        </>
      )}
    </div>
  );
}

function ShopSkeleton() {
  return (
    <div className="shop-skeleton" aria-hidden="true">
      <div className="sp-hero">
        <div className="sp-hero__band" />
        <div className="sp-hero__body">
          <span className="skeleton shop-skeleton__logo" />
          <div className="sp-hero__text">
            <span className="skeleton skeleton--name" />
            <span className="skeleton skeleton--line" />
          </div>
        </div>
      </div>
      <div className="sp-grid">
        <div className="sp-card">
          <span className="skeleton skeleton--line" />
          <span className="skeleton skeleton--line" />
        </div>
        <div className="sp-card">
          <span className="skeleton skeleton--line" />
          <span className="skeleton skeleton--line" />
        </div>
      </div>
    </div>
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

function PencilIcon() {
  return (
    <svg {...svgProps}>
      <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z" />
      <path d="m13.5 6.5 4 4" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg {...svgProps} width={16} height={16}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function EyeIcon() {
  return (
    <svg {...svgProps} width={16} height={16}>
      <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function AlertIcon() {
  return (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5M12 16.5h.01" />
    </svg>
  );
}

export function RefreshIcon() {
  return (
    <svg {...svgProps} width={16} height={16}>
      <path d="M20 11a8 8 0 0 0-14.6-4.5M4 4v4h4M4 13a8 8 0 0 0 14.6 4.5M20 20v-4h-4" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg {...svgProps}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </svg>
  );
}

export function CheckCircleIcon() {
  return (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 2.8 2.8L16.5 9.5" />
    </svg>
  );
}

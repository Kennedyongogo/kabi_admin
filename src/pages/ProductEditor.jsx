import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { api } from "../auth.js";
import { Field } from "../components/Modal.jsx";
import {
  BoxIcon,
  CashIcon,
  CheckIcon,
  ConfirmDialog,
  FormAlert,
  PlusIcon,
  ScaleIcon,
  Section,
  Switch,
  TagIcon,
  UndoIcon,
  focusFirstError,
  useUnsavedWarning,
} from "../components/FormParts.jsx";
import ProductGallery, { imagesToItems, itemSrc, itemsToUpload } from "../components/ProductGallery.jsx";
import { CATEGORY_BY_ID, MARKER_ICONS } from "../utils/shop.jsx";
import { ProductCard } from "./Shop.jsx";
import "./Shop.css";
import { EditorHead, EditorSkeleton, EditorState } from "./ShopEditor.jsx";
import "./pages.css";
import "./Users.css";
import "./Editor.css";

const productToValues = (product, shop) => ({
  name: product?.name ?? "",
  category: product?.category ?? shop.categories[0] ?? "",
  price: product?.price != null ? String(Number(product.price)) : "",
  unit: product?.unit ?? "",
  description: product?.description ?? "",
  is_available: product?.is_available ?? true,
});

function validateProduct(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Enter the product name.";
  if (!values.category) errors.category = "Pick a category.";
  const price = values.price.trim();
  if (!price) errors.price = "Enter a price.";
  else if (!Number.isFinite(Number(price)) || Number(price) < 0) errors.price = "Enter a valid amount.";
  return errors;
}

export default function ProductEditor() {
  const { token } = useOutletContext();
  const { productId } = useParams();
  const navigate = useNavigate();
  const [load, setLoad] = useState({ status: "loading", shop: null, product: null, error: "" });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoad({ status: "loading", shop: null, product: null, error: "" });
    Promise.all([api("/api/shops/mine", { token }), productId ? api(`/api/shops/mine/products/${productId}`, { token }) : null])
      .then(([shop, product]) => !cancelled && setLoad({ status: "ready", shop, product, error: "" }))
      .catch((error) => !cancelled && setLoad({ status: "error", shop: null, product: null, error: error.message }));
    return () => {
      cancelled = true;
    };
  }, [token, productId, reloadKey]);

  const done = (toast) => navigate("/products", { state: toast ? { toast } : null });

  if (load.status === "loading") return <EditorSkeleton />;
  if (load.status === "error" || !load.shop) {
    return (
      <section className="page editor">
        <EditorState
          title={load.status === "error" ? "Couldn't open this product" : "Set up your shop first"}
          hint={load.status === "error" ? load.error : "Products belong to a shop. Create your shop profile, then add what you sell."}
          action={
            load.status === "error" ? (
              <button type="button" className="btn" onClick={() => setReloadKey((k) => k + 1)}>
                Try again
              </button>
            ) : (
              <button type="button" className="btn" onClick={() => navigate("/shop/new")}>
                Create shop profile
              </button>
            )
          }
        />
      </section>
    );
  }
  return <ProductForm key={productId ?? "new"} shop={load.shop} product={load.product} token={token} onDone={done} />;
}

function ProductForm({ shop, product, token, onDone }) {
  const editing = Boolean(product);
  const formRef = useRef(null);
  const [values, setValues] = useState(() => productToValues(product, shop));
  const [photos, setPhotos] = useState(() => imagesToItems(product));
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [dirty, setDirty] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);

  useUnsavedWarning(dirty && !submitting);

  const update = (changes) => {
    const next = { ...values, ...changes };
    setValues(next);
    setDirty(true);
    if (submitted) setErrors(validateProduct(next));
    if (serverError) setServerError("");
  };
  const bind = (name) => ({ value: values[name], onChange: (event) => update({ [name]: event.target.value }) });

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    const found = validateProduct(values);
    setErrors(found);
    if (Object.keys(found).length) return focusFirstError(formRef.current);

    const form = new FormData();
    for (const key of ["name", "category", "price", "unit", "description"]) form.append(key, values[key].trim());
    form.append("is_available", String(values.is_available));
    const { order, files } = itemsToUpload(photos);
    form.append("images", JSON.stringify(order));
    for (const file of files) form.append("product_images", file);

    setSubmitting(true);
    setServerError("");
    try {
      const saved = await api(editing ? `/api/shops/mine/products/${product.id}` : "/api/shops/mine/products", {
        token,
        method: editing ? "PUT" : "POST",
        body: form,
      });
      onDone(editing ? `${saved.name} was updated.` : `${saved.name} was added.`);
    } catch (error) {
      setServerError(error.message);
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const leave = () => (dirty ? setConfirmLeave(true) : onDone());
  const category = CATEGORY_BY_ID[values.category];
  const preview = {
    id: "preview",
    name: values.name.trim() || "Product name",
    category: values.category || shop.categories[0],
    price: Number(values.price) || 0,
    unit: values.unit.trim(),
    description: values.description.trim(),
    is_available: values.is_available,
    images: photos.map(itemSrc),
  };

  const actions = (
    <>
      <button type="button" className="modal__btn modal__btn--ghost" onClick={leave} disabled={submitting}>
        Cancel
      </button>
      <button type="submit" className="modal__btn modal__btn--primary" disabled={submitting}>
        {submitting ? <span className="modal__spinner" aria-hidden="true" /> : editing ? <CheckIcon /> : <PlusIcon />}
        {submitting ? "Saving…" : editing ? "Save changes" : "Add product"}
      </button>
    </>
  );

  return (
    <section className="page editor">
      <EditorHead
        back={{ label: "Products", onClick: leave }}
        crumb={editing ? product.name : "New product"}
        title={editing ? <>Edit <em>product</em></> : <>New <em>product</em></>}
        subtitle={`Something ${shop.name} sells. Customers see the name, price and photos.`}
      />

      <form ref={formRef} className="editor__layout" onSubmit={onSubmit} noValidate>
        <div className="editor__main">
          {serverError && <FormAlert>{serverError}</FormAlert>}

          <Section id="product-basics" icon={category ? <img className="section-pin" src={MARKER_ICONS[category.id]} alt="" /> : <BoxIcon />} title="Photos & category" hint="Clear photos on a plain background work best. Show it from a few angles.">
            <ProductGallery
              items={photos}
              onChange={(next) => {
                setPhotos(next);
                setDirty(true);
              }}
            />
            <div className="field">
              <span className="field__label-row">
                <span className="field__label">Category</span>
              </span>
              <div className="seg" role="radiogroup" aria-label="Category">
                {shop.categories.map((id) => (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={values.category === id}
                    className={`seg__opt seg__opt--${id}${values.category === id ? " is-on" : ""}`}
                    onClick={() => update({ category: id })}
                  >
                    <img src={MARKER_ICONS[id]} alt="" />
                    {CATEGORY_BY_ID[id]?.label ?? id}
                  </button>
                ))}
              </div>
              {errors.category && <span className="field__error">{errors.category}</span>}
            </div>
          </Section>

          <Section id="product-details" icon={<TagIcon />} title="Details" hint="Name, price and how it's sold.">
            <div className="form-grid">
              <Field id="product-name" label="Product name" error={errors.name} icon={<BoxIcon />} className="form-grid__full">
                <input type="text" maxLength={120} placeholder="e.g. 20 L water refill" autoFocus={!editing} {...bind("name")} />
              </Field>
              <Field id="product-price" label="Price (KSh)" error={errors.price} icon={<CashIcon />}>
                <input type="text" inputMode="decimal" placeholder="150" {...bind("price")} />
              </Field>
              <Field id="product-unit" label="Sold per" icon={<ScaleIcon />} hint="Optional">
                <input type="text" maxLength={40} placeholder={category?.unitHint ?? "e.g. 1 piece"} {...bind("unit")} />
              </Field>
              <div className="form-grid__switch form-grid__full">
                <Switch
                  id="product-available"
                  checked={values.is_available}
                  onChange={(is_available) => update({ is_available })}
                  label="Available to order"
                  hint={values.is_available ? "Customers can order this" : "Hidden from customers"}
                />
              </div>
              <Field id="product-description" label="Description" className="field--area form-grid__full" hint="Optional">
                <textarea rows={4} maxLength={1000} placeholder="Size, flavour, brand or anything customers should know" {...bind("description")} />
              </Field>
            </div>
          </Section>
        </div>

        <aside className="editor__aside">
          <div className="editor__panel editor__preview">
            <p className="editor__preview-label">Live preview</p>
            <ProductCard product={preview} index={0} canEdit={false} />
            <div className="editor__panel-actions">{actions}</div>
          </div>
        </aside>

        <div className="editor__bar">{actions}</div>
      </form>

      {confirmLeave && (
        <ConfirmDialog
          title="Discard your changes?"
          message="You have edits that haven't been saved. Leaving now will throw them away."
          confirmLabel="Discard changes"
          icon={<UndoIcon />}
          onClose={() => setConfirmLeave(false)}
          onConfirm={() => onDone()}
        />
      )}
    </section>
  );
}

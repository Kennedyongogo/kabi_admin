import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { api } from "../auth.js";
import { Field } from "../components/Modal.jsx";
import ShopMap from "../components/ShopMap.jsx";
import OpeningHoursInput, { hoursToRows, rowsToHours, validateHours } from "../components/OpeningHoursInput.jsx";
import {
  AlertIcon,
  ArrowLeftIcon,
  ChatIcon,
  CheckIcon,
  ClockIcon,
  CompassIcon,
  ConfirmDialog,
  CrosshairIcon,
  EMAIL_RE,
  FormAlert,
  GlobeIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  Section,
  ServicesInput,
  ShareIcon,
  StoreIcon,
  TagIcon,
  TrashIcon,
  UndoIcon,
  ImagePicker,
  focusFirstError,
  phoneError,
  useUnsavedWarning,
} from "../components/FormParts.jsx";
import { CATEGORY_BY_ID, MARKER_ICONS, SHOP_CATEGORIES, SOCIAL_PLATFORMS, SocialIcon, parseCoords } from "../utils/shop.jsx";
import "./pages.css";
import "./Users.css";
import "./Editor.css";

const shopToValues = (shop) => ({
  name: shop?.name ?? "",
  description: shop?.description ?? "",
  categories: shop?.categories ?? [],
  services: shop?.services ?? [],
  phone: shop?.phone ?? "",
  alt_phone: shop?.alt_phone ?? "",
  email: shop?.email ?? "",
  whatsapp: shop?.whatsapp ?? "",
  website: shop?.website ?? "",
  address: shop?.address ?? "",
  latitude: shop?.latitude != null ? String(Number(shop.latitude)) : "",
  longitude: shop?.longitude != null ? String(Number(shop.longitude)) : "",
  social_links: Object.fromEntries(SOCIAL_PLATFORMS.map((p) => [p.id, shop?.social_links?.[p.id] ?? ""])),
});

function validateShop(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Enter your shop's name.";
  else if (values.name.trim().length > 120) errors.name = "Keep the name under 120 characters.";
  if (!values.categories.length) errors.categories = "Pick at least one thing your shop sells.";
  const phone = phoneError(values.phone, true);
  if (phone) errors.phone = phone;
  const alt = phoneError(values.alt_phone, false);
  if (alt) errors.alt_phone = alt;
  const whatsapp = phoneError(values.whatsapp, false);
  if (whatsapp) errors.whatsapp = whatsapp;
  if (values.email.trim() && !EMAIL_RE.test(values.email.trim())) errors.email = "Enter a valid email address.";
  if (!values.address.trim()) errors.address = "Enter where customers can find you.";

  const lat = values.latitude.trim();
  const lng = values.longitude.trim();
  if (lat || lng) {
    if (!lat) errors.latitude = "Add the latitude too.";
    else if (!Number.isFinite(Number(lat)) || Math.abs(Number(lat)) > 90) errors.latitude = "Between -90 and 90.";
    if (!lng) errors.longitude = "Add the longitude too.";
    else if (!Number.isFinite(Number(lng)) || Math.abs(Number(lng)) > 180) errors.longitude = "Between -180 and 180.";
  }
  return errors;
}

const SECTIONS = [
  { id: "brand", label: "Brand", icon: <StoreIcon /> },
  { id: "sells", label: "What you sell", icon: <TagIcon /> },
  { id: "contact", label: "Contact", icon: <PhoneIcon /> },
  { id: "location", label: "Location", icon: <PinIcon /> },
  { id: "hours", label: "Opening hours", icon: <ClockIcon /> },
  { id: "social", label: "Social media", icon: <ShareIcon /> },
];

export default function ShopEditor() {
  const { token, onShopChange, onBrandPreview } = useOutletContext();
  const navigate = useNavigate();
  const [load, setLoad] = useState({ status: "loading", shop: null, error: "" });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoad({ status: "loading", shop: null, error: "" });
    api("/api/shops/mine", { token })
      .then((shop) => !cancelled && setLoad({ status: "ready", shop, error: "" }))
      .catch((error) => !cancelled && setLoad({ status: "error", shop: null, error: error.message }));
    return () => {
      cancelled = true;
    };
  }, [token, reloadKey]);

  if (load.status === "loading") return <EditorSkeleton />;
  if (load.status === "error") {
    return (
      <section className="page editor">
        <EditorState
          title="Couldn't load your shop"
          hint={load.error}
          action={
            <button type="button" className="btn" onClick={() => setReloadKey((k) => k + 1)}>
              Try again
            </button>
          }
        />
      </section>
    );
  }
  return (
    <ShopForm
      shop={load.shop}
      token={token}
      onSaved={onShopChange}
      onPreview={onBrandPreview}
      onDone={(toast) => navigate("/shop", { state: toast ? { toast } : null })}
    />
  );
}

function ShopForm({ shop, token, onSaved, onPreview, onDone }) {
  const editing = Boolean(shop);
  const formRef = useRef(null);
  const [values, setValues] = useState(() => shopToValues(shop));
  const [hours, setHours] = useState(() => hoursToRows(shop?.opening_hours ?? []));
  const [logo, setLogo] = useState({ file: null, remove: false });
  const [errors, setErrors] = useState({});
  const [hourErrors, setHourErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState("");
  const [focusKey, setFocusKey] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const active = useScrollSpy(SECTIONS.map((s) => s.id));

  useUnsavedWarning(dirty && !submitting);

  // Preview the draft logo and name in the navbar; leaving the editor drops the preview.
  const draftName = values.name.trim() || shop?.name || "";
  useEffect(() => {
    if (!logo.file && !logo.remove && draftName === (shop?.name ?? "")) {
      onPreview(undefined);
      return undefined;
    }
    const url = logo.file ? URL.createObjectURL(logo.file) : null;
    onPreview({ name: draftName, logo_url: url ?? (logo.remove ? null : shop?.logo_url ?? null) });
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [logo, draftName, shop, onPreview]);

  useEffect(() => () => onPreview(undefined), [onPreview]);

  const update = (changes) => {
    const next = { ...values, ...changes };
    setValues(next);
    setDirty(true);
    if (submitted) setErrors(validateShop(next));
    if (serverError) setServerError("");
  };
  const bind = (name) => ({ value: values[name], onChange: (event) => update({ [name]: event.target.value }) });

  const changeHours = (rows) => {
    setHours(rows);
    setDirty(true);
    if (submitted) setHourErrors(validateHours(rows));
    if (serverError) setServerError("");
  };

  const toggleCategory = (id) =>
    update({ categories: values.categories.includes(id) ? values.categories.filter((c) => c !== id) : [...values.categories, id] });

  const position = parseCoords(values.latitude, values.longitude);

  const placePin = ({ lat, lng }) => {
    setLocateError("");
    update({ latitude: lat.toFixed(6), longitude: lng.toFixed(6) });
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return setLocateError("Your browser can't share its location. Click the map instead.");
    setLocating(true);
    setLocateError("");
    navigator.geolocation.getCurrentPosition(
      (result) => {
        setLocating(false);
        placePin({ lat: result.coords.latitude, lng: result.coords.longitude });
        setFocusKey((k) => k + 1);
      },
      (error) => {
        setLocating(false);
        setLocateError(
          error.code === error.PERMISSION_DENIED
            ? "Location access is blocked. Allow it in your browser, or click your shop on the map."
            : "We couldn't find your location. Click your shop on the map instead."
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    const found = validateShop(values);
    const foundHours = validateHours(hours);
    setErrors(found);
    setHourErrors(foundHours);
    if (Object.keys(found).length || Object.keys(foundHours).length) return focusFirstError(formRef.current);

    const form = new FormData();
    for (const key of ["name", "description", "phone", "alt_phone", "email", "whatsapp", "website", "address", "latitude", "longitude"]) {
      form.append(key, values[key].trim());
    }
    form.append("categories", JSON.stringify(values.categories));
    form.append("services", JSON.stringify(values.services));
    form.append("opening_hours", JSON.stringify(rowsToHours(hours)));
    form.append(
      "social_links",
      JSON.stringify(Object.fromEntries(Object.entries(values.social_links).map(([k, v]) => [k, v.trim()]).filter(([, v]) => v)))
    );
    if (logo.file) form.append("shop_logo", logo.file);
    else if (logo.remove) form.append("remove_logo", "true");

    setSubmitting(true);
    setServerError("");
    try {
      const saved = await api("/api/shops/mine", { token, method: "PUT", body: form });
      onSaved(saved);
      onDone(editing ? "Shop profile saved." : `${saved.name} is set up. Add your first products next.`);
    } catch (error) {
      setServerError(error.message);
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const leave = () => (dirty ? setConfirmLeave(true) : onDone());

  const suggestions = [...new Set(values.categories.flatMap((id) => CATEGORY_BY_ID[id]?.services ?? []))];
  const complete = {
    brand: Boolean(values.name.trim()),
    sells: values.categories.length > 0,
    contact: !phoneError(values.phone, true),
    location: Boolean(values.address.trim() && position),
    hours: hours.length > 0 && !Object.keys(validateHours(hours)).length,
    social: Object.values(values.social_links).some((v) => v.trim()),
  };
  const doneCount = Object.values(complete).filter(Boolean).length;
  const errorSections = {
    brand: errors.name,
    sells: errors.categories,
    contact: errors.phone || errors.alt_phone || errors.whatsapp || errors.email,
    location: errors.address || errors.latitude || errors.longitude,
    hours: Object.keys(hourErrors).length > 0,
  };

  const actions = (
    <>
      <button type="button" className="modal__btn modal__btn--ghost" onClick={leave} disabled={submitting}>
        Cancel
      </button>
      <button type="submit" className="modal__btn modal__btn--primary" disabled={submitting}>
        {submitting ? <span className="modal__spinner" aria-hidden="true" /> : <CheckIcon />}
        {submitting ? "Saving…" : editing ? "Save changes" : "Create shop"}
      </button>
    </>
  );

  return (
    <section className="page editor">
      <EditorHead
        back={{ label: "Shop", onClick: leave }}
        crumb={editing ? "Edit profile" : "Set up"}
        title={editing ? <>Edit shop <em>profile</em></> : <>Set up your <em>shop</em></>}
        subtitle="This is what customers, staff and Kabi see about your shop."
      />

      <form ref={formRef} className="editor__layout" onSubmit={onSubmit} noValidate>
        <div className="editor__main">
          {serverError && <FormAlert>{serverError}</FormAlert>}

          <Section id="brand" icon={<StoreIcon />} title="Brand" hint="Your logo, name and a short description.">
            <ImagePicker
              label="Shop logo"
              hint="Square image, at least 256×256. Max 10 MB."
              current={shop?.logo_url}
              value={logo}
              onChange={(next) => {
                setLogo(next);
                setDirty(true);
              }}
              shape="round"
              fallback={<StoreIcon />}
            />
            <div className="form-grid">
              <Field id="shop-name" label="Shop name" error={errors.name} icon={<StoreIcon />} className="form-grid__full">
                <input type="text" maxLength={120} placeholder="e.g. Aqua Springs Refill" autoFocus={!editing} {...bind("name")} />
              </Field>
              <Field id="shop-description" label="About the shop" className="field--area form-grid__full" hint="Optional">
                <textarea rows={3} maxLength={1000} placeholder="What makes your shop special?" {...bind("description")} />
              </Field>
            </div>
          </Section>

          <Section id="sells" icon={<TagIcon />} title="What you sell" hint="Kabi focuses on water, gas and fast food. Pick all that apply — each gets its own pin on the map.">
            <div className={`cat-pick${errors.categories ? " is-invalid" : ""}`} role="group" aria-label="Shop categories" tabIndex={-1}>
              {SHOP_CATEGORIES.map((category) => {
                const on = values.categories.includes(category.id);
                return (
                  <button
                    key={category.id}
                    type="button"
                    className={`cat-pick__opt cat-pick__opt--${category.id}${on ? " is-on" : ""}`}
                    aria-pressed={on}
                    onClick={() => toggleCategory(category.id)}
                  >
                    <span className="cat-pick__icon">
                      <img src={MARKER_ICONS[category.id]} alt="" />
                    </span>
                    <span className="cat-pick__text">
                      <strong>{category.label}</strong>
                      <span>{category.blurb}</span>
                    </span>
                    <span className="cat-pick__check" aria-hidden="true">
                      <CheckIcon />
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.categories && <span className="field__error">{errors.categories}</span>}

            <div className="field">
              <span className="field__label-row">
                <label className="field__label" htmlFor="shop-services">
                  Services you offer
                </label>
              </span>
              <ServicesInput value={values.services} onChange={(services) => update({ services })} suggestions={suggestions} />
            </div>
          </Section>

          <Section id="contact" icon={<PhoneIcon />} title="Contact details" hint="How customers and riders reach you.">
            <div className="form-grid">
              <Field id="shop-phone" label="Phone number" error={errors.phone} icon={<PhoneIcon />}>
                <input type="tel" inputMode="tel" placeholder="0712 345 678" {...bind("phone")} />
              </Field>
              <Field id="shop-alt-phone" label="Alternative phone" error={errors.alt_phone} icon={<PhoneIcon />} hint="Optional">
                <input type="tel" inputMode="tel" placeholder="0733 456 789" {...bind("alt_phone")} />
              </Field>
              <Field id="shop-whatsapp" label="WhatsApp" error={errors.whatsapp} icon={<ChatIcon />} hint="Optional">
                <input type="tel" inputMode="tel" placeholder="0712 345 678" {...bind("whatsapp")} />
              </Field>
              <Field id="shop-email" label="Email" error={errors.email} icon={<MailIcon />} hint="Optional">
                <input type="email" inputMode="email" spellCheck={false} placeholder="hello@yourshop.co.ke" {...bind("email")} />
              </Field>
              <Field id="shop-website" label="Website" icon={<GlobeIcon />} hint="Optional" className="form-grid__full">
                <input type="url" inputMode="url" spellCheck={false} placeholder="www.yourshop.co.ke" {...bind("website")} />
              </Field>
            </div>
          </Section>

          <Section id="location" icon={<PinIcon />} title="Location" hint="Your address plus a map pin so riders can find you.">
            <Field id="shop-address" label="Address" error={errors.address} icon={<PinIcon />}>
              <input type="text" placeholder="e.g. Oginga Odinga St, Kisumu CBD" {...bind("address")} />
            </Field>

            <div className="locate-row">
              <Field id="shop-lat" label="Latitude" error={errors.latitude} icon={<CompassIcon />}>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="-0.091702"
                  {...bind("latitude")}
                  onBlur={() => position && setFocusKey((k) => k + 1)}
                />
              </Field>
              <Field id="shop-lng" label="Longitude" error={errors.longitude} icon={<CompassIcon />}>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="34.767956"
                  {...bind("longitude")}
                  onBlur={() => position && setFocusKey((k) => k + 1)}
                />
              </Field>
              <button type="button" className="locate-btn" onClick={useMyLocation} disabled={locating}>
                {locating ? <span className="modal__spinner modal__spinner--dark" aria-hidden="true" /> : <CrosshairIcon />}
                {locating ? "Finding you…" : "Use my current location"}
              </button>
            </div>
            {locateError && (
              <p className="locate-error" role="alert">
                <AlertIcon /> {locateError}
              </p>
            )}

            <ShopMap
              className="editor__map"
              position={position}
              categories={values.categories}
              onPick={placePin}
              focusKey={focusKey}
              name={values.name.trim()}
            />
            {position && (
              <div className="map-foot">
                <span>
                  Pin at <strong>{position[0].toFixed(5)}, {position[1].toFixed(5)}</strong>
                </span>
                <button type="button" className="chip-btn chip-btn--danger" onClick={() => update({ latitude: "", longitude: "" })}>
                  <TrashIcon /> Remove pin
                </button>
              </div>
            )}
          </Section>

          <Section
            id="hours"
            icon={<ClockIcon />}
            title="Opening hours"
            hint="Group days that share the same hours, e.g. Mon – Fri 9 AM – 9 PM, then Saturday on its own."
          >
            <OpeningHoursInput value={hours} onChange={changeHours} errors={hourErrors} />
          </Section>

          <Section id="social" icon={<ShareIcon />} title="Social media" hint="Handles (@yourshop) or full profile links. All optional.">
            <div className="form-grid">
              {SOCIAL_PLATFORMS.map((platform) => (
                <Field key={platform.id} id={`shop-social-${platform.id}`} label={platform.label} icon={<SocialIcon id={platform.id} />}>
                  <input
                    type="text"
                    spellCheck={false}
                    autoComplete="off"
                    placeholder={platform.placeholder}
                    value={values.social_links[platform.id]}
                    onChange={(event) => update({ social_links: { ...values.social_links, [platform.id]: event.target.value } })}
                  />
                </Field>
              ))}
            </div>
          </Section>
        </div>

        <aside className="editor__aside">
          <div className="editor__panel">
            <div className="editor__progress">
              <div>
                <strong>
                  {doneCount} of {SECTIONS.length}
                </strong>
                <span>sections complete</span>
              </div>
              <span className="editor__meter" style={{ "--p": doneCount / SECTIONS.length }} aria-hidden="true" />
            </div>
            <nav className="editor__nav" aria-label="Form sections">
              {SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`${active === section.id ? "is-active" : ""}${errorSections[section.id] ? " has-error" : ""}`}
                  aria-current={active === section.id ? "location" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  <span className="editor__nav-icon">{section.icon}</span>
                  {section.label}
                  <span className={`editor__tick${complete[section.id] ? " is-done" : ""}`} aria-label={complete[section.id] ? "Complete" : "Incomplete"}>
                    {errorSections[section.id] ? <AlertIcon /> : <CheckIcon />}
                  </span>
                </a>
              ))}
            </nav>
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

/** Highlights the section nearest the top of the viewport. */
export function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join(",");
  useEffect(() => {
    const sections = key.split(",").map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return undefined;
    const onScroll = () => {
      const line = 140;
      let current = sections[0].id;
      for (const section of sections) if (section.getBoundingClientRect().top - line <= 0) current = section.id;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = sections.at(-1).id;
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [key]);
  return active;
}

export function EditorHead({ back, crumb, title, subtitle }) {
  return (
    <header className="editor__head">
      <nav className="editor__crumbs" aria-label="Breadcrumb">
        {back.onClick ? (
          <button type="button" onClick={back.onClick}>
            <ArrowLeftIcon /> {back.label}
          </button>
        ) : (
          <Link to={back.to}>
            <ArrowLeftIcon /> {back.label}
          </Link>
        )}
        <span aria-hidden="true">/</span>
        <span aria-current="page">{crumb}</span>
      </nav>
      <h1 className="page__title editor__title">{title}</h1>
      {subtitle && <p className="page__subtitle">{subtitle}</p>}
    </header>
  );
}

export function EditorState({ title, hint, action }) {
  return (
    <div className="directory">
      <div className="directory__state">
        <span className="directory__state-icon directory__state-icon--danger">
          <AlertIcon />
        </span>
        <p className="directory__state-title">{title}</p>
        <p className="directory__state-hint">{hint}</p>
        {action}
      </div>
    </div>
  );
}

export function EditorSkeleton() {
  return (
    <section className="page editor" aria-busy="true">
      <header className="editor__head">
        <span className="skeleton skeleton--line" style={{ width: 120 }} />
        <span className="skeleton skeleton--name" style={{ width: 260, height: 34 }} />
      </header>
      <div className="editor__layout">
        <div className="editor__main">
          {[0, 1, 2].map((i) => (
            <div key={i} className="form-section">
              <span className="skeleton skeleton--name" />
              <span className="skeleton skeleton--line" />
              <span className="skeleton skeleton--line" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

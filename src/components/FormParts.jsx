import { useEffect, useRef, useState } from "react";
import { mediaUrl } from "../auth.js";
import Modal from "./Modal.jsx";
import "./FormParts.css";

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const phoneError = (value, required) => {
  if (!value.trim()) return required ? "Enter a phone number." : "";
  const digits = value.replace(/\D/g, "");
  return digits.length < 9 || digits.length > 15 ? "Enter a valid phone number." : "";
};

export const focusFirstError = (form) =>
  setTimeout(() => {
    const target = form?.querySelector('[aria-invalid="true"], .is-invalid');
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    target?.focus?.({ preventScroll: true });
  }, 0);

/** Warns before a tab close or reload while a form has unsaved edits. */
export function useUnsavedWarning(dirty) {
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
}

export function ImagePicker({ label, hint, current, value, onChange, shape = "square", fallback }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!value.file) {
      setPreview("");
      return undefined;
    }
    const url = URL.createObjectURL(value.file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value.file]);

  const shown = preview || (!value.remove && current ? mediaUrl(current) : "");

  const pick = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Choose an image file (JPG, PNG or WEBP).");
    if (file.size > MAX_IMAGE_BYTES) return setError("That image is over 10 MB, choose a smaller one.");
    setError("");
    onChange({ file, remove: false });
  };

  return (
    <div className="picker">
      <button
        type="button"
        className={`picker__preview picker__preview--${shape}${shown ? " has-image" : ""}`}
        onClick={() => inputRef.current?.click()}
        aria-label={shown ? `Change ${label.toLowerCase()}` : `Upload ${label.toLowerCase()}`}
      >
        {shown ? <img src={shown} alt="" /> : fallback ?? <ImageIcon />}
        <span className="picker__overlay" aria-hidden="true">
          <CameraIcon />
        </span>
      </button>
      <div className="picker__body">
        <strong>{label}</strong>
        <span className={error ? "picker__error" : "picker__hint"}>{error || hint}</span>
        <div className="picker__actions">
          <button type="button" className="chip-btn" onClick={() => inputRef.current?.click()}>
            <UploadIcon /> {shown ? "Change" : "Upload"}
          </button>
          {shown && (
            <button
              type="button"
              className="chip-btn chip-btn--danger"
              onClick={() => {
                setError("");
                onChange({ file: null, remove: true });
              }}
            >
              <TrashIcon /> Remove
            </button>
          )}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={pick} />
    </div>
  );
}

export function Section({ id, title, hint, icon, children }) {
  return (
    <section className="form-section" id={id} aria-labelledby={id ? `${id}-title` : undefined}>
      <header className="form-section__head">
        {icon && <span className="form-section__icon">{icon}</span>}
        <div>
          <h2 id={id ? `${id}-title` : undefined}>{title}</h2>
          {hint && <p>{hint}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}

export function Switch({ id, checked, onChange, label, hint }) {
  return (
    <label className="switch-row" htmlFor={id}>
      <span className="switch-row__text">
        <strong>{label}</strong>
        {hint && <span>{hint}</span>}
      </span>
      <input id={id} type="checkbox" role="switch" className="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

export function ServicesInput({ value, onChange, suggestions }) {
  const [draft, setDraft] = useState("");
  const add = (raw) => {
    const service = raw.trim().replace(/,$/, "").trim();
    if (!service || value.some((s) => s.toLowerCase() === service.toLowerCase())) return setDraft("");
    onChange([...value, service]);
    setDraft("");
  };
  const remaining = suggestions.filter((s) => !value.some((v) => v.toLowerCase() === s.toLowerCase()));

  return (
    <div className="tags">
      <div className="tags__box">
        {value.map((service) => (
          <span key={service} className="tags__tag">
            {service}
            <button type="button" onClick={() => onChange(value.filter((s) => s !== service))} aria-label={`Remove ${service}`}>
              <CloseIcon />
            </button>
          </span>
        ))}
        <input
          id="shop-services"
          value={draft}
          placeholder={value.length ? "Add another…" : "Type a service and press Enter"}
          onChange={(event) => (event.target.value.endsWith(",") ? add(event.target.value) : setDraft(event.target.value))}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add(draft);
            } else if (event.key === "Backspace" && !draft && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={() => draft && add(draft)}
        />
      </div>
      {remaining.length > 0 && (
        <div className="tags__suggest">
          <span>Suggestions</span>
          {remaining.map((service) => (
            <button key={service} type="button" className="chip-btn" onClick={() => add(service)}>
              <PlusIcon /> {service}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function FormAlert({ children }) {
  return (
    <div className="modal__alert" role="alert">
      <AlertIcon />
      <span>{children}</span>
    </div>
  );
}

export function ConfirmDialog({ title, message, confirmLabel, busyLabel = "Deleting…", icon = <TrashIcon />, onConfirm, onClose }) {
  const cancelRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const confirm = async (requestClose) => {
    setBusy(true);
    setError("");
    try {
      await onConfirm();
      setBusy(false);
      requestClose();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <Modal labelledBy="confirm-title" onClose={onClose} busy={busy} initialFocusRef={cancelRef}>
      {(requestClose) => (
        <div className="confirm">
          <span className="confirm__icon">{icon}</span>
          <h2 id="confirm-title" className="modal__title">
            {title}
          </h2>
          <p className="modal__subtitle">{message}</p>
          {error && <FormAlert>{error}</FormAlert>}
          <div className="modal__actions">
            <button ref={cancelRef} type="button" className="modal__btn modal__btn--ghost" onClick={requestClose} disabled={busy}>
              Cancel
            </button>
            <button type="button" className="modal__btn modal__btn--danger" onClick={() => confirm(requestClose)} disabled={busy}>
              {busy ? <span className="modal__spinner" aria-hidden="true" /> : icon}
              {busy ? busyLabel : confirmLabel}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ---------- Icons ---------- */

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

export function StoreIcon() {
  return (
    <svg {...svgProps}>
      <path d="M4 9.5 5.5 4h13L20 9.5a2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-5 0Z" />
      <path d="M5 12v8h14v-8M10 20v-5h4v5" />
    </svg>
  );
}

export function BoxIcon() {
  return (
    <svg {...svgProps}>
      <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Z" />
      <path d="m3.5 7.5 8.5 4.5 8.5-4.5M12 12v9" />
    </svg>
  );
}

export function PlusIcon() {
  return (
    <svg {...svgProps} strokeWidth={2.2}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg {...svgProps}>
      <path d="M4 7h16M10 11v6M14 11v6M5.5 7l1 12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg {...svgProps} strokeWidth={2.2}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg {...svgProps} width={12} height={12} strokeWidth={2.4}>
      <path d="M6 6l12 12M18 6 6 18" />
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

export function ArrowLeftIcon() {
  return (
    <svg {...svgProps} width={16} height={16}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function UndoIcon() {
  return (
    <svg {...svgProps}>
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
    </svg>
  );
}

export function ClockIcon() {
  return (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function PhoneIcon() {
  return (
    <svg {...svgProps}>
      <path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5V19a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z" />
    </svg>
  );
}

export function ChatIcon() {
  return (
    <svg {...svgProps}>
      <path d="M4.5 19.5 5.6 16A8 8 0 1 1 8 18.4l-3.5 1.1Z" />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg {...svgProps}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function GlobeIcon() {
  return (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

export function PinIcon() {
  return (
    <svg {...svgProps}>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function CompassIcon() {
  return (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </svg>
  );
}

export function CrosshairIcon() {
  return (
    <svg {...svgProps} width={17} height={17}>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function ShareIcon() {
  return (
    <svg {...svgProps}>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="17.5" cy="6" r="2.5" />
      <circle cx="17.5" cy="18" r="2.5" />
      <path d="m8.3 10.8 7-3.6M8.3 13.2l7 3.6" />
    </svg>
  );
}

export function TagIcon() {
  return (
    <svg {...svgProps}>
      <path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1.5 1.5 0 0 1 0 2.1l-6.6 6.6a1.5 1.5 0 0 1-2.1 0l-8.3-8.3Z" />
      <circle cx="8" cy="8" r="1.5" />
    </svg>
  );
}

export function CashIcon() {
  return (
    <svg {...svgProps}>
      <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 9.5v5M18 9.5v5" />
    </svg>
  );
}

export function ScaleIcon() {
  return (
    <svg {...svgProps}>
      <path d="M5 20h14l-1.5-11h-11L5 20Z" />
      <circle cx="12" cy="6" r="2.5" />
    </svg>
  );
}

export function StackIcon() {
  return (
    <svg {...svgProps}>
      <path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Z" />
      <path d="m3 12 9 4.5 9-4.5M3 16.5 12 21l9-4.5" />
    </svg>
  );
}

export function ImageIcon() {
  return (
    <svg {...svgProps} width={26} height={26}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
      <circle cx="9" cy="10" r="1.8" />
      <path d="m4.5 17.5 5-5 4 4 2.5-2.5 3.5 3.5" />
    </svg>
  );
}

export function CameraIcon() {
  return (
    <svg {...svgProps} width={20} height={20}>
      <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.5-2h6l1.5 2h2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-9Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

export function UploadIcon() {
  return (
    <svg {...svgProps} width={15} height={15}>
      <path d="M12 16V4M7 9l5-5 5 5M5 20h14" />
    </svg>
  );
}

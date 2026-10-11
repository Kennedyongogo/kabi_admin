import { useRef, useState } from "react";
import "./DeliveryConditionsInput.css";

export const MAX_DELIVERY_CONDITIONS = 15;
export const MAX_DELIVERY_CONDITION_LENGTH = 200;

const SUGGESTIONS = [
  "Free delivery within 3 km",
  "Delivery fee from KES 100, depending on distance",
  "Minimum order of KES 500 for delivery",
  "Deliveries daily from 8 AM to 8 PM",
  "Orders before 4 PM are delivered the same day",
  "Pay on delivery with cash or M-Pesa",
  "Gas refills need an empty cylinder of the same brand",
  "Return empty water bottles for refills",
];

/** Ordered list of short delivery rules: add, edit inline, reorder and remove. */
export default function DeliveryConditionsInput({ value, onChange }) {
  const [draft, setDraft] = useState("");
  const listRef = useRef(null);
  const full = value.length >= MAX_DELIVERY_CONDITIONS;
  const has = (text) => value.some((item) => item.trim().toLowerCase() === text.trim().toLowerCase());

  const add = (text) => {
    const clean = text.trim().slice(0, MAX_DELIVERY_CONDITION_LENGTH);
    if (!clean || full || has(clean)) return false;
    onChange([...value, clean]);
    return true;
  };

  const edit = (index, text) => onChange(value.map((item, i) => (i === index ? text : item)));
  const remove = (index) => onChange(value.filter((_, i) => i !== index));
  const move = (index, step) => {
    const target = index + step;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
    requestAnimationFrame(() => listRef.current?.querySelectorAll(".dc-row__move")[target * 2 + (step < 0 ? 0 : 1)]?.focus());
  };

  const submitDraft = () => {
    if (add(draft)) setDraft("");
  };

  const unused = SUGGESTIONS.filter((text) => !has(text));

  return (
    <div className="dc">
      {value.length > 0 ? (
        <ol className="dc-list" ref={listRef}>
          {value.map((item, index) => (
            <li key={index} className="dc-row">
              <span className="dc-row__num" aria-hidden="true">
                {index + 1}
              </span>
              <input
                type="text"
                className="dc-row__input"
                value={item}
                maxLength={MAX_DELIVERY_CONDITION_LENGTH}
                aria-label={`Delivery condition ${index + 1}`}
                onChange={(event) => edit(index, event.target.value)}
                onBlur={() => !item.trim() && remove(index)}
              />
              <span className="dc-row__tools">
                <button
                  type="button"
                  className="dc-row__move"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label={`Move condition ${index + 1} up`}
                >
                  <ArrowIcon up />
                </button>
                <button
                  type="button"
                  className="dc-row__move"
                  onClick={() => move(index, 1)}
                  disabled={index === value.length - 1}
                  aria-label={`Move condition ${index + 1} down`}
                >
                  <ArrowIcon />
                </button>
                <button type="button" className="dc-row__remove" onClick={() => remove(index)} aria-label={`Remove condition ${index + 1}`}>
                  <XIcon />
                </button>
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <div className="dc-empty">
          <TruckIcon />
          <p>
            <strong>No delivery conditions yet.</strong> Tell customers your delivery fees, areas, times and anything they need to
            have ready.
          </p>
        </div>
      )}

      <div className={`dc-add${full ? " is-full" : ""}`}>
        <input
          type="text"
          id="shop-delivery-new"
          value={draft}
          maxLength={MAX_DELIVERY_CONDITION_LENGTH}
          disabled={full}
          placeholder={full ? `You've added the maximum of ${MAX_DELIVERY_CONDITIONS}` : "e.g. Free delivery within 3 km"}
          aria-label="New delivery condition"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              submitDraft();
            }
          }}
        />
        <button type="button" className="dc-add__btn" onClick={submitDraft} disabled={full || !draft.trim() || has(draft)}>
          <PlusIcon /> Add
        </button>
      </div>
      <div className="dc-meta">
        <span>Press Enter to add. Use the arrows to set the order customers see.</span>
        <span>
          {value.length}/{MAX_DELIVERY_CONDITIONS}
        </span>
      </div>

      {unused.length > 0 && !full && (
        <div className="dc-suggest">
          <span className="dc-suggest__label">Quick add</span>
          <div className="dc-suggest__chips">
            {unused.map((text) => (
              <button key={text} type="button" className="dc-chip" onClick={() => add(text)}>
                <PlusIcon /> {text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const svgProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

function ArrowIcon({ up = false }) {
  return (
    <svg {...svgProps}>
      <path d={up ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"} />
    </svg>
  );
}

function XIcon() {
  return (
    <svg {...svgProps}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg {...svgProps} width={14} height={14} strokeWidth={2.4}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function TruckIcon() {
  return (
    <svg {...svgProps} width={18} height={18} strokeWidth={1.8}>
      <path d="M3 6.5h11v9H3zM14 9.5h3.5L21 13v2.5h-7" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </svg>
  );
}

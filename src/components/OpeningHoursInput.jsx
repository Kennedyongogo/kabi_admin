import { WEEK_DAYS, formatDays, formatHours, formatTime, weekSchedule } from "../utils/shop.jsx";
import { CheckIcon, ClockIcon, PlusIcon, TrashIcon } from "./FormParts.jsx";
import "./OpeningHoursInput.css";

const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri"];
const ALL_DAYS = WEEK_DAYS.map((day) => day.id);

let nextKey = 0;
const row = (days, open = "09:00", close = "21:00", allDay = false) => ({ key: `h${(nextKey += 1)}`, days, open, close, all_day: allDay });

const TEMPLATES = [
  {
    id: "week-sat",
    label: "Weekdays + Saturday",
    detail: "Mon – Fri 9 AM – 9 PM · Sat 10 AM – 6 PM",
    build: () => [row(WEEKDAYS), row(["sat"], "10:00", "18:00")],
  },
  { id: "daily", label: "Every day", detail: "7 AM – 9 PM, all week", build: () => [row(ALL_DAYS, "07:00", "21:00")] },
  { id: "always", label: "Open 24/7", detail: "Never closes", build: () => [row(ALL_DAYS, "00:00", "00:00", true)] },
];

/** API entries → editable rows (with stable keys and both times filled). */
export const hoursToRows = (hours = []) =>
  hours.map((entry) => row(entry.days, entry.open ?? "09:00", entry.close ?? "21:00", Boolean(entry.all_day)));

/** Editable rows → the list the API stores. */
export const rowsToHours = (rows) =>
  rows.map(({ days, open, close, all_day: allDay }) => {
    const sorted = ALL_DAYS.filter((id) => days.includes(id));
    return allDay ? { days: sorted, all_day: true } : { days: sorted, open, close };
  });

/** Mirrors normalizeOpeningHours on the API; returns { [rowKey]: message }. */
export function validateHours(rows) {
  const errors = {};
  for (const item of rows) {
    if (!item.days.length) errors[item.key] = "Pick at least one day, or remove this row.";
    else if (!item.all_day && (!item.open || !item.close)) errors[item.key] = "Set both an opening and a closing time.";
    else if (!item.all_day && item.open === item.close) errors[item.key] = "Opening and closing times can't match. Turn on “24 hours” instead.";
  }
  return errors;
}

export default function OpeningHoursInput({ value, onChange, errors = {} }) {
  const used = new Map(value.flatMap((item) => item.days.map((day) => [day, item.key])));
  const free = ALL_DAYS.filter((day) => !used.has(day));
  const update = (key, changes) => onChange(value.map((item) => (item.key === key ? { ...item, ...changes } : item)));
  const toggleDay = (item, day) =>
    update(item.key, { days: item.days.includes(day) ? item.days.filter((d) => d !== day) : [...item.days, day] });

  const addRow = () => {
    if (!value.length) return onChange([row(WEEKDAYS)]);
    const last = value.at(-1);
    onChange([...value, row(free.slice(0, 1), last.open, last.close)]);
  };

  const today = WEEK_DAYS[(new Date().getDay() + 6) % 7].id;
  const schedule = weekSchedule(rowsToHours(value.filter((item) => item.days.length)));

  return (
    <div className="hours">
      {value.length === 0 ? (
        <div className="hours__empty">
          <p>
            <ClockIcon /> No opening hours yet. Start from a template, then adjust it.
          </p>
          <div className="hours__templates">
            {TEMPLATES.map((template) => (
              <button key={template.id} type="button" className="hours__template" onClick={() => onChange(template.build())}>
                <strong>{template.label}</strong>
                <span>{template.detail}</span>
              </button>
            ))}
            <button type="button" className="hours__template hours__template--custom" onClick={addRow}>
              <strong>
                <PlusIcon /> Custom
              </strong>
              <span>Build it day by day</span>
            </button>
          </div>
        </div>
      ) : (
        <ol className="hours__rows">
          {value.map((item, index) => {
            const overnight = !item.all_day && item.open && item.close && item.close < item.open;
            const error = errors[item.key];
            return (
              <li key={item.key} className={`hours-row${error ? " is-invalid" : ""}`} style={{ "--i": index }}>
                <div className="hours-row__top">
                  <div className="hours-row__days" role="group" aria-label={`Days for opening hours row ${index + 1}`}>
                    {WEEK_DAYS.map((day) => {
                      const on = item.days.includes(day.id);
                      const taken = !on && used.has(day.id);
                      return (
                        <button
                          key={day.id}
                          type="button"
                          className={`day-chip${on ? " is-on" : ""}${taken ? " is-taken" : ""}`}
                          aria-pressed={on}
                          aria-label={day.label}
                          title={taken ? `${day.label} is already set in another row` : day.label}
                          disabled={taken}
                          onClick={() => toggleDay(item, day.id)}
                        >
                          <span className="day-chip__long">{day.short}</span>
                          <span className="day-chip__short" aria-hidden="true">
                            {day.letter}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    className="hours-row__remove"
                    onClick={() => onChange(value.filter((other) => other.key !== item.key))}
                    aria-label={`Remove ${item.days.length ? formatDays(item.days) : "this"} hours`}
                    title="Remove"
                  >
                    <TrashIcon />
                  </button>
                </div>

                <div className="hours-row__times">
                  <label className={`time-box${item.all_day ? " is-disabled" : ""}`}>
                    <span>Opens</span>
                    <input
                      type="time"
                      value={item.open}
                      disabled={item.all_day}
                      onChange={(event) => update(item.key, { open: event.target.value })}
                    />
                  </label>
                  <span className="hours-row__dash" aria-hidden="true">
                    –
                  </span>
                  <label className={`time-box${item.all_day ? " is-disabled" : ""}`}>
                    <span>Closes</span>
                    <input
                      type="time"
                      value={item.close}
                      disabled={item.all_day}
                      onChange={(event) => update(item.key, { close: event.target.value })}
                    />
                  </label>
                  <label className="hours-row__allday">
                    <input
                      type="checkbox"
                      role="switch"
                      className="switch"
                      checked={item.all_day}
                      onChange={(event) => update(item.key, { all_day: event.target.checked })}
                    />
                    <span>24 hours</span>
                  </label>
                </div>

                <p className={`hours-row__summary${error ? " is-error" : ""}`}>
                  {error ||
                    (item.days.length ? (
                      <>
                        <CheckIcon />
                        <strong>{formatDays(item.days)}</strong>
                        <span>· {item.all_day ? "Open 24 hours" : `${formatTime(item.open)} – ${formatTime(item.close)}`}</span>
                        {overnight && <em>closes the next day</em>}
                      </>
                    ) : (
                      "Pick the days these hours apply to."
                    ))}
                </p>
              </li>
            );
          })}
        </ol>
      )}

      {value.length > 0 && (
        <div className="hours__foot">
          <button type="button" className="chip-btn chip-btn--accent" onClick={addRow} disabled={!free.length}>
            <PlusIcon />
            {free.length ? `Add hours for ${formatDays(free)}` : "Every day has hours"}
          </button>
          {free.length > 0 && <span className="hours__closed">Days without hours show as closed.</span>}
        </div>
      )}

      {value.length > 0 && (
        <div className="hours-week" aria-label="Weekly preview">
          {schedule.map(({ day, entry }) => (
            <div key={day.id} className={`hours-week__day${entry ? "" : " is-closed"}${day.id === today ? " is-today" : ""}`}>
              <strong>{day.short}</strong>
              <span>{entry ? (entry.all_day ? "24 hours" : formatHours(entry).replace(" – ", "–")) : "Closed"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

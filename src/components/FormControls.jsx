import React from "react";
import { Box } from "@mui/material";
import { CheckRounded } from "@mui/icons-material";
import { GREEN } from "./PageSections";

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Accept local Kenyan formats (07xx / 01xx) and convert them to +254.
export const normalizePhone = (value) => {
  const stripped = String(value || "").replace(/[\s-]+/g, "");
  if (/^0[17]\d{8}$/.test(stripped)) return `+254${stripped.slice(1)}`;
  if (/^254\d{9}$/.test(stripped)) return `+${stripped}`;
  return stripped;
};

/** Simulates a network round trip for prototype-only forms. */
export const fakeSubmit = (ms = 1100) => new Promise((resolve) => setTimeout(resolve, ms));

export const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    backgroundColor: "#FBFAF6",
    transition: "background-color 0.2s ease, box-shadow 0.2s ease",
    "& fieldset": { borderColor: "rgba(27, 67, 50, 0.14)" },
    "&:hover fieldset": { borderColor: GREEN.light },
    "&.Mui-focused": {
      backgroundColor: "#FFFFFF",
      boxShadow: `0 0 0 4px ${GREEN.mist}`,
    },
    "&.Mui-focused fieldset": { borderColor: GREEN.mid, borderWidth: 1.5 },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: GREEN.main },
};

export const primaryButtonSx = {
  minHeight: 52,
  px: 4,
  borderRadius: 999,
  fontWeight: 700,
  fontSize: "1rem",
  color: "#FFFFFF",
  background: `linear-gradient(135deg, ${GREEN.mid}, ${GREEN.deep})`,
  boxShadow: "0 14px 30px rgba(45, 106, 79, 0.35)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "& .MuiButton-endIcon": { transition: "transform 0.2s ease" },
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 18px 36px rgba(45, 106, 79, 0.45)",
    "& .MuiButton-endIcon": { transform: "translateX(3px)" },
  },
  "&.Mui-disabled": { color: "#FFFFFF", opacity: 0.75 },
};

export function ChoicePill({ selected, onClick, icon: Icon, count, children, role = "radio", dark = false }) {
  const darkSx = dark && {
    border: `1px solid ${selected ? GREEN.light : "rgba(216, 243, 220, 0.3)"}`,
    color: selected ? GREEN.deep : "#FFFFFF",
    backgroundColor: selected ? GREEN.light : "rgba(216, 243, 220, 0.08)",
    boxShadow: selected ? "0 8px 22px rgba(82, 183, 136, 0.35)" : "none",
    "&:hover": { borderColor: GREEN.light, backgroundColor: selected ? GREEN.light : "rgba(216, 243, 220, 0.18)" },
  };
  return (
    <Box
      component="button"
      type="button"
      role={role}
      aria-checked={role === "radio" ? selected : undefined}
      aria-pressed={role === "radio" ? undefined : selected}
      onClick={onClick}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.75,
        py: 0.9,
        borderRadius: 999,
        cursor: "pointer",
        whiteSpace: "nowrap",
        fontFamily: "inherit",
        fontSize: "0.85rem",
        fontWeight: 600,
        border: `1px solid ${selected ? GREEN.main : "rgba(27, 67, 50, 0.16)"}`,
        color: selected ? "#FFFFFF" : GREEN.ink,
        backgroundColor: selected ? GREEN.main : "#FFFFFF",
        boxShadow: selected ? "0 8px 18px rgba(45, 106, 79, 0.25)" : "none",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: GREEN.mid,
          backgroundColor: selected ? GREEN.main : GREEN.mist,
        },
        "&:focus-visible": { outline: `3px solid ${GREEN.light}`, outlineOffset: 2 },
        ...darkSx,
      }}
    >
      {selected && role === "radio" ? (
        <CheckRounded sx={{ fontSize: 16 }} />
      ) : (
        Icon && <Icon sx={{ fontSize: 16, color: selected ? "#FFFFFF" : GREEN.mid }} />
      )}
      {children}
      {count !== undefined && (
        <Box
          component="span"
          sx={{
            minWidth: 22,
            px: 0.75,
            py: 0.1,
            borderRadius: 999,
            fontSize: "0.72rem",
            fontWeight: 800,
            textAlign: "center",
            color: selected ? GREEN.deep : GREEN.main,
            backgroundColor: selected ? GREEN.mist : "rgba(216, 243, 220, 0.7)",
          }}
        >
          {count}
        </Box>
      )}
    </Box>
  );
}

/** Horizontally scrollable pill row on phones, wrapping on larger screens. */
export function PillRow({ label, children, sx }) {
  return (
    <Box
      role="radiogroup"
      aria-label={label}
      sx={{
        display: "flex",
        gap: 1,
        flexWrap: { xs: "nowrap", md: "wrap" },
        overflowX: { xs: "auto", md: "visible" },
        mx: { xs: -0.5, md: 0 },
        px: { xs: 0.5, md: 0 },
        py: 0.5,
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: { xs: 6, md: 8 },
        px: 3,
        borderRadius: "30px 30px 30px 8px",
        border: "1px dashed rgba(27, 67, 50, 0.2)",
        backgroundColor: "rgba(255, 255, 255, 0.6)",
      }}
    >
      {Icon && (
        <Box
          sx={{
            width: 64,
            height: 64,
            mx: "auto",
            mb: 2,
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: GREEN.main,
            backgroundColor: GREEN.mist,
          }}
        >
          <Icon sx={{ fontSize: 30 }} />
        </Box>
      )}
      <Box component="p" sx={{ m: 0, fontWeight: 800, fontSize: "1.15rem", color: GREEN.ink }}>
        {title}
      </Box>
      {text && (
        <Box component="p" sx={{ mt: 0.75, mb: 0, color: "text.secondary" }}>
          {text}
        </Box>
      )}
      {action && <Box sx={{ mt: 2.5 }}>{action}</Box>}
    </Box>
  );
}

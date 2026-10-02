import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { FormatQuoteRounded, StarRounded } from "@mui/icons-material";
import { mediaUrl } from "../utils/api";
import { GREEN } from "./PageSections";

const AVATAR_TONES = [
  [GREEN.mid, GREEN.deep],
  ["#52B788", "#2D6A4F"],
  ["#B08D57", "#7A5C2E"],
  ["#3E8E7E", "#1F4E45"],
  ["#74A857", "#3F6B2A"],
];

const initials = (name = "") =>
  name
    .replace(/^(Sr|Mr|Mrs|Ms|Dr|Prof)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

const toneFor = (name = "") => {
  const sum = [...name].reduce((total, char) => total + char.charCodeAt(0), 0);
  return AVATAR_TONES[sum % AVATAR_TONES.length];
};

export function StarRow({ value = 5, size = 18 }) {
  return (
    <Box
      role="img"
      aria-label={`Rated ${value} out of 5`}
      sx={{ display: "inline-flex", color: "#E0A526" }}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <StarRounded
          key={star}
          sx={{ fontSize: size, color: star <= value ? "inherit" : "rgba(27, 67, 50, 0.15)" }}
        />
      ))}
    </Box>
  );
}

export function ClientAvatar({ name, photo, size = 48, light = false }) {
  const [failed, setFailed] = useState(false);
  const [from, to] = toneFor(name);
  const src = mediaUrl(photo);

  return (
    <Box
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: "50%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#FFFFFF",
        fontWeight: 800,
        fontSize: size * 0.36,
        background: `linear-gradient(150deg, ${from}, ${to})`,
        boxShadow: light ? "0 0 0 3px rgba(255, 255, 255, 0.25)" : `0 0 0 3px ${GREEN.mist}`,
      }}
    >
      {src && !failed ? (
        <Box
          component="img"
          src={src}
          alt={name}
          onError={() => setFailed(true)}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        initials(name)
      )}
    </Box>
  );
}

export default function TestimonialCard({ item }) {
  const subtitle = [item.organization, item.service].filter(Boolean).join(" · ");

  return (
    <Box
      component="figure"
      sx={{
        position: "relative",
        m: 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: { xs: 2.75, md: 3.25 },
        borderRadius: "26px 26px 26px 6px",
        backgroundColor: "#FFFFFF",
        border: "1px solid rgba(27, 67, 50, 0.07)",
        boxShadow: "0 16px 40px rgba(27, 67, 50, 0.08)",
        transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 26px 50px rgba(27, 67, 50, 0.14)",
          "& .quote-mark": { color: GREEN.light, transform: "rotate(-8deg) scale(1.08)" },
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <StarRow value={item.rating || 5} />
        <FormatQuoteRounded
          className="quote-mark"
          aria-hidden
          sx={{
            fontSize: 40,
            color: GREEN.mist,
            transition: "color 0.3s ease, transform 0.3s ease",
          }}
        />
      </Box>
      <Typography
        component="blockquote"
        sx={{ m: 0, flex: 1, color: GREEN.ink, lineHeight: 1.8, fontSize: "0.98rem" }}
      >
        “{item.content}”
      </Typography>
      <Box
        component="figcaption"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mt: 2.5,
          pt: 2.25,
          borderTop: "1px dashed rgba(27, 67, 50, 0.15)",
        }}
      >
        <ClientAvatar name={item.client_name} photo={item.photo} />
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800, color: GREEN.ink }}>{item.client_name}</Typography>
          {subtitle && (
            <Typography sx={{ fontSize: "0.82rem", color: "text.secondary" }}>{subtitle}</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

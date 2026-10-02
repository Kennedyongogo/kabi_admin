import React, { useRef, useState } from "react";
import { Box } from "@mui/material";
import { CompareArrowsRounded } from "@mui/icons-material";
import { GREEN } from "./PageSections";

const label = (side) => ({
  position: "absolute",
  top: 16,
  [side]: 16,
  px: 1.5,
  py: 0.5,
  borderRadius: 999,
  fontSize: "0.72rem",
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#FFFFFF",
  backgroundColor: "rgba(27, 42, 34, 0.6)",
  backdropFilter: "blur(6px)",
  pointerEvents: "none",
});

/** Drag, click or use arrow keys to compare two photos. */
export default function BeforeAfter({ before, after, alt = "", ratio = "16 / 9", sx }) {
  const ref = useRef(null);
  const dragging = useRef(false);
  const [pos, setPos] = useState(50);

  const moveTo = (clientX) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  };

  return (
    <Box
      ref={ref}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture?.(e.pointerId);
        moveTo(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && moveTo(e.clientX)}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
      sx={{
        position: "relative",
        overflow: "hidden",
        aspectRatio: ratio,
        borderRadius: "28px 28px 28px 8px",
        cursor: "ew-resize",
        userSelect: "none",
        touchAction: "pan-y",
        backgroundColor: GREEN.mist,
        boxShadow: "0 24px 60px rgba(27, 67, 50, 0.18)",
        "&:focus-within .ba-handle": { boxShadow: `0 0 0 5px ${GREEN.light}` },
        ...sx,
      }}
    >
      <Box component="img" src={after} alt={`After: ${alt}`} draggable={false} sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <Box
        component="img"
        src={before}
        alt={`Before: ${alt}`}
        draggable={false}
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "saturate(0.55) brightness(0.92)",
          clipPath: `inset(0 ${100 - pos}% 0 0)`,
        }}
      />
      <Box sx={{ ...label("left"), opacity: pos > 12 ? 1 : 0, transition: "opacity 0.2s ease" }}>Before</Box>
      <Box sx={{ ...label("right"), opacity: pos < 88 ? 1 : 0, transition: "opacity 0.2s ease" }}>After</Box>

      <Box sx={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 3, ml: "-1.5px", backgroundColor: "#FFFFFF", boxShadow: "0 0 12px rgba(0,0,0,0.3)", pointerEvents: "none" }} />
      <Box
        className="ba-handle"
        sx={{
          position: "absolute",
          top: "50%",
          left: `${pos}%`,
          width: 48,
          height: 48,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: GREEN.deep,
          backgroundColor: "#FFFFFF",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
          pointerEvents: "none",
          transition: "box-shadow 0.2s ease",
        }}
      >
        <CompareArrowsRounded />
      </Box>

      <Box
        component="input"
        type="range"
        min={0}
        max={100}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Compare before and after photos"
        sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", m: 0, opacity: 0, cursor: "ew-resize", pointerEvents: "none" }}
      />
    </Box>
  );
}

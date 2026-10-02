import React, { useCallback, useEffect, useRef } from "react";
import { Box, Dialog, IconButton, Typography } from "@mui/material";
import { ChevronLeftRounded, ChevronRightRounded, CloseRounded } from "@mui/icons-material";
import { GREEN } from "./PageSections";

/** Full-screen photo viewer. Items: { id, file_url, caption, alt_text, album? }. */
export default function Lightbox({ items, index, onClose, onIndex }) {
  const open = index !== null;
  const current = open ? items[index] : null;
  const touchStart = useRef(null);
  const thumbsRef = useRef(null);

  const go = useCallback(
    (step) => onIndex((prev) => (prev + step + items.length) % items.length),
    [items.length, onIndex]
  );

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  useEffect(() => {
    const thumb = thumbsRef.current?.querySelector(`[data-thumb="${index}"]`);
    thumb?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);

  const arrowSx = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 2,
    width: { xs: 42, md: 54 },
    height: { xs: 42, md: 54 },
    color: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(8px)",
    "&:hover": { backgroundColor: "rgba(82, 183, 136, 0.45)" },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      aria-label="Photo viewer"
      slotProps={{
        paper: { sx: { backgroundColor: "rgba(12, 24, 18, 0.96)", backgroundImage: "none" } },
      }}
    >
      {current && (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", color: "#FFFFFF" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              px: { xs: 2, md: 3 },
              py: 1.5,
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.75)" }}>
              <Box component="span" sx={{ color: "#FFFFFF" }}>
                {index + 1}
              </Box>{" "}
              / {items.length}
            </Typography>
            <IconButton
              onClick={onClose}
              aria-label="Close photo viewer"
              sx={{ color: "#FFFFFF", backgroundColor: "rgba(255, 255, 255, 0.1)", "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" } }}
            >
              <CloseRounded />
            </IconButton>
          </Box>

          <Box
            sx={{ position: "relative", flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", px: { xs: 1, md: 10 } }}
            onTouchStart={(e) => {
              touchStart.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchStart.current === null) return;
              const delta = e.changedTouches[0].clientX - touchStart.current;
              if (Math.abs(delta) > 45) go(delta < 0 ? 1 : -1);
              touchStart.current = null;
            }}
          >
            {items.length > 1 && (
              <IconButton aria-label="Previous photo" onClick={() => go(-1)} sx={{ ...arrowSx, left: { xs: 8, md: 24 } }}>
                <ChevronLeftRounded fontSize="large" />
              </IconButton>
            )}
            <Box
              key={current.id}
              component="img"
              src={current.file_url.replace(/w=\d+/, "w=1800")}
              alt={current.alt_text || current.caption}
              sx={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                borderRadius: "18px",
                boxShadow: "0 30px 80px rgba(0, 0, 0, 0.5)",
                "@keyframes lightboxIn": {
                  from: { opacity: 0, transform: "scale(0.97)" },
                  to: { opacity: 1, transform: "none" },
                },
                animation: "lightboxIn 0.35s ease",
                "@media (prefers-reduced-motion: reduce)": { animation: "none" },
              }}
            />
            {items.length > 1 && (
              <IconButton aria-label="Next photo" onClick={() => go(1)} sx={{ ...arrowSx, right: { xs: 8, md: 24 } }}>
                <ChevronRightRounded fontSize="large" />
              </IconButton>
            )}
          </Box>

          <Box sx={{ px: { xs: 2, md: 3 }, pt: 2, pb: { xs: 2, md: 2.5 }, textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: GREEN.light }}>
              {current.album}
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: { xs: "1rem", md: "1.1rem" }, mt: 0.5 }}>
              {current.caption}
            </Typography>
            <Box
              ref={thumbsRef}
              sx={{
                mt: 2,
                display: "flex",
                gap: 1,
                justifyContent: { xs: "flex-start", md: items.length > 12 ? "flex-start" : "center" },
                overflowX: "auto",
                pb: 0.5,
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {items.map((item, i) => (
                <Box
                  key={item.id}
                  data-thumb={i}
                  component="button"
                  type="button"
                  aria-label={`Show photo ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => onIndex(i)}
                  sx={{
                    flexShrink: 0,
                    width: 64,
                    height: 48,
                    p: 0,
                    borderRadius: "10px",
                    overflow: "hidden",
                    cursor: "pointer",
                    border: `2px solid ${i === index ? GREEN.light : "transparent"}`,
                    opacity: i === index ? 1 : 0.5,
                    transition: "opacity 0.2s ease, border-color 0.2s ease",
                    backgroundColor: "transparent",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  <Box
                    component="img"
                    src={item.file_url.replace(/w=\d+/, "w=200")}
                    alt=""
                    loading="lazy"
                    sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Dialog>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

export const GREEN = {
  deep: "#1B4332",
  main: "#2D6A4F",
  mid: "#40916C",
  light: "#52B788",
  mist: "#D8F3DC",
  cream: "#F7F4EC",
  ink: "#1B2A22",
};

export function Reveal({ children, delay = 0, sx }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const cleanup = () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
    // Also covers sections skipped over by fast scrolls or anchor jumps.
    function check() {
      if (node.getBoundingClientRect().top < window.innerHeight * 0.92) {
        setShown(true);
        cleanup();
      }
    }
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    check();
    return cleanup;
  }, []);

  return (
    <Box
      ref={ref}
      sx={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        "@media (prefers-reduced-motion: reduce)": {
          opacity: 1,
          transform: "none",
          transition: "none",
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export function Eyebrow({ children, light = false, center = false }) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        mb: 1.25,
        justifyContent: center ? "center" : "flex-start",
      }}
    >
      <Box
        sx={{
          width: 22,
          height: 2,
          borderRadius: 99,
          backgroundColor: light ? GREEN.light : GREEN.mid,
        }}
      />
      <Typography
        sx={{
          color: light ? GREEN.mist : GREEN.main,
          fontWeight: 800,
          fontSize: "0.72rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, light = false }) {
  return (
    <Box sx={{ textAlign: "center", maxWidth: 640, mx: "auto", mb: { xs: 4, md: 5 } }}>
      <Eyebrow light={light} center>
        {eyebrow}
      </Eyebrow>
      <Typography
        component="h2"
        sx={{
          fontWeight: 800,
          fontSize: { xs: "1.7rem", md: "2.25rem" },
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
          color: light ? "#FFFFFF" : GREEN.ink,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          sx={{
            mt: 1.25,
            lineHeight: 1.7,
            color: light ? "rgba(255, 255, 255, 0.82)" : "text.secondary",
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

/** Dark green page hero shared by inner pages. */
export function PageHero({ eyebrow, title, highlight, subtitle, children }) {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        color: "#FFFFFF",
        pt: { xs: 7, md: 10 },
        pb: { xs: 12, md: 14 },
        background: `radial-gradient(circle at 85% 15%, rgba(82, 183, 136, 0.35), transparent 45%), linear-gradient(160deg, ${GREEN.deep} 0%, ${GREEN.main} 100%)`,
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          right: { xs: -80, md: -40 },
          bottom: -120,
          width: { xs: 260, md: 380 },
          height: { xs: 260, md: 380 },
          borderRadius: "50% 50% 0 50%",
          border: "1px solid rgba(216, 243, 220, 0.18)",
          transform: "rotate(-20deg)",
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          right: { xs: -20, md: 60 },
          bottom: -60,
          width: { xs: 160, md: 240 },
          height: { xs: 160, md: 240 },
          borderRadius: "50% 50% 0 50%",
          backgroundColor: "rgba(216, 243, 220, 0.06)",
          transform: "rotate(-20deg)",
        }}
      />
      <Box sx={{ position: "relative", maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3 } }}>
        <Reveal>
          <Eyebrow light>{eyebrow}</Eyebrow>
          <Typography
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.1rem", sm: "2.6rem", md: "3.3rem" },
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              maxWidth: 760,
            }}
          >
            {title}{" "}
            {highlight && (
              <Box
                component="span"
                sx={{
                  background: `linear-gradient(90deg, ${GREEN.mist}, ${GREEN.light})`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {highlight}
              </Box>
            )}
          </Typography>
          {subtitle && (
            <Typography
              sx={{
                mt: 2,
                maxWidth: 620,
                fontSize: { xs: "1rem", md: "1.1rem" },
                lineHeight: 1.75,
                color: "rgba(255, 255, 255, 0.85)",
              }}
            >
              {subtitle}
            </Typography>
          )}
          {children}
        </Reveal>
      </Box>
    </Box>
  );
}

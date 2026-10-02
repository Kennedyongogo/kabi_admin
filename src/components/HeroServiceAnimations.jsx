import React from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const reducedMotion = `
  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; }
  }
`;

function HydroponicIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <style>
        {`
          @keyframes hp-wave { 0%,100% { transform: translateY(0); }
            50% { transform: translateY(2px); } }
          @keyframes hp-drip { 0% { transform: translateY(0); opacity: .9; }
            80% { transform: translateY(10px); opacity: .2; }
            100% { transform: translateY(10px); opacity: 0; } }
          @keyframes hp-leaf { 0%,100% { transform: rotate(-8deg); }
            50% { transform: rotate(8deg); } }
          ${reducedMotion}
        `}
      </style>
      <rect x="10" y="40" width="44" height="14" rx="3" fill="#74C69D" />
      <rect
        x="10"
        y="41"
        width="44"
        height="6"
        rx="2"
        fill="#52B788"
        style={{ animation: "hp-wave 2.4s ease-in-out infinite" }}
      />
      <rect x="14" y="37" width="36" height="3" rx="1.5" fill="#D8F3DC" />
      <path d="M32 38 V20" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <g style={{ transformOrigin: "32px 24px", animation: "hp-leaf 2.8s ease-in-out infinite" }}>
        <ellipse cx="24" cy="24" rx="9" ry="5" fill="#B7E4C7" />
        <ellipse cx="40" cy="24" rx="9" ry="5" fill="#95D5B2" />
      </g>
      <circle cx="32" cy="16" r="3" fill="#D8F3DC" />
      <ellipse
        cx="20"
        cy="30"
        rx="2"
        ry="3"
        fill="#FFFFFF"
        style={{ animation: "hp-drip 1.8s ease-in infinite" }}
      />
      <ellipse
        cx="44"
        cy="28"
        rx="2"
        ry="3"
        fill="#FFFFFF"
        style={{ animation: "hp-drip 1.8s ease-in 0.7s infinite" }}
      />
    </svg>
  );
}

function VerticalIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <style>
        {`
          @keyframes vf-glow { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
          @keyframes vf-grow { 0%,100% { transform: scaleY(.85); }
            50% { transform: scaleY(1); } }
          ${reducedMotion}
        `}
      </style>
      <rect x="16" y="8" width="32" height="48" rx="4" stroke="#FFFFFF" strokeWidth="2" />
      <rect
        x="18"
        y="10"
        width="28"
        height="4"
        rx="1"
        fill="#FFD166"
        style={{ animation: "vf-glow 2s ease-in-out infinite" }}
      />
      {[0, 1, 2].map((row) => (
        <g key={row}>
          <rect x="20" y={20 + row * 12} width="24" height="3" rx="1" fill="#D8F3DC" />
          <g
            style={{
              transformOrigin: `32px ${20 + row * 12}px`,
              animation: `vf-grow 2.2s ease-in-out ${row * 0.25}s infinite`,
            }}
          >
            <path
              d={`M26 ${20 + row * 12} C26 ${14 + row * 12} 32 ${14 + row * 12} 32 ${20 + row * 12}`}
              stroke="#95D5B2"
              strokeWidth="2"
              fill="none"
            />
            <path
              d={`M32 ${20 + row * 12} C32 ${14 + row * 12} 38 ${14 + row * 12} 38 ${20 + row * 12}`}
              stroke="#B7E4C7"
              strokeWidth="2"
              fill="none"
            />
          </g>
        </g>
      ))}
    </svg>
  );
}

function OrganicIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <style>
        {`
          @keyframes org-sprout { 0%,100% { transform: scaleY(.7); }
            50% { transform: scaleY(1); } }
          @keyframes org-leaf { 0%,100% { transform: rotate(-12deg); }
            50% { transform: rotate(10deg); } }
          ${reducedMotion}
        `}
      </style>
      <ellipse cx="32" cy="50" rx="22" ry="8" fill="#95D5B2" />
      <ellipse cx="32" cy="48" rx="16" ry="5" fill="#74C69D" />
      <g style={{ transformOrigin: "32px 48px", animation: "org-sprout 2.6s ease-in-out infinite" }}>
        <path d="M32 48 V22" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        <g style={{ transformOrigin: "32px 30px", animation: "org-leaf 2.4s ease-in-out infinite" }}>
          <ellipse cx="22" cy="30" rx="10" ry="6" fill="#B7E4C7" />
          <ellipse cx="42" cy="28" rx="10" ry="6" fill="#D8F3DC" />
        </g>
        <circle cx="32" cy="18" r="4" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

function AgronomyIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <style>
        {`
          @keyframes ag-sway { 0%,100% { transform: rotate(-6deg); }
            50% { transform: rotate(6deg); } }
          ${reducedMotion}
        `}
      </style>
      <rect x="8" y="50" width="48" height="6" rx="3" fill="#74C69D" />
      {[18, 28, 38, 48].map((x, i) => (
        <g
          key={x}
          style={{
            transformOrigin: `${x}px 50px`,
            animation: `ag-sway 2.1s ease-in-out ${i * 0.18}s infinite`,
          }}
        >
          <path d={`M${x} 50 V22`} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx={x - 5} cy="26" rx="6" ry="3.5" fill="#D8F3DC" />
          <ellipse cx={x + 5} cy="32" rx="6" ry="3.5" fill="#B7E4C7" />
          <ellipse cx={x - 4} cy="38" rx="5" ry="3" fill="#95D5B2" />
        </g>
      ))}
    </svg>
  );
}

function LandscapingIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <style>
        {`
          @keyframes ls-tree { 0%,100% { transform: translateY(0); }
            50% { transform: translateY(-2px); } }
          @keyframes ls-grass { 0%,100% { transform: rotate(-8deg); }
            50% { transform: rotate(8deg); } }
          ${reducedMotion}
        `}
      </style>
      <rect x="6" y="48" width="52" height="8" rx="4" fill="#52B788" />
      <rect x="20" y="36" width="5" height="14" fill="#D8F3DC" />
      <g style={{ animation: "ls-tree 2.8s ease-in-out infinite" }}>
        <circle cx="22.5" cy="28" r="10" fill="#B7E4C7" />
        <circle cx="18" cy="32" r="7" fill="#95D5B2" />
      </g>
      <rect x="42" y="40" width="4" height="10" fill="#D8F3DC" />
      <circle
        cx="44"
        cy="36"
        r="8"
        fill="#95D5B2"
        style={{ animation: "ls-tree 2.4s ease-in-out 0.4s infinite" }}
      />
      <ellipse cx="34" cy="48" rx="7" ry="5" fill="#74C69D" />
      {[12, 28, 50].map((x, i) => (
        <path
          key={x}
          d={`M${x} 48 Q${x + 2} 40 ${x + 4} 48`}
          stroke="#D8F3DC"
          strokeWidth="1.6"
          fill="none"
          style={{
            transformOrigin: `${x + 2}px 48px`,
            animation: `ls-grass 1.6s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </svg>
  );
}

function TrainingIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <style>
        {`
          @keyframes tr-board { 0%,100% { transform: translateY(0); }
            50% { transform: translateY(-2px); } }
          @keyframes tr-sprout { 0%,100% { transform: scale(0.9); }
            50% { transform: scale(1); } }
          ${reducedMotion}
        `}
      </style>
      <g style={{ animation: "tr-board 2.6s ease-in-out infinite" }}>
        <rect x="10" y="12" width="28" height="20" rx="2" fill="#FFFFFF" opacity="0.9" />
        <rect x="14" y="17" width="16" height="2" rx="1" fill="#2D6A4F" />
        <rect x="14" y="22" width="12" height="2" rx="1" fill="#40916C" />
        <rect x="14" y="27" width="18" height="2" rx="1" fill="#74C69D" />
      </g>
      <circle cx="28" cy="42" r="6" fill="#FFFFFF" />
      <rect x="24" y="48" width="8" height="10" rx="2" fill="#D8F3DC" />
      <g style={{ transformOrigin: "48px 48px", animation: "tr-sprout 2s ease-in-out infinite" }}>
        <rect x="46" y="44" width="6" height="8" rx="1" fill="#FFFFFF" />
        <path d="M49 44 C49 36 43 36 43 42" stroke="#B7E4C7" strokeWidth="2" fill="none" />
        <path d="M49 44 C49 34 55 36 54 42" stroke="#95D5B2" strokeWidth="2" fill="none" />
      </g>
    </svg>
  );
}

function EiaIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <style>
        {`
          @keyframes eia-spin { 0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); } }
          @keyframes eia-check { 0%,30% { stroke-dashoffset: 24; }
            60%,100% { stroke-dashoffset: 0; } }
          ${reducedMotion}
        `}
      </style>
      <circle cx="28" cy="30" r="16" fill="#52B788" />
      <ellipse
        cx="28"
        cy="30"
        rx="7"
        ry="16"
        stroke="#D8F3DC"
        strokeWidth="1.5"
        style={{ transformOrigin: "28px 30px", animation: "eia-spin 8s linear infinite" }}
      />
      <path d="M12 30 H44" stroke="#B7E4C7" strokeWidth="1.5" />
      <rect x="36" y="34" width="18" height="22" rx="2" fill="#FFFFFF" />
      <path
        d="M41 46 L44 49 L51 41"
        stroke="#2D6A4F"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="24"
        style={{ animation: "eia-check 2.8s ease-in-out infinite" }}
      />
    </svg>
  );
}

export function GenericIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <style>
        {`
          @keyframes gn-sway { 0%,100% { transform: rotate(-6deg); }
            50% { transform: rotate(6deg); } }
          ${reducedMotion}
        `}
      </style>
      <ellipse cx="32" cy="50" rx="16" ry="6" fill="#74C69D" />
      <g style={{ transformOrigin: "32px 50px", animation: "gn-sway 2.4s ease-in-out infinite" }}>
        <path d="M32 50 V20" stroke="#FFFFFF" strokeWidth="2.2" />
        <ellipse cx="22" cy="28" rx="10" ry="6" fill="#B7E4C7" />
        <ellipse cx="42" cy="26" rx="10" ry="6" fill="#D8F3DC" />
      </g>
    </svg>
  );
}

export const ICONS = {
  "hydroponic-farming": HydroponicIcon,
  "vertical-farming": VerticalIcon,
  "organic-agriculture": OrganicIcon,
  "agronomy-consultancy": AgronomyIcon,
  landscaping: LandscapingIcon,
  training: TrainingIcon,
  "eia-services": EiaIcon,
};

const SHORT_LABELS = {
  "hydroponic-farming": { xs: "Hydro", md: "Hydroponics" },
  "vertical-farming": { xs: "Vert", md: "Vertical" },
  "organic-agriculture": { xs: "Organic", md: "Organic" },
  "agronomy-consultancy": { xs: "Agro", md: "Agronomy" },
  landscaping: { xs: "Land", md: "Landscape" },
  training: { xs: "Train", md: "Training" },
  "eia-services": { xs: "EIA", md: "EIA" },
};

export default function HeroServiceAnimations({ services = [] }) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        mt: { xs: 1.5, sm: 2, md: 2.75 },
        width: { xs: "100%", md: "48vw", xl: "50vw" },
        maxWidth: { xs: "100%", md: "48vw", xl: "50vw" },
        minWidth: 0,
        overflow: "visible",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "nowrap",
          justifyContent: "space-between",
          alignItems: "stretch",
          gap: { xs: 0.5, sm: 1, md: 1.5, lg: 2, xl: 2.5 },
          width: "100%",
        }}
      >
        {services.slice(0, 7).map((service) => {
          const Icon = ICONS[service.slug] || GenericIcon;
          const labels = SHORT_LABELS[service.slug];
          const fallback = service.name?.split(" ")[0] || "Service";
          const tooltip = labels?.md || service.name || fallback;
          return (
            <Tooltip
              key={service.slug || service.name}
              title={tooltip}
              arrow
              placement="top"
              enterDelay={120}
              slotProps={{
                tooltip: {
                  sx: {
                    bgcolor: "#2D6A4F",
                    color: "#F7F4EC",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    letterSpacing: "0.02em",
                    px: 1.25,
                    py: 0.7,
                    borderRadius: "8px",
                    border: "1px solid #52B788",
                    boxShadow: "0 8px 20px rgba(27, 67, 50, 0.32)",
                  },
                },
                arrow: {
                  sx: {
                    color: "#2D6A4F",
                    "&::before": {
                      border: "1px solid #52B788",
                      backgroundColor: "#2D6A4F",
                      boxSizing: "border-box",
                    },
                  },
                },
              }}
            >
              <Box
                component="button"
                type="button"
                onClick={() => navigate(`/services/${service.slug}`)}
                aria-label={service.name}
                sx={{
                  minWidth: 0,
                  flex: "1 1 0",
                  p: { xs: 0.35, sm: 0.6, md: 0.85 },
                  border: "1px solid rgba(255,255,255,0.35)",
                  borderRadius: { xs: "10px", md: "14px" },
                  backgroundColor: "rgba(45, 106, 79, 0.28)",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: { xs: 0.15, sm: 0.4 },
                  appearance: "none",
                  WebkitAppearance: "none",
                  WebkitTapHighlightColor: "transparent",
                  boxShadow: "none",
                  outline: "none",
                  zIndex: 1,
                  transform: "scale(1)",
                  transformOrigin: "center center",
                  transition:
                    "transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease",
                  "&:hover": {
                    zIndex: 3,
                    transform: "scale(1.14)",
                    backgroundColor: "#40916C",
                    borderColor: "#52B788",
                    boxShadow: "0 10px 24px rgba(27, 67, 50, 0.28)",
                    color: "#FFFFFF",
                  },
                  "&:focus, &:focus-visible, &:active": {
                    outline: "none",
                    borderColor: "#52B788",
                    backgroundColor: "#2D6A4F",
                    boxShadow: "0 0 0 2px rgba(82, 183, 136, 0.45)",
                  },
                  "@media (prefers-reduced-motion: reduce)": {
                    transition: "background-color 0.2s ease, border-color 0.2s ease",
                    "&:hover": {
                      transform: "none",
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    width: { xs: 22, sm: 32, md: 40 },
                    height: { xs: 22, sm: 32, md: 40 },
                    "& svg": { width: "100%", height: "100%", display: "block" },
                  }}
                >
                  <Icon />
                </Box>
                <Typography
                  noWrap
                  sx={{
                    width: "100%",
                    fontSize: { xs: "0.48rem", sm: "0.62rem", md: "0.6rem", lg: "0.68rem" },
                    fontWeight: 700,
                    lineHeight: 1.15,
                    letterSpacing: { xs: 0, md: "0.01em" },
                    textAlign: "center",
                    "@media (max-height: 540px)": {
                      display: { xs: "none", md: "block" },
                    },
                  }}
                >
                  <Box component="span" sx={{ display: { xs: "inline", xl: "none" } }}>
                    {labels?.xs || fallback}
                  </Box>
                  <Box component="span" sx={{ display: { xs: "none", xl: "inline" } }}>
                    {labels?.md || fallback}
                  </Box>
                </Typography>
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
}

import React from "react";
import { Box } from "@mui/material";
import {
  AccessTimeRounded,
  AttachMoneyRounded,
  DesignServicesRounded,
  DescriptionOutlined,
  GrassRounded,
  ParkRounded,
  SchoolRounded,
  ShieldOutlined,
  SupportAgentRounded,
  TrendingUpRounded,
  ViewInArRounded,
  WaterDropOutlined,
} from "@mui/icons-material";
import { GREEN } from "./PageSections";
import { ICONS, GenericIcon } from "./HeroServiceAnimations";

export const BENEFIT_ICONS = {
  water: WaterDropOutlined,
  yield: TrendingUpRounded,
  leaf: GrassRounded,
  space: ViewInArRounded,
  design: DesignServicesRounded,
  eco: ParkRounded,
  money: AttachMoneyRounded,
  shield: ShieldOutlined,
  support: SupportAgentRounded,
  clock: AccessTimeRounded,
  school: SchoolRounded,
  doc: DescriptionOutlined,
};

/** The animated service illustration on a green leaf-shaped tile. */
export function ServiceIcon({ slug, size = 52, light = false, sx }) {
  const Icon = ICONS[slug] || GenericIcon;
  return (
    <Box
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        p: `${Math.round(size * 0.16)}px`,
        borderRadius: `${Math.round(size * 0.32)}px ${Math.round(size * 0.32)}px ${Math.round(size * 0.32)}px ${Math.round(size * 0.1)}px`,
        background: light ? "rgba(216, 243, 220, 0.14)" : `linear-gradient(150deg, ${GREEN.mid}, ${GREEN.deep})`,
        border: light ? "1px solid rgba(216, 243, 220, 0.3)" : "none",
        boxShadow: light ? "none" : "0 10px 22px rgba(45, 106, 79, 0.3)",
        "& svg": { width: "100%", height: "100%", display: "block" },
        ...sx,
      }}
    >
      <Icon />
    </Box>
  );
}

export function StatusBadge({ status, sx }) {
  const ongoing = status === "Ongoing";
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.25,
        py: 0.4,
        borderRadius: 999,
        fontSize: "0.72rem",
        fontWeight: 800,
        color: ongoing ? "#7A4B00" : GREEN.deep,
        backgroundColor: ongoing ? "#FFE8B0" : "rgba(255, 255, 255, 0.92)",
        ...sx,
      }}
    >
      <Box
        component="span"
        sx={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          backgroundColor: ongoing ? "#E08A00" : GREEN.mid,
          ...(ongoing && {
            "@keyframes statusPulse": {
              "0%": { boxShadow: "0 0 0 0 rgba(224, 138, 0, 0.6)" },
              "70%": { boxShadow: "0 0 0 7px rgba(224, 138, 0, 0)" },
              "100%": { boxShadow: "0 0 0 0 rgba(224, 138, 0, 0)" },
            },
            animation: "statusPulse 2s infinite",
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }),
        }}
      />
      {status}
    </Box>
  );
}

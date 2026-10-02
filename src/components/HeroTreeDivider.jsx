import React from "react";
import { Box } from "@mui/material";

const desktopFill =
  "M0 0 H980 C1012 14 1048 42 1038 84 C1110 58 1180 92 1170 155 C1238 148 1278 210 1242 268 C1296 302 1270 372 1204 388 C1240 438 1188 488 1122 478 C1138 524 1080 552 1026 532 C998 558 952 548 936 512 C898 480 856 486 840 524 C826 622 790 745 754 840 C736 878 706 898 668 900 H0 Z";

const desktopEdge =
  "M980 0 C1012 14 1048 42 1038 84 C1110 58 1180 92 1170 155 C1238 148 1278 210 1242 268 C1296 302 1270 372 1204 388 C1240 438 1188 488 1122 478 C1138 524 1080 552 1026 532 C998 558 952 548 936 512 C898 480 856 486 840 524 C826 622 790 745 754 840 C736 878 706 898 668 900";

const mobileFill =
  "M0 0 H1000 V820 C940 800 900 848 848 826 C788 872 728 808 668 846 C608 798 542 858 488 820 C452 866 422 836 398 876 C384 940 366 1000 344 1052 C328 1090 300 1118 264 1128 L0 1025 Z";

const mobileEdge =
  "M1000 820 C940 800 900 848 848 826 C788 872 728 808 668 846 C608 798 542 858 488 820 C452 866 422 836 398 876 C384 940 366 1000 344 1052 C328 1090 300 1118 264 1128 L0 1025";

function TreeSketch({
  viewBox,
  fillPath,
  edgePath,
  rimTransform,
  show,
}) {
  const fillId = `hero-tree-fill-${show}`;
  const rimId = `hero-tree-rim-${show}`;

  return (
    <Box
      component="svg"
      viewBox={viewBox}
      preserveAspectRatio="none"
      aria-hidden="true"
      sx={{
        display: show === "desktop" ? { xs: "none", md: "block" } : { xs: "block", md: "none" },
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1B4332" />
          <stop offset="58%" stopColor="#2D6A4F" />
          <stop offset="100%" stopColor="#245C43" />
        </linearGradient>
        <linearGradient id={rimId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#40916C" />
          <stop offset="100%" stopColor="#52B788" />
        </linearGradient>
      </defs>

      <path d={fillPath} fill={`url(#${rimId})`} transform={rimTransform} />
      <path d={fillPath} fill={`url(#${fillId})`} />

      <path
        d={edgePath}
        fill="none"
        stroke="#D8F3DC"
        strokeWidth={show === "desktop" ? 7 : 10}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.28"
      />
      <path
        d={edgePath}
        fill="none"
        stroke="#1B4332"
        strokeWidth={show === "desktop" ? 3 : 4.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
      {show === "desktop" ? (
        <g fill="none" stroke="#B7E4C7" strokeLinecap="round" opacity="0.35">
          <path d="M1048 130 C1095 165 1112 220 1090 270" strokeWidth="2.2" />
          <path d="M1160 200 C1200 245 1195 305 1150 340" strokeWidth="2" />
          <path d="M1060 320 C1105 355 1108 410 1070 445" strokeWidth="1.8" />
          <path d="M870 540 C856 640 828 750 792 845" strokeWidth="3.2" />
          <path d="M905 555 C890 660 860 770 822 860" strokeWidth="2" />
        </g>
      ) : (
        <g fill="none" stroke="#B7E4C7" strokeLinecap="round" opacity="0.35">
          <path d="M780 835 C740 862 700 850 670 878" strokeWidth="3" />
          <path d="M620 830 C580 862 540 842 510 872" strokeWidth="3" />
          <path d="M410 890 C398 950 380 1010 358 1070" strokeWidth="4" />
        </g>
      )}
    </Box>
  );
}

export default function HeroTreeDivider() {
  return (
    <>
      <TreeSketch
        show="mobile"
        viewBox="0 0 1000 1480"
        fillPath={mobileFill}
        edgePath={mobileEdge}
        rimTransform="translate(0 18)"
      />
      <TreeSketch
        show="desktop"
        viewBox="0 0 1600 900"
        fillPath={desktopFill}
        edgePath={desktopEdge}
        rimTransform="translate(22 0)"
      />
    </>
  );
}

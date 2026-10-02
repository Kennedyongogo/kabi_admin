import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  SchoolOutlined,
  MenuBookOutlined,
  PhotoLibraryOutlined,
  FormatQuoteOutlined,
  ArrowForwardRounded,
  KeyboardArrowDownRounded,
  TipsAndUpdatesOutlined,
  StarRounded,
  TrendingUpRounded,
} from "@mui/icons-material";
import { apiGet, mediaUrl } from "../utils/api";
import { fallbackServices, fallbackTestimonials } from "../data/siteContent";
import { projectImpact, serviceDetails } from "../data/portfolioContent";
import HeroServiceAnimations from "../components/HeroServiceAnimations";
import TestimonialCard from "../components/TestimonialCard";
import HeroTreeDivider from "../components/HeroTreeDivider";
import { Eyebrow, GREEN, Reveal } from "../components/PageSections";
import { ServiceIcon } from "../components/ServiceBits";

function WhatWeDoCard({ service, number, onOpen }) {
  const offerings = (service.offerings || []).slice(0, 3);
  return (
    <Box
      component="button"
      type="button"
      onClick={onOpen}
      aria-label={`${service.name}. ${service.tagline || service.short_description || ""}`}
      sx={{
        position: "relative",
        display: "block",
        width: "100%",
        height: "100%",
        minHeight: { xs: 300, md: 360 },
        p: 0,
        border: 0,
        cursor: "pointer",
        overflow: "hidden",
        textAlign: "left",
        fontFamily: "inherit",
        color: "#FFFFFF",
        borderRadius: "28px 28px 28px 8px",
        backgroundColor: GREEN.deep,
        boxShadow: "0 16px 38px rgba(27, 67, 50, 0.14)",
        transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease",
        "& .wwd-img": { transition: "transform 1s cubic-bezier(0.22, 1, 0.36, 1)" },
        "& .wwd-shade": { transition: "opacity 0.4s ease" },
        "& .wwd-more": { transition: "max-height 0.45s ease, opacity 0.35s ease, margin 0.35s ease" },
        "& .wwd-arrow": { transition: "transform 0.3s ease, background-color 0.3s ease, color 0.3s ease" },
        "& .wwd-bar": { transition: "width 0.45s cubic-bezier(0.22, 1, 0.36, 1)" },
        "&:hover, &:focus-visible": {
          transform: "translateY(-8px)",
          boxShadow: "0 30px 60px rgba(27, 67, 50, 0.26)",
          "& .wwd-img": { transform: "scale(1.08)" },
          "& .wwd-shade": { opacity: 1 },
          "& .wwd-more": { maxHeight: 120, opacity: 1, mt: 1.5 },
          "& .wwd-arrow": { transform: "rotate(-45deg)", backgroundColor: "#FFFFFF", color: GREEN.deep },
          "& .wwd-bar": { width: "100%" },
        },
        "&:focus-visible": { outline: `3px solid ${GREEN.light}`, outlineOffset: 3 },
        "@media (prefers-reduced-motion: reduce)": {
          "&:hover, &:focus-visible": { transform: "none", "& .wwd-img": { transform: "none" } },
        },
      }}
    >
      <Box
        className="wwd-img"
        component="img"
        src={service.image ? mediaUrl(service.image) : "/images/b1.jpg"}
        alt=""
        loading="lazy"
        sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(27, 42, 34, 0.35) 0%, rgba(27, 42, 34, 0.1) 30%, rgba(27, 67, 50, 0.92) 100%)",
        }}
      />
      <Box
        className="wwd-shade"
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          background: "linear-gradient(180deg, rgba(27, 67, 50, 0.25) 0%, rgba(27, 67, 50, 0.95) 75%)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: 18,
          left: 18,
          right: 18,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <ServiceIcon slug={service.slug} size={52} light sx={{ backdropFilter: "blur(10px)", backgroundColor: "rgba(27, 67, 50, 0.35)" }} />
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: "0.85rem",
            letterSpacing: "0.12em",
            px: 1.25,
            py: 0.4,
            borderRadius: 999,
            backgroundColor: "rgba(27, 42, 34, 0.35)",
            border: "1px solid rgba(216, 243, 220, 0.3)",
            backdropFilter: "blur(8px)",
          }}
        >
          {String(number).padStart(2, "0")}
        </Typography>
      </Box>

      <Box sx={{ position: "absolute", left: 0, right: 0, bottom: 0, p: { xs: 2.25, md: 2.5 } }}>
        <Typography component="h3" sx={{ fontWeight: 800, fontSize: { xs: "1.3rem", md: "1.35rem" }, lineHeight: 1.2 }}>
          {service.name}
        </Typography>
        {(service.tagline || service.short_description) && (
          <Typography sx={{ mt: 0.75, fontSize: "0.9rem", lineHeight: 1.5, color: "rgba(255, 255, 255, 0.85)" }}>
            {service.tagline || service.short_description}
          </Typography>
        )}
        {offerings.length > 0 && (
          <Box
            className="wwd-more"
            sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, maxHeight: 0, opacity: 0, overflow: "hidden", mt: 0 }}
          >
            {offerings.map((offer) => (
              <Box
                key={offer}
                component="span"
                sx={{
                  px: 1.1,
                  py: 0.35,
                  borderRadius: 999,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  backgroundColor: "rgba(216, 243, 220, 0.16)",
                  border: "1px solid rgba(216, 243, 220, 0.32)",
                }}
              >
                {offer}
              </Box>
            ))}
          </Box>
        )}
        <Box sx={{ mt: 1.75, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: GREEN.mist }}>Explore service</Typography>
          <Box
            className="wwd-arrow"
            sx={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(216, 243, 220, 0.18)",
              border: "1px solid rgba(216, 243, 220, 0.35)",
            }}
          >
            <ArrowForwardRounded sx={{ fontSize: 19 }} />
          </Box>
        </Box>
        <Box
          className="wwd-bar"
          sx={{ mt: 1.75, height: 3, width: 36, borderRadius: 99, background: `linear-gradient(90deg, ${GREEN.light}, ${GREEN.mist})` }}
        />
      </Box>
    </Box>
  );
}

const heroImages = [
  "/images/b1.jpg",
  "/images/b2.jpg",
  "/images/b3.jpg",
];

const CLIENT_INITIALS = ["JW", "AM", "PK", "NO"];

const heroEnter = (delay) => ({
  "@keyframes heroEnter": {
    from: { opacity: 0, transform: "translateY(18px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  opacity: 0,
  animation: `heroEnter 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s forwards`,
  "@media (prefers-reduced-motion: reduce)": { animation: "none", opacity: 1 },
});

function CountUp({ value, duration = 1400 }) {
  const match = String(value).match(/^(\D*)([\d,.]+)(.*)$/);
  const target = match ? Number(match[2].replace(/,/g, "")) : 0;
  const decimals = match && match[2].includes(".") ? match[2].split(".")[1].length : 0;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!match) return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setCurrent(target);
      return undefined;
    }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setCurrent(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  if (!match) return value;
  const shown = current.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${match[1]}${shown}${match[3]}`;
}

const floatSx = (delay) => ({
  "@keyframes heroFloat": {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-10px)" },
  },
  "@keyframes heroCardIn": {
    from: { opacity: 0, transform: "translateY(24px) scale(0.96)" },
    to: { opacity: 1, transform: "translateY(0) scale(1)" },
  },
  opacity: 0,
  animation: `heroCardIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s forwards, heroFloat 6s ease-in-out ${delay + 0.8}s infinite`,
  "@media (prefers-reduced-motion: reduce)": { animation: "none", opacity: 1 },
});

function Stars({ size = 16 }) {
  return (
    <Box sx={{ display: "flex", color: "#F4B942" }} aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <StarRounded key={i} sx={{ fontSize: size }} />
      ))}
    </Box>
  );
}

function HeroProofCards() {
  const [projects, counties, , yieldGain] = projectImpact;
  return (
    <Box
      aria-hidden
      sx={{
        display: { xs: "none", md: "block" },
        position: "absolute",
        inset: 0,
        zIndex: 3,
        pointerEvents: "none",
      }}
    >
      <Box
        sx={{
          ...floatSx(0.5),
          position: "absolute",
          right: { md: "3%", lg: "5%" },
          bottom: { md: "40%", lg: "42%" },
          width: 250,
          p: 2,
          borderRadius: "22px 22px 22px 6px",
          backgroundColor: "rgba(247, 244, 236, 0.94)",
          backdropFilter: "blur(14px)",
          color: GREEN.ink,
          boxShadow: "0 24px 50px rgba(15, 35, 25, 0.35)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ display: "flex" }}>
            {CLIENT_INITIALS.map((initials, i) => (
              <Box
                key={initials}
                sx={{
                  width: 32,
                  height: 32,
                  ml: i ? -1 : 0,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  border: "2px solid #F7F4EC",
                  backgroundColor: [GREEN.deep, GREEN.mid, GREEN.main, GREEN.light][i],
                }}
              >
                {initials}
              </Box>
            ))}
          </Box>
          <Box>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
              <Typography sx={{ fontWeight: 800, fontSize: "1.35rem", lineHeight: 1 }}>4.9</Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "rgba(27, 42, 34, 0.6)", fontWeight: 600 }}>/ 5</Typography>
            </Box>
            <Stars size={14} />
          </Box>
        </Box>
        <Typography sx={{ mt: 1.25, fontSize: "0.8rem", lineHeight: 1.45, color: "rgba(27, 42, 34, 0.72)" }}>
          Rated by <strong>300+ clients</strong>: farmers, schools, hotels and homeowners.
        </Typography>
      </Box>

      <Box
        sx={{
          ...floatSx(0.8),
          position: "absolute",
          right: { md: "10%", lg: "16%" },
          bottom: { md: "12%", lg: "13%" },
          width: 280,
          p: 2.25,
          borderRadius: "22px 22px 6px 22px",
          backgroundColor: "rgba(27, 67, 50, 0.82)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(216, 243, 220, 0.22)",
          color: "#FFFFFF",
          boxShadow: "0 24px 50px rgba(10, 30, 20, 0.4)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 46,
              height: 46,
              flexShrink: 0,
              borderRadius: "14px",
              display: "grid",
              placeItems: "center",
              background: `linear-gradient(135deg, ${GREEN.light}, ${GREEN.mid})`,
            }}
          >
            <TrendingUpRounded sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: "1.9rem", lineHeight: 1 }}>
              <CountUp value={yieldGain.value} />
            </Typography>
            <Typography sx={{ fontSize: "0.78rem", color: GREEN.mist, fontWeight: 600 }}>
              {yieldGain.label.toLowerCase()} for our farm clients
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            mt: 1.75,
            pt: 1.5,
            borderTop: "1px solid rgba(216, 243, 220, 0.18)",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.78rem",
            color: "rgba(255, 255, 255, 0.82)",
          }}
        >
          <span>
            <strong style={{ color: "#FFFFFF" }}><CountUp value={projects.value} /></strong> {projects.label.toLowerCase()}
          </span>
          <span>
            <strong style={{ color: "#FFFFFF" }}><CountUp value={counties.value} /></strong> counties
          </span>
        </Box>
      </Box>
    </Box>
  );
}

function HeroMobileStats() {
  const [projects, counties] = projectImpact;
  const items = [
    { value: projects.value, label: "Projects" },
    { value: counties.value, label: "Counties" },
    { value: "4.9", label: "Rating", star: true },
  ];
  return (
    <Box
      sx={{
        ...floatSx(0.6),
        display: { xs: "flex", md: "none" },
        position: "absolute",
        left: 16,
        right: 16,
        bottom: "calc(58px + env(safe-area-inset-bottom, 0px))",
        zIndex: 3,
        mx: "auto",
        maxWidth: 460,
        py: 1.25,
        borderRadius: "18px 18px 18px 6px",
        backgroundColor: "rgba(27, 67, 50, 0.78)",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(216, 243, 220, 0.22)",
        boxShadow: "0 16px 34px rgba(10, 30, 20, 0.35)",
        "@media (max-height: 620px)": { display: "none" },
      }}
    >
      {items.map((item, i) => (
        <Box
          key={item.label}
          sx={{
            flex: 1,
            textAlign: "center",
            borderLeft: i ? "1px solid rgba(216, 243, 220, 0.2)" : "none",
          }}
        >
          <Typography sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.3, fontWeight: 800, fontSize: "1.15rem", lineHeight: 1.1, color: "#FFFFFF" }}>
            <CountUp value={item.value} />
            {item.star && <StarRounded sx={{ fontSize: 16, color: "#F4B942" }} />}
          </Typography>
          <Typography sx={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: GREEN.mist }}>
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

const heroBtnBase = {
  px: { xs: 1.5, sm: 3.4 },
  py: 0,
  minHeight: { xs: 44, sm: 52 },
  fontSize: { xs: "0.8rem", sm: "0.96rem" },
  fontWeight: 700,
  letterSpacing: { xs: 0, sm: "0.01em" },
  lineHeight: 1,
  borderRadius: "999px",
  outline: "none",
  position: "relative",
  overflow: "hidden",
  flex: { xs: "1 1 0", md: "0 0 auto" },
  minWidth: 0,
  whiteSpace: "nowrap",
  backdropFilter: "blur(16px) saturate(1.35)",
  WebkitBackdropFilter: "blur(16px) saturate(1.35)",
  WebkitTapHighlightColor: "transparent",
  transition:
    "transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), background 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease, color 0.22s ease",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    borderRadius: "inherit",
    background:
      "linear-gradient(180deg, rgba(216, 243, 220, 0.2) 0%, rgba(216, 243, 220, 0) 48%)",
    pointerEvents: "none",
  },
  "& .MuiButton-endIcon": {
    ml: { xs: 0.25, sm: 0.75 },
    transition: "transform 0.22s ease",
  },
};

const heroPrimaryBtn = {
  ...heroBtnBase,
  color: GREEN.deep,
  border: "1px solid rgba(247, 244, 236, 0.9)",
  background: "linear-gradient(180deg, #FFFFFF 0%, #F7F4EC 100%)",
  boxShadow: "0 12px 28px rgba(10, 30, 20, 0.3)",
  "&::before": { display: "none" },
  "&:hover": {
    color: GREEN.deep,
    transform: "translateY(-2px)",
    background: `linear-gradient(180deg, #FFFFFF 0%, ${GREEN.mist} 100%)`,
    boxShadow: "0 18px 36px rgba(10, 30, 20, 0.36)",
    "& .MuiButton-endIcon": {
      transform: "translateX(4px)",
    },
  },
  "&:active": {
    transform: "translateY(1px)",
    boxShadow: "0 6px 14px rgba(10, 30, 20, 0.3)",
  },
  "&:focus, &:focus-visible": {
    color: GREEN.deep,
    outline: "none",
    boxShadow: `0 12px 28px rgba(10, 30, 20, 0.3), 0 0 0 3px ${GREEN.light}`,
  },
};

const heroSecondaryBtn = {
  ...heroBtnBase,
  color: "#D8F3DC",
  border: "1px solid rgba(64, 145, 108, 0.48)",
  background: "rgba(27, 67, 50, 0.16)",
  boxShadow: "inset 0 1px 0 rgba(82, 183, 136, 0.16)",
  "&:hover": {
    color: "#FFFFFF",
    transform: "translateY(-2px)",
    border: "1px solid rgba(82, 183, 136, 0.7)",
    background: "rgba(45, 106, 79, 0.34)",
    boxShadow:
      "inset 0 1px 0 rgba(183, 228, 199, 0.22), 0 10px 22px rgba(27, 67, 50, 0.18)",
  },
  "&:active": {
    color: "#FFFFFF",
    transform: "translateY(1px)",
    background: "rgba(27, 67, 50, 0.4)",
  },
  "&:focus, &:focus-visible": {
    color: "#FFFFFF",
    outline: "none",
    border: "1px solid rgba(82, 183, 136, 0.7)",
    boxShadow:
      "inset 0 1px 0 rgba(82, 183, 136, 0.16), 0 0 0 3px rgba(64, 145, 108, 0.28)",
  },
};

export default function Home() {
  const navigate = useNavigate();
  const { services = [] } = useOutletContext() || {};
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const displayServices = services.length ? services : fallbackServices;
  const whatWeDo = displayServices.map((service) => ({
    ...serviceDetails[service.slug],
    ...service,
    image: service.image || serviceDetails[service.slug]?.image,
  }));

  useEffect(() => {
    heroImages.forEach((src) => {
      const image = new Image();
      image.src = encodeURI(src);
    });
    const timer = setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroImages.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    apiGet("/api/projects?featured=true&limit=3")
      .then((res) => setProjects(res.data || []))
      .catch(() => setProjects([]));
    apiGet("/api/testimonials?status=approved&limit=3")
      .then((res) => setTestimonials(res.data || []))
      .catch(() => setTestimonials([]));
  }, []);

  return (
    <Box>
      <Helmet>
        <title>Mcaludoh Consultancy | Growing Smarter</title>
      </Helmet>
      <Box
        sx={{
          position: "relative",
          height: "100dvh",
          maxHeight: "100dvh",
          overflow: "hidden",
          color: "white",
        }}
      >
        {heroImages.map((src, index) => (
          <Box
            key={src}
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${encodeURI(src)})`,
              backgroundSize: "cover",
              backgroundPosition: { xs: "center 70%", md: "center center" },
              backgroundRepeat: "no-repeat",
              opacity: heroIndex === index ? 1 : 0,
              transition: "opacity 1.2s ease-in-out",
              zIndex: 0,
              "@keyframes heroKenBurns": {
                from: { transform: "scale(1.12)" },
                to: { transform: "scale(1)" },
              },
              animation: heroIndex === index ? "heroKenBurns 8s ease-out forwards" : "none",
              "@media (prefers-reduced-motion: reduce)": { animation: "none" },
            }}
          />
        ))}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            background:
              "linear-gradient(200deg, rgba(10, 30, 20, 0.05) 30%, rgba(10, 30, 20, 0.45) 100%)",
          }}
        />

        <HeroTreeDivider />
        <HeroProofCards />
        <HeroMobileStats />

        <Box
          sx={{
            position: "relative",
            zIndex: 3,
            height: "100%",
            display: "flex",
            alignItems: { xs: "flex-start", md: "center" },
            pl: { xs: 0, md: 2, xl: 3 },
            pr: { xs: 0, md: 0 },
            overflow: "visible",
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: "44%", lg: "42%" },
              maxWidth: { md: 620 },
              height: { xs: "64%", md: "auto" },
              maxHeight: { xs: "64%", md: "none" },
              display: "flex",
              flexDirection: "column",
              justifyContent: { xs: "center", md: "flex-start" },
              alignItems: { xs: "center", md: "flex-start" },
              boxSizing: "border-box",
              pt: { xs: "52px", md: 0 },
              px: { xs: 2, md: 0 },
              overflow: "visible",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Box
              sx={{
                width: "100%",
                overflow: "visible",
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", md: "flex-start" },
              }}
            >
              <Box
                sx={{
                  ...heroEnter(0.05),
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  mb: { xs: 1.5, md: 2.25 },
                  px: 1.5,
                  py: 0.6,
                  borderRadius: 999,
                  fontSize: { xs: "0.7rem", sm: "0.78rem" },
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  color: GREEN.mist,
                  backgroundColor: "rgba(216, 243, 220, 0.1)",
                  border: "1px solid rgba(216, 243, 220, 0.25)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: GREEN.light,
                    "@keyframes heroPulse": {
                      "0%": { boxShadow: "0 0 0 0 rgba(82, 183, 136, 0.7)" },
                      "100%": { boxShadow: "0 0 0 10px rgba(82, 183, 136, 0)" },
                    },
                    animation: "heroPulse 1.8s ease-out infinite",
                    "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                  }}
                />
                <Box component="span" sx={{ display: { xs: "inline", lg: "none" } }}>
                  Agri &amp; environmental experts
                  <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}> · Kenya</Box>
                </Box>
                <Box component="span" sx={{ display: { xs: "none", lg: "inline" } }}>
                  Agricultural &amp; environmental consultants · Kenya
                </Box>
              </Box>
              <Typography
                component="h1"
                sx={{
                  ...heroEnter(0.15),
                  mb: { xs: 1.5, md: 2.25 },
                  fontWeight: 800,
                  lineHeight: 1.08,
                  letterSpacing: "-0.035em",
                  textAlign: { xs: "center", md: "left" },
                  fontSize: {
                    xs: "clamp(1.55rem, 7.4vw, 2.5rem)",
                    md: "clamp(2rem, 3.2vw, 3.5rem)",
                  },
                  textShadow: "0 2px 18px rgba(10, 30, 20, 0.25)",
                  "& .hero-accent": {
                    background: `linear-gradient(90deg, ${GREEN.light}, #B7E4C7)`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    textShadow: "none",
                  },
                }}
              >
                {[
                  ["Growing ", "Smarter."],
                  ["Farming ", "Sustainably."],
                  ["Building ", "Better."],
                ].map(([lead, accent]) => (
                  <Box key={accent} component="span" sx={{ display: "block", whiteSpace: "nowrap" }}>
                    {lead}
                    <span className="hero-accent">{accent}</span>
                  </Box>
                ))}
              </Typography>
              <Typography
                sx={{
                  ...heroEnter(0.25),
                  mb: { xs: 2, md: 3 },
                  maxWidth: { xs: 360, sm: 500 },
                  fontSize: { xs: "0.9rem", sm: "0.98rem", lg: "1.08rem" },
                  lineHeight: 1.6,
                  color: "rgba(247, 244, 236, 0.86)",
                  "@media (max-height: 700px) and (max-width: 899px)": { display: "none" },
                }}
              >
                <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                  Farm, landscaping and environmental experts helping Kenya grow more with less.
                </Box>
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                  Hands-on experts in hydroponics, organic farming, landscaping and
                  environmental approvals. We help farms, homes, schools and businesses
                  across Kenya grow more with less.
                </Box>
              </Typography>
              <Box
                sx={{
                  ...heroEnter(0.35),
                  display: "flex",
                  flexWrap: "nowrap",
                  alignItems: "center",
                  gap: { xs: 1, sm: 2 },
                  width: { xs: "100%", md: "auto" },
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <Button
                  disableRipple
                  disableFocusRipple
                  onClick={() => navigate("/request-service")}
                  endIcon={
                    <ArrowForwardRounded
                      sx={{ fontSize: { xs: "1rem", sm: "1.15rem" } }}
                    />
                  }
                  sx={heroPrimaryBtn}
                >
                  <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                    Free consultation
                  </Box>
                  <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                    Book a free consultation
                  </Box>
                </Button>
                <Button
                  disableRipple
                  disableFocusRipple
                  onClick={() => navigate("/services")}
                  sx={heroSecondaryBtn}
                >
                  Explore services
                </Button>
              </Box>
              <Box sx={{ ...heroEnter(0.45), width: "100%" }}>
                <HeroServiceAnimations services={displayServices} />
              </Box>
          </Box>
        </Box>
      </Box>

        <Box
          component="button"
          type="button"
          onClick={() =>
            document.getElementById("what-we-do")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }
          aria-label="Scroll down"
          sx={{
            position: "absolute",
            left: "50%",
            bottom: {
              xs: "max(14px, env(safe-area-inset-bottom, 0px))",
              md: 28,
            },
            transform: "translateX(-50%)",
            zIndex: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 0,
            m: 0,
            border: 0,
            background: "transparent",
            color: "#D8F3DC",
            cursor: "pointer",
            appearance: "none",
            WebkitAppearance: "none",
            WebkitTapHighlightColor: "transparent",
            outline: "none",
            "&:hover": {
              color: "#FFFFFF",
            },
            "&:focus, &:focus-visible": {
              outline: "none",
              color: "#FFFFFF",
            },
          }}
        >
          <KeyboardArrowDownRounded
            sx={{
              fontSize: { xs: 32, sm: 36 },
              "@keyframes heroExploreBounce": {
                "0%, 100%": { transform: "translateY(0)" },
                "50%": { transform: "translateY(6px)" },
              },
              animation: "heroExploreBounce 1.6s ease-in-out infinite",
              "@media (prefers-reduced-motion: reduce)": {
                animation: "none",
              },
            }}
          />
        </Box>
      </Box>

      <Box
        id="what-we-do"
        sx={{
          position: "relative",
          overflow: "hidden",
          pt: { xs: 6, md: 9 },
          pb: { xs: 6, md: 8 },
          backgroundColor: "#F7F4EC",
          scrollMarginTop: { xs: "64px", lg: "68px" },
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: -120,
            right: -140,
            width: 420,
            height: 420,
            borderRadius: "50% 50% 0 50%",
            background: "radial-gradient(circle, rgba(82, 183, 136, 0.16), transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <Container maxWidth="xl" sx={{ position: "relative" }}>
          <Reveal>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "flex-start", md: "flex-end" },
                justifyContent: "space-between",
                gap: { xs: 2, md: 4 },
                mb: { xs: 3.5, md: 5 },
              }}
            >
              <Box sx={{ maxWidth: 640 }}>
                <Eyebrow>What we do</Eyebrow>
                <Typography
                  component="h2"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "1.9rem", sm: "2.3rem", md: "2.75rem" },
                    lineHeight: 1.12,
                    letterSpacing: "-0.03em",
                    color: GREEN.ink,
                  }}
                >
                  Seven services,{" "}
                  <Box component="span" sx={{ color: GREEN.mid }}>
                    one trusted partner
                  </Box>{" "}
                  for your land.
                </Typography>
                <Typography sx={{ mt: 1.5, color: "text.secondary", lineHeight: 1.75, fontSize: { md: "1.05rem" } }}>
                  Practical agricultural and environmental expertise for farms, homes,
                  businesses and institutions across Kenya.
                </Typography>
              </Box>
              <Button
                onClick={() => navigate("/services")}
                endIcon={<ArrowForwardRounded />}
                sx={{
                  flexShrink: 0,
                  minHeight: 50,
                  px: 3.25,
                  borderRadius: 999,
                  fontWeight: 700,
                  color: GREEN.main,
                  border: `1.5px solid ${GREEN.light}`,
                  backgroundColor: "rgba(255, 255, 255, 0.6)",
                  "& .MuiButton-endIcon": { transition: "transform 0.2s ease" },
                  "&:hover": {
                    backgroundColor: GREEN.main,
                    borderColor: GREEN.main,
                    color: "#FFFFFF",
                    "& .MuiButton-endIcon": { transform: "translateX(3px)" },
                  },
                }}
              >
                Explore all services
              </Button>
            </Box>
          </Reveal>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(12, minmax(0, 1fr))",
              },
              gap: { xs: 2, sm: 2.25, md: 2.5 },
            }}
          >
            {whatWeDo.map((service, index) => (
              <Reveal
                key={service.slug || service.name}
                delay={(index % 4) * 80}
                sx={{
                  height: "100%",
                  gridColumn: {
                    sm: index === whatWeDo.length - 1 && whatWeDo.length % 2 ? "1 / -1" : "auto",
                    md: index < 4 ? "span 3" : "span 4",
                  },
                }}
              >
                <WhatWeDoCard
                  service={service}
                  number={index + 1}
                  onOpen={() => navigate(`/services/${service.slug}`)}
                />
              </Reveal>
            ))}
          </Box>

          <Reveal>
            <Box
              sx={{
                mt: { xs: 3.5, md: 4.5 },
                p: { xs: 2.25, md: 2.5 },
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                gap: 2,
                borderRadius: "22px 22px 22px 8px",
                backgroundColor: "#FFFFFF",
                border: "1px solid rgba(27, 67, 50, 0.08)",
                boxShadow: "0 14px 34px rgba(27, 67, 50, 0.07)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    flexShrink: 0,
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: GREEN.main,
                    backgroundColor: GREEN.mist,
                  }}
                >
                  <TipsAndUpdatesOutlined />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, color: GREEN.ink }}>Not sure which service you need?</Typography>
                  <Typography sx={{ fontSize: "0.9rem", color: "text.secondary" }}>
                    Tell us about your land or project and we'll recommend the right approach.
                  </Typography>
                </Box>
              </Box>
              <Button
                onClick={() => navigate("/request-service")}
                endIcon={<ArrowForwardRounded />}
                sx={{
                  flexShrink: 0,
                  minHeight: 46,
                  px: 3,
                  borderRadius: 999,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  background: `linear-gradient(135deg, ${GREEN.mid}, ${GREEN.deep})`,
                  boxShadow: "0 10px 24px rgba(45, 106, 79, 0.3)",
                  "&:hover": { transform: "translateY(-2px)", boxShadow: "0 14px 30px rgba(45, 106, 79, 0.4)" },
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                Get free advice
              </Button>
            </Box>
          </Reveal>
        </Container>
      </Box>

      {projects.length > 0 && (
        <Box sx={{ py: 8, backgroundColor: "white" }}>
          <Container>
            <Typography variant="h4" sx={{ mb: 4 }}>
              Featured projects
            </Typography>
            <Grid container spacing={3}>
              {projects.map((project) => (
                <Grid item xs={12} md={4} key={project.id}>
                  <Card
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/projects/${project.slug}`)}
                  >
                    {project.images?.[0]?.image_url && (
                      <Box
                        component="img"
                        src={mediaUrl(project.images[0].image_url)}
                        alt={project.name}
                        sx={{ width: "100%", height: 200, objectFit: "cover" }}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h6">{project.name}</Typography>
                      <Typography color="text.secondary">
                        {project.location}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      <Box
        sx={{
          pt: { xs: 2, md: 2.5 },
          pb: { xs: 2, md: 2.5 },
          background:
            "linear-gradient(180deg, #F7F4EC 0%, #FFFFFF 48%, #F7F4EC 100%)",
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: { xs: 1.75, md: 2.25 }, maxWidth: 640, mx: "auto", textAlign: "center" }}>
            <Typography
              sx={{
                color: "#2D6A4F",
                fontWeight: 800,
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                mb: 0.75,
              }}
            >
              Keep exploring
            </Typography>
            <Typography
              variant="h5"
              sx={{ mb: 0.75, fontWeight: 800, color: "#1B2A22" }}
            >
              Explore more
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: "0.95rem", lineHeight: 1.55 }}>
              Register for training, read practical guides, browse project photos,
              or hear from clients — pick a path below.
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(4, minmax(0, 1fr))",
              },
              gap: { xs: 2, md: 2.5 },
            }}
          >
            {[
              {
                title: "Training catalogue",
                text: "Browse upcoming courses, pick a date, and register in a few steps.",
                action: "View courses",
                path: "/training",
                icon: SchoolOutlined,
                tone: "#2D6A4F",
              },
              {
                title: "Knowledge Centre",
                text: "Read practical articles on hydroponics, agronomy and sustainable farming.",
                action: "Read articles",
                path: "/blog",
                icon: MenuBookOutlined,
                tone: "#40916C",
              },
              {
                title: "Gallery",
                text: "See photos from farms, landscaping, training and completed projects.",
                action: "Open gallery",
                path: "/gallery",
                icon: PhotoLibraryOutlined,
                tone: "#1B4332",
              },
              {
                title: "Testimonials",
                text: "Hear from farmers, institutions and businesses we have worked with.",
                action: "Read stories",
                path: "/testimonials",
                icon: FormatQuoteOutlined,
                tone: "#52B788",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Box
                  key={item.path}
                  role="link"
                  tabIndex={0}
                  onClick={() => navigate(item.path)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(item.path);
                    }
                  }}
                  sx={{
                    position: "relative",
                    height: "100%",
                    minHeight: { md: 250 },
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    p: { xs: 2.25, md: 2.5 },
                    borderRadius: "22px 22px 48px 22px",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid rgba(45, 106, 79, 0.14)",
                    boxShadow: "0 8px 24px rgba(27, 67, 50, 0.06)",
                    overflow: "hidden",
                    outline: "none",
                    transition:
                      "transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.28s ease, border-color 0.22s ease",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: 4,
                      height: "100%",
                      background: `linear-gradient(180deg, ${item.tone}, #1B4332)`,
                      transform: "scaleY(0.35)",
                      transformOrigin: "top",
                      transition: "transform 0.28s ease",
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(165deg, rgba(45, 106, 79, 0.06) 0%, transparent 42%)",
                      opacity: 0,
                      transition: "opacity 0.28s ease",
                      pointerEvents: "none",
                    },
                    "&:hover, &:focus-visible": {
                      transform: "translateY(-8px)",
                      borderColor: item.tone,
                      boxShadow: "0 18px 36px rgba(27, 67, 50, 0.14)",
                      "&::before": { transform: "scaleY(1)" },
                      "&::after": { opacity: 1 },
                      "& .explore-icon": {
                        backgroundColor: item.tone,
                        color: "#FFFFFF",
                        transform: "scale(1.08)",
                      },
                      "& .explore-action": {
                        color: item.tone,
                        "& .explore-arrow": {
                          transform: "translateX(4px)",
                        },
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        color: item.tone,
                        fontWeight: 800,
                        fontSize: "0.72rem",
                        letterSpacing: "0.14em",
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </Typography>
                    <Box
                      className="explore-icon"
                      sx={{
                        width: 46,
                        height: 46,
                        borderRadius: "14px",
                        backgroundColor: "rgba(45, 106, 79, 0.1)",
                        color: item.tone,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition:
                          "transform 0.25s ease, background-color 0.25s ease, color 0.25s ease",
                      }}
                    >
                      <Icon />
                    </Box>
                  </Box>
                  <Typography
                    sx={{
                      mb: 0.85,
                      fontWeight: 800,
                      fontSize: { xs: "1.08rem", md: "1.12rem" },
                      color: "#1B2A22",
                      lineHeight: 1.25,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: "0.88rem",
                      lineHeight: 1.55,
                      mb: 2.25,
                      flex: 1,
                    }}
                  >
                    {item.text}
                  </Typography>
                  <Box
                    className="explore-action"
                    sx={{
                      mt: "auto",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.5,
                      color: "#2D6A4F",
                      fontWeight: 800,
                      fontSize: "0.86rem",
                      width: "fit-content",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {item.action}
                    <ArrowForwardRounded
                      className="explore-arrow"
                      sx={{
                        fontSize: 18,
                        transition: "transform 0.22s ease",
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>

      <Box sx={{ backgroundColor: "#F7F4EC", py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "flex-end" },
              justifyContent: "space-between",
              gap: 2,
              mb: { xs: 3, md: 4 },
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "#2D6A4F",
                  fontWeight: 800,
                  fontSize: "0.72rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  mb: 1,
                }}
              >
                Client stories
              </Typography>
              <Typography
                component="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.7rem", md: "2.2rem" },
                  letterSpacing: "-0.02em",
                  color: "#1B2A22",
                }}
              >
                What clients say
              </Typography>
            </Box>
            <Button
              onClick={() => navigate("/testimonials")}
              endIcon={<ArrowForwardRounded />}
              sx={{
                flexShrink: 0,
                px: 2.5,
                minHeight: 44,
                borderRadius: 999,
                fontWeight: 700,
                color: "#1B4332",
                border: "1px solid rgba(27, 67, 50, 0.2)",
                "&:hover": { backgroundColor: "#D8F3DC" },
              }}
            >
              All testimonials
            </Button>
          </Box>
          <Box
            sx={{
              display: "grid",
              gap: { xs: 2, md: 3 },
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            }}
          >
            {(testimonials.length ? testimonials : fallbackTestimonials.slice(0, 3)).map((item) => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

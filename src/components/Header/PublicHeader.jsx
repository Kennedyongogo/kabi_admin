import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const NAVBAR_HEIGHT = { xs: 52, lg: 56 };

const navItems = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Services", path: "/services", children: true },
  { label: "Projects", path: "/projects" },
  { label: "Training", path: "/training" },
  { label: "Knowledge Centre", path: "/blog" },
  { label: "Gallery", path: "/gallery" },
  { label: "Testimonials", path: "/testimonials" },
  { label: "Contact", path: "/contact" },
];

const isActivePath = (item, pathname) => {
  if (item.path === "/") return pathname === "/";
  return pathname === item.path || pathname.startsWith(`${item.path}/`);
};

const navLinkSx = (active) => ({
  position: "relative",
  color: "#FFFFFF",
  fontWeight: active ? 700 : 600,
  fontSize: { lg: "0.78rem", xl: "0.875rem" },
  lineHeight: 1.2,
  whiteSpace: "nowrap",
  minWidth: 0,
  minHeight: 0,
  px: { lg: 0.85, xl: 1.25 },
  py: 0.75,
  flexShrink: 0,
  overflow: "visible",
  backgroundColor: "transparent",
  "&::after": {
    content: '""',
    position: "absolute",
    left: "50%",
    bottom: 2,
    width: "72%",
    height: 2,
    borderRadius: 99,
    background: "linear-gradient(90deg, #FFFFFF, #40916C)",
    transform: active
      ? "translateX(-50%) scaleX(1)"
      : "translateX(-50%) scaleX(0)",
    transformOrigin: "center",
    transition: "transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)",
  },
  "&:hover": {
    backgroundColor: "transparent",
    color: "#FFFFFF",
    "&::after": {
      transform: "translateX(-50%) scaleX(1)",
    },
  },
  "&:active": {
    backgroundColor: "transparent",
  },
  "&:focus, &:focus-visible": {
    backgroundColor: "transparent",
    outline: "none",
  },
});

function MenuToggle({ open, onClick, overHero }) {
  const bar = {
    display: "block",
    width: 20,
    height: 2,
    borderRadius: 99,
    backgroundColor: "currentColor",
    transition: "transform 0.28s ease, opacity 0.2s ease",
  };

  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      sx={{
        display: { xs: "inline-flex", lg: "none" },
        ml: "auto",
        color: "#FFFFFF",
        width: 40,
        height: 40,
        p: 0,
        border: 0,
        background: "transparent",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
        WebkitAppearance: "none",
        appearance: "none",
        outline: "none",
        boxShadow: "none",
        "&:hover, &:focus, &:focus-visible, &:active": {
          background: "transparent",
          outline: "none",
          boxShadow: "none",
        },
      }}
    >
      <Box
        sx={{
          width: 20,
          height: 14,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            ...bar,
            transform: open ? "translateY(6px) rotate(45deg)" : "none",
          }}
        />
        <Box sx={{ ...bar, opacity: open ? 0 : 1 }} />
        <Box
          sx={{
            ...bar,
            transform: open ? "translateY(-6px) rotate(-45deg)" : "none",
          }}
        />
      </Box>
    </Box>
  );
}

export default function PublicHeader({ services = [] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesAnchor, setServicesAnchor] = useState(null);
  const overHero = location.pathname === "/" && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const go = (path) => {
    navigate(path);
    setMobileOpen(false);
    setServicesAnchor(null);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: overHero ? "transparent" : "#1B4332",
          backdropFilter: overHero ? "none" : "blur(16px)",
          boxShadow: overHero ? "none" : "0 8px 24px rgba(27, 67, 50, 0.28)",
          borderBottom: overHero ? "none" : "1px solid rgba(64, 145, 108, 0.35)",
          transition:
            "background-color 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease",
        }}
      >
        <Toolbar
          sx={{
            px: { xs: 1.5, md: 2, xl: 3 },
            minHeight: { xs: NAVBAR_HEIGHT.xs, lg: NAVBAR_HEIGHT.lg },
            height: { xs: NAVBAR_HEIGHT.xs, lg: NAVBAR_HEIGHT.lg },
            gap: 1,
            flexWrap: "nowrap",
            overflow: "visible",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              flexShrink: 0,
            }}
            onClick={() => go("/")}
          >
            <Box
              component="img"
              src={encodeURI("/images/logo (1).png")}
              alt="Mcaludoh Consultancy"
              sx={{
                height: { xs: 36, lg: 42 },
                width: { xs: 36, lg: 42 },
                objectFit: "contain",
                borderRadius: "8px",
                flexShrink: 0,
                display: "block",
              }}
            />
            <Typography
              noWrap
              sx={{
                fontWeight: 800,
                fontSize: { xs: "0.95rem", lg: "1rem", xl: "1.15rem" },
                color: "#FFFFFF",
                lineHeight: 1.2,
              }}
            >
              Mcaludoh Consultancy
            </Typography>
          </Box>

          <Box
            sx={{
              display: { xs: "none", lg: "flex" },
              alignItems: "center",
              justifyContent: "flex-end",
              flexWrap: "nowrap",
              flexGrow: 1,
              minWidth: 0,
              gap: { lg: 0, xl: 0.25 },
              ml: 1,
            }}
          >
            {navItems.map((item) => {
              const active = isActivePath(item, location.pathname);
              return item.children ? (
                <Button
                  key={item.label}
                  disableRipple
                  disableFocusRipple
                  onClick={(e) => setServicesAnchor(e.currentTarget)}
                  endIcon={<ExpandMore sx={{ fontSize: "1rem !important" }} />}
                  sx={navLinkSx(active)}
                >
                  {item.label}
                </Button>
              ) : (
                <Button
                  key={item.label}
                  disableRipple
                  disableFocusRipple
                  onClick={() => go(item.path)}
                  sx={navLinkSx(active)}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          <Button
            variant="contained"
            onClick={() => go("/request-service")}
            sx={{
              display: { xs: "none", lg: "inline-flex" },
              borderRadius: "999px",
              px: { lg: 1.5, xl: 2.25 },
              py: 0.5,
              ml: 0.5,
              flexShrink: 0,
              whiteSpace: "nowrap",
              fontSize: { lg: "0.78rem", xl: "0.875rem" },
              background: "#FFFFFF",
              color: "#1B4332",
              border: "none",
              boxShadow: "none",
              "&:hover": {
                background: "#FFFFFF",
                color: "#1B4332",
                boxShadow: "none",
              },
            }}
          >
            Request a Service
          </Button>

          <MenuToggle
            open={mobileOpen}
            overHero={overHero}
            onClick={() => setMobileOpen((prev) => !prev)}
          />
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={servicesAnchor}
        open={Boolean(servicesAnchor)}
        onClose={() => setServicesAnchor(null)}
      >
        <MenuItem onClick={() => go("/services")}>All Services</MenuItem>
        {services.map((service) => (
          <MenuItem
            key={service.id || service.slug}
            onClick={() => go(`/services/${service.slug}`)}
          >
            {service.name}
          </MenuItem>
        ))}
      </Menu>

      <Box
        onClick={() => setMobileOpen(false)}
        sx={{
          display: { xs: "block", lg: "none" },
          position: "fixed",
          top: NAVBAR_HEIGHT.xs,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1200,
          backgroundColor: "rgba(27, 42, 34, 0.28)",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
          transition: "opacity 0.22s ease",
        }}
      />

      <Box
        sx={{
          display: { xs: "block", lg: "none" },
          position: "fixed",
          top: NAVBAR_HEIGHT.xs + 4,
          left: { xs: 28, sm: 48 },
          right: { xs: 28, sm: 48 },
          zIndex: 1201,
          maxHeight: `calc(100dvh - ${NAVBAR_HEIGHT.xs + 12}px)`,
          overflow: "hidden",
          borderRadius: "18px",
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          boxShadow: "0 16px 40px rgba(27, 67, 50, 0.16)",
          border: "1px solid rgba(45, 106, 79, 0.1)",
          transform: mobileOpen ? "translateY(0)" : "translateY(-10px)",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
          transition:
            "opacity 0.22s ease, transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <Box
          sx={{
            p: 1.25,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            maxHeight: `calc(100dvh - ${NAVBAR_HEIGHT.xs + 12}px)`,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
            }}
          >
            {navItems.map((item) => {
              const active = isActivePath(item, location.pathname);
              return (
                <Box
                  key={item.label}
                  onClick={() => go(item.path)}
                  sx={{
                    position: "relative",
                    px: 1.5,
                    py: 0.85,
                    borderRadius: "12px",
                    cursor: "pointer",
                    backgroundColor: active
                      ? "rgba(45, 106, 79, 0.08)"
                      : "rgba(247, 244, 236, 0.9)",
                    color: active ? "primary.main" : "text.primary",
                    transition: "background-color 0.2s ease, color 0.2s ease",
                    "&:active": {
                      backgroundColor: "rgba(45, 106, 79, 0.12)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.88rem",
                      fontWeight: active ? 700 : 600,
                      lineHeight: 1.2,
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Box
                    sx={{
                      position: "absolute",
                      left: 16,
                      width: 28,
                      bottom: 5,
                      height: 2,
                      borderRadius: 99,
                      background: "linear-gradient(90deg, #2D6A4F, #40916C)",
                      transform: active ? "scaleX(1)" : "scaleX(0)",
                      transformOrigin: "left",
                      transition: "transform 0.25s ease",
                    }}
                  />
                </Box>
              );
            })}
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={() => go("/request-service")}
            sx={{
              borderRadius: "12px",
              py: 1.1,
              fontSize: "0.85rem",
              background: "linear-gradient(45deg, #2D6A4F, #1B4332)",
              boxShadow: "none",
            }}
          >
            Request a Service
          </Button>
        </Box>
      </Box>

      {location.pathname !== "/" && (
        <Toolbar
          sx={{
            minHeight: { xs: NAVBAR_HEIGHT.xs, lg: NAVBAR_HEIGHT.lg },
            height: { xs: NAVBAR_HEIGHT.xs, lg: NAVBAR_HEIGHT.lg },
          }}
        />
      )}
    </>
  );
}

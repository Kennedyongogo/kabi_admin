import React from "react";
import { Box, Container, Typography, Stack, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const MAIZE = "#40916C";

function FooterPlantSketches() {
  return (
    <Box
      component="svg"
      viewBox="0 0 1400 320"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      sx={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <g
        fill="none"
        stroke="#F7F4EC"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.2"
      >
        {[
          [40, 210, 1],
          [160, 70, 0.85],
          [280, 240, 1.05],
          [420, 50, 0.75],
          [540, 200, 1.1],
          [680, 90, 0.9],
          [820, 230, 1],
          [960, 40, 0.8],
          [1080, 190, 1.05],
          [1220, 80, 0.85],
          [1320, 250, 0.95],
          [90, 30, 0.7],
          [350, 140, 0.8],
          [730, 270, 0.75],
          [1010, 130, 0.9],
          [1180, 280, 0.7],
        ].map(([x, y, scale], i) => (
          <g
            key={`${x}-${y}`}
            transform={`translate(${x} ${y}) scale(${scale})`}
          >
            {i % 4 === 0 && (
              <>
                <path d="M0 28 C0 8 -2 -8 1 -22" strokeWidth="1.3" />
                <path d="M1 -2 C-14 -8 -16 -18 -6 -14" strokeWidth="1.2" />
                <path d="M1 -6 C16 -12 18 -22 7 -16" strokeWidth="1.2" />
                <path d="M0 6 C-10 2 -9 -6 -2 -2" strokeWidth="1.1" />
              </>
            )}
            {i % 4 === 1 && (
              <>
                <path d="M0 24 Q-4 -4 1 -20" strokeWidth="1.2" />
                <path d="M0 24 Q6 0 8 -16" strokeWidth="1.15" />
                <path d="M0 24 Q-8 6 -10 -8" strokeWidth="1.1" />
                <path d="M0 24 Q10 8 12 -4" strokeWidth="1.05" />
              </>
            )}
            {i % 4 === 2 && (
              <>
                <path
                  d="M0 20 C-12 4 -8 -16 6 -22 C16 -6 14 12 0 20"
                  strokeWidth="1.2"
                />
                <path d="M0 20 L5 -10" strokeWidth="1" />
              </>
            )}
            {i % 4 === 3 && (
              <>
                <path d="M0 22 C2 4 8 -10 18 -16" strokeWidth="1.2" />
                <path d="M8 -4 C4 -16 12 -22 16 -12" strokeWidth="1.1" />
                <path d="M6 4 C-4 -6 -2 -16 6 -10" strokeWidth="1.1" />
                <path d="M0 22 C-2 8 -8 -2 -14 -6" strokeWidth="1.1" />
              </>
            )}
          </g>
        ))}
      </g>
    </Box>
  );
}

function socialHref(value, base) {
  if (!value) return base;
  if (/^https?:\/\//i.test(value)) return value;
  const handle = String(value).replace(/^@/, "").replace(/^\//, "");
  return `${base.replace(/\/$/, "")}/${handle}`;
}

export default function Footer({ settings }) {
  const navigate = useNavigate();
  const whatsappNumber = String(
    settings?.whatsapp || settings?.phone || "254700000000"
  ).replace(/\D/g, "");

  const socials = [
    {
      label: "Facebook",
      href: socialHref(settings?.facebook, "https://www.facebook.com"),
      Icon: FacebookIcon,
      hover: "#1877F2",
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/${whatsappNumber}`,
      Icon: WhatsAppIcon,
      hover: "#25D366",
    },
    {
      label: "Instagram",
      href: socialHref(settings?.instagram, "https://www.instagram.com"),
      Icon: InstagramIcon,
      hover: "#E4405F",
    },
    {
      label: "LinkedIn",
      href: socialHref(settings?.linkedin, "https://www.linkedin.com"),
      Icon: LinkedInIcon,
      hover: "#0A66C2",
    },
  ];

  return (
    <Box
      sx={{
        mt: 0,
        py: { xs: 3, md: 3.5 },
        backgroundColor: "#1B4332",
        color: "white",
        borderTop: `3px solid ${MAIZE}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <FooterPlantSketches />
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "minmax(0, 1.5fr) minmax(0, 1fr) auto",
            },
            gap: { xs: 2.5, md: 4 },
            alignItems: "start",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                mb: 0.75,
              }}
            >
              <Box
                component="img"
                src={encodeURI("/images/logo (1).png")}
                alt=""
                sx={{
                  height: 40,
                  width: 40,
                  objectFit: "contain",
                  borderRadius: "8px",
                  flexShrink: 0,
                }}
              />
              <Typography variant="h6" sx={{ lineHeight: 1.2, color: MAIZE }}>
                {settings?.company_name || "Mcaludoh Consultancy"}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.85, maxWidth: 380 }}>
              {settings?.footer_text ||
                "Professional solutions in hydroponics, vertical farming, organic agriculture, agronomy, landscaping, training and environmental services."}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="subtitle1"
              sx={{ mb: 1, fontWeight: 700, color: MAIZE }}
            >
              Explore
            </Typography>
            <Stack spacing={0.6}>
              {[
                ["Services", "/services"],
                ["Projects", "/projects"],
                ["Training", "/training"],
                ["Knowledge Centre", "/blog"],
                ["Contact", "/contact"],
              ].map(([label, path]) => (
                <Typography
                  key={path}
                  variant="body2"
                  sx={{
                    cursor: "pointer",
                    opacity: 0.9,
                    transition: "color 0.2s ease",
                    "&:hover": { color: MAIZE, opacity: 1 },
                  }}
                  onClick={() => navigate(path)}
                >
                  {label}
                </Typography>
              ))}
            </Stack>
          </Box>

          <Box
            sx={{
              justifySelf: { xs: "stretch", md: "end" },
              textAlign: { xs: "left", md: "right" },
              width: { xs: "100%", md: "max-content" },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ mb: 1, fontWeight: 700, color: MAIZE }}
            >
              Get in touch
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              {settings?.phone || "+254 700 000000"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              {settings?.email || "info@mcaludoh.co.ke"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, mb: 1.5 }}>
              {settings?.address || "Nairobi, Kenya"}
            </Typography>
            <Stack
              direction="row"
              useFlexGap
              flexWrap="nowrap"
              justifyContent={{ xs: "space-between", md: "flex-end" }}
              sx={{
                width: { xs: "100%", md: "auto" },
                gap: { md: 1.25 },
              }}
            >
              {socials.map(({ label, href, Icon, hover }) => (
                <Tooltip
                  key={label}
                  title={label}
                  arrow
                  slotProps={{
                    tooltip: {
                      sx: {
                        bgcolor: "#2D6A4F",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                      },
                    },
                    arrow: { sx: { color: "#2D6A4F" } },
                  }}
                >
                  <Box
                    component="a"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#D8F3DC",
                      background: "rgba(64, 145, 108, 0.18)",
                      border: "1px solid rgba(82, 183, 136, 0.45)",
                      boxShadow: "inset 0 1px 0 rgba(183, 228, 199, 0.16)",
                      transition:
                        "transform 0.2s ease, background 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        color: "#FFFFFF",
                        background: hover,
                        borderColor: hover,
                        transform: "translateY(-3px)",
                        boxShadow: `0 8px 18px ${hover}55`,
                      },
                      "&:focus, &:focus-visible": {
                        outline: "none",
                        boxShadow: `0 0 0 3px ${hover}55`,
                      },
                    }}
                  >
                    <Icon sx={{ fontSize: 20 }} />
                  </Box>
                </Tooltip>
              ))}
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

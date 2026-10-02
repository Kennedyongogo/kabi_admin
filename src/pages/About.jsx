import React, { useEffect, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  ArrowForwardRounded,
  HandymanOutlined,
  SpaOutlined,
  SchoolOutlined,
  HandshakeOutlined,
  GroupsOutlined,
  PlaceOutlined,
  FormatQuoteRounded,
  VisibilityOutlined,
  FlagOutlined,
} from "@mui/icons-material";
import { aboutContent, fallbackServices } from "../data/siteContent";
import { ICONS, GenericIcon } from "../components/HeroServiceAnimations";
import { GREEN, Reveal, Eyebrow, SectionHeading } from "../components/PageSections";

const heroImages = ["/images/b1.jpg", "/images/b2.jpg", "/images/b3.jpg"];

const valueIcons = [
  HandymanOutlined,
  SpaOutlined,
  SchoolOutlined,
  HandshakeOutlined,
];

const pillButton = {
  px: 3,
  minHeight: 48,
  borderRadius: "999px",
  fontWeight: 700,
  fontSize: "0.95rem",
  WebkitTapHighlightColor: "transparent",
  transition:
    "transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.22s ease, box-shadow 0.22s ease",
  "& .MuiButton-endIcon": { transition: "transform 0.22s ease" },
  "&:hover": {
    transform: "translateY(-2px)",
    "& .MuiButton-endIcon": { transform: "translateX(3px)" },
  },
};

const solidButton = {
  ...pillButton,
  color: GREEN.deep,
  backgroundColor: "#FFFFFF",
  boxShadow: "0 10px 24px rgba(0, 0, 0, 0.18)",
  "&:hover": {
    ...pillButton["&:hover"],
    backgroundColor: GREEN.cream,
    boxShadow: "0 14px 30px rgba(0, 0, 0, 0.22)",
  },
};

const glassButton = {
  ...pillButton,
  color: "#FFFFFF",
  border: "1px solid rgba(216, 243, 220, 0.45)",
  backgroundColor: "rgba(216, 243, 220, 0.08)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  "&:hover": {
    ...pillButton["&:hover"],
    backgroundColor: "rgba(216, 243, 220, 0.18)",
  },
};

function FounderPortrait({ src, name, role }) {
  const [failed, setFailed] = useState(false);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 420,
        mx: "auto",
        aspectRatio: "4 / 5",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          transform: "translate(16px, 16px)",
          borderRadius: "0 0 110px 0",
          border: `2px solid ${GREEN.light}`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: -18,
          left: -18,
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${GREEN.light}55 0%, transparent 70%)`,
        }}
      />
      <Box
        sx={{
          position: "relative",
          height: "100%",
          borderRadius: "0 0 110px 0",
          overflow: "hidden",
          background: `linear-gradient(160deg, ${GREEN.deep} 0%, ${GREEN.main} 60%, ${GREEN.mid} 100%)`,
          boxShadow: "0 24px 50px rgba(27, 67, 50, 0.25)",
        }}
      >
        {!failed ? (
          <Box
            component="img"
            src={src}
            alt={`${name}, founder of Mcaludoh Consultancy`}
            onError={() => setFailed(true)}
            sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
            }}
          >
            <Box
              sx={{
                width: 140,
                height: 140,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "3.8rem",
                fontWeight: 800,
                background: "rgba(216, 243, 220, 0.12)",
                border: "2px solid rgba(216, 243, 220, 0.4)",
              }}
            >
              {name.charAt(0)}
            </Box>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          position: "absolute",
          left: { xs: 12, sm: -20 },
          bottom: 28,
          px: 2,
          py: 1.25,
          borderRadius: "16px",
          backgroundColor: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: "0 14px 30px rgba(27, 67, 50, 0.18)",
          border: "1px solid rgba(45, 106, 79, 0.12)",
        }}
      >
        <Typography sx={{ fontWeight: 800, color: GREEN.ink, lineHeight: 1.2 }}>
          {name}
        </Typography>
        <Typography sx={{ fontSize: "0.8rem", color: GREEN.main, fontWeight: 700 }}>
          {role}
        </Typography>
      </Box>
    </Box>
  );
}

export default function About() {
  const navigate = useNavigate();
  const { services = [], settings } = useOutletContext() || {};
  const displayServices = services.length ? services : fallbackServices;
  const { founder, values, process, vision, mission } = aboutContent;
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setHeroIndex((current) => (current + 1) % heroImages.length),
      6000
    );
    return () => clearInterval(timer);
  }, []);

  const facts = [
    {
      icon: SpaOutlined,
      title: `${displayServices.length} specialist services`,
      text: "From hydroponics to EIA",
    },
    {
      icon: HandymanOutlined,
      title: "Design, install & train",
      text: "One team, start to harvest",
    },
    {
      icon: GroupsOutlined,
      title: "Farmers to institutions",
      text: "Projects of every size",
    },
    {
      icon: PlaceOutlined,
      title: settings?.address || "Nairobi, Kenya",
      text: "Available for site visits",
    },
  ];

  return (
    <Box sx={{ backgroundColor: GREEN.cream, overflowX: "hidden" }}>
      <Helmet>
        <title>About Us | Mcaludoh Consultancy</title>
        <meta
          name="description"
          content={`Meet ${founder.name}, founder of Mcaludoh Consultancy — practical agricultural and environmental expertise for farmers, businesses and institutions.`}
        />
      </Helmet>

      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          color: "#FFFFFF",
          background: `linear-gradient(160deg, ${GREEN.deep} 0%, ${GREEN.main} 62%, #245C43 100%)`,
          pb: { xs: 10, md: 12 },
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${GREEN.light}40 0%, transparent 70%)`,
          }}
        />
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            bottom: -160,
            left: -120,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${GREEN.mid}33 0%, transparent 70%)`,
          }}
        />

        <Container
          maxWidth="xl"
          sx={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
            alignItems: "center",
            gap: { xs: 4, md: 7 },
            pt: { xs: 5, md: 8 },
          }}
        >
          <Reveal>
            <Eyebrow light>About Mcaludoh Consultancy</Eyebrow>
            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                fontSize: { xs: "2rem", sm: "2.6rem", md: "3.2rem" },
                mb: 2.25,
              }}
            >
              Rooted in practical farming.{" "}
              <Box
                component="span"
                sx={{
                  background: `linear-gradient(90deg, ${GREEN.mist}, ${GREEN.light})`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Built for lasting harvests.
              </Box>
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.1rem" },
                lineHeight: 1.7,
                opacity: 0.88,
                maxWidth: 540,
                mb: 3.5,
              }}
            >
              We help farmers, businesses and institutions design, install and
              manage productive agricultural systems — then train their teams so
              the results keep growing long after we leave the site.
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              <Button
                disableRipple
                onClick={() => navigate("/request-service")}
                endIcon={<ArrowForwardRounded />}
                sx={solidButton}
              >
                Work with us
              </Button>
              <Button
                disableRipple
                onClick={() =>
                  document
                    .getElementById("founder")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                sx={glassButton}
              >
                Meet {founder.name}
              </Button>
            </Box>
          </Reveal>

          <Reveal delay={150}>
            <Box sx={{ position: "relative" }}>
              <Box
                sx={{
                  position: "relative",
                  height: { xs: 260, sm: 340, md: 440 },
                  borderRadius: "0 0 130px 0",
                  overflow: "hidden",
                  boxShadow: "0 28px 60px rgba(0, 0, 0, 0.3)",
                }}
              >
                {heroImages.map((src, index) => (
                  <Box
                    key={src}
                    sx={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `url(${src})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      opacity: heroIndex === index ? 1 : 0,
                      transform: heroIndex === index ? "scale(1.04)" : "scale(1)",
                      transition: "opacity 1.2s ease-in-out, transform 6s ease-out",
                    }}
                  />
                ))}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, transparent 55%, rgba(27, 67, 50, 0.55) 100%)",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    left: 22,
                    bottom: 20,
                    display: "flex",
                    gap: 0.75,
                  }}
                >
                  {heroImages.map((src, index) => (
                    <Box
                      key={src}
                      component="button"
                      type="button"
                      aria-label={`Show photo ${index + 1}`}
                      onClick={() => setHeroIndex(index)}
                      sx={{
                        width: heroIndex === index ? 26 : 8,
                        height: 8,
                        p: 0,
                        border: 0,
                        borderRadius: 99,
                        cursor: "pointer",
                        backgroundColor:
                          heroIndex === index ? "#FFFFFF" : "rgba(255, 255, 255, 0.5)",
                        transition: "width 0.3s ease, background-color 0.3s ease",
                      }}
                    />
                  ))}
                </Box>
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  left: { xs: 14, md: -28 },
                  top: { xs: 14, md: 36 },
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  px: 1.75,
                  py: 1.25,
                  borderRadius: "16px",
                  color: GREEN.ink,
                  backgroundColor: "rgba(255, 255, 255, 0.92)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  boxShadow: "0 16px 34px rgba(0, 0, 0, 0.2)",
                  "@keyframes aboutFloat": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-6px)" },
                  },
                  animation: "aboutFloat 5s ease-in-out infinite",
                  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    background: `linear-gradient(160deg, ${GREEN.mid}, ${GREEN.deep})`,
                  }}
                >
                  {founder.name.charAt(0)}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "0.72rem", color: "text.secondary", fontWeight: 600 }}>
                    Founded by
                  </Typography>
                  <Typography sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                    {founder.name}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Reveal>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", mt: { xs: -7, md: -8 }, zIndex: 2 }}>
        <Reveal>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                md: "repeat(4, minmax(0, 1fr))",
              },
              borderRadius: "24px",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 20px 50px rgba(27, 67, 50, 0.14)",
              border: "1px solid rgba(45, 106, 79, 0.08)",
              overflow: "hidden",
            }}
          >
            {facts.map(({ icon: Icon, title, text }, index) => (
              <Box
                key={title}
                sx={{
                  display: "flex",
                  alignItems: { xs: "flex-start", sm: "center" },
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 1.5,
                  p: { xs: 2.25, md: 2.75 },
                  borderRight: {
                    xs: index % 2 === 0 ? "1px solid rgba(45, 106, 79, 0.08)" : "none",
                    md: index < 3 ? "1px solid rgba(45, 106, 79, 0.08)" : "none",
                  },
                  borderBottom: {
                    xs: index < 2 ? "1px solid rgba(45, 106, 79, 0.08)" : "none",
                    md: "none",
                  },
                }}
              >
                <Box
                  sx={{
                    flexShrink: 0,
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: GREEN.main,
                    backgroundColor: "rgba(64, 145, 108, 0.12)",
                  }}
                >
                  <Icon />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{ fontWeight: 800, color: GREEN.ink, fontSize: "0.95rem", lineHeight: 1.3 }}
                  >
                    {title}
                  </Typography>
                  <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                    {text}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Reveal>
      </Container>

      <Box
        id="founder"
        sx={{ py: { xs: 7, md: 10 }, scrollMarginTop: { xs: "56px", lg: "60px" } }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "0.85fr 1.15fr" },
            gap: { xs: 6, md: 8 },
            alignItems: "center",
          }}
        >
          <Reveal>
            <FounderPortrait src={founder.photo} name={founder.name} role={founder.role} />
          </Reveal>
          <Reveal delay={120}>
            <Eyebrow>Meet the founder</Eyebrow>
            <Typography
              component="h2"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.9rem", md: "2.5rem" },
                letterSpacing: "-0.02em",
                color: GREEN.ink,
                lineHeight: 1.15,
                mb: 2.5,
              }}
            >
              The person behind every recommendation
            </Typography>
            {founder.bio.map((paragraph) => (
              <Typography
                key={paragraph}
                color="text.secondary"
                sx={{ fontSize: "1.02rem", lineHeight: 1.8, mb: 2 }}
              >
                {paragraph}
              </Typography>
            ))}

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2.5, mb: 3.5 }}>
              {displayServices.map((service) => (
                <Box
                  key={service.slug || service.name}
                  sx={{
                    px: 1.5,
                    py: 0.6,
                    borderRadius: "999px",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: GREEN.main,
                    backgroundColor: "rgba(64, 145, 108, 0.1)",
                    border: "1px solid rgba(64, 145, 108, 0.2)",
                  }}
                >
                  {service.name}
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                position: "relative",
                p: { xs: 2.5, md: 3 },
                pl: { xs: 7, md: 8 },
                borderRadius: "0 0 48px 0",
                color: "#FFFFFF",
                background: `linear-gradient(160deg, ${GREEN.main} 0%, ${GREEN.deep} 100%)`,
                boxShadow: "0 16px 34px rgba(27, 67, 50, 0.2)",
              }}
            >
              <FormatQuoteRounded
                sx={{
                  position: "absolute",
                  left: { xs: 16, md: 20 },
                  top: { xs: 18, md: 22 },
                  fontSize: { xs: 38, md: 44 },
                  color: GREEN.light,
                }}
              />
              <Typography
                sx={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: GREEN.mist, mb: 0.75 }}
              >
                Our promise
              </Typography>
              <Typography sx={{ fontSize: { xs: "1.05rem", md: "1.2rem" }, fontWeight: 700, lineHeight: 1.5 }}>
                Advice that leaves every client more capable, not more dependent.
              </Typography>
            </Box>
          </Reveal>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 7, md: 10 }, backgroundColor: "#FFFFFF" }}>
        <Container maxWidth="xl">
          <Reveal>
            <SectionHeading
              eyebrow="What we stand for"
              title="The values behind every project"
              subtitle="Four commitments that shape how we plan, build and support every client."
            />
          </Reveal>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "1.15fr 1fr 1fr",
              },
              gridAutoRows: { md: "minmax(220px, auto)" },
              gap: 2.5,
            }}
          >
            {values.map((value, index) => {
              const Icon = valueIcons[index % valueIcons.length];
              const featured = index === 0;
              const wide = index === values.length - 1;
              return (
                <Reveal
                  key={value.title}
                  delay={index * 90}
                  sx={{
                    gridRow: { md: featured ? "span 2" : "auto" },
                    gridColumn: {
                      sm: featured ? "span 2" : "auto",
                      md: featured ? "auto" : wide ? "span 2" : "auto",
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      height: "100%",
                      minHeight: featured ? { xs: 300, md: "100%" } : "auto",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: featured ? "flex-end" : "flex-start",
                      p: { xs: 3, md: 3.5 },
                      borderRadius: "24px 24px 64px 24px",
                      overflow: "hidden",
                      color: featured ? "#FFFFFF" : GREEN.ink,
                      backgroundColor: featured ? GREEN.deep : GREEN.cream,
                      backgroundImage: featured
                        ? `linear-gradient(180deg, rgba(27, 67, 50, 0.15) 0%, rgba(27, 67, 50, 0.92) 78%), url(/images/b1.jpg)`
                        : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      border: featured ? "none" : "1px solid rgba(45, 106, 79, 0.1)",
                      transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 20px 40px rgba(27, 67, 50, 0.16)",
                        "& .value-icon": { transform: "rotate(-8deg) scale(1.08)" },
                      },
                    }}
                  >
                    <Box
                      className="value-icon"
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#FFFFFF",
                        background: featured
                          ? "rgba(216, 243, 220, 0.18)"
                          : `linear-gradient(160deg, ${GREEN.mid}, ${GREEN.deep})`,
                        border: featured ? "1px solid rgba(216, 243, 220, 0.35)" : "none",
                        backdropFilter: featured ? "blur(10px)" : "none",
                        mb: 2,
                        transition: "transform 0.3s ease",
                      }}
                    >
                      <Icon />
                    </Box>
                    <Typography
                      sx={{ fontWeight: 800, fontSize: featured ? { xs: "1.35rem", md: "1.6rem" } : "1.15rem", mb: 1 }}
                    >
                      {value.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: featured ? "1rem" : "0.94rem",
                        lineHeight: 1.65,
                        color: featured ? "rgba(255, 255, 255, 0.88)" : "text.secondary",
                        maxWidth: wide ? 560 : "none",
                      }}
                    >
                      {value.text}
                    </Typography>
                  </Box>
                </Reveal>
              );
            })}
          </Box>
        </Container>
      </Box>

      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          py: { xs: 7, md: 10 },
          color: "#FFFFFF",
          background: `linear-gradient(160deg, ${GREEN.deep} 0%, ${GREEN.main} 100%)`,
        }}
      >
        <Container maxWidth="xl">
          <Reveal>
            <SectionHeading
              light
              eyebrow="How we work"
              title="From first visit to full harvest"
              subtitle="A clear, four-step path so you always know what happens next."
            />
          </Reveal>
          <Box
            sx={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(4, minmax(0, 1fr))" },
              gap: { xs: 3, md: 3 },
              "&::before": {
                content: '""',
                position: "absolute",
                top: { xs: 28, md: 28 },
                bottom: { xs: 28, md: "auto" },
                left: { xs: 27, md: "12.5%" },
                right: { xs: "auto", md: "12.5%" },
                width: { xs: 2, md: "auto" },
                height: { xs: "auto", md: 2 },
                backgroundImage: {
                  xs: `linear-gradient(180deg, ${GREEN.light} 50%, transparent 50%)`,
                  md: `linear-gradient(90deg, ${GREEN.light} 50%, transparent 50%)`,
                },
                backgroundSize: { xs: "2px 12px", md: "12px 2px" },
                opacity: 0.6,
              },
            }}
          >
            {process.map((step, index) => (
              <Reveal key={step.title} delay={index * 120}>
                <Box
                  sx={{
                    position: "relative",
                    display: "flex",
                    flexDirection: { xs: "row", md: "column" },
                    alignItems: { xs: "flex-start", md: "center" },
                    textAlign: { xs: "left", md: "center" },
                    gap: { xs: 2, md: 2 },
                    "&:hover .step-dot": {
                      backgroundColor: GREEN.light,
                      color: GREEN.deep,
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <Box
                    className="step-dot"
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      flexShrink: 0,
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      color: "#FFFFFF",
                      backgroundColor: GREEN.deep,
                      border: `2px solid ${GREEN.light}`,
                      boxShadow: `0 0 0 6px rgba(82, 183, 136, 0.14)`,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      p: { xs: 2.25, md: 2.5 },
                      borderRadius: "20px",
                      border: "1px solid rgba(216, 243, 220, 0.2)",
                      backgroundColor: "rgba(216, 243, 220, 0.07)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      width: "100%",
                    }}
                  >
                    <Typography sx={{ fontWeight: 800, fontSize: "1.12rem", mb: 0.75 }}>
                      {step.title}
                    </Typography>
                    <Typography sx={{ fontSize: "0.92rem", lineHeight: 1.6, opacity: 0.85 }}>
                      {step.text}
                    </Typography>
                  </Box>
                </Box>
              </Reveal>
            ))}
          </Box>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 7, md: 10 } }}>
        <Container maxWidth="xl">
          <Reveal>
            <SectionHeading
              eyebrow="Our expertise"
              title="One team, every specialist service"
              subtitle="Tap a service to see what it covers and how we deliver it."
            />
          </Reveal>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                md: "repeat(4, minmax(0, 1fr))",
              },
              gap: { xs: 1.5, md: 2.5 },
            }}
          >
            {displayServices.map((service, index) => {
              const Icon = ICONS[service.slug] || GenericIcon;
              return (
                <Reveal key={service.slug || service.name} delay={(index % 4) * 80}>
                  <Box
                    component="button"
                    type="button"
                    onClick={() => navigate(`/services/${service.slug}`)}
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      textAlign: "left",
                      gap: 1.25,
                      p: { xs: 2, md: 2.75 },
                      borderRadius: "20px 20px 44px 20px",
                      border: "1px solid rgba(45, 106, 79, 0.12)",
                      backgroundColor: "#FFFFFF",
                      boxShadow: "0 8px 22px rgba(27, 67, 50, 0.06)",
                      fontFamily: "inherit",
                      color: GREEN.ink,
                      cursor: "pointer",
                      transition:
                        "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease, border-color 0.3s ease",
                      "&:hover, &:focus-visible": {
                        outline: "none",
                        transform: "translateY(-6px)",
                        borderColor: GREEN.mid,
                        boxShadow: "0 18px 36px rgba(27, 67, 50, 0.14)",
                        "& .service-arrow": { transform: "translateX(4px)", color: GREEN.main },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 50, md: 60 },
                        height: { xs: 50, md: 60 },
                        p: 1,
                        borderRadius: "16px",
                        background: `linear-gradient(160deg, ${GREEN.mid}, ${GREEN.deep})`,
                        "& svg": { width: "100%", height: "100%", display: "block" },
                      }}
                    >
                      <Icon />
                    </Box>
                    <Typography sx={{ fontWeight: 800, fontSize: { xs: "0.95rem", md: "1.05rem" }, lineHeight: 1.3 }}>
                      {service.name}
                    </Typography>
                    <Typography
                      sx={{
                        display: { xs: "none", sm: "-webkit-box" },
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        fontSize: "0.86rem",
                        lineHeight: 1.55,
                        color: "text.secondary",
                      }}
                    >
                      {service.short_description || service.description}
                    </Typography>
                    <Box
                      sx={{
                        mt: "auto",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                        fontSize: "0.82rem",
                        fontWeight: 800,
                        color: GREEN.mid,
                      }}
                    >
                      Learn more
                      <ArrowForwardRounded
                        className="service-arrow"
                        sx={{ fontSize: 16, transition: "transform 0.22s ease, color 0.22s ease" }}
                      />
                    </Box>
                  </Box>
                </Reveal>
              );
            })}
          </Box>
        </Container>
      </Box>

      <Box sx={{ pb: { xs: 7, md: 10 } }}>
        <Container
          maxWidth="xl"
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2.5,
          }}
        >
          {[
            { title: "Our vision", text: vision, icon: VisibilityOutlined },
            { title: "Our mission", text: mission, icon: FlagOutlined },
          ].map(({ title, text, icon: Icon }, index) => (
            <Reveal key={title} delay={index * 120}>
              <Box
                sx={{
                  position: "relative",
                  height: "100%",
                  overflow: "hidden",
                  p: { xs: 3.5, md: 4.5 },
                  borderRadius: "0 0 80px 0",
                  color: "#FFFFFF",
                  background:
                    index === 0
                      ? `linear-gradient(160deg, ${GREEN.main} 0%, ${GREEN.deep} 100%)`
                      : `linear-gradient(160deg, ${GREEN.deep} 0%, #14342A 100%)`,
                  boxShadow: "0 18px 40px rgba(27, 67, 50, 0.2)",
                }}
              >
                <Icon
                  aria-hidden="true"
                  sx={{
                    position: "absolute",
                    right: -18,
                    top: -18,
                    fontSize: 160,
                    color: "rgba(216, 243, 220, 0.07)",
                  }}
                />
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    backgroundColor: "rgba(216, 243, 220, 0.14)",
                    border: "1px solid rgba(216, 243, 220, 0.3)",
                  }}
                >
                  <Icon />
                </Box>
                <Typography
                  sx={{ fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.18em", textTransform: "uppercase", color: GREEN.mist, mb: 1 }}
                >
                  {title}
                </Typography>
                <Typography sx={{ position: "relative", fontSize: { xs: "1.1rem", md: "1.3rem" }, lineHeight: 1.55, fontWeight: 700 }}>
                  {text}
                </Typography>
              </Box>
            </Reveal>
          ))}
        </Container>
      </Box>

      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          py: { xs: 8, md: 11 },
          color: "#FFFFFF",
          backgroundImage: `linear-gradient(135deg, rgba(27, 67, 50, 0.92), rgba(45, 106, 79, 0.82)), url(/images/b3.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: { md: "fixed" },
        }}
      >
        <Container maxWidth="md">
          <Reveal>
            <Box
              sx={{
                textAlign: "center",
                p: { xs: 3.5, md: 5.5 },
                borderRadius: "28px 28px 90px 28px",
                border: "1px solid rgba(216, 243, 220, 0.25)",
                backgroundColor: "rgba(216, 243, 220, 0.08)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                boxShadow: "0 24px 60px rgba(0, 0, 0, 0.25)",
              }}
            >
              <Eyebrow light center>
                Start your project
              </Eyebrow>
              <Typography
                component="h2"
                sx={{ fontWeight: 800, fontSize: { xs: "1.8rem", md: "2.5rem" }, letterSpacing: "-0.02em", mb: 1.5 }}
              >
                Let's grow something together
              </Typography>
              <Typography sx={{ opacity: 0.88, lineHeight: 1.7, mb: 3.5, maxWidth: 520, mx: "auto" }}>
                Tell us about your farm, garden or project and {founder.name}'s
                team will get back to you with practical next steps.
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", flexWrap: "wrap" }}>
                <Button
                  disableRipple
                  onClick={() => navigate("/request-service")}
                  endIcon={<ArrowForwardRounded />}
                  sx={solidButton}
                >
                  Request a Service
                </Button>
                <Button disableRipple onClick={() => navigate("/contact")} sx={glassButton}>
                  Contact us
                </Button>
              </Box>
            </Box>
          </Reveal>
        </Container>
      </Box>
    </Box>
  );
}

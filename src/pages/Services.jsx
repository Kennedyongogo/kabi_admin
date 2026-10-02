import React, { useRef, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  ArrowForwardRounded,
  CheckCircleRounded,
  ScheduleRounded,
  TipsAndUpdatesOutlined,
  WhatsApp,
} from "@mui/icons-material";
import { allServices, projectImpact, serviceGoals, workingSteps } from "../data/portfolioContent";
import { GREEN, PageHero, Reveal, SectionHeading } from "../components/PageSections";
import { ChoicePill, primaryButtonSx } from "../components/FormControls";
import { ServiceIcon } from "../components/ServiceBits";

const SHORT = {
  "hydroponic-farming": "Hydroponics",
  "vertical-farming": "Vertical",
  "organic-agriculture": "Organic",
  "agronomy-consultancy": "Agronomy",
  landscaping: "Landscaping",
  training: "Training",
  "eia-services": "EIA",
};

const BENTO_SPANS = ["span 3", "span 3", "span 2", "span 2", "span 2", "span 3", "span 3"];

const whiteButtonSx = {
  minHeight: 50,
  px: 3.5,
  borderRadius: 999,
  fontWeight: 700,
  color: GREEN.deep,
  backgroundColor: "#FFFFFF",
  "&:hover": { backgroundColor: GREEN.mist },
};

function ServiceExplorer({ active, setActive, onOpen, onRequest }) {
  const tabsRef = useRef(null);
  const service = allServices[active];

  const onKeyDown = (e) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = (active + keys[e.key] + allServices.length) % allServices.length;
    setActive(next);
    tabsRef.current?.querySelectorAll('[role="tab"]')[next]?.focus();
  };

  return (
    <Box
      id="explorer"
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "300px minmax(0, 1fr)" },
        overflow: "hidden",
        borderRadius: "32px 32px 32px 8px",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 30px 70px rgba(27, 67, 50, 0.14)",
        scrollMarginTop: 80,
      }}
    >
      <Box
        ref={tabsRef}
        role="tablist"
        aria-label="Our services"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        sx={{
          display: "flex",
          flexDirection: { xs: "row", md: "column" },
          gap: 0.75,
          p: { xs: 1.25, md: 2 },
          overflowX: { xs: "auto", md: "visible" },
          backgroundColor: GREEN.cream,
          borderRight: { md: "1px solid rgba(27, 67, 50, 0.07)" },
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {allServices.map((item, index) => {
          const selected = index === active;
          return (
            <Box
              key={item.slug}
              component="button"
              type="button"
              role="tab"
              id={`service-tab-${item.slug}`}
              aria-selected={selected}
              aria-controls="service-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              sx={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                p: 1,
                pr: 1.5,
                textAlign: "left",
                fontFamily: "inherit",
                cursor: "pointer",
                border: 0,
                borderRadius: "16px",
                color: selected ? "#FFFFFF" : GREEN.ink,
                background: selected ? `linear-gradient(135deg, ${GREEN.main}, ${GREEN.deep})` : "transparent",
                boxShadow: selected ? "0 12px 26px rgba(27, 67, 50, 0.25)" : "none",
                transition: "all 0.25s ease",
                "&:hover": { backgroundColor: selected ? undefined : "rgba(216, 243, 220, 0.8)" },
                "&:focus-visible": { outline: `3px solid ${GREEN.light}`, outlineOffset: 2 },
              }}
            >
              <ServiceIcon slug={item.slug} size={40} light={selected} sx={selected ? {} : { boxShadow: "none" }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, fontSize: "0.92rem", lineHeight: 1.25, whiteSpace: { xs: "nowrap", md: "normal" } }}>
                  {item.name}
                </Typography>
                <Typography sx={{ display: { xs: "none", md: "block" }, fontSize: "0.74rem", opacity: 0.75 }}>
                  {item.offerings?.length || 0} offerings
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box
        key={service.slug}
        id="service-panel"
        role="tabpanel"
        aria-labelledby={`service-tab-${service.slug}`}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          "@keyframes panelIn": { from: { opacity: 0, transform: "translateY(10px)" }, to: { opacity: 1, transform: "none" } },
          animation: "panelIn 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
        }}
      >
        <Box sx={{ position: "relative", minHeight: { xs: 220, sm: 280, lg: "100%" }, overflow: "hidden" }}>
          <Box component="img" src={service.image} alt="" sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(27,42,34,0) 40%, rgba(27,42,34,0.85) 100%)" }} />
          {service.stat && (
            <Box
              sx={{
                position: "absolute",
                left: 16,
                right: 16,
                bottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                borderRadius: "18px",
                color: "#FFFFFF",
                backgroundColor: "rgba(255, 255, 255, 0.14)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography sx={{ fontWeight: 800, fontSize: "1.6rem", lineHeight: 1 }}>{service.stat.value}</Typography>
              <Typography sx={{ fontSize: "0.82rem", lineHeight: 1.35, opacity: 0.9 }}>{service.stat.label}</Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ p: { xs: 2.5, sm: 3.5 }, display: "flex", flexDirection: "column" }}>
          <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: GREEN.mid }}>
            {active + 1 < 10 ? `0${active + 1}` : active + 1} / 0{allServices.length}
          </Typography>
          <Typography component="h2" sx={{ mt: 0.75, fontWeight: 800, fontSize: { xs: "1.5rem", md: "1.8rem" }, lineHeight: 1.2, color: GREEN.ink }}>
            {service.name}
          </Typography>
          <Typography sx={{ mt: 0.75, fontWeight: 600, color: GREEN.main }}>{service.tagline}</Typography>
          <Typography sx={{ mt: 1.5, color: "text.secondary", lineHeight: 1.7, fontSize: "0.93rem" }}>{service.short_description}</Typography>

          <Box component="ul" sx={{ listStyle: "none", p: 0, m: "18px 0 0", display: "grid", gap: 0.9, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
            {(service.offerings || []).slice(0, 6).map((offer) => (
              <Box key={offer} component="li" sx={{ display: "flex", alignItems: "flex-start", gap: 0.75, fontSize: "0.88rem", color: GREEN.ink }}>
                <CheckCircleRounded sx={{ mt: "2px", fontSize: 17, color: GREEN.mid }} />
                {offer}
              </Box>
            ))}
          </Box>

          {service.timeline && (
            <Typography sx={{ mt: 2, display: "flex", alignItems: "center", gap: 0.75, fontSize: "0.82rem", color: "text.secondary" }}>
              <ScheduleRounded sx={{ fontSize: 16, color: GREEN.mid }} />
              Typical timeline: <strong>{service.timeline}</strong>
            </Typography>
          )}

          <Box sx={{ mt: "auto", pt: 3, display: "flex", flexWrap: "wrap", gap: 1.25 }}>
            <Button onClick={() => onOpen(service)} endIcon={<ArrowForwardRounded />} sx={{ ...primaryButtonSx, minHeight: 48, px: 3, fontSize: "0.95rem" }}>
              Explore service
            </Button>
            <Button
              onClick={() => onRequest(service)}
              sx={{ minHeight: 48, px: 2.5, borderRadius: 999, fontWeight: 700, color: GREEN.main, border: `1px solid ${GREEN.light}`, "&:hover": { backgroundColor: GREEN.mist } }}
            >
              Request a quote
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function ServiceMatcher({ onOpen }) {
  const [goal, setGoal] = useState(null);
  const picked = serviceGoals.find((g) => g.id === goal);
  const matches = picked ? picked.services.map((slug) => allServices.find((s) => s.slug === slug)).filter(Boolean) : [];

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        p: { xs: 3, md: 5 },
        borderRadius: "32px 32px 8px 32px",
        color: "#FFFFFF",
        background: `radial-gradient(circle at 90% 0%, rgba(82, 183, 136, 0.4), transparent 45%), linear-gradient(150deg, ${GREEN.deep}, ${GREEN.main})`,
        boxShadow: "0 24px 50px rgba(27, 67, 50, 0.25)",
      }}
    >
      <TipsAndUpdatesOutlined aria-hidden sx={{ position: "absolute", right: -30, top: -30, fontSize: 220, color: "rgba(216, 243, 220, 0.05)" }} />
      <Box sx={{ position: "relative", display: "grid", gap: { xs: 3, md: 5 }, gridTemplateColumns: { xs: "1fr", md: "5fr 7fr" }, alignItems: "start" }}>
        <Box>
          <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: GREEN.mist }}>
            Service finder
          </Typography>
          <Typography component="h2" sx={{ mt: 1, fontWeight: 800, fontSize: { xs: "1.6rem", md: "2rem" }, lineHeight: 1.2 }}>
            Not sure where to start?
          </Typography>
          <Typography sx={{ mt: 1, color: "rgba(255, 255, 255, 0.82)", lineHeight: 1.7 }}>
            Tell us what you want to achieve and we'll point you to the right service.
          </Typography>
          <Box role="radiogroup" aria-label="What do you want to achieve?" sx={{ mt: 2.5, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {serviceGoals.map((item) => (
              <ChoicePill key={item.id} dark selected={goal === item.id} onClick={() => setGoal(item.id)}>
                {item.label}
              </ChoicePill>
            ))}
          </Box>
        </Box>

        <Box aria-live="polite" sx={{ display: "grid", gap: 1.5, alignContent: "start", minHeight: { md: 260 } }}>
          {matches.length ? (
            matches.map((service, index) => (
              <Box
                key={`${goal}-${service.slug}`}
                component="button"
                type="button"
                onClick={() => onOpen(service)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  textAlign: "left",
                  fontFamily: "inherit",
                  cursor: "pointer",
                  border: 0,
                  borderRadius: "22px 22px 22px 6px",
                  color: GREEN.ink,
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 16px 36px rgba(0, 0, 0, 0.18)",
                  "@keyframes matchIn": { from: { opacity: 0, transform: "translateX(16px)" }, to: { opacity: 1, transform: "none" } },
                  animation: `matchIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) ${index * 90}ms both`,
                  transition: "transform 0.25s ease",
                  "&:hover": { transform: "translateY(-3px)" },
                  "&:hover .match-arrow": { transform: "translateX(4px)" },
                  "&:focus-visible": { outline: `3px solid ${GREEN.light}`, outlineOffset: 3 },
                  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                }}
              >
                <ServiceIcon slug={service.slug} size={56} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {index === 0 && (
                    <Typography sx={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: GREEN.mid }}>
                      Best match
                    </Typography>
                  )}
                  <Typography sx={{ fontWeight: 800, fontSize: "1.05rem" }}>{service.name}</Typography>
                  <Typography sx={{ fontSize: "0.86rem", color: "text.secondary", lineHeight: 1.5 }}>{service.tagline}</Typography>
                </Box>
                <ArrowForwardRounded className="match-arrow" sx={{ color: GREEN.main, transition: "transform 0.25s ease" }} />
              </Box>
            ))
          ) : (
            <Box
              sx={{
                height: "100%",
                minHeight: 180,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                p: 3,
                textAlign: "center",
                borderRadius: "22px",
                border: "1px dashed rgba(216, 243, 220, 0.35)",
                color: "rgba(255, 255, 255, 0.75)",
              }}
            >
              <TipsAndUpdatesOutlined sx={{ fontSize: 34, color: GREEN.light }} />
              Pick a goal to see our recommendation.
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function BentoCard({ service, index, onOpen }) {
  const wide = BENTO_SPANS[index] === "span 3";
  return (
    <Box
      component="button"
      type="button"
      onClick={() => onOpen(service)}
      aria-label={`${service.name}: ${service.short_description}`}
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: { xs: 260, md: wide ? 320 : 300 },
        p: 0,
        border: 0,
        cursor: "pointer",
        overflow: "hidden",
        textAlign: "left",
        fontFamily: "inherit",
        color: "#FFFFFF",
        borderRadius: "26px 26px 26px 8px",
        boxShadow: "0 16px 40px rgba(27, 67, 50, 0.12)",
        "& img": { transition: "transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)" },
        "& .bento-more": { transition: "max-height 0.4s ease, opacity 0.35s ease" },
        "& .bento-arrow": { transition: "transform 0.3s ease, background-color 0.3s ease" },
        "&:hover, &:focus-visible": {
          "& img": { transform: "scale(1.07)" },
          "& .bento-more": { maxHeight: 80, opacity: 1 },
          "& .bento-arrow": { transform: "rotate(-45deg)", backgroundColor: GREEN.light },
        },
        "&:focus-visible": { outline: `3px solid ${GREEN.light}`, outlineOffset: 3 },
      }}
    >
      <Box component="img" src={service.image} alt="" loading="lazy" sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(27,42,34,0.1) 0%, rgba(27,42,34,0.35) 40%, rgba(27,42,34,0.92) 100%)" }} />
      <Box sx={{ position: "absolute", top: 18, left: 18, right: 18, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <ServiceIcon slug={service.slug} size={50} light sx={{ backdropFilter: "blur(8px)" }} />
        <Box
          className="bento-arrow"
          sx={{ width: 42, height: 42, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255, 255, 255, 0.18)", backdropFilter: "blur(8px)" }}
        >
          <ArrowForwardRounded sx={{ fontSize: 20 }} />
        </Box>
      </Box>
      <Box sx={{ position: "absolute", left: 0, right: 0, bottom: 0, p: { xs: 2.25, md: 2.75 } }}>
        <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.2rem", md: wide ? "1.45rem" : "1.25rem" }, lineHeight: 1.25 }}>{service.name}</Typography>
        <Typography
          className="bento-more"
          sx={{ mt: 0.75, fontSize: "0.88rem", lineHeight: 1.55, color: "rgba(255, 255, 255, 0.86)", maxHeight: { xs: 80, md: 0 }, opacity: { xs: 1, md: 0 }, overflow: "hidden" }}
        >
          {service.short_description}
        </Typography>
        <Box sx={{ mt: 1.25, display: "flex", flexWrap: "wrap", gap: 0.75 }}>
          {[`${service.offerings?.length || 0} offerings`, service.projectCount ? `${service.projectCount} ${service.projectCount === 1 ? "project" : "projects"}` : null]
            .filter(Boolean)
            .map((text) => (
              <Box key={text} component="span" sx={{ px: 1.1, py: 0.3, borderRadius: 999, fontSize: "0.72rem", fontWeight: 700, backgroundColor: "rgba(216, 243, 220, 0.18)", border: "1px solid rgba(216, 243, 220, 0.3)" }}>
                {text}
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
}

export default function Services() {
  const navigate = useNavigate();
  const { settings } = useOutletContext() || {};
  const whatsapp = String(settings?.whatsapp || settings?.phone || "+254 700 000000").replace(/\D/g, "");
  const [active, setActive] = useState(0);

  const openService = (service) => navigate(`/services/${service.slug}`);
  const requestService = (service) => navigate(`/request-service?service=${service.slug}`);
  const jumpTo = (index) => {
    setActive(index);
    const el = document.getElementById("explorer");
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
  };

  return (
    <Box sx={{ backgroundColor: GREEN.cream, overflowX: "hidden" }}>
      <Helmet>
        <title>Our Services | Mcaludoh Consultancy</title>
        <meta
          name="description"
          content="Hydroponic farming, vertical farming, organic agriculture, agronomy consultancy, landscaping, training and EIA services across Kenya."
        />
      </Helmet>

      <PageHero
        eyebrow="Our services"
        title="Everything your farm needs,"
        highlight="from seed to harvest."
        subtitle="Seven specialist services under one roof, delivered by Aludoh and a team of agronomists, designers and environmental experts."
      >
        <Box sx={{ mt: 3.5, display: "flex", flexWrap: "wrap", gap: 1 }}>
          {allServices.map((service, index) => (
            <Box
              key={service.slug}
              component="button"
              type="button"
              onClick={() => jumpTo(index)}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                py: 0.6,
                pl: 0.6,
                pr: 1.6,
                fontFamily: "inherit",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#FFFFFF",
                cursor: "pointer",
                borderRadius: 999,
                border: "1px solid rgba(216, 243, 220, 0.3)",
                backgroundColor: "rgba(216, 243, 220, 0.08)",
                backdropFilter: "blur(10px)",
                transition: "all 0.2s ease",
                "&:hover": { backgroundColor: "rgba(216, 243, 220, 0.2)", transform: "translateY(-2px)" },
                "&:focus-visible": { outline: `3px solid ${GREEN.light}`, outlineOffset: 2 },
              }}
            >
              <ServiceIcon slug={service.slug} size={28} light sx={{ borderRadius: "50%", border: 0 }} />
              {SHORT[service.slug] || service.name}
            </Box>
          ))}
        </Box>
      </PageHero>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, mt: { xs: -8, md: -9 } }}>
        <Reveal>
          <ServiceExplorer active={active} setActive={setActive} onOpen={openService} onRequest={requestService} />
        </Reveal>
      </Container>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
        <Reveal>
          <ServiceMatcher onOpen={openService} />
        </Reveal>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 7, md: 10 } }}>
        <Reveal>
          <SectionHeading eyebrow="All services" title="Specialist help for every stage" subtitle="Hover or tap a service to learn more." />
        </Reveal>
        <Box sx={{ display: "grid", gap: { xs: 2, md: 2.5 }, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(6, 1fr)" } }}>
          {allServices.map((service, index) => (
            <Reveal key={service.slug} delay={(index % 3) * 90} sx={{ height: "100%", gridColumn: { md: BENTO_SPANS[index] || "span 2" } }}>
              <BentoCard service={service} index={index} onOpen={openService} />
            </Reveal>
          ))}
        </Box>
      </Container>

      <Box sx={{ backgroundColor: "#FFFFFF", py: { xs: 7, md: 9 } }}>
        <Container maxWidth="lg">
          <Reveal>
            <SectionHeading eyebrow="How we work" title="Simple, transparent, hands-on" subtitle="The same proven process for every client, big or small." />
          </Reveal>
          <Box sx={{ position: "relative", display: "grid", gap: { xs: 2.5, md: 3 }, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" } }}>
            <Box
              aria-hidden
              sx={{ display: { xs: "none", md: "block" }, position: "absolute", top: 28, left: "12.5%", right: "12.5%", borderTop: `2px dashed ${GREEN.light}`, opacity: 0.5 }}
            />
            {workingSteps.map((step, index) => (
              <Reveal key={step.title} delay={index * 110}>
                <Box sx={{ position: "relative", textAlign: "center", px: 1 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      mx: "auto",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      color: "#FFFFFF",
                      background: `linear-gradient(150deg, ${GREEN.mid}, ${GREEN.deep})`,
                      boxShadow: `0 0 0 8px #FFFFFF, 0 12px 26px rgba(45, 106, 79, 0.3)`,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography sx={{ mt: 2.25, fontWeight: 800, fontSize: "1.08rem", color: GREEN.ink }}>{step.title}</Typography>
                  <Typography sx={{ mt: 0.75, color: "text.secondary", lineHeight: 1.65, fontSize: "0.92rem" }}>{step.text}</Typography>
                </Box>
              </Reveal>
            ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 9 } }}>
        <Reveal>
          <Box
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: "32px 32px 32px 8px",
              color: "#FFFFFF",
              background: `radial-gradient(circle at 10% 100%, rgba(82, 183, 136, 0.4), transparent 50%), linear-gradient(140deg, ${GREEN.deep}, ${GREEN.main})`,
              boxShadow: "0 24px 50px rgba(27, 67, 50, 0.25)",
            }}
          >
            <Box sx={{ display: "grid", gap: { xs: 3, md: 5 }, gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" }, alignItems: "center" }}>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.6rem", md: "2.1rem" }, lineHeight: 1.2 }}>Ready to grow something great?</Typography>
                <Typography sx={{ mt: 1, color: "rgba(255, 255, 255, 0.82)", lineHeight: 1.7 }}>
                  Book a consultation or site visit. We'll help you choose the right approach for your land, space and budget.
                </Typography>
                <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                  <Button onClick={() => navigate("/request-service")} endIcon={<ArrowForwardRounded />} sx={whiteButtonSx}>
                    Request a service
                  </Button>
                  <Button
                    href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hello Mcaludoh, I'd like to discuss a project.")}`}
                    target="_blank"
                    rel="noreferrer"
                    startIcon={<WhatsApp />}
                    sx={{ minHeight: 50, px: 3, borderRadius: 999, fontWeight: 700, color: "#FFFFFF", border: "1px solid rgba(255, 255, 255, 0.4)", "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" } }}
                  >
                    WhatsApp us
                  </Button>
                </Box>
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
                {projectImpact.map((item) => (
                  <Box key={item.label} sx={{ p: 2, borderRadius: "18px", backgroundColor: "rgba(216, 243, 220, 0.1)", border: "1px solid rgba(216, 243, 220, 0.2)" }}>
                    <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.5rem", md: "1.9rem" }, lineHeight: 1 }}>{item.value}</Typography>
                    <Typography sx={{ mt: 0.5, fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.78)" }}>{item.label}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Reveal>
      </Container>
    </Box>
  );
}

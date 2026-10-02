import React, { useEffect, useMemo, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
  ArrowBackRounded,
  ArrowForwardRounded,
  CheckRounded,
  ChevronRightRounded,
  ExpandMoreRounded,
  GroupsRounded,
  ScheduleRounded,
  SearchOffRounded,
  StarRounded,
  WhatsApp,
  WorkOutlineRounded,
} from "@mui/icons-material";
import { allServices, getService, projects } from "../data/portfolioContent";
import { GREEN, Reveal } from "../components/PageSections";
import { EmptyState, primaryButtonSx } from "../components/FormControls";
import { BENEFIT_ICONS, ServiceIcon } from "../components/ServiceBits";
import ProjectCard from "../components/ProjectCard";
import { formatKES } from "../utils/format";

const HEADER_OFFSET = 130;

function SectionTitle({ eyebrow, title, subtitle, light = false }) {
  return (
    <Box sx={{ mb: { xs: 3, md: 4 }, maxWidth: 640 }}>
      <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: light ? GREEN.mist : GREEN.mid }}>
        {eyebrow}
      </Typography>
      <Typography component="h2" sx={{ mt: 0.75, fontWeight: 800, fontSize: { xs: "1.6rem", md: "2.1rem" }, lineHeight: 1.2, letterSpacing: "-0.02em", color: light ? "#FFFFFF" : GREEN.ink }}>
        {title}
      </Typography>
      {subtitle && <Typography sx={{ mt: 1, lineHeight: 1.7, color: light ? "rgba(255,255,255,0.82)" : "text.secondary" }}>{subtitle}</Typography>}
    </Box>
  );
}

function OfferingToggle({ label, selected, onToggle }) {
  return (
    <Box
      component="button"
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onToggle}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        width: "100%",
        p: 1.75,
        textAlign: "left",
        fontFamily: "inherit",
        fontSize: "0.92rem",
        fontWeight: 600,
        cursor: "pointer",
        color: GREEN.ink,
        borderRadius: "16px 16px 16px 6px",
        border: `1.5px solid ${selected ? GREEN.mid : "rgba(27, 67, 50, 0.1)"}`,
        backgroundColor: selected ? "#F1FAF3" : "#FFFFFF",
        boxShadow: selected ? "0 10px 24px rgba(45, 106, 79, 0.14)" : "none",
        transition: "all 0.2s ease",
        "&:hover": { borderColor: GREEN.light, transform: "translateY(-2px)" },
        "&:focus-visible": { outline: `3px solid ${GREEN.light}`, outlineOffset: 2 },
      }}
    >
      <Box
        sx={{
          width: 22,
          height: 22,
          flexShrink: 0,
          borderRadius: "7px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
          border: `2px solid ${selected ? GREEN.mid : "rgba(27, 67, 50, 0.22)"}`,
          backgroundColor: selected ? GREEN.mid : "transparent",
          transition: "all 0.2s ease",
        }}
      >
        {selected && <CheckRounded sx={{ fontSize: 16 }} />}
      </Box>
      {label}
    </Box>
  );
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { settings } = useOutletContext() || {};
  const whatsapp = String(settings?.whatsapp || settings?.phone || "+254 700 000000").replace(/\D/g, "");
  const service = getService(slug);

  const related = useMemo(() => projects.filter((p) => p.service === slug), [slug]);
  const others = allServices.filter((s) => s.slug !== slug);
  const [picked, setPicked] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");

  const sections = useMemo(
    () =>
      [
        { id: "overview", label: "Overview" },
        { id: "offerings", label: "What we offer" },
        { id: "process", label: "Process" },
        service?.packages && { id: "packages", label: "Packages" },
        related.length && { id: "projects", label: "Projects" },
        service?.faqs && { id: "faq", label: "FAQ" },
      ].filter(Boolean),
    [service, related.length]
  );

  useEffect(() => setPicked([]), [slug]);

  useEffect(() => {
    const onScroll = () => {
      let current = sections[0]?.id;
      sections.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < HEADER_OFFSET + 40) current = s.id;
      });
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  if (!service) {
    return (
      <Box sx={{ backgroundColor: GREEN.cream, py: { xs: 8, md: 12 } }}>
        <Helmet>
          <title>Service not found | Mcaludoh Consultancy</title>
        </Helmet>
        <Container maxWidth="sm">
          <EmptyState
            icon={SearchOffRounded}
            title="We couldn't find that service"
            text="Browse all our services to find what you need."
            action={
              <Button onClick={() => navigate("/services")} startIcon={<ArrowBackRounded />} sx={{ ...primaryButtonSx, minHeight: 46, px: 3, fontSize: "0.95rem" }}>
                All services
              </Button>
            }
          />
        </Container>
      </Box>
    );
  }

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET + 10, behavior: "smooth" });
  };
  const toggle = (offer) => setPicked((prev) => (prev.includes(offer) ? prev.filter((o) => o !== offer) : [...prev, offer]));
  const request = (extra = {}) => {
    const params = new URLSearchParams({ service: service.slug, ...extra });
    navigate(`/request-service?${params.toString()}`);
  };

  const facts = [
    service.timeline && { icon: ScheduleRounded, label: "Typical timeline", value: service.timeline },
    service.idealFor && { icon: GroupsRounded, label: "Ideal for", value: service.idealFor.slice(0, 2).join(", ") },
    { icon: WorkOutlineRounded, label: "Projects", value: related.length ? `${related.length} case ${related.length === 1 ? "study" : "studies"}` : "Across Kenya" },
  ].filter(Boolean);

  return (
    <Box sx={{ backgroundColor: GREEN.cream }}>
      <Helmet>
        <title>{service.name} | Mcaludoh Consultancy</title>
        <meta name="description" content={service.short_description} />
      </Helmet>

      <Box sx={{ position: "relative", color: "#FFFFFF", overflow: "hidden" }}>
        <Box component="img" src={service.image?.replace(/w=\d+/, "w=1800")} alt="" sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, rgba(27, 67, 50, 0.97) 0%, rgba(27, 67, 50, 0.86) 50%, rgba(27, 67, 50, 0.5) 100%)" }} />
        <Container maxWidth="lg" sx={{ position: "relative", pt: { xs: 5, md: 8 }, pb: { xs: 5, md: 7 } }}>
          <Reveal>
            <Box component="nav" aria-label="Breadcrumb" sx={{ display: "flex", alignItems: "center", gap: 0.5, fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.75)" }}>
              <Box
                component="a"
                href="/services"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/services");
                }}
                sx={{ color: "inherit", textDecoration: "none", fontWeight: 600, "&:hover": { color: "#FFFFFF" } }}
              >
                Services
              </Box>
              <ChevronRightRounded sx={{ fontSize: 18 }} />
              <Box component="span" sx={{ color: GREEN.mist, fontWeight: 700 }}>
                {service.name}
              </Box>
            </Box>
            <Box sx={{ mt: 2.5, display: "flex", alignItems: "center", gap: 2 }}>
              <ServiceIcon slug={service.slug} size={64} light />
              <Typography component="h1" sx={{ fontWeight: 800, fontSize: { xs: "2rem", sm: "2.5rem", md: "3.1rem" }, lineHeight: 1.08, letterSpacing: "-0.03em" }}>
                {service.name}
              </Typography>
            </Box>
            <Typography sx={{ mt: 2, maxWidth: 640, fontSize: { xs: "1.05rem", md: "1.2rem" }, fontWeight: 600, color: GREEN.mist }}>{service.tagline}</Typography>
            <Typography sx={{ mt: 1, maxWidth: 620, lineHeight: 1.75, color: "rgba(255, 255, 255, 0.85)" }}>{service.short_description}</Typography>
            <Box sx={{ mt: 3.5, display: "flex", flexWrap: "wrap", gap: 1.5 }}>
              <Button
                onClick={() => request()}
                endIcon={<ArrowForwardRounded />}
                sx={{ minHeight: 52, px: 3.5, borderRadius: 999, fontWeight: 700, color: GREEN.deep, backgroundColor: "#FFFFFF", "&:hover": { backgroundColor: GREEN.mist } }}
              >
                Request a consultation
              </Button>
              <Button
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hello Mcaludoh, I'm interested in ${service.name}.`)}`}
                target="_blank"
                rel="noreferrer"
                startIcon={<WhatsApp />}
                sx={{ minHeight: 52, px: 3, borderRadius: 999, fontWeight: 700, color: "#FFFFFF", border: "1px solid rgba(216, 243, 220, 0.4)", backgroundColor: "rgba(216, 243, 220, 0.08)", backdropFilter: "blur(8px)", "&:hover": { backgroundColor: "rgba(216, 243, 220, 0.16)" } }}
              >
                Chat on WhatsApp
              </Button>
            </Box>
            <Box sx={{ mt: 4, display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: `repeat(${facts.length}, minmax(0, 1fr))` }, maxWidth: 820 }}>
              {facts.map(({ icon: Icon, label, value }) => (
                <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 1.25, p: 1.5, borderRadius: "16px", border: "1px solid rgba(216, 243, 220, 0.25)", backgroundColor: "rgba(216, 243, 220, 0.08)", backdropFilter: "blur(10px)" }}>
                  <Icon sx={{ color: GREEN.light }} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.7)" }}>{label}</Typography>
                    <Typography noWrap sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
                      {value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Reveal>
        </Container>
      </Box>

      <Box
        component="nav"
        aria-label="On this page"
        sx={{
          position: "sticky",
          top: { xs: 52, lg: 56 },
          zIndex: 10,
          backgroundColor: "rgba(247, 244, 236, 0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(27, 67, 50, 0.08)",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", gap: 0.75, py: 1.25, overflowX: "auto", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
            {sections.map((s) => {
              const on = activeSection === s.id;
              return (
                <Box
                  key={s.id}
                  component="button"
                  type="button"
                  onClick={() => scrollTo(s.id)}
                  aria-current={on ? "true" : undefined}
                  sx={{
                    flexShrink: 0,
                    px: 1.75,
                    py: 0.75,
                    fontFamily: "inherit",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: 0,
                    borderRadius: 999,
                    color: on ? "#FFFFFF" : GREEN.ink,
                    backgroundColor: on ? GREEN.main : "transparent",
                    transition: "all 0.2s ease",
                    "&:hover": { backgroundColor: on ? GREEN.main : GREEN.mist },
                  }}
                >
                  {s.label}
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>

      <Container id="overview" maxWidth="lg" sx={{ py: { xs: 6, md: 9 }, scrollMarginTop: HEADER_OFFSET }}>
        <Box sx={{ display: "grid", gap: { xs: 4, md: 6 }, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, alignItems: "center" }}>
          <Reveal>
            <SectionTitle eyebrow="Overview" title={`Why choose our ${service.name.toLowerCase()} service`} />
            <Typography sx={{ fontSize: { xs: "1rem", md: "1.06rem" }, lineHeight: 1.85, color: "#3C4A42" }}>{service.description}</Typography>
            {service.idealFor && (
              <Box sx={{ mt: 3 }}>
                <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", color: GREEN.ink, mb: 1 }}>Ideal for</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {service.idealFor.map((who) => (
                    <Box key={who} component="span" sx={{ px: 1.5, py: 0.6, borderRadius: 999, fontSize: "0.85rem", fontWeight: 600, color: GREEN.deep, backgroundColor: GREEN.mist }}>
                      {who}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Reveal>
          {service.gallery?.length >= 3 && (
            <Reveal delay={120}>
              <Box sx={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gridTemplateRows: "1fr 1fr", gap: 1.5, height: { xs: 320, md: 420 } }}>
                {service.gallery.slice(0, 3).map((src, index) => (
                  <Box
                    key={src}
                    component="img"
                    src={src}
                    alt=""
                    loading="lazy"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      gridRow: index === 0 ? "span 2" : "auto",
                      borderRadius: index === 0 ? "28px 8px 8px 28px" : index === 1 ? "8px 28px 8px 8px" : "8px 8px 28px 8px",
                      boxShadow: "0 18px 40px rgba(27, 67, 50, 0.15)",
                    }}
                  />
                ))}
              </Box>
            </Reveal>
          )}
        </Box>

        {service.benefits && (
          <Box sx={{ mt: { xs: 5, md: 7 }, display: "grid", gap: { xs: 2, md: 2.5 }, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
            {service.benefits.map((benefit, index) => {
              const Icon = BENEFIT_ICONS[benefit.icon] || CheckRounded;
              return (
                <Reveal key={benefit.title} delay={index * 100} sx={{ height: "100%" }}>
                  <Box
                    sx={{
                      height: "100%",
                      p: 3,
                      borderRadius: "24px 24px 24px 8px",
                      backgroundColor: "#FFFFFF",
                      boxShadow: "0 16px 38px rgba(27, 67, 50, 0.08)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": { transform: "translateY(-5px)", boxShadow: "0 24px 50px rgba(27, 67, 50, 0.14)", "& .benefit-icon": { transform: "rotate(-8deg) scale(1.06)" } },
                    }}
                  >
                    <Box
                      className="benefit-icon"
                      sx={{ width: 52, height: 52, mb: 2, borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: GREEN.main, backgroundColor: GREEN.mist, transition: "transform 0.3s ease" }}
                    >
                      <Icon />
                    </Box>
                    <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", color: GREEN.ink }}>{benefit.title}</Typography>
                    <Typography sx={{ mt: 0.75, color: "text.secondary", lineHeight: 1.65 }}>{benefit.text}</Typography>
                  </Box>
                </Reveal>
              );
            })}
          </Box>
        )}
      </Container>

      <Box id="offerings" sx={{ backgroundColor: "#FFFFFF", py: { xs: 6, md: 9 }, scrollMarginTop: HEADER_OFFSET }}>
        <Container maxWidth="lg">
          <Reveal>
            <SectionTitle eyebrow="What we offer" title="Pick what you need" subtitle="Tick the areas you'd like help with and we'll add them to your request." />
          </Reveal>
          <Box sx={{ display: "grid", gap: 1.25, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" } }}>
            {(service.offerings || []).map((offer, index) => (
              <Reveal key={offer} delay={(index % 3) * 60}>
                <OfferingToggle label={offer} selected={picked.includes(offer)} onToggle={() => toggle(offer)} />
              </Reveal>
            ))}
          </Box>
          <Box
            aria-live="polite"
            sx={{
              mt: 3,
              p: { xs: 2, md: 2.25 },
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "space-between",
              gap: 2,
              borderRadius: "20px",
              backgroundColor: picked.length ? GREEN.deep : GREEN.cream,
              color: picked.length ? "#FFFFFF" : GREEN.ink,
              transition: "background-color 0.3s ease, color 0.3s ease",
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 800 }}>
                {picked.length ? `${picked.length} ${picked.length === 1 ? "item" : "items"} selected` : "Nothing selected yet"}
              </Typography>
              <Typography sx={{ fontSize: "0.84rem", opacity: 0.8 }}>
                {picked.length ? picked.slice(0, 3).join(", ") + (picked.length > 3 ? ` +${picked.length - 3} more` : "") : "Select one or more offerings above, or just send a general request."}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
              {picked.length > 0 && (
                <Button onClick={() => setPicked([])} sx={{ minHeight: 46, px: 2, borderRadius: 999, fontWeight: 700, color: "inherit", "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" } }}>
                  Clear
                </Button>
              )}
              <Button
                onClick={() => request(picked.length ? { needs: picked.join(", ") } : {})}
                endIcon={<ArrowForwardRounded />}
                sx={
                  picked.length
                    ? { minHeight: 46, px: 3, borderRadius: 999, fontWeight: 700, color: GREEN.deep, backgroundColor: "#FFFFFF", "&:hover": { backgroundColor: GREEN.mist } }
                    : { ...primaryButtonSx, minHeight: 46, px: 3, fontSize: "0.95rem" }
                }
              >
                {picked.length ? "Request these" : "Send a request"}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {service.process && (
        <Container id="process" maxWidth="lg" sx={{ py: { xs: 6, md: 9 }, scrollMarginTop: HEADER_OFFSET }}>
          <Reveal>
            <SectionTitle eyebrow="Our process" title="How we deliver it" />
          </Reveal>
          <Box sx={{ display: "grid", gap: { xs: 2, md: 2.5 }, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" } }}>
            {service.process.map((step, index) => (
              <Reveal key={step.title} delay={index * 100} sx={{ height: "100%" }}>
                <Box
                  sx={{
                    position: "relative",
                    height: "100%",
                    p: 3,
                    pt: 4,
                    overflow: "hidden",
                    borderRadius: "24px 24px 24px 8px",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid rgba(27, 67, 50, 0.06)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": { transform: "translateY(-5px)", boxShadow: "0 20px 44px rgba(27, 67, 50, 0.12)" },
                    "&::before": { content: '""', position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${GREEN.light}, ${GREEN.main})`, opacity: 0.3 + index * 0.23 },
                  }}
                >
                  <Typography sx={{ fontWeight: 800, fontSize: "2.4rem", lineHeight: 1, color: "rgba(64, 145, 108, 0.2)" }}>0{index + 1}</Typography>
                  <Typography sx={{ mt: 1.5, fontWeight: 800, fontSize: "1.08rem", color: GREEN.ink }}>{step.title}</Typography>
                  <Typography sx={{ mt: 0.75, color: "text.secondary", lineHeight: 1.65, fontSize: "0.92rem" }}>{step.text}</Typography>
                </Box>
              </Reveal>
            ))}
          </Box>
        </Container>
      )}

      {service.packages && (
        <Box id="packages" sx={{ py: { xs: 6, md: 9 }, scrollMarginTop: HEADER_OFFSET, background: `linear-gradient(160deg, ${GREEN.deep}, ${GREEN.main})` }}>
          <Container maxWidth="lg">
            <Reveal>
              <SectionTitle light eyebrow="Packages" title="Options for every budget" subtitle="Indicative starting prices. Every quote is tailored after a free consultation." />
            </Reveal>
            <Box sx={{ display: "grid", gap: { xs: 2, md: 2.5 }, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, alignItems: "stretch" }}>
              {service.packages.map((pack, index) => (
                <Reveal key={pack.name} delay={index * 100} sx={{ height: "100%" }}>
                  <Box
                    sx={{
                      position: "relative",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      p: 3,
                      borderRadius: "26px 26px 26px 8px",
                      backgroundColor: "#FFFFFF",
                      color: GREEN.ink,
                      border: pack.popular ? `2px solid ${GREEN.light}` : "2px solid transparent",
                      boxShadow: pack.popular ? "0 30px 60px rgba(0, 0, 0, 0.3)" : "0 16px 36px rgba(0, 0, 0, 0.15)",
                      transform: { md: pack.popular ? "translateY(-10px)" : "none" },
                      transition: "transform 0.3s ease",
                      "&:hover": { transform: { md: pack.popular ? "translateY(-16px)" : "translateY(-6px)" } },
                    }}
                  >
                    {pack.popular && (
                      <Box sx={{ position: "absolute", top: -14, right: 20, display: "inline-flex", alignItems: "center", gap: 0.5, px: 1.5, py: 0.5, borderRadius: 999, fontSize: "0.75rem", fontWeight: 800, color: "#5B3B00", backgroundColor: "#FFD76A", boxShadow: "0 8px 18px rgba(0,0,0,0.2)" }}>
                        <StarRounded sx={{ fontSize: 15 }} />
                        Most popular
                      </Box>
                    )}
                    <Typography sx={{ fontWeight: 800, fontSize: "1.15rem" }}>{pack.name}</Typography>
                    <Box sx={{ mt: 1.5, mb: 2, display: "flex", alignItems: "baseline", gap: 0.75, flexWrap: "wrap" }}>
                      {pack.price ? (
                        <>
                          {pack.unit === "from" && <Typography sx={{ fontSize: "0.85rem", color: "text.secondary" }}>From</Typography>}
                          <Typography sx={{ fontWeight: 800, fontSize: "1.9rem", lineHeight: 1, color: GREEN.deep }}>{formatKES(pack.price)}</Typography>
                          {pack.unit !== "from" && <Typography sx={{ fontSize: "0.85rem", color: "text.secondary" }}>{pack.unit}</Typography>}
                        </>
                      ) : (
                        <Typography sx={{ fontWeight: 800, fontSize: "1.9rem", lineHeight: 1, color: GREEN.deep }}>Custom quote</Typography>
                      )}
                    </Box>
                    <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, flex: 1, display: "grid", gap: 1.1, alignContent: "start" }}>
                      {pack.features.map((feature) => (
                        <Box key={feature} component="li" sx={{ display: "flex", alignItems: "flex-start", gap: 1, fontSize: "0.92rem", color: "#3C4A42" }}>
                          <Box sx={{ mt: "2px", width: 18, height: 18, flexShrink: 0, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: GREEN.mist, color: GREEN.main }}>
                            <CheckRounded sx={{ fontSize: 13 }} />
                          </Box>
                          {feature}
                        </Box>
                      ))}
                    </Box>
                    <Button
                      fullWidth
                      onClick={() => request({ package: pack.name })}
                      sx={
                        pack.popular
                          ? { ...primaryButtonSx, mt: 3, minHeight: 48, fontSize: "0.95rem" }
                          : { mt: 3, minHeight: 48, borderRadius: 999, fontWeight: 700, color: GREEN.main, border: `1px solid ${GREEN.light}`, "&:hover": { backgroundColor: GREEN.mist } }
                      }
                    >
                      {pack.price ? `Choose ${pack.name}` : "Get a quote"}
                    </Button>
                  </Box>
                </Reveal>
              ))}
            </Box>
          </Container>
        </Box>
      )}

      {related.length > 0 && (
        <Container id="projects" maxWidth="lg" sx={{ py: { xs: 6, md: 9 }, scrollMarginTop: HEADER_OFFSET }}>
          <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
            <Reveal>
              <SectionTitle eyebrow="Our work" title="Recent projects" />
            </Reveal>
            <Button onClick={() => navigate("/projects")} endIcon={<ArrowForwardRounded />} sx={{ mb: { xs: 3, md: 4 }, fontWeight: 700, color: GREEN.main, borderRadius: 999 }}>
              All projects
            </Button>
          </Box>
          <Box sx={{ display: "grid", gap: { xs: 2.5, md: 3 }, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" } }}>
            {related.map((project, index) => (
              <Reveal key={project.id} delay={index * 90} sx={{ height: "100%" }}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </Box>
        </Container>
      )}

      {service.faqs && (
        <Box id="faq" sx={{ backgroundColor: "#FFFFFF", py: { xs: 6, md: 9 }, scrollMarginTop: HEADER_OFFSET }}>
          <Container maxWidth="md">
            <Reveal>
              <SectionTitle eyebrow="FAQ" title="Common questions" />
            </Reveal>
            {service.faqs.map((faq, index) => (
              <Reveal key={faq.q} delay={index * 80}>
                <Accordion
                  disableGutters
                  elevation={0}
                  sx={{
                    mb: 1.5,
                    borderRadius: "18px !important",
                    border: "1px solid rgba(27, 67, 50, 0.1)",
                    backgroundColor: GREEN.cream,
                    "&:before": { display: "none" },
                    "&.Mui-expanded": { backgroundColor: "#FFFFFF", borderColor: GREEN.light, boxShadow: "0 16px 36px rgba(27, 67, 50, 0.1)" },
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <Box sx={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", backgroundColor: GREEN.main }}>
                        <ExpandMoreRounded fontSize="small" />
                      </Box>
                    }
                    sx={{ px: { xs: 2, md: 3 }, py: 0.75 }}
                  >
                    <Typography sx={{ fontWeight: 700, color: GREEN.ink }}>{faq.q}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: { xs: 2, md: 3 }, pt: 0, pb: 2.5 }}>
                    <Typography sx={{ color: "text.secondary", lineHeight: 1.75 }}>{faq.a}</Typography>
                  </AccordionDetails>
                </Accordion>
              </Reveal>
            ))}
          </Container>
        </Box>
      )}

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography component="h2" sx={{ mb: 2, fontWeight: 800, fontSize: { xs: "1.25rem", md: "1.4rem" }, color: GREEN.ink }}>
          Explore other services
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5, overflowX: "auto", pb: 1.5, mx: { xs: -2, sm: 0 }, px: { xs: 2, sm: 0 }, scrollSnapType: "x mandatory", scrollbarWidth: "thin" }}>
          {others.map((item) => (
            <Box
              key={item.slug}
              component="button"
              type="button"
              onClick={() => navigate(`/services/${item.slug}`)}
              sx={{
                flex: "0 0 auto",
                width: 230,
                scrollSnapAlign: "start",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                textAlign: "left",
                fontFamily: "inherit",
                cursor: "pointer",
                border: "1px solid rgba(27, 67, 50, 0.08)",
                borderRadius: "18px 18px 18px 6px",
                color: GREEN.ink,
                backgroundColor: "#FFFFFF",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                "&:hover": { transform: "translateY(-3px)", boxShadow: "0 14px 30px rgba(27, 67, 50, 0.12)" },
                "&:focus-visible": { outline: `3px solid ${GREEN.light}`, outlineOffset: 2 },
              }}
            >
              <ServiceIcon slug={item.slug} size={44} />
              <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", lineHeight: 1.3 }}>{item.name}</Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

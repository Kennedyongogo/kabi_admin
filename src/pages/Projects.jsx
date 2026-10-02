import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Container, IconButton, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import {
  ArrowForwardRounded,
  ChevronLeftRounded,
  ChevronRightRounded,
  CloseRounded,
  FormatQuoteRounded,
  MapOutlined,
  PlaceOutlined,
  SearchOffRounded,
  WorkOutlineRounded,
} from "@mui/icons-material";
import { allServices, getService, projectImpact, projects } from "../data/portfolioContent";
import { GREEN, PageHero, Reveal, SectionHeading } from "../components/PageSections";
import { ChoicePill, EmptyState, PillRow, primaryButtonSx } from "../components/FormControls";
import { ServiceIcon, StatusBadge } from "../components/ServiceBits";
import ProjectCard from "../components/ProjectCard";
import BeforeAfter from "../components/BeforeAfter";

const ALL = "All";
const STATUSES = [ALL, "Completed", "Ongoing"];

const counties = Object.entries(
  projects.reduce((acc, p) => ({ ...acc, [p.county]: (acc[p.county] || 0) + 1 }), {})
).sort((a, b) => b[1] - a[1]);

const quotes = projects.filter((p) => p.testimonial);

const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
};

function Spotlight({ project }) {
  const navigate = useNavigate();
  const service = getService(project.service);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.15fr 1fr" },
        gap: { xs: 3, md: 5 },
        alignItems: "center",
        p: { xs: 2, md: 3 },
        borderRadius: "34px 34px 34px 8px",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 24px 60px rgba(27, 67, 50, 0.1)",
      }}
    >
      <Box>
        <BeforeAfter before={project.before} after={project.after} alt={project.name} ratio="4 / 3" />
        <Typography sx={{ mt: 1.25, textAlign: "center", fontSize: "0.8rem", color: "text.secondary" }}>
          Drag the slider to compare before and after
        </Typography>
      </Box>
      <Box sx={{ px: { xs: 1, md: 0 }, pb: { xs: 1, md: 0 } }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
          <Box component="span" sx={{ px: 1.25, py: 0.4, borderRadius: 999, fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#FFFFFF", background: `linear-gradient(135deg, ${GREEN.light}, ${GREEN.main})` }}>
            Featured project
          </Box>
          <StatusBadge status={project.status} sx={{ backgroundColor: GREEN.mist }} />
        </Box>
        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <ServiceIcon slug={project.service} size={30} sx={{ boxShadow: "none" }} />
          <Typography sx={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: GREEN.mid }}>{service?.name}</Typography>
        </Box>
        <Typography component="h2" sx={{ mt: 1.25, fontWeight: 800, fontSize: { xs: "1.55rem", md: "2.1rem" }, lineHeight: 1.2, letterSpacing: "-0.02em", color: GREEN.ink }}>
          {project.name}
        </Typography>
        <Typography sx={{ mt: 1, display: "flex", alignItems: "center", gap: 0.5, fontSize: "0.9rem", color: "text.secondary" }}>
          <PlaceOutlined sx={{ fontSize: 17, color: GREEN.mid }} />
          {project.location} · {project.year}
        </Typography>
        <Typography sx={{ mt: 1.5, color: "#3C4A42", lineHeight: 1.75 }}>{project.summary}</Typography>
        <Box sx={{ mt: 2.5, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
          {project.results.map((r) => (
            <Box key={r.label} sx={{ p: 1.5, borderRadius: "16px", backgroundColor: GREEN.cream }}>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.15rem", md: "1.4rem" }, lineHeight: 1, color: GREEN.deep }}>{r.value}</Typography>
              <Typography sx={{ mt: 0.5, fontSize: "0.74rem", lineHeight: 1.35, color: "text.secondary" }}>{r.label}</Typography>
            </Box>
          ))}
        </Box>
        <Button onClick={() => navigate(`/projects/${project.slug}`)} endIcon={<ArrowForwardRounded />} sx={{ ...primaryButtonSx, mt: 3, minHeight: 48, px: 3, fontSize: "0.95rem" }}>
          Read the case study
        </Button>
      </Box>
    </Box>
  );
}

function QuoteCarousel() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const item = quotes[index];

  useEffect(() => {
    if (paused || quotes.length < 2) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % quotes.length), 7000);
    return () => clearInterval(id);
  }, [paused]);

  if (!item) return null;
  const go = (step) => setIndex((i) => (i + step + quotes.length) % quotes.length);

  return (
    <Box
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      sx={{
        position: "relative",
        overflow: "hidden",
        p: { xs: 3, md: 5 },
        borderRadius: "32px 32px 8px 32px",
        color: "#FFFFFF",
        background: `radial-gradient(circle at 0% 0%, rgba(82, 183, 136, 0.35), transparent 45%), linear-gradient(150deg, ${GREEN.deep}, ${GREEN.main})`,
        boxShadow: "0 24px 50px rgba(27, 67, 50, 0.25)",
      }}
    >
      <FormatQuoteRounded aria-hidden sx={{ position: "absolute", right: 10, top: -20, fontSize: 200, color: "rgba(216, 243, 220, 0.07)" }} />
      <Box
        key={item.id}
        aria-live="polite"
        sx={{
          position: "relative",
          display: "grid",
          gap: { xs: 2.5, md: 4 },
          gridTemplateColumns: { xs: "1fr", md: "200px 1fr" },
          alignItems: "center",
          "@keyframes quoteIn": { from: { opacity: 0, transform: "translateY(10px)" }, to: { opacity: 1, transform: "none" } },
          animation: "quoteIn 0.5s ease",
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
        }}
      >
        <Box component="img" src={item.cover} alt="" sx={{ width: { xs: 88, md: "100%" }, aspectRatio: "1 / 1", objectFit: "cover", borderRadius: "24px 24px 24px 6px", border: "3px solid rgba(216, 243, 220, 0.35)" }} />
        <Box>
          <Typography sx={{ fontSize: { xs: "1.1rem", md: "1.35rem" }, fontWeight: 600, lineHeight: 1.6 }}>"{item.testimonial.quote}"</Typography>
          <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
            <Box>
              <Typography sx={{ fontWeight: 800 }}>{item.testimonial.name}</Typography>
              <Typography sx={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.75)" }}>
                {item.testimonial.role}, {item.client}
              </Typography>
            </Box>
            <Button onClick={() => navigate(`/projects/${item.slug}`)} endIcon={<ArrowForwardRounded />} sx={{ borderRadius: 999, fontWeight: 700, color: GREEN.mist, "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.08)" } }}>
              See this project
            </Button>
          </Box>
        </Box>
      </Box>
      <Box sx={{ position: "relative", mt: 3, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <Box sx={{ display: "flex", gap: 0.75 }}>
          {quotes.map((q, i) => (
            <Box
              key={q.id}
              component="button"
              type="button"
              aria-label={`Show testimonial ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => setIndex(i)}
              sx={{ width: i === index ? 26 : 9, height: 9, p: 0, border: 0, borderRadius: 99, cursor: "pointer", backgroundColor: i === index ? GREEN.light : "rgba(216, 243, 220, 0.35)", transition: "all 0.3s ease" }}
            />
          ))}
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          {[
            { label: "Previous testimonial", icon: ChevronLeftRounded, step: -1 },
            { label: "Next testimonial", icon: ChevronRightRounded, step: 1 },
          ].map(({ label, icon: Icon, step }) => (
            <IconButton key={label} aria-label={label} onClick={() => go(step)} sx={{ color: "#FFFFFF", border: "1px solid rgba(216, 243, 220, 0.35)", "&:hover": { backgroundColor: "rgba(216, 243, 220, 0.15)" } }}>
              <Icon />
            </IconButton>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default function Projects() {
  const navigate = useNavigate();
  const [service, setService] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [county, setCounty] = useState(null);

  const featured = projects.find((p) => p.featured) || projects[0];
  const results = useMemo(
    () =>
      projects.filter(
        (p) => (service === ALL || p.service === service) && (status === ALL || p.status === status) && (!county || p.county === county)
      ),
    [service, status, county]
  );
  const filtering = service !== ALL || status !== ALL || county;
  const servicesWithProjects = allServices.filter((s) => s.projectCount);

  const clearFilters = () => {
    setService(ALL);
    setStatus(ALL);
    setCounty(null);
  };

  return (
    <Box sx={{ backgroundColor: GREEN.cream, overflowX: "hidden" }}>
      <Helmet>
        <title>Projects | Mcaludoh Consultancy</title>
        <meta name="description" content="Case studies of hydroponic farms, vertical gardens, organic conversions, agronomy programmes, landscaping, trainings and EIAs delivered by Mcaludoh Consultancy." />
      </Helmet>

      <PageHero
        eyebrow="Our projects"
        title="Real farms."
        highlight="Real results."
        subtitle="See how we've helped hotels, schools, farmers and developers across Kenya grow more, spend less and build greener spaces."
      >
        <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 1.25 }}>
          {[
            { icon: WorkOutlineRounded, text: `${projects.length} case studies` },
            { icon: MapOutlined, text: `${counties.length} counties featured` },
          ].map(({ icon: Icon, text }) => (
            <Box key={text} sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 2, py: 1, borderRadius: 999, border: "1px solid rgba(216, 243, 220, 0.3)", backgroundColor: "rgba(216, 243, 220, 0.1)", backdropFilter: "blur(10px)", fontSize: "0.88rem", fontWeight: 600 }}>
              <Icon sx={{ fontSize: 18, color: GREEN.light }} />
              {text}
            </Box>
          ))}
        </Box>
      </PageHero>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, mt: { xs: -8, md: -9 } }}>
        <Reveal>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, borderRadius: "26px 26px 26px 8px", overflow: "hidden", backgroundColor: "#FFFFFF", boxShadow: "0 20px 50px rgba(27, 67, 50, 0.12)" }}>
            {projectImpact.map((item, index) => (
              <Box
                key={item.label}
                sx={{
                  p: { xs: 2.25, md: 3 },
                  textAlign: "center",
                  borderLeft: { md: index ? "1px solid rgba(27, 67, 50, 0.08)" : "none", xs: index % 2 ? "1px solid rgba(27, 67, 50, 0.08)" : "none" },
                  borderTop: { xs: index > 1 ? "1px solid rgba(27, 67, 50, 0.08)" : "none", md: "none" },
                }}
              >
                <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.6rem", md: "2.1rem" }, letterSpacing: "-0.02em", background: `linear-gradient(135deg, ${GREEN.mid}, ${GREEN.deep})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                  {item.value}
                </Typography>
                <Typography sx={{ mt: 0.25, fontSize: "0.85rem", fontWeight: 600, color: "text.secondary" }}>{item.label}</Typography>
              </Box>
            ))}
          </Box>
        </Reveal>
      </Container>

      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 9 } }}>
        <Reveal>
          <Spotlight project={featured} />
        </Reveal>
      </Container>

      <Container id="all-projects" maxWidth="lg" sx={{ pt: { xs: 7, md: 10 }, pb: { xs: 7, md: 9 }, scrollMarginTop: 60 }}>
        <Reveal>
          <SectionHeading eyebrow="Case studies" title="Explore our work" subtitle="Filter by service, status or location." />
        </Reveal>

        <Reveal>
          <Box sx={{ mb: 3, p: { xs: 1.75, md: 2.25 }, display: "grid", gap: 1.5, borderRadius: "24px 24px 24px 8px", backgroundColor: "#FFFFFF", boxShadow: "0 16px 40px rgba(27, 67, 50, 0.08)" }}>
            <PillRow label="Filter by service">
              <ChoicePill selected={service === ALL} onClick={() => setService(ALL)} count={projects.length}>
                All services
              </ChoicePill>
              {servicesWithProjects.map((s) => (
                <ChoicePill key={s.slug} selected={service === s.slug} onClick={() => setService(s.slug)} count={s.projectCount}>
                  {s.name}
                </ChoicePill>
              ))}
            </PillRow>
            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>
              <PillRow label="Filter by status" sx={{ flexWrap: "nowrap" }}>
                {STATUSES.map((s) => (
                  <ChoicePill key={s} selected={status === s} onClick={() => setStatus(s)}>
                    {s === ALL ? "Any status" : s}
                  </ChoicePill>
                ))}
              </PillRow>
              {county && (
                <Box
                  component="button"
                  type="button"
                  onClick={() => setCounty(null)}
                  aria-label={`Remove ${county} filter`}
                  sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, px: 1.5, py: 0.75, fontFamily: "inherit", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", border: 0, borderRadius: 999, color: "#FFFFFF", backgroundColor: GREEN.deep }}
                >
                  <PlaceOutlined sx={{ fontSize: 16 }} />
                  {county}
                  <CloseRounded sx={{ fontSize: 16 }} />
                </Box>
              )}
            </Box>
          </Box>
        </Reveal>

        <Typography aria-live="polite" sx={{ mb: 2.5, color: "text.secondary", fontSize: "0.9rem" }}>
          Showing <strong>{results.length}</strong> of {projects.length} projects
          {filtering && (
            <Box component="button" type="button" onClick={clearFilters} sx={{ ml: 1.5, p: 0, border: 0, background: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "inherit", fontWeight: 700, color: GREEN.main, textDecoration: "underline" }}>
              Clear filters
            </Box>
          )}
        </Typography>

        {results.length ? (
          <Box sx={{ display: "grid", gap: { xs: 2.5, md: 3 }, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" } }}>
            {results.map((project, index) => (
              <Reveal key={project.id} delay={(index % 3) * 90} sx={{ height: "100%" }}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </Box>
        ) : (
          <EmptyState
            icon={SearchOffRounded}
            title="No projects match those filters"
            text="Try another combination, or ask us about similar work we've done."
            action={
              <Button onClick={clearFilters} sx={{ ...primaryButtonSx, minHeight: 46, px: 3, fontSize: "0.95rem" }}>
                Show all projects
              </Button>
            }
          />
        )}
      </Container>

      <Box sx={{ backgroundColor: "#FFFFFF", py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "grid", gap: { xs: 3, md: 5 }, gridTemplateColumns: { xs: "1fr", md: "4fr 8fr" }, alignItems: "center" }}>
            <Reveal>
              <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: GREEN.mid }}>Where we work</Typography>
              <Typography component="h2" sx={{ mt: 1, fontWeight: 800, fontSize: { xs: "1.6rem", md: "2rem" }, lineHeight: 1.2, color: GREEN.ink }}>
                Projects across Kenya
              </Typography>
              <Typography sx={{ mt: 1, color: "text.secondary", lineHeight: 1.7 }}>
                Tap a county to see the work we've done there. Site visits are available nationwide.
              </Typography>
            </Reveal>
            <Reveal delay={100}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.25 }}>
                {counties.map(([name, count]) => {
                  const on = county === name;
                  return (
                    <Box
                      key={name}
                      component="button"
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        setCounty(on ? null : name);
                        scrollToId("all-projects");
                      }}
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1.25,
                        p: 1,
                        pr: 2,
                        fontFamily: "inherit",
                        cursor: "pointer",
                        borderRadius: 999,
                        border: `1px solid ${on ? GREEN.main : "rgba(27, 67, 50, 0.12)"}`,
                        color: on ? "#FFFFFF" : GREEN.ink,
                        backgroundColor: on ? GREEN.main : GREEN.cream,
                        transition: "all 0.2s ease",
                        "&:hover": { transform: "translateY(-2px)", borderColor: GREEN.mid, boxShadow: "0 10px 22px rgba(27, 67, 50, 0.12)" },
                        "&:focus-visible": { outline: `3px solid ${GREEN.light}`, outlineOffset: 2 },
                      }}
                    >
                      <Box sx={{ width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: on ? GREEN.deep : "#FFFFFF", backgroundColor: on ? GREEN.mist : GREEN.mid }}>
                        <PlaceOutlined sx={{ fontSize: 18 }} />
                      </Box>
                      <Box sx={{ textAlign: "left" }}>
                        <Typography sx={{ fontWeight: 800, fontSize: "0.92rem", lineHeight: 1.1 }}>{name}</Typography>
                        <Typography sx={{ fontSize: "0.72rem", opacity: 0.75 }}>
                          {count} {count === 1 ? "project" : "projects"}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Reveal>
          </Box>
        </Container>
      </Box>

      {quotes.length > 0 && (
        <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 9 } }}>
          <Reveal>
            <QuoteCarousel />
          </Reveal>
        </Container>
      )}

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
        <Reveal>
          <Box sx={{ p: { xs: 3, md: 4 }, display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "flex-start", md: "center" }, justifyContent: "space-between", gap: 3, borderRadius: "28px", background: `linear-gradient(120deg, ${GREEN.mist}, #EEF7F0)` }}>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.35rem", md: "1.6rem" }, color: GREEN.ink }}>Your project could be next</Typography>
              <Typography sx={{ mt: 0.5, color: "text.secondary" }}>Tell us what you have in mind and we'll arrange a free consultation.</Typography>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.25 }}>
              <Button onClick={() => navigate("/request-service")} endIcon={<ArrowForwardRounded />} sx={primaryButtonSx}>
                Start a project
              </Button>
              <Button onClick={() => navigate("/services")} sx={{ minHeight: 52, px: 3, borderRadius: 999, fontWeight: 700, color: GREEN.main, border: `1px solid ${GREEN.light}`, "&:hover": { backgroundColor: "#FFFFFF" } }}>
                View services
              </Button>
            </Box>
          </Box>
        </Reveal>
      </Container>
    </Box>
  );
}

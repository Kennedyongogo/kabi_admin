import React, { useMemo, useState } from "react";
import { Box, Button, Container, InputAdornment, TextField, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  ArrowForwardRounded,
  CloseRounded,
  EventAvailableRounded,
  GroupsRounded,
  HowToRegRounded,
  LaptopMacRounded,
  PlaceOutlined,
  SearchOffRounded,
  SearchRounded,
  SpaRounded,
  TravelExploreRounded,
  VerifiedRounded,
  WhatsApp,
  WorkspacePremiumRounded,
} from "@mui/icons-material";
import { courseCategories, courses, trainingHighlights } from "../data/prototypeContent";
import { GREEN, PageHero, Reveal, SectionHeading } from "../components/PageSections";
import CourseCard, { SeatsBadge, upcomingSessions } from "../components/CourseCard";
import { ChoicePill, EmptyState, PillRow, fieldSx, primaryButtonSx } from "../components/FormControls";
import { daysUntil } from "../utils/format";

const ALL = "All";
const MODES = [
  { value: ALL, label: "Any format" },
  { value: "Physical", label: "In person", icon: PlaceOutlined },
  { value: "Online", label: "Online", icon: LaptopMacRounded },
];

const steps = [
  { icon: TravelExploreRounded, title: "Pick a course", text: "Choose the topic, level and date that suit your goals." },
  { icon: HowToRegRounded, title: "Reserve your seat", text: "Register online in two minutes. We confirm by phone and email." },
  { icon: SpaRounded, title: "Learn by doing", text: "Most of the time is spent practising on real farm systems." },
  { icon: WorkspacePremiumRounded, title: "Get certified", text: "Receive a verifiable certificate and ongoing support." },
];

const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
};

const matches = (course, query) => {
  if (!query) return true;
  const haystack = [course.name, course.category, course.short_description, course.description, course.audience]
    .join(" ")
    .toLowerCase();
  return query.toLowerCase().split(/\s+/).filter(Boolean).every((word) => haystack.includes(word));
};

function CertificateCheck() {
  const navigate = useNavigate();
  const [number, setNumber] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const value = number.trim();
    if (value.length < 4) {
      setError("Enter the certificate number printed on the certificate.");
      return;
    }
    navigate(`/verify/${encodeURIComponent(value)}`);
  };

  return (
    <Box
      id="verify"
      component="form"
      noValidate
      onSubmit={submit}
      sx={{
        height: "100%",
        p: { xs: 3, md: 4 },
        borderRadius: "30px 30px 30px 8px",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 24px 60px rgba(27, 67, 50, 0.1)",
        scrollMarginTop: 90,
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          mb: 2,
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
          background: `linear-gradient(150deg, ${GREEN.light}, ${GREEN.main})`,
        }}
      >
        <VerifiedRounded />
      </Box>
      <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: "1.35rem", md: "1.55rem" }, color: GREEN.ink }}>
        Verify a certificate
      </Typography>
      <Typography sx={{ mt: 0.75, mb: 2.5, color: "text.secondary", lineHeight: 1.7 }}>
        Employers and partners can confirm that a Mcaludoh training certificate is genuine.
      </Typography>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.25, alignItems: { sm: "flex-start" } }}>
        <TextField
          fullWidth
          placeholder="e.g. MCA-CERT-2026-0142"
          value={number}
          onChange={(e) => {
            setNumber(e.target.value.toUpperCase());
            if (error) setError("");
          }}
          error={Boolean(error)}
          helperText={error || " "}
          slotProps={{ htmlInput: { "aria-label": "Certificate number" } }}
          sx={fieldSx}
        />
        <Button type="submit" endIcon={<ArrowForwardRounded />} sx={{ ...primaryButtonSx, minHeight: 56, flexShrink: 0 }}>
          Verify
        </Button>
      </Box>
    </Box>
  );
}

export default function Training() {
  const navigate = useNavigate();
  const { settings } = useOutletContext() || {};
  const whatsapp = String(settings?.whatsapp || settings?.phone || "+254 700 000000").replace(/\D/g, "");

  const [category, setCategory] = useState(ALL);
  const [mode, setMode] = useState(ALL);
  const [query, setQuery] = useState("");

  const results = useMemo(
    () =>
      courses.filter(
        (c) =>
          (category === ALL || c.category === category) &&
          (mode === ALL || new RegExp(mode, "i").test(c.mode || "")) &&
          matches(c, query.trim())
      ),
    [category, mode, query]
  );

  const startingSoon = useMemo(
    () =>
      courses
        .flatMap((course) => upcomingSessions(course).map((session) => ({ course, session })))
        .sort((a, b) => new Date(a.session.start_date) - new Date(b.session.start_date))
        .slice(0, 3),
    []
  );

  const filtering = category !== ALL || mode !== ALL || query.trim() !== "";
  const clearFilters = () => {
    setCategory(ALL);
    setMode(ALL);
    setQuery("");
  };

  return (
    <Box sx={{ backgroundColor: GREEN.cream, overflowX: "hidden" }}>
      <Helmet>
        <title>Training | Mcaludoh Consultancy</title>
        <meta
          name="description"
          content="Hands-on farmer training in hydroponics, vertical farming, organic agriculture, agronomy, greenhouse management and landscaping, with certificates."
        />
      </Helmet>

      <PageHero
        eyebrow="Training"
        title="Learn by doing with"
        highlight="practical farm training."
        subtitle="Short, hands-on courses led by Aludoh and our agronomists. Leave with real skills, a certificate and a team you can call for advice."
      >
        <Box sx={{ mt: 3.5, display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          <Button
            onClick={() => scrollToId("courses")}
            endIcon={<ArrowForwardRounded />}
            sx={{
              minHeight: 50,
              px: 3.5,
              borderRadius: 999,
              fontWeight: 700,
              color: GREEN.deep,
              backgroundColor: "#FFFFFF",
              "&:hover": { backgroundColor: GREEN.mist },
            }}
          >
            Browse courses
          </Button>
          <Button
            onClick={() => scrollToId("verify")}
            startIcon={<VerifiedRounded />}
            sx={{
              minHeight: 50,
              px: 3,
              borderRadius: 999,
              fontWeight: 700,
              color: "#FFFFFF",
              border: "1px solid rgba(216, 243, 220, 0.4)",
              backgroundColor: "rgba(216, 243, 220, 0.08)",
              backdropFilter: "blur(8px)",
              "&:hover": { backgroundColor: "rgba(216, 243, 220, 0.16)" },
            }}
          >
            Verify a certificate
          </Button>
        </Box>
      </PageHero>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, mt: { xs: -8, md: -9 } }}>
        <Reveal>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
              borderRadius: "26px 26px 26px 8px",
              overflow: "hidden",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 20px 50px rgba(27, 67, 50, 0.12)",
            }}
          >
            {trainingHighlights.map((item, index) => (
              <Box
                key={item.label}
                sx={{
                  p: { xs: 2.25, md: 3 },
                  textAlign: "center",
                  borderLeft: { md: index ? "1px solid rgba(27, 67, 50, 0.08)" : "none", xs: index % 2 ? "1px solid rgba(27, 67, 50, 0.08)" : "none" },
                  borderTop: { xs: index > 1 ? "1px solid rgba(27, 67, 50, 0.08)" : "none", md: "none" },
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "1.6rem", md: "2.1rem" },
                    letterSpacing: "-0.02em",
                    background: `linear-gradient(135deg, ${GREEN.mid}, ${GREEN.deep})`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {item.value}
                </Typography>
                <Typography sx={{ mt: 0.25, fontSize: "0.85rem", fontWeight: 600, color: "text.secondary" }}>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Reveal>
      </Container>

      {startingSoon.length > 0 && (
        <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 8 } }}>
          <Reveal>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2 }}>
              <Box
                sx={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  backgroundColor: "#F59E0B",
                  "@keyframes soonPulse": {
                    "0%": { boxShadow: "0 0 0 0 rgba(245, 158, 11, 0.6)" },
                    "70%": { boxShadow: "0 0 0 10px rgba(245, 158, 11, 0)" },
                    "100%": { boxShadow: "0 0 0 0 rgba(245, 158, 11, 0)" },
                  },
                  animation: "soonPulse 2s infinite",
                  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                }}
              />
              <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: "1.2rem", md: "1.35rem" }, color: GREEN.ink }}>
                Starting soon
              </Typography>
            </Box>
          </Reveal>
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
            {startingSoon.map(({ course, session }, index) => {
              const days = daysUntil(session.start_date);
              return (
                <Reveal key={session.id} delay={index * 90}>
                  <Box
                    component="button"
                    type="button"
                    onClick={() => navigate(`/training/${course.slug}`)}
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.75,
                      p: 1.5,
                      textAlign: "left",
                      fontFamily: "inherit",
                      cursor: "pointer",
                      border: "1px solid rgba(27, 67, 50, 0.08)",
                      borderRadius: "20px 20px 20px 6px",
                      backgroundColor: "#FFFFFF",
                      transition: "transform 0.25s ease, box-shadow 0.25s ease",
                      "&:hover": { transform: "translateY(-3px)", boxShadow: "0 16px 34px rgba(27, 67, 50, 0.12)" },
                      "&:focus-visible": { outline: `3px solid ${GREEN.light}`, outlineOffset: 2 },
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        flexShrink: 0,
                        borderRadius: "16px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#FFFFFF",
                        background: `linear-gradient(150deg, ${GREEN.mid}, ${GREEN.deep})`,
                      }}
                    >
                      <Typography sx={{ fontWeight: 800, fontSize: "1.35rem", lineHeight: 1 }}>
                        {new Date(session.start_date).getDate()}
                      </Typography>
                      <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        {new Date(session.start_date).toLocaleDateString("en-KE", { month: "short" })}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography noWrap sx={{ fontWeight: 800, color: GREEN.ink }}>
                        {course.name}
                      </Typography>
                      <Typography noWrap sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                        {session.location} · in {days} {days === 1 ? "day" : "days"}
                      </Typography>
                      <SeatsBadge seats={session.seats_left} sx={{ mt: 0.75 }} />
                    </Box>
                  </Box>
                </Reveal>
              );
            })}
          </Box>
        </Container>
      )}

      <Container id="courses" maxWidth="lg" sx={{ pt: { xs: 6, md: 8 }, pb: { xs: 7, md: 10 }, scrollMarginTop: 60 }}>
        <Reveal>
          <SectionHeading
            eyebrow="Our courses"
            title="Find the right course for you"
            subtitle="From first-time growers to commercial farm managers. Filter by topic or format."
          />
        </Reveal>

        <Reveal>
          <Box
            sx={{
              mb: 3,
              p: { xs: 1.75, md: 2.25 },
              display: "grid",
              gap: 1.5,
              borderRadius: "24px 24px 24px 8px",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 16px 40px rgba(27, 67, 50, 0.08)",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 1.5, alignItems: { md: "center" } }}>
              <TextField
                fullWidth
                placeholder="Search courses, e.g. greenhouse, tomatoes, business..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                slotProps={{
                  htmlInput: { "aria-label": "Search courses" },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRounded sx={{ color: GREEN.mid }} />
                      </InputAdornment>
                    ),
                    endAdornment: query && (
                      <InputAdornment position="end">
                        <Box
                          component="button"
                          type="button"
                          aria-label="Clear search"
                          onClick={() => setQuery("")}
                          sx={{ display: "flex", p: 0.5, border: 0, borderRadius: "50%", cursor: "pointer", color: GREEN.main, backgroundColor: GREEN.mist }}
                        >
                          <CloseRounded sx={{ fontSize: 16 }} />
                        </Box>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={fieldSx}
              />
              <PillRow label="Filter by format" sx={{ flexShrink: 0, flexWrap: "nowrap" }}>
                {MODES.map((item) => (
                  <ChoicePill key={item.value} icon={item.icon} selected={mode === item.value} onClick={() => setMode(item.value)}>
                    {item.label}
                  </ChoicePill>
                ))}
              </PillRow>
            </Box>
            <PillRow label="Filter by topic">
              {courseCategories.map((name) => (
                <ChoicePill
                  key={name}
                  selected={category === name}
                  onClick={() => setCategory(name)}
                  count={name === ALL ? courses.length : courses.filter((c) => c.category === name).length}
                >
                  {name === ALL ? "All topics" : name}
                </ChoicePill>
              ))}
            </PillRow>
          </Box>
        </Reveal>

        <Typography aria-live="polite" sx={{ mb: 2.5, color: "text.secondary", fontSize: "0.9rem" }}>
          Showing <strong>{results.length}</strong> of {courses.length} courses
          {filtering && (
            <Box
              component="button"
              type="button"
              onClick={clearFilters}
              sx={{ ml: 1.5, p: 0, border: 0, background: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "inherit", fontWeight: 700, color: GREEN.main, textDecoration: "underline" }}
            >
              Clear filters
            </Box>
          )}
        </Typography>

        {results.length ? (
          <Box sx={{ display: "grid", gap: { xs: 2.5, md: 3 }, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" } }}>
            {results.map((course, index) => (
              <Reveal key={course.id} delay={(index % 3) * 90} sx={{ height: "100%" }}>
                <CourseCard course={course} />
              </Reveal>
            ))}
          </Box>
        ) : (
          <EmptyState
            icon={SearchOffRounded}
            title="No courses match those filters"
            text="Try another topic or format, or ask us about a custom training for your group."
            action={
              <Button onClick={clearFilters} sx={{ ...primaryButtonSx, minHeight: 46, px: 3, fontSize: "0.95rem" }}>
                Show all courses
              </Button>
            }
          />
        )}
      </Container>

      <Box sx={{ backgroundColor: "#FFFFFF", py: { xs: 7, md: 9 } }}>
        <Container maxWidth="lg">
          <Reveal>
            <SectionHeading
              eyebrow="How it works"
              title="From sign-up to certificate in four steps"
              subtitle="Simple, transparent and supported at every stage."
            />
          </Reveal>
          <Box sx={{ display: "grid", gap: { xs: 2, md: 3 }, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" } }}>
            {steps.map(({ icon: Icon, title, text }, index) => (
              <Reveal key={title} delay={index * 100} sx={{ height: "100%" }}>
                <Box
                  sx={{
                    position: "relative",
                    height: "100%",
                    p: 3,
                    borderRadius: "24px 24px 24px 8px",
                    backgroundColor: GREEN.cream,
                    border: "1px solid rgba(27, 67, 50, 0.06)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      backgroundColor: "#FFFFFF",
                      boxShadow: "0 20px 44px rgba(27, 67, 50, 0.12)",
                    },
                  }}
                >
                  <Typography
                    aria-hidden
                    sx={{ position: "absolute", top: 14, right: 20, fontWeight: 800, fontSize: "2.6rem", lineHeight: 1, color: "rgba(64, 145, 108, 0.14)" }}
                  >
                    0{index + 1}
                  </Typography>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      mb: 2,
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#FFFFFF",
                      background: `linear-gradient(150deg, ${GREEN.mid}, ${GREEN.deep})`,
                      boxShadow: "0 10px 22px rgba(45, 106, 79, 0.3)",
                    }}
                  >
                    <Icon />
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: "1.08rem", color: GREEN.ink }}>{title}</Typography>
                  <Typography sx={{ mt: 0.75, color: "text.secondary", lineHeight: 1.65, fontSize: "0.92rem" }}>{text}</Typography>
                </Box>
              </Reveal>
            ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 9 } }}>
        <Box sx={{ display: "grid", gap: { xs: 3, md: 4 }, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, alignItems: "stretch" }}>
          <Reveal sx={{ height: "100%" }}>
            <CertificateCheck />
          </Reveal>
          <Reveal delay={120} sx={{ height: "100%" }}>
            <Box
              sx={{
                position: "relative",
                overflow: "hidden",
                height: "100%",
                p: { xs: 3, md: 4 },
                borderRadius: "30px 30px 8px 30px",
                color: "#FFFFFF",
                background: `radial-gradient(circle at 90% 10%, rgba(82, 183, 136, 0.4), transparent 45%), linear-gradient(150deg, ${GREEN.deep}, ${GREEN.main})`,
                boxShadow: "0 24px 50px rgba(27, 67, 50, 0.25)",
              }}
            >
              <GroupsRounded aria-hidden sx={{ position: "absolute", right: -20, bottom: -30, fontSize: 190, color: "rgba(216, 243, 220, 0.07)" }} />
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  mb: 2,
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: GREEN.deep,
                  backgroundColor: GREEN.mist,
                }}
              >
                <EventAvailableRounded />
              </Box>
              <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: "1.35rem", md: "1.55rem" } }}>
                Training for your group or organisation
              </Typography>
              <Typography sx={{ mt: 0.75, color: "rgba(255, 255, 255, 0.82)", lineHeight: 1.7 }}>
                We run tailored, on-site trainings for cooperatives, schools, NGOs, county programmes and companies, on your
                dates and at your location.
              </Typography>
              <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 1.25, position: "relative" }}>
                <Button
                  onClick={() => navigate("/request-service")}
                  endIcon={<ArrowForwardRounded />}
                  sx={{ minHeight: 48, px: 3, borderRadius: 999, fontWeight: 700, color: GREEN.deep, backgroundColor: "#FFFFFF", "&:hover": { backgroundColor: GREEN.mist } }}
                >
                  Request a custom training
                </Button>
                <Button
                  href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hello Mcaludoh, I'd like to organise a group training.")}`}
                  target="_blank"
                  rel="noreferrer"
                  startIcon={<WhatsApp />}
                  sx={{ minHeight: 48, px: 2.5, borderRadius: 999, fontWeight: 700, color: "#FFFFFF", border: "1px solid rgba(255, 255, 255, 0.35)", "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" } }}
                >
                  WhatsApp
                </Button>
              </Box>
            </Box>
          </Reveal>
        </Box>
      </Container>
    </Box>
  );
}

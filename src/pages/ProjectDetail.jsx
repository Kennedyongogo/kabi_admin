import React, { useMemo, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowBackRounded,
  ArrowForwardRounded,
  BusinessOutlined,
  CheckCircleRounded,
  ChevronRightRounded,
  EmojiEventsOutlined,
  FormatQuoteRounded,
  LightbulbOutlined,
  PlaceOutlined,
  ReportProblemOutlined,
  ScheduleRounded,
  SearchOffRounded,
  SquareFootRounded,
  ZoomOutMapRounded,
} from "@mui/icons-material";
import { getService, projects } from "../data/portfolioContent";
import { GREEN, Reveal } from "../components/PageSections";
import { EmptyState, primaryButtonSx } from "../components/FormControls";
import { ServiceIcon, StatusBadge } from "../components/ServiceBits";
import ProjectCard from "../components/ProjectCard";
import BeforeAfter from "../components/BeforeAfter";
import Lightbox from "../components/Lightbox";

function StoryStep({ icon: Icon, step, title, children, last }) {
  return (
    <Box sx={{ position: "relative", display: "grid", gridTemplateColumns: "52px 1fr", gap: { xs: 2, md: 2.5 }, pb: last ? 0 : 4 }}>
      {!last && <Box aria-hidden sx={{ position: "absolute", left: 25, top: 56, bottom: 6, borderLeft: `2px dashed ${GREEN.light}`, opacity: 0.6 }} />}
      <Box sx={{ width: 52, height: 52, borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", background: `linear-gradient(150deg, ${GREEN.mid}, ${GREEN.deep})`, boxShadow: "0 10px 22px rgba(45, 106, 79, 0.3)" }}>
        <Icon />
      </Box>
      <Box sx={{ pt: 0.5 }}>
        <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: GREEN.mid }}>{step}</Typography>
        <Typography component="h2" sx={{ mt: 0.25, fontWeight: 800, fontSize: { xs: "1.3rem", md: "1.45rem" }, color: GREEN.ink }}>
          {title}
        </Typography>
        <Box sx={{ mt: 1.25 }}>{children}</Box>
      </Box>
    </Box>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];
  const [viewing, setViewing] = useState(null);

  const photos = useMemo(
    () => (project?.images || []).map((src, i) => ({ id: `${project.id}-${i}`, file_url: src, caption: `${project.name} (${i + 1})`, alt_text: project.name })),
    [project]
  );

  if (!project) {
    return (
      <Box sx={{ backgroundColor: GREEN.cream, py: { xs: 8, md: 12 } }}>
        <Helmet>
          <title>Project not found | Mcaludoh Consultancy</title>
        </Helmet>
        <Container maxWidth="sm">
          <EmptyState
            icon={SearchOffRounded}
            title="We couldn't find that project"
            text="It may have been renamed. Browse all our case studies instead."
            action={
              <Button onClick={() => navigate("/projects")} startIcon={<ArrowBackRounded />} sx={{ ...primaryButtonSx, minHeight: 46, px: 3, fontSize: "0.95rem" }}>
                All projects
              </Button>
            }
          />
        </Container>
      </Box>
    );
  }

  const service = getService(project.service);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const related = [
    ...projects.filter((p) => p.id !== project.id && p.service === project.service),
    ...projects.filter((p) => p.id !== project.id && p.service !== project.service),
  ]
    .filter((p) => p.id !== prev.id && p.id !== next.id)
    .slice(0, 3);

  const facts = [
    { icon: BusinessOutlined, label: "Client", value: project.client },
    { icon: PlaceOutlined, label: "Location", value: project.location },
    { icon: SquareFootRounded, label: "Scale", value: project.size },
    { icon: ScheduleRounded, label: "Duration", value: project.duration },
  ].filter((f) => f.value);

  return (
    <Box sx={{ backgroundColor: GREEN.cream, overflowX: "hidden" }}>
      <Helmet>
        <title>{project.name} | Projects | Mcaludoh Consultancy</title>
        <meta name="description" content={project.summary} />
        <meta property="og:image" content={project.cover} />
      </Helmet>

      <Box sx={{ position: "relative", color: "#FFFFFF", overflow: "hidden" }}>
        <Box component="img" src={project.cover.replace(/w=\d+/, "w=1800")} alt="" sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(27, 67, 50, 0.75) 0%, rgba(27, 67, 50, 0.9) 60%, rgba(27, 67, 50, 0.97) 100%)" }} />
        <Container maxWidth="lg" sx={{ position: "relative", pt: { xs: 5, md: 8 }, pb: { xs: 14, md: 16 } }}>
          <Reveal>
            <Box component="nav" aria-label="Breadcrumb" sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0.5, fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.75)" }}>
              <Box
                component="a"
                href="/projects"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/projects");
                }}
                sx={{ color: "inherit", textDecoration: "none", fontWeight: 600, "&:hover": { color: "#FFFFFF" } }}
              >
                Projects
              </Box>
              <ChevronRightRounded sx={{ fontSize: 18 }} />
              <Box component="span" sx={{ color: GREEN.mist, fontWeight: 700 }}>
                {service?.name}
              </Box>
            </Box>
            <Box sx={{ mt: 2.5, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
              <StatusBadge status={project.status} />
              <Box component="span" sx={{ px: 1.25, py: 0.4, borderRadius: 999, fontSize: "0.72rem", fontWeight: 800, border: "1px solid rgba(216, 243, 220, 0.35)" }}>
                {project.year}
              </Box>
            </Box>
            <Typography component="h1" sx={{ mt: 2, maxWidth: 820, fontWeight: 800, fontSize: { xs: "2rem", sm: "2.5rem", md: "3.1rem" }, lineHeight: 1.1, letterSpacing: "-0.03em" }}>
              {project.name}
            </Typography>
            <Typography sx={{ mt: 1.75, maxWidth: 680, fontSize: { xs: "1rem", md: "1.12rem" }, lineHeight: 1.75, color: "rgba(255, 255, 255, 0.86)" }}>{project.summary}</Typography>
            <Box sx={{ mt: 3.5, display: "grid", gap: 1.25, gridTemplateColumns: { xs: "1fr 1fr", md: `repeat(${facts.length}, minmax(0, 1fr))` }, maxWidth: 960 }}>
              {facts.map(({ icon: Icon, label, value }) => (
                <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 1.25, p: 1.5, borderRadius: "16px", border: "1px solid rgba(216, 243, 220, 0.25)", backgroundColor: "rgba(216, 243, 220, 0.08)", backdropFilter: "blur(10px)", minWidth: 0 }}>
                  <Icon sx={{ color: GREEN.light, flexShrink: 0 }} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.7)" }}>{label}</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", lineHeight: 1.3 }}>{value}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Reveal>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, mt: { xs: -9, md: -10 } }}>
        <Box sx={{ display: "grid", gap: { xs: 1.5, md: 2 }, gridTemplateColumns: { xs: "1fr", sm: `repeat(${project.results.length}, 1fr)` } }}>
          {project.results.map((r, i) => (
            <Reveal key={r.label} delay={i * 90}>
              <Box sx={{ p: { xs: 2.5, md: 3 }, borderRadius: "24px 24px 24px 8px", backgroundColor: "#FFFFFF", boxShadow: "0 20px 50px rgba(27, 67, 50, 0.14)", display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ width: 6, alignSelf: "stretch", borderRadius: 99, background: `linear-gradient(180deg, ${GREEN.light}, ${GREEN.main})` }} />
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.9rem", md: "2.4rem" }, lineHeight: 1, letterSpacing: "-0.02em", color: GREEN.deep }}>{r.value}</Typography>
                  <Typography sx={{ mt: 0.5, fontSize: "0.88rem", color: "text.secondary" }}>{r.label}</Typography>
                </Box>
              </Box>
            </Reveal>
          ))}
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
        <Box sx={{ display: "grid", gap: { xs: 4, md: 6 }, gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 340px" }, alignItems: "start" }}>
          <Box>
            <Reveal>
              <StoryStep icon={ReportProblemOutlined} step="Step 01" title="The challenge">
                <Typography sx={{ lineHeight: 1.85, color: "#3C4A42", fontSize: { xs: "1rem", md: "1.05rem" } }}>{project.challenge}</Typography>
              </StoryStep>
            </Reveal>
            <Reveal>
              <StoryStep icon={LightbulbOutlined} step="Step 02" title="Our solution">
                <Typography sx={{ lineHeight: 1.85, color: "#3C4A42", fontSize: { xs: "1rem", md: "1.05rem" } }}>{project.solution}</Typography>
                {project.scope?.length > 0 && (
                  <Box component="ul" sx={{ listStyle: "none", p: 0, m: "16px 0 0", display: "grid", gap: 1, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                    {project.scope.map((item) => (
                      <Box key={item} component="li" sx={{ display: "flex", alignItems: "center", gap: 1, p: 1.25, borderRadius: "12px", backgroundColor: "#FFFFFF", border: "1px solid rgba(27, 67, 50, 0.07)", fontSize: "0.9rem", fontWeight: 600, color: GREEN.ink }}>
                        <CheckCircleRounded sx={{ fontSize: 18, color: GREEN.mid }} />
                        {item}
                      </Box>
                    ))}
                  </Box>
                )}
              </StoryStep>
            </Reveal>
            <Reveal>
              <StoryStep icon={EmojiEventsOutlined} step="Step 03" title="The results" last>
                <Box sx={{ display: "grid", gap: 1 }}>
                  {project.results.map((r) => (
                    <Typography key={r.label} sx={{ display: "flex", alignItems: "baseline", gap: 1, color: "#3C4A42", lineHeight: 1.6 }}>
                      <Box component="strong" sx={{ color: GREEN.deep, fontSize: "1.1rem" }}>
                        {r.value}
                      </Box>
                      {r.label.toLowerCase()}
                    </Typography>
                  ))}
                </Box>
              </StoryStep>
            </Reveal>
          </Box>

          <Box sx={{ position: { md: "sticky" }, top: 88, display: "grid", gap: 2 }}>
            <Reveal>
              <Box sx={{ p: 2.5, borderRadius: "24px 24px 24px 8px", backgroundColor: "#FFFFFF", boxShadow: "0 16px 38px rgba(27, 67, 50, 0.08)" }}>
                <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: GREEN.mid, mb: 1.5 }}>Service delivered</Typography>
                <Box
                  component="button"
                  type="button"
                  onClick={() => navigate(`/services/${project.service}`)}
                  sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1.5, p: 1.25, textAlign: "left", fontFamily: "inherit", cursor: "pointer", border: "1px solid rgba(27, 67, 50, 0.08)", borderRadius: "16px", backgroundColor: GREEN.cream, color: GREEN.ink, transition: "all 0.2s ease", "&:hover": { borderColor: GREEN.light, "& .svc-arrow": { transform: "translateX(3px)" } } }}
                >
                  <ServiceIcon slug={project.service} size={44} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: "0.95rem" }}>{service?.name}</Typography>
                    <Typography sx={{ fontSize: "0.78rem", color: "text.secondary" }}>View service</Typography>
                  </Box>
                  <ArrowForwardRounded className="svc-arrow" sx={{ color: GREEN.main, transition: "transform 0.2s ease" }} />
                </Box>
              </Box>
            </Reveal>
            <Reveal delay={100}>
              <Box sx={{ p: 3, borderRadius: "24px 24px 8px 24px", color: "#FFFFFF", background: `linear-gradient(160deg, ${GREEN.deep}, ${GREEN.main})`, boxShadow: "0 20px 40px rgba(27, 67, 50, 0.22)" }}>
                <Typography sx={{ fontWeight: 800, fontSize: "1.15rem", lineHeight: 1.3 }}>Want results like these?</Typography>
                <Typography sx={{ mt: 1, fontSize: "0.88rem", lineHeight: 1.65, color: "rgba(255, 255, 255, 0.82)" }}>
                  Tell us about your site and goals. We'll propose a plan tailored to you.
                </Typography>
                <Button
                  fullWidth
                  onClick={() => navigate(`/request-service?service=${project.service}`)}
                  endIcon={<ArrowForwardRounded />}
                  sx={{ mt: 2, minHeight: 46, borderRadius: 999, fontWeight: 700, color: GREEN.deep, backgroundColor: "#FFFFFF", "&:hover": { backgroundColor: GREEN.mist } }}
                >
                  Start a similar project
                </Button>
              </Box>
            </Reveal>
          </Box>
        </Box>
      </Container>

      {project.before && project.after && (
        <Box sx={{ backgroundColor: "#FFFFFF", py: { xs: 6, md: 9 } }}>
          <Container maxWidth="lg">
            <Reveal>
              <Box sx={{ textAlign: "center", mb: { xs: 3, md: 4 } }}>
                <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: GREEN.mid }}>Transformation</Typography>
                <Typography component="h2" sx={{ mt: 0.75, fontWeight: 800, fontSize: { xs: "1.6rem", md: "2.1rem" }, color: GREEN.ink }}>
                  Before and after
                </Typography>
                <Typography sx={{ mt: 0.75, color: "text.secondary" }}>Drag the handle, or focus it and use your arrow keys.</Typography>
              </Box>
            </Reveal>
            <Reveal>
              <BeforeAfter before={project.before} after={project.after} alt={project.name} ratio="16 / 8" sx={{ maxWidth: 1000, mx: "auto", aspectRatio: { xs: "4 / 3", md: "16 / 8" } }} />
            </Reveal>
          </Container>
        </Box>
      )}

      {photos.length > 0 && (
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
          <Reveal>
            <Typography component="h2" sx={{ mb: 3, fontWeight: 800, fontSize: { xs: "1.5rem", md: "1.9rem" }, color: GREEN.ink }}>
              Project photos
            </Typography>
          </Reveal>
          <Box sx={{ display: "grid", gap: { xs: 1.25, md: 1.75 }, gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gridAutoRows: { xs: 150, md: 200 } }}>
            {photos.map((photo, i) => (
              <Reveal key={photo.id} delay={i * 70} sx={{ gridColumn: i === 0 ? "span 2" : "auto", gridRow: i === 0 ? "span 2" : "auto" }}>
                <Box
                  component="button"
                  type="button"
                  onClick={() => setViewing(i)}
                  aria-label={`Open photo ${i + 1}`}
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    p: 0,
                    border: 0,
                    cursor: "zoom-in",
                    overflow: "hidden",
                    borderRadius: i === 0 ? "26px 26px 26px 8px" : "18px 18px 18px 6px",
                    backgroundColor: GREEN.mist,
                    "& img": { transition: "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)" },
                    "& .zoom": { transition: "opacity 0.3s ease" },
                    "&:hover img, &:focus-visible img": { transform: "scale(1.07)" },
                    "&:hover .zoom, &:focus-visible .zoom": { opacity: 1 },
                    "&:focus-visible": { outline: `3px solid ${GREEN.light}`, outlineOffset: 3 },
                  }}
                >
                  <Box component="img" src={photo.file_url} alt={photo.alt_text} loading="lazy" sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <Box className="zoom" sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(27, 42, 34, 0.35)", color: "#FFFFFF", opacity: 0 }}>
                    <ZoomOutMapRounded />
                  </Box>
                </Box>
              </Reveal>
            ))}
          </Box>
        </Container>
      )}

      {project.testimonial && (
        <Container maxWidth="md" sx={{ pb: { xs: 6, md: 9 } }}>
          <Reveal>
            <Box sx={{ position: "relative", overflow: "hidden", p: { xs: 3, md: 5 }, textAlign: "center", borderRadius: "32px 32px 32px 8px", color: "#FFFFFF", background: `linear-gradient(150deg, ${GREEN.deep}, ${GREEN.main})`, boxShadow: "0 24px 50px rgba(27, 67, 50, 0.25)" }}>
              <FormatQuoteRounded sx={{ fontSize: 56, color: GREEN.light }} />
              <Typography sx={{ mt: 1, fontSize: { xs: "1.15rem", md: "1.4rem" }, fontWeight: 600, lineHeight: 1.6 }}>"{project.testimonial.quote}"</Typography>
              <Typography sx={{ mt: 2.5, fontWeight: 800 }}>{project.testimonial.name}</Typography>
              <Typography sx={{ fontSize: "0.88rem", color: "rgba(255, 255, 255, 0.75)" }}>
                {project.testimonial.role}, {project.client}
              </Typography>
            </Box>
          </Reveal>
        </Container>
      )}

      <Box sx={{ backgroundColor: "#FFFFFF", py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
            {[
              { item: prev, label: "Previous project", align: "left" },
              { item: next, label: "Next project", align: "right" },
            ].map(({ item, label, align }) => (
              <Box
                key={label}
                component="button"
                type="button"
                onClick={() => navigate(`/projects/${item.slug}`)}
                sx={{
                  display: "flex",
                  flexDirection: align === "right" ? "row-reverse" : "row",
                  alignItems: "center",
                  gap: 2,
                  p: 1.5,
                  textAlign: align,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  border: "1px solid rgba(27, 67, 50, 0.08)",
                  borderRadius: "22px",
                  backgroundColor: GREEN.cream,
                  color: GREEN.ink,
                  transition: "all 0.25s ease",
                  "&:hover": { backgroundColor: "#FFFFFF", boxShadow: "0 16px 36px rgba(27, 67, 50, 0.12)", "& .nav-arrow": { transform: align === "right" ? "translateX(4px)" : "translateX(-4px)" } },
                  "&:focus-visible": { outline: `3px solid ${GREEN.light}`, outlineOffset: 2 },
                }}
              >
                <Box component="img" src={item.cover.replace(/w=\d+/, "w=300")} alt="" sx={{ width: 84, height: 84, flexShrink: 0, objectFit: "cover", borderRadius: "16px" }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: GREEN.mid }}>
                    {align === "left" && <ArrowBackRounded className="nav-arrow" sx={{ fontSize: 16, transition: "transform 0.25s ease" }} />}
                    {label}
                    {align === "right" && <ArrowForwardRounded className="nav-arrow" sx={{ fontSize: 16, transition: "transform 0.25s ease" }} />}
                  </Typography>
                  <Typography sx={{ mt: 0.5, fontWeight: 800, lineHeight: 1.3 }}>{item.name}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {related.length > 0 && (
            <>
              <Typography component="h2" sx={{ mt: { xs: 5, md: 7 }, mb: 3, fontWeight: 800, fontSize: { xs: "1.5rem", md: "1.9rem" }, color: GREEN.ink }}>
                More case studies
              </Typography>
              <Box sx={{ display: "grid", gap: { xs: 2.5, md: 3 }, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" } }}>
                {related.map((item, i) => (
                  <Reveal key={item.id} delay={i * 90} sx={{ height: "100%" }}>
                    <ProjectCard project={item} />
                  </Reveal>
                ))}
              </Box>
            </>
          )}
        </Container>
      </Box>

      <Lightbox items={photos} index={viewing} onClose={() => setViewing(null)} onIndex={setViewing} />
    </Box>
  );
}

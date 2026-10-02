import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Container, IconButton, Tooltip, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowBackRounded,
  ArrowForwardRounded,
  CheckCircleRounded,
  ChevronRightRounded,
  Facebook,
  LinkRounded,
  ScheduleRounded,
  SearchOffRounded,
  WhatsApp,
  X as XIcon,
} from "@mui/icons-material";
import { articles, readingTime } from "../data/prototypeContent";
import { GREEN, Reveal } from "../components/PageSections";
import ArticleCard, { AuthorBadge } from "../components/ArticleCard";
import { EmptyState, primaryButtonSx } from "../components/FormControls";
import { showError, showSuccess } from "../utils/swal";
import { formatDate } from "../utils/format";

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Turns the lightweight "## heading" / "- bullet" format into blocks. */
const parseContent = (content = "") => {
  const blocks = [];
  let paragraph = [];
  let list = null;

  const flush = () => {
    if (paragraph.length) blocks.push({ type: "p", text: paragraph.join(" ") });
    if (list) blocks.push({ type: "ul", items: list });
    paragraph = [];
    list = null;
  };

  content.split("\n").forEach((raw) => {
    const line = raw.trim();
    if (!line) return flush();
    if (line.startsWith("## ")) {
      flush();
      const text = line.slice(3);
      blocks.push({ type: "h2", text, id: slugify(text) });
    } else if (line.startsWith("- ")) {
      if (paragraph.length) {
        blocks.push({ type: "p", text: paragraph.join(" ") });
        paragraph = [];
      }
      list = list || [];
      list.push(line.slice(2));
    } else {
      if (list) flush();
      paragraph.push(line);
    }
  });
  flush();
  return blocks;
};

/** Bolds a leading "Label:" so list items scan easily. */
function ListText({ text }) {
  const match = text.match(/^([^:]{2,60}):\s(.+)$/);
  if (!match) return text;
  return (
    <>
      <Box component="strong" sx={{ color: GREEN.ink }}>
        {match[1]}:
      </Box>{" "}
      {match[2]}
    </>
  );
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <Box
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      sx={{ position: "fixed", top: 0, left: 0, right: 0, height: 4, zIndex: 1300, pointerEvents: "none" }}
    >
      <Box
        sx={{
          height: "100%",
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${GREEN.light}, ${GREEN.mid})`,
          borderRadius: "0 99px 99px 0",
          boxShadow: "0 0 10px rgba(82, 183, 136, 0.6)",
        }}
      />
    </Box>
  );
}

function ShareButtons({ title, vertical = false }) {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = encodeURIComponent(`${title} - Mcaludoh Consultancy`);
  const encodedUrl = encodeURIComponent(url);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      showSuccess("Link copied. Share it with a fellow farmer!");
    } catch {
      showError("Could not copy the link. Please copy it from the address bar.");
    }
  };

  const channels = [
    { label: "Share on WhatsApp", icon: WhatsApp, href: `https://wa.me/?text=${text}%20${encodedUrl}`, color: "#25D366" },
    { label: "Share on Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, color: "#1877F2" },
    { label: "Share on X", icon: XIcon, href: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`, color: "#111111" },
  ];

  const buttonSx = (color) => ({
    width: 42,
    height: 42,
    color: GREEN.main,
    backgroundColor: "#FFFFFF",
    border: "1px solid rgba(27, 67, 50, 0.12)",
    transition: "all 0.2s ease",
    "&:hover": { color: "#FFFFFF", backgroundColor: color, borderColor: color, transform: "translateY(-2px)" },
  });

  return (
    <Box sx={{ display: "flex", flexDirection: vertical ? "column" : "row", gap: 1 }}>
      {channels.map(({ label, icon: Icon, href, color }) => (
        <Tooltip key={label} title={label} placement={vertical ? "right" : "top"}>
          <IconButton component="a" href={href} target="_blank" rel="noreferrer" aria-label={label} sx={buttonSx(color)}>
            <Icon sx={{ fontSize: 19 }} />
          </IconButton>
        </Tooltip>
      ))}
      <Tooltip title="Copy link" placement={vertical ? "right" : "top"}>
        <IconButton onClick={copy} aria-label="Copy link" sx={buttonSx(GREEN.main)}>
          <LinkRounded sx={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default function ArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const article = articles.find((a) => a.slug === slug);
  const [activeId, setActiveId] = useState("");

  const blocks = useMemo(() => parseContent(article?.content), [article]);
  const headings = useMemo(() => blocks.filter((b) => b.type === "h2"), [blocks]);

  const related = useMemo(() => {
    if (!article) return [];
    const same = articles.filter((a) => a.id !== article.id && a.category?.name === article.category?.name);
    const others = articles.filter((a) => a.id !== article.id && a.category?.name !== article.category?.name);
    return [...same, ...others].slice(0, 3);
  }, [article]);

  useEffect(() => {
    if (!headings.length) return undefined;
    const onScroll = () => {
      let current = "";
      headings.forEach((h) => {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top < 140) current = h.id;
      });
      setActiveId(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  if (!article) {
    return (
      <Box sx={{ backgroundColor: GREEN.cream, py: { xs: 8, md: 12 } }}>
        <Helmet>
          <title>Article not found | Mcaludoh Consultancy</title>
        </Helmet>
        <Container maxWidth="sm">
          <EmptyState
            icon={SearchOffRounded}
            title="We couldn't find that article"
            text="It may have been moved or renamed. Browse the Knowledge Centre for all our guides."
            action={
              <Button onClick={() => navigate("/blog")} startIcon={<ArrowBackRounded />} sx={{ ...primaryButtonSx, minHeight: 46, px: 3, fontSize: "0.95rem" }}>
                Back to Knowledge Centre
              </Button>
            }
          />
        </Container>
      </Box>
    );
  }

  const minutes = readingTime(article.content);
  const scrollToHeading = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96, behavior: "smooth" });
  };

  return (
    <Box sx={{ backgroundColor: GREEN.cream, overflowX: "hidden" }}>
      <Helmet>
        <title>{article.title} | Mcaludoh Consultancy</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.featured_image} />
      </Helmet>
      <ReadingProgress />

      <Box
        sx={{
          color: "#FFFFFF",
          pt: { xs: 5, md: 8 },
          pb: { xs: 14, md: 20 },
          background: `radial-gradient(circle at 85% 15%, rgba(82, 183, 136, 0.35), transparent 45%), linear-gradient(160deg, ${GREEN.deep} 0%, ${GREEN.main} 100%)`,
        }}
      >
        <Container maxWidth="md">
          <Reveal>
            <Box
              component="nav"
              aria-label="Breadcrumb"
              sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0.5, fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.75)" }}
            >
              <Box
                component="a"
                href="/blog"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/blog");
                }}
                sx={{ color: "inherit", textDecoration: "none", fontWeight: 600, "&:hover": { color: "#FFFFFF" } }}
              >
                Knowledge Centre
              </Box>
              <ChevronRightRounded sx={{ fontSize: 18 }} />
              <Box component="span" sx={{ color: GREEN.mist, fontWeight: 700 }}>
                {article.category?.name}
              </Box>
            </Box>
            <Typography
              component="h1"
              sx={{
                mt: 2,
                fontWeight: 800,
                fontSize: { xs: "1.9rem", sm: "2.4rem", md: "3rem" },
                lineHeight: 1.12,
                letterSpacing: "-0.03em",
              }}
            >
              {article.title}
            </Typography>
            <Typography sx={{ mt: 2, fontSize: { xs: "1rem", md: "1.12rem" }, lineHeight: 1.75, color: "rgba(255, 255, 255, 0.85)" }}>
              {article.excerpt}
            </Typography>
            <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", alignItems: "center", gap: { xs: 2, sm: 3 } }}>
              <AuthorBadge author={article.author} light />
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.8)" }}>
                <span>{formatDate(article.published_at)}</span>
                <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                  <ScheduleRounded sx={{ fontSize: 16, color: GREEN.light }} />
                  {minutes} min read
                </Box>
              </Box>
            </Box>
          </Reveal>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, mt: { xs: -10, md: -15 } }}>
        <Reveal>
          <Box
            component="img"
            src={article.featured_image.replace(/w=\d+/, "w=1800")}
            alt={article.title}
            sx={{
              display: "block",
              width: "100%",
              maxWidth: 1000,
              mx: "auto",
              aspectRatio: { xs: "4 / 3", sm: "16 / 8" },
              objectFit: "cover",
              borderRadius: "32px 32px 32px 8px",
              boxShadow: "0 30px 70px rgba(27, 67, 50, 0.25)",
            }}
          />
        </Reveal>
      </Container>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "56px minmax(0, 1fr) 260px" },
            gap: { xs: 3, md: 5 },
            alignItems: "start",
          }}
        >
          <Box sx={{ display: { xs: "none", md: "block" }, position: "sticky", top: 96 }}>
            <ShareButtons title={article.title} vertical />
          </Box>

          <Box component="article" sx={{ maxWidth: 720, width: "100%", mx: "auto" }}>
            {blocks.map((block, index) => {
              if (block.type === "h2") {
                return (
                  <Typography
                    key={index}
                    id={block.id}
                    component="h2"
                    sx={{
                      mt: 5,
                      mb: 1.75,
                      fontWeight: 800,
                      fontSize: { xs: "1.35rem", md: "1.6rem" },
                      lineHeight: 1.3,
                      letterSpacing: "-0.01em",
                      color: GREEN.ink,
                      scrollMarginTop: 96,
                      "&::before": {
                        content: '""',
                        display: "block",
                        width: 36,
                        height: 3,
                        mb: 1.5,
                        borderRadius: 99,
                        backgroundColor: GREEN.light,
                      },
                    }}
                  >
                    {block.text}
                  </Typography>
                );
              }
              if (block.type === "ul") {
                return (
                  <Box key={index} component="ul" sx={{ listStyle: "none", p: 0, m: "0 0 1.75rem", display: "grid", gap: 1.25 }}>
                    {block.items.map((item) => (
                      <Box
                        key={item}
                        component="li"
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          p: 1.75,
                          borderRadius: "16px",
                          backgroundColor: "#FFFFFF",
                          border: "1px solid rgba(27, 67, 50, 0.07)",
                          lineHeight: 1.7,
                          color: "#3C4A42",
                        }}
                      >
                        <CheckCircleRounded sx={{ mt: "3px", fontSize: 20, color: GREEN.mid, flexShrink: 0 }} />
                        <span>
                          <ListText text={item} />
                        </span>
                      </Box>
                    ))}
                  </Box>
                );
              }
              const isLead = index === 0;
              return (
                <Typography
                  key={index}
                  sx={{
                    mb: 2.25,
                    fontSize: isLead ? { xs: "1.1rem", md: "1.2rem" } : { xs: "1rem", md: "1.06rem" },
                    lineHeight: 1.85,
                    color: isLead ? GREEN.ink : "#3C4A42",
                    fontWeight: isLead ? 500 : 400,
                  }}
                >
                  {block.text}
                </Typography>
              );
            })}

            <Box
              sx={{
                mt: 5,
                pt: 3,
                borderTop: "1px solid rgba(27, 67, 50, 0.12)",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Typography sx={{ fontWeight: 700, color: GREEN.ink }}>Found this useful? Share it.</Typography>
              <ShareButtons title={article.title} />
            </Box>

            <Box
              sx={{
                mt: 4,
                p: { xs: 2.5, md: 3 },
                display: "flex",
                gap: 2,
                alignItems: "flex-start",
                borderRadius: "24px 24px 24px 8px",
                background: `linear-gradient(120deg, ${GREEN.mist}, #EEF7F0)`,
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  flexShrink: 0,
                  borderRadius: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "1.4rem",
                  color: "#FFFFFF",
                  background: `linear-gradient(135deg, ${GREEN.light}, ${GREEN.main})`,
                }}
              >
                {(article.author?.name || "A").charAt(0)}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, color: GREEN.ink }}>Written by {article.author?.name}</Typography>
                <Typography sx={{ fontSize: "0.85rem", color: GREEN.main, fontWeight: 600 }}>{article.author?.role}</Typography>
                <Typography sx={{ mt: 1, color: "text.secondary", lineHeight: 1.7, fontSize: "0.93rem" }}>
                  Aludoh founded Mcaludoh Consultancy to make modern, profitable farming practical for every Kenyan
                  grower, from backyard gardens to commercial farms.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ position: { md: "sticky" }, top: 96, display: "grid", gap: 2.5 }}>
            {headings.length > 0 && (
              <Box
                component="nav"
                aria-label="On this page"
                sx={{
                  display: { xs: "none", md: "block" },
                  p: 2.5,
                  borderRadius: "22px 22px 22px 6px",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 16px 36px rgba(27, 67, 50, 0.08)",
                }}
              >
                <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: GREEN.main, mb: 1.5 }}>
                  On this page
                </Typography>
                {headings.map((h) => (
                  <Box
                    key={h.id}
                    component="a"
                    href={`#${h.id}`}
                    onClick={scrollToHeading(h.id)}
                    aria-current={activeId === h.id ? "true" : undefined}
                    sx={{
                      display: "block",
                      py: 0.9,
                      pl: 1.5,
                      borderLeft: `2px solid ${activeId === h.id ? GREEN.mid : "rgba(27, 67, 50, 0.1)"}`,
                      fontSize: "0.86rem",
                      lineHeight: 1.45,
                      textDecoration: "none",
                      fontWeight: activeId === h.id ? 700 : 500,
                      color: activeId === h.id ? GREEN.deep : "text.secondary",
                      transition: "all 0.2s ease",
                      "&:hover": { color: GREEN.deep, borderLeftColor: GREEN.light },
                    }}
                  >
                    {h.text}
                  </Box>
                ))}
              </Box>
            )}
            <Box
              sx={{
                p: 3,
                borderRadius: "22px 22px 6px 22px",
                color: "#FFFFFF",
                background: `linear-gradient(160deg, ${GREEN.deep}, ${GREEN.main})`,
                boxShadow: "0 20px 40px rgba(27, 67, 50, 0.22)",
              }}
            >
              <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", lineHeight: 1.3 }}>Need help putting this into practice?</Typography>
              <Typography sx={{ mt: 1, fontSize: "0.88rem", lineHeight: 1.65, color: "rgba(255, 255, 255, 0.82)" }}>
                Book a site visit or join a hands-on training with our team.
              </Typography>
              <Button
                fullWidth
                onClick={() => navigate("/request-service")}
                endIcon={<ArrowForwardRounded />}
                sx={{ mt: 2, minHeight: 44, borderRadius: 999, fontWeight: 700, color: GREEN.deep, backgroundColor: "#FFFFFF", "&:hover": { backgroundColor: GREEN.mist } }}
              >
                Book a visit
              </Button>
              <Button
                fullWidth
                onClick={() => navigate("/training")}
                sx={{ mt: 1, minHeight: 44, borderRadius: 999, fontWeight: 700, color: "#FFFFFF", border: "1px solid rgba(255, 255, 255, 0.35)", "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" } }}
              >
                See trainings
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>

      {related.length > 0 && (
        <Box sx={{ backgroundColor: "#FFFFFF", py: { xs: 6, md: 8 } }}>
          <Container maxWidth="lg">
            <Box sx={{ mb: 3.5, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
              <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: "1.5rem", md: "1.9rem" }, color: GREEN.ink }}>
                Keep reading
              </Typography>
              <Button onClick={() => navigate("/blog")} endIcon={<ArrowForwardRounded />} sx={{ fontWeight: 700, color: GREEN.main, borderRadius: 999 }}>
                All guides
              </Button>
            </Box>
            <Box sx={{ display: "grid", gap: { xs: 2.5, md: 3 }, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" } }}>
              {related.map((item, index) => (
                <Reveal key={item.id} delay={index * 90} sx={{ height: "100%" }}>
                  <ArticleCard article={item} />
                </Reveal>
              ))}
            </Box>
          </Container>
        </Box>
      )}
    </Box>
  );
}

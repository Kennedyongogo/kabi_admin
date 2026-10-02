import React, { useMemo, useState } from "react";
import { Box, Button, CircularProgress, Container, InputAdornment, TextField, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  ArrowForwardRounded,
  AutoStoriesOutlined,
  CloseRounded,
  MarkEmailReadOutlined,
  ScheduleRounded,
  SearchRounded,
  SearchOffRounded,
  WhatsApp,
} from "@mui/icons-material";
import { articleCategories, articles, readingTime } from "../data/prototypeContent";
import { GREEN, PageHero, Reveal, SectionHeading } from "../components/PageSections";
import ArticleCard, { AuthorBadge } from "../components/ArticleCard";
import {
  ChoicePill,
  EMAIL_REGEX,
  EmptyState,
  PillRow,
  fakeSubmit,
  fieldSx,
  primaryButtonSx,
} from "../components/FormControls";
import { showThankYou } from "../utils/swal";
import { formatDate } from "../utils/format";

const ALL = "All";

const matches = (article, query) => {
  if (!query) return true;
  const haystack = [article.title, article.excerpt, article.category?.name, article.content]
    .join(" ")
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
};

function FeaturedArticle({ article }) {
  const navigate = useNavigate();
  const open = () => navigate(`/blog/${article.slug}`);

  return (
    <Box
      component="article"
      sx={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.15fr 1fr" },
        overflow: "hidden",
        borderRadius: "32px 32px 32px 8px",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 24px 60px rgba(27, 67, 50, 0.12)",
        "& img": { transition: "transform 1s cubic-bezier(0.22, 1, 0.36, 1)" },
        "&:hover img": { transform: "scale(1.05)" },
      }}
    >
      <Box sx={{ position: "relative", overflow: "hidden", minHeight: { xs: 220, sm: 300, md: 420 } }}>
        <Box
          component="img"
          src={article.featured_image}
          alt=""
          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 18,
            left: 18,
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            px: 1.5,
            py: 0.6,
            borderRadius: 999,
            fontSize: "0.75rem",
            fontWeight: 800,
            color: "#FFFFFF",
            background: `linear-gradient(135deg, ${GREEN.light}, ${GREEN.main})`,
            boxShadow: "0 10px 24px rgba(27, 67, 50, 0.3)",
          }}
        >
          <AutoStoriesOutlined sx={{ fontSize: 16 }} />
          Editor's pick
        </Box>
      </Box>
      <Box sx={{ p: { xs: 3, md: 5 }, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
            fontSize: "0.8rem",
            fontWeight: 700,
            color: GREEN.main,
          }}
        >
          <Box component="span" sx={{ px: 1.25, py: 0.35, borderRadius: 999, backgroundColor: GREEN.mist }}>
            {article.category?.name}
          </Box>
          <Box component="span" sx={{ color: "text.secondary", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 0.5 }}>
            <ScheduleRounded sx={{ fontSize: 15 }} />
            {readingTime(article.content)} min read
          </Box>
        </Typography>
        <Typography
          component="h2"
          sx={{
            mt: 2,
            fontWeight: 800,
            fontSize: { xs: "1.5rem", md: "2.1rem" },
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            color: GREEN.ink,
          }}
        >
          {article.title}
        </Typography>
        <Typography sx={{ mt: 1.5, color: "text.secondary", lineHeight: 1.75 }}>{article.excerpt}</Typography>
        <Box
          sx={{
            mt: 3,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <AuthorBadge author={article.author} meta={formatDate(article.published_at)} />
          <Button onClick={open} endIcon={<ArrowForwardRounded />} sx={{ ...primaryButtonSx, minHeight: 48, px: 3, fontSize: "0.95rem" }}>
            Read article
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSending(true);
    await fakeSubmit(900);
    setSending(false);
    setEmail("");
    showThankYou({
      title: "You're subscribed!",
      text: "Thanks for joining. You'll get one practical farming guide from Aludoh in your inbox every month.",
      note: "No spam. Unsubscribe any time.",
      confirmText: "Great",
    });
  };

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        p: { xs: 3, md: 5 },
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: { xs: 3, md: 5 },
        alignItems: "center",
        borderRadius: "32px 32px 8px 32px",
        color: "#FFFFFF",
        background: `radial-gradient(circle at 10% 110%, rgba(82, 183, 136, 0.45), transparent 50%), linear-gradient(150deg, ${GREEN.deep}, ${GREEN.main})`,
        boxShadow: "0 24px 50px rgba(27, 67, 50, 0.25)",
      }}
    >
      <MarkEmailReadOutlined
        aria-hidden
        sx={{ position: "absolute", right: -30, top: -30, fontSize: 200, color: "rgba(216, 243, 220, 0.06)" }}
      />
      <Box sx={{ position: "relative" }}>
        <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.5rem", md: "1.9rem" }, lineHeight: 1.2 }}>
          Get a new farming guide every month
        </Typography>
        <Typography sx={{ mt: 1, color: "rgba(255, 255, 255, 0.82)", lineHeight: 1.7 }}>
          Seasonal tips, crop guides and training dates, written by Aludoh and the team.
        </Typography>
      </Box>
      <Box component="form" noValidate onSubmit={submit} sx={{ position: "relative" }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.25 }}>
          <TextField
            fullWidth
            type="email"
            autoComplete="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            error={Boolean(error)}
            slotProps={{ htmlInput: { "aria-label": "Email address" } }}
            sx={{
              ...fieldSx,
              "& .MuiOutlinedInput-root": {
                ...fieldSx["& .MuiOutlinedInput-root"],
                borderRadius: 999,
                backgroundColor: "#FFFFFF",
                "&.Mui-focused": { boxShadow: "0 0 0 4px rgba(216, 243, 220, 0.35)" },
              },
            }}
          />
          <Button
            type="submit"
            disabled={sending}
            endIcon={sending ? <CircularProgress size={16} sx={{ color: "inherit" }} /> : <ArrowForwardRounded />}
            sx={{
              flexShrink: 0,
              minHeight: 56,
              px: 3.5,
              borderRadius: 999,
              fontWeight: 700,
              color: GREEN.deep,
              backgroundColor: "#FFFFFF",
              "&:hover": { backgroundColor: GREEN.mist },
              "&.Mui-disabled": { color: GREEN.deep, backgroundColor: GREEN.mist },
            }}
          >
            {sending ? "Subscribing..." : "Subscribe"}
          </Button>
        </Box>
        <Typography role={error ? "alert" : undefined} sx={{ mt: 1, minHeight: 20, fontSize: "0.82rem", color: error ? "#FFD7D2" : "rgba(255, 255, 255, 0.65)" }}>
          {error || "One email a month. Unsubscribe any time."}
        </Typography>
      </Box>
    </Box>
  );
}

export default function Blog() {
  const navigate = useNavigate();
  const { settings } = useOutletContext() || {};
  const whatsapp = String(settings?.whatsapp || settings?.phone || "+254 700 000000").replace(/\D/g, "");

  const [category, setCategory] = useState(ALL);
  const [query, setQuery] = useState("");

  const featured = articles.find((a) => a.featured) || articles[0];
  const filtering = category !== ALL || query.trim() !== "";

  const results = useMemo(
    () =>
      articles.filter(
        (a) => (category === ALL || a.category?.name === category) && matches(a, query.trim())
      ),
    [category, query]
  );
  const grid = filtering ? results : results.filter((a) => a.id !== featured.id);

  const countFor = (name) =>
    name === ALL ? articles.length : articles.filter((a) => a.category?.name === name).length;

  const clearFilters = () => {
    setCategory(ALL);
    setQuery("");
  };

  return (
    <Box sx={{ backgroundColor: GREEN.cream, overflowX: "hidden" }}>
      <Helmet>
        <title>Knowledge Centre | Mcaludoh Consultancy</title>
        <meta
          name="description"
          content="Practical guides on hydroponics, vertical farming, organic farming, agronomy, landscaping and EIAs from Mcaludoh Consultancy."
        />
      </Helmet>

      <PageHero
        eyebrow="Knowledge Centre"
        title="Practical farming advice,"
        highlight="from the field."
        subtitle="Clear, tested guides from Aludoh and the team to help you grow more, spend less and avoid costly mistakes."
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, mt: { xs: -8, md: -9 } }}>
        <Reveal>
          <Box
            sx={{
              p: { xs: 1.75, md: 2.25 },
              display: "grid",
              gap: 1.5,
              borderRadius: "24px 24px 24px 8px",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 20px 50px rgba(27, 67, 50, 0.12)",
            }}
          >
            <TextField
              fullWidth
              placeholder="Search guides, e.g. soil test, compost, tomatoes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              slotProps={{
                htmlInput: { "aria-label": "Search articles" },
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
                        sx={{
                          display: "flex",
                          p: 0.5,
                          border: 0,
                          borderRadius: "50%",
                          cursor: "pointer",
                          color: GREEN.main,
                          backgroundColor: GREEN.mist,
                        }}
                      >
                        <CloseRounded sx={{ fontSize: 16 }} />
                      </Box>
                    </InputAdornment>
                  ),
                },
              }}
              sx={fieldSx}
            />
            <PillRow label="Filter articles by topic">
              {articleCategories.map((name) => (
                <ChoicePill
                  key={name}
                  selected={category === name}
                  onClick={() => setCategory(name)}
                  count={countFor(name)}
                >
                  {name === ALL ? "All topics" : name}
                </ChoicePill>
              ))}
            </PillRow>
          </Box>
        </Reveal>
      </Container>

      <Container maxWidth="lg" sx={{ pt: { xs: 5, md: 6 }, pb: { xs: 7, md: 10 } }}>
        {!filtering && (
          <Reveal sx={{ mb: { xs: 5, md: 7 } }}>
            <FeaturedArticle article={featured} />
          </Reveal>
        )}

        <Box
          sx={{
            mb: 3,
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: "1.35rem", md: "1.6rem" }, color: GREEN.ink }}>
            {filtering ? "Search results" : "Latest guides"}
          </Typography>
          <Typography aria-live="polite" sx={{ color: "text.secondary", fontSize: "0.9rem" }}>
            {results.length} {results.length === 1 ? "article" : "articles"}
            {filtering && (
              <Box
                component="button"
                type="button"
                onClick={clearFilters}
                sx={{
                  ml: 1.5,
                  p: 0,
                  border: 0,
                  background: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  fontWeight: 700,
                  color: GREEN.main,
                  textDecoration: "underline",
                }}
              >
                Clear filters
              </Box>
            )}
          </Typography>
        </Box>

        {grid.length ? (
          <Box
            sx={{
              display: "grid",
              gap: { xs: 2.5, md: 3 },
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
            }}
          >
            {grid.map((article, index) => (
              <Reveal key={article.id} delay={(index % 3) * 90} sx={{ height: "100%" }}>
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </Box>
        ) : (
          <EmptyState
            icon={SearchOffRounded}
            title="No guides match your search"
            text="Try a different word or topic, or ask us directly and we'll help."
            action={
              <Button onClick={clearFilters} sx={{ ...primaryButtonSx, minHeight: 46, px: 3, fontSize: "0.95rem" }}>
                Show all guides
              </Button>
            }
          />
        )}

        <Reveal sx={{ mt: { xs: 6, md: 8 } }}>
          <Newsletter />
        </Reveal>
      </Container>

      <Box sx={{ backgroundColor: "#FFFFFF", py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Reveal>
            <SectionHeading
              eyebrow="Ask an expert"
              title="Can't find the answer you need?"
              subtitle="Send your question to Aludoh and the team. We reply to most farming questions within one working day."
            />
            <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 1.5 }}>
              <Button
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hello Aludoh, I have a farming question: ")}`}
                target="_blank"
                rel="noreferrer"
                startIcon={<WhatsApp />}
                sx={{ ...primaryButtonSx, background: "linear-gradient(135deg, #3BD671, #128C4B)" }}
              >
                Ask on WhatsApp
              </Button>
              <Button
                onClick={() => navigate("/contact")}
                sx={{
                  minHeight: 52,
                  px: 3.5,
                  borderRadius: 999,
                  fontWeight: 700,
                  color: GREEN.main,
                  border: `1px solid ${GREEN.light}`,
                  "&:hover": { backgroundColor: GREEN.mist },
                }}
              >
                Send a message
              </Button>
            </Box>
          </Reveal>
        </Container>
      </Box>
    </Box>
  );
}

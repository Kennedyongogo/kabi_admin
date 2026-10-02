import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Rating,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useOutletContext } from "react-router-dom";
import {
  ArrowBackRounded,
  ArrowForwardRounded,
  FormatQuoteRounded,
  GroupsOutlined,
  RateReviewOutlined,
  SendRounded,
  StarRounded,
  ThumbUpAltOutlined,
} from "@mui/icons-material";
import { apiGet, apiPost } from "../utils/api";
import { showError, showErrorWithAlternative, showThankYou } from "../utils/swal";
import { fallbackTestimonials } from "../data/siteContent";
import { GREEN, PageHero, Reveal, SectionHeading } from "../components/PageSections";
import TestimonialCard, { ClientAvatar, StarRow } from "../components/TestimonialCard";

const CONTENT_MIN = 20;
const CONTENT_MAX = 1500;
const ROTATE_MS = 7000;

const ratingLabels = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very good",
  5: "Excellent",
};

const emptyForm = { client_name: "", organization: "", rating: 5, content: "" };

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    backgroundColor: "#FBFAF6",
    "& fieldset": { borderColor: "rgba(27, 67, 50, 0.14)" },
    "&:hover fieldset": { borderColor: GREEN.light },
    "&.Mui-focused": { backgroundColor: "#FFFFFF", boxShadow: `0 0 0 4px ${GREEN.mist}` },
    "&.Mui-focused fieldset": { borderColor: GREEN.mid, borderWidth: 1.5 },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: GREEN.main },
};

const validate = (form) => {
  const errors = {};
  if (form.client_name.trim().length < 2) errors.client_name = "Please enter your name.";
  if (!form.rating) errors.rating = "Please choose a rating.";
  if (form.content.trim().length < CONTENT_MIN)
    errors.content = `Please write at least ${CONTENT_MIN} characters.`;
  return errors;
};

function FeaturedCarousel({ items }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  useEffect(() => {
    if (paused || count < 2) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), ROTATE_MS);
    return () => clearInterval(timer);
  }, [paused, count]);

  useEffect(() => {
    if (index >= count) setIndex(0);
  }, [count, index]);

  if (!count) return null;
  const go = (step) => setIndex((i) => (i + step + count) % count);

  return (
    <Box
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured testimonials"
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "34px 34px 34px 10px",
        border: "1px solid rgba(216, 243, 220, 0.22)",
        color: "#FFFFFF",
        background: `radial-gradient(circle at 0% 100%, rgba(82, 183, 136, 0.35), transparent 50%), linear-gradient(150deg, ${GREEN.main}, ${GREEN.deep})`,
        boxShadow: "0 30px 70px rgba(27, 67, 50, 0.3)",
        p: { xs: 3, sm: 4, md: 6 },
        minHeight: { xs: 360, sm: 320, md: 330 },
      }}
    >
      <FormatQuoteRounded
        aria-hidden
        sx={{
          position: "absolute",
          right: { xs: -10, md: 30 },
          top: { xs: -20, md: -30 },
          fontSize: { xs: 150, md: 230 },
          color: "rgba(216, 243, 220, 0.08)",
        }}
      />
      {items.map((item, i) => (
        <Box
          key={item.id}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${count}`}
          aria-hidden={i !== index}
          sx={{
            position: i === index ? "relative" : "absolute",
            inset: i === index ? "auto" : { xs: 24, sm: 32, md: 48 },
            opacity: i === index ? 1 : 0,
            transform: i === index ? "none" : "translateX(30px)",
            transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
            pointerEvents: i === index ? "auto" : "none",
          }}
        >
          <StarRow value={item.rating || 5} size={22} />
          <Typography
            component="blockquote"
            sx={{
              m: 0,
              mt: 2,
              maxWidth: 860,
              fontWeight: 600,
              fontSize: { xs: "1.08rem", sm: "1.25rem", md: "1.55rem" },
              lineHeight: 1.6,
              letterSpacing: "-0.01em",
            }}
          >
            “{item.content}”
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.75, mt: 3.5 }}>
            <ClientAvatar name={item.client_name} photo={item.photo} size={54} light />
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: "1.05rem" }}>{item.client_name}</Typography>
              <Typography sx={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "0.88rem" }}>
                {[item.organization, item.service].filter(Boolean).join(" · ")}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}

      {count > 1 && (
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            mt: { xs: 3.5, md: 4 },
          }}
        >
          <Box sx={{ display: "flex", gap: 0.75 }}>
            {items.map((item, i) => (
              <Box
                key={item.id}
                component="button"
                type="button"
                aria-label={`Show testimonial ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => setIndex(i)}
                sx={{
                  width: i === index ? 28 : 9,
                  height: 9,
                  p: 0,
                  border: 0,
                  borderRadius: 99,
                  cursor: "pointer",
                  backgroundColor: i === index ? "#FFFFFF" : "rgba(255, 255, 255, 0.35)",
                  transition: "width 0.3s ease, background-color 0.3s ease",
                }}
              />
            ))}
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            {[
              { step: -1, label: "Previous testimonial", Icon: ArrowBackRounded },
              { step: 1, label: "Next testimonial", Icon: ArrowForwardRounded },
            ].map(({ step, label, Icon }) => (
              <IconButton
                key={label}
                aria-label={label}
                onClick={() => go(step)}
                sx={{
                  width: 46,
                  height: 46,
                  color: "#FFFFFF",
                  border: "1px solid rgba(216, 243, 220, 0.35)",
                  backgroundColor: "rgba(216, 243, 220, 0.08)",
                  backdropFilter: "blur(8px)",
                  "&:hover": { backgroundColor: "#FFFFFF", color: GREEN.deep },
                }}
              >
                <Icon />
              </IconButton>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default function Testimonials() {
  const { settings } = useOutletContext() || {};
  const whatsapp = settings?.whatsapp || settings?.phone || "+254 700 000000";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [hoverRating, setHoverRating] = useState(-1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    apiGet("/api/testimonials?status=approved&limit=24")
      .then((res) => {
        if (active) setItems(res.data?.length ? res.data : fallbackTestimonials);
      })
      .catch(() => {
        if (active) setItems(fallbackTestimonials);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const rated = items.filter((item) => item.rating);
    const average = rated.length
      ? rated.reduce((sum, item) => sum + item.rating, 0) / rated.length
      : 5;
    const happy = rated.length
      ? Math.round((rated.filter((item) => item.rating >= 4).length / rated.length) * 100)
      : 100;
    return { average: average.toFixed(1), count: items.length, happy };
  }, [items]);

  const featured = items.slice(0, Math.min(items.length, 4));

  const change = (field) => (e) => {
    const value = field === "content" ? e.target.value.slice(0, CONTENT_MAX) : e.target.value;
    const next = { ...form, [field]: value };
    setForm(next);
    if (touched[field]) setErrors(validate(next));
  };

  const blur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(form));
  };

  const fieldError = (field) => touched[field] && errors[field];

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    setTouched({ client_name: true, rating: true, content: true });
    if (Object.keys(found).length) return;

    const payload = {
      client_name: form.client_name.trim(),
      organization: form.organization.trim(),
      rating: form.rating,
      content: form.content.trim(),
    };

    setSubmitting(true);
    try {
      await apiPost("/api/testimonials/submit", payload);
      setForm(emptyForm);
      setTouched({});
      setErrors({});
      showThankYou({
        title: `Thank you, ${payload.client_name.split(" ")[0]}!`,
        text: "Your testimonial has been received. It will appear on this page as soon as our team has reviewed it.",
        note: "Reviews are usually published within 1–2 working days",
        confirmText: "You're welcome",
      });
    } catch (error) {
      if (error.offline) {
        const useWhatsApp = await showErrorWithAlternative({
          title: "Testimonial not sent yet",
          message:
            "Our server is not reachable right now. You can share your feedback with us on WhatsApp instead.",
          alternativeText: "Share on WhatsApp",
        });
        if (useWhatsApp) {
          const text = `Hello Mcaludoh Consultancy, here is my testimonial (${payload.rating}/5):\n\n"${payload.content}"\n\n— ${payload.client_name}${payload.organization ? `, ${payload.organization}` : ""}`;
          window.open(
            `https://wa.me/${String(whatsapp).replace(/\D/g, "")}?text=${encodeURIComponent(text)}`,
            "_blank",
            "noopener"
          );
        }
      } else {
        showError(error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const activeRating = hoverRating !== -1 ? hoverRating : form.rating;

  return (
    <Box sx={{ backgroundColor: GREEN.cream, overflowX: "hidden" }}>
      <Helmet>
        <title>Testimonials | Mcaludoh Consultancy</title>
        <meta
          name="description"
          content="Read what farmers, schools and businesses say about working with Mcaludoh Consultancy, and share your own experience."
        />
      </Helmet>

      <PageHero
        eyebrow="Client stories"
        title="Real farms, real people,"
        highlight="real results."
        subtitle="Farmers, schools, developers and youth groups share what changed after working with us."
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.25, mt: 3 }}>
          {[
            {
              icon: StarRounded,
              text: loading ? "Loading ratings..." : `${stats.average} average rating`,
            },
            { icon: GroupsOutlined, text: loading ? "Client stories" : `${stats.count} client stories` },
            { icon: ThumbUpAltOutlined, text: loading ? "Happy clients" : `${stats.happy}% rate us 4★ or higher` },
          ].map(({ icon: Icon, text }) => (
            <Box
              key={text}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 1.75,
                py: 0.9,
                borderRadius: 999,
                border: "1px solid rgba(216, 243, 220, 0.3)",
                backgroundColor: "rgba(216, 243, 220, 0.1)",
                backdropFilter: "blur(10px)",
                fontSize: "0.88rem",
                fontWeight: 600,
              }}
            >
              <Icon sx={{ fontSize: 18, color: "#F2C14E" }} />
              {text}
            </Box>
          ))}
        </Box>
      </PageHero>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, mt: { xs: -8, md: -9 } }}>
        <Reveal>
          {loading ? (
            <Skeleton
              variant="rounded"
              sx={{ height: { xs: 360, md: 330 }, borderRadius: "34px 34px 34px 10px" }}
            />
          ) : (
            <FeaturedCarousel items={featured} />
          )}
        </Reveal>
      </Container>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
        <Reveal>
          <SectionHeading
            eyebrow="What clients say"
            title="Stories from the field"
            subtitle="Every project is different. Here is how some of our clients describe the experience."
          />
        </Reveal>
        <Box
          sx={{
            display: "grid",
            gap: { xs: 2, md: 3 },
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
          }}
        >
          {loading
            ? [0, 1, 2].map((key) => (
                <Skeleton
                  key={key}
                  variant="rounded"
                  sx={{ height: 280, borderRadius: "26px 26px 26px 6px" }}
                />
              ))
            : items.map((item, index) => (
                <Reveal key={item.id} delay={(index % 3) * 100} sx={{ height: "100%" }}>
                  <TestimonialCard item={item} />
                </Reveal>
              ))}
        </Box>
      </Container>

      <Box id="share" sx={{ backgroundColor: "#FFFFFF", py: { xs: 6, md: 9 } }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gap: { xs: 4, md: 6 },
              gridTemplateColumns: { xs: "1fr", md: "minmax(0, 5fr) minmax(0, 7fr)" },
              alignItems: "center",
            }}
          >
            <Reveal>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  mb: 2.5,
                  borderRadius: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  background: `linear-gradient(150deg, ${GREEN.mid}, ${GREEN.deep})`,
                  boxShadow: "0 14px 30px rgba(45, 106, 79, 0.3)",
                }}
              >
                <RateReviewOutlined fontSize="large" />
              </Box>
              <Typography
                component="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.8rem", md: "2.3rem" },
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  color: GREEN.ink,
                }}
              >
                Worked with us? Share your experience.
              </Typography>
              <Typography sx={{ mt: 1.75, color: "text.secondary", lineHeight: 1.8 }}>
                Your story helps other farmers and organisations decide with confidence, and it
                helps our team keep improving. It only takes a minute.
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, mt: 3, display: "grid", gap: 1.5 }}>
                {[
                  "Tell us what you set out to achieve",
                  "Share what changed after our work",
                  "Published once reviewed by our team",
                ].map((point, i) => (
                  <Box component="li" key={point} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        flexShrink: 0,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: 800,
                        color: GREEN.main,
                        backgroundColor: GREEN.mist,
                      }}
                    >
                      {i + 1}
                    </Box>
                    <Typography sx={{ fontWeight: 600, color: GREEN.ink }}>{point}</Typography>
                  </Box>
                ))}
              </Box>
            </Reveal>

            <Reveal delay={120}>
              <Box
                component="form"
                noValidate
                onSubmit={submit}
                sx={{
                  p: { xs: 2.5, sm: 3.5, md: 4.5 },
                  borderRadius: "30px 30px 8px 30px",
                  backgroundColor: GREEN.cream,
                  border: "1px solid rgba(27, 67, 50, 0.08)",
                  boxShadow: "0 24px 60px rgba(27, 67, 50, 0.1)",
                }}
              >
                <Box
                  sx={{
                    mb: 3,
                    p: 2.25,
                    borderRadius: "18px",
                    backgroundColor: "#FFFFFF",
                    textAlign: "center",
                    border: `1px solid ${fieldError("rating") ? "#d32f2f" : "rgba(27, 67, 50, 0.08)"}`,
                  }}
                >
                  <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "text.secondary" }}>
                    How would you rate our work?
                  </Typography>
                  <Rating
                    name="rating"
                    value={form.rating}
                    onChange={(_, value) => {
                      const next = { ...form, rating: value || 0 };
                      setForm(next);
                      setTouched((prev) => ({ ...prev, rating: true }));
                      setErrors(validate(next));
                    }}
                    onChangeActive={(_, value) => setHoverRating(value)}
                    icon={<StarRounded fontSize="inherit" />}
                    emptyIcon={<StarRounded fontSize="inherit" />}
                    sx={{
                      mt: 1,
                      fontSize: { xs: "2.4rem", sm: "2.8rem" },
                      "& .MuiRating-iconFilled": { color: "#E0A526" },
                      "& .MuiRating-iconEmpty": { color: "rgba(27, 67, 50, 0.14)" },
                      "& .MuiRating-iconHover": { transform: "scale(1.15)" },
                      "& .MuiRating-icon": { transition: "transform 0.15s ease" },
                    }}
                  />
                  <Typography
                    aria-live="polite"
                    sx={{
                      minHeight: 24,
                      fontWeight: 800,
                      color: fieldError("rating") ? "error.main" : GREEN.main,
                    }}
                  >
                    {fieldError("rating") || ratingLabels[activeRating] || ""}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  }}
                >
                  <TextField
                    label="Your name"
                    autoComplete="name"
                    value={form.client_name}
                    onChange={change("client_name")}
                    onBlur={blur("client_name")}
                    error={Boolean(fieldError("client_name"))}
                    helperText={fieldError("client_name") || " "}
                    inputProps={{ maxLength: 120 }}
                    sx={fieldSx}
                  />
                  <TextField
                    label="Farm / organisation (optional)"
                    autoComplete="organization"
                    value={form.organization}
                    onChange={change("organization")}
                    helperText=" "
                    inputProps={{ maxLength: 160 }}
                    sx={fieldSx}
                  />
                </Box>
                <TextField
                  label="Your testimonial"
                  multiline
                  minRows={5}
                  fullWidth
                  placeholder="What did we help you with, and what changed afterwards?"
                  value={form.content}
                  onChange={change("content")}
                  onBlur={blur("content")}
                  error={Boolean(fieldError("content"))}
                  helperText={
                    <Box component="span" sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                      <span>{fieldError("content") || " "}</span>
                      <span>
                        {form.content.length}/{CONTENT_MAX}
                      </span>
                    </Box>
                  }
                  sx={fieldSx}
                />

                <Button
                  type="submit"
                  fullWidth
                  disabled={submitting}
                  endIcon={
                    submitting ? (
                      <CircularProgress size={18} sx={{ color: "inherit" }} />
                    ) : (
                      <SendRounded />
                    )
                  }
                  sx={{
                    mt: 2.5,
                    minHeight: 54,
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#FFFFFF",
                    background: `linear-gradient(135deg, ${GREEN.mid}, ${GREEN.deep})`,
                    boxShadow: "0 14px 30px rgba(45, 106, 79, 0.35)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 18px 36px rgba(45, 106, 79, 0.45)",
                    },
                    "&.Mui-disabled": { color: "#FFFFFF", opacity: 0.75 },
                  }}
                >
                  {submitting ? "Submitting..." : "Submit testimonial"}
                </Button>
              </Box>
            </Reveal>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  AccessTimeRounded,
  ArrowForwardRounded,
  CheckRounded,
  ExpandMoreRounded,
  LockOutlined,
  MailOutlineRounded,
  PhoneInTalkOutlined,
  PlaceOutlined,
  SendRounded,
  WhatsApp,
} from "@mui/icons-material";
import { apiPost } from "../utils/api";
import { showError, showErrorWithAlternative, showThankYou } from "../utils/swal";
import { evaluatePhoneInput } from "../utils/phoneValidation";
import { contactContent } from "../data/siteContent";
import { GREEN, PageHero, Reveal, SectionHeading } from "../components/PageSections";

const MESSAGE_MAX = 1000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  topic: contactContent.topics[0],
  message: "",
  preferred_contact: "Phone",
};

const contactPreferences = [
  { value: "Phone", icon: PhoneInTalkOutlined },
  { value: "WhatsApp", icon: WhatsApp },
  { value: "Email", icon: MailOutlineRounded },
];

const digits = (value) => String(value || "").replace(/\D/g, "");

// Accept local Kenyan formats (07xx / 01xx) and convert them to +254.
const normalizePhone = (value) => {
  const stripped = String(value || "").replace(/[\s-]+/g, "");
  if (/^0[17]\d{8}$/.test(stripped)) return `+254${stripped.slice(1)}`;
  if (/^254\d{9}$/.test(stripped)) return `+${stripped}`;
  return stripped;
};

const validate = (form) => {
  const errors = {};
  if (form.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!form.phone.trim()) errors.phone = "Please enter your phone number.";
  else if (evaluatePhoneInput(normalizePhone(form.phone)).error)
    errors.phone = "Use a valid number, e.g. 0712 345 678 or +254712345678.";
  if (!EMAIL_REGEX.test(form.email.trim())) errors.email = "Please enter a valid email address.";
  if (form.message.trim().length < 10)
    errors.message = "Tell us a little more (at least 10 characters).";
  return errors;
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    backgroundColor: "#FBFAF6",
    transition: "background-color 0.2s ease, box-shadow 0.2s ease",
    "& fieldset": { borderColor: "rgba(27, 67, 50, 0.14)" },
    "&:hover fieldset": { borderColor: GREEN.light },
    "&.Mui-focused": {
      backgroundColor: "#FFFFFF",
      boxShadow: `0 0 0 4px ${GREEN.mist}`,
    },
    "&.Mui-focused fieldset": { borderColor: GREEN.mid, borderWidth: 1.5 },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: GREEN.main },
};

function ChoicePill({ selected, onClick, icon: Icon, children }) {
  return (
    <Box
      component="button"
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.75,
        py: 0.9,
        borderRadius: 999,
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: "0.85rem",
        fontWeight: 600,
        border: `1px solid ${selected ? GREEN.main : "rgba(27, 67, 50, 0.16)"}`,
        color: selected ? "#FFFFFF" : GREEN.ink,
        backgroundColor: selected ? GREEN.main : "#FFFFFF",
        boxShadow: selected ? "0 8px 18px rgba(45, 106, 79, 0.25)" : "none",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: GREEN.mid,
          backgroundColor: selected ? GREEN.main : GREEN.mist,
        },
        "&:focus-visible": { outline: `3px solid ${GREEN.light}`, outlineOffset: 2 },
      }}
    >
      {selected ? (
        <CheckRounded sx={{ fontSize: 16 }} />
      ) : (
        Icon && <Icon sx={{ fontSize: 16, color: GREEN.mid }} />
      )}
      {children}
    </Box>
  );
}

function ContactMethodCard({ icon: Icon, label, value, hint, href, external, tone, delay }) {
  return (
    <Reveal delay={delay} sx={{ height: "100%" }}>
      <Box
        component="a"
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          p: { xs: 2.25, md: 2.75 },
          borderRadius: "22px 22px 22px 6px",
          textDecoration: "none",
          color: GREEN.ink,
          backgroundColor: "#FFFFFF",
          border: "1px solid rgba(27, 67, 50, 0.08)",
          boxShadow: "0 18px 40px rgba(27, 67, 50, 0.1)",
          transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease",
          "& .method-arrow": { transition: "transform 0.25s ease" },
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 26px 50px rgba(27, 67, 50, 0.16)",
            "& .method-arrow": { transform: "translateX(4px)" },
            "& .method-icon": { transform: "rotate(-8deg) scale(1.06)" },
          },
          "&:focus-visible": { outline: `3px solid ${GREEN.light}`, outlineOffset: 3 },
        }}
      >
        <Box
          className="method-icon"
          sx={{
            width: 48,
            height: 48,
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            background: tone,
            transition: "transform 0.3s ease",
          }}
        >
          <Icon />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "text.secondary" }}>
            {label}
          </Typography>
          <Typography
            sx={{ fontWeight: 800, fontSize: { xs: "0.95rem", md: "1.02rem" }, wordBreak: "break-word" }}
          >
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            color: GREEN.main,
            fontWeight: 700,
            fontSize: "0.85rem",
          }}
        >
          {hint}
          <ArrowForwardRounded className="method-arrow" sx={{ fontSize: 18 }} />
        </Box>
      </Box>
    </Reveal>
  );
}

export default function Contact() {
  const navigate = useNavigate();
  const { settings } = useOutletContext() || {};
  const phone = settings?.phone || "+254 700 000000";
  const email = settings?.email || "info@mcaludoh.co.ke";
  const whatsapp = settings?.whatsapp || phone;
  const address = settings?.address || "Nairobi, Kenya";

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const change = (field) => (e) => {
    const value = field === "message" ? e.target.value.slice(0, MESSAGE_MAX) : e.target.value;
    const next = { ...form, [field]: value };
    setForm(next);
    if (touched[field]) setErrors(validate(next));
  };

  const blur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(form));
  };

  const whatsappLink = (text) =>
    `https://wa.me/${digits(whatsapp)}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    setTouched({ name: true, phone: true, email: true, message: true });
    if (Object.keys(found).length) return;

    const payload = {
      name: form.name.trim(),
      phone: normalizePhone(form.phone),
      email: form.email.trim(),
      subject: form.topic,
      message: `${form.message.trim()}\n\nPreferred contact method: ${form.preferred_contact}`,
    };

    setSubmitting(true);
    try {
      await apiPost("/api/contact-messages", payload);
      const firstName = payload.name.split(" ")[0];
      const replyChannel = form.preferred_contact === "Phone" ? "phone" : form.preferred_contact;
      setForm(emptyForm);
      setTouched({});
      setErrors({});
      showThankYou({
        title: `Thank you, ${firstName}!`,
        text: `Your message has reached our team. We'll get back to you by ${replyChannel} as soon as possible.`,
        note: contactContent.responseTime,
        confirmText: "Great, thanks",
      });
    } catch (error) {
      if (error.offline) {
        const useWhatsApp = await showErrorWithAlternative({
          title: "Message not sent yet",
          message:
            "Our server is not reachable right now. You can send the same message instantly on WhatsApp instead.",
          alternativeText: "Send via WhatsApp",
        });
        if (useWhatsApp) {
          window.open(
            whatsappLink(
              `Hello Mcaludoh Consultancy, I'm ${payload.name} (${payload.phone}, ${payload.email}).\nTopic: ${payload.subject}\n\n${form.message.trim()}`
            ),
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

  const methods = [
    {
      icon: PhoneInTalkOutlined,
      label: "Call us",
      value: phone,
      hint: "Tap to call",
      href: `tel:+${digits(phone)}`,
      tone: `linear-gradient(150deg, ${GREEN.mid}, ${GREEN.deep})`,
    },
    {
      icon: WhatsApp,
      label: "WhatsApp",
      value: "Chat with us",
      hint: "Start chat",
      href: whatsappLink("Hello Mcaludoh Consultancy, I'd like to make an enquiry."),
      external: true,
      tone: "linear-gradient(150deg, #3BD671, #128C4B)",
    },
    {
      icon: MailOutlineRounded,
      label: "Email",
      value: email,
      hint: "Write to us",
      href: `mailto:${email}`,
      tone: `linear-gradient(150deg, ${GREEN.light}, ${GREEN.main})`,
    },
    {
      icon: PlaceOutlined,
      label: "Visit us",
      value: address,
      hint: "Get directions",
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
      external: true,
      tone: "linear-gradient(150deg, #B08D57, #7A5C2E)",
    },
  ];

  const fieldError = (field) => touched[field] && errors[field];

  return (
    <Box sx={{ backgroundColor: GREEN.cream, overflowX: "hidden" }}>
      <Helmet>
        <title>Contact Us | Mcaludoh Consultancy</title>
        <meta
          name="description"
          content="Call, WhatsApp, email or send a message to Mcaludoh Consultancy for hydroponics, vertical farming, agronomy, landscaping, training and EIA services."
        />
      </Helmet>

      <PageHero
        eyebrow="Contact us"
        title="Let's talk about"
        highlight="your farm."
        subtitle="Whether it's a quick question, a site visit or a full project, our team is ready to help. Pick the channel that suits you best."
      >
        <Box
          sx={{
            mt: 3,
            display: "inline-flex",
            alignItems: "center",
            gap: 1.25,
            px: 2,
            py: 1,
            borderRadius: 999,
            border: "1px solid rgba(216, 243, 220, 0.3)",
            backgroundColor: "rgba(216, 243, 220, 0.1)",
            backdropFilter: "blur(10px)",
            fontSize: "0.88rem",
            fontWeight: 600,
          }}
        >
          <Box
            sx={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              backgroundColor: "#6EE7A8",
              "@keyframes contactPulse": {
                "0%": { boxShadow: "0 0 0 0 rgba(110, 231, 168, 0.7)" },
                "70%": { boxShadow: "0 0 0 10px rgba(110, 231, 168, 0)" },
                "100%": { boxShadow: "0 0 0 0 rgba(110, 231, 168, 0)" },
              },
              animation: "contactPulse 2s infinite",
              "@media (prefers-reduced-motion: reduce)": { animation: "none" },
            }}
          />
          {contactContent.responseTime}
        </Box>
      </PageHero>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, mt: { xs: -8, md: -9 } }}>
        <Box
          sx={{
            display: "grid",
            gap: { xs: 1.5, sm: 2 },
            gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
          }}
        >
          {methods.map((method, index) => (
            <ContactMethodCard key={method.label} {...method} delay={index * 90} />
          ))}
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
        <Box
          sx={{
            display: "grid",
            gap: { xs: 3, md: 4 },
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 7fr) minmax(0, 5fr)" },
            alignItems: "start",
          }}
        >
          <Reveal>
            <Box
              component="form"
              noValidate
              onSubmit={submit}
              sx={{
                p: { xs: 2.5, sm: 3.5, md: 4.5 },
                borderRadius: "30px 30px 30px 8px",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 24px 60px rgba(27, 67, 50, 0.1)",
                border: "1px solid rgba(27, 67, 50, 0.06)",
              }}
            >
              <Typography
                component="h2"
                sx={{ fontWeight: 800, fontSize: { xs: "1.5rem", md: "1.85rem" }, color: GREEN.ink }}
              >
                Send us a message
              </Typography>
              <Typography sx={{ color: "text.secondary", mt: 0.75, mb: 3 }}>
                Fill in the form and the right specialist will get back to you.
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                }}
              >
                <TextField
                  label="Full name"
                  autoComplete="name"
                  value={form.name}
                  onChange={change("name")}
                  onBlur={blur("name")}
                  error={Boolean(fieldError("name"))}
                  helperText={fieldError("name") || " "}
                  sx={{ ...fieldSx, gridColumn: { sm: "1 / -1" } }}
                />
                <TextField
                  label="Phone number"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="0712 345 678"
                  value={form.phone}
                  onChange={change("phone")}
                  onBlur={blur("phone")}
                  error={Boolean(fieldError("phone"))}
                  helperText={fieldError("phone") || " "}
                  sx={fieldSx}
                />
                <TextField
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={change("email")}
                  onBlur={blur("email")}
                  error={Boolean(fieldError("email"))}
                  helperText={fieldError("email") || " "}
                  sx={fieldSx}
                />
              </Box>

              <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", mt: 0.5, mb: 1.25 }}>
                What is it about?
              </Typography>
              <Box role="radiogroup" aria-label="Topic" sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                {contactContent.topics.map((topic) => (
                  <ChoicePill
                    key={topic}
                    selected={form.topic === topic}
                    onClick={() => setForm({ ...form, topic })}
                  >
                    {topic}
                  </ChoicePill>
                ))}
              </Box>

              <TextField
                label="Your message"
                multiline
                minRows={5}
                fullWidth
                placeholder="Tell us about your farm, space or project..."
                value={form.message}
                onChange={change("message")}
                onBlur={blur("message")}
                error={Boolean(fieldError("message"))}
                helperText={
                  <Box component="span" sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                    <span>{fieldError("message") || " "}</span>
                    <span>
                      {form.message.length}/{MESSAGE_MAX}
                    </span>
                  </Box>
                }
                sx={fieldSx}
              />

              <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", mt: 2, mb: 1.25 }}>
                How should we reply?
              </Typography>
              <Box
                role="radiogroup"
                aria-label="Preferred contact method"
                sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3.5 }}
              >
                {contactPreferences.map((option) => (
                  <ChoicePill
                    key={option.value}
                    icon={option.icon}
                    selected={form.preferred_contact === option.value}
                    onClick={() => setForm({ ...form, preferred_contact: option.value })}
                  >
                    {option.value}
                  </ChoicePill>
                ))}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "stretch", sm: "center" },
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    color: "text.secondary",
                    fontSize: "0.8rem",
                  }}
                >
                  <LockOutlined sx={{ fontSize: 16, color: GREEN.mid }} />
                  Your details are only used to reply to you.
                </Typography>
                <Button
                  type="submit"
                  disabled={submitting}
                  endIcon={
                    submitting ? (
                      <CircularProgress size={18} sx={{ color: "inherit" }} />
                    ) : (
                      <SendRounded />
                    )
                  }
                  sx={{
                    minHeight: 52,
                    px: 4,
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#FFFFFF",
                    background: `linear-gradient(135deg, ${GREEN.mid}, ${GREEN.deep})`,
                    boxShadow: "0 14px 30px rgba(45, 106, 79, 0.35)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "& .MuiButton-endIcon": { transition: "transform 0.2s ease" },
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 18px 36px rgba(45, 106, 79, 0.45)",
                      "& .MuiButton-endIcon": { transform: "translate(3px, -2px)" },
                    },
                    "&.Mui-disabled": { color: "#FFFFFF", opacity: 0.75 },
                  }}
                >
                  {submitting ? "Sending..." : "Send message"}
                </Button>
              </Box>
            </Box>
          </Reveal>

          <Box sx={{ display: "grid", gap: { xs: 3, md: 4 } }}>
            <Reveal delay={120}>
              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  p: { xs: 3, md: 3.5 },
                  borderRadius: "30px 30px 8px 30px",
                  color: "#FFFFFF",
                  background: `linear-gradient(160deg, ${GREEN.deep}, ${GREEN.main})`,
                  boxShadow: "0 24px 50px rgba(27, 67, 50, 0.25)",
                }}
              >
                <AccessTimeRounded
                  aria-hidden
                  sx={{
                    position: "absolute",
                    right: -24,
                    top: -24,
                    fontSize: 150,
                    color: "rgba(216, 243, 220, 0.08)",
                  }}
                />
                <Typography sx={{ fontWeight: 800, fontSize: "1.25rem", mb: 2 }}>
                  Office hours
                </Typography>
                {contactContent.hours.map((slot, index) => (
                  <Box
                    key={slot.day}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 2,
                      py: 1.4,
                      borderTop: index ? "1px dashed rgba(216, 243, 220, 0.25)" : "none",
                    }}
                  >
                    <Typography sx={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.92rem" }}>
                      {slot.day}
                    </Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.92rem", textAlign: "right" }}>
                      {slot.time}
                    </Typography>
                  </Box>
                ))}
                <Button
                  href={whatsappLink("Hello Mcaludoh Consultancy, I'd like to make an enquiry.")}
                  target="_blank"
                  rel="noreferrer"
                  startIcon={<WhatsApp />}
                  fullWidth
                  sx={{
                    mt: 2,
                    minHeight: 46,
                    borderRadius: 999,
                    fontWeight: 700,
                    color: GREEN.deep,
                    backgroundColor: "#FFFFFF",
                    "&:hover": { backgroundColor: GREEN.mist },
                  }}
                >
                  Quick chat on WhatsApp
                </Button>
              </Box>
            </Reveal>

            <Reveal delay={200}>
              <Box
                sx={{
                  overflow: "hidden",
                  borderRadius: "30px 8px 30px 30px",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 24px 50px rgba(27, 67, 50, 0.1)",
                }}
              >
                <Box
                  component="iframe"
                  title={`Map showing ${address}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=12&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  sx={{
                    display: "block",
                    width: "100%",
                    height: { xs: 220, md: 250 },
                    border: 0,
                    filter: "saturate(0.85)",
                  }}
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 2.25 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      flexShrink: 0,
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: GREEN.main,
                      backgroundColor: GREEN.mist,
                    }}
                  >
                    <PlaceOutlined />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 800 }}>{address}</Typography>
                    <Typography sx={{ fontSize: "0.82rem", color: "text.secondary" }}>
                      Site visits available across Kenya
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Reveal>
          </Box>
        </Box>
      </Container>

      <Box sx={{ backgroundColor: "#FFFFFF", py: { xs: 6, md: 9 } }}>
        <Container maxWidth="md">
          <Reveal>
            <SectionHeading
              eyebrow="Good to know"
              title="Frequently asked questions"
              subtitle="Quick answers to what people usually ask before getting in touch."
            />
          </Reveal>
          {contactContent.faqs.map((faq, index) => (
            <Reveal key={faq.question} delay={index * 80}>
              <Accordion
                disableGutters
                elevation={0}
                sx={{
                  mb: 1.5,
                  borderRadius: "18px !important",
                  border: "1px solid rgba(27, 67, 50, 0.1)",
                  backgroundColor: GREEN.cream,
                  "&:before": { display: "none" },
                  "&.Mui-expanded": {
                    backgroundColor: "#FFFFFF",
                    borderColor: GREEN.light,
                    boxShadow: "0 16px 36px rgba(27, 67, 50, 0.1)",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#FFFFFF",
                        backgroundColor: GREEN.main,
                      }}
                    >
                      <ExpandMoreRounded fontSize="small" />
                    </Box>
                  }
                  sx={{ px: { xs: 2, md: 3 }, py: 0.75 }}
                >
                  <Typography sx={{ fontWeight: 700, color: GREEN.ink }}>{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: { xs: 2, md: 3 }, pt: 0, pb: 2.5 }}>
                  <Typography sx={{ color: "text.secondary", lineHeight: 1.75 }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Reveal>
          ))}

          <Reveal>
            <Box
              sx={{
                mt: { xs: 4, md: 5 },
                p: { xs: 2.5, md: 3 },
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                gap: 2,
                borderRadius: "22px",
                background: `linear-gradient(120deg, ${GREEN.mist}, #EEF7F0)`,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 800, color: GREEN.ink }}>
                  Already know what you need?
                </Typography>
                <Typography sx={{ color: "text.secondary", fontSize: "0.92rem" }}>
                  Skip the back-and-forth and request a service directly.
                </Typography>
              </Box>
              <Button
                onClick={() => navigate("/request-service")}
                endIcon={<ArrowForwardRounded />}
                sx={{
                  flexShrink: 0,
                  minHeight: 46,
                  px: 3,
                  borderRadius: 999,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  backgroundColor: GREEN.main,
                  "&:hover": { backgroundColor: GREEN.deep },
                }}
              >
                Request a service
              </Button>
            </Box>
          </Reveal>
        </Container>
      </Box>
    </Box>
  );
}

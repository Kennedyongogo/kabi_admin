import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, CircularProgress, Container, IconButton, TextField, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
  AddRounded,
  ArrowBackRounded,
  ArrowForwardRounded,
  CalendarMonthRounded,
  CheckCircleRounded,
  CheckRounded,
  ChevronRightRounded,
  EventRepeatRounded,
  GroupsRounded,
  LaptopMacRounded,
  LockOutlined,
  PaymentsOutlined,
  PlaceOutlined,
  RemoveRounded,
  ScheduleRounded,
  SearchOffRounded,
  SignalCellularAltRounded,
  WhatsApp,
} from "@mui/icons-material";
import { courses } from "../data/prototypeContent";
import { GREEN, Reveal } from "../components/PageSections";
import CourseCard, { SeatsBadge, lowestFee, upcomingSessions } from "../components/CourseCard";
import {
  EMAIL_REGEX,
  EmptyState,
  fieldSx,
  normalizePhone,
  primaryButtonSx,
} from "../components/FormControls";
import { apiGet, apiPost, mediaUrl } from "../utils/api";
import { evaluatePhoneInput } from "../utils/phoneValidation";
import { showError, showThankYou } from "../utils/swal";
import { formatDate, formatDateRange, formatKES } from "../utils/format";

const FLEXIBLE = "flexible";
const MAX_PARTICIPANTS = 10;

const emptyForm = { name: "", phone: "", email: "", organization: "", preferred_date: "", participants: 1 };

const includes = (online) => [
  online ? "Live, interactive online sessions" : "Hands-on practice on working systems",
  "Printed and digital course notes",
  online ? "Session recordings for 30 days" : "Lunch and refreshments every day",
  "Verifiable certificate of completion",
  "3 months of WhatsApp follow-up support",
];

function SectionTitle({ children }) {
  return (
    <Typography
      component="h2"
      sx={{ mb: 2, fontWeight: 800, fontSize: { xs: "1.3rem", md: "1.5rem" }, letterSpacing: "-0.01em", color: GREEN.ink }}
    >
      {children}
    </Typography>
  );
}

function SessionOption({ selected, disabled, onSelect, children }) {
  return (
    <Box
      component="button"
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      sx={{
        position: "relative",
        width: "100%",
        p: 2,
        textAlign: "left",
        fontFamily: "inherit",
        color: GREEN.ink,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        borderRadius: "20px 20px 20px 6px",
        border: `2px solid ${selected ? GREEN.mid : "rgba(27, 67, 50, 0.1)"}`,
        backgroundColor: selected ? "#F1FAF3" : "#FFFFFF",
        boxShadow: selected ? "0 14px 30px rgba(45, 106, 79, 0.15)" : "none",
        transition: "all 0.2s ease",
        "&:hover:not(:disabled)": { borderColor: GREEN.light },
        "&:focus-visible": { outline: `3px solid ${GREEN.light}`, outlineOffset: 2 },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 14,
          right: 14,
          width: 24,
          height: 24,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
          border: `2px solid ${selected ? GREEN.mid : "rgba(27, 67, 50, 0.2)"}`,
          backgroundColor: selected ? GREEN.mid : "transparent",
          transition: "all 0.2s ease",
        }}
      >
        {selected && <CheckRounded sx={{ fontSize: 16 }} />}
      </Box>
      {children}
    </Box>
  );
}

export default function TrainingDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { settings } = useOutletContext() || {};
  const whatsapp = String(settings?.whatsapp || settings?.phone || "+254 700 000000").replace(/\D/g, "");
  // undefined while loading; null when the API doesn't have this course (the prototype copy is shown instead)
  const [apiCourse, setApiCourse] = useState(undefined);
  useEffect(() => {
    let cancelled = false;
    setApiCourse(undefined);
    apiGet(`/api/courses/${encodeURIComponent(slug)}`)
      .then((res) => !cancelled && setApiCourse(res.data || null))
      .catch(() => !cancelled && setApiCourse(null));
    return () => {
      cancelled = true;
    };
  }, [slug]);
  const loadingCourse = apiCourse === undefined;
  const course = apiCourse || (loadingCourse ? null : courses.find((c) => c.slug === slug));

  const sessions = useMemo(() => (course ? upcomingSessions(course) : []), [course]);
  const [booked, setBooked] = useState({});
  const seatsLeft = (session) => Math.max(0, (session.seats_left ?? 0) - (booked[session.id] || 0));

  const [sessionId, setSessionId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formInView, setFormInView] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const firstOpen = sessions.find((s) => s.seats_left > 0);
    setSessionId(firstOpen ? firstOpen.id : FLEXIBLE);
    setForm(emptyForm);
    setErrors({});
    setTouched({});
  }, [sessions]);

  useEffect(() => {
    const node = formRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => setFormInView(entry.isIntersecting), { threshold: 0 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [course]);

  if (loadingCourse) {
    return (
      <Box sx={{ backgroundColor: GREEN.cream, minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress sx={{ color: GREEN.main }} />
      </Box>
    );
  }

  if (!course) {
    return (
      <Box sx={{ backgroundColor: GREEN.cream, py: { xs: 8, md: 12 } }}>
        <Helmet>
          <title>Course not found | Mcaludoh Consultancy</title>
        </Helmet>
        <Container maxWidth="sm">
          <EmptyState
            icon={SearchOffRounded}
            title="We couldn't find that course"
            text="It may have been renamed or is no longer offered. See all current trainings."
            action={
              <Button onClick={() => navigate("/training")} startIcon={<ArrowBackRounded />} sx={{ ...primaryButtonSx, minHeight: 46, px: 3, fontSize: "0.95rem" }}>
                All trainings
              </Button>
            }
          />
        </Container>
      </Box>
    );
  }

  const online = /online/i.test(course.mode || "");
  const selected = sessions.find((s) => s.id === sessionId);
  const unitFee = selected?.fee ?? course.fee;
  const total = unitFee ? unitFee * form.participants : null;
  const fromFee = lowestFee(course);
  const related =
    course.related ||
    [
      ...courses.filter((c) => c.id !== course.id && c.category === course.category),
      ...courses.filter((c) => c.id !== course.id && c.category !== course.category),
    ].slice(0, 3);
  const heroImage = mediaUrl(course.image || "").replace(/w=\d+/, "w=1800");

  const validate = (values) => {
    const found = {};
    if (values.name.trim().length < 2) found.name = "Please enter your full name.";
    if (!values.phone.trim()) found.phone = "Please enter your phone number.";
    else if (evaluatePhoneInput(normalizePhone(values.phone)).error)
      found.phone = "Use a valid number, e.g. 0712 345 678.";
    if (!EMAIL_REGEX.test(values.email.trim())) found.email = "Please enter a valid email address.";
    if (sessionId === FLEXIBLE && !values.preferred_date) found.preferred_date = "Pick a date that works for you.";
    if (selected && values.participants > seatsLeft(selected))
      found.participants = `Only ${seatsLeft(selected)} seats are left in this session.`;
    return found;
  };

  const change = (field) => (e) => {
    const next = { ...form, [field]: e.target.value };
    setForm(next);
    if (touched[field]) setErrors(validate(next));
  };
  const blur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(form));
  };
  const setParticipants = (value) => {
    const next = { ...form, participants: Math.min(MAX_PARTICIPANTS, Math.max(1, value)) };
    setForm(next);
    setErrors(validate(next));
  };
  const fieldError = (field) => touched[field] && errors[field];

  const scrollToForm = () => {
    const node = formRef.current;
    if (node) window.scrollTo({ top: node.getBoundingClientRect().top + window.scrollY - 84, behavior: "smooth" });
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    setTouched({ name: true, phone: true, email: true, preferred_date: true, participants: true });
    if (Object.keys(found).length) return;

    const phone = normalizePhone(form.phone);
    setSubmitting(true);
    let reference;
    try {
      const { data } = await apiPost("/api/training-bookings/submit", {
        course: course.slug,
        ...(selected ? { session_id: selected.id } : { preferred_date: form.preferred_date }),
        name: form.name.trim(),
        phone,
        email: form.email.trim(),
        organization: form.organization.trim(),
        participants: form.participants,
      });
      reference = data?.reference;
    } catch (error) {
      showError(error.message);
      return;
    } finally {
      setSubmitting(false);
    }

    const firstName = form.name.trim().split(" ")[0];
    const seats = form.participants;
    const seatText = `${seats} ${seats === 1 ? "seat" : "seats"}`;

    if (selected) {
      setBooked((prev) => ({ ...prev, [selected.id]: (prev[selected.id] || 0) + seats }));
    }

    showThankYou({
      title: `You're registered, ${firstName}!`,
      text: selected
        ? `We've reserved ${seatText} on ${course.name} (${formatDateRange(selected.start_date, selected.end_date)}, ${selected.location}). Our team will call you on ${phone} within 24 hours with payment and joining details.`
        : `Thanks for your interest in ${course.name}. We'll call you on ${phone} to confirm a session around ${formatDate(form.preferred_date)}.`,
      note: reference ? `Booking reference: ${reference}. Keep it handy for when we call.` : undefined,
      confirmText: "Done",
    });

    setForm(emptyForm);
    setTouched({});
    setErrors({});
  };

  const heroMeta = [
    { icon: ScheduleRounded, text: course.duration },
    { icon: online ? LaptopMacRounded : PlaceOutlined, text: course.mode },
    { icon: SignalCellularAltRounded, text: course.level },
    { icon: PlaceOutlined, text: course.location },
  ].filter((m) => m.text);

  const today = new Date();
  today.setDate(today.getDate() + 3);
  const minDate = today.toISOString().slice(0, 10);

  return (
    <Box sx={{ backgroundColor: GREEN.cream, overflowX: "hidden", pb: { xs: 10, md: 0 } }}>
      <Helmet>
        <title>{course.name} | Training | Mcaludoh Consultancy</title>
        <meta name="description" content={course.short_description} />
      </Helmet>

      <Box sx={{ position: "relative", color: "#FFFFFF", overflow: "hidden" }}>
        {heroImage && (
          <Box
            component="img"
            src={heroImage}
            alt=""
            sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(100deg, rgba(27, 67, 50, 0.96) 0%, rgba(27, 67, 50, 0.85) 45%, rgba(27, 67, 50, 0.45) 100%)`,
          }}
        />
        <Container maxWidth="lg" sx={{ position: "relative", pt: { xs: 5, md: 8 }, pb: { xs: 6, md: 9 } }}>
          <Reveal>
            <Box component="nav" aria-label="Breadcrumb" sx={{ display: "flex", alignItems: "center", gap: 0.5, fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.75)" }}>
              <Box
                component="a"
                href="/training"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/training");
                }}
                sx={{ color: "inherit", textDecoration: "none", fontWeight: 600, "&:hover": { color: "#FFFFFF" } }}
              >
                Training
              </Box>
              <ChevronRightRounded sx={{ fontSize: 18 }} />
              <Box component="span" sx={{ color: GREEN.mist, fontWeight: 700 }}>
                {course.category}
              </Box>
            </Box>
            <Typography
              component="h1"
              sx={{ mt: 2, maxWidth: 720, fontWeight: 800, fontSize: { xs: "2rem", sm: "2.5rem", md: "3.1rem" }, lineHeight: 1.1, letterSpacing: "-0.03em" }}
            >
              {course.name}
            </Typography>
            <Typography sx={{ mt: 1.75, maxWidth: 620, fontSize: { xs: "1rem", md: "1.12rem" }, lineHeight: 1.75, color: "rgba(255, 255, 255, 0.86)" }}>
              {course.short_description}
            </Typography>
            <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {heroMeta.map(({ icon: Icon, text }) => (
                <Box
                  key={text}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.75,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 999,
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    border: "1px solid rgba(216, 243, 220, 0.3)",
                    backgroundColor: "rgba(216, 243, 220, 0.1)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Icon sx={{ fontSize: 17, color: GREEN.light }} />
                  {text}
                </Box>
              ))}
            </Box>
            <Box sx={{ mt: 3.5, display: "flex", flexWrap: "wrap", alignItems: "center", gap: { xs: 1.5, sm: 3 } }}>
              <Button
                onClick={scrollToForm}
                endIcon={<ArrowForwardRounded />}
                sx={{ minHeight: 52, px: 3.5, borderRadius: 999, fontWeight: 700, color: GREEN.deep, backgroundColor: "#FFFFFF", "&:hover": { backgroundColor: GREEN.mist } }}
              >
                Reserve my seat
              </Button>
              {fromFee !== null && (
                <Box>
                  <Typography sx={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.7)", fontWeight: 600 }}>Course fee from</Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: "1.35rem", lineHeight: 1.1 }}>{formatKES(fromFee)}</Typography>
                </Box>
              )}
            </Box>
          </Reveal>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Box sx={{ display: "grid", gap: { xs: 4, md: 5 }, gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 400px" }, alignItems: "start" }}>
          <Box sx={{ display: "grid", gap: { xs: 4, md: 5 } }}>
            <Reveal>
              <SectionTitle>About this course</SectionTitle>
              <Typography sx={{ fontSize: { xs: "1rem", md: "1.06rem" }, lineHeight: 1.85, color: "#3C4A42" }}>{course.description}</Typography>
              {course.audience && (
                <Box sx={{ mt: 2.5, p: 2, display: "flex", gap: 1.5, alignItems: "center", borderRadius: "18px", backgroundColor: "#FFFFFF", border: "1px solid rgba(27, 67, 50, 0.07)" }}>
                  <Box sx={{ width: 44, height: 44, flexShrink: 0, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: GREEN.main, backgroundColor: GREEN.mist }}>
                    <GroupsRounded />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "text.secondary" }}>Who it's for</Typography>
                    <Typography sx={{ fontWeight: 700, color: GREEN.ink }}>{course.audience}</Typography>
                  </Box>
                </Box>
              )}
            </Reveal>

            {course.outcomes?.length > 0 && (
              <Reveal>
                <SectionTitle>What you'll be able to do</SectionTitle>
                <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                  {course.outcomes.map((outcome, index) => (
                    <Box
                      key={outcome}
                      sx={{
                        display: "flex",
                        gap: 1.5,
                        p: 2,
                        borderRadius: "18px 18px 18px 6px",
                        backgroundColor: "#FFFFFF",
                        boxShadow: "0 10px 26px rgba(27, 67, 50, 0.06)",
                      }}
                    >
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          flexShrink: 0,
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.8rem",
                          fontWeight: 800,
                          color: "#FFFFFF",
                          background: `linear-gradient(150deg, ${GREEN.light}, ${GREEN.main})`,
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography sx={{ fontWeight: 600, lineHeight: 1.5, color: GREEN.ink, fontSize: "0.95rem" }}>{outcome}</Typography>
                    </Box>
                  ))}
                </Box>
              </Reveal>
            )}

            <Reveal>
              <SectionTitle>What's included</SectionTitle>
              <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1.25, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                {includes(online).map((item) => (
                  <Box key={item} component="li" sx={{ display: "flex", alignItems: "flex-start", gap: 1.25, color: "#3C4A42", lineHeight: 1.6 }}>
                    <CheckCircleRounded sx={{ mt: "2px", fontSize: 20, color: GREEN.mid }} />
                    {item}
                  </Box>
                ))}
              </Box>
            </Reveal>

            <Reveal>
              <SectionTitle>Choose a session</SectionTitle>
              <Box role="radiogroup" aria-label="Training session" sx={{ display: "grid", gap: 1.5 }}>
                {sessions.map((session) => {
                  const left = seatsLeft(session);
                  const filled = session.capacity ? ((session.capacity - left) / session.capacity) * 100 : 0;
                  return (
                    <SessionOption
                      key={session.id}
                      selected={sessionId === session.id}
                      disabled={left === 0}
                      onSelect={() => {
                        setSessionId(session.id);
                        setErrors({});
                      }}
                    >
                      <Box sx={{ pr: 4, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
                        <CalendarMonthRounded sx={{ fontSize: 20, color: GREEN.mid }} />
                        <Typography sx={{ fontWeight: 800, fontSize: "1.02rem" }}>{formatDateRange(session.start_date, session.end_date)}</Typography>
                        <SeatsBadge seats={left} />
                      </Box>
                      <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: { xs: 1, sm: 2.5 }, fontSize: "0.86rem", color: "text.secondary" }}>
                        <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                          {/online|zoom/i.test(session.location) ? <LaptopMacRounded sx={{ fontSize: 16 }} /> : <PlaceOutlined sx={{ fontSize: 16 }} />}
                          {session.location}
                        </Box>
                        <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, fontWeight: 700, color: GREEN.deep }}>
                          <PaymentsOutlined sx={{ fontSize: 16 }} />
                          {formatKES(session.fee ?? course.fee)}
                        </Box>
                      </Box>
                      {session.capacity > 0 && (
                        <Box sx={{ mt: 1.5 }}>
                          <Box sx={{ height: 6, borderRadius: 99, backgroundColor: "rgba(27, 67, 50, 0.08)", overflow: "hidden" }}>
                            <Box
                              sx={{
                                height: "100%",
                                width: `${filled}%`,
                                borderRadius: 99,
                                background: left <= 6 ? "linear-gradient(90deg, #F5B942, #E08A00)" : `linear-gradient(90deg, ${GREEN.light}, ${GREEN.mid})`,
                                transition: "width 0.6s ease",
                              }}
                            />
                          </Box>
                          <Typography sx={{ mt: 0.5, fontSize: "0.75rem", color: "text.secondary" }}>
                            {session.capacity - left} of {session.capacity} seats taken
                          </Typography>
                        </Box>
                      )}
                    </SessionOption>
                  );
                })}
                <SessionOption selected={sessionId === FLEXIBLE} onSelect={() => setSessionId(FLEXIBLE)}>
                  <Box sx={{ pr: 4, display: "flex", alignItems: "center", gap: 1 }}>
                    <EventRepeatRounded sx={{ fontSize: 20, color: GREEN.mid }} />
                    <Typography sx={{ fontWeight: 800, fontSize: "1.02rem" }}>
                      {sessions.length ? "None of these dates work for me" : "Request a date"}
                    </Typography>
                  </Box>
                  <Typography sx={{ mt: 0.75, fontSize: "0.86rem", color: "text.secondary" }}>
                    Tell us your preferred date and we'll fit you into the next intake.
                  </Typography>
                </SessionOption>
              </Box>
            </Reveal>
          </Box>

          <Box ref={formRef} id="register" sx={{ position: { md: "sticky" }, top: 84 }}>
            <Box
              component="form"
              noValidate
              onSubmit={submit}
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: "30px 30px 30px 8px",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 24px 60px rgba(27, 67, 50, 0.12)",
                border: "1px solid rgba(27, 67, 50, 0.06)",
              }}
            >
              <Typography component="h2" sx={{ fontWeight: 800, fontSize: "1.35rem", color: GREEN.ink }}>
                Reserve your seat
              </Typography>
              <Box
                aria-live="polite"
                sx={{ mt: 1.5, mb: 2.5, p: 1.5, display: "flex", alignItems: "center", gap: 1.25, borderRadius: "14px", backgroundColor: GREEN.cream }}
              >
                <Box sx={{ width: 38, height: 38, flexShrink: 0, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", backgroundColor: GREEN.main }}>
                  {selected ? <CalendarMonthRounded sx={{ fontSize: 20 }} /> : <EventRepeatRounded sx={{ fontSize: 20 }} />}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: "0.92rem", color: GREEN.ink }}>
                    {selected ? formatDateRange(selected.start_date, selected.end_date) : "Flexible date"}
                  </Typography>
                  <Typography noWrap sx={{ fontSize: "0.78rem", color: "text.secondary" }}>
                    {selected ? selected.location : "We'll confirm the next available intake"}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "grid", gap: 0.5 }}>
                <TextField label="Full name" autoComplete="name" value={form.name} onChange={change("name")} onBlur={blur("name")} error={Boolean(fieldError("name"))} helperText={fieldError("name") || " "} sx={fieldSx} />
                <TextField label="Phone number" autoComplete="tel" inputMode="tel" placeholder="0712 345 678" value={form.phone} onChange={change("phone")} onBlur={blur("phone")} error={Boolean(fieldError("phone"))} helperText={fieldError("phone") || " "} sx={fieldSx} />
                <TextField label="Email address" type="email" autoComplete="email" value={form.email} onChange={change("email")} onBlur={blur("email")} error={Boolean(fieldError("email"))} helperText={fieldError("email") || " "} sx={fieldSx} />
                <TextField label="Organisation (optional)" autoComplete="organization" value={form.organization} onChange={change("organization")} helperText=" " sx={fieldSx} />
                {sessionId === FLEXIBLE && (
                  <TextField
                    label="Preferred start date"
                    type="date"
                    value={form.preferred_date}
                    onChange={change("preferred_date")}
                    onBlur={blur("preferred_date")}
                    error={Boolean(fieldError("preferred_date"))}
                    helperText={fieldError("preferred_date") || " "}
                    slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: minDate } }}
                    sx={fieldSx}
                  />
                )}
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.92rem", color: GREEN.ink }}>Participants</Typography>
                  <Typography sx={{ fontSize: "0.76rem", color: "text.secondary" }}>Registering a group? Add seats.</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, p: 0.5, borderRadius: 999, border: "1px solid rgba(27, 67, 50, 0.14)", backgroundColor: "#FBFAF6" }}>
                  <IconButton size="small" aria-label="Remove a participant" disabled={form.participants <= 1} onClick={() => setParticipants(form.participants - 1)} sx={{ color: GREEN.main }}>
                    <RemoveRounded fontSize="small" />
                  </IconButton>
                  <Typography aria-live="polite" sx={{ minWidth: 24, textAlign: "center", fontWeight: 800, color: GREEN.ink }}>
                    {form.participants}
                  </Typography>
                  <IconButton size="small" aria-label="Add a participant" disabled={form.participants >= MAX_PARTICIPANTS} onClick={() => setParticipants(form.participants + 1)} sx={{ color: GREEN.main }}>
                    <AddRounded fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <Typography role={errors.participants ? "alert" : undefined} sx={{ minHeight: 20, mt: 0.5, fontSize: "0.78rem", color: "error.main" }}>
                {errors.participants || ""}
              </Typography>

              {total !== null && (
                <Box sx={{ mt: 1, pt: 2, borderTop: "1px dashed rgba(27, 67, 50, 0.18)", display: "grid", gap: 0.75 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", color: "text.secondary" }}>
                    <span>
                      {formatKES(unitFee)} × {form.participants}
                    </span>
                    <span>{formatKES(total)}</span>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <Typography sx={{ fontWeight: 800, color: GREEN.ink }}>Total</Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: "1.35rem", color: GREEN.deep }}>{formatKES(total)}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: "0.76rem", color: "text.secondary" }}>
                    No payment now. We'll share M-Pesa and bank details when we confirm your seat.
                  </Typography>
                </Box>
              )}

              <Button
                type="submit"
                fullWidth
                disabled={submitting}
                endIcon={submitting ? <CircularProgress size={18} sx={{ color: "inherit" }} /> : <ArrowForwardRounded />}
                sx={{ ...primaryButtonSx, mt: 2.5 }}
              >
                {submitting ? "Reserving..." : selected ? "Reserve my seat" : "Send my request"}
              </Button>
              <Typography sx={{ mt: 1.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 0.75, fontSize: "0.78rem", color: "text.secondary" }}>
                <LockOutlined sx={{ fontSize: 15, color: GREEN.mid }} />
                Your details are only used for this booking.
              </Typography>
            </Box>

            <Button
              fullWidth
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hello Mcaludoh, I have a question about the ${course.name} training.`)}`}
              target="_blank"
              rel="noreferrer"
              startIcon={<WhatsApp />}
              sx={{ mt: 1.5, minHeight: 48, borderRadius: 999, fontWeight: 700, color: "#128C4B", backgroundColor: "#FFFFFF", border: "1px solid rgba(18, 140, 75, 0.25)", "&:hover": { backgroundColor: "#EAF8EF" } }}
            >
              Questions? Ask on WhatsApp
            </Button>
          </Box>
        </Box>
      </Container>

      {related.length > 0 && (
        <Box sx={{ backgroundColor: "#FFFFFF", py: { xs: 6, md: 8 } }}>
          <Container maxWidth="lg">
            <Box sx={{ mb: 3.5, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
              <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: "1.5rem", md: "1.9rem" }, color: GREEN.ink }}>
                You may also like
              </Typography>
              <Button onClick={() => navigate("/training")} endIcon={<ArrowForwardRounded />} sx={{ fontWeight: 700, color: GREEN.main, borderRadius: 999 }}>
                All courses
              </Button>
            </Box>
            <Box sx={{ display: "grid", gap: { xs: 2.5, md: 3 }, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" } }}>
              {related.map((item, index) => (
                <Reveal key={item.id} delay={index * 90} sx={{ height: "100%" }}>
                  <CourseCard course={item} />
                </Reveal>
              ))}
            </Box>
          </Container>
        </Box>
      )}

      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          position: "fixed",
          left: 12,
          right: 12,
          bottom: 12,
          zIndex: 1100,
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          p: 1,
          pl: 2,
          borderRadius: 999,
          backgroundColor: "rgba(27, 67, 50, 0.96)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 16px 40px rgba(27, 42, 34, 0.35)",
          transform: formInView ? "translateY(140%)" : "none",
          transition: "transform 0.35s ease",
        }}
      >
        <Box sx={{ minWidth: 0, color: "#FFFFFF" }}>
          <Typography sx={{ fontSize: "0.7rem", color: "rgba(255, 255, 255, 0.7)" }}>From</Typography>
          <Typography noWrap sx={{ fontWeight: 800, lineHeight: 1.1 }}>
            {fromFee !== null ? formatKES(fromFee) : course.duration}
          </Typography>
        </Box>
        <Button
          onClick={scrollToForm}
          sx={{ minHeight: 44, px: 2.5, borderRadius: 999, fontWeight: 700, color: GREEN.deep, backgroundColor: "#FFFFFF", "&:hover": { backgroundColor: GREEN.mist } }}
        >
          Reserve a seat
        </Button>
      </Box>
    </Box>
  );
}

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { ManageSearchRounded, SendRounded } from "@mui/icons-material";
import { Helmet } from "react-helmet-async";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { apiGet, apiPost } from "../utils/api";
import { showError, showThankYou } from "../utils/swal";
import { fallbackServices } from "../data/siteContent";

const GREEN = {
  deep: "#1B4332",
  main: "#2D6A4F",
  mid: "#40916C",
  mist: "#D8F3DC",
  cream: "#F7F4EC",
};

const OTHER_SERVICE = "other";
const LAST_REQUEST_KEY = "lastServiceRequest";

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  location: "",
  organization: "",
  farm_size: "",
  crop: "",
  farming_method: "",
  service_required: "",
  message: "",
};

const PROGRESS_STEPS = ["Received", "Under review", "In progress", "Resolved"];
const STEP_INDEX = {
  pending: 0,
  reviewing: 1,
  in_progress: 2,
  scheduled: 2,
  resolved: 4,
};
const STATUS_COLORS = {
  pending: { bg: "#EEF2F0", fg: "#44524B" },
  reviewing: { bg: "#FFF4DA", fg: "#8A5A00" },
  in_progress: { bg: "#E3F0FF", fg: "#1F4E8C" },
  scheduled: { bg: "#EDE7FB", fg: "#5B3FA0" },
  resolved: { bg: GREEN.mist, fg: GREEN.deep },
  cancelled: { bg: "#FDECEA", fg: "#9B2C21" },
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

const readLastRequest = () => {
  try {
    return JSON.parse(localStorage.getItem(LAST_REQUEST_KEY)) || {};
  } catch {
    return {};
  }
};

const cardSx = {
  p: { xs: 2.5, sm: 4 },
  borderRadius: "28px 28px 28px 8px",
  bgcolor: "#fff",
  border: "1px solid rgba(45, 106, 79, 0.12)",
  boxShadow: "0 18px 50px rgba(27, 67, 50, 0.08)",
};

const primaryButtonSx = {
  px: 3.5,
  py: 1.25,
  borderRadius: 999,
  fontWeight: 700,
  textTransform: "none",
  bgcolor: GREEN.main,
  "&:hover": { bgcolor: GREEN.deep },
};

function TrackResult({ result }) {
  const colors = STATUS_COLORS[result.status] || STATUS_COLORS.pending;
  const cancelled = result.status === "cancelled";

  return (
    <Box
      sx={{
        mt: 3,
        p: { xs: 2, sm: 3 },
        borderRadius: 4,
        bgcolor: GREEN.cream,
        border: "1px solid rgba(45, 106, 79, 0.12)",
      }}
      aria-live="polite"
    >
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Typography sx={{ fontWeight: 700, color: GREEN.deep, letterSpacing: "0.04em" }}>
          {result.reference}
        </Typography>
        <Chip
          label={result.status_label}
          size="small"
          sx={{ bgcolor: colors.bg, color: colors.fg, fontWeight: 700 }}
        />
      </Box>
      <Typography sx={{ color: "text.secondary", mb: 2.5 }}>
        {result.service} · submitted {formatDate(result.submitted_at)}
      </Typography>

      {cancelled ? (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
          This request was cancelled. Contact us if you think this is a mistake.
        </Alert>
      ) : (
        <Stepper
          activeStep={STEP_INDEX[result.status] ?? 0}
          alternativeLabel
          sx={{
            mb: 2.5,
            "& .MuiStepIcon-root.Mui-active, & .MuiStepIcon-root.Mui-completed": {
              color: GREEN.mid,
            },
            "& .MuiStepLabel-label": { fontSize: { xs: "0.7rem", sm: "0.8rem" } },
          }}
        >
          {PROGRESS_STEPS.map((label, index) => (
            <Step key={label}>
              <StepLabel>
                {index === 2 && result.status === "scheduled" ? "Visit scheduled" : label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      )}

      {result.admin_response ? (
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: "#fff",
            borderLeft: `4px solid ${GREEN.mid}`,
          }}
        >
          <Typography sx={{ fontWeight: 700, color: GREEN.deep, mb: 0.5 }}>
            Response from our team
          </Typography>
          <Typography sx={{ whiteSpace: "pre-line", color: "#33423A" }}>
            {result.admin_response}
          </Typography>
          {result.responded_at && (
            <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary" }}>
              {formatDate(result.responded_at)}
            </Typography>
          )}
        </Box>
      ) : (
        !cancelled && (
          <Typography sx={{ color: "text.secondary" }}>
            Our team hasn't responded yet. We usually get back to you within 1–2 working days.
          </Typography>
        )
      )}

      {result.resolved_at && (
        <Typography variant="body2" sx={{ mt: 2, color: GREEN.main, fontWeight: 600 }}>
          Resolved on {formatDate(result.resolved_at)}
        </Typography>
      )}
    </Box>
  );
}

export default function RequestService() {
  const { services = [] } = useOutletContext() || {};
  const [searchParams] = useSearchParams();
  const preset = searchParams.get("service");
  const presetRef = searchParams.get("ref");
  const serviceOptions = services.length ? services : fallbackServices;

  const selectedService = useMemo(
    () =>
      services.find((item) => item.slug === preset || item.id === preset) ||
      fallbackServices.find((item) => item.slug === preset) ||
      null,
    [services, preset]
  );

  const presetNotes = [
    searchParams.get("package") && `Package: ${searchParams.get("package")}`,
    searchParams.get("needs") && `Interested in: ${searchParams.get("needs")}`,
  ]
    .filter(Boolean)
    .join("\n");

  const [serviceKey, setServiceKey] = useState(
    selectedService ? selectedService.id || selectedService.slug : ""
  );
  const [form, setForm] = useState({ ...EMPTY_FORM, message: presetNotes });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const lastRequest = readLastRequest();
  const [track, setTrack] = useState({
    reference: presetRef || lastRequest.reference || "",
    contact: presetRef ? "" : lastRequest.contact || "",
  });
  const [tracking, setTracking] = useState(false);
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState("");
  const trackRef = useRef(null);

  useEffect(() => {
    if (selectedService) setServiceKey(selectedService.id || selectedService.slug);
  }, [selectedService]);

  useEffect(() => {
    if (presetRef) trackRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [presetRef]);

  const change = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const serviceName = () =>
    serviceKey === OTHER_SERVICE
      ? "Other"
      : serviceOptions.find((item) => (item.id || item.slug) === serviceKey)?.name || "";

  const validate = () => {
    const next = {};
    if (!serviceKey) next.service = "Please choose a service";
    if (!form.name.trim()) next.name = "Please enter your name";
    if (!form.phone.trim()) next.phone = "Please enter your phone number";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Please enter a valid email address";
    }
    setErrors(next);
    return !Object.keys(next).length;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const { data } = await apiPost("/api/service-requests", {
        ...form,
        service: serviceName(),
      });

      const saved = { reference: data.reference, contact: form.phone.trim() };
      localStorage.setItem(LAST_REQUEST_KEY, JSON.stringify(saved));
      setTrack(saved);
      setTrackResult(data);
      setTrackError("");
      setForm({ ...EMPTY_FORM });
      setErrors({});

      showThankYou({
        title: "Request received",
        text: `Your reference number is ${data.reference}. Our team will contact you shortly.`,
        note: "Keep this reference. Use it with your phone number below to track progress.",
      });
    } catch (error) {
      showError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const lookup = async (e) => {
    e.preventDefault();
    const reference = track.reference.trim();
    const contact = track.contact.trim();
    if (!reference || !contact) {
      setTrackError("Enter your reference number and the phone number or email you used.");
      return;
    }

    setTracking(true);
    setTrackError("");
    try {
      const { data } = await apiGet(
        `/api/service-requests/track/${encodeURIComponent(reference)}?contact=${encodeURIComponent(contact)}`
      );
      setTrackResult(data);
    } catch (error) {
      setTrackResult(null);
      setTrackError(error.message);
    } finally {
      setTracking(false);
    }
  };

  const field = (name, label, { helperText, ...props } = {}) => (
    <TextField
      fullWidth
      label={label}
      value={form[name]}
      onChange={change(name)}
      {...props}
      error={Boolean(errors[name])}
      helperText={errors[name] || helperText}
    />
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: GREEN.cream }}>
      <Helmet>
        <title>Request a Service | Mcaludoh Consultancy</title>
      </Helmet>
      <Container disableGutters sx={{ maxWidth: 760 }}>
        <Typography
          variant="h3"
          sx={{
            mb: 1,
            color: GREEN.deep,
            fontWeight: 700,
            fontSize: "clamp(1.35rem, 6vw, 2.1rem)",
            lineHeight: 1.2,
            whiteSpace: "nowrap",
          }}
        >
          Request a Service
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Tell us what you need and our team will get back to you. You'll get a reference
          number to track your request.
        </Typography>

        <Box component="form" noValidate onSubmit={submit} sx={cardSx}>
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
            <FormControl fullWidth required error={Boolean(errors.service)} sx={{ gridColumn: "1 / -1" }}>
              <InputLabel>Service</InputLabel>
              <Select
                label="Service"
                value={serviceKey}
                onChange={(e) => {
                  setServiceKey(e.target.value);
                  if (errors.service) setErrors((prev) => ({ ...prev, service: "" }));
                }}
              >
                {serviceOptions.map((service) => (
                  <MenuItem key={service.id || service.slug} value={service.id || service.slug}>
                    {service.name}
                  </MenuItem>
                ))}
                <MenuItem value={OTHER_SERVICE}>Other</MenuItem>
              </Select>
              {errors.service && <FormHelperText>{errors.service}</FormHelperText>}
            </FormControl>
            {field("name", "Name", { required: true, autoComplete: "name" })}
            {field("phone", "Phone", {
              required: true,
              type: "tel",
              autoComplete: "tel",
              helperText: "e.g. 0712 345 678 or +254 712 345 678",
            })}
            {field("email", "Email", { type: "email", autoComplete: "email" })}
            {field("location", "Location")}
            {field("organization", "Organization")}
            {field("farm_size", "Farm size")}
            {field("crop", "Type of crop")}
            {field("farming_method", "Current farming method")}
            {field("service_required", "Service required", {
              placeholder: "Farm assessment, soil assessment, landscape design...",
              sx: { gridColumn: "1 / -1" },
            })}
            {field("message", "Additional information", {
              multiline: true,
              rows: 4,
              sx: { gridColumn: "1 / -1" },
            })}
          </Box>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            endIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SendRounded />}
            sx={{ ...primaryButtonSx, mt: 3 }}
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </Button>
        </Box>

        <Divider sx={{ my: { xs: 2, md: 2.5 } }} />

        <Box ref={trackRef} id="track" sx={{ scrollMarginTop: 96 }}>
          <Typography variant="h4" sx={{ mb: 1, color: GREEN.deep, fontWeight: 700 }}>
            Track your request
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Enter your reference number and the phone number or email you used to see the
            latest status and our team's response.
          </Typography>

          <Box component="form" noValidate onSubmit={lookup} sx={cardSx}>
            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr auto" } }}>
              <TextField
                label="Reference number"
                placeholder="MC-26-XXXXXX"
                value={track.reference}
                onChange={(e) => setTrack((prev) => ({ ...prev, reference: e.target.value }))}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
              <TextField
                label="Phone or email"
                value={track.contact}
                onChange={(e) => setTrack((prev) => ({ ...prev, contact: e.target.value }))}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={tracking}
                startIcon={tracking ? <CircularProgress size={18} color="inherit" /> : <ManageSearchRounded />}
                sx={{ ...primaryButtonSx, minHeight: 56 }}
              >
                Track
              </Button>
            </Box>

            {trackError && (
              <Alert severity="warning" sx={{ mt: 2.5, borderRadius: 3 }}>
                {trackError}
              </Alert>
            )}
            {trackResult && <TrackResult result={trackResult} />}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  ArrowForwardRounded,
  EventAvailableRounded,
  LaptopMacRounded,
  PlaceOutlined,
  ScheduleRounded,
  StarRounded,
} from "@mui/icons-material";
import { GREEN } from "./PageSections";
import { daysUntil, formatDate, formatKES } from "../utils/format";
import { mediaUrl } from "../utils/api";

export const LOW_SEATS = 6;

export const upcomingSessions = (course) =>
  (course.sessions || [])
    .filter((s) => daysUntil(s.end_date || s.start_date) >= 0)
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

export const lowestFee = (course) => {
  const fees = [course.fee, ...(course.sessions || []).map((s) => s.fee)].filter((f) => f || f === 0);
  return fees.length ? Math.min(...fees) : null;
};

export function SeatsBadge({ seats, sx }) {
  if (seats === undefined || seats === null) return null;
  const low = seats <= LOW_SEATS;
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: 1,
        py: 0.25,
        borderRadius: 999,
        fontSize: "0.72rem",
        fontWeight: 800,
        whiteSpace: "nowrap",
        color: seats === 0 ? "#8A2B1F" : low ? "#8A5A00" : GREEN.main,
        backgroundColor: seats === 0 ? "#FBE3DF" : low ? "#FFF1CC" : GREEN.mist,
        ...sx,
      }}
    >
      {seats === 0 ? "Fully booked" : low ? `Only ${seats} seats left` : `${seats} seats left`}
    </Box>
  );
}

export default function CourseCard({ course }) {
  const navigate = useNavigate();
  const next = upcomingSessions(course)[0];
  const fee = lowestFee(course);
  const online = /online/i.test(course.mode || "");

  const meta = [
    { icon: ScheduleRounded, text: course.duration },
    { icon: online ? LaptopMacRounded : PlaceOutlined, text: course.location },
  ].filter((m) => m.text);

  return (
    <Box
      component="article"
      sx={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: "26px 26px 26px 8px",
        backgroundColor: "#FFFFFF",
        border: "1px solid rgba(27, 67, 50, 0.07)",
        boxShadow: "0 16px 40px rgba(27, 67, 50, 0.09)",
        transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease",
        "& img": { transition: "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)" },
        "& .course-arrow": { transition: "transform 0.25s ease, background-color 0.25s ease" },
        "&:hover, &:focus-within": {
          transform: "translateY(-6px)",
          boxShadow: "0 26px 54px rgba(27, 67, 50, 0.15)",
          "& img": { transform: "scale(1.06)" },
          "& .course-arrow": { transform: "translateX(3px)", backgroundColor: GREEN.main, color: "#FFFFFF" },
        },
      }}
    >
      <Box sx={{ position: "relative", overflow: "hidden", aspectRatio: "16 / 10", backgroundColor: GREEN.mist }}>
        {course.image && (
          <Box component="img" src={mediaUrl(course.image)} alt="" loading="lazy" sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        )}
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(27,42,34,0) 55%, rgba(27,42,34,0.55) 100%)" }} />
        <Box sx={{ position: "absolute", top: 14, left: 14, right: 14, display: "flex", justifyContent: "space-between", gap: 1 }}>
          <Box
            component="span"
            sx={{ px: 1.25, py: 0.4, borderRadius: 999, fontSize: "0.72rem", fontWeight: 800, color: GREEN.deep, backgroundColor: "rgba(255, 255, 255, 0.92)" }}
          >
            {course.level}
          </Box>
          {course.featured && (
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.4,
                px: 1.1,
                py: 0.4,
                borderRadius: 999,
                fontSize: "0.72rem",
                fontWeight: 800,
                color: "#5B3B00",
                backgroundColor: "#FFD76A",
              }}
            >
              <StarRounded sx={{ fontSize: 14 }} />
              Popular
            </Box>
          )}
        </Box>
        <Box
          component="span"
          sx={{
            position: "absolute",
            left: 14,
            bottom: 12,
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            color: "#FFFFFF",
            fontSize: "0.78rem",
            fontWeight: 700,
          }}
        >
          {online ? <LaptopMacRounded sx={{ fontSize: 16 }} /> : <PlaceOutlined sx={{ fontSize: 16 }} />}
          {course.mode}
        </Box>
      </Box>

      <Box sx={{ p: { xs: 2.25, md: 2.5 }, display: "flex", flexDirection: "column", flex: 1 }}>
        <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: GREEN.mid }}>
          {course.category}
        </Typography>
        <Typography component="h3" sx={{ mt: 0.5, fontWeight: 800, fontSize: "1.12rem", lineHeight: 1.35, color: GREEN.ink }}>
          <Box
            component="a"
            href={`/training/${course.slug}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/training/${course.slug}`);
            }}
            sx={{ color: "inherit", textDecoration: "none", outline: "none", "&::after": { content: '""', position: "absolute", inset: 0 } }}
          >
            {course.name}
          </Box>
        </Typography>
        <Typography sx={{ mt: 0.75, color: "text.secondary", fontSize: "0.92rem", lineHeight: 1.6 }}>
          {course.short_description}
        </Typography>
        <Box sx={{ mt: 1.5, display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          {meta.map(({ icon: Icon, text }) => (
            <Typography key={text} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, fontSize: "0.82rem", fontWeight: 600, color: GREEN.ink }}>
              <Icon sx={{ fontSize: 16, color: GREEN.mid }} />
              {text}
            </Typography>
          ))}
        </Box>

        <Box
          sx={{
            mt: "auto",
            pt: 2,
            display: "grid",
            gap: 1.25,
          }}
        >
          <Box
            sx={{
              mt: 1,
              p: 1.25,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              borderRadius: "14px",
              backgroundColor: GREEN.cream,
            }}
          >
            <Typography sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, fontSize: "0.8rem", fontWeight: 700, color: GREEN.ink }}>
              <EventAvailableRounded sx={{ fontSize: 17, color: GREEN.mid }} />
              {next ? `Starts ${formatDate(next.start_date, { day: "numeric", month: "short" })}` : "Dates on request"}
            </Typography>
            {next && <SeatsBadge seats={next.seats_left} />}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
            <Box>
              <Typography sx={{ fontSize: "0.72rem", color: "text.secondary", fontWeight: 600 }}>From</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", color: GREEN.deep, lineHeight: 1.1 }}>
                {fee !== null ? formatKES(fee) : "Contact us"}
              </Typography>
            </Box>
            <Box
              className="course-arrow"
              sx={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: GREEN.main,
                backgroundColor: GREEN.mist,
              }}
            >
              <ArrowForwardRounded sx={{ fontSize: 20 }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

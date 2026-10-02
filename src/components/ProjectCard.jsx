import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArrowOutwardRounded, PlaceOutlined } from "@mui/icons-material";
import { GREEN } from "./PageSections";
import { ServiceIcon, StatusBadge } from "./ServiceBits";
import { getService } from "../data/portfolioContent";

export default function ProjectCard({ project }) {
  const navigate = useNavigate();
  const service = getService(project.service);
  const highlight = project.results?.[0];

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
        "& .project-arrow": { transition: "transform 0.3s ease, background-color 0.3s ease, color 0.3s ease" },
        "& .project-summary": { transition: "opacity 0.35s ease, transform 0.35s ease" },
        "&:hover, &:focus-within": {
          transform: "translateY(-6px)",
          boxShadow: "0 26px 54px rgba(27, 67, 50, 0.16)",
          "& img": { transform: "scale(1.06)" },
          "& .project-arrow": { transform: "rotate(45deg)", backgroundColor: GREEN.main, color: "#FFFFFF" },
          "& .project-summary": { opacity: 1, transform: "none" },
        },
      }}
    >
      <Box sx={{ position: "relative", overflow: "hidden", aspectRatio: "4 / 3", backgroundColor: GREEN.mist }}>
        <Box component="img" src={project.cover} alt="" loading="lazy" sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(27,42,34,0) 35%, rgba(27,42,34,0.88) 100%)" }} />
        <Box sx={{ position: "absolute", top: 14, left: 14, right: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
          <StatusBadge status={project.status} />
          <Box component="span" sx={{ px: 1.1, py: 0.35, borderRadius: 999, fontSize: "0.72rem", fontWeight: 800, color: "#FFFFFF", backgroundColor: "rgba(27, 42, 34, 0.45)", backdropFilter: "blur(6px)" }}>
            {project.year}
          </Box>
        </Box>
        <Typography
          className="project-summary"
          sx={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: 14,
            color: "rgba(255, 255, 255, 0.92)",
            fontSize: "0.86rem",
            lineHeight: 1.5,
            opacity: { xs: 1, md: 0 },
            transform: { xs: "none", md: "translateY(10px)" },
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {project.summary}
        </Typography>
      </Box>

      <Box sx={{ p: { xs: 2.25, md: 2.5 }, display: "flex", flexDirection: "column", flex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ServiceIcon slug={project.service} size={28} sx={{ boxShadow: "none" }} />
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: GREEN.mid }}>
            {service?.name || project.service}
          </Typography>
        </Box>
        <Typography component="h3" sx={{ mt: 1.25, fontWeight: 800, fontSize: "1.12rem", lineHeight: 1.35, color: GREEN.ink }}>
          <Box
            component="a"
            href={`/projects/${project.slug}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/projects/${project.slug}`);
            }}
            sx={{ color: "inherit", textDecoration: "none", outline: "none", "&::after": { content: '""', position: "absolute", inset: 0 } }}
          >
            {project.name}
          </Box>
        </Typography>
        <Typography sx={{ mt: 0.75, display: "flex", alignItems: "center", gap: 0.5, fontSize: "0.85rem", color: "text.secondary" }}>
          <PlaceOutlined sx={{ fontSize: 16, color: GREEN.mid }} />
          {project.location}
        </Typography>

        <Box sx={{ mt: "auto", pt: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>
          {highlight ? (
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 800, fontSize: "1.35rem", lineHeight: 1, color: GREEN.deep }}>{highlight.value}</Typography>
              <Typography noWrap sx={{ mt: 0.25, fontSize: "0.78rem", color: "text.secondary" }}>
                {highlight.label}
              </Typography>
            </Box>
          ) : (
            <span />
          )}
          <Box
            className="project-arrow"
            sx={{ width: 42, height: 42, flexShrink: 0, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: GREEN.main, backgroundColor: GREEN.mist }}
          >
            <ArrowOutwardRounded sx={{ fontSize: 20 }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

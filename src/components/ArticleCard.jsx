import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArrowForwardRounded, ScheduleRounded } from "@mui/icons-material";
import { GREEN } from "./PageSections";
import { readingTime } from "../data/prototypeContent";
import { formatDate } from "../utils/format";

export function AuthorBadge({ author, light = false, meta }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.1, minWidth: 0 }}>
      <Avatar
        sx={{
          width: 34,
          height: 34,
          fontSize: "0.9rem",
          fontWeight: 800,
          color: light ? GREEN.deep : "#FFFFFF",
          background: light ? GREEN.mist : `linear-gradient(135deg, ${GREEN.light}, ${GREEN.main})`,
        }}
      >
        {(author?.name || "A").charAt(0)}
      </Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", lineHeight: 1.2, color: light ? "#FFFFFF" : GREEN.ink }}>
          {author?.name || "Mcaludoh team"}
        </Typography>
        <Typography
          noWrap
          sx={{ fontSize: "0.75rem", color: light ? "rgba(255, 255, 255, 0.7)" : "text.secondary" }}
        >
          {meta || author?.role}
        </Typography>
      </Box>
    </Box>
  );
}

export default function ArticleCard({ article }) {
  const navigate = useNavigate();
  const minutes = readingTime(article.content || article.excerpt);

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
        "& .read-arrow": { transition: "transform 0.25s ease" },
        "&:hover, &:focus-within": {
          transform: "translateY(-6px)",
          boxShadow: "0 26px 54px rgba(27, 67, 50, 0.15)",
          "& img": { transform: "scale(1.06)" },
          "& .read-arrow": { transform: "translateX(4px)" },
        },
      }}
    >
      <Box sx={{ position: "relative", overflow: "hidden", aspectRatio: "16 / 10", backgroundColor: GREEN.mist }}>
        <Box
          component="img"
          src={article.featured_image}
          alt=""
          loading="lazy"
          sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 14,
            left: 14,
            px: 1.25,
            py: 0.4,
            borderRadius: 999,
            fontSize: "0.72rem",
            fontWeight: 800,
            color: GREEN.deep,
            backgroundColor: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(6px)",
          }}
        >
          {article.category?.name}
        </Box>
      </Box>
      <Box sx={{ p: { xs: 2.25, md: 2.75 }, display: "flex", flexDirection: "column", flex: 1 }}>
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            fontSize: "0.78rem",
            fontWeight: 600,
            color: "text.secondary",
          }}
        >
          {formatDate(article.published_at)}
          <Box component="span" sx={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: GREEN.light }} />
          <ScheduleRounded sx={{ fontSize: 15, color: GREEN.mid }} />
          {minutes} min read
        </Typography>
        <Typography
          component="h3"
          sx={{ mt: 1, fontWeight: 800, fontSize: "1.12rem", lineHeight: 1.35, color: GREEN.ink }}
        >
          <Box
            component="a"
            href={`/blog/${article.slug}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/blog/${article.slug}`);
            }}
            sx={{
              color: "inherit",
              textDecoration: "none",
              outline: "none",
              "&::after": { content: '""', position: "absolute", inset: 0 },
            }}
          >
            {article.title}
          </Box>
        </Typography>
        <Typography
          sx={{
            mt: 1,
            color: "text.secondary",
            lineHeight: 1.65,
            fontSize: "0.92rem",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.excerpt}
        </Typography>
        <Box
          sx={{
            mt: "auto",
            pt: 2.25,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <AuthorBadge author={article.author} />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              flexShrink: 0,
              color: GREEN.main,
              fontWeight: 700,
              fontSize: "0.85rem",
            }}
          >
            Read
            <ArrowForwardRounded className="read-arrow" sx={{ fontSize: 18 }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

import React, { useMemo, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import {
  ArrowForwardRounded,
  CollectionsOutlined,
  PhotoLibraryOutlined,
  ZoomOutMapRounded,
} from "@mui/icons-material";
import { galleryAlbums } from "../data/prototypeContent";
import { GREEN, PageHero, Reveal } from "../components/PageSections";
import { ChoicePill, PillRow } from "../components/FormControls";
import Lightbox from "../components/Lightbox";

const ALL = "All";
const TILE_RATIOS = ["4 / 5", "1 / 1", "4 / 3", "3 / 4", "16 / 11", "1 / 1"];

const photos = galleryAlbums.flatMap((album) =>
  album.media.map((item) => ({ ...item, album: album.name }))
);

function GalleryTile({ photo, ratio, onOpen, delay }) {
  return (
    <Reveal delay={delay} sx={{ breakInside: "avoid", mb: { xs: 1.5, md: 2 } }}>
      <Box
        component="button"
        type="button"
        onClick={onOpen}
        aria-label={`Open photo: ${photo.caption}`}
        sx={{
          position: "relative",
          display: "block",
          width: "100%",
          p: 0,
          border: 0,
          cursor: "zoom-in",
          overflow: "hidden",
          aspectRatio: ratio,
          borderRadius: "22px 22px 22px 6px",
          backgroundColor: GREEN.mist,
          boxShadow: "0 14px 34px rgba(27, 67, 50, 0.12)",
          transition: "box-shadow 0.3s ease, transform 0.3s ease",
          "& img": { transition: "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)" },
          "& .tile-overlay": { transition: "opacity 0.35s ease" },
          "& .tile-caption": { transition: "transform 0.35s ease, opacity 0.35s ease" },
          "&:hover, &:focus-visible": {
            boxShadow: "0 24px 50px rgba(27, 67, 50, 0.22)",
            "& img": { transform: "scale(1.07)" },
            "& .tile-zoom": { opacity: 1, transform: "scale(1)" },
            "& .tile-caption": { transform: "none", opacity: 1 },
          },
          "&:focus-visible": { outline: `3px solid ${GREEN.light}`, outlineOffset: 3 },
        }}
      >
        <Box
          component="img"
          src={photo.file_url}
          alt={photo.alt_text || photo.caption}
          loading="lazy"
          sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <Box
          className="tile-overlay"
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(27, 42, 34, 0) 45%, rgba(27, 42, 34, 0.82) 100%)",
          }}
        />
        <Box
          className="tile-zoom"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 38,
            height: 38,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: GREEN.deep,
            backgroundColor: "rgba(255, 255, 255, 0.92)",
            opacity: 0,
            transform: "scale(0.7)",
            transition: "all 0.3s ease",
          }}
        >
          <ZoomOutMapRounded sx={{ fontSize: 18 }} />
        </Box>
        <Box
          className="tile-caption"
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            p: { xs: 1.5, md: 2 },
            textAlign: "left",
            color: "#FFFFFF",
            transform: { xs: "none", md: "translateY(8px)" },
            opacity: { xs: 1, md: 0.92 },
          }}
        >
          <Box
            component="span"
            sx={{
              display: "inline-block",
              mb: 0.75,
              px: 1.1,
              py: 0.3,
              borderRadius: 999,
              fontSize: "0.68rem",
              fontWeight: 800,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              backgroundColor: "rgba(216, 243, 220, 0.2)",
              border: "1px solid rgba(216, 243, 220, 0.35)",
              backdropFilter: "blur(6px)",
            }}
          >
            {photo.album}
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.85rem", md: "0.95rem" }, lineHeight: 1.35 }}>
            {photo.caption}
          </Typography>
        </Box>
      </Box>
    </Reveal>
  );
}

export default function Gallery() {
  const navigate = useNavigate();
  const [album, setAlbum] = useState(ALL);
  const [viewing, setViewing] = useState(null);

  const visible = useMemo(
    () => (album === ALL ? photos : photos.filter((p) => p.album === album)),
    [album]
  );

  return (
    <Box sx={{ backgroundColor: GREEN.cream, overflowX: "hidden" }}>
      <Helmet>
        <title>Gallery | Mcaludoh Consultancy</title>
        <meta
          name="description"
          content="Photos from Mcaludoh Consultancy projects, farm visits and trainings: hydroponics, vertical farming, organic farming and landscaping."
        />
      </Helmet>

      <PageHero
        eyebrow="Gallery"
        title="Our work,"
        highlight="in pictures."
        subtitle="A look inside the farms, gardens and training sessions we have worked on across Kenya, from the first seedling to harvest day."
      >
        <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 1.25 }}>
          {[
            { icon: PhotoLibraryOutlined, text: `${photos.length} photos` },
            { icon: CollectionsOutlined, text: `${galleryAlbums.length} albums` },
          ].map(({ icon: Icon, text }) => (
            <Box
              key={text}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
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
              <Icon sx={{ fontSize: 18, color: GREEN.light }} />
              {text}
            </Box>
          ))}
        </Box>
      </PageHero>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, mt: { xs: -8, md: -9 } }}>
        <Reveal>
          <Box
            sx={{
              p: { xs: 1.5, md: 2 },
              borderRadius: "24px 24px 24px 8px",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 20px 50px rgba(27, 67, 50, 0.12)",
            }}
          >
            <PillRow label="Filter photos by album">
              <ChoicePill selected={album === ALL} onClick={() => setAlbum(ALL)} count={photos.length}>
                All work
              </ChoicePill>
              {galleryAlbums.map((item) => (
                <ChoicePill
                  key={item.id}
                  selected={album === item.name}
                  onClick={() => setAlbum(item.name)}
                  count={item.media.length}
                >
                  {item.name}
                </ChoicePill>
              ))}
            </PillRow>
          </Box>
        </Reveal>
      </Container>

      <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 5 }, pb: { xs: 7, md: 10 } }}>
        <Typography aria-live="polite" sx={{ mb: 2.5, color: "text.secondary", fontSize: "0.9rem" }}>
          Showing <strong>{visible.length}</strong> {visible.length === 1 ? "photo" : "photos"}
          {album !== ALL && (
            <>
              {" "}
              from <strong>{album}</strong>
            </>
          )}
        </Typography>

        <Box key={album} sx={{ columnCount: { xs: 2, md: 3 }, columnGap: { xs: "12px", md: "16px" } }}>
          {visible.map((photo, index) => (
            <GalleryTile
              key={photo.id}
              photo={photo}
              ratio={TILE_RATIOS[index % TILE_RATIOS.length]}
              delay={(index % 6) * 70}
              onOpen={() => setViewing(index)}
            />
          ))}
        </Box>

        <Reveal>
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              mt: { xs: 5, md: 7 },
              p: { xs: 3, md: 5 },
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
              gap: 3,
              borderRadius: "30px 30px 30px 8px",
              color: "#FFFFFF",
              background: `radial-gradient(circle at 90% 10%, rgba(82, 183, 136, 0.4), transparent 45%), linear-gradient(140deg, ${GREEN.deep}, ${GREEN.main})`,
              boxShadow: "0 24px 50px rgba(27, 67, 50, 0.25)",
            }}
          >
            <Box sx={{ maxWidth: 560 }}>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.5rem", md: "1.9rem" }, lineHeight: 1.2 }}>
                Want a farm or garden like these?
              </Typography>
              <Typography sx={{ mt: 1, color: "rgba(255, 255, 255, 0.82)", lineHeight: 1.7 }}>
                Tell us about your space and goals. We will visit, advise and help you build it.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
              <Button
                onClick={() => navigate("/request-service")}
                endIcon={<ArrowForwardRounded />}
                sx={{
                  minHeight: 50,
                  px: 3.5,
                  borderRadius: 999,
                  fontWeight: 700,
                  color: GREEN.deep,
                  backgroundColor: "#FFFFFF",
                  "&:hover": { backgroundColor: GREEN.mist },
                }}
              >
                Start a project
              </Button>
              <Button
                onClick={() => navigate("/contact")}
                sx={{
                  minHeight: 50,
                  px: 3,
                  borderRadius: 999,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                }}
              >
                Talk to us
              </Button>
            </Box>
          </Box>
        </Reveal>
      </Container>

      <Lightbox items={visible} index={viewing} onClose={() => setViewing(null)} onIndex={setViewing} />
    </Box>
  );
}

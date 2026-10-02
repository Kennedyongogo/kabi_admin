import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box, CircularProgress } from "@mui/material";
import { theme } from "./theme";
import "./App.css";
import React, { useEffect, Suspense, lazy } from "react";
import { HelmetProvider } from "react-helmet-async";
import PublicLayout from "./components/layout/PublicLayout";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Training = lazy(() => import("./pages/Training"));
const TrainingDetail = lazy(() => import("./pages/TrainingDetail"));
const Blog = lazy(() => import("./pages/Blog"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Contact = lazy(() => import("./pages/Contact"));
const RequestService = lazy(() => import("./pages/RequestService"));
const VerifyCertificate = lazy(() => import("./pages/VerifyCertificate"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <ScrollToTop />
          <Suspense
            fallback={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                <CircularProgress />
              </Box>
            }
          >
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:slug" element={<ProjectDetail />} />
                <Route path="/training" element={<Training />} />
                <Route path="/training/:slug" element={<TrainingDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<ArticleDetail />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/request-service" element={<RequestService />} />
                <Route
                  path="/verify/:certificate_number"
                  element={<VerifyCertificate />}
                />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import PublicHeader from "../Header/PublicHeader";
import Footer from "../Footer";
import { apiGet } from "../../utils/api";
import { fallbackServices } from "../../data/siteContent";

export default function PublicLayout() {
  const [services, setServices] = useState([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    apiGet("/api/services?status=active&limit=20")
      .then((res) => setServices(res.data || []))
      .catch(() => setServices([]));
    apiGet("/api/site-settings")
      .then((res) => setSettings((res.data && res.data[0]) || null))
      .catch(() => setSettings(null));
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <PublicHeader services={services.length ? services : fallbackServices} />
      <Outlet
        context={{
          services: services.length ? services : fallbackServices,
          settings,
        }}
      />
      <Footer settings={settings} />
    </Box>
  );
}

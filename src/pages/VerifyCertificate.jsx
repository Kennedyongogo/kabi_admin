import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Container, Typography, CircularProgress } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { apiGet } from "../utils/api";

export default function VerifyCertificate() {
  const { certificate_number } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet(`/api/certificates/verify/${certificate_number}`)
      .then((res) => setCertificate(res.data))
      .catch((err) => setError(err.message || "Certificate not found"))
      .finally(() => setLoading(false));
  }, [certificate_number]);

  return (
    <Box sx={{ py: 8 }}>
      <Helmet>
        <title>Verify Certificate | Mcaludoh Consultancy</title>
      </Helmet>
      <Container sx={{ maxWidth: 680 }}>
        <Typography variant="h3" sx={{ mb: 3 }}>
          Certificate verification
        </Typography>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {certificate && (
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                {certificate.certificate_number}
              </Typography>
              <Typography>
                Status: {certificate.status}
              </Typography>
              <Typography>
                Issued: {new Date(certificate.issued_at).toLocaleDateString()}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                {certificate.registration?.client?.name}
              </Typography>
              <Typography color="text.secondary">
                {certificate.registration?.session?.course?.name}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}

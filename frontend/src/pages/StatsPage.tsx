import { Box, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

import { getSalesStats, type SalesStats } from "../api/stats";
import { formatCurrency } from "../utils/format";

export function StatsPage() {
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSalesStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box>
        <Typography variant="h5">No se pudieron cargar las estadísticas</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Estadísticas de Ventas
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ventas por Asesor
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.salesByAdvisor}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="advisorName" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === "total") return formatCurrency(value);
                      return value;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#004481" name="Cantidad" />
                  <Bar dataKey="total" fill="#009fe3" name="Total Cupo" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cupos por Producto
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.amountByProduct}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === "total") return formatCurrency(value);
                      return value;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="total" fill="#00796b" name="Total Cupo" />
                  <Bar dataKey="count" fill="#4db6ac" name="Cantidad" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Ventas por Fecha
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.salesByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === "total") return formatCurrency(value);
                    return value;
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#f57c00" name="Cantidad" strokeWidth={2} />
                <Line type="monotone" dataKey="total" stroke="#ffb300" name="Total Cupo" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

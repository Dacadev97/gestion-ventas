import { 
  Box, 
  Card, 
  CardContent, 
  CircularProgress, 
  Typography, 
  Stack,
  Divider,
  Alert
} from "@mui/material";
import { 
  TrendingUp, 
  AttachMoney, 
  ShoppingCart, 
  BarChart as BarChartIcon 
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from "recharts";

import { getSalesStats, type SalesStats } from "../api/stats";
import { formatCurrency } from "../utils/format";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

function MetricCard({ title, value, icon, color }: MetricCardProps) {
  return (
    <Card 
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        borderLeft: `4px solid ${color}`
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box 
            sx={{ 
              backgroundColor: `${color}20`,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} color={color}>
              {value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

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

  const totalSales = stats?.salesByDate.reduce((sum, item) => sum + item.count, 0) || 0;
  const totalAmount = stats?.salesByDate.reduce((sum, item) => sum + item.total, 0) || 0;

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
        <Typography variant="h4" fontWeight={700} mb={3}>
          Estadísticas de Ventas
        </Typography>
        <Alert severity="error">
          No se pudieron cargar las estadísticas. Por favor, intenta nuevamente.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={3}>
        <BarChartIcon fontSize="large" color="primary" />
        <Typography variant="h4" fontWeight={700}>
          Estadísticas de Ventas
        </Typography>
      </Stack>

      {/* Métricas principales */}
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4 
        }}
      >
        <MetricCard 
          title="Total de Ventas"
          value={totalSales.toString()}
          icon={<ShoppingCart sx={{ color: '#004481', fontSize: 32 }} />}
          color="#004481"
        />
        <MetricCard 
          title="Monto Total"
          value={formatCurrency(totalAmount)}
          icon={<AttachMoney sx={{ color: '#009fe3', fontSize: 32 }} />}
          color="#009fe3"
        />
        <MetricCard 
          title="Productos"
          value={stats.amountByProduct.length.toString()}
          icon={<TrendingUp sx={{ color: '#2e7d32', fontSize: 32 }} />}
          color="#2e7d32"
        />
        <MetricCard 
          title="Asesores"
          value={stats.salesByAdvisor.length.toString()}
          icon={<BarChartIcon sx={{ color: '#ed6c02', fontSize: 32 }} />}
          color="#ed6c02"
        />
      </Box>

      {/* Gráficos */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3, mb: 3 }}>
        <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Ventas por Asesor
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={stats.salesByAdvisor}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="advisorName" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === "total") return formatCurrency(value);
                      return value;
                    }}
                    contentStyle={{ borderRadius: 8, border: '1px solid #e0e0e0' }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#004481" name="Cantidad" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="total" fill="#009fe3" name="Total Cupo" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Cupos por Producto
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={stats.amountByProduct}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="product" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === "total") return formatCurrency(value);
                    return value;
                  }}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e0e0e0' }}
                />
                <Legend />
                <Bar dataKey="total" fill="#2e7d32" name="Total Cupo" radius={[8, 8, 0, 0]} />
                <Bar dataKey="count" fill="#4caf50" name="Cantidad" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Evolución de Ventas por Fecha
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={stats.salesByDate}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === "total") return formatCurrency(value);
                  return value;
                }}
                contentStyle={{ borderRadius: 8, border: '1px solid #e0e0e0' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#f57c00" 
                name="Cantidad" 
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#ffb300" 
                name="Total Cupo" 
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
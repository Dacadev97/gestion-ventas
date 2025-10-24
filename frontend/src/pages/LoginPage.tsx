import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import { fetchCaptchaThunk } from "../features/captcha/captchaSlice.ts";
import { loginThunk } from "../features/auth/authSlice.ts";
import { useAppDispatch, useAppSelector } from "../hooks/index.ts";
import type { LoginPayload } from "../types/index.ts";
import { fetchSalesThunk } from "../features/sales/salesSlice.ts";
import { fetchUsersThunk } from "../features/users/usersSlice.ts";
import { RoleName } from "../types/index.ts";

const schema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  captchaId: z.string().uuid(),
  captchaValue: z.string().min(4, "Debe ingresar el valor del captcha"),
});

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error, user } = useAppSelector((state) => state.auth);
  const captcha = useAppSelector((state) => state.captcha.current);
  const captchaStatus = useAppSelector((state) => state.captcha.status);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      captchaId: "",
      captchaValue: "",
    },
  });

  useEffect(() => {
    dispatch(fetchCaptchaThunk());
  }, [dispatch]);

  useEffect(() => {
    if (captcha) {
      setValue("captchaId", captcha.id, { shouldValidate: true });
    }
  }, [captcha, setValue]);

  useEffect(() => {
    if (user) {
      dispatch(fetchSalesThunk());
      if (user.role === RoleName.ADMIN) {
        dispatch(fetchUsersThunk());
      }
      navigate("/", { replace: true });
    }
  }, [user, navigate, dispatch]);

  const onSubmit = (data: LoginPayload) => {
    const payload: LoginPayload = {
      ...data,
      captchaValue: data.captchaValue.trim(),
    };

    dispatch(loginThunk(payload));
  };

  const handleRefreshCaptcha = () => {
    dispatch(fetchCaptchaThunk());
    setValue("captchaValue", "", { shouldValidate: true });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "stretch",
        width: "100%",
        maxWidth: { xs: "100%", lg: 1200 },
        mx: "auto",
      }}
    >
      <Box
        sx={{
          flex: { xs: "0 0 auto", md: "0 0 45%" },
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          color: "common.white",
          px: 8,
          background: "linear-gradient(135deg, #004481 0%, #0074c1 100%)",
        }}
      >
        <Typography variant="h3" fontWeight={600}>
          Banco Konecta
        </Typography>
        <Typography variant="h5" sx={{ mt: 2, maxWidth: 360, fontWeight: 300 }}>
          Portal de ventas para asesores y administradores.
        </Typography>
      </Box>

      <Box
        sx={{
          flex: { xs: "1 1 auto", md: "1 1 55%" },
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "center", md: "flex-end" },
          py: { xs: 6, sm: 8 },
          px: { xs: 3, sm: 6, md: 8 },
          pr: { md: 14 },
          backgroundColor: { xs: "background.default", md: "background.paper" },
          minHeight: { xs: "auto", md: "100vh" },
        }}
      >
        <Card elevation={8} sx={{ width: "100%", maxWidth: 420 }}>
          <CardContent sx={{ p: { xs: 4, sm: 5 } }}>
            <Typography variant="h5" gutterBottom align="center">
              Portal de Ventas - Banco Konecta
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary">
              Inicia sesión con tus credenciales para continuar.
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{
                mt: 4,
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
              }}
            >
              <Controller
                name="captchaId"
                control={control}
                render={({ field }) => <input type="hidden" {...field} />}
              />

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Correo electrónico"
                    fullWidth
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message}
                    autoComplete="email"
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Contraseña"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                    autoComplete="current-password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  alignItems: "stretch",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    minHeight: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                    backgroundColor: "background.default",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {captchaStatus === "loading" && <CircularProgress size={24} />}
                  {captchaStatus !== "loading" && captcha?.data && (
                    <Box
                      sx={{ width: "100%", height: "100%", "& svg": { width: "100%", height: "100%" } }}
                      dangerouslySetInnerHTML={{ __html: captcha.data }}
                    />
                  )}
                  {captchaStatus === "failed" && !captcha?.data && (
                    <Typography variant="body2" color="text.secondary">
                      No se pudo cargar
                    </Typography>
                  )}
                </Box>

                <Box sx={{ flexBasis: { sm: "40%" } }}>
                  <Button
                    variant="outlined"
                    onClick={handleRefreshCaptcha}
                    fullWidth
                    disabled={captchaStatus === "loading"}
                  >
                    Refrescar captcha
                  </Button>
                  {captchaStatus === "failed" && (
                    <Typography variant="caption" color="error" sx={{ display: "block", mt: 1 }}>
                      No fue posible cargar el captcha. Inténtalo nuevamente.
                    </Typography>
                  )}
                </Box>
              </Box>

              <Controller
                name="captchaValue"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ingrese el texto del captcha"
                    fullWidth
                    error={Boolean(errors.captchaValue)}
                    helperText={errors.captchaValue?.message}
                  />
                )}
              />

              {error && (
                <Alert severity="error">
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={status === "loading"}
                startIcon={status === "loading" ? <CircularProgress size={20} color="inherit" /> : undefined}
              >
                Iniciar sesión
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

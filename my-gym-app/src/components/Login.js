// src/Login.js
import React from "react";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import { createUserProfileIfNotExists } from "../services/firestore";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react"; // src/Login.js

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Manejar inicio de sesión con Google
  const handleLoginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createUserProfileIfNotExists(result.user);
    } catch (error) {
      setError("Error durante el inicio de sesión con Google");
      console.error(error);
    }
  };

  // Manejar inicio de sesión con usuario/contraseña
  const handleLoginWithEmail = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await createUserProfileIfNotExists(result.user);
    } catch (error) {
      setError("Error durante el inicio de sesión con email y contraseña");
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(210, 230, 255, 0.6)", // Fondo minimalista no opaco
      }}
    >
      <Box
        sx={{
          width: 300,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h5" mb={2} align="center">
          Iniciar Sesión
        </Typography>

        {error && (
          <Typography variant="body2" color="error" mb={2}>
            {error}
          </Typography>
        )}

        {/* Formulario para login con email y contraseña */}
        <form onSubmit={handleLoginWithEmail}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Iniciar sesión
          </Button>
        </form>

        {/* Botón para login con Google */}
        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLoginWithGoogle}
        >
          Iniciar sesión con Google
        </Button>
      </Box>
    </Box>
  );
};

export default Login;

import React, { useState } from 'react';
import { addStudent } from '../../services/firestore';
import { Box, Button, TextField } from '@mui/material';
import { auth } from '../../services/firebase';

const AddStudent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleAddStudent = async () => {
    try {
      const trainerEmail = auth.currentUser?.email;
      if (!trainerEmail) {
        setError('No se pudo obtener el correo del entrenador logueado.');
        return;
      }
      if (name && email) {
        const newStudent = {
          name,
          email,
          role: 'user',
          trainerEmail, // Asociar al estudiante con el correo del entrenador
        };
        await addStudent(newStudent);
        setName('');
        setEmail('');
        setError('');
      }
    } catch (e) {
      setError('Error al agregar el estudiante. Por favor, intenta de nuevo.');
      console.error(e);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      {error && (
        <Box sx={{ color: 'red', mb: 2 }}>{error}</Box>
      )}
      <TextField
        label="Nombre del Alumno"
        variant="outlined"
        margin="normal"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Correo Electrónico del Alumno"
        variant="outlined"
        margin="normal"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddStudent}>
        Agregar Alumno
      </Button>
    </Box>
  );
};

export default AddStudent;
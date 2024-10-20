import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { getTrainingsForUser } from "../../services/firestore";
import { addDoc, collection } from "firebase/firestore";
import AddStudent from "./AddStudent";
import { db } from "../../services/firebase";

const StudentDetails = ({ selectedStudent }) => {
  const [trainings, setTrainings] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [newTraining, setNewTraining] = useState({
    type: "",
    repetitions: "",
    rir: "",
    series: "",
    comments: "",
    frequency: "",
  });

  // Obtener los entrenamientos del alumno seleccionado
  useEffect(() => {
    const fetchTrainings = async () => {
      if (selectedStudent) {
        const fetchedTrainings = await getTrainingsForUser(selectedStudent.email);
        setTrainings(fetchedTrainings);
      }
    };
    fetchTrainings();
  }, [selectedStudent]);

  // Filtrar entrenamientos activos y completados
  const activeTrainings = trainings.filter(
    (training) =>
      !training.completedSessions || training.completedSessions.length === 0
  );
  const completedTrainings = trainings.filter(
    (training) =>
      training.completedSessions && training.completedSessions.length > 0
  );

  // Manejar el cambio de los campos del nuevo entrenamiento
  const handleNewTrainingChange = (e) => {
    const { name, value } = e.target;
    setNewTraining((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar la creación de un nuevo entrenamiento
  const handleCreateTraining = async () => {
    if (selectedStudent && newTraining.type && newTraining.repetitions) {
      try {
        const newTrainingData = {
          ...newTraining,
          email: selectedStudent.email,
          completedSessions: [],
        };
        await addDoc(collection(db, "trainings"), newTrainingData);
        setTrainings((prev) => [...prev, newTrainingData]);
        setNewTraining({
          type: "",
          repetitions: "",
          rir: "",
          series: "",
          comments: "",
          frequency: "",
        });
      } catch (error) {
        console.error("Error al crear el entrenamiento:", error);
      }
    }
  };

  return (
    <Box sx={{ flex: 1, p: 3, borderLeft: "1px solid #ccc", ml: 3 }}>
      {selectedStudent ? (
        <Box>
          <Typography variant="h5" mb={2}>
            Entrenamientos de {selectedStudent.name}
          </Typography>
          <Typography variant="h6" mb={2}>
            Entrenamientos Activos
          </Typography>
          {activeTrainings.length > 0 ? (
            activeTrainings.map((training, index) => (
              <Box
                key={index}
                sx={{ maxWidth: 'fit-content', mb: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}
              >
                <Typography variant="h6">{training.type}</Typography>
                <Typography variant="body2">
                  Repeticiones: {training.repetitions}
                </Typography>
                <Typography variant="body2">RIR: {training.rir}</Typography>
                <Typography variant="body2">
                  Series: {training.series}
                </Typography>
                <Typography variant="body2">
                  Frecuencia: {training.frequency}
                </Typography>
                <Typography variant="body2">
                  Comentarios: {training.comments}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2">
              No hay entrenamientos activos.
            </Typography>
          )}

          {!showCompleted && (
            <Box mt={4}>
              <Typography variant="h5" mb={2}>
                Crear Nuevo Entrenamiento
              </Typography>
              <TextField
                label="Tipo de Entrenamiento"
                variant="outlined"
                fullWidth
                margin="normal"
                name="type"
                value={newTraining.type}
                onChange={handleNewTrainingChange}
              />
              <TextField
                label="Repeticiones (Rango o Exacto)"
                variant="outlined"
                fullWidth
                margin="normal"
                name="repetitions"
                value={newTraining.repetitions}
                onChange={handleNewTrainingChange}
              />
              <TextField
                label="RIR (Rango o Exacto)"
                variant="outlined"
                fullWidth
                margin="normal"
                name="rir"
                value={newTraining.rir}
                onChange={handleNewTrainingChange}
              />
              <TextField
                label="Series"
                variant="outlined"
                fullWidth
                margin="normal"
                name="series"
                value={newTraining.series}
                onChange={handleNewTrainingChange}
              />
              <TextField
                label="Comentarios"
                variant="outlined"
                fullWidth
                margin="normal"
                name="comments"
                value={newTraining.comments}
                onChange={handleNewTrainingChange}
              />
              <TextField
                label="Frecuencia (e.g., 1 vez por semana)"
                variant="outlined"
                fullWidth
                margin="normal"
                name="frequency"
                value={newTraining.frequency}
                onChange={handleNewTrainingChange}
              />
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleCreateTraining}
              >
                Crear Entrenamiento
              </Button>
            </Box>
          )}

          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => setShowCompleted(!showCompleted)}
          >
            {showCompleted
              ? "Ver Entrenamientos Activos"
              : "Ver Entrenamientos Completados"}
          </Button>

          {showCompleted && (
            <Box mt={4}>
              <Typography variant="h6" mb={2}>
                Entrenamientos Completados
              </Typography>
              {completedTrainings.length > 0 ? (
                completedTrainings.map((training, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 2,
                      p: 2,
                      border: "1px solid #ccc",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h6">{training.type}</Typography>
                    <Typography variant="body2">
                      Repeticiones: {training.repetitions}
                    </Typography>
                    <Typography variant="body2">RIR: {training.rir}</Typography>
                    <Typography variant="body2">
                      Series: {training.series}
                    </Typography>
                    <Typography variant="body2">
                      Frecuencia: {training.frequency}
                    </Typography>
                    <Typography variant="body2">
                      Comentarios: {training.comments}
                    </Typography>
                    <Typography variant="body2">
                      Sesiones Completadas: {training.completedSessions.length}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2">
                  No hay entrenamientos completados.
                </Typography>
              )}
            </Box>
          )}
        </Box>
      ) : (
        <Box>
          <Typography variant="h5" mb={2}>
            Agregar Nuevo Alumno
          </Typography>
            <AddStudent />
        </Box>
      )}
    </Box>
  );
};

export default StudentDetails;

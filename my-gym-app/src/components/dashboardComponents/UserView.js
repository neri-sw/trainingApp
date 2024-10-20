// src/components/dashboardComponents/UserView.js
import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { getTrainingsForUser } from "../../services/firestore";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase";

const UserView = ({ user }) => {
  const [trainings, setTrainings] = useState([]);
  const [editTraining, setEditTraining] = useState(null);

  // Obtener los entrenamientos del usuario logeado
  useEffect(() => {
    const fetchTrainings = async () => {
      if (user) {
        const fetchedTrainings = await getTrainingsForUser(user.email);
        setTrainings(fetchedTrainings);
      }
    };
    fetchTrainings();
  }, [user]);

  // Filtrar entrenamientos activos y completados
  const activeTrainings = trainings.filter(
    (training) =>
      !training.completedSessions || training.completedSessions.length === 0
  );
  const completedTrainings = trainings.filter(
    (training) =>
      training.completedSessions && training.completedSessions.length > 0
  );

  // Manejar el cambio de los campos del entrenamiento editado
  const handleEditTrainingChange = (e) => {
    const { name, value } = e.target;
    setEditTraining((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar la actualización del entrenamiento
  const handleUpdateTraining = async (trainingId) => {
    try {
      const updatedTraining = {
        ...editTraining,
        realizationDate: editTraining.realizationDate || new Date().toISOString(),
      };
  
      if (editTraining.uploadType === 'playlist') {
        updatedTraining.youtubeUrls = [editTraining.playlistUrl];
      } else {
        updatedTraining.youtubeUrls = editTraining.youtubeUrls || Array.from({ length: editTraining.series }, () => '');
      }
  
      const trainingDocRef = doc(db, 'trainings', trainingId);
      await updateDoc(trainingDocRef, updatedTraining);
      setTrainings((prev) =>
        prev.map((training) => (training.id === trainingId ? { ...training, ...updatedTraining } : training))
      );
      setEditTraining(null);
    } catch (error) {
      console.error('Error al actualizar el entrenamiento:', error);
    }
  };
  

  return (
    <Box sx={{ flex: 1, p: 3 }}>
      {editTraining ? (
        <>
          <Button
            variant="contained"
            sx={{ mt: 2, mb: 2 }}
            onClick={() => setEditTraining(null)}
          >
            Volver
          </Button>
          <Box>
            <Typography variant="h5" mb={2}>
              Editar Entrenamiento
            </Typography>
            <TextField
              label="Tipo de Entrenamiento"
              variant="outlined"
              fullWidth
              margin="normal"
              name="type"
              value={editTraining.type || ""}
              onChange={handleEditTrainingChange}
            />
            <TextField
              label="Repeticiones (Rango o Exacto)"
              variant="outlined"
              fullWidth
              margin="normal"
              name="repetitions"
              value={editTraining.repetitions || ""}
              onChange={handleEditTrainingChange}
            />
            <TextField
              label="RIR (Rango o Exacto)"
              variant="outlined"
              fullWidth
              margin="normal"
              name="rir"
              value={editTraining.rir || ""}
              onChange={handleEditTrainingChange}
            />
            <TextField
              label="Series"
              variant="outlined"
              fullWidth
              margin="normal"
              name="series"
              value={editTraining.series || ""}
              onChange={handleEditTrainingChange}
            />
            <TextField
              label="Comentarios"
              variant="outlined"
              fullWidth
              margin="normal"
              name="comments"
              value={editTraining.comments || ""}
              onChange={handleEditTrainingChange}
            />
            <TextField
              label="Frecuencia (e.g., 1 vez por semana)"
              variant="outlined"
              fullWidth
              margin="normal"
              name="frequency"
              value={editTraining.frequency || ""}
              onChange={handleEditTrainingChange}
            />
<Box mt={2}>
  <Typography variant="h6" mb={1}>Tipo de Carga de Video</Typography>
  <FormControl component="fieldset">
    <RadioGroup
      row
      name="uploadType"
      value={editTraining.uploadType || 'individual'}
      onChange={handleEditTrainingChange}
    >
      <FormControlLabel value="individual" control={<Radio />} label="Videos Individuales" />
      <FormControlLabel value="playlist" control={<Radio />} label="Playlist" />
    </RadioGroup>
  </FormControl>
</Box>
{editTraining.uploadType === 'playlist' ? (
  <TextField
    label="URL de la Playlist de YouTube"
    variant="outlined"
    fullWidth
    margin="normal"
    name="playlistUrl"
    value={editTraining.playlistUrl || ''}
    onChange={handleEditTrainingChange}
  />
) : (
  [...Array(Number(editTraining.series)).keys()].map((i) => (
    <TextField
      key={i}
      label={`URL de YouTube (Serie ${i + 1})`}
      variant="outlined"
      fullWidth
      margin="normal"
      name={`youtubeUrl${i}`}
      value={editTraining.youtubeUrls ? editTraining.youtubeUrls[i] : ''}
      onChange={(e) => {
        const newUrls = [...(editTraining.youtubeUrls || Array.from({ length: editTraining.series }, () => ''))];
        newUrls[i] = e.target.value;
        setEditTraining((prev) => ({ ...prev, youtubeUrls: newUrls }));
      }}
    />
  ))
)}


            <TextField
              label="Fecha de Realización"
              type="date"
              variant="outlined"
              fullWidth
              margin="normal"
              name="realizationDate"
              value={editTraining.realizationDate || ""}
              onChange={handleEditTrainingChange}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => handleUpdateTraining(editTraining.id)}
            >
              Guardar Entrenamiento
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" mb={2}>
              Entrenamientos Activos
            </Typography>
            {activeTrainings.length > 0 ? (
              activeTrainings.map((training) => (
                <Box
                  key={training.id}
                  sx={{
                    mb: 2,
                    p: 2,
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    cursor: "pointer",
                    width: "fit-content",
                  }}
                  onClick={() => setEditTraining(training)}
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
          </Box>

          <Box>
            <Typography variant="h5" mb={2}>
              Entrenamientos Completados
            </Typography>
            {completedTrainings.length > 0 ? (
              completedTrainings.map((training) => (
                <Box
                  key={training.id}
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
                    Fecha de realización: {training.realizationDate || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    URL de YouTube: {training.youtubeUrl || "No disponible"}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2">
                No hay entrenamientos completados.
              </Typography>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default UserView;

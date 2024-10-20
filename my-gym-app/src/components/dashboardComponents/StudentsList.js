import React from "react";
import { Box, Typography } from "@mui/material";

const StudentList = ({ students, onSelectStudent, selectedStudent }) => {
  return (
    <Box sx={{ flex: 1, p: 3, overflowY: "auto" }}>
      <Typography variant="h5" mb={2}>
        Mis Alumnos
      </Typography>
      {students.length > 0 ? (
        students.map((student) => (
          <Box
            key={student.id}
            sx={{
              mb: 2,
              p: 2,
              border: "1px solid #ccc",
              borderRadius: 2,
              cursor: "pointer",
              backgroundColor:
                selectedStudent && selectedStudent.id === student.id
                  ? "#e0f7fa"
                  : "#ffffff",
            }}
            onClick={() => onSelectStudent(student)}
          >
            <Typography variant="h6">{student.name}</Typography>
            <Typography variant="body2">Correo: {student.email}</Typography>
          </Box>
        ))
      ) : (
        <Typography variant="body2">No tienes alumnos asignados.</Typography>
      )}
    </Box>
  );
};

export default StudentList;

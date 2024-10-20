import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import StudentsList from "./StudentsList";
import StudentDetails from "./StudentDetails";
import { getDocs, query, where, collection } from "firebase/firestore";
import { db } from "../../services/firebase";

const AdminView = ({ user }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Obtener los alumnos del entrenador
  useEffect(() => {
    const fetchStudents = async () => {
      if (user && user.email) {
        const q = query(
          collection(db, "users"),
          where("trainerEmail", "==", user.email)
        );
        const querySnapshot = await getDocs(q);
        const fetchedStudents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudents(fetchedStudents);
      }
    };
    fetchStudents();
  }, [user]);

  // Manejar la selección o deselección de un alumno
  const handleSelectStudent = (student) => {
    if (selectedStudent && selectedStudent.id === student.id) {
      setSelectedStudent(null);
    } else {
      setSelectedStudent(student);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "rgba(210, 230, 255, 0.6)",
        p: 3,
      }}
    >
      {/* Lista de alumnos */}
      <StudentsList
        students={students}
        onSelectStudent={handleSelectStudent}
        selectedStudent={selectedStudent}
      />

      {/* Detalles del alumno seleccionado y entrenamientos */}
      <StudentDetails selectedStudent={selectedStudent} />
    </Box>
  );
};

export default AdminView;

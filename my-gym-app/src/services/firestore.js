// src/firestoreService.js
import { db } from './firebase';
import { collection, addDoc, getDoc, getDocs, query, where, doc, updateDoc, setDoc } from 'firebase/firestore';

// Función para agregar una rutina
export const addRoutine = async (routine) => {
  try {
    const docRef = await addDoc(collection(db, "routines"), routine);
    console.log("Rutina agregada con ID: ", docRef.id);
  } catch (e) {
    console.error("Error al agregar la rutina: ", e);
  }
};

// Función para actualizar el progreso
export const updateProgress = async (userId, progressData) => {
  const progressRef = doc(db, "progress", userId);
  try {
    await updateDoc(progressRef, progressData);
    console.log("Progreso actualizado con éxito");
  } catch (e) {
    console.error("Error al actualizar el progreso: ", e);
  }
};

// Obtener alumnos del entrenador
export const getStudents = async (trainerId) => {
  const q = query(collection(db, "users"), where("trainerId", "==", trainerId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Asociar un alumno con un entrenador
export const assignStudentToTrainer = async (studentId, trainerId) => {
  const studentRef = doc(db, "users", studentId);
  try {
    await updateDoc(studentRef, { trainerId });
    console.log("Alumno asignado al entrenador con éxito");
  } catch (e) {
    console.error("Error al asignar el alumno: ", e);
  }
};

// Agregar un nuevo alumno
export const addStudent = async (studentData) => {
  try {
    const studentDocRef = await addDoc(collection(db, "users"), studentData);
    console.log("Alumno agregado con ID: ", studentDocRef.id);
  } catch (e) {
    console.error("Error al agregar el alumno: ", e);
  }
};

// Obtener alumnos del entrenador por correo electrónico del entrenador
export const getStudentsByTrainerEmail = async (trainerEmail) => {
  const q = query(collection(db, "users"), where("trainerEmail", "==", trainerEmail));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const createUserProfileIfNotExists = async (user) => {
  if (!user) return;

  const userEmail = user.email;

  try {
    // Buscar el usuario por correo electrónico en Firestore
    const q = query(collection(db, "users"), where("email", "==", userEmail));
    const querySnapshot = await getDocs(q);

    // Si no existe, crear un nuevo perfil
    if (querySnapshot.empty) {
      const userRef = doc(db, "users", user.uid); // Usar el UID como ID del documento
      await setDoc(userRef, {
        name: user.displayName || "Usuario sin nombre",
        email: userEmail,
        role: "user", // Definir el rol por defecto, se puede cambiar más adelante
        trainerEmail: null, // Por defecto sin entrenador asignado
      });
      console.log("Perfil de usuario creado en Firestore");
    } else {
      console.log("Perfil ya existe en Firestore, no se necesita crear uno nuevo.");
    }
  } catch (e) {
    console.error("Error al verificar o crear el perfil de usuario: ", e);
  }
};

export const getTrainingsForUser = async (userEmail) => {
  try {
    const trainingsRef = collection(db, "trainings");
    const q = query(trainingsRef, where("email", "==", userEmail));
    const querySnapshot = await getDocs(q);
    const trainings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return trainings;
  } catch (error) {
    console.error("Error al obtener los entrenamientos: ", error);
    return [];
  }
};

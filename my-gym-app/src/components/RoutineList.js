// src/RoutineList.js
import React from 'react';
import routines from './../RoutineList';

const RoutineList = () => {
  return (
    <div>
      <h2>Mis Rutinas</h2>
      <ul>
        {routines.map((routine) => (
          <li key={routine.id}>
            <h3>{routine.name}</h3>
            <p>{routine.description}</p>
            <p>Días: {routine.days.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoutineList;

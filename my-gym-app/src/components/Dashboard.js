// src/components/Dashboard.js
import React from 'react';
import AdminView from './dashboardComponents/AdminView';
import UserView from './dashboardComponents/UserView';

const Dashboard = ({ user }) => {
  const isAdmin = user.email === "neri12312131@gmail.com";
  isAdmin ? user.role = 'admin' : user.role= 'student';
  console.log({user})

  return (
    <div>
      {isAdmin ? (
        <AdminView user={user}/>
      ) : (
        <UserView user={user}/>
      )}
    </div>
  );
};

export default Dashboard;

import React from 'react';

interface User {
  id: string;
  email: string;
  status: string;
}

interface SidebarProps {
  users: User[];
  onUserSelect: (id: string) => void; 
}

const Sidebar: React.FC<SidebarProps> = ({ users, onUserSelect }) => {
  return (
    <div style={sidebarStyle}>
      <h3>Users</h3>
      {users.map((user) => (
        <button key={user.id} onClick={() => {
        onUserSelect(user.id)}} style={buttonStyle}>
          <div style={userStyle}>
            <span>{user.email}</span>
            <span style={{ color: user.status === 'online' ? 'green' : 'red' }}> ●</span>
          </div>
        </button>
      ))}
    </div>
  );
};

const sidebarStyle: React.CSSProperties = {
  width: '250px',
  height: '100vh',
  backgroundColor: '#f4f4f4',
  padding: '20px',
  boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
  position: 'fixed',
  left: '0',
};

const userStyle: React.CSSProperties = {
  marginBottom: '15px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const buttonStyle: React.CSSProperties = {
  padding: '5px 10px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  margin: '2px',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'left',
};

export default Sidebar;

// // components/MainSidebar.tsx
// import React, { useState } from 'react';
// import Sidebar from './Sidebar';

// const ChatPage = () => {
//   const [selectedUser, setSelectedUser] = useState<string | null>(null);

//   // Static user data for testing
//   const users = [
//     { id: '1', email: 'user1@example.com', status: 'online' },
//     { id: '2', email: 'user2@example.com', status: 'offline' },
//     { id: '3', email: 'user3@example.com', status: 'online' },
//     { id: '4', email: 'user4@example.com', status: 'offline' },
//     { id: '5', email: 'user5@example.com', status: 'online' },
//     { id: '6', email: 'user6@example.com', status: 'offline' },
//     { id: '7', email: 'user7@example.com', status: 'online' },
//     { id: '8', email: 'user8@example.com', status: 'offline' },
//     { id: '9', email: 'user9@example.com', status: 'online' },
//     { id: '10', email: 'user10@example.com', status: 'offline' },
//   ];

//   return (
//     <div style={{ display: 'flex' }}>
//       <Sidebar users={users} onUserSelect={setSelectedUser} />
//       <div style={chatAreaStyle}>
//         {selectedUser ? (
//           <div>
//             <h3>Chat with {selectedUser}</h3>
//             {/* Message display logic */}
//           </div>
//         ) : (
//           <p>Please select a user to start chatting.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// const chatAreaStyle = {
//   marginLeft: '260px',
//   padding: '20px',
//   width: '100%',
//   backgroundColor: '#f9f9f9',
// };

// export default ChatPage;

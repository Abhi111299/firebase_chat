import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebaseConfig';
import Sidebar from '../components/Sidebar';
import { db, collection, query, where, orderBy, onSnapshot } from '../firebaseConfig'; // Import Firestore functions

interface User {
  id: string;
  email: string;
  status: string;
}

interface Message {
  senderUid: string;
  receiverUid: string;
  message: string;
  timestamp: string;
  imageUrl?: string; // Optional fileUrl property
}

const Chat = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  // const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null); // State for file selection

  // useEffect(() => {
  //   // Listen for auth state changes
  //   const unsubscribe = auth.onAuthStateChanged((currentUser) => {
  //     if (currentUser) {
  //       setUser(currentUser);  // set the logged in user
  //     } else {
  //       setUser(null); // no user, handle accordingly
  //     }
  //   });

  //   // Cleanup listener on unmount
  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    // Fetch the list of users
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/users');
        const usersWithStatus = response.data.map((user: User) => ({
          ...user,
          status: user.status || 'offline',
        }));
        setUsers(usersWithStatus);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Fetch messages only when a user is selected
    if (selectedUser) {
      const fetchMessages = async () => {
        const user1Id = auth.currentUser?.uid;
        const user2Id = selectedUser;

        try {
          setLoading(true);
          const messagesQuery = query(
            collection(db, 'messages'),
            where('senderUid', 'in', [user1Id, user2Id]),
            where('receiverUid', 'in', [user1Id, user2Id]),
            orderBy('timestamp', 'asc')
          );

          // Firestore listener for real-time message updates
          const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const updatedMessages: Message[] = snapshot.docs.map((doc) => doc.data() as Message);
            setMessages(updatedMessages);
          });

          return () => unsubscribe();
        } catch (error) {
          console.error('Error fetching messages:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchMessages();
    }
  }, [selectedUser]);

  const sendMessage = async () => {
    if ((messageInput.trim() || file) && selectedUser) {
      try {
        const formData = new FormData();
  
        // Append the message data and the selected image to the FormData object
        formData.append('senderUid', auth.currentUser?.uid!);
        formData.append('receiverUid', selectedUser);
        formData.append('message', messageInput);
  
        if (file) {
          formData.append('image', file);  // Attach the file to the FormData object
        }
  
        // Send the form data (which contains the image and message) to the backend
        const response = await fetch('http://localhost:4000/send-message', {
          method: 'POST',
          body: formData, // Send the form data (image + message)
        });
  
        const responseData = await response.json();
  
        if (responseData.imageUrl) {
          console.log("Image uploaded:", responseData.imageUrl);
        }
  
        // Handle the response after sending the message
        if (responseData.message === 'Message sent successfully!') {
          // Clear the input and file after sending the message
          setMessageInput('');
          setFile(null);
        } else {
          console.error('Error sending message:', responseData.message);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };
  
  
  

  
  


  const filteredMessages = messages.filter(
    (msg) =>
      (msg.senderUid === auth.currentUser?.uid && msg.receiverUid === selectedUser) ||
      (msg.senderUid === selectedUser && msg.receiverUid === auth.currentUser?.uid)
  );

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar users={users} onUserSelect={setSelectedUser} />
      <div style={chatAreaStyle}>
        {loading ? (
          <div>Loading...</div>
        ) : selectedUser ? (
          <>
            <h3 style={topHeader}>Chat with {users.find((user) => user.id === selectedUser)?.email}</h3>
            <div style={{ ...messagesContainerStyle, display: 'flex', flexDirection: 'column', padding: '10px' }}>
              {filteredMessages.map((msg, index) => {
                // Log the comparison result here, before rendering JSX

                return (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: msg.senderUid === auth.currentUser?.email ? 'flex-end' : 'flex-start',
                      padding: '5px 10px',
                      backgroundColor: msg.senderUid === auth.currentUser?.email ? '#007bff' : '#f1f1f1',
                      color: msg.senderUid === auth.currentUser?.email ? 'white' : 'black',
                      margin: '5px 0',
                      borderRadius: msg.senderUid === auth.currentUser?.email ? '10px 10px 0 10px' : '0 10px 10px 10px',
                      maxWidth: '70%',
                      boxShadow: msg.senderUid === auth.currentUser?.email ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                    }}
                  >
                    {msg.senderUid === auth.currentUser?.uid ? (
                      <div style={{ display: 'inline-block', marginLeft: 'auto' }}>
                        <div><strong>{msg.senderUid}</strong> : {msg.message}</div>
                        {msg.imageUrl && (
                          <div className="message-image">
                            <img
                              src={msg.imageUrl}
                              alt="Message attachment"
                              style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'contain' }}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: 'inline-block' }}>
                        <div><strong>{msg.senderUid}</strong> : {msg.message}</div>
                        {msg.imageUrl && (
                          <div className="message-image">
                            <img
                              src={msg.imageUrl}
                              alt="Message attachment"
                              style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'contain' }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message"
              style={textareaStyle}
            />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              style={fileInputStyle}
            />
            <button onClick={sendMessage} style={sendButtonStyle}>Send</button>
          </>
        ) : (
          <div style={topHeader}>Select a user to start chatting.</div>
        )}
      </div>
    </div>
  );
};

const chatAreaStyle = {
  marginLeft: '250px',
  padding: '20px',
  width: 'calc(100% - 250px)',
  backgroundColor: '#f4f4f4',
};

const messagesContainerStyle: React.CSSProperties = {
  height: '360px',
  overflowY: 'scroll',
  marginBottom: '10px',
  marginLeft: '40px',
  padding: '10px',
  backgroundColor: '#ffffff',
  borderRadius: '10px',
};

const textareaStyle = {
  width: '100%',
  padding: '10px',
  marginLeft: '40px',
  marginBottom: '10px',
  borderRadius: '5px',
  border: '1px solid #ddd',
  fontSize: '14px',
};

const fileInputStyle = {
  marginLeft: '40px',
  marginBottom: '10px',
};

const sendButtonStyle = {
  padding: '10px 15px',
  backgroundColor: '#007bff',
  color: 'white',
  marginLeft: '40px',
  margin: '5px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const topHeader = {
  marginLeft: '40px',
};

export default Chat;

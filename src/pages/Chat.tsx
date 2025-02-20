import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebaseConfig';
import Sidebar from '../components/Sidebar';
import { db, collection, addDoc, query, where, orderBy, onSnapshot } from '../firebaseConfig'; // Import Firestore functions
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage functions

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
  fileUrl?: string; // Optional fileUrl property
}

const Chat = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null); // State for file selection

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);  // set the logged in user
      } else {
        setUser(null); // no user, handle accordingly
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

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
        let fileUrl: string | undefined = undefined;

        // If a file is selected, upload it to Firebase Storage
        if (file) {
          const storage = getStorage();
          const storageRef = ref(storage, `chat_files/${file.name}`);
          const uploadSnapshot = await uploadBytes(storageRef, file); // Upload file
          fileUrl = await getDownloadURL(uploadSnapshot.ref); // Get the download URL of the uploaded file
        }

        const messageData: Message = {
          senderUid: auth.currentUser?.uid!,
          receiverUid: selectedUser,
          message: messageInput,
          timestamp: new Date().toISOString(),
          fileUrl, // Attach the file URL to the message data if there was a file
        };

        // Send message to Firestore
        await addDoc(collection(db, 'messages'), messageData);

        // Clear input and file after sending message
        setMessageInput('');
        setFile(null);
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
            <div style={messagesContainerStyle}>
              {filteredMessages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    textAlign: msg.senderUid === auth.currentUser?.email ? 'right' : 'left',
                    padding: '5px 10px',
                    backgroundColor: msg.senderUid === auth.currentUser?.email ? '#007bff' : '#f1f1f1',
                    color: msg.senderUid === auth.currentUser?.email ? 'white' : 'black',
                    margin: '5px 0',
                    borderRadius: msg.senderUid === auth.currentUser?.email ? '10px 10px 0 10px' : '0 10px 10px 10px',
                    maxWidth: '70%',
                    marginLeft: msg.senderUid === auth.currentUser?.email ? 'auto' : '0',
                    boxShadow: msg.senderUid === auth.currentUser?.email ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                  }}
                >
                  <strong>{msg.senderUid}: </strong>{msg.message}
                  {msg.fileUrl && (
                    <div>
                      <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                        Download file
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message"
              style={textareaStyle}
            />
            {/* <input
              type="file"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              style={fileInputStyle}
            /> */}
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

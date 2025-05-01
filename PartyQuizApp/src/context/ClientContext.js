import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

export const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const [hostIp, setHostIp] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  const connectToHost = (ip, name) => {
    if (!ip || !name) return;

    const socket = new WebSocket(`ws://${ip}:3000`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      socket.send(JSON.stringify({ type: 'join', name }));
    };

    socket.onmessage = (event) => {
      console.log('Received from server:', event.data);
      // You can add message parsing and events here
    };

    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setIsConnected(false);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
    };

    setHostIp(ip);
    setPlayerName(name);
  };

  const sendMessage = (data) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    } else {
      console.warn('Socket is not open.');
    }
  };

  return (
    <ClientContext.Provider
      value={{
        hostIp,
        playerName,
        isConnected,
        connectToHost,
        sendMessage,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

// Hook for easy use
export const useClient = () => useContext(ClientContext);

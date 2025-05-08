import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useLocal } from '@src/config/Network';

import { CLIENT_TO_SERVER, SERVER_TO_CLIENT} from '@shared/messages'
import { sendMessageToServer } from '@src/utils/networkUtils';

export const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const [hostIp, setHostIp] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [incomingMessageData, setIncomingMessageData] = useState(null); //incoming message data from server
  const socketRef = useRef(null);

  const connectToHost = (ip, name) => {
    if (!ip || !name) return;

    const ws = useLocal ? 
      new WebSocket(`ws://${ip}:3000`) :
      new WebSocket('wss://partyquiz.onrender.com');

    socketRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      ws.send(JSON.stringify({ type: CLIENT_TO_SERVER.JOIN, name }));
    };

    ws.onmessage = (event) => {
      //console.log('Client - Received from server:', event.data);
      const data = JSON.parse(event.data);
      setIncomingMessageData(data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
    };

    setHostIp(ip);
    setPlayerName(name);
  };

  const sendMessage = (data) => {
    sendMessageToServer(socketRef.current, data);
  };

  return (
    <ClientContext.Provider
      value={{
        hostIp,
        playerName,
        isConnected,
        incomingMessageData,
        connectToHost,
        sendMessage
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

// Hook for easy use
export const useClient = () => useContext(ClientContext);

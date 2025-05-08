import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useNetwork } from '@src/context/NetworkContext';

import { useLocal } from '@src/config/Network';
import { sendMessageToServer } from '@src/utils/networkUtils';

import { CLIENT_TO_SERVER, SERVER_TO_CLIENT} from '@shared/messages'

const HostContext = createContext();

export const HostProvider = ({ children }) => {
  const { ipAddress } = useNetwork();
  const [players, setPlayers] = useState([]);
  const [isServerConnected, setIsServerConnected] = useState(false);
  const [incomingMessageData, setIncomingMessageData] = useState(null); //incoming message data from server
  const socketRef = useRef(null);

  useEffect(() => {
    if (!ipAddress) return;

    const ws = useLocal ?
      new WebSocket(`ws://${ipAddress}:3000`) :
      new WebSocket('wss://partyquiz.onrender.com');

    socketRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      setIsServerConnected(true);
      
      ws.send(JSON.stringify({ type: CLIENT_TO_SERVER.GET_PLAYERS }));
    };

    ws.onmessage = (event) => {
      //console.log('Host - Received from server:', event.data);
      const data = JSON.parse(event.data);
      setIncomingMessageData(data);

      if (data.type === SERVER_TO_CLIENT.PLAYER_LIST) {
        setPlayers(data.players);
      }
    };

    ws.onerror = (error) => {
      console.log('WebSocket Error:', error.message);
      setIsServerConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setIsServerConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [ipAddress]);

  const sendMessage = (data) => {
    sendMessageToServer(socketRef.current, data);
  };

  return (
    <HostContext.Provider value={{ 
      players, 
      isServerConnected, 
      ipAddress, 
      incomingMessageData,
      sendMessage
    }}>
      {children}
    </HostContext.Provider>
  );
};

export const useHost = () => useContext(HostContext);

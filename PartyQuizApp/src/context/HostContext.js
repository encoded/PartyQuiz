import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNetwork } from '@src/context/NetworkContext';

const HostContext = createContext();

export const HostProvider = ({ children }) => {
  const { ipAddress } = useNetwork();
  const [players, setPlayers] = useState([]);
  const [isServerConnected, setIsServerConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!ipAddress) return;

    const ws = new WebSocket(`ws://${ipAddress}:3000`);
    setSocket(ws);

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      setIsServerConnected(true);
      
      ws.send(JSON.stringify({ type: 'get_players' }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'player_list') {
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

  return (
    <HostContext.Provider value={{ players, isServerConnected, ipAddress, socket }}>
      {children}
    </HostContext.Provider>
  );
};

export const useHost = () => useContext(HostContext);

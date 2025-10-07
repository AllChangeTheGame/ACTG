import { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [updateCount, setUpdateCount] = useState(0);

  const refreshData = () => {
    setUpdateCount((prev) => prev + 1);
  };

  return (
    <GameContext.Provider value={{ updateCount, refreshData }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);

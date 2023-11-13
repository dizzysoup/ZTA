import React, { createContext, useContext, useState } from 'react';

const MyContext = createContext();

export function MyProvider({ children }) {
  const [IsLogin , setLogin] = useState(0);

  return (
    <MyContext.Provider value={{ IsLogin, setLogin }}>
      {children}
    </MyContext.Provider>
  );
}

export function useMyContext() {
  return useContext(MyContext);
}
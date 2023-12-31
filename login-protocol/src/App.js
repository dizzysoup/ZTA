import logo from './logo.svg';
import './App.css';
import useRWD from './useRWD';
import React,{createContext, useContext , useState} from 'react';
import AuthContext from './AuthContext';
import LoginPage from './LoginPage';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import HomePage from './HomePage';




function App() {
  const device = useRWD();
  const [account , Setaccount ] = useState("");
  const [password , Setpassword ] = useState("");
  

  return (
    <AuthContext.Provider value={{account,Setaccount,password,Setpassword}}>
      <BrowserRouter>      
        <h1> Mobile :  {device}</h1>
        <Routes>         
          <Route path="/" element={<LoginPage />} />
          <Route path="/Home" element={<HomePage />} />
        </Routes>
        
        
     </BrowserRouter>
    </AuthContext.Provider>
  );
}


export default App;

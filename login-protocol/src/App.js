import logo from './logo.svg';
import './App.css';
import React,{createContext, useContext , useState} from 'react';
import AuthContext from './AuthContext';
import LoginPage from './LoginPage';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import HomePage from './HomePage';



function App() {
  const [account , Setaccount ] = useState("");
  const [password , Setpassword ] = useState("");

  return (
    <AuthContext.Provider value={{account,Setaccount,password,Setpassword}}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/Home" element={<HomePage />} />
        </Routes>
     </BrowserRouter>
    </AuthContext.Provider>
  );
}


export default App;

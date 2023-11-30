import logo from './logo.svg';
import './App.css';
import React,{createContext, useContext , useState} from 'react';
import AuthContext from './authContext';
import LoginPage from './LoginPage';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import HomePage from './HomePage';

//import Login2 from './login2';

const authContext = {
  account : "",
  password : ""
}

const AuthProvider = ({children}) => {
  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
}

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/Home" element={<HomePage />} />
        </Routes>
     </BrowserRouter>
    </AuthProvider>
  );
}


export default App;

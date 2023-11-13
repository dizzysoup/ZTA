import logo from './logo.svg';
import './App.css';
import React,{createContext, useContext , useState} from 'react';

import LoginPage from './LoginPage';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import HomePage from './HomePage';
import {MyProvider }from './MyContext';
//import Login2 from './login2';



function App() {

  return (
    <MyProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/Home" element={<HomePage />} />
        </Routes>
     </BrowserRouter>
    </MyProvider>
  );
}


export default App;

import  React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext.jsx';


import Modal from 'react-modal';

Modal.setAppElement('#root');  // Or whatever your root element id is

createRoot(document.getElementById('root')).render(

  <React.StrictMode>
     <BrowserRouter>
     <AuthContextProvider>
     <App />
     </AuthContextProvider>
     </BrowserRouter>
   </React.StrictMode>
)

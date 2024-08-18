import  React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import {store} from './app/store.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>

  <React.StrictMode>
     <BrowserRouter>
     <AuthContextProvider>
     <App />
     </AuthContextProvider>
     </BrowserRouter>
   </React.StrictMode>,
  </Provider>
)

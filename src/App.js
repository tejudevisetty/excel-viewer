import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './App.css';
import Signup from './components/signUp';
import Login from './components/login';
import Dashboard from './components/dashboard';
import Viewer from './components/Viewer';

function App() {
  return (

      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/viewer" element={<Viewer/>}/>

      </Routes>
      </BrowserRouter>
      

      
  );
}

export default App;

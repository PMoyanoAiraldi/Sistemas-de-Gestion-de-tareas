import { Routes, Route, Navigate } from "react-router-dom";
import styles from "./App.module.css"
import LoginForm from "./components/LoginForm/LoginForm";
import RegistroForm from "./components/RegistroForm/RegistroForm";
import Dashboard from "./pages/DahsboardPage/DashboardPage";
import TareasForm from "./components/TareasForm/TareasForm";
import ModificarTarea from "./components/ModificarTarea/ModificarTarea";


function App() {


  return (
    <div className={styles.routesWrapper}>
      
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/registrar" element={<RegistroForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/crear" element={<TareasForm />} />
        <Route path="/modificar" element={<ModificarTarea />} />
        
    </Routes>
      
        
    </div>
  )
}

export default App

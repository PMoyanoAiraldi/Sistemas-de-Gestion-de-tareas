import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/usuarioReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "./LoginForm.module.css"


const Login = () =>{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const onLogin = (userData) => {
        console.log("Datos enviados al backend:", userData); 
        axios.post(`http://localhost:3000/auth/login`, userData)
        .then(resp => {
            
            if(resp.data.usuario)  {
                localStorage.setItem('token', resp.data.token);
                dispatch(login({ login: true, usuario: resp.data.usuario, token: resp.data.token }));
            console.log("RESPUESTA DEL BACKEND:", resp.data.usuario); 
                navigate("/dashboard");  
            } else {
                alert("Credenciales incorrectas");
            }
        
        })
        .catch(() => {
            Swal.fire('Error', 'Error al ingresar los datos', 'error');
            navigate("/login")
            
        });
    };

    const [input, setInput] = useState({
        email: '',
        contrasenia: ''
    });
    const handleChange = (e) => { //a la funcion le debemos pasar un evento
        setInput({ //es una promesa
            ...input, //trae todo lo que esta en input
            [e.target.name]:e.target.value //de los cambios que haya en username o password trae el valor, identificamos los campos por name
        })

    }

    const isButtonDisabled = input.email === '' || input.contrasenia === '';
    return(
        <div className={styles.containerLogin}>
        <h1 className={styles.titleLogin}>Si estás registrado, ingresa con tus credenciales </h1>
        <form className={styles.form}>
        
        <div className={styles.inputContainer}>
        <input className={styles.input} type="email" name="email" id="email"
        placeholder="Email" 
        onChange={handleChange} 
        value={input.email}/>
        </div>
        
        <div className={styles.inputContainer}>
        <input className={styles.inputWithIcon} type={showPassword ? "text" : "password"} name="contrasenia" id="contrasenia"
        placeholder="Contraseña" 
        onChange={handleChange} 
        value={input.contrasenia}/>
        
        <span
                className={styles.icon}
                onClick={() => setShowPassword(!showPassword)}
            >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </span>
        </div>

        <Link to="/registrar"><span className={styles.registro}>¿No estás registrado?</span> </Link>
        
        <div>
        <button type="button" className={styles.button} onClick={() => onLogin(input)} disabled={isButtonDisabled}>Ingresar</button>
        <Link to="/"><button type="submit" className={styles.button} > Salir</button></Link>
        </div>
        </form>
        </div>
    )
}

export default Login;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/usuarioReducer";
import styles from "./RegistroForm.module.css";
import axios from "axios";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const RegistroForm = () =>{

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    

    const [input, setInput] = useState({
        nombre:'',
        email:'',
        contrasenia:''
    });

    const [disabled, setDisabled] = useState(true);

    const handleChange = (e) => { 
        
        setInput({ 
            ...input, 
            [e.target.name]:e.target.value 
        })

        setDisabled(!validate());

    }

    const validate = () => {
        const requiredFields = ['nombre', 'email', 'contrasenia'];
        return requiredFields.every(field => !!input[field]);
    };


    const handleSubmit = (e) => { 
        e.preventDefault()
    
        axios.post(`http://localhost:3000/usuarios/registrar`, input)
        .then(resp => {
            if (resp.data) {
                dispatch(login(resp.data.user)); // Despachar la acción login después del registro exitoso
                Swal.fire('Éxito', 'Datos registrados correctamente', 'success');
                setInput({  // Limpiar los campos de entrada después del registro exitoso
                    nombre:'',
                    email:'',
                    contrasenia:''
                });
                navigate("/login")
            }

        })
        .catch(() => {
            Swal.fire('Error', 'Error al registrar los datos', 'error');
        });
};

    return(
        <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Mis datos</h1>
        <div>
        <input className={styles.input} type="text" name="nombre" 
        placeholder="Nombre" 
        value={input.nombre}
        onChange={handleChange}
        />
        </div>

        <div>
        <input className={styles.input} type="email" name="email" 
        placeholder="Ejemplo@email.com"
        value={input.email}
        onChange={handleChange}
        />
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

        <div>
        <button type="submit" className={styles.button} disabled={disabled} > Registrar</button>
        <Link to="/"><button className={styles.button} > Salir</button></Link>
        </div>

        </form>
        </div>
    )
}


export default RegistroForm;
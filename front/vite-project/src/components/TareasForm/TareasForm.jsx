import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { addTareas } from "../../redux/tareasReducer";
import { setCategorias } from "../../redux/categoriasReducer"; 
import { setUsuarios } from "../../redux/usuarioReducer";
import styles from "./TareasForm.module.css";

const TareasForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Estado local del formulario
    const [input, setInput] = useState({
        titulo: "",
        descripcion: "",
        prioridad: "",
        fecha_limite: "",
        usuario_asignado: "",
        categoria: "",
    });

    const [disabled, setDisabled] = useState(true);

    // Traigo datos de Redux
    const categorias = useSelector((state) => state.categorias.categorias);
    const usuarios = useSelector((state) => state.usuario.lista);
    const token = useSelector((state) => state.usuario.token);
    const usuarioActual = useSelector((state) => state.usuario.usuario);

    const validate = () => {
        const requiredFields = [
        "titulo",
        "descripcion",
        "prioridad",
        "fecha_limite",
        "usuario_asignado",
        "categoria",
        ];
        return requiredFields.every((field) => !!input[field]);
    };

    const handleChange = (e) => {
        setInput({
        ...input,
        [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
    setDisabled(!validate());
}, [input]);

    const handleSubmit = (e) => {
        e.preventDefault();
    const dataToSend = {
            titulo: input.titulo,
            descripcion: input.descripcion,
            prioridad: input.prioridad,
            fecha_limite: input.fecha_limite,
            usuario_creador_id: usuarioActual?.id,
            usuario_asignado_id: input.usuario_asignado,
            categoria_id: input.categoria,
        };

        console.log("Datos a enviar:", dataToSend);

    console.log("Datos a enviar:", dataToSend);
        axios.post("http://localhost:3000/tareas", dataToSend, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((resp) => {
            if (resp.data) {
            dispatch(addTareas(resp.data)); 
            Swal.fire("Éxito", "Tarea creada correctamente", "success");
            setInput({
                titulo: "",
                descripcion: "",
                prioridad: "",
                fecha_limite: "",
                usuario_asignado: "",
                categoria: "",
            });
            navigate("/tareas");
            }
        })
        .catch(() => {
            Swal.fire("Error", "Error al crear la tarea", "error");
        });
    };

    
    useEffect(() => {
        if (!categorias.length) {
        axios.get("http://localhost:3000/categorias", {
            headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
            dispatch(setCategorias(res.data));
            })
            .catch((err) => console.log(err));
        }

        if (!usuarios.length) {
        axios.get("http://localhost:3000/usuarios", {
            headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
            dispatch(setUsuarios(res.data));
            })
            .catch((err) => console.log(err));
        }
    }, [categorias, usuarios, token]);

    return (
        <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
            <h1 className={styles.title}>Crear tarea</h1>

            <div>
            <input
            className={styles.input}
            type="text"
            name="titulo"
            placeholder="Título"
            value={input.titulo}
            onChange={handleChange}
            />
            </div>

            <div>
            <input
            className={styles.input}
            name="descripcion"
            placeholder="Descripción"
            value={input.descripcion}
            onChange={handleChange}
            />
            </div>

            <div className={styles.filtros}>
            <select
            
            name="prioridad"
            value={input.prioridad}
            onChange={handleChange}
            >
            <option value="">Selecciona prioridad</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            </select>
            </div>

            <div>
            <input
            className={styles.input}
            type="date"
            name="fecha_limite"
            value={input.fecha_limite}
            onChange={handleChange}
            />
            </div>

            <div className={styles.filtros}>
            <select
            name="categoria"
            value={input.categoria}
            onChange={handleChange}
            >
            <option value="">Selecciona categoría</option>
            {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                {cat.nombre}
                </option>
            ))}
            </select>
</div>

        <div className={styles.filtros}>
            <select
            name="usuario_asignado"
            value={input.usuario_asignado}
            onChange={handleChange}
            >
            <option value="">Asignar usuario</option>
            {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                {u.nombre}
                </option>
            ))}
            </select>
    </div>

            <div>
            <button
                type="submit"
                className={styles.button}
                disabled={disabled}
            >
                Crear
            </button>
            <Link to="/dashboard">
                <button type="button" className={styles.button}>
                Salir
                </button>
            </Link>
            </div>
        </form>
        </div>
    );
};

export default TareasForm;

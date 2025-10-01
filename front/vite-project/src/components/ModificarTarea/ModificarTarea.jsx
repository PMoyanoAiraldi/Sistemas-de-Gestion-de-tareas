import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import styles from "./ModificarTarea.module.css";
import { setCategorias } from "../../redux/categoriasReducer";
import { setUsuarios } from "../../redux/usuarioReducer";
import { setTareas } from "../../redux/tareasReducer";

const ModificarTarea = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    
    const [tareaSeleccionada, setTareaSeleccionada] = useState("");
    const [modoEdicion, setModoEdicion] = useState(false);

    const [input, setInput] = useState({
        titulo: "",
        descripcion: "",
        estado: "",
        prioridad: "",
        fecha_limite: "",
        usuario_asignado: "",
        categoria: "",
    });

    const [disabled, setDisabled] = useState(true);

    // Traigo datos de Redux
    const tareas = useSelector((state) => state.tareas.tareas);
    const categorias = useSelector((state) => state.categorias.categorias);
    const usuarios = useSelector((state) => state.usuario.lista);
    const token = useSelector((state) => state.usuario.token);

    const validate = () => {
        const requiredFields = [
            "titulo",
            "descripcion",
            "estado",
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

    
    const handleSeleccionarTarea = (e) => {
        const tareaId = e.target.value;
        setTareaSeleccionada(tareaId);

        if (tareaId) {
            const tarea = tareas.find((t) => t.id === tareaId);
            if (tarea) {
                // Formatear fecha para input type="date"
                const fechaFormateada = tarea.fecha_limite 
                    ? new Date(tarea.fecha_limite).toISOString().split('T')[0] 
                    : "";

                setInput({
                    titulo: tarea.titulo || "",
                    descripcion: tarea.descripcion || "",
                    estado: tarea.estado || "",
                    prioridad: tarea.prioridad || "",
                    fecha_limite: fechaFormateada,
                    usuario_asignado: tarea.usuario_asignado?.id || "",
                    categoria: tarea.categoria?.id || "",
                });
                setModoEdicion(true);
            }
        } else {
            setModoEdicion(false);
            setInput({
                titulo: "",
                descripcion: "",
                estado: "",
                prioridad: "",
                fecha_limite: "",
                usuario_asignado: "",
                categoria: "",
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!tareaSeleccionada) {
            Swal.fire("Error", "Debes seleccionar una tarea", "error");
            return;
        }

        const dataToSend = {
            titulo: input.titulo,
            descripcion: input.descripcion,
            estado: input.estado,
            prioridad: input.prioridad,
            fecha_limite: input.fecha_limite,
            usuario_asignado_id: input.usuario_asignado,
            categoria_id: input.categoria,
        };

        console.log("Datos a enviar:", dataToSend);

        axios.put(`http://localhost:3000/tareas/${tareaSeleccionada}`, dataToSend, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((resp) => {
            if (resp.data) {
                Swal.fire("Éxito", "Tarea modificada correctamente", "success");
                
                // Actualizar Redux con las tareas actualizadas
                axios.get("http://localhost:3000/tareas", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                    dispatch(setTareas(res.data));
                });

                // Limpiar formulario
                setInput({
                    titulo: "",
                    descripcion: "",
                    estado: "",
                    prioridad: "",
                    fecha_limite: "",
                    usuario_asignado: "",
                    categoria: "",
                });
                setTareaSeleccionada("");
                setModoEdicion(false);
                navigate("/dashboard");
            }
        })
        .catch((error) => {
            console.error("Error al modificar:", error);
            Swal.fire("Error", "Error al modificar la tarea", "error");
        });
    };

    // Cargar categorías y usuarios 
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
    }, [categorias, usuarios, token, dispatch]);

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h1 className={styles.title}>Modificar tarea</h1>

                <div className={styles.filtros}>
                    <select
                        name="tarea"
                        value={tareaSeleccionada}
                        onChange={handleSeleccionarTarea}
                    >
                        <option value="">Selecciona una tarea para modificar</option>
                        {tareas.map((tarea) => (
                            <option key={tarea.id} value={tarea.id}>
                                {tarea.titulo}
                            </option>
                        ))}
                    </select>
                </div>

                {modoEdicion && (
                    <>
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
                            <textarea
                                className={styles.input}
                                name="descripcion"
                                placeholder="Descripción"
                                value={input.descripcion}
                                onChange={handleChange}
                                rows="4"
                            />
                        </div>

                        <div className={styles.filtros}>
                            <select
                                name="estado"
                                value={input.estado}
                                onChange={handleChange}
                            >
                                <option value="">Selecciona estado</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="en_progreso">En progreso</option>
                                <option value="completada">Completada</option>
                            </select>
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

                        <div className={styles.actions}>
                            <button
                                type="submit"
                                className={styles.button}
                                disabled={disabled}
                            >
                                Modificar
                            </button>
                            <Link to="/dashboard">
                                <button type="button" className={styles.buttonSecondary}>
                                    Cancelar
                                </button>
                            </Link>
                        </div>
                    </>
                )}

                {!modoEdicion && (
                    <div className={styles.mensaje}>
                        <p>Selecciona una tarea para comenzar a editarla</p>
                        <Link to="/dashboard">
                            <button type="button" className={styles.button}>
                                Volver al Dashboard
                            </button>
                        </Link>
                    </div>
                )}
            </form>
        </div>
    );
};

export default ModificarTarea;
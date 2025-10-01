import { useEffect, useState } from "react";
import axios from "axios";
import { Link} from "react-router-dom"
import styles from "./DashboardPage.module.css";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { setTareas } from "../../redux/tareasReducer";
import { setUsuarios } from "../../redux/usuarioReducer";

const Dashboard = () => {
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();

    // traer tareas desde Redux
    const tareas = useSelector((state) => state.tareas.tareas);
    const usuarioActual = useSelector((state) => state.usuario.usuario);

    const [busqueda, setBusqueda] = useState("");
    const [filtro, setFiltro] = useState({ estado: "", prioridad: "" });
    const usuarios = useSelector((state) => state.usuario.lista);

    const esAdmin = usuarioActual?.rol === "admin" || usuarioActual?.rol === "administrador";

    useEffect(() => {
        axios
        .get("http://localhost:3000/tareas", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            dispatch(setTareas(res.data)); // guardo en Redux
            console.log("obtencion de tareas desde el back", res.data)
        })
        .catch((err) => console.log(err));

        if (!usuarios.length) {
        axios.get("http://localhost:3000/usuarios", {
            headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
            dispatch(setUsuarios(res.data));
            })
            .catch((err) => console.log(err));
        }
    
    }, [token,usuarios, dispatch]);

        const formatearFecha = (fecha) => {
        if (!fecha) return "";
        return new Date(fecha).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        });
    };

    const esVencida = (fechaLimite) => {
        return new Date(fechaLimite) < new Date();
    };

    const estadosMap = {
        pendiente: "Pendiente",
        en_progreso: "En progreso",
        completada: "Completada",
    };

    const prioridadesMap = {
        baja: "Baja",
        media: "Media",
        alta: "Alta",
    };

    const tareasFiltradas = tareas
        // Si NO es admin, solo mostrar tareas asignadas a él
        .filter((t) => {
            if (esAdmin) {
                return true; // Admin ve todas las tareas
            }
            // Usuario común solo ve sus tareas asignadas

            console.log("Usuario actual ID:", usuarioActual?.id);
        console.log("Tarea asignada a ID:", t.usuario_asignado?.id);
        console.log("¿Coincide?:", t.usuario_asignado?.id === usuarioActual?.id);
            return t.usuario_asignado?.id === usuarioActual?.id;
        })

        .filter((t) =>
            t.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
            t.descripcion.toLowerCase().includes(busqueda.toLowerCase())
        )
        .filter((t) => (filtro.estado ? t.estado === filtro.estado : true))
        .filter((t) =>
        filtro.prioridad ? t.prioridad === filtro.prioridad : true
        )
        .filter((t) =>
        filtro.usuario_asignado
            ? t.usuario_asignado?.id === filtro.usuario_asignado
            : true
        );

    return (
        <div className={styles.container}>
        
        <h1 className={styles.title}>Dashboard</h1>
{esAdmin && (
    <div className={styles.actions}>
            <Link to="/crear">
                <button className={styles.button}>Crear</button>
            </Link>
            <Link to="/modificar">
                <button className={styles.button}>Modificar</button>
            </Link>
        </div>
)}

    {!esAdmin && (
                <div className={styles.infoBox}>
                    <p>Aquí puedes ver las tareas que te han sido asignadas</p>
                </div>
            )}


        <input
            className={styles.busqueda}
            type="text"
            placeholder="Buscar por título o descripción"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
        />

        
        <div className={styles.filtros}>
            <select
            value={filtro.estado}
            onChange={(e) => setFiltro({ ...filtro, estado: e.target.value })}
            >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_progreso">En progreso</option>
            <option value="completada">Completada</option>
            </select>

            <select
            value={filtro.prioridad}
            onChange={(e) => setFiltro({ ...filtro, prioridad: e.target.value })}
            >
            <option value="">Todas las prioridades</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            </select>
            
            
            <select
            value={filtro.usuario_asignado}
            onChange={(e) => setFiltro({ ...filtro, usuario_asignado: e.target.value })}
            >
            <option value="">Todos los usuarios</option>
            {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                {u.nombre}
                </option>
            ))}
            </select>

        </div>

        <div className={styles.listaTareas}>
            {tareasFiltradas.length === 0 ? (
                    <div className={styles.sinTareas}>
                        <p>
                            {esAdmin
                                ? "No hay tareas que coincidan con los filtros"
                                : "No tienes tareas asignadas"}
                        </p>
                    </div>
                ) : (
                    tareasFiltradas.map((tarea) => (
                        <div
                            key={tarea.id}
                            className={`${styles.tarea} ${
                                esVencida(tarea.fecha_limite) ? styles.vencida : ""
                            }`}
                        >
                <h3>{tarea.titulo}</h3>
                            <p>{tarea.descripcion}</p>
                            <p>Estado: {estadosMap[tarea.estado]}</p>
                            <p>Prioridad: {prioridadesMap[tarea.prioridad]}</p>
                            {esAdmin && (
                                <p>
                                    Asignado a:{" "}
                                    {tarea.usuario_asignado?.nombre || "Sin asignar"}
                                </p>
                            )}
                            <p>Fecha límite: {formatearFecha(tarea.fecha_limite)}</p>
                        </div>
                    ))
                )}
            </div>

        <Link to="/">
                <button className={styles.button}>Salir</button>
            </Link>
        </div>
    );
    };

export default Dashboard;

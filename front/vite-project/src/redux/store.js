import { configureStore } from "@reduxjs/toolkit";
import usuarioReducer from "./usuarioReducer";           
import tareasReducer from "./tareasReducer";   
import categoriasReducer from "./categoriasReducer"; 

const store = configureStore({
    reducer: {
        usuario: usuarioReducer,         
        tareas: tareasReducer, 
        categorias: categoriasReducer 
    }
})

export default store;
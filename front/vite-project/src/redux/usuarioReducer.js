import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    login: false, //Representa el estado de la sesión
    usuario: null, //Guarda el usuario actual
    token: null,
    lista:[]
}

export const usuarioSlice = createSlice({
    name: "usuario",
    initialState,
    reducers: {
            login: (state, action) => {
                state.login = true; 
                state.usuario = action.payload.usuario;
                state.token = action.payload.token;
        },

        logout: (state) => {
            state.login = false,
            state.usuario = null  
    },  
    setUsuarios: (state, action) => {
        state.lista = action.payload;
    }


    },
});       

export const { login, logout, setUsuarios} = usuarioSlice.actions
export default usuarioSlice.reducer;
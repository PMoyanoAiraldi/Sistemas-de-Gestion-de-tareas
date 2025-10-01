import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    tareas: [],
    loading: false,
    error: null
};

export const tareasSlice = createSlice({
    name: "tareas",
    initialState,
    reducers: {
        setTareas: (state, action) => {
                state.tareas =  action.payload;
            },
        addTareas: (state, action) => {
            state.tareas.push(action.payload);
        },
        updateTareas: (state, action) => {
            const index = state.tareas.findIndex(p => p.id === action.payload.id);
            if (index !== -1) {
                state.tareas[index] = action.payload;
            }
        },
        deleteTareas: (state, action) => {
            state.tareas = state.tareas.filter(p => p.id !== action.payload);
        },
        toggleTareasState: (state, action) => {
            const tarea = state.tareas.find(p => p.id === action.payload);
            if (tarea) {
                tarea.state = !tarea.state;
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    },
    
});

export const { setTareas, 
    addTareas, 
    updateTareas, 
    deleteTareas, 
    toggleTareasState,
    setLoading,
    setError  } = tareasSlice.actions;
    
export default tareasSlice.reducer;
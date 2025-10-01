import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    categorias: [],
    loading: false,
    error: null
};

export const categoriasSlice = createSlice({
    name: "categorias",
    initialState,
    reducers: {
        setCategorias: (state, action) => {
            state.categorias = action.payload;
        },
        addCategoria: (state, action) => {
            state.categorias.push(action.payload);
        },
        updateCategoria: (state, action) => {
            const index = state.categorias.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.categorias[index] = action.payload;
            }
        },
        deleteCategoria: (state, action) => {
            state.categorias = state.categorias.filter(c => c.id !== action.payload);
        },
        setCategoriasLoading: (state, action) => {
            state.loading = action.payload;
        },
        setCategoriasError: (state, action) => {
            state.error = action.payload;
        }
    },
    
});

export const { setCategorias, 
    addCategoria, 
    updateCategoria, 
    deleteCategoria,
    setCategoriasLoading,
    setCategoriasError  } = categoriasSlice.actions;
export default categoriasSlice.reducer;
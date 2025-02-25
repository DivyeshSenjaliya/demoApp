import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from '../types/Types';

interface ProductState {
  products: Product;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products:null,
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, thunkAPI) => {
    try {
      const response = await fetch('https://fakestoreapi.com/products', { signal: thunkAPI.signal });
      if (!response.ok) {
        return thunkAPI.rejectWithValue({ status: response.status, message: response.statusText });
      }
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return thunkAPI.rejectWithValue('Request Aborted');
      }
      return thunkAPI.rejectWithValue('An error occurred');
    }
  }
);

const ProductSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default ProductSlice.reducer;

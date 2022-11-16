import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllProducts = createAsyncThunk("fetchProducts", async () => {
  const { data } = await axios.get(`/api/products`);
  return data;
});

const allProductsSlice = createSlice({
  name: "allProducts",
  initialState: {
    products: [],
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});

export default allProductsSlice.reducer;

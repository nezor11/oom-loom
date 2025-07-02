// src/features/oompas/oompasSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Oompa {
  id: number;
  first_name: string;
  last_name: string;
  profession: string;
  image: string;
}

interface FetchOompasResponse {
  results: Oompa[];
}

interface OompaState {
  list: Oompa[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  page: number;
  hasMore: boolean;
  lastFetchedAt: number | null;
}

const initialState: OompaState = {
  list: [],
  status: 'idle',
  page: 0,
  hasMore: true,
  lastFetchedAt: null,
};

export const fetchOompas = createAsyncThunk(
  'oompas/fetchOompas',
  async (page: number) => {
    const response = await axios.get<FetchOompasResponse>(
      `https://2q2woep105.execute-api.eu-west-1.amazonaws.com/napptilus/oompa-loompas?page=${page}`
    );
    return { results: response.data.results, page };
  }
);

const oompasSlice = createSlice({
  name: 'oompas',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOompas.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchOompas.fulfilled,
        (state, action: PayloadAction<{ results: Oompa[]; page: number }>) => {
          state.status = 'succeeded';
          const { results, page } = action.payload;
          const newItems = results.filter(
            (item) => !state.list.some((existing) => existing.id === item.id)
          );
          state.list = page === 1 ? results : [...state.list, ...newItems];
          state.page = page;
          state.hasMore = results.length > 0;
      
          if (page === 1) {
            state.lastFetchedAt = Date.now(); // <--- NUEVO
          }
        }
      )
      .addCase(fetchOompas.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default oompasSlice.reducer;
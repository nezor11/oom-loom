// src/features/oompaDetail/oompaDetailSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface OompaDetail {
  id: number;
  first_name: string;
  last_name: string;
  profession: string;
  gender: string;
  description: string;
  image: string;
}

interface DetailState {
  data: Record<number, { item: OompaDetail; fetchedAt: number }>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialDetailState: DetailState = {
  data: {},
  status: 'idle',
};

export const fetchOompaDetail = createAsyncThunk(
  'oompaDetail/fetchOompaDetail',
  async (id: string, { getState }) => {
    const state = getState() as { oompaDetail: DetailState };
    const numericId = Number(id);
    const cached = state.oompaDetail.data[numericId];
    const cacheTTL = 60 * 60 * 1000; // 1 hora

    if (cached && Date.now() - cached.fetchedAt < cacheTTL) {
      console.log(`[OOMPA DETAIL] Usando caché para ID ${id}`);
      return cached.item;
    }

    console.log(`[OOMPA DETAIL] Fetching desde API para ID ${id}`);
    const response = await axios.get<OompaDetail>(
      `https://2q2woep105.execute-api.eu-west-1.amazonaws.com/napptilus/oompa-loompas/${id}`
    );
    return { ...response.data, id: numericId } as OompaDetail;
  }
);

const oompaDetailSlice = createSlice({
  name: 'oompaDetail',
  initialState: initialDetailState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOompaDetail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOompaDetail.fulfilled, (state, action: PayloadAction<OompaDetail>) => {
        state.status = 'succeeded';
        const id = action.payload.id;
        state.data[id] = {
          item: action.payload,
          fetchedAt: Date.now(),
        };
      })
      .addCase(fetchOompaDetail.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default oompaDetailSlice.reducer;

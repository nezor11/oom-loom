// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import oompasReducer from '../features/oompas/oompasSlice';
import oompaDetailReducer from '../features/oompaDetail/oompaDetailSlice';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  oompas: oompasReducer,
  oompaDetail: oompaDetailReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['oompas', 'oompaDetail'], // Solo persistimos estos
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Evitamos advertencias relacionadas con redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

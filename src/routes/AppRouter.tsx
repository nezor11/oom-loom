// src/routes/AppRouter.tsx
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Detail from '../pages/Detail';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path=":id" element={<Detail />} />
    </Routes>
  );
}
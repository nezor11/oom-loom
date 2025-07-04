// src/pages/Detail.tsx
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchOompaDetail } from '../features/oompaDetail/oompaDetailSlice';
import ConsolePanel from '../components/ConsolePanel';

export default function Detail() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const numericId = Number(id);
  const detailEntry = useAppSelector((state) => state.oompaDetail.data[numericId]);
  const status = useAppSelector((state) => state.oompaDetail.status);
  const fetchedAt = useAppSelector((state) => state.oompaDetail.data[numericId]?.fetchedAt);

  useEffect(() => {
    if (!id) return;

    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (fetchedAt && now - fetchedAt < oneDay) {
      console.log(`🟢 Oompa ${id} cargado desde caché (última vez: ${new Date(fetchedAt).toLocaleString()})`);
    } else {
      console.log(`🔵 Oompa ${id} no está en caché o ha expirado. Solicitando...`);
      dispatch(fetchOompaDetail(id));
    }
  }, [dispatch, id, fetchedAt]);

  if (!detailEntry?.item || status === 'loading') {
    return (
      <div className="text-center py-10 text-blue-600 text-lg font-medium">
        Cargando...
      </div>
    );
  }

  const { item } = detailEntry;

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white p-6 rounded-xl shadow-lg">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-500 hover:underline"
      >
        &larr; Volver
      </button>
      <div className="flex flex-col items-center text-center">
        <img
          src={item.image}
          alt={item.first_name}
          className="w-32 h-32 rounded-full object-cover mb-4 shadow"
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {item.first_name} {item.last_name}
        </h1>
        <p className="text-gray-600 text-sm italic mb-1">
          {item.profession}
        </p>
        <p className="text-gray-500 text-sm mb-4">
          Género: {item.gender}
        </p>
        <div
          className="text-gray-700 text-left leading-relaxed mt-4"
          dangerouslySetInnerHTML={{ __html: item.description }}
        />
      </div>
      <ConsolePanel />
    </div>
  );
}

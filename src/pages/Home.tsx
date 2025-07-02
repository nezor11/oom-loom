// src/pages/Home.tsx
import { useEffect, useRef, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchOompas } from '../features/oompas/oompasSlice';
import { useDebounce } from 'use-debounce';

export default function Home() {
  const dispatch = useAppDispatch();
  const list = useAppSelector((state) => state.oompas.list);
  const status = useAppSelector((state) => state.oompas.status);
  const page = useAppSelector((state) => state.oompas.page);
  const hasMore = useAppSelector((state) => state.oompas.hasMore);
  const fetchedAt = useAppSelector((state) => state.oompas.lastFetchedAt); // desde Redux
  const observerRef = useRef<HTMLDivElement | null>(null);

  const [nameFilter, setNameFilter] = useState('');
  const [professionFilter, setProfessionFilter] = useState('');
  const [debouncedName] = useDebounce(nameFilter, 500);
  const [debouncedProfession] = useDebounce(professionFilter, 500);

  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q');
  const query = typeof queryParam === 'string' ? queryParam.trim() : '';

  useEffect(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const isFresh = fetchedAt && now - fetchedAt < oneDay;

    if (isFresh) {
      console.log(`🟢 Lista cargada desde caché (última vez: ${new Date(fetchedAt).toLocaleString()})`);
    } else {
      console.log('🔵 No hay caché reciente de la lista. Solicitando página 1...');
      dispatch(fetchOompas(1));
    }
  }, [dispatch, fetchedAt]);

  useEffect(() => {
    if (!observerRef.current || status === 'loading') return;
    if (debouncedName || debouncedProfession || query) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && status === 'succeeded') {
        dispatch(fetchOompas(page + 1));
      }
    });

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [dispatch, page, hasMore, status, debouncedName, debouncedProfession, query]);

  const filteredList = useMemo(() => {
    const normalizedQuery = query.toLowerCase();

    return list.filter((oompa) => {
      const fullName = `${oompa.first_name ?? ''} ${oompa.last_name ?? ''}`.toLowerCase();
      const profession = oompa.profession?.toLowerCase() ?? '';

      const nameMatch = fullName.includes(debouncedName.toLowerCase());
      const professionMatch = profession.includes(debouncedProfession.toLowerCase());
      const queryMatch =
        !debouncedName && !debouncedProfession && query
          ? fullName.includes(normalizedQuery) || profession.includes(normalizedQuery)
          : true;

      return nameMatch && professionMatch && queryMatch;
    });
  }, [list, debouncedName, debouncedProfession, query]);

  // Logs de depuración
  console.log('➡️ FILTRO:', { debouncedName, debouncedProfession, query });
  console.log('➡️ LISTA ORIGINAL:', list);
  console.log('➡️ LISTA FILTRADA:', filteredList);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">Oompa Loompa List</h1>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Nombre con icono */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="border rounded p-2 pl-8 w-full bg-gray-100 text-gray-700"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
          <img
            src="https://s3.eu-central-1.amazonaws.com/napptilus/level-test/imgs/ic_search.png"
            alt="Buscar"
            className="absolute left-2 top-2.5 h-5 w-5 opacity-50"
          />
        </div>

        {/* Profesión */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por profesión..."
            className="border rounded p-2 pl-8 w-full bg-gray-100 text-gray-700"
            value={professionFilter}
            onChange={(e) => setProfessionFilter(e.target.value)}
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/10342/10342107.png"
            alt="Buscar"
            className="absolute left-2 top-2.5 h-5 w-5 opacity-50"
          />
        </div>
      </div>

      {/* Mensaje si no hay resultados */}
      {filteredList.length === 0 && (
        <p className="text-gray-500 text-center">No hay resultados para los filtros aplicados.</p>
      )}

      {/* Grid de cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredList.map((oompa) => (
          <Link
            to={`/${oompa.id}`}
            key={oompa.id}
            className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={oompa.image}
                alt={oompa.first_name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h2 className="font-semibold">
                  {oompa.first_name} {oompa.last_name}
                </h2>
                <p className="text-sm text-gray-600">{oompa.profession}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Carga más */}
      <div ref={observerRef} className="h-1" />
      {status === 'loading' && !debouncedName && !debouncedProfession && !query && (
        <p className="text-center mt-4 text-blue-500">Cargando más...</p>
      )}
    </div>
  );
}

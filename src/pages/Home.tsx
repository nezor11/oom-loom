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
  const fetchedAt = useAppSelector((state) => state.oompas.lastFetchedAt);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const [nameFilter, setNameFilter] = useState('');
  const [professionFilter, setProfessionFilter] = useState('');
  const [debouncedName] = useDebounce(nameFilter, 500);
  const [debouncedProfession] = useDebounce(professionFilter, 500);

  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q');
  const query = typeof queryParam === 'string' ? queryParam.trim() : '';

  const [logMessages, setLogMessages] = useState<string[]>([]);

  function log(...args: any[]) {
    console.log(...args);

    const isStyledLog = args.length > 1 && typeof args[0] === 'string' && args[0].startsWith('%c');
    if (isStyledLog) return; // ⛔ Ignorar logs estilizados del navegador

    const plainText = args
      .filter((arg) => typeof arg === 'string')
      .map((str) => str.replace(/%[csdifoO]/g, '').trim())
      .join(' ')
      .trim();

    if (plainText) {
      setLogMessages((prev) => [...prev, `[LOG] ${plainText}`]);
    }
  }

  useEffect(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const isFresh = fetchedAt && now - fetchedAt < oneDay;

    if (isFresh) {
      log(`🟢 Lista cargada desde caché (última vez: ${new Date(fetchedAt).toLocaleString()})`);
    } else {
      log('🔵 No hay caché reciente de la lista. Solicitando página 1...');
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

  // Nuevo efecto solo para loguear resultados
  useEffect(() => {
    log(`➡️ LISTA ORIGINAL: ${list.length}`);
    log(`➡️ LISTA FILTRADA: ${filteredList.length}`);
  }, [list.length, filteredList.length]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">Oompa Loompa List</h1>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
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

      {/* Resultado vacío */}
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

      {/* Scroll infinito */}
      <div ref={observerRef} className="h-1" />
      {status === 'loading' && !debouncedName && !debouncedProfession && !query && (
        <p className="text-center mt-4 text-blue-500">Cargando más...</p>
      )}

      {/* Consola visual */}
      {logMessages.length > 0 && (
        <div className="mt-10 bg-black text-green-400 text-sm p-4 rounded shadow-inner max-h-64 overflow-y-auto font-mono">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-white font-bold">🧪 Consola visual</h2>
            <button
              className="text-xs text-red-400 underline"
              onClick={() => setLogMessages([])}
            >
              Limpiar
            </button>
          </div>
          {logMessages.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}

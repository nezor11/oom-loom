import { AppRouter } from './routes/AppRouter';
import { Link } from 'react-router-dom';
import ConsoleOutput from './components/ConsoleOutput';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <header className="p-4 bg-white shadow-md flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src="https://s3.eu-central-1.amazonaws.com/napptilus/level-test/imgs/logo-umpa-loompa.png" alt="Logo Oompa Loompa" className="w-10 h-10" />
          <span className="text-xl font-bold text-gray-700">Oompa Loompas</span>
        </Link>
      </header>

      <main className="max-w-6xl w-full mx-auto p-4">
        <AppRouter />
        <ConsoleOutput />
      </main>
    </div>
  );
}

import PokemonList from '@/components/pokemon-list';
import SearchBar from '@/components/search-bar';
import CameraDetection from '@/components/camera-detection';
import { Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-red-500 to-red-600">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-300" />
            <h1 className="text-4xl font-bold text-white">Pokédex</h1>
            <Sparkles className="w-8 h-8 text-yellow-300" />
          </div>
          <p className="text-white/90 text-lg">
            Explore the world of Pokémon
          </p>
        </header>
        <SearchBar />
        <PokemonList />
        <CameraDetection />
      </div>
    </main>
  );
}
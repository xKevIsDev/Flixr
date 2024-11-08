import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Show } from './pages/Show';
import { Movie } from './pages/Movie';
import { CharacterProgress } from './pages/CharacterProgress';
import { Shows } from './pages/Shows';
import { Movies } from './pages/Movies';
import { Trending } from './pages/Trending';
import { Latest } from './pages/Latest';
import { TopRated } from './pages/TopRated';
import { Category } from './pages/Category';
import { Search } from './pages/Search';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/shows" element={<Shows />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/latest" element={<Latest />} />
          <Route path="/top-rated" element={<TopRated />} />
          <Route path="/category/:id" element={<Category />} />
          <Route path="/search" element={<Search />} />

          <Route path="/show/:id" element={<Show />} />
          <Route path="/movie/:id" element={<Movie />} />
          <Route path="/show/:id/character/:characterId" element={<CharacterProgress />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
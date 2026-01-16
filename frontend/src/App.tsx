import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Loader } from './components/Loader';
import './App.scss';

const HomePage = lazy(() => import('./pages/HomePage/index').then(module => ({ default: module.HomePage })));
const DetailPage = lazy(() => import('./pages/DetailPage/index').then(module => ({ default: module.DetailPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage/index').then(module => ({ default: module.NotFoundPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="app">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/country/:countryName" element={<DetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;

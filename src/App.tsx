import { Route, Routes } from 'react-router-dom';
import { Header } from '@/components/Header';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { SignUpPage } from '@/pages/SignUpPage';

export function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

import React from 'react';
import { MainLayout } from './layouts/MainLayout';
import { AppRouter } from './routers/AppRouter';
// import { AuthProvider } from './auth/AuthProvider'; // You can implement this later

export default function App() {
  return (
    // <AuthProvider>
      <MainLayout>
        <AppRouter />
      </MainLayout>
    // </AuthProvider>
  );
}
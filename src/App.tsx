import { Toaster } from "@/componentes/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import Home from '@/paginas/Home';
import Properties from '@/paginas/Properties';
import PropertyDetail from '@/paginas/PropertyDetail';
import AdminOverview from '@/paginas/admin/AdminOverview';
import AdminProperties from '@/paginas/admin/AdminProperties';
import AdminPartners from '@/paginas/admin/AdminPartners';
import AdminNews from '@/paginas/admin/AdminNews';
import Login from '@/paginas/Login';
import FormularioPretensao from '@/paginas/FormularioPretensao';
import News from '@/paginas/News';
import NewsDetail from '@/paginas/NewsDetail';
import AdminLeads from '@/paginas/admin/AdminLeads';
import AdminSettings from '@/paginas/admin/AdminSettings';
import AdminServices from '@/paginas/admin/AdminServices';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoadingAuth } = useAuth();
  if (isLoadingAuth) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AuthenticatedApp = () => {
  const { isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/imoveis" element={<Properties />} />
      <Route path="/imovel/:id" element={<PropertyDetail />} />
      <Route path="/imovel/:id/:slug" element={<PropertyDetail />} />
      <Route path="/noticias" element={<News />} />
      <Route path="/noticia/:slug" element={<NewsDetail />} />
      <Route path="/formulario" element={<FormularioPretensao />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<ProtectedRoute><AdminOverview /></ProtectedRoute>} />
      <Route path="/admin/imoveis" element={<ProtectedRoute><AdminProperties /></ProtectedRoute>} />
      <Route path="/admin/parceiros" element={<ProtectedRoute><AdminPartners /></ProtectedRoute>} />
      <Route path="/admin/noticias" element={<ProtectedRoute><AdminNews /></ProtectedRoute>} />
      <Route path="/admin/leads" element={<ProtectedRoute><AdminLeads /></ProtectedRoute>} />
      <Route path="/admin/servicos" element={<ProtectedRoute><AdminServices /></ProtectedRoute>} />
      <Route path="/admin/configuracoes" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Auth/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import UserList from './components/Users/UserList';
import UserForm from './components/Users/UserForm';
import Navbar from './components/UI/Navbar';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen">
          <div className="gradient-background fixed inset-0 z-[-1]"></div>
          <Navbar />
          <main>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/users" element={<UserList />} />
                <Route path="/edit-user/:id" element={<UserForm />} />
              </Route>
              
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RulesPage from './pages/RulesPage';
import Shop from './pages/Shop';
import Inventory from './pages/Inventory';
import { AuthProvider } from "./authentication/AuthContext";
import ProtectedRoute from "./authentication/ProtectedRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {

  return (
    <div>
    <Router>
      <AuthProvider>
        <div className="appContainer">
          <Routes>

          {/* Public route */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes (all others) */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rules"
              element={
                <ProtectedRoute>
                  <RulesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shop"
              element={
                <ProtectedRoute>
                  <Shop />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <Inventory />
                </ProtectedRoute>
              }
            />

          </Routes>
        </div>
      </AuthProvider>
    </Router>
    </div>
  )
}

export default App
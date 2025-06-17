import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RulesPage from './pages/RulesPage';
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

          </Routes>
        </div>
      </AuthProvider>
    </Router>
    </div>
  )
}

export default App


// import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import FooterComponent from './components/footer/FooterComponent';
// import ClaimRoutePage from './pages/forms/ClaimRoutePage';
// import UnclaimRoutePage from './pages/forms/UnclaimRoutePage';
// import ClaimBonusSitePage from './pages/forms/ClaimBonusSitePage';
// import ShareLocationPage from './pages/forms/ShareLocationPage';
// import DrawScrewYouCardPage from './pages/drawScrewYou/DrawScrewYouCardPage';
// import Error from './pages/Error';
// import Login from './aws/Login';
// import Home from './aws/Home';
// import store from './redux/store';
// import { Provider } from "react-redux";
// import MWDistanceSummary from './components/summaries/MWDistanceSummary';
// import JHDistanceSummary from './components/summaries/JHDistanceSummary';
// import WMDistanceSummary from './components/summaries/WMDistanceSummary';
// import RulesPage from './components/RulesPage';

// function App() {
//   return (
//     <Provider store={store}>
//     <Router>
//       <div className="appContainer">
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/home" element={<Home />} />
//           <Route path="/claimroute" element={<ClaimRoutePage />} />
//           <Route path="/unclaimroute" element={<UnclaimRoutePage />} />
//           <Route path="/claimbonussite" element={<ClaimBonusSitePage />} />
//           <Route path="/sharelocation" element={<ShareLocationPage />} />
//           <Route path="/drawscrewyoucard" element={<DrawScrewYouCardPage />} />
//           <Route path="/MWSummary" element={<MWDistanceSummary />} />
//           <Route path="/JHSummary" element={<JHDistanceSummary />} />
//           <Route path="/WMSummary" element={<WMDistanceSummary />} />
//           <Route path="/rules" element={<RulesPage />} />
//           <Route path="*" element={<Error />} />
//         </Routes>
//         <FooterComponent />
//       </div>
//     </Router>
//     </Provider>
//   );
// }

// export default App;
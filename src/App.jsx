import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Dashboard from "./assets/pages/dashboard/Dashboard";
import Match from "./assets/pages/match/Match";
import League from "./assets/pages/league/League";
import Player from "./assets/pages/player/Player";
import Login from "./assets/pages/login/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/matches" element={<Match />} />
        <Route path="/league" element={<League />} />
        <Route path="/players" element={<Player />} />
      </Routes>
    </Router>
  );
}

export default App;

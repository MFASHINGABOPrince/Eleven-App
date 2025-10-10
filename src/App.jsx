import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  return (
       <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
      </Router>
  )}

export default App;

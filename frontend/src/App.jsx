import {Routes,BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css'
import { LandingPage } from './pages/LandingPage.jsx';
import {Authentication} from './pages/Authentication.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import VideoMeetComponent from './pages/VideoMeet.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
      <Routes>
        {/* <Route path="/home" element={<home />} /> */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={< Authentication/>} />
        
            <Route path='/:url' element={<VideoMeetComponent />} />
        
        
      </Routes>
      </AuthProvider>
    </Router>
  )
}


  
export default App


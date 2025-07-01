import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css'
import { BrowserRouter } from 'react-router-dom';

// route
import MainRoutes from './routes/MainRoutes';

function App() {
  return (
    <BrowserRouter>
      <MainRoutes />
    </BrowserRouter>
  )
}

export default App;
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet
} from "react-router-dom";
import Auth0ProviderWithHistory from './auth/auth0-provider-with-history';
import ChartPage from './pages/chart/ChartPage';
import { MainNav } from './components/MainNav';

ReactDOM.render(
  <BrowserRouter>
    <Auth0ProviderWithHistory>
      <MainNav />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="charts" element={<ChartPage />} />
      </Routes>
      <Outlet />
    </Auth0ProviderWithHistory>
  </BrowserRouter>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import {createRoot} from 'react-dom/client'
import './index.css'
import {App} from "@/app/ui/App.tsx";
import {BrowserRouter} from "react-router/internal/react-server-client";


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)

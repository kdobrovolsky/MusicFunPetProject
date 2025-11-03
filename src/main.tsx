import {createRoot} from 'react-dom/client'
import './index.css'
import {App} from "@/app/ui/App/App.tsx";
import {BrowserRouter} from "react-router/internal/react-server-client";
import {store} from "@/app/model/store.ts";
import {Provider} from "react-redux";


createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>
)

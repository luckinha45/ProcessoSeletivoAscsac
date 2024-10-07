import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";

import App from './App.tsx'
import Campanha from './Campanha.tsx';

const router = createBrowserRouter([
{
	path: "/",
	element: <App/>,
},
{
	path: "/campanha",
	element: <Campanha/>,
},
]);

createRoot(document.getElementById('root')!).render(
<StrictMode>
    <RouterProvider router={router} />
</StrictMode>
)

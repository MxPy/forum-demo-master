import React from 'react';
import { ConfigProvider, theme } from 'antd';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LandingPage from './components/landing_page/LandingPage';
import "./App.css"
import Login from './components/login/Login';
import Language from './components/language/Language';
import Controller from './components/controller/Controller';
import Scale from './components/scale/LandingPage';
import LandingPageTet from './components/landing_page_tetris/LandingPage';

import { Unity, useUnityContext } from "react-unity-webgl";

const router = createBrowserRouter([
  {
    path: "/app",
    element: <LandingPage />,
  },
  {
    path: "/tet",
    element: <LandingPageTet />,
  },
  {
    path: "/scale",
    element: <Scale />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/language",
    element: <Language />,
  },
  {
    path: "/controller",
    element: <Controller />,
  }
]);

const App: React.FC = () => (
  
  <div className='w-[100vh] h-[100vh]'>
  <ConfigProvider
    theme={{
      // 1. Use dark algorithm
      algorithm: theme.lightAlgorithm,

    }}
  >
    <RouterProvider router={router} />
  </ConfigProvider>
  </div>
);

export default App;
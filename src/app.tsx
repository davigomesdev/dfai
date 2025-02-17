import React from 'react';

import { PageUrlEnum } from './enums/page-url.enum';

import { setupNavigate } from './utils/navigation.util';

import { Web3Modal } from './context/web3modal';
import { BrowserRouter, Route, Routes, Outlet, useNavigate } from 'react-router-dom';

import RootLayout from './app/layout';

import Home from './app/index';
import Pool from './app/pool';
import TopPositions from './app/top-positions';
import CreatePosition from './app/create-position';

const AppRoutes: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    setupNavigate(navigate);
  }, [navigate]);

  return (
    <Routes>
      <Route element={<Home />} path={PageUrlEnum.DEFAULT} />
      <Route element={<Home />} path={PageUrlEnum.HOME} />
      <Route
        element={
          <RootLayout>
            <Outlet />
          </RootLayout>
        }
      >
        <Route element={<Pool />} path={`${PageUrlEnum.POOL}/:id`} />
        <Route element={<TopPositions />} path={PageUrlEnum.TOP_POSITIONS} />
        <Route element={<CreatePosition />} path={PageUrlEnum.CREATE_POSITION} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Web3Modal>
        <AppRoutes />
      </Web3Modal>
    </BrowserRouter>
  );
};

export default App;

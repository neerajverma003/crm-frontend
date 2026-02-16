// src/routing/AdminRoutes.js
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CSpinner } from '@coreui/react';
import routes from '../../routes/routes_admin';

const AdminRoutes = () => {
  return (
    <Suspense fallback={<CSpinner color="primary" />}>
      <Routes>
        {routes.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={<route.element />}
          />
        ))}
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
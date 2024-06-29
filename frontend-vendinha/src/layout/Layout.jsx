import React from 'react';
import { RenderComponent } from 'simple-react-routing';
import Sidebar from './Sidebar';

function Layout() {
  return (
    <>
      <Sidebar />
      <RenderComponent />
    </>
  );
}

export default Layout;

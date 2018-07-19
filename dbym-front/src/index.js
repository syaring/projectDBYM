import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App/App';

import './index.css';

ReactDOM.render(
  <BrowserRouter>
    <App title="Distance Between You and Me" />
  </BrowserRouter>,
  document.getElementById('root')
);

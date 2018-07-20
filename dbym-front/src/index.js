import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import App from './components/App/App';

import './index.css';

ReactDOM.render(
  <HashRouter>
    <App title="Distance Between You and Me" />
  </HashRouter>,
  document.getElementById('root')
);

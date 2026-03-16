import React from 'react';
import ReactDOM from 'react-dom/client';
import { PlaygroundApp } from './PlaygroundApp';
import './styles.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Playground root element was not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <PlaygroundApp />
  </React.StrictMode>,
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';

import LandingPage from './routes/LandingPage';
import ErrorPage from './routes/ErrorPage';
import Trip from './routes/Trip';
import Outing from './routes/Outing';
import ExistingPlan from './routes/ExistingPlan';
import store from './store';

// const router = createBrowserRouter([
// 	{
// 		path: '/',
// 		element: <LandingPage />,
// 		errorElement: <ErrorPage />,
// 		children: [
// 			// {
// 			// 	path: 'create-trip',
// 			// 	element: <Trip />,
// 			// 	errorElement: <ErrorPage />,
// 			// },
// 			// {
// 			// 	path: '/create-outing',
// 			// 	element: <Outing />,
// 			// 	errorElement: <ErrorPage />,
// 			// },
// 			// {
// 			// 	path: '/join-existing-plan-URLHERE',
// 			// 	element: <ExistingPlan />,
// 			// 	errorElement: <ErrorPage />,
// 			// },
// 		], // TODO: Add routes for supported pages here
// 	},
// ]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/Trip" element={<Trip />} />
          <Route exact path="/Outing" element={<Outing />} />
          <Route exact path="/ExistingPlan" element={<ExistingPlan />} />
        </Routes>
      </BrowserRouter>
    </Provider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

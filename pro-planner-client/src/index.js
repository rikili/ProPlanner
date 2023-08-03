import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

import CreatorPage from './routes/CreatorPage';
import LandingPage from './routes/LandingPage';
import SchedulePage from './routes/SchedulePage';
import VotePage from './routes/VotePage';
import CostPage from './routes/CostPage';
import ErrorPage from './routes/ErrorPage';
import store from './store';
import HomePage from './routes/HomePage';
import UserSelectionPage from './routes/UserSelectionPage';
import './index.scss';
import WrapperPage from './routes/WrapperPage';
import OverviewPage from "./routes/OverviewPage";

const router = createBrowserRouter([
    {
        path: '/',
        element: <WrapperPage />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: <LandingPage />,
                errorElement: <ErrorPage />,
            },
            {
                path: 'create',
                element: <CreatorPage />,
                errorElement: <ErrorPage />,
            },
            {
                path: 'user/:tripId',
                loader: ({ params }) => params.tripId,
                element: <UserSelectionPage />,
                errorElement: <ErrorPage />,
            },
            {
                path: '/:tripId',
                loader: ({ params }) => params.tripId, // TODO: can be made to cause an API call to fetch ID, passing it for now
                element: <HomePage />,
                errorElement: <ErrorPage />,
                children: [
                    {
                        path: '',
                        element: <SchedulePage />
                    },
                    {
                        path: 'overview',
                        element: <OverviewPage />
                    },
                    {
                        path: 'vote',
                        element: <VotePage />
                    },
                    {
                        path: 'cost',
                        element: <CostPage />
                    },
                ]
            }
        ]
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

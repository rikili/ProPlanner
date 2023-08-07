import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom';
import { Provider } from 'react-redux';

import CreatorPage from './routes/CreatorPage';
import LandingPage from './routes/LandingPage';
import SchedulePage from './routes/SchedulePage';
import VotePage from './routes/VotePage';
import CostPage from './routes/CostPage';
import ErrorPage from './routes/ErrorPage';
import store from './store';
import HomePage from './routes/HomePage';
import UserSelectionPage from './routes/UserSelectionPage';
import EditPage from './routes/EditPage';
import WrapperPage from './routes/WrapperPage';
import OverviewPage from './routes/OverviewPage';
import './index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

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
                loader: ({ params }) => params.tripId,
                element: <HomePage />,
                errorElement: <ErrorPage />,
                children: [
                    {
                        path: '',
                        element: <OverviewPage />,
                    },
                    {
                        path: 'schedule',
                        element: <SchedulePage />,
                    },
                    {
                        path: 'vote',
                        element: <VotePage />,
                    },
                    {
                        path: 'cost',
                        element: <CostPage />,
                    },
                    {
                        path: 'edit',
                        element: <EditPage />,
                    },
                ],
            },
            {
                path: '/:tridId/',
                element: redirect('..'),
            },
        ],
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);

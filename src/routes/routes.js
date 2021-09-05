import React from 'react';
import App from '../App';

export default [
    {
        path: "/",
        exact: true,
        component: App,
    },
    {
        path: "/test",
        render: () => <h1>About</h1>
    }
];

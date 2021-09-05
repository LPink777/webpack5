import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import renderRoutes from "./routes/renderRoutes";
import routes from './routes/routes';

import './index.less';

const render = () => {
    ReactDom.render(
        <Router>
            {/* 导航栏 */}
            {renderRoutes(routes)}
        </Router>,
        document.querySelector('#root')
    );
}

render();

/** 热更新 */
if (module.hot) {
    module.hot.accept();
}

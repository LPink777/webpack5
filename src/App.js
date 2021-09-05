import React from 'react';
import Img from './assets/img/img.jpeg';
import Svg from './assets/svg/logo.svg'

import './index.less';

function App() {
    return (
        <div className="app">
            app
            <img src={Img} />
            <img src={Svg} />
        </div>
    )
}

export default App;
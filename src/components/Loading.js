import * as React from 'react';

import loading from '../images/basicloader.gif';
import '../styles/pages/orphanage.css';

export const Loading = () => {
    return (
        <div id="loadingImg">
            <img src={loading}/>
        </div>
    );
};


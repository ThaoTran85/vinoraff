import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
function spin(props) {
    return (
        <div
            style={{
                textAlign: 'center',
                paddingTop: '10%',
                opacity: '0.5',
                height: '100vh',
                filter: 'alpha(opacity=50)',
            }}
        >
            <Spin indicator={antIcon} tip="Đang tải..." />
        </div>
    );
}

export default spin;

import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';

require('./LoadingView.less');

const LoadingView = () => {
  return (
    <div
      className="FullSizeLoader"
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        margin: 'auto',
      }}
    >
      <div className="LoadingSpinner">
        <LoadingOutlined spin />
      </div>
    </div>
  );
};

export default LoadingView;

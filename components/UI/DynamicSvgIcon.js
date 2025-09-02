import React from 'react';

const DynamicSvgIcon = ({ Icon, color = '#000', size = 24 }) => {
  return <Icon width={size} height={size} fill={color} />;
};

export default DynamicSvgIcon;
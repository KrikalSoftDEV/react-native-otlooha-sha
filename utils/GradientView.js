import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

const GradientView = ({ text, fontSize = 16, fontWeight = '700', width = 300, height = 40 ,gradData,color1="#191967",color2="#7A78DD"}) => {


  return (
    <Svg height={height} width={width}>
      <Defs>
        <LinearGradient id="grad" {...gradData}>
          <Stop offset="0" stopColor={color1} />
          <Stop offset="1" stopColor={color2} />
        </LinearGradient>
      </Defs>
      <SvgText
        fill="url(#grad)"
        fontSize={fontSize}
        fontWeight={fontWeight}
        x="50%"
        y="50%"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {text}
      </SvgText>
    </Svg>
  );
};

export default GradientView;
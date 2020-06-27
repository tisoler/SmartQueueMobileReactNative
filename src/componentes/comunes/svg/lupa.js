// @flow
import * as React from 'react';
import { useContext } from 'react';
import { Svg, Path } from 'react-native-svg';
import { ContextoEstilosGlobales } from '../../../lib/contextoEstilosGlobales';

type Props = {
  width?: number,
  height?: number
}

export default (props: Props) => {
  const {
    height = 40, width = 40
  } = props;
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);

  return (
    <Svg viewBox="0 0 512 512" width={width} height={height} fill={estilosGlobales.colorIconos}>
      <Path d="M430.827,86.605c-49.161-51.53-124.712-59.44-180.6-28.393c-4.829,2.682-6.568,8.772-3.886,13.6    c2.682,4.83,8.772,6.567,13.6,3.886c51.118-28.401,115.436-18.236,156.371,24.671c42.236,44.811,46.992,111.607,14.317,161.128    c-45.008,68.362-142.217,78.664-200.5,20.37c-39.273-39.259-50.651-102.572-22.282-154.093c2.662-4.84,0.897-10.922-3.942-13.584    c-4.839-2.66-10.92-0.897-13.584,3.942c-0.613,1.115-1.703,3.193-2.754,5.324h0.001c-29.088,59.294-15.854,128.301,28.418,172.556    c67.148,67.162,179.31,55.53,231.345-23.507C484.648,215.946,480.07,138.85,430.827,86.605z" />
      <Path d="M456.438,55.562c-74.091-74.081-194.651-74.084-268.745,0.001c-66.628,66.638-73.801,171.115-19.542,245.856    l-31.167,31.16c-10.927-5.23-24.745-3.542-34.155,5.869L14.667,426.62c-19.547,19.534-19.563,51.168-0.005,70.713    c19.539,19.552,51.172,19.56,70.715,0.002l88.175-88.164c9.406-9.408,11.1-23.226,5.868-34.154l31.163-31.17    c74.758,54.271,179.227,47.079,245.855-19.54C530.522,250.214,530.522,129.656,456.438,55.562z M159.407,395.027L71.23,483.193    c-11.719,11.728-30.689,11.739-42.424-0.005c-11.73-11.721-11.737-30.691,0.002-42.422l88.164-88.174    c3.897-3.898,10.242-3.9,14.139,0l28.295,28.295C163.306,384.785,163.306,391.129,159.407,395.027z M166.479,359.67    l-14.148-14.148l28.481-28.474c2.234,2.479,4.529,4.909,6.88,7.259c2.351,2.351,4.78,4.647,7.261,6.882L166.479,359.67z     M442.293,310.163c-66.277,66.267-173.635,66.831-240.458,0c-66.743-66.736-66.346-174.099,0-240.456    c66.289-66.28,174.158-66.291,240.457,0C508.577,136.001,508.577,243.87,442.293,310.163z" />
      <Path d="M230.37,84.108c-0.07-0.09-0.15-0.17-0.24-0.26c-3.911-3.901-10.242-3.901-14.152,0c-3.901,3.911-3.901,10.242,0,14.152    c0.09,0.09,0.17,0.17,0.26,0.25c3.931,3.651,10.072,3.561,13.892-0.25C233.94,94.179,234.03,88.038,230.37,84.108z" />
    </Svg>
  );
};

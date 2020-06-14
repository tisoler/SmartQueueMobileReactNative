
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
      <Path d="m467.746094 0h-423.496094c-24.398438 0-44.25 19.851562-44.25 44.253906v255.191406c0 24.402344 19.851562 44.253907 44.25 44.253907h423.496094c24.402344 0 44.253906-19.851563 44.253906-44.253907v-255.191406c0-24.402344-19.851562-44.253906-44.253906-44.253906zm29.046875 299.445312c0 16.015626-13.03125 29.046876-29.046875 29.046876h-423.496094c-16.011719 0-29.042969-13.03125-29.042969-29.046876v-255.191406c0-16.015625 13.03125-29.046875 29.042969-29.046875h423.496094c16.015625 0 29.046875 13.03125 29.046875 29.046875zm0 0" />
      <Path d="m227.613281 60.832031h-176.410156c-4.199219 0-7.605469 3.402344-7.605469 7.605469v18.246094c0 4.199218 3.40625 7.601562 7.605469 7.601562s7.605469-3.402344 7.605469-7.601562v-10.644532h161.203125v185.539063h-161.203125v-144.476563c0-4.199218-3.40625-7.605468-7.605469-7.605468s-7.605469 3.40625-7.605469 7.605468v152.078126c0 4.199218 3.40625 7.605468 7.605469 7.605468h176.410156c4.199219 0 7.605469-3.40625 7.605469-7.605468v-200.742188c0-4.203125-3.40625-7.605469-7.605469-7.605469zm0 0" />
      <Path d="m462.832031 78.464844h-190.605469c-4.199218 0-7.605468 3.40625-7.605468 7.605468 0 4.199219 3.40625 7.601563 7.605468 7.601563h190.605469c4.199219 0 7.601563-3.402344 7.601563-7.601563 0-4.199218-3.402344-7.605468-7.601563-7.605468zm0 0" />
      <Path d="m462.832031 133.625h-42.582031c-4.199219 0-7.601562 3.402344-7.601562 7.601562 0 4.199219 3.402343 7.605469 7.601562 7.605469h42.582031c4.199219 0 7.601563-3.40625 7.601563-7.605469 0-4.199218-3.402344-7.601562-7.601563-7.601562zm0 0" />
      <Path d="m272.226562 148.832031h117.605469c4.199219 0 7.605469-3.40625 7.605469-7.605469 0-4.199218-3.40625-7.601562-7.605469-7.601562h-117.605469c-4.199218 0-7.605468 3.402344-7.605468 7.601562 0 4.199219 3.40625 7.605469 7.605468 7.605469zm0 0" />
      <Path d="m462.832031 188.785156h-190.605469c-4.199218 0-7.605468 3.402344-7.605468 7.601563s3.40625 7.605469 7.605468 7.605469h190.605469c4.199219 0 7.601563-3.40625 7.601563-7.605469s-3.402344-7.601563-7.601563-7.601563zm0 0" />
      <Path d="m375.640625 243.945312h-103.414063c-4.199218 0-7.605468 3.402344-7.605468 7.601563s3.40625 7.605469 7.605468 7.605469h103.414063c4.199219 0 7.601563-3.40625 7.601563-7.605469s-3.402344-7.601563-7.601563-7.601563zm0 0" />
      <Path d="m86.179688 244.847656c0 4.199219 3.40625 7.601563 7.605468 7.601563 4.199219 0 7.605469-3.402344 7.605469-7.601563 0-20.964844 17.054687-38.019531 38.019531-38.019531s38.019532 17.054687 38.019532 38.019531c0 4.199219 3.402343 7.601563 7.601562 7.601563s7.605469-3.402344 7.605469-7.601563c0-19.34375-10.371094-36.304687-25.84375-45.625 15.472656-9.320312 25.84375-26.28125 25.84375-45.625 0-29.347656-23.878907-53.226562-53.226563-53.226562-29.351562 0-53.230468 23.878906-53.230468 53.226562 0 19.34375 10.375 36.304688 25.847656 45.625-15.472656 9.320313-25.847656 26.28125-25.847656 45.625zm15.210937-91.25c0-20.964844 17.054687-38.019531 38.019531-38.019531s38.019532 17.054687 38.019532 38.019531-17.054688 38.019532-38.019532 38.019532-38.019531-17.054688-38.019531-38.019532zm0 0" />
    </Svg>
  );
};

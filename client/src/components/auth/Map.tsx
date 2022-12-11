import React, { FC, useEffect } from 'react';
import styled from 'styled-components';

interface Props {
  searchName: string;
  activityName: string;
}
const Container = styled.div`
  aspect-ratio: 400/200;
  width: 100%;
  height: 100%;
`;
const Map: FC<Props> = ({ searchName, activityName }) => {
  useEffect(() => {
    console.log(searchName);
    const mapScript = document.createElement('script');
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_APPKEY}&autoload=false&libraries=services`;

    document.head.appendChild(mapScript);

    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 지도 중심 좌표
          level: 3, // 지도 확대 레벨
        };
        const map = new window.kakao.maps.Map(container, options);
        // const mapTypeControl = new window.kakao.maps.MapTypeControl();

        // 지도에 컨트롤을 추가.
        // map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

        const zoomControl = new window.kakao.maps.ZoomControl();
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(searchName || '경기 하남시 미사대로 750', (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

            const marker = new window.kakao.maps.Marker({
              map,
              position: coords,
            });

            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div style="width:150px;text-align:center;padding:6px 0;">${
                activityName || '하남 스타트필드'
              }</div>`,
            });

            infowindow.open(map, marker);
            marker.setMap(map);
          }
        });
      });
    };
    mapScript.addEventListener('load', onLoadKakaoMap);
    return () => mapScript.removeEventListener('load', onLoadKakaoMap);
  }, []);

  return (
    <div style={{ width: '100%', height: '65%' }}>
      <Container id="map" />
    </div>
  );
};

export default Map;

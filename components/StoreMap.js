'use client';

import { useEffect, useRef, useState } from 'react';

export default function StoreMap({ stores, selectedStore }) {
  const mapElement = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);

  // Check if SDK is loaded
  useEffect(() => {
    const checkSdk = () => {
      if (window.naver && window.naver.maps) {
        setIsSdkLoaded(true);
      } else {
        setTimeout(checkSdk, 100);
      }
    };
    checkSdk();
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!isSdkLoaded || !mapElement.current || mapInstance.current) return;

    const initialCenter = stores && stores.length > 0 && stores[0].lat && stores[0].lng
      ? new window.naver.maps.LatLng(parseFloat(stores[0].lat), parseFloat(stores[0].lng))
      : new window.naver.maps.LatLng(37.5665, 126.9780);

    const mapOptions = {
      center: initialCenter,
      zoom: 11,
      zoomControl: true,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT
      }
    };

    const map = new window.naver.maps.Map(mapElement.current, mapOptions);
    mapInstance.current = map;

    // Initialize InfoWindow
    infoWindowRef.current = new window.naver.maps.InfoWindow({
      maxWidth: 300,
      backgroundColor: "#fff",
      borderColor: "#eee",
      borderWidth: 1,
      anchorSize: new window.naver.maps.Size(10, 10),
      pixelOffset: new window.naver.maps.Point(0, -10)
    });

    // Handle initial resize
    window.naver.maps.Event.trigger(map, 'resize');
  }, [isSdkLoaded, stores]);

  // Update Markers
  useEffect(() => {
    if (!mapInstance.current || !isSdkLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Create new markers
    stores?.forEach(store => {
      if (!store.lat || !store.lng) return;

      const position = new window.naver.maps.LatLng(parseFloat(store.lat), parseFloat(store.lng));
      const marker = new window.naver.maps.Marker({
        position,
        map: mapInstance.current,
        title: store.name,
      });

      window.naver.maps.Event.addListener(marker, 'click', () => {
        const content = `
          <div style="padding: 12px; min-width: 150px;">
            <h3 style="margin: 0 0 6px 0; font-size: 15px; font-weight: bold; color: #111;">${store.name}</h3>
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #666; line-height: 1.4;">${store.address}</p>
            ${store.phone ? `<p style="margin: 0; font-size: 12px; color: #666;">📞 ${store.phone}</p>` : ''}
          </div>
        `;
        infoWindowRef.current.setContent(content);
        infoWindowRef.current.open(mapInstance.current, position);
        mapInstance.current.panTo(position);
      });

      markersRef.current.push(marker);
    });
  }, [stores, isSdkLoaded]);

  // Handle fly-to/selection
  useEffect(() => {
    if (mapInstance.current && selectedStore && selectedStore.lat && selectedStore.lng) {
      const destination = new window.naver.maps.LatLng(parseFloat(selectedStore.lat), parseFloat(selectedStore.lng));
      mapInstance.current.panTo(destination, { duration: 500 });
      
      const content = `
        <div style="padding: 12px; min-width: 150px;">
          <h3 style="margin: 0 0 6px 0; font-size: 15px; font-weight: bold; color: #111;">${selectedStore.name}</h3>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #666; line-height: 1.4;">${selectedStore.address}</p>
          ${selectedStore.phone ? `<p style="margin: 0; font-size: 12px; color: #666;">📞 ${selectedStore.phone}</p>` : ''}
        </div>
      `;
      infoWindowRef.current.setContent(content);
      infoWindowRef.current.open(mapInstance.current, destination);
    }
  }, [selectedStore]);

  return (
    <div ref={mapElement} style={{ width: '100%', height: '100%' }}>
      {!isSdkLoaded && (
        <div className="map-placeholder">
          <div className="map-placeholder-content">
            <p>지도를 불러오는 중...</p>
          </div>
        </div>
      )}
    </div>
  );
}

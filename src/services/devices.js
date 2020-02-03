import http from './http';
import { spotify } from '@config';

const endpointUrlMe = `${spotify.apiUrl}/me`;
const endpointUrlPlayer = `${endpointUrlMe}/player`;
const endpointUrlDevices = `${endpointUrlPlayer}/devices`;
const endpointUrlPlay = `${endpointUrlPlayer}/play`;
const endpointUrlRepeat = `${endpointUrlPlayer}/repeat`;
const endpointUrlGetTrack = `${spotify.apiUrl}/tracks`;

export const getDevices = () =>
  http.get(endpointUrlDevices).then(res => res.data.devices);

export const changeDevice = deviceId => {
  const payload = {
    device_ids: [deviceId],
    play: false,
  };
  return http.put(endpointUrlPlayer, payload);
};

export const playSong = song => http.put(endpointUrlPlay, song).then(() => {});

export const getTrack = id =>
  http.get(`${endpointUrlGetTrack}/${id}`).then(res => res.data);

export const disableRepeat = () =>
  http.put(`${endpointUrlRepeat}?state=off`).then(() => {});
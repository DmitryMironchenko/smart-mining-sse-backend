import _ from 'lodash';
import fs from 'fs-extra';
import rawRoute from './Game/npc/pedestrians/PedestrianRoute4.json';

export const fixRoute = (route, pointsAmount) => {
  const fixedStuff = [];

  route.forEach((point, index) => {
    fixedStuff.push(point);
    const nextPoint = route[index + 1];

    if (nextPoint) {
      const dLat = (nextPoint.lat - point.lat) / (pointsAmount + 1);
      const dLng = (nextPoint.lng - point.lng) / (pointsAmount + 1);
      const dTime = (nextPoint.time - point.time) / (pointsAmount + 1);

      _.times(pointsAmount, i => {
        const newPoint = {
          ...point,
          lat: point.lat + dLat * (i + 1),
          lng: point.lng + dLng * (i + 1),
          time: Math.round(point.time + dTime * (i + 1)),
        };

        fixedStuff.push(newPoint)
      });
    }
  });

  return fixedStuff;
};

fs.writeJSON('./Game/npc/pedestrians/PedestrianRoute4-fixed.json', fixRoute(rawRoute, 30));

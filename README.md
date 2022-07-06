# GeoAR.js

une application qui permet de visualiser l'environnement de chaque établissement de l’Université de Lorraine pour une visite virtuelle où des points d’intérêts et les objets virtuels sont ajoutés à différentes scènes.

## Tâches à faire
- Installation hors-ligne de PWA
- API nodejs
- Optimisation temps de charge radar
- Sans cursor, cliquant directement sur l’objet
- Add UX/UI and messages when GPS data is not available or there's very poor signal (using a property)
- Added an alert message when geolocation is switched off (from Phone Settings or permission not granted) also handled with alerts the [iOS 12 motion sensors permissions problem](https://www.macrumors.com/2019/02/04/ios-12-2-safari-motion-orientation-access-toggle/)


## Components utilisés

### `gps-camera`

**Required**: yes  
**Max allowed per scene**: 1

This component enables the Location AR. It has to be added to the `camera` entity.
It makes possible to handle both position and rotation of the camera and it's used to determine where the user is pointing their device.

For example:

```HTML
<a-camera gps-camera rotation-reader></a-camera>
```

In addition to that, as you can see on the example above, we also have to add `rotation-reader` to handle rotation events. See [here](https://aframe.io/docs/0.9.0/components/camera.html#reading-position-or-rotation-of-the-camera) for more details.


### Properties

| Property   | Description | Default Value |
|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| alert     | Whether to show a message when GPS signal is under the `positionMinAccuracy`                  | false |                                                                                                                                                                        | true          |
| positionMinAccuracy        | Minimum accuracy allowed for position signal    | 100 |
| minDistance        | If set, places with a distance from the user lower than this value, are not showed. Only a positive value is allowed. Value is in meters.    | 0 (disabled) |

### `gps-entity-place`

**Required**: yes  
**Max allowed per scene**: no limit

This component makes every entity GPS-trackable. It assignes a specific world position to the entity, so the user can see it when their phone is pointing to its position in the real world. If user is far from the entity, their will see it smaller. If it is too far, their will not see it at all.

It requires latitude and longitude as a single string parameter (example with `a-image` aframe primitive):

```HTML
<a-image color="yellow" gps-entity-place="latitude: <your-latitude>; longitude: <your-longitude>"/>
```
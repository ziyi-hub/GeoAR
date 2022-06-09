# GeoAR.js

To better introduce this library I wrote an [article on Medium](https://medium.com/chialab-open-source/location-based-gps-augmented-reality-on-the-web-7a540c515b3c). You can start from it.

## Components

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

It requires latitude and longitude as a single string parameter (example with `a-box` aframe primitive):

```HTML
<a-box color="yellow" gps-entity-place="latitude: <your-latitude>; longitude: <your-longitude>"/>
```
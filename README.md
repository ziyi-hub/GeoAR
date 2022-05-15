# GeoAR.js

To better introduce this library I wrote an [article on Medium](https://medium.com/chialab-open-source/location-based-gps-augmented-reality-on-the-web-7a540c515b3c). You can start from it.

## Components

>Work In Progress

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

### `gps-camera-debug`

**Required**: no  
**Max allowed per scene**: 1

This component has to be added only in development environments, not production ones.
It shows a debug UI with camera informations and a list of registered `gps-entity-place` entities, showing also distance from the user for each one.

It has to be added to the `a-scene`:

```HTML
<a-scene gps-camera-debug embedded arjs='sourceType: webcam; debugUIEnabled: false;'></a-scene>
```

## Support

Tried on Huawei P20, works like charm.

Works good also on iPhone 6.

On iOS, from 12.2, Motion sensors on Safari has be to activated from Settings. If not, GeoAR.js will prompt the user to do so.
This [may change with final release of iOS 13](https://developer.apple.com/documentation/safari_release_notes/safari_13_beta_6_release_notes) but as September 2019 is not yet out.

We need a lot of more tests, but the first impression is: the more advanced the phone (so newer) the better. This because of better quality sensors.


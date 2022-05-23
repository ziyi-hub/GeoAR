function initialize()
{
    let mapProp = {
        center:new google.maps.LatLng(48.68663079063300, 6.1794564225121),
        zoom:12,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}


initialize();


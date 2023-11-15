var EPSG = (proj4.defs([
  [
    'EPSG:25830',
    '+proj=utm +zone=30 +ellps=GRS80 +units=m +no_defs'
  ],
  [
    'EPSG:25831',
    '+proj=utm +zone=31 +ellps=GRS80 +units=m +no_defs'
  ],
  [
      'EPSG:3034',
    '+proj=lcc +lat_1=35 +lat_2=65 +lat_0=52 +lon_0=10 +x_0=4000000 +y_0=2800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
  ],
    [
        'EPSG:3035','+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
    ]
    
]));

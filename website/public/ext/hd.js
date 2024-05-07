const controls = [
  'hdmodel',
  'hdspeed',
  'hdease',
  'hdfade',
  'hdthresh',
  'hdfadeease',
  'hdlength',
  'hdlen',
  'hdlenmul',
  'hdtrail',
  'hdorder',
  'hdhead',
  'hdlinked',
  'hdfrom',
  'hdminbri',
  'hdbrightness',
  'hdbehaviour',
  'hdemit',
  'hdoffset',
  'hdcolorchange',
  'hdcolor',
  'hdcolorsrc',
  'hdsustain',
  'hdon',
  'hdhue',
  'hdhuemul',
  'hdhueadd',
];

for (let i = 0; i < controls.length; i++) {
  registerControl(controls[i]);
}

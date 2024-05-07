const controls = [
  // mutable synths
  'timbre',
  'color',
  'model',
  'out_mode',
  'tidesshape',
  'tidessmooth',
  'slope',
  'shift',
  'engine',
  'harm',
  'morph',
  'level',
  'lpgdecay',
  'lpgcolour',
  // lpg d c = lpgdecay d # lpgcolour c
  'resamp',
  'bits',
  'ws',

  //mutable effects
  'cloudspitch',
  'cloudspos',
  'cloudssize',
  'cloudsdens',
  'cloudstex',
  'cloudswet',
  'cloudsgain',
  'cloudsspread',
  'cloudsrvb',
  'cloudsfb',
  'cloudsfreeze',
  'cloudsmode',
  'cloudslofi',
  // clouds p s d t = cloudsgain 1 # cloudspos p # cloudssize s # cloudsdens d # cloudstex t
  // cloudsblend w s f r = cloudsgain 1 # cloudswet w # cloudsspread s # cloudsfb f # cloudsrvb r
  // c = clouds
  // cb = cloudsblend
  'elementspitch',
  'elementsstrength',
  'elementscontour',
  'elementsbowlevel',
  'elementsblowlevel',
  'elementsstrikelevel',
  'elementsflow',
  'elementsmallet',
  'elementsbowtimb',
  'elementsblowtimb',
  'elementsstriketimb',
  'elementsgeom',
  'elementsbright',
  'elementsdamp',
  'elementspos',
  'elementsspace',
  'elementsmodel',
  'elementseasteregg',
  'mu',
  'ringsfreq',
  'ringsstruct',
  'ringsbright',
  'ringsdamp',
  'ringspos',
  'ringsmodel',
  'ringspoly',
  'ringsinternal',
  'ringseasteregg',
  // rings f s b d p = ringsfreq f # ringsstruct s # ringsbright b # ringsdamp d # ringspos p
  'ripplescf',
  'ripplesreson',
  'ripplesdrive',
  //ripples c r d = ripplescf c # ripplesreson r # ripplesdrive d
  'verbgain',
  'verbwet',
  'verbtime',
  'verbdamp',
  'verbhp',
  'verbfreeze',
  'verbdiff',
  // verb w t d h = verbgain 1 # verbwet w # verbtime t # verbdamp d # verbhp h
  // v = verb
  'warpsalgo',
  'warpstimb',
  'warpsosc',
  'warpsfreq',
  'warpsvgain',
  'warpseasteregg',

  // sc_grids
  'gridsinst',
  'gridsmin',
  'gridsdens',
  'gridsx',
  'gridsy',
  'gridsbias',
  'gridsscale',
];

for (let i = 0; i < controls.length; i++) {
  registerControl(controls[i]);
}

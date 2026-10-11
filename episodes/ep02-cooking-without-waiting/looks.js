/* colour grade and score cue per scene name. Looks: none, warm, teal, cold, noir, dawn (+ letterbox 0/1, handheld 0..1.4).
   Moods (series/music): none, suspense, night, tension, build, wonder, credits. Unlisted scenes keep the previous look. */
const SCENE_LOOK={'On the line':['warm',0,.5],'The same kitchen':['warm'],'Pages, one by one':['warm'],
  'Eight hatches':['cold'],"The Manager's guess":['warm'],'What if: a chef per page':['teal',0,1.1],
  'Pages 43 to 50':['dawn'],'The Runners':['dawn'],'Catching up':['dawn'],'The ticket rail':['cold'],'Recap':['dawn'],
  'Before he hangs up':['warm'],'Three orders':['warm'],'Based on a true story':['teal',1,.8],'One more thing':['dawn']};
const SCENE_MOOD={'Opening logo':'none','On the line':'suspense','The same kitchen':'night','Pages, one by one':'tension',
  'Eight hatches':'wonder',"The Manager's guess":'night','What if: a chef per page':'tension',
  'Pages 43 to 50':'build','The Runners':'build','Catching up':'build','The ticket rail':'wonder','Recap':'build',
  'Before he hangs up':'wonder','Three orders':'night','Based on a true story':'tension',
  'Who played whom':'credits','One more thing':'night','End slate':'none'};

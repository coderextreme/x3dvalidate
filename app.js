var validate = require('./x3dvalidate')

var files = [ "ball.json", "BasicPointSprites1.json", "BasicPointSprites2.json", "HAnimModelFootLeft.json", "HAnimModelFootRight.json", "HAnimModelHandLeft.json", "HAnimModelHandRight.json", "HAnimModelsHandsFeet.json", "HelloWorldProgramOutput.json", "KoreanCharacterMotionAnnexC01Jin.json", "KoreanCharacterMotionAnnexD01Jin.json", "flipper.json", 
"VolumeEmitter.json", "BoundedPhysicsModel.json" ];

validate("en", files);

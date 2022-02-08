var validate = require('./x3dvalidate')

var files = [ "ball.json", "BasicPointSprites1.json", "BasicPointSprites2.json", "HAnimModelFootLeft.json", "HAnimModelFootRight.json", "HAnimModelHandLeft.json", "HAnimModelHandRight.json", "HAnimModelsHandsFeet.json", "HelloWorldProgramOutput.json", "KoreanCharacterMotionAnnexC01Jin.json", "KoreanCharacterMotionAnnexD01Jin.json", "SplitChannels.json", "flipper.json"];

validate("en", files);

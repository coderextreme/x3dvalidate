#!/usr/bin/env node

var validate = require(__dirname+'/../src/index.js')

var files = [ "C:/x3d-code/www.web3d.org/x3d/content/examples/Basic/HumanoidAnimation/originals/LOA3ExampleSourceWithDiamondsOriginalBsContactExport.json", "C:/x3d-code/www.web3d.org/x3d/content/examples/Basic/LatticeXvl/javasrc/Lv_Java_v0_31/CodeBase/Demo/baby.json", "C:/x3d-code/www.web3d.org/x3d/content/examples/Basic/LatticeXvl/javasrc/Lv_Java_v0_31/CodeBase/Demo/communicator/communicator.json", "C:/x3d-code/www.web3d.org/x3d/content/examples/Basic/LatticeXvl/javasrc/Lv_Java_v0_31/CodeBase/Demo/dolphin.json", "C:/x3d-code/www.web3d.org/x3d/content/examples/Basic/LatticeXvl/javasrc/Lv_Java_v0_31/CodeBase/Demo/hand.json", "C:/x3d-code/www.web3d.org/x3d/content/examples/Basic/LatticeXvl/javasrc/Lv_Java_v0_31/CodeBase/Demo/octopus.json", "C:/x3d-code/www.web3d.org/x3d/content/examples/Basic/LatticeXvl/javasrc/Lv_Java_v0_31/CodeBase/Demo/oni.json"];

console.error("These files probably do not exist anymore");

validate(files);

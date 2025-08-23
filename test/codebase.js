#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import validateJSON from "../index.js";

var files = [ "C:/Users/jcarl/www.web3d.org/x3d/content/examples/Basic/HumanoidAnimation/originals/LOA3ExampleSourceWithDiamondsOriginalBsContactExport.json", "C:/Users/jcarl/www.web3d.org/x3d/content/examples/Basic/LatticeXvl/javasrc/Lv_Java_v0_31/CodeBase/Demo/baby.json", "C:/Users/jcarl/www.web3d.org/x3d/content/examples/Basic/LatticeXvl/javasrc/Lv_Java_v0_31/CodeBase/Demo/communicator/communicator.json", "C:/Users/jcarl/www.web3d.org/x3d/content/examples/Basic/LatticeXvl/javasrc/Lv_Java_v0_31/CodeBase/Demo/dolphin.json", "C:/Users/jcarl/www.web3d.org/x3d/content/examples/Basic/LatticeXvl/javasrc/Lv_Java_v0_31/CodeBase/Demo/hand.json", "C:/Users/jcarl/www.web3d.org/x3d/content/examples/Basic/LatticeXvl/javasrc/Lv_Java_v0_31/CodeBase/Demo/octopus.json", "C:/Users/jcarl/www.web3d.org/x3d/content/examples/Basic/LatticeXvl/javasrc/Lv_Java_v0_31/CodeBase/Demo/oni.json"];

console.error("These files probably do not exist anymore");

validateJSON(files);

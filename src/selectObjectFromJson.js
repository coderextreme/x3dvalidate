'use strict';
/*
Copyright (c) 2017, John Carlson
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of content nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE
*/



/**
 * selectObjectFromJson() --  get an object in a node internally.
 * The node is the javascript object tree to get an object out of.
 * selectorField is a " > " separated list of properties in node.
 *
 */
function selectObjectFromJson(node, selectorField) {
	var skipDescendants = 0; // number of descendents to skip
	var selectedValue = node;
	var higherValue = selectedValue;
	var selector  = selectorField.split(/ > /);
	var depth = (selector.length - skipDescendants);
	for (var index = 0; index < depth; index++) {
		higherValue = selectedValue;
		selectedValue = selectedValue[selector[index]];
		if (typeof selectedValue === 'undefined') {
			// not sure how we got here, but let's bail
			console.error("Error: I think we went down too far: "+selectorField+" is unavailable.");
			return true;
		}
	}
	return selectedValue;
}

module.exports = selectObjectFromJson;

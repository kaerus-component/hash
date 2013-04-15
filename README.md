hashjs
======

window location hash navigator

Usage
-----
```
<!DOCTYPE html>
<html>
	<head><title>Hash test</title></head>
<body>
	<div id="buttons">
		<button href="#one" id="one">One</button>
		<button href="#two" id="two">Two</button>
		<button href="#three" id="three">Three</button>
	</div>	
	<script src="hash.js"></script>
	<script>
		var hash = require('hash');

		hash.route(".*", function(to,form,next){
			console.log("hash changed from %s to",from,to);
			next();
		}).route("start", function(){
			console.log("start route");
		}).route("contact", function(){
			console.log("contact route");
		}).init({prepend:"!"},function(path) {
			console.log("hash start path", path);
		});

		document.getElementById('buttons').onclick = click;

		function click(event){
			var target = event.target || event.srcElement;
			hash.update(target.id);
		}

	</script>
</body>
```

License
=======
```
Copyright (c) 2013 Kaerus (kaerus.com), Anders Elo <anders @ kaerus com>.
```
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
 
    http://www.apache.org/licenses/LICENSE-2.0
 
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
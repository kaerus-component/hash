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
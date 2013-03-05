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

		hash.route(".*",change).init({prepend:"!"});

		function change(newPath,oldPath) {
			if(!old) console.log("hash start path", newPath);
			else console.log("hash changed from %s to",oldPath,newPath);
		}
		
		document.getElementById('buttons').onclick = click;

		function click(event){
			var target = event.target || event.srcElement;
			hash.update(target.id);
		}

	</script>
</body>
```
(function($) {

	// these will be converted to something like
	// .emote-%s	
	var sprites = [
		{ token: ":-)", class: "smiley" },
		{ token: ":)", 	class: "smiley" },
		{ token: ":-(", class: "sad" },
		{ token: ":(", 	class: "sad" }
	],
	fixToken = function(token) {
		var replacement = token.replace(")", "\\)").replace("(", "\\(");
		console.log("changing token", token, " to ", replacement);
		return replacement;
	};

	$(function() { 

		for(var i = 0, ii = sprites.length; i < ii; i++) {
			sprites[i]['regex'] = new RegExp(fixToken(sprites[i].token), "g");
			sprites[i]['html'] = "<span class=\"enhance-emote enhance-emote" + sprites[i].class + "\" /></span>";
		}

		/* quick and dirty woot */
		setInterval(function() { 
			$('span.yj-message:not(.smiled)').each(function() {
				var self = $(this).addClass('smiled'), 
					text = self.html(),
					originalLength = text.length;

				for(var i = 0, ii = sprites.length; i < ii; i++) {
					text = text.replace(sprites[i].regex, sprites[i].html);
				}

				console.log("resetting to ", text);
				if(originalLength !== text.length)
					self.html(text);
			});
		}, 1000)
	})

})(jQuery);
(function($) {

  // these will be converted to something like
  // .emote-%s  
  var sprites = [
    { token: "=)",      class: "smiley" },
    { token: ":-)",     class: "smiley" },
    { token: ":)",      class: "smiley" },
    { token: ":-(",     class: "sad"    },
    { token: ":(",      class: "sad"    },
    { token: ":D",      class: "teethy" },
    { token: ":-D",     class: "teethy" },
    { token: ":poop:",  class: "poop"   },
    { token: ":-X",     class: "nervous"},
    { token: ":X",      class: "nervous"},
    { token: ":x",      class: "nervous"},
    { token: "&lt;3",   class: "heart"  },
    { token: "&lt;/3",  class: "brokenheart" },
    { token: ":P",      class: "goofy"  },
    { token: ":-P",     class: "goofy"  },
    { token: "=P",      class: "goofy"  },
  ],
  fixToken = function(token) {
    return token.replace(")", "\\)").replace("(", "\\(");
  };

  $(function() { 

    for(var i = 0, ii = sprites.length; i < ii; i++) {
      sprites[i]['regex'] = new RegExp(fixToken(sprites[i].token), "g");
      sprites[i]['html'] = "<span class=\"enhance-emote enhance-emote" + sprites[i].class + "\" alt=\"" + sprites[i].class + "\" /></span>";
    }

    /* quick and dirty woot */
    setInterval(function() { 
      $('span.yj-message:not(.smiled)').each(function() {
        var self = $(this).addClass('smiled'), 
          text = self.html(),
          originalLength = text.length;

        console.log("inspecting ", text);

        for(var i = 0, ii = sprites.length; i < ii; i++) {
          text = text.replace(sprites[i].regex, sprites[i].html);
        }

        if(originalLength !== text.length)
          self.html(text);
      });
    }, 250)
  })

})(jQuery);
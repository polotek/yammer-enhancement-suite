(function($) {
  var emoticons = {
    // these will be converted to something like
    // .emote-%s  
    sprites: [
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
    ]
    , _fixToken: function(token) {
      return token.replace(")", "\\)").replace("(", "\\(");
    }
    , _initSprites: function() {
      var sprite;
      for(var i = 0, ii = this.sprites.length; i < ii; i++) {
        sprite = this.sprites[i];
        sprite.regex = new RegExp(this._fixToken(sprite.token), "g");
        sprite.html = "<span class=\"enhance-emote enhance-emote" + sprite.class + "\" alt=\"" + sprite.class + "\" /></span>";
      }
    }
    , enhanceEmoticons: function() {
      var self = this;
      $('span.yj-message:not(.smiled)').each(function(idx, el) {
        var $el = $(el).addClass('smiled') 
          , sprite
          , text = $el.html()
          , originalLength = text.length;

        for(var i = 0, len = self.sprites.length; i < len; i++) {
          sprite = self.sprites[i];
          text = text.replace(sprite.regex, sprite.html);
        }

        if(originalLength !== text.length) {
          $el.html(text);
        }
      });
    }
    , init: function() {
      var self = this;

      $(function() {
        self._initSprites();

        setInterval(self.enhanceEmoticons, 250);
      });
    }
  };

  utils.bindAll(emoticons);
  emoticons.init();
})(jQuery);

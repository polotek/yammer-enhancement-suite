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
    , init: function() {
      var self = this;

      self._initSprites();

      $(document).bind('yes::settings_update', self.onSettingsUpdate);

      utils.ext.sendRequest({
        type: 'get_settings'
      }, function(settings) {
        if(settings.enhanceEmoticons) {
          $(self.start);
        }
      });
    }
    , _fixToken: function(token) {
      return token.replace(")", "\\)").replace("(", "\\(");
    }
    , _initSprites: function() {
      var sprite;
      for(var i = 0, ii = this.sprites.length; i < ii; i++) {
        sprite = this.sprites[i];
        sprite.regex = new RegExp(this._fixToken(sprite.token), "g");
        sprite.html = "<span class=\"emoticon enhance-emote enhance-emote" + sprite.class + "\" alt=\"" + sprite.class + "\">{{text}}</span>";
      }
    }
    , start: function() {
      this.enhanceEmoticons();
      this._interval = setInterval(this.enhanceEmoticons, 250);
    }
    , stop: function() {
      $('span.yj-message.smiled .emoticon').removeClass('enhance-emote');

      clearInterval(this._interval);
    }
    , enhanceEmoticons: function() {
      var self = this;

      $('span.yj-message.smiled .emoticon').addClass('enhance-emote');

      $('span.yj-message:not(.smiled)').each(function(idx, el) {
        var $el = $(el).addClass('smiled') 
          , sprite
          , text = $el.html()
          , originalLength = text.length;

        for(var i = 0, len = self.sprites.length; i < len; i++) {
          sprite = self.sprites[i];
          text = text.replace(sprite.regex, function(str) {
            return sprite.html.replace('{{text}}', str);
          });
        }

        if(originalLength !== text.length) {
          $el.html(text);
        }
      });
    }
    , onSettingsUpdate: function(ev, data) {
      if(data && 'enhanceEmoticons' in data.changes) {
        if(data.changes.enhanceEmoticons) {
          this.start();
        } else {
          this.stop();
        }
      }
    }
  };

  utils.bindAll(emoticons);
  emoticons.init();
})(jQuery);

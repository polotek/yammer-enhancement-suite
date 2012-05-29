var yes = utils.getYES();
yes.popup = {
  $inputs: $('#settings').find(':input')
  , init: function() {
    this.$inputs.each(function(i, input) {
      var $input = $(input);
      if($input.attr('type') === 'checkbox') {
        $input.attr('checked', yes.get($input.attr('id')));
      } else {
        $input.val(yes.get($input.attr('id')));
      }
    });

    this.$inputs.change(this.onSettingsChange);
  }
  , onSettingsChange: function(ev) {
    var $input = $(ev.target);
    if($input.attr('type') === 'checkbox') {
      yes.set($input.attr('id'), $input.attr('checked'));
    } else {
      yes.set($input.attr('id'), $input.val());
    }
  }
};
utils.bindAll(yes.popup);
yes.popup.init();

$('#settings').find(':input').change(function(ev) {
  var yes = utils.getYES();
  var $el = $(ev.target);
  yes.set($el.attr('id'), $el.val());
});

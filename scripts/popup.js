var yes = utils.getYES();
$('#settings').find(':input').change(function(ev) {
  var $el = $(ev.target);
  yes.set($el.attr('id'), $el.val());
});

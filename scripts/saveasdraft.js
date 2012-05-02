$(function() {

	var networkId = $(".uni-current-network.yj-clearfix").data("yj-network-id")

	function textareaId(el) {
		return networkId + ":" + $(el).parents("form").data("yamjs-id")
	}

	$("body").on("focus", "textarea", function() {
		console.log("focused " + textareaId(this))
	})

	$("body").on("blur", "textarea", function() {
		console.log("blur " + textareaId(this))
	})

})
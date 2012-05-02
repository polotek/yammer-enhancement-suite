$(function() {

	var networkId = $(".uni-current-network.yj-clearfix").data("yj-network-id")

	function currentFeedId() {
		var feedId = "";
		var match = location.hash.match(/feedId=(\d+)/);
		if (match) {
			feedId = match[1];
		}
		return feedId;
	}

	function draftStorageKey(el) {
		return "drafts_" + networkId + ":" + currentFeedId() + ":" + $(el).parents(".yj-message-form-container").find("form").data("yamjs-id");
	}

	function keyPressHandler(event) {
		var target = event.target
		var draftKey = draftStorageKey(target)
		localStorage[draftKey] = $(target).val()
		console.log(draftKey + ": " + $(target).val())
	}

	$("body").on("click", "a.yj-message-form-submit", function(event) {
		var target = event.target
		var draftKey = draftStorageKey(target)
		localStorage.removeItem(draftKey)
	})

	$("body").on("focus", "textarea", function() {
		var draftKey = draftStorageKey(this)
		console.log("focused " + draftKey)
		var saved = localStorage[draftKey]
		if (saved) {
			$(this).val(saved)
		}
		$(this).on("keyup", keyPressHandler)

	})

	$("body").on("blur", "textarea", function() {
		var draftKey = draftStorageKey(this)
		console.log("blur " + draftKey)
		$(this).off("keyup", keyPressHandler)
	})

})
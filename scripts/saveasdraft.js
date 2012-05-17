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
		return "drafts_" + networkId + ":" + currentFeedId() + ":" + $(el).parents(".yj-thread-list-item").data("thread-id");
	}

	function removeDraft(key) {
		console.log("Removing draft for key", key);
		localStorage.removeItem(key);
	}

	function saveDraft(key, value) {
		console.log("Saving draft for key", key);
		localStorage[key] = value
	}

	function keyPressHandler(event) {
		var target = event.target;
		var draftKey = draftStorageKey(target);

		if (event.keyCode === 16) {
			// IGNOOORE
		} else if (event.shiftKey && event.keyCode === 13) {
			removeDraft(draftKey);
		} else {
			saveDraft(draftKey, $(target).val());
			console.log("keypress", event);
		}
	}

	$("body").on("click", "a.yj-message-form-submit", function(event) {
		var target = event.target;
		var draftKey = draftStorageKey(target);
		removeDraft(draftKey);
	})

	$("body").on("focus", "textarea", function() {
		var draftKey = draftStorageKey(this)
		console.log("focused " + draftKey)
		var saved = localStorage[draftKey]
		if (saved) {
			console.log("Found draft for key", draftKey);
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
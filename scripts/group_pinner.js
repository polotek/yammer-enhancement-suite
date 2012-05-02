/* group reordermatron! */

(function($) {
	
	$(window).on('enhance.settingsLoaded', function(event, settings) {

		if(!settings.removeGettingStarted)
			return;

		var GroupPinner = function() { 
				this.init() 
			},
			storage = yammerEnhance.GroupStorage;

		GroupPinner.prototype = {
			init: function() {
				this.registerHandlers();
				var parent = this.groupParent = $('.yj-group-nav-list');
				this.allCompanyItem = parent.find('.all-company-list-item');

				this.buildPinnedSection();

				storage.reloadFromStorage();

				for(var i = 0, ii = storage.groups.length; i < ii; i++) {
					var id = storage.groups[i];
					this.pinGroup($('.nav-group-link[data-group-id=' + id + ']'));
				}		
			},
			getId: function(element) {
				return element.data('group-id');
			},
			// handles registering the element with storage and moving it around
			pinGroup: function(element) {
				storage.add(this.getId(element));
				// mark it with a permanent pin
				element.find('.nav-icon')
					.addClass('group-pin-icon')
					.data('pinned', true);

				this.togglePinnedSection(true);
				this.header.after(element);
			},
			unpinGroup: function(element) {
				var id = this.getId(element),
						self = this;

				storage.remove(id);

				// put humpty dumpty back together again
				element
					.find('.nav-icon')
					.data('pinned', false)
					.removeClass('group-pin-icon');

				$('.nav-pinned-header-sep').after(element);
				self.togglePinnedSection(storage.any());
			},
			buildPinnedSection: function() {
				var header = this.header = $('<li><span>Pinned</span></li>');
				header.addClass('nav-pinned-header');
				this.allCompanyItem.after(header);
				// add a separator
				header.after($('<li/>').addClass('nav-pinned-header-sep'));

				this.togglePinnedSection(storage.any());
			},
			togglePinnedSection: function(show) {
				var items = this.header.add($('.nav-pinned-header-sep'));
				items[show ? 'show' : 'hide']();
			},
			registerHandlers: function() {
				var self = this;

				$('li.nav-group-link').on('mouseover', function() {
					var parent = $(this);
					var navIcon = parent.find('.nav-icon').addClass('group-pin-icon');

					navIcon.on('click', function() {
						self[!self.isSelected(navIcon) ? 'pinGroup' : 'unpinGroup'](parent);
						return false;
					});

				}).on('mouseout', function() {
					var element = $(this).find('.nav-icon');

					element.off('click');
					
					if(! self.isSelected(element)) 
						element.removeClass('group-pin-icon');
				});
			},
			isSelected: function(navIcon) {
				// not entirely sure what data does when I remove the data.. so yeah. explicit true pls.
				return navIcon.data('pinned') === true;
			}
		};

	});

	window.yammerEnhance.GroupPinner = new GroupPinner();


})(jQuery);
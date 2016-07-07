define([
  'common/ui/formatting',
  'common/utils/placeUtils',
  'common/hasEvents'], function(Formatting, PlaceUtils, HasEvents) {

  var SearchResultCard = function(ul, place) {

    var self = this,

        element = jQuery(
          '<li class="place-details">' +
            '<h3 class="title"></h3>' +
            '<p class="uris"></p>' +
            '<p class="description"></p>' +
            '<p class="date"></p>' +
          '</li>'),

        titleEl       = element.find('.title'),
        urisEl        = element.find('.uris'),
        descriptionEl = element.find('.description'),
        dateEl        = element.find('.date'),

        formatURI = function(uri) {
          var data = PlaceUtils.parseURI(uri),
              char = (data.shortcode) ? data.shortcode.charAt(0).toUpperCase() : false;

          if (data.shortcode)
            return '<a class="minilink" href="' + uri + '" title="' +
              data.shortcode + ':' + data.id + '" style="background-color:' +
              data.color + '" target="_blank">' + char + '</a>';
          else
            return '<a class="minilink" href="' + uri + '" title="' +
              uri + '" target="_blank">?</a>';
        },

        render = function() {
          var uris = PlaceUtils.getURIs(place),
              descriptions = PlaceUtils.getDescriptions(place);

          titleEl.html(place.labels.join(', '));

          jQuery.each(uris, function(idx, uri) {
            urisEl.append(formatURI(uri));
          });

          if (descriptions.length > 0)
            descriptionEl.html(descriptions[0].description);
          else
            descriptionEl.hide();

          if (place.temporal_bounds)
            dateEl.html(Formatting.yyyyMMddToYear(place.temporal_bounds.from) + ' - ' +
                        Formatting.yyyyMMddToYear(place.temporal_bounds.to));
          else
            dateEl.hide();

          ul.append(element);
        };

    render();

    element.click(function() { self.fireEvent('click'); });

    HasEvents.apply(this);
  };
  SearchResultCard.prototype = Object.create(HasEvents.prototype);

  return SearchResultCard;

});
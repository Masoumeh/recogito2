
define(['document/annotation/common/editor/editorBase'], function(EditorBase) {

  var ReadEditor = function(container, highlighter, selectionHandler) {
    var self = this,

        element = (function() {
          var el = jQuery(
                '<div class="text-annotation-editor">' +
                  '<div class="arrow"></div>' +
                  '<div class="text-annotation-editor-inner">' +
                    '<div class="sections"></div>' +
                  '</div>' +
                '</div>');

          jQuery(container).append(el);
          el.hide();
          return el;
        })(),

        /** Opens the editor on an annotation **/
        viewSelection = function(selection) {
          self.open(selection.annotation, selection.bounds);
          return false;
        },

        /** 'OK' updates the annotation & highlight spans and closes the editor **/
        onClose = function() {
          element.hide();
        };

    EditorBase.apply(this, [ container, element, highlighter ]);

    // Click on annotation span opens the editor
    // jQuery(container).on('click', '.annotation', viewSelection);

    // Monitor text selections through the selectionHandler
    selectionHandler.on('select', viewSelection);

    // Editor closes on ESC key and click on background document
    self.on('escape', onClose);

    // jQuery(document).on('click', ':not(> .text-annotation-editor)', onClose);
  };
  ReadEditor.prototype = Object.create(EditorBase.prototype);

  return ReadEditor;

});
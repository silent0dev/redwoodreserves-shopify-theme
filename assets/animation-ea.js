$.fn.visible = function(partial) {

    var $t = $(this),
      $w = $(window),
      viewTop = $w.scrollTop(),
      viewBottom = viewTop + $w.height(),
      _top = $t.offset().top + $w.height() / 5,
      _bottom = _top + $t.height() + $w.height() / 5,
      compareTop = partial === true ? _bottom : _top,
      compareBottom = partial === true ? _top : _bottom;
  
    return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
  
};
  
var win = $(window);
var allMods = $(".animation-mode");
  
allMods.each(function(i, el) {
    var el = $(el);
    if (el.visible(true)) {
      el.addClass("already-visible");
    }
});
  
win.scroll(function(event) {
    allMods = $(".animation-mode");
    allMods.each(function(i, el) {
      var el = $(el);
      if (el.visible(true)) {
        el.addClass("come-in");
      }
    });
});

$(document).ready(function(){
    allMods.each(function(i, el) {
        var el = $(el);
        if (el.visible(true)) {
          el.addClass("come-in");
        }
    });
});
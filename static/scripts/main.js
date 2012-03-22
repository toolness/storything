$(window).load(function() {
  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return unescape(pair[1]);
      }
    }
  }

  function retargetLinksToNewTab() {
    $("a").each(function() {
      var href = $(this).attr("href");
      if (href && href.length && href[0] != '#')
        $(this).attr("target", "_blank");
    });
  }
  
  var remixURL = getQueryVariable('remix');
  
  if (remixURL && !window.location.hash) {
    // This is a weird Safari bug; for some reason the hash isn't
    // passed to us from the remix, so we'll default to the editor
    // mode.
    window.location.hash = "#editor.remix";
  }

  retargetLinksToNewTab();  
  $("#editor").bind("navshow", function(event, templateID) {
    if (templateID == "remix") {
      if (remixURL)
        Editor.remix(remixURL);
    } else {
      Editor.loadTemplate(templateID);
    }
  });
  $("#publish").click(function() { Publish.publish(Editor.getContent()); });
  $("#undo").click(function() { Editor.undo(); });
  $("#redo").click(function() { Editor.redo(); });
  Navigation.init();
  Publish.init();  
});

var TutorialBuilders = {
  // For the drafted script, see
  // http://htmlpad.org/opennews-webmaking101-copywriting-html/
  tut_paragraphs: function(tutorial) {
    return tutorial
      .instruct("Welcome to Storything.")
      .instruct("This is where you'll be doing your work.")
      .instruct("We've put the text of your story into the left pane.", 0)
      .spotlight("#source")
      .instruct("The right pane is how it looks on the Web.", 0)
      .spotlight("#preview-holder")
      .end();
  }
};

$(window).ready(function() {
  var chapterTabs = $("ul#chapters > li");
  chapterTabs.each(function() {
    var tabBar = $(this).parent();
    var tabId = $(this).attr("id");
    var tabContent = $("#templates .tutorial-movie")
      .clone().appendTo("#chapter-content");
    var buildTutorial = TutorialBuilders[tabId] || function(tutorial) {
      return tutorial
        .instruct("This tutorial has not yet been written.")
        .instruct("Sorry.")
        .end();
    };
    var tabTutorial = buildTutorial(Tutorial({
      controls: tabContent.find(".player"),
      editor: tabContent.find(".editor"),
      preview: tabContent.find(".preview"),
      instructions: tabContent.find(".dialogue")
    }));
    $(this).click(function() {
      tabBar.find("> li.active").trigger("deactivate-tab");
      $(this).addClass("active");
      tabContent.addClass("active");
      tabTutorial.pop.play(0);
    });
    $(this).bind("deactivate-tab", function() {
      $(this).removeClass("active");
      tabContent.removeClass("active");
      tabTutorial.pop.pause(0);
    });
  });
  $("#editor").bind("navshow", function() {
    chapterTabs.first().click();
  });
});

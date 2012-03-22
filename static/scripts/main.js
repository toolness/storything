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
  "default": {
    movie: function(tutorial) {
      return tutorial
        .instruct("This tutorial has not yet been written.")
        .instruct("Sorry.");
    },
    winMovie: function(tutorial) {
      return tutorial;
    },
    isChallengeFinished: function() {
      return false;
    }
  },
  tut_paragraphs: {
    movie: function(tutorial) {
      var examplePanes = ".tutorial-movie.tut_paragraphs .two-panes";
      var examplePreviewPane = ".tutorial-movie.tut_paragraphs .preview";
      return tutorial
        .show(examplePanes, false)
        .instruct("Welcome to Storything.")
        .instruct("We've put the text of your story into the left pane.", 0)
        .spotlight("#source")
        .instruct("The right pane is how it looks on the Web.", 0)
        .spotlight("#preview-holder")
        .instruct("See how the right side is just a blob of text?")
        .instruct("We can fix that by adding <em>tags</em> to the left side that give the page structure.")
        .instruct("Let's see an example.", 0)
        .show(examplePanes, true)
        .typechars("This is an example paragraph.\n\nAnd another one!", 0.1)
        .instruct("Just like your story, the right pane of this example is a blob.", 0)
        .spotlight(examplePreviewPane)
        .instruct("Let's change that.", 0)
        .moveto({position: "beginning", search: "This"})
        .typechars("<p>")
        .moveto({position: "end", search: "paragraph."})
        .typechars("</p>")
        .moveto({position: "beginning", search: "And"})
        .typechars("<p>")
        .moveto({position: "end", search: "one!"})
        .typechars("</p>")
        .instruct("Notice how the paragraphs now have space between them.", 0)
        .spotlight(examplePreviewPane)
        .instruct("That's because we marked up our text on the left pane with tags.")
        .instruct('A <code class="tag">&lt;p&gt;</code> tag tells a computer to start a paragraph.')
        .instruct('A <code class="tag">&lt;/p&gt;</code> tag tells a computer to end a paragraph.')
        .show(examplePanes, false)
        .instruct("Paragraph tags are part of a language called <em>HTML</em>, which is used to tell computers how to build webpages.")
        .instruct("Now it's your turn. Can you mark up your text so it doesn't look like a blob anymore?")
        .instruct("Go ahead&mdash;just click on the left pane and start typing.", 0)
        .spotlight("#source")
        .instruct("If you get lost, feel free to drag the scrubber below to review this tutorial.", 0)
        .spotlight(".tutorial-movie.tut_paragraphs .scrubber");
    },
    winMovie: function(tutorial) {
      return tutorial
        .instruct("Good job! You've made your first paragraphs in HTML.")
        .instruct("Now click chapter 2, <em>Headings</em>, to learn your next tag.", 0)
        .spotlight("#tut_headings");
    },
    isChallengeFinished: function() {
      var html = jQuery.trim(Editor.getContent().html);
      return (html.slice(0, 3).toLowerCase() == "<p>" &&
              html.slice(-4).toLowerCase() == "</p>");
    }
  }
};

$(window).ready(function() {
  var chapterTabs = $("ul#chapters > li");
  chapterTabs.each(function() {
    function resetTabTutorial() {
      tabContent = $("#templates .tutorial-movie")
        .clone().addClass(tabId).appendTo("#chapter-content");
      tabTutorial = Tutorial({
        controls: tabContent.find(".player"),
        editor: tabContent.find(".editor"),
        preview: tabContent.find(".preview"),
        instructions: tabContent.find(".dialogue")
      });
      builder.movie(tabTutorial);
    }

    var tab = $(this);
    var tabBar = $(this).parent();
    var tabId = $(this).attr("id");
    var builder = TutorialBuilders[tabId] || TutorialBuilders["default"];
    var tabContent;
    var tabTutorial;
    var defaultBeginning = 0;
    var checkChallengeInterval = setInterval(function() {
      if (builder.isChallengeFinished(tabTutorial)) {
        var isActive = tabContent.hasClass("active");
        defaultBeginning = tabTutorial.pop.media.duration;
        tabContent.remove();
        try {
          tabTutorial.pop.pause(0).destroy();
        } catch (e) {
          // TODO: Not sure why this is sometimes happening.
          console.error(e, e.stack);
        }

        resetTabTutorial();

        builder.winMovie(tabTutorial).end();
        tab.find(".completion").text("Done");
        clearInterval(checkChallengeInterval);
        if (isActive)
          tab.click();
      }
    }, 500);

    resetTabTutorial();
    tabTutorial.end();
    $(this).click(function() {
      tabBar.find("> li.active").trigger("deactivate-tab");
      $(this).addClass("active");
      tabContent.addClass("active");
      tabTutorial.pop.play(defaultBeginning);
    });
    $(this).bind("deactivate-tab", function() {
      $(this).removeClass("active");
      tabContent.removeClass("active");
      tabTutorial.pop.pause(defaultBeginning);
    });
  });
  $("#editor").bind("navshow", function() {
    chapterTabs.first().click();
  });
});

$(window).load(function() {
  var badgeTracker;
  
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
      var loaded = Editor.loadTemplate(templateID);
      loaded.done(function() {
        $("ul#chapters > li").each(createTabTutorial).first().click();
        badgeTracker = BadgeTracker(TutorialBadges, $("#badge-display"));
      });
    }
  });
  $("#editor").bind("navhide", function() {
    badgeTracker.destroy();
    $("ul#chapters > li").trigger("destroy-tab");
  });
  $("#publish").click(function() { Publish.publish(Editor.getContent()); });
  $("#undo").click(function() { Editor.undo(); });
  $("#redo").click(function() { Editor.redo(); });
  Navigation.init();
  Publish.init();  
});

var TutorialBadges = {
  paragrapher: {
    isAchieved: function() {
      var html = Editor.getContent().html;
      return html.match(/\<p\>/i) && html.match(/\<\/p\>/i);
    },
    achievement: "#paragrapher-badge"
  },
  h1_headliner: {
    isAchieved: function() {
      var html = Editor.getContent().html;
      return html.match(/\<h1\>/i) && html.match(/\<\/h1\>/i);
    },
    achievement: "#h1_headliner-badge"
  },
  h2_headliner: {
    isAchieved: function() {
      var html = Editor.getContent().html;
      return html.match(/\<h2\>/i) && html.match(/\<\/h2\>/i);
    },
    achievement: "#h2_headliner-badge"
  },
  h6_headliner: {
    isAchieved: function() {
      var html = Editor.getContent().html;
      return html.match(/\<h6\>/i) && html.match(/\<\/h6\>/i);
    },
    achievement: "#h6_headliner-badge"
  }
};

var TutorialBuilders = {
  // For the drafted script, see
  // http://htmlpad.org/opennews-webmaking101-copywriting-html/
  "default": {
    movie: function(tutorial) {
      return tutorial
        .instruct("This tutorial has not yet been written.")
        .instruct("Sorry.");
    }
  },
  tut_paragraphs: {
    movie: function(tutorial) {
      var examplePanes = ".tutorial-movie.tut_paragraphs .two-panes";
      var examplePreviewPane = ".tutorial-movie.tut_paragraphs .preview";
      return tutorial
        .show(examplePanes, false)
        .instruct("Welcome to Storything.")
        .instruct("If you ever get lost, feel free to drag the scrubber below to review this tutorial.", 0)
        .spotlight(".tutorial-movie.tut_paragraphs .scrubber")
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
        .instruct("Once you're done, click chapter 2, <em>Headings</em>, to learn your next tag.", 0)
        .spotlight("#tut_headings");
    }
  },
  tut_headings: {
    movie: function(tutorial) {
      var examplePanes = ".tutorial-movie.tut_headings .two-panes";
      var examplePreviewPane = ".tutorial-movie.tut_headings .preview";
      return tutorial
        .show(examplePanes, false)
        .instruct("Paragraphs are great, but there's more to writing than that, isn't there?")
        .instruct("Like headlines.", 0)
        .show(examplePanes, true)
        .typechars("This is a really important headline.", 0.1)
        .instruct("The <code class=\"tag\">&lt;h1&gt;</code> tag is for the most important heading in a page.", 0)
        .moveto({position: "beginning", search: "This"})
        .typechars("<h1>")
        .moveto({position: "end", search: "headline."})
        .typechars("</h1>")
        .instruct("Notice how large and bold the headline appears on the Web.", 0)
        .spotlight(examplePreviewPane)
        .instruct("The <code class=\"tag\">&lt;h2&gt;</code> tag can be used for less important headings.", 0)
        .moveto({position: "beginning", search: "<h1>This is a really"})
        .typechars("<h2>This is a slightly less important headline.</h2>\n\n", 0.1)
        .instruct("Notice how the <code class=\"tag\">&lt;h2&gt;</code> is a bit smaller than the <code class=\"tag\">&lt;h1&gt;</code>.", 0)
        .spotlight(examplePreviewPane)
        .instruct("You can use <code class=\"tag\">&lt;h3&gt;</code>, <code class=\"tag\">&lt;h4&gt;</code>, <code class=\"tag\">&lt;h5&gt;</code>, and <code class=\"tag\">&lt;h6&gt;</code> for even less important headings.")
        .show(examplePanes, false)
        .instruct("Go ahead and give your story a headline wrapped in a <code class=\"tag\">&lt;h1&gt;</code> and a byline wrapped in a <code class=\"tag\">&lt;h2&gt;</code>.")
        .instruct("When you're done, click chapter 3, <em>More Tags</em>, to learn more.", 0)
        .spotlight("#tut_moretags");
    }
  }
};

function createTabTutorial() {
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

  function destroyTabTutorial() {
    tabContent.remove();
    try {
      tabTutorial.pop.pause(0).destroy();
    } catch (e) {
      // TODO: Not sure why this is sometimes happening.
      console.error(e, e.stack);
    }
  }
  
  var tab = $(this);
  var tabBar = $(this).parent();
  var tabId = $(this).attr("id");
  var builder = TutorialBuilders[tabId] || TutorialBuilders["default"];
  var tabContent;
  var tabTutorial;

  resetTabTutorial();
  tabTutorial.end();
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
  $(this).bind("destroy-tab", function() {
    $(this).trigger("deactivate-tab");
    destroyTabTutorial();
    $(this).unbind();
  });
}

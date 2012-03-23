var badges = {
  paragrapher: {
    isAchieved: function() {
      var html = Editor.getContent().html;
      return html.match(/\<p\>/i) && html.match(/\<\/p\>/i);
    },
    achievement: "#paragrapher-badge"
  }
};

function BadgeTracker(badges, display) {
  var fixedBefore = {},
      interval,
      badgeCount = display.find(".badge-count");
  var self = {
    earned: function earned() {
      var earned = [];
      for (var name in fixedBefore)
        earned.push(name);
      return earned;
    },
    destroy: function destroy() {
      clearInterval(interval);
    },
    update: function update() {
      var badgesLeft = 0;
      for (var name in badges) {
        var badge = badges[name];
        if (!badge.isAchieved())
          badgesLeft++;
        else {
          if (!(name in fixedBefore)) {
            fixedBefore[name] = true;
            if (badge.achievement)
              $(badge.achievement).delay(500).fadeIn().delay(2500).fadeOut();
            if (badge.onAchieved)
              badge.onAchieved();
            var earned = self.earned();
            var longNames = earned.map(function(name) {
              return $(badges[name].achievement).find(".name").text();
            });
            display.attr("title", "Badges earned: " + longNames.join(", "));
            badgeCount.text(earned.length.toString());
          }
        }
      }
    }
  };
  
  display.attr("title", "You haven't earned any badges yet.");
  badgeCount.text("0");
  self.update();
  interval = setInterval(self.update, 500);
  
  return self;
}

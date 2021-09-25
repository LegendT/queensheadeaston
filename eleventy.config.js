const navigation = require("@11ty/eleventy-navigation");
const dates = require("./utilities/filters/dates");
const markdownFilter = require("./utilities/filters/parse-markdown");
const helpers = require("./utilities/filters/helpers");
const path = require("path");
const sortByDisplayOrder = require("./utilities/filters/sort-by-display-order.js");

module.exports = (config) => {
  // navigation plugin
  config.addPlugin(navigation);

  // Human readable date for posts
  config.addFilter("dateDisplay", dates.friendly);

  // Timestamp for datetime element
  config.addFilter("timestamp", dates.timestamp);

  // Remove whitespace from a string
  config.addNunjucksFilter("spaceless", helpers.spaceless);

  // Parsing Markdown in Front Matter.
  config.addFilter("markdownFilter", markdownFilter);

  // Minify our HTML
  config.addTransform(
    "htmlminify",
    require("./utilities/transforms/htmlminify")
  );

  // Returns event items, sorted by display order then filtered by featured
  config.addCollection("featured", (collection) => {
    const featuredList = collection.getFilteredByGlob("./site/events/*.md");

    return featuredList.filter((x) => x.data.featured);
  });

  // Collections
  config.addCollection("blog", (collection) => {
    const blogs = collection.getFilteredByTag("blog").reverse();

    for (let i = 0; i < blogs.length; i++) {
      const previous_post = blogs[i - 1];
      const next_post = blogs[i + 1];

      blogs[i].data["previous_post"] = previous_post;
      blogs[i].data["next_post"] = next_post;
    }

    return blogs.reverse();
  });

  config.addCollection("futureEvents", (collection) => {
    const futureEvents = collection.getFilteredByTag("event");

    for (let i = 0; i < futureEvents.length; i++) {
      const previous_event = futureEvents[i - 1];
      const next_event = futureEvents[i + 1];

      futureEvents[i].data["previous_event"] = previous_event;
      futureEvents[i].data["next_event"] = next_event;
    }
    let now = new Date().getTime();
    return futureEvents.filter((p) => {
      if (now < p.date.getTime()) return true;
      return false;
    });
    //return futureEvents;
  });

  config.addCollection("pastEvents", (collection) => {
    const pastEvents = collection.getFilteredByTag("event").reverse();

    for (let i = 0; i > pastEvents.length; i++) {
      const previous_event = pastEvents[i - 1];
      const next_event = pastEvents[i + 1];

      pastEvents[i].data["previous_event"] = previous_event;
      pastEvents[i].data["next_event"] = next_event;
    }
    let now = new Date().getTime();
    return pastEvents.filter((p) => {
      if (now < p.date.getTime()) return false;
      return true;
    });

    //return pastEvents;
  });
  // Categories collection
  config.addCollection("categories", (collection) => {
    const list = new Set();

    collection.getAll().forEach((item) => {
      if (!item.data.tags) return;

      item.data.tags
        .filter((category) => !["blog", "all"].includes(category))
        .forEach((category) => list.add(category));
    });

    return Array.from(list).sort();
  });

  // Layout aliases
  config.addLayoutAlias("base", "layouts/base.njk");
  config.addLayoutAlias("home", "layouts/home.njk");
  config.addLayoutAlias("page", "layouts/page.njk");
  config.addLayoutAlias("blog", "layouts/blog.njk");
  config.addLayoutAlias("post", "layouts/post.njk");
  config.addLayoutAlias("contact", "layouts/contact.njk");
  config.addLayoutAlias("category", "layouts/category.njk");
  config.addLayoutAlias("events", "layouts/events-list.njk");
  config.addLayoutAlias("events-past", "layouts/events-list-past.njk");
  config.addLayoutAlias("event", "layouts/event.njk");

  // Include our static assets
  config.addPassthroughCopy("css");
  config.addPassthroughCopy("js");
  config.addPassthroughCopy("images");
  config.addPassthroughCopy("favicon.png");
  config.addPassthroughCopy("favicon.svg");

  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "site",
      output: "public",
      includes: "includes",
      data: "globals",
    },
  };
};

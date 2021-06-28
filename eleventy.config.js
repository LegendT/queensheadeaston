const navigation = require('@11ty/eleventy-navigation');
const dates = require('./utilities/filters/dates');
const markdownFilter = require('./utilities/filters/parse-markdown');
const helpers = require('./utilities/filters/helpers');
const path = require('path');

module.exports = (config) => {
	// navigation plugin
	config.addPlugin(navigation);

	// Human readable date for posts
	config.addFilter('dateDisplay', dates.friendly);

	// Timestamp for datetime element
	config.addFilter('timestamp', dates.timestamp);

	// Remove whitespace from a string
	config.addNunjucksFilter('spaceless', helpers.spaceless);

	// Parsing Markdown in Front Matter.
	config.addFilter('markdownFilter', markdownFilter);

	// Minify our HTML
	config.addTransform('htmlminify', require('./utilities/transforms/htmlminify'));

	// Collections
	config.addCollection('blog', (collection) => {
		const blogs = collection.getFilteredByTag('blog');

		for (let i = 0; i < blogs.length; i++) {
			const previous_post = blogs[i - 1];
			const next_post = blogs[i + 1];

			blogs[i].data['previous_post'] = previous_post;
			blogs[i].data['next_post'] = next_post;
		}

		return blogs.reverse();
	});

	config.addCollection('qhevents', (collection) => {
		const events = collection.getFilteredByTag('event');

		for (let i = 0; i < events.length; i++) {
			const previous_event = events[i - 1];
			const next_event = events[i + 1];

			events[i].data['previous_event'] = previous_event;
			events[i].data['next_event'] = next_event;
		}

		return events.reverse();
	});

	// Categories collection
	config.addCollection('categories', (collection) => {
		const list = new Set();

		collection.getAll().forEach((item) => {
			if (!item.data.tags) return;

			item.data.tags
				.filter((category) => !['blog', 'all'].includes(category))
				.forEach((category) => list.add(category));
		});

		return Array.from(list).sort();
	});

	// Layout aliases
	config.addLayoutAlias('base', 'layouts/base.njk');
	config.addLayoutAlias('home', 'layouts/home.njk');
	config.addLayoutAlias('page', 'layouts/page.njk');
	config.addLayoutAlias('blog', 'layouts/blog.njk');
	config.addLayoutAlias('post', 'layouts/post.njk');
	config.addLayoutAlias('contact', 'layouts/contact.njk');
	config.addLayoutAlias('category', 'layouts/category.njk');
	config.addLayoutAlias('events', 'layouts/events-list.njk');
	config.addLayoutAlias('event', 'layouts/event.njk');

	// Include our static assets
	config.addPassthroughCopy('css');
	config.addPassthroughCopy('js');
	config.addPassthroughCopy('images');
	config.addPassthroughCopy('favicon.png');
	config.addPassthroughCopy('favicon.svg');

	return {
		markdownTemplateEngine: 'njk',
		dir: {
			input: 'site',
			output: 'public',
			includes: 'includes',
			data: 'globals',
		},
	};
};

# livereloaded

Livereload Firefox addon built on top of modern WebExtension APIs.

This addon easily enables you to use [livereload or some compatible open source
implementation](#compatible-servers) to reload tab in your browser automatically
when files are modified. This is achieved by injecting a [livereload.js script]
served by the livereload server into DOM. So no need to manually edit all HTML
documents in your application/page to include `<script
src="<host>:<livereload-port>/livereload.js"></script>` tags!


## compatible servers

Any server that implements [livereload protocol] __should__ work. Some examples of such
servers:

- [LiveReload app for Mac]
- [node-livereload]
- [grunt-contrib-watch]
- [rack-livereload]
- [guard-livereload]


## building

[NPM and NodeJS][nodejs] are required for building. To build necessary javascript
files run following commands:

```
npm install
npm run build
```

Afterwards `/addon` directory will contain everything needed. Load as temporary
addon by following [WebExtension temporary installation in Firefox].


## development

There are some helper task available if you feel like contributing:

- `npm run watch` watch js files for changes and rebuild if necessary
- `npm run format` use prettify to format js files
- `npm run lint` lint js files
- `npm run build` build js files


## license

Livereloaded is licensed under MIT. See [LICENSE] for details.

[livereload protocol]: http://livereload.com/api/protocol/
[livereload.js script]: https://github.com/livereload/livereload-js
[livereload]: http://livereload.com/
[LICENSE]: https://github.com/orva/livereloaded/blob/master/LICENSE
[nodejs]: https://nodejs.org/
[node-livereload]: https://github.com/napcs/node-livereload
[rack-livereload]: https://github.com/johnbintz/rack-livereload
[guard-livereload]: https://github.com/guard/guard-livereload
[grunt-contrib-watch]: https://github.com/gruntjs/grunt-contrib-watch
[WebExtension temporary installation in Firefox]: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Temporary_Installation_in_Firefox
[LiveReload app for Mac]: http://livereload.com/
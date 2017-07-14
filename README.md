# livereloaded


Livereload Firefox addon built on top of modern WebExtension APIs.

Actual work is done by a livereload server and a livereload frontend script.
Livereloaded enables this by fetching the script from the running livereload server
and injecting it into DOM.

This should be enough according to a [livereload protocol specification].


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

[livereload protocol specification]: http://livereload.com/api/protocol/
[LICENSE]: https://github.com/orva/livereloaded/blob/master/LICENSE
[nodejs]: https://nodejs.org/
[WebExtension temporary installation in Firefox]: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Temporary_Installation_in_Firefox
# livereloaded


Livereload Firefox addon built on top of modern WebExtension APIs.

Actual work is done by a livereload server and a livereload frontend script.
Livereloaded enables this by fetching the script from the running livereload server
and injecting it into DOM.

This should be enough according to a [livereload protocol specification].


## building

```
npm install
npm run build
```

This will build necessary javascript files and places them into `/addon` directory,
next to all other necessary files.

There is also `npm run watch` command which will monitor `/js` directory for
changes and rebuilds files if necessary.


## license

Livereloaded is licensed under MIT. See LICENSE for details.

[livereload protocol specification]: http://livereload.com/api/protocol/
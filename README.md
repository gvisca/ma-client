# Analytics for MeteorJS
This package has to be installed on the clients applications.

With the package installed, the app wil send informations to analytics server

## Client side package

### Server side events

**Event** : client_connexion
```javascript
{
    ip: this._session.socket.remoteAddress,
    headers: this._session.socket.headers,
    ddp: this._session.version,
    secure: clientParams.secure,
    preview: clientParams.preview,
    language: clientParams.language,
    referrer: clientParams.referrer,
    uid: clientParams.uid
}
```

**Event** : client_deconnexion
```
{
    count: _.size(self._session.server.sessions)
}
```

**Event** : log
```
{
    text: stdout,
}
```

**Event** : health
```
{
    cpus: os.cpus(),
    loadavg: os.loadavg(),
    totalmem: os.totalmem(),
    memory: (os.totalmem() - os.freemem()),
    processMem: process.memoryUsage().rss
}
```
** Example response **
```shell
health { cpus:
 [ { model: 'Intel(R) Core(TM) i7-4712MQ CPU @ 2.30GHz',
     speed: 800,
     times: [Object] },
   { model: 'Intel(R) Core(TM) i7-4712MQ CPU @ 2.30GHz',
     speed: 2301,
     times: [Object] },
   { model: 'Intel(R) Core(TM) i7-4712MQ CPU @ 2.30GHz',
     speed: 800,
     times: [Object] },
   { model: 'Intel(R) Core(TM) i7-4712MQ CPU @ 2.30GHz',
     speed: 800,
     times: [Object] },
   { model: 'Intel(R) Core(TM) i7-4712MQ CPU @ 2.30GHz',
     speed: 800,
     times: [Object] },
   { model: 'Intel(R) Core(TM) i7-4712MQ CPU @ 2.30GHz',
     speed: 2301,
     times: [Object] },
   { model: 'Intel(R) Core(TM) i7-4712MQ CPU @ 2.30GHz',
     speed: 800,
     times: [Object] },
   { model: 'Intel(R) Core(TM) i7-4712MQ CPU @ 2.30GHz',
     speed: 800,
     times: [Object] } ],
loadavg: [ 1.517578125, 1.6474609375, 1.49951171875 ],
totalmem: 12516794368,
memory: 11988996096,
processMem: 99954688,
appId: 'itJKKC4h4o9H8vv2g',
type: 'health' }
```


**Event** : server_info
```
{
    env: process.env,
    key: applicationId,
    arch: os.arch(),
    version: process.version,
    meteortics_version: meteortics_version,
    release: Meteor.release,
    platform: os.platform(),
    type: os.type(),
    processMem: process.memoryUsage().rss,
    hostname: os.hostname(),
    os_release: os.release(),
    webapp: typeof WebApp != "undefined" && WebApp.clientProgram ? WebApp.clientProgram : null,
    uptime: os.uptime(),
    memory: os.totalmem(),
    cpus: os.cpus(),
    networkInterfaces: os.networkInterfaces(),
    modules: process.versions,
    freemem: os.freemem(),
    loadavg: os.loadavg()
}
```

### Client side events
**Event** : boot
```
{
    connection: Meteor.connection._lastSessionId,
    time: new Date().getTime() - booted
}
```

**Event** : event
```
{
    template: template,
    selector: selector,
    formdata: $(tmpl.findAll('input[type=text],input[type=number],input[type=email],input[type=check],input[type=search],textarea,select')).serializeArray(),
    connection: Meteor.connection._lastSessionId
}
```

**Event** : page
```
{
    title: document.title,
    path: window.location.pathname,
    params: {},
    connection: Meteor.connection._lastSessionId
}
```

**Event** : event (for window activated events)
```
{
    template: "",
    selector: "Window activated",
    connection: Meteor.connection._lastSessionId
}
```

**Event** : event (for window in background events)
```
{
    template: "",
    selector: "Window in background",
    connection: Meteor.connection._lastSessionId
}
```

**Event** : event (for window error events)
```
{
    template: "",
    error: {
        stack: stack,
        line: event.lineno,
        filename: event.filename
    },
    selector: "Javascript Error",
    connection: Meteor.connection._lastSessionId
}
```









>	Github Flavored Markdown Cheatsheet.
>		GFM is a variant of markdown developed by Github.
https://help.github.com/articles/github-flavored-markdown
https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet

>	Plain Text

>	Headings
    Header 1
    ========

    Header 2
    --------

    # H1
    ## H2
    ### H3
    #### H4
    ##### H5
    ###### H6

>	Emphasis
    Emphasis (aka italics):		*asterisks* or _underscores_
    Strong emphasis (aka bold):	**asterisks** or __underscores__
    Combined emphasis:			**asterisks and _underscores_**
    Strikethrough:				~~Scratch this.~~

>	Lists
    In this example, leading and trailing spaces are shown with with dots: .

    1. First ordered list item
    2. Another item
    ..* Unordered sub-list.
    1. Actual numbers don't matter, just that it's a number
    ..1. Ordered sub-list
    4. And another item.

    ...You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).

    ...To have a line break without a paragraph, you will need to use two trailing spaces...
    ...Note that this line is separate, but within the same paragraph...
    ...(This is contrary to the typical GFM line break behaviour, where trailing spaces are not required.)

    * Unordered list can use asterisks
    - Or minuses
    + Or pluses

    In above \s means a "space" character

    - [ ] checkbox
    - [x] checked checkbox

>	URLs
    There are two ways to create links.

    [text](url)	Turn text into an URL.

    ![alt text](URL "title")  Place an image inline.

    ![alt text][label]
    [label]: URL "title"

    [I'm an inline-style link](https://www.google.com)

    [I'm an inline-style link with title](https://www.google.com "Google's Homepage")

    [I'm a reference-style link][Arbitrary case-insensitive reference text]

    [I'm a relative reference to a repository file](../blob/master/LICENSE)

    [You can use numbers for reference-style link definitions][1]

    Or leave it empty and use the [link text itself]

    Some text to show that the reference links can follow later.

    [arbitrary case-insensitive reference text]: https://www.mozilla.org
    [1]: http://slashdot.org
    [link text itself]: http://www.reddit.com

>	Images
    Inline-style:		![alt text](url "title")

    Reference-style:	![alt text][logo]

>	Code Blocks
    Markdown converts text with four spaces at the front of each line to code
    blocks. GFM supports that, but we also support fenced blocks. Just wrap your
    code blocks in ``` and you won't need to indent manually to trigger a code
    block. Keep in mind that both types of code blocks need to have a blank line
    before them:


    ```
    function test()
    {
        console.log("notice the blank line before this function?");
    }
    ```

    ```
    No language indicated, so no syntax highlighting.
    But let's throw in a <b>tag</b>.
    ```

>	Syntax highlighting
    Code blocks can be taken a step further to add syntax highlighting if you
    request it. In your fenced block, add an optional language identifier and
    it will run it through syntax highlighting. For example, to syntax highlight
    Ruby code:

    ```ruby
    require 'redcarpet'
    markdown = Redcarpet.new("Hello World!")
    puts markdown.to_html
    ```

    Linguist [https://github.com/github/linguist] is used to perform language
    detection and syntax highlighting. You can find out which keywords are valid
    by perusing the languages YAML file [https://github.com/github/linguist/blob/master/lib/linguist/languages.yml].

>	Tables
    Tables aren't part of the core Markdown spec, but they are part of GFM and
    Markdown Here supports them. They are an easy way of adding tables to your
    email -- a task that would otherwise require copy-pasting from another application.

    Colons can be used to align columns.

    | Tables        | Are           | Cool  |
    | ------------- |:-------------:| -----:|
    | col 3 is      | right-aligned | $1600 |
    | col 2 is      | centered      |   $12 |
    | zebra stripes | are neat      |    $1 |

    The outer pipes (|) are optional, and you don't need to make the raw
    Markdown line up prettily. You can also use inline Markdown.

    Markdown | Less | Pretty
    --- | --- | ---
    *Still* | `renders` | **nicely**
    1 | 2 | 3

>	Blockquotes
    > Blockquotes are very handy in email to emulate reply text.
    > This line is part of the same quote.

    Quote break.

    > This is a very long line that will still be quoted properly when it wraps. Oh boy let's keep writing to make sure this is long enough to actually wrap for everyone. Oh, you can *put* **Markdown** into a blockquote.

>	Inline html
    You can also use raw HTML in your Markdown, and it'll mostly work pretty well.

    <dl>
          <dt>Definition list</dt>
          <dd>Is something people use sometimes.</dd>

          <dt>Markdown in HTML</dt>
          <dd>Does *not* work **very** well. Use HTML <em>tags</em>.</dd>
    </dl>

>	Horizontal Rule
    Three or more...

    ---

    Hyphens

    ***

    Asterisks

    ___

    Underscores

>	Line Breaks
    My basic recommendation for learning how line breaks work is to experiment
    and discover -- hit <Enter> once (i.e., insert one newline), then hit it
    twice (i.e., insert two newlines), see what happens. You'll soon learn to
    get what you want. "Markdown Toggle" is your friend.

    Here are some things to try out:

    Here's a line for us to start with.

    This line is separated from the one above by two newlines, so it will be a *separate paragraph*.

    This line is also a separate paragraph, but...
    This line is only separated by a single newline, so it's a separate line in the *same paragraph*.

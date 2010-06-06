
taken from Indivo, used or SMArt prototype.

=====

Instructions at http://wiki.chip.org/indivo

All source code is licensed under GPLv3.

==============================

BASIC CONFIG:

NOTE: You should be running the UI server on port 80 and the "backend" server on port 8000!
If you don't, you'll need to hack the settings deep inside indivo_client_py (not recommended).

In your settings.py you will probably want to change

1. template dir
2. session file path

ALSO: Read the README file inside indivo_client_py to init it before first use!

If you are installing from a development checkout you will need to run the create_api script in the client!!


----------

Needs revision below:




QUESTIONS TO RESOLVE:

1. We need to figure out a javascript strategy based on JMVC 2.0. Thankfully,
JMVC is not jquery-ified and doesn't pollute the global namespace...

The Indivo User Interface Server (DRAFT)
----------------------------------------

Arjun Sanyal
(arjun.sanyal@childrens.harvard.edu)
2009-09-16


Requirements
------------

git submodules:

indivo_ui_server/indivo_client_py


How This Works
--------------

Indivo's UI is "modular" and can support multiple UI's. Here's how the 
default one works.

- A call is made to "GET /ui/" (maybe from /login)

    `GET /ui/` maps to `ROOT/indivo_ui/static/`

- User cookies are set (just session_id?)
- The `/templates/indivo_ui/index.html` file is read bringing in
  - css
  - JS Libraries: jquery, jquery_ui 
  - then the JMCV bundle (JMVC's code, controllers, external scripts)


All About JMVC
--------------

  - called with
    
        <script type="text/javascript" src="/ui/static/jmvc/include.js?default,development"></script>
    or 
        <"...include.js/default,production"> in index.html

- *NOTE*: Be careful not to double include JS scripts in index.html and in JMVC
- Compress includes with `./js apps/default/compress.js`


CSS Strategy
------------

- Old non-modular CSS locations (will keep around for now)
  - `ROOT/static/themes/base/css/(layout|style|tabs.css)`
  - `ROOT/static/themes/indivo/css/tabs.css` (override of base)

- New CSS locations
  - `ROOT/indivo_ui/resources/fluid960gs/css/(reset|text|grid|layout|nav).css`
  - `ROOT/indivo_ui/resources/jquery-ui-1.7.2/css/custom-theme/jquery-ui-1.7.2.custom.css`
  - `ROOT/indivo_ui/resources/css/indivo_ui.css`

- Strategy
  - We use fluid960gs's CSS as a baseline and don't modify these files
  - We override some of the CSS in `/indivo_ui/resources/css/indivo_ui.css`
    - 960.css - fixed version - this is not used, we use the fluid version
    - reset.css, grid.css, ie.css, ie6.css - these are the base files, don't override!
    - text.css, layout.css - partial override
    - nav.css - TODO: maybe unused or override
  - We use the same strategy for jquery-ui's theme CSS with overrides in `indivo_ui.css`


JS (and UI JS) Strategy
-----------------------

- Single-file vendor JS and our custom UI JS is in `/resources/js/`
- Our custom UI JS is named `ui.js` (FIXME: this likey can be removed -- use jmvc init here)
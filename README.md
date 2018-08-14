@whitetrefoil/pac-generator-server
==================================

A tiny koa server that generates PAC file from config file.


Usage
-----

```bash
npm i -g @whitetrefoil/pac-generator-server

# my_rules.toml is a new file
pac-generator-server my_rules.toml

# Write rules in it
vim my_rules.toml

# Execute on a existing file will start the server
pac-generator-server my_rules.toml
```

Then call the API (e.g. http://my.server.com/)

```bash
curl "http://my.server.com/my.pac?t=HTTPS&h=localhost&p=12345"
```

In the above query:

* **t** for **TYPE**, e.g. HTTPS, SOCKS, default is PROXY
* **h** for **HOST**, default is localhost
* **p** for **PORT**, this one is **REQUIRED**


Changelog
---------

### v0.1.0

* Initial release.

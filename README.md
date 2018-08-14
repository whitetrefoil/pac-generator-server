@whitetrefoil/pac-generator-server
==================================

A tiny koa server that generates PAC file from config file.


Usage
-----

### Install, Configure, Start

```bash
# Install globally
npm i -g @whitetrefoil/pac-generator-server

# Assume here "my_rules.toml" is not existed yet
pac-generator-server my_rules.toml

# Write rules in it
vim my_rules.toml

# Assume the content of "my_rules.toml" is:
#     host = "my.server"
#     port = 48332
#     pacDir = "tests/pac"
#     prefix = "/pac"

# Make dir to put PAC definition files
mkdir -p tests/pac

# Write some definition files
vim tests/pac/test.toml

# Assume the content of "tests/pac/test.toml" is:
#     rules = [
#     "*domain*",
#     "*.subdomain.com",
#     "another.com",
#     ]

# Execute on a existing file will start the server
pac-generator-server my_rules.toml
```

### PAC definition file

The definition file is a TOML file, looks like below:

```toml
rules = [
"domain.com",
"*.subdomain.com",
"*keyword*",
]
```

There are 3 type of rule can be use:

1. Domain - A rule contains no `*` will become `dnsDomainIs(host,"${rule}")`
2. Sub-domain only - Contains exact 1 `*` will become `shExpMatch(host,"${rule}")`
3. Keyword - Contains 2 or more `*` will become `shExpMatch(url,"${rule}")`

### Request the PAC from API

```bash
curl "http://my.server:48332/my.pac?t=HTTPS&h=localhost&p=12345"
```

In the above query:

* **t** for **TYPE**, e.g. HTTPS, SOCKS, default is PROXY
* **h** for **HOST**, default is localhost
* **p** for **PORT**, this one is **REQUIRED**


Changelog
---------

### v0.1.3

* Fix wrong changelog order.

### v0.1.2

* Fix missing bin file in "bin" dir.

### v0.1.1

* Add missing `npm publish` checklist js.

### v0.1.0

* Initial release.

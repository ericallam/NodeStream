## Summary:

A twitter userstream app using node.js and browser websockets

## Requirements:

* Node >= 1.9.3
* kiwi (node package manage)
* twitter-userstream

## Installation

* git clone git@github.com:rubymaverick/NodeStream.git
* Install twitter-userstream:

    `kiwi install twitter-userstream`


* add nodestream.local to your hosts file (pointing to 127.0.0.1)
* Setup apache to serve the files

#### Example Apache Config


      <VirtualHost nodestream.local:80>
        ServerName nodestream.local
        DocumentRoot "/path/to/nodestream"
        <directory "/path/to/nodestream">
          Order allow,deny
          Allow from all
        </directory>
      </VirtualHost>
    
* run the server:
    `node server.js 'username:password'`
    
* open up index.html in webkit nightly (for right now its the only browser that works with @anywhere)




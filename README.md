## Summary:

A twitter userstream app using node.js, websockets, and mongodb.  And edit!

## Requirements:

* Node >= 1.9.3
* kiwi (node package manage)
* twitter-userstream
* mongodb

## Installation

* git clone git@github.com:rubymaverick/NodeStream.git
* cd NodeStream; git submodule update --init
* Install twitter-userstream:

    `kiwi install twitter-userstream`


* add nodestream.local to your hosts file (pointing to 127.0.0.1)
* Install mongodb if you don't have it already and run it on the default mongodb port
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




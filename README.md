# FarMar - Find Your Market

Project Description

Using JavaScript, jQuery, an open source API, HTML and CSS to build an app that finds local farmers markets based on zip code.

My goal was to:
  - Make it easy for people to find local food sources near them
  - Display data like market names, locations, hours, and products
  - Support small farms and the local food movement through tech!

Day 1

I set up some basic HTML and started testing the USDA's API for farmers markets. I realized that you could query the API either by zipcode, OR by market details - the former returns markets local to a zip, and the latter returns content like market addresses, hours, and products typically carried.

I assigned the zip variable to query based on a user's input. Then, once the array of markets was returned, each name was associated with that market's national "ID", which became my method of querying for specific markets' details.

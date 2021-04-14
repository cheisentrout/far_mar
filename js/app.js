$(() => { //BEGIN window.onload

  $('#clear').hide()

  /*====== GLOBAL VARS ======*/

  const $pageHeader = $('header')
  const $submit = $('#submit')
  const $mktResultCont = $('#mktname-results')
  const $mktResSummary = $('#res-summary')
  const $mktSpecs = $('#mkt-specs')
  const imgArr = ['./img/ann_arbor.jpg', './img/banana_boxes.jpg', './img/berries.jpg', './img/bread.jpg', './img/cheese.jpg', './img/crowded_street.jpg', './img/eggs.jpg', './img/flower_buckets.jpg', './img/open_mic.jpg', './img/pink_flowers.jpg', './img/quality_meat.jpg', './img/salad_greens.jpg', './img/vendor.jpg']

  /*====== SUBMIT BTN EVENT ======*/

  $submit.on('click', (event) => {

    event.preventDefault()
    $mktResultCont.children().remove()
    $('.mkt-num').remove()
    $mktSpecs.empty()
    $mktSpecs.hide()
    $('#clear').show()

    //store the user's input in a variable
    const $userZip = $('#search-bar').val()
    //then reset the input field to blank
    $('#search-bar').val('')

    $.ajax({
      //Query the API based on the zipcode input by the user
      url: `https://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=${$userZip}`

    }).then(
      (data) => {

        // $('header').addClass('with-results')
        console.log(data);
        //Data is returned in an object, so I created a variable to store the array of objects within the "results" key, which the data returns.
        const resArr = data.results
        const idArr = []

          //for the length of the resArr, do the following:
          for (let i = 0; i < resArr.length; i++) {
            //create an article for each result that's returned

            if (resArr[i].id !== "Error") {

              $('header').addClass('with-results')
              const $mktArt = $('<article>').addClass('mkt-article')

              const mktNameWithNum = resArr[i].marketname
              const mktNameNoNum = mktNameWithNum.split(' ').slice(1).join(' ')

              //create an h3 that will have the text of the marketname key from the results array - give each the class of 'market-result'
              const $mktName = $('<h3>').html(mktNameNoNum).addClass('mkt-result')
              //Store the result array key ID in a variable
              const $mktID = resArr[i].id
              idArr.push($mktID)
              // console.log(`The array of market id's is: ${idArr}.`);
              //Add the value of the ID key to the marketName element as an ID
              $mktName.attr('id', `${$mktID}`)
              $mktArt.append($mktName)
              $mktResultCont.append($mktArt)
              $mktResultCont.css('background-image', `url(${imgArr[Math.floor(Math.random() * imgArr.length)]})`)
            // }
            } else {
              idArr.push(resArr[i].id)
              console.log(idArr);
              alert(`We didn't recognize the zip code ${$userZip}. Please try a different zip code.`)
            }
          }

        //element that will display total number of markets near userZip:
        const $carItemNum = $('<h3>').html(`There are ${resArr.length} markets near zipcode ${$userZip}!`).addClass('mkt-num')
        const $nextArrow = $('<i>').addClass("fas fa-long-arrow-alt-right")
        const $prevArrow = $('<i>').addClass("fas fa-long-arrow-alt-left")

        if (idArr.includes("Error") === false) {
          $mktResSummary.append($carItemNum)
          $('#mktname-results').prepend($prevArrow).append($nextArrow)
        }

          /*====== CAROUSEL OF MARKETS ======*/
          //currentIndex has to start at 1 so that it doesn't include the previous arrow
          let currentArtIndex = 1;
          //last index has to subtract 2 so that it doesn't include the next arrow
          let lastIndex = $('#mktname-results').children().length - 2
          // console.log(lastIndex);

          /*===== NEXT ARROW CLICK FCTN =======*/
          $nextArrow.on('click', (event) => {

            $('#mktname-results').children().eq(currentArtIndex).css('display', 'none')
            $mktResultCont.css('background-image', `url(${imgArr[Math.floor(Math.random() * imgArr.length)]})`)

            if (currentArtIndex < lastIndex) {
              currentArtIndex++
            } else {
              currentArtIndex = 1
            }

            $('#mktname-results').children().eq(currentArtIndex).css({'display': 'flex', 'align-items': 'center', 'justify-content': 'center'})

          })
          /*===== PREVIOUS ARROW CLICK FCTN ======*/
          $prevArrow.on('click', (event) => {

            $('#mktname-results').children().eq(currentArtIndex).css('display', 'none')
            $mktResultCont.css('background-image', `url(${imgArr[Math.floor(Math.random() * imgArr.length)]})`)

            if (currentArtIndex > 1) {
              currentArtIndex--
            } else {
              currentArtIndex = lastIndex
            }

            $('#mktname-results').children().eq(currentArtIndex).css({'display': 'flex', 'align-items': 'center', 'justify-content': 'center'})

          })

          scroll({
            top: 450,
            left: 0,
            behavior: 'smooth'
          })

      /*======== MARKET NAME ON CLICK ========*/
      //any element with the class mkt-result, do the following on click:
        $('.mkt-result').on('click', (event) => {
          console.log(event)
          //first, remove any market specs that already populate the page (from a previous search)
          $mktSpecs.empty()
          // Window.scroll(600, 400)

          //store the event's current target in a variable
          const $mktName = $(event.currentTarget)
          //store the currentTarget's id as a variable
          const $mktID = $(event.currentTarget).attr('id')

          $.ajax({
            //query the API for the market id assigned to the event target
            url: `https://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=${$mktID}`
          }).then(
            (data) => {
              console.log(`LOCAL MARKET DETAILS DATA:`);
              console.log(data);
              $mktSpecs.show()
              const $mktDetails = data.marketdetails
              // console.log($mktDetails)
              //what if right here, we could perform a google maps query for the data.marketdetails.Address of the event.currentTarget?
              const $address = $('<p>')
                .html($mktDetails.Address)
                .attr('id', 'address')
                .addClass('mkt-specs')
              const $mapLink = $('<a>')
                .html(`Find on Google Maps`)
                .attr('href', `${$mktDetails.GoogleLink}`)
                .attr('target', `${$mktDetails.GoogleLink}`)
                .addClass('mkt-specs')
                console.log($mktDetails.GoogleLink);
              const googleSearch = $mktDetails.Address.split(' ').join('+')
              console.log(googleSearch);
              // $.ajax({
              //   url: `https://www.google.com/maps/embed/v1/place?key=AIzaSyCpOYsYQDi7AYlherWrBKR7rhDZT86L1Fc&q=${googleSearch}>`
              // }).then(
              //   (data) => {
              //     console.log(data);
              //   }
              // )
              const $map = $('<iframe>')
                .attr('src', "https://www.google.com/maps/embed/v1/place?q=place_id:ChIJCzYy5IS16lQRQrfeQ5K5Oxw&key=AIzaSyCpOYsYQDi7AYlherWrBKR7rhDZT86L1Fc")
              .css({'width': '100%', 'height': '250px'})

              const $prodHeader = $('<h4>').html(`This market carries the following products!`)
              const $prodList = $('<ul>')
                .addClass('mkt-specs')
              const splitProducts = $mktDetails.Products.split(';')
              for (let i = 0; i < splitProducts.length; i++) {
                const $product = $('<li>').html(splitProducts[i]).addClass('mkt-specs').addClass('list-item')
                $prodList.append($product)
              }
              const $prodChooser = $('<h4>').html(`Select a product to see other markets in your area that carry similar items.`)
              const $schedule = $('<p>')
                .html($mktDetails.Schedule)
                .addClass('mkt-specs')
              const $mktNameHeader = $('<h2>')
                .html($mktName.html())
                .addClass('mkt-specs')
              const $addAndSchedCont = $('<div>').attr('id', 'addAndSched').addClass('addAndSched')

              $addAndSchedCont.append($address)
              $addAndSchedCont.append($schedule)
              $addAndSchedCont.append($mapLink)
              $mktSpecs.css({'background-color': '#D6DCD8', 'padding': '20px'})
              $mktSpecs.append($mktNameHeader)
              $mktSpecs.append($addAndSchedCont)
              $mktSpecs.append($map)
              $mktSpecs.append($prodHeader)
              $mktSpecs.append($prodList)
              $mktSpecs.append($prodChooser)

              // const numOfProducts = $('.list-item')
              // console.log(numOfProducts);
              scroll({
                top: 650,
                left: 0,
                behavior: 'smooth'
              })

              $('ul').on('click', (event) => {
                // console.log($(event.currentTarget));
                // console.log($(event.target));

                //need to add a conditional here: if substring(1) == " "
                // if ($(event.target).html().substring(1) === ' ') {
                //   const prodHTML = $(event.target).html().substring(1)
                // } else {
                //   const prodHTML = $(event.target).html()
                // }
                $('.mktMatch').remove()
                const prodHTML = $(event.target).html().substring(1)
                console.log(prodHTML);

                const $matchHeader = $('<p>').html(`Nice! These markets also carry ${prodHTML}:`).addClass('mktMatch')
                $mktSpecs.append($matchHeader)


                for (let i = 0; i < resArr.length; i++) {
                  // console.log(`Market IDs for this zip: ${resArr[i].id}`);
                  $.ajax({
                    //query the API for the market id assigned to the event target
                    url: `https://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=${resArr[i].id}`
                  }).then(
                    (data) => {
                      console.log(data); //returns local marketdetails as objects
                      const products = data.marketdetails.Products.split("; ") //try a backslash before space
                      const productArr = [] //start with an empty array each time, so that it's fresh for each specific market check
                      productArr.push(products)
                      //something here so it doesn't display current market selection
                      if (productArr[0].includes(prodHTML)) {
                        // console.log(`We've got a match! ${resArr[i].marketname} also carries ${prodHTML}.`);
                        // const $matchHeader = $('<p>').html(`Nice! These markets also carry ${prodHTML}:`).addClass('mktMatch')
                        const $mktMatch = $('<h3>').html(resArr[i].marketname.split(' ').slice(1).join(' ')).addClass('mktMatch')
                        // $mktSpecs.append($matchHeader)
                        $mktSpecs.append($mktMatch)
                      } else {
                        console.log(`${resArr[i].marketname} does not carry ${prodHTML}`);
                      }
                    }
                  ) //end .then()
                } //end result array for loop
                scroll({
                  top: 1600,
                  left: 0,
                  behavior: 'smooth'
                })
              }) //end ul on click

            },
            () => {
              console.log('request did not work');
            }
          ) //end second AJAX request (Market details)
        }) // end mktName click listener
      },
      () => {
        console.log('request did not work');
      }
    ) // end first AJAX request (market by zip)
  }) // end SUBMIT click listener

  $('#clear').on('click', (event) => {
    // console.log('clear was clicked');
    $('.mkt-num').remove()
    $('.mkt-article').remove()
    $('i').remove()
    $('.mkt-specs').remove()
    $mktSpecs.empty()
    $mktSpecs.hide()
    $pageHeader.removeClass('with-results')
    $('#clear').hide()
  })

}) //END window.onload


/*======================================================
-------------------------------------------------------
PROGRAM NOTES AND ATTEMPTS BELOW
-------------------------------------------------------
=======================================================*/

// http://maps.google.com/?q=42.165956%2C%20-83.781146%20(%22Saline+Farmers+Market%22

// let $zip = '48103'
// let zip = $('input[type="text"]').val()
// let id = 1020005
// console.log(zip);
// const $searchBar = $('#search-bar').html('test')
// console.log($searchBar);

/*======= BELOW QUERY WORKS returns marketDetails by spec. ID ========*/
// $.ajax({
//   url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + id,
//   //might have to do separate queries - zip and then id will provide market details like season, address, and products
// }).then(
//   (data) => {
//     console.log(data);
//   },
//   () => {
//     console.log('request did not work');
//   }
// )
/*==================== END marketDetails query ========================*/

// function getResults(zip) {
//     // or
//     // function getResults(lat, lng) {
//     $.ajax({
//         type: "GET",
//         contentType: "application/json; charset=utf-8",
//         // submit a get request to the restful service zipSearch or locSearch.
//         url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + zip,
//         // or
//         // url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/locSearch?lat=" + lat + "&lng=" + lng,
//         dataType: 'jsonp',
//         jsonpCallback: 'searchResultsHandler'
//     })
// }
// //iterate through the JSON result object.
// function searchResultsHandler(searchResults) {
//     for (var key in searchresults) {
//         alert(key);
//         var results = searchresults[key];
//         for (var i = 0; i < results.length; i++) {
//             var result = results[i];
//             for (var key in result) {
//                 //only do an alert on the first search result
//                 if (i == 0) {
//                     alert(result[key]);
//                 }
//             }
//         }
//     }
// }
// searchResultsHandler(48103)
// getResults('48103')

// mktDetail?id=" + id,
//might have to do separate queries - zip and then id will provide market details like season, address, and products
//query by zip

          // console.log(`${resArr[i].marketname}'s ID is: ${$marketName.attr('id')}`);

/* Trying to account for unrecognized zips */

//   if (resArr[i].id = "Error") {
//     alert(`We didn't recognize the zip code ${$userZip}. Please try a different zip code.`)
//   } else {
//     const $mktArt = $('<article>').addClass('mkt-article')
//
//     const mktNameWithNum = resArr[i].marketname
//     const mktNameNoNum = mktNameWithNum.split(' ').slice(1).join(' ')
//
//     //create an h3 that will have the text of the marketname key from the results array - give each the class of 'market-result'
//     const $mktName = $('<h3>').html(mktNameNoNum).addClass('mkt-result')
//     //Store the result array key ID in a variable
//     const $mktID = resArr[i].id
//     idArr.push($mktID)
//     console.log(idArr);
//     //Add the value of the ID key to the marketName element as an ID
//     $mktName.attr('id', `${$mktID}`)
//     $mktArt.append($mktName)
//     $mktResultCont.append($mktArt)
//     $mktResultCont.css('background-image', `url(${imgArr[Math.floor(Math.random() * imgArr.length)]})`)
//   }
// }

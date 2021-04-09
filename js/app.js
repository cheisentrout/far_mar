console.log('app.js hooked up');
console.log($);

// let $zip = '48103'
// let zip = $('input[type="text"]').val()
// let id = 1020005
// console.log(zip);
// const $searchBar = $('#search-bar').html('test')
// console.log($searchBar);

$(() => { //BEGIN window.onload

  /*====== GLOBAL VARS ======*/

  const $submit = $('#submit')
  const $mktResultCont = $('#mktname-results')

  /*====== SUBMIT BTN EVENT ======*/

  $submit.on('click', (event) => {

    event.preventDefault()

    //store the user's input in a variable
    const $userZip = $('#search-bar').val()
    //then reset the input field to blank
    $('#search-bar').val('')

    $.ajax({
      //Query the API based on the zipcode input by the user
      url: `http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=${$userZip}`

    }).then(
      (data) => {

        console.log(data);
        //Data is returned in an object, so I created a variable to store the arrays within the "results" key, which the data returns.
        const resArr = data.results
        //for the length of the resArr, do the following:
        for (let i = 0; i < resArr.length; i++) {
          //create an article for each result that's returned
          const $mktArt = $('<article>').addClass('mkt-article')
          //create an h3 that will have the text of the marketname key from the results array - give each the class of 'market-result'
          const $mktName = $('<h3>').html(resArr[i].marketname).addClass('mkt-result')
          //Store the result array key ID in a variable
          const $mktID = resArr[i].id
          //Add the value of the ID key to the marketName element as an ID
          $mktName.attr('id', `${$mktID}`)
          $mktArt.append($mktName)
          $mktResultCont.append($mktArt)
        }
        const $nextArrow = $('<i>').addClass("fas fa-long-arrow-alt-right")
        $('#mktname-results').append($nextArrow)

      /*======== MARKET NAME ON CLICK ========*/
        $('.mkt-result').on('click', (event) => {
          const $mktName = $(event.currentTarget)
          // console.log($(event.currentTarget).attr('id'));
          const $mktID = $(event.currentTarget).attr('id')
          console.log($mktID);
          $.ajax({
            url: `http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=${$mktID}`
          }).then(
            (data) => {
              console.log(data);
              const $mktDetails = data.marketdetails
              // console.log($mktDetails);
              const $address = $mktDetails.Address
              const $map = $mktDetails.GoogleLink
              const $products = $mktDetails.Products
              const $schedule = $mktDetails.Schedule
              console.log($address);
              console.log($map);
              console.log($products);
              console.log($schedule);

            },
            () => {
              console.log('request did not work');
            }
          )

        })

      },
      () => {
        console.log('request did not work');
      }
    )
  })

  $('#clear').on('click', (event) => {
    console.log('clear was clicked');
    $('.mkt-article').remove()
  })

}) //END window.onload

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

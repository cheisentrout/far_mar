console.log('app.js hooked up');
console.log($);

// let $zip = '48103'
// let zip = $('input[type="text"]').val()
// let id = 1020005
// console.log(zip);
// const $searchBar = $('#search-bar').html('test')
// console.log($searchBar);

$(() => { //BEGIN window.onload

  const $submit = $('#submit')
  console.log($submit);

  $submit.on('click', (event) => {
    console.log('submit was clicked');
    console.log(event.currentTarget);
    event.preventDefault()

    const $userZip = $('#search-bar').val()
    console.log($userZip);
    $('#search-bar').val('')

    $.ajax({
      url: `http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=${$userZip}`

      // mktDetail?id=" + id,
      //might have to do separate queries - zip and then id will provide market details like season, address, and products
      //query by zip
    }).then(
      (data) => {
        console.log(data);
        // console.log(typeof data); //this returns an OBJECT
        // const resArr = data
        // console.log(resArr);
        // console.log(data.results[0]);
        const resArr = data.results
        for (let i = 0; i < resArr.length; i++) {
          console.log('Loop ran');
          const $marketName = $('<p>').html(resArr[i].marketname).attr('href', '').addClass('market-result')
          const $marketID = resArr[i].id
          // console.log($marketID);
          $marketName.attr('id', `${$marketID}`)
          console.log(`${resArr[i].marketname}'s ID is: ${$marketName.attr('id')}`);
          // console.log(data[i].marketname);
          $('body').append($marketName)
        }
        $('.market-result').on('click', (event) => {
          console.log('market result was clicked');

        })

      },
      () => {
        console.log('request did not work');
      }
    )
  })

  $('#clear').on('click', (event) => {
    console.log('clear was clicked');
    $('.market-result').remove()
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

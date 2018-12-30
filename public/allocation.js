

$('td:contains("$init")').each(function(){
    $(this).html($(this).html().split("$init").join("<span hidden='true'>$init</span>"));
});

$('td:contains("|")').each(function(){
    $(this).html($(this).html().split("|").join("-"));
});

$('td:contains("chutes")').each(function(){
    $(this).html($(this).html().split("chutes").join("Chill Pick"));
});

$('td:contains("mts")').each(function(){
    $(this).html($(this).html().split("mts").join("De-Kit"));
});

$('td:contains("trucks")').each(function(){
    $(this).html($(this).html().split("trucks").join("Reach Truck"));
});


$('td:contains("manual_pick")').each(function(){
    $(this).html($(this).html().split("manual_pick").join("Checking"));
});




// '.tbl-content' consumed little space for vertical scrollbar, scrollbar width depend on browser/os/platfrom. Here calculate the scollbar width .
$(window).on("load resize ", function() {
  var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
  $('.tbl-header').css({'padding-right':scrollWidth});
}).resize();



$("check").on('change', function() {
  if ($(this).is(':checked')) {
    $(this).attr('value', 'true');
     
  } else {
    $(this).attr('value', 'false');
    
  }
  
 });

$("check").is(':checked', function(){
              $("check").attr('value', 'true');
          });

$("form").submit(function() {
    $("input").removeAttr("disabled");
});

function check() {
    document.getElementByClassName("check").checked = true;
}

function uncheck() {
    document.getElementByClassName("check").unchecked = false;
}

var rotas = {
  earlies: {
    w1: [0,1,1,1,1,0,1],
    w2: [1,1,1,1,0,1,1],
    w3: [1,0,0,1,1,1,1],
    w4: [0,0,1,1,1,1,0],
    w5: [0,1,1,1,0,1,1],
    w6: [1,1,1,0,1,1,1],
    w7: [1,1,0,0,0,1,1],
    w8: [0,1,1,1,1,0,0]
  },

  middles: {
    w1: [0,1,1,1,1,0,0],
    w2: [1,1,1,1,0,1,1],
    w3: [1,0,0,1,1,1,1],
    w4: [1,0,1,1,1,1,0],
    w5: [0,1,1,1,0,1,1],
    w6: [1,1,0,0,1,1,1],
    w7: [1,1,0,0,1,1,1],
    w8: [1,0,1,1,1,1,0] 
  },

  nights: {
    w1: [1,1,1,0,0,1,1],
    w2: [1,1,0,0,1,1,1],
    w3: [1,0,0,1,1,1,0],
    w4: [0,1,1,1,1,0,0],
    w5: [1,1,1,0,0,1,1],
    w6: [1,0,0,1,1,1,1],
    w7: [1,0,0,1,1,1,0],
    w8: [0,1,1,1,1,0,0]
  }
}


// -------------------------------------------------------------------------------------------------



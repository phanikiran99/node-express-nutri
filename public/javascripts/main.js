$(function(){
 $('#loading').hide()
 $('#search').on('keyup', function(e){
   if(e.keyCode === 13) {
	 $('#loading').show()
	 //$('#chartContainer').hide()	 
     var parameters = { search: $(this).val() };
       $.get( '/searching',parameters, function(results) {
	   console.log(results);
	   $('#results').html(results);
	   $('#loading').hide() ;
    });
 };
});
});
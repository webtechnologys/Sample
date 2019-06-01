$(document).ready(function(){
  // alert("hi");
  $(".delete").click(function(){
     // alert("clicked");
     var id = $(this).val();
     // alert(id);
     $.post("/remove",{no:id},function(data){
       location.reload('/'); 
     });
  });
});
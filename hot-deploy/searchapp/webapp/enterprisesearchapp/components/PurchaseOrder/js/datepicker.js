$('.input-group.date').datepicker({
 format: "yyyy/mm/dd",
 startDate: "2012-01-01",
 endDate: "2015-01-01",
 todayBtn: "linked",
 autoclose: true,
 todayHighlight: true
});

$(".text-date").click(function(){
 $(".datepicker").toggle();
});

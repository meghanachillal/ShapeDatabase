

//##############################################
var SERVER_URL = 'http://dev.cs.smu.ca:8104';
//##############################################

var index = 0;
var currentposition = 0;
var val = true;

function shapeDetails(shape,colour){
	
 	$("#index").text("Index : "+currentposition);
      	$("#displayshape").text("Shape : "+shape);
        $("#colour").text("Colour : "+colour);
          
        $("#index").css("color",colour);
        $("#displayshape").css("color",colour);
        $("#colour").css("color",colour);

} 

function fillstrokeshapes(shape, style , colour){
	 var canvas = document.getElementById("canvasElement");//get the element
	 var ctx = canvas.getContext("2d");//get the content
    	 var w = $('#canvasElement').width();
	 var h = $('#canvasElement').height();

				//clear
	ctx.clearRect(0, 0, w, h);

			if (style == "FILL")
				{
				ctx.fillStyle = colour;

				switch (shape) {
					case 'circle':
						ctx.beginPath();
						ctx.arc(w / 2, h / 2, w / 2, 0, 2 * Math.PI);
						ctx.fill();
						break;
					case 'rectangle':
						ctx.fillRect(0, 0, w, h);
						break;
					case 'triangle':
						ctx.beginPath();
						ctx.moveTo(0, h);
						ctx.lineTo(w / 2, 0);
						ctx.lineTo(w, h);
						ctx.closePath();
						ctx.fill();
					}   //end Switch
					
				}
				
			else 
				{
					ctx.strokeStyle = colour;

				switch (shape) {
					case 'circle':
						ctx.beginPath();
						ctx.arc(w / 2, h / 2, w / 2, 0, 2 * Math.PI);
						ctx.stroke();
						break;
					case 'rectangle':
						ctx.strokeRect(0, 0, w, h);
						break;
					case 'triangle':
						ctx.beginPath();
						ctx.moveTo(0, h);
						ctx.lineTo(w / 2, 0);
						ctx.lineTo(w, h);
						ctx.closePath();
						ctx.stroke();
					}//end switch()
				}
				
}

function validateData() {
	
     var shape = $("#shape").val();
    var colour = $("#colorname").val();
	

    if (shape == 'Please select a shape') {
        alert("Please select the shape!");
        $("#shape").focus();
        return false;
    }
    if (colour == '') {
        alert("Please enter the colour!");
        $("#colorname").focus();
        return false;
    }
	 		
    return true;
}


function emptyFields() {
    $("#shape").val('');
    $("#colorname").val('');

}

$('#saveButton').click(
        function () {
		var currentposition=0;
            if (validateData()) {
				var savestyle = '';
				var isFill = $('#rdIsFillYes')[0].checked;				
				if (isFill) {
				savestyle = "FILL";
				}
				else{
				savestyle = "STROKE";
				}
                //create an object
				
				$.post(SERVER_URL + '/getAllShapes',
                    null,
				function (data){
					index = data.length;
				});
			
                var newObj = {
					"Shape": $("#shape").val(),
                  			"Colour": $("#colorname").val(),
					"Style":savestyle
                };

	
                    $.post(SERVER_URL + "/saveShape",
                        newObj,
                        function (data) {
                            alert(data);

                            //now empty the fields
                            emptyFields();

                        }).fail(function (error) {
                    alert(error.responseText);
                });


            }//end if validateData()

        }//end function
);


$('#nextButton').click(
        function () {
		
            //#############################################
            //now empty the fields if something in
            emptyFields();

            //first grab the name of the university
          
			var shapes = [];//place holder

            $.post(SERVER_URL + '/getAllShapes',
                    null,
		    function (data) {

			
			//if found, use it, at this point, it's still an array!
			shapes = data;
			
			if (val){
				currentposition = data.length - 1;
				val = false;
			}
			else{
				currentposition = currentposition - 1;
				
				}

			if (shapes == null || shapes.length == 0) {
			    //no record whatsoever, let the user know
			    alert("No record found");
			    
			}
			else {
			    
                 	 var i = currentposition;			    
			 var shape = shapes[i].Shape;
			    var colour = shapes[i].Colour; 
			    var style = shapes[i].Style; 

			    //now fill the fields
			    $("#shape").val(shape);
			    $("#colorname").val(colour);
			  setTimeout(fillstrokeshapes(shape,style,colour),100);
		          shapeDetails(shape,colour);

			  alert('Records downloaded successfully!');
			
			}
			
			
		    }).fail(function (error) {
			alert(error.responseText);
		    });

            //#############################################

			}
);


$('#previousButton').click(
        function () {
		
            //#############################################
            //now empty the fields if something in
            emptyFields();

            var shapes = [];//place holder

            $.post(SERVER_URL + '/getAllShapes',
                    null,
		    function (data) {

			
			//if found, use it, at this point, it's still an array!
			shapes = data;
				currentposition = currentposition+1;
				
			if (shapes == null || shapes.length == 0) {
			    //no record whatsoever, let the user know
			    alert("No record found");
			    
			}
			else {
			     var i = currentposition;//potentially, you could find a way to select which one if multiple

			    var shape = shapes[i].Shape;//Name attribute
			    var colour = shapes[i].Colour; // Address attribute
			    var style = shapes[i].Style; //PhoneNumber attribute

			    //now fill the fields
			    $("#shape").val(shape);
			    $("#colorname").val(colour);
			    setTimeout(fillstrokeshapes(shape,style,colour),100);
			    shapeDetails(shape,colour);

				
			alert('Records downloaded successfully!');
			
			}
			
			
		    }).fail(function (error) {
			alert(error.responseText);
		    });

			}
);


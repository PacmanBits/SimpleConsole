/*
//////////////////////////////////////////////////
//                                              //
//                                              //
//    Title(to)Tooltip       Sanford Gifford    //
//    v1.1                    March 31, 2015    //
//                                              //
//                                              //
//////////////////////////////////////////////////

Small, low-footprint console to use when a
brower's console is not available.  Supports calls
to console.log, and console.error, as well as
basic evaluation functionality.
*/

(function()
{
	var consoleHiddenAtStart = false ;
	var pageLoaded           = false ;
	var target               = null  ;
	
	$(function()
	{
		var expanded = false;
		
		var consoleElement = $("<div class='debugZone'>").append(
			$("<div id='debugText'>")
				.css({ // Main text zone
					"position"         : "absolute",
					"left"             : "10px",
					"right"            : "0",
					"bottom"           : "35px",
					"top"              : "10px",
					"padding"          : "5px",
					"font-family"      : "monospace",
					"background-color" : "white",
					"overflow-x"       : "hidden",
					"overflow-y"       : "auto"
				}),
			$("<div>")
				.css({ // Open/close div
					"width"            : "30px",
					"height"           : "30px",
					"border-radius"    : "0 0 15px 0",
					"background-color" : "rgba(50, 50, 50, .5)",
					"position"         : "absolute",
					"left"             : "10px",
					"top"              : "10px"
				})
				.click(function()
				{
					if(!expanded)
						$(this).closest(".debugZone").animate({"right" : "0", "bottom" : "0"});
					else
						$(this).closest(".debugZone").animate({"right" : "-40%", "bottom" : "-40%"});
					
					expanded = !expanded;
				})
				.mouseover(function()
				{
					$(this).stop().fadeTo(500, 1.0);
				})
				.mouseleave(function()
				{
					$(this).stop().fadeTo(500, 0.1);
				})
				.fadeTo(0.5, 0.1),
			$("<form>")
				.append(
					$("<input type='text'>")
						.css({
							"display"          : "block",
							"position"         : "absolute",
							"bottom"           : "0",
							"left"             : "0",
							"width"            : "70%",
							"height"           : "15px",
							"text-size"        : "15px",
							"padding"          : "10px 5%",
							"font-family"      : "monospace",
							"border"           : "none",
							"background-color" : "#EEE"
						}),
					$("<input type='submit'>")
						.css({
							"display"          : "block",
							"position"         : "absolute",
							"bottom"           : "0",
							"right"            : "0",
							"width"            : "20%",
							"height"           : "35px",
							"text-size"        : "15px",
							"padding"          : "10px 5%",
							"font-family"      : "monospace",
							"border"           : "none",
							"background-color" : "#DDD"
						})
						.val("->")
				)
				.css({
					"position"         : "absolute",
					"bottom"           : "0",
					"left"             : "10px",
					"right"            : "0",
				})
				.submit(function(e)
				{
					e.preventDefault();
					var line = $(this).children("input").val();
					
					console.log(line, { resolve : true });
					
					$(this).children("input").val("");
					$(this).focus();
				})
		)
			.css({
				"font-size"        : "10px",
				"position"         : "fixed",
				"width"            : "50%",
				"height"           : "50%",
				"right"            : "-40%",
				"bottom"           : "-40%",
				"z-index"          : "9999",
				"padding"          : "10px",
				"background-color" : "rgba(0, 0, 0, 0.25)",
				"border-radius"    : "10px 0 0 0",
				"font-family"      : "monospace",
				"overflow"         : "hidden",
				"box-shadow"       : "5px 5px 25px 0 rgba(0, 0, 0, 0.5)"
			});
		
		$("body").append(consoleElement);
		
		console.hide = function()
		{
			consoleElement.hide();
		};
		
		console.show = function()
		{
			consoleElement.show();
		};
		
		console.toggle = function()
		{
			consoleElement.toggle();
		};
		
		if(consoleHiddenAtStart)
			console.hide();
		
		pageLoaded = true;
//		target = $(".debugZone");
		target = $("#debugText");
		
		for(var line in console.lines)
		{
			target.append(console.lines[line].$);
		}
		
		target.scrollTop(target.prop("scrollHeight"));
	});
	
	var defaultOptions = {
		color   : "#333" ,
		resolve : false
	};
	
	console = {
		lines   : [],
		hide      : function()
		{
			consoleHiddenAtStart = true;
		},
		show      : function()
		{
			consoleHiddenAtStart = false;
		},
		toggle    : function()
		{
			consoleHiddenAtStart = !consoleHiddenAtStart;
		},
		log       : function(line, options)
		{
			var opts = {};
			$.extend(opts, defaultOptions, options);
			
			
			var textArea = $("<div>")
				.css({
					"color"            : opts.color,
					"margin-left"      : "10em",
					"white-space"      : "pre-wrap"
				})
			
			if(opts.resolve)
			{
				var result;
				
				try
				{
					result = "<em style='color:#CCC'>" + eval(line) + "</em>";
				}
				catch(e)
				{
					result = "<span style='color:red'>" + e + "</span>";
				}
				
				try
				{
					textArea.html(line + "<br>&nbsp;-> " + result);
				}
				catch(e)
				{
					textArea.html(line + "<br>&nbsp;-> <em style='color:#BBB'>could not evaluate expression to a string</em>");
				}
			}
			else
			{
				textArea.text(line);
			}
			
			var dt = new Date();
			var newLine = $("<div>")
				.append(
					$("<div>")
						.css({
							"width"            : "10em",
							"float"            : "left"
						})
						.text("[" + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds() + "." + dt.getMilliseconds() + "]"),
					textArea,
					$("<div>")
						.css({"clear" : "both"})
				);
			
			console.lines.push({ $ : newLine, rawInput : line });
			
			if(pageLoaded)
			{
				target.append(newLine);
				target.scrollTop(target.prop("scrollHeight"));
			}
		},
		error     : function(line)
		{
			console.log(line, { color : "red" } );
		},
		warn      : function(line)
		{
			console.log(line, { color : "orange" } );
		},
		version   : "1.2",
		copyright : "2015"
	};
})()

console.log("Simple Console v" + console.version + " (c)" + console.copyright + " Sanford Gifford");

window.onerror = function(message, file, line, column, errorObj)
{
	console.error("(line " + line + " : " + column + ") - " + message + "(" + file + ")" + (typeof(errorObj) !== "undefined" ? "\r\n\r\n" + errorObj.stack : ""));
	
	return false;
};

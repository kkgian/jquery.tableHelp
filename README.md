#jquery.tableHelp
####July 2012
####Version: 0.1.0.0
####File: jquery.tableHelp.js
####Description: 
	- jQuery plugin for Html table help.
		e.g: 
		$("#myTable") 
			.tableHelp()
			//Optional chaning to other plugin
			.dataTable({
				"bJQueryUI": true, etc...
			})

####Options: 
	- altRow 		: [<color code(default: #f8f8f8>]	- show alternate column; 
	- countRow		: [<title(default: #)>]				- Insert a new column in the <table> with row counting
	- sumColumn		: [<column arry(default: none)>]		- pass in column array to get the total (for number).
		eg. {sumColumn: [4,5]} will sum up column 4 and 5, in additional new row inserted at <tfoot>, (first row if exist).
	- showClipboard	: show addition row <tfoot>, last row if exists. Refer requirement bellow.
	- filterColumn	: (under construction, meant to show/hide specified column(s))

####Usage:
	 $("#myTable").tableHelp();							- using the default option.
	 $("#myTable").tableHelp( {'<option>':<value>} );	- overwrite default option.
	 
	 eg.: $("#myTable").tableHelp( {'countRow':false} );		- switch off row counting.

####Requirement:
	If you want copy-to-clipboard tools, get it from https://github.com/jonrohan/ZeroClipboard.
	What we need is only 2 files:-

- ZeroClipboard.swf - Note: using ZeroClipboard10.swf will not clip \t 
- ZeroClipboard.js ver.1.0.7. (don't forget to setMoviePate)
	
####Author: KK Gian
####Credits:-
- https://github.com/jonrohan/ZeroClipboard
- https://github.com/zenorocha/jquery-boilerplate/

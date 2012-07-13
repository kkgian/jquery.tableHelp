jquery.tableHelp
================

Html table helper with jquery

Author: KK Gian
Project: jquery plugin.
file: jquery.tableHelp.js
Date: July 2012
Version: 1.0.0.0
Description: Chainable HTML <table> helper, refer to default options. 
	If chaining plugins, this plugin has to be first.
		e.g: 
		$("#myTable") 
			.tableHelp()
			.dataTable({
				"bJQueryUI": true, etc...
			})

Options available: 
	- altRow		: show alternate column; need .altRow class in CSS decalration
	- countRow		: Insert a new column in the <table> with row counting
	- sumColumn []	: pass in column array to get the total (for number).
						eg. {sumColumn: [4,5]} will sum up column 4 and 5 in additional row at last
	- showClipboard	: show addition row <tfoot>. Refer requirement bellow.
	- filterColumn	: (under construction, meant to show/hide specified column(s))

Usage:
	 $("#myTable").tableHelp();							- using the default option.
	 $("#myTable").tableHelp( {'<option>':<value>} );	- overwrite default option.
eg.: $("#myTable").tableHelp( {'countRow':false} );		- switch off row counting.

Requirement:
	If you want copy-to-clipboard tools, get it from https://github.com/jonrohan/ZeroClipboard.
	What we need is only 2 files:-
	ZeroClipboard.swf and ZeroClipboard.js ver.1.0.7. (don't forget to setMoviePate)
		Note: using ZeroClipboard10.swf will not clip \t 

Credits:-
- https://github.com/jonrohan/ZeroClipboard
- http://jqueryboilerplate.com/ 

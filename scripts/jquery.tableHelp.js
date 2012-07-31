/**
 *	jQuery Table Help Plugin 1.0 (jquery.tableHelp.js)
 * 	Document: https://github.com/kkgian/jquery.tableHelp
 * 	Copyright (c) 2012 KK Gian
 *	Dual licensed under the MIT and GPL licenses:
 *		http://www.opensource.org/licenses/mit-license
 *		http://www.gnu.org/licenses/gpl
 *	Credits:-
 *		https://github.com/jonrohan/ZeroClipboard
 * 		http://jqueryboilerplate.com/ 
 */

;(function ( $, window, undefined ) { 

    // Create the defaults once
    var pluginName = 'tableHelp',
        document = window.document,
        defaults = {
            altRow: '',
            countRow: '',
            sumColumn: [],
            showClipboard: false, 
            filterColumn: []
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
		//var $element = $(element), // reference to the jQuery version of DOM element 
        this.element = $(element);

        // jQuery has an extend method which merges the contents of two or 
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.options = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = pluginName;
        
        this.init();

    }
	
	//Additional Plugin Methods
	$.extend(Plugin.prototype, {
		init:  function () {  
		
			if (this.options.altRow != '') { this.SetAltRow(this.options.altRow) } 
			
			if (this.options.countRow != '') { this.CountRow(this.options.countRow) } 
			
			if (this.options.sumColumn.length > 0){ this.SumColumn(this.options.sumColumn) }
			
			if (this.options.showClipboard) { this.AddHelpTool('clipboard') }	
			
			//if (this.options.filterColumn.length > 0) { this.AddHelpTool('columnFilter') }
			
		}, 
		Redraw: function() { 
			//Recount rows
			 this.CountRow(this.options.countRow)
			 
			//Recalculate columns
			this.SumColumn(this.options.sumColumn);
		},
		SetAltRow: function(color) {   
			this.element.find('tbody tr:odd').css('background', color);
		},	 
		CountRow: function(Caption){
			var id = this.element.attr('id') 
			if (!Caption) {   
				//this is to provide 'direct' call to remove count
				this.element.find('[class^="cR"]').remove();
				return false;
			} 
			////Reset by deleting if any exists
			this.element.find('[class^="cR"]').remove();
			////<thead> 
			this.element.find('thead tr').find('th:first').before('<th class="cRthth'+id+'">'+Caption+'</th>'); 
			this.element.find('thead tr').find('td:first').before('<td class="cRthtd'+id+'">'+Caption+'</td>');

			////<tbody>
			this.element.find('tbody tr').each(function (i) {
				$(this).find('td:first').before('<td class="cRthth'+id+'r'+ ++i +'">' + i + '.</td>');
			}); 
			
			////<tfoot>
			this.element.find('tfoot tr').find('td:first').before('<td class="cRtftd'+id+'"></td>');
			this.element.find('tfoot tr').find('th:first').before('<th class="cRtfth'+id+'"></th>');  
		},
		SumColumn: function(colArray){ 	
			//Make sure is a table, not container of table(s)
			if(this.element.find('table').length > 0){
				return this.SumTableColumn(); 
			}
			var table = this.element;
			var countRow = this.options.countRow;  
			var columnElement = this.options.sumColumn;
			var total = 0;
			var c = 0;
			var t = 0;		//
			var tr = $('<tr id="sCtR'+ table.attr('id') +'" />');
			var tc = 0; 
			
			//Delete existing if any
			table.find('[id^="sCtR"]').remove();
			
			//Check if function is called internally
			if (colArray.length == 0 ){
				//colArray is from direct call.
				return false;	//this will 'break' if and proceed
			} else {
				//verify each passed element is a number
				//then overwrite/update 'internal' variable (columnelement) to proceed 
				//.grep will return inverted isNaN (because third param is true)
				columnElement = $.grep(String(colArray).split(','), isNaN, true)
 			}
			
			$(columnElement).each( function(i, e) { 
				//For each specified columnElement, accumulate total from the table  
				
				c = parseInt(e) + (countRow ? 1 : 0);   //excluding column counter
				 
				if ( c > table.find('tbody tr:first td').length ) {
					//columnElement e is greater the table column, exit;  
					return false;
				}
				
				//used = c;	//keep track of used column			
				//Sum the column for tbody only. 
				total = 0; 
				table.find('tbody tr').each( function() { 
					t = $(this).find('td:nth-child('+ c +')').html();
					if (t) {
						t = t.replace('$', '').replace(',','')
						if (!isNaN(t)) { total += parseFloat(t); }						
						 
					}
				});   	 
				//Fix integer or float (with or without decimal point
				total = total.toFixed( ((total % 1 === 0) ? 0 : 2)  )  
				//Now total holds the sum for table's Column[columnElement] 
							
				if (i == 0) {  
					tc = ((c - 1));   
					
					//Loop to that column with empty <td>
					for (x=0; x < tc; x++){
						if (x==0){
							//this is to mark for countRow-tfoot in case direct call to remove
							tr.append('<td class="cRtftd">&nbsp;</td>'); 
						} else {
							tr.append('<td>&nbsp;</td>');
						}
					}
					tr.append('<td class="amount">' + total + '</td>');
					
				} else {   
					//loop the gap between next element 
					if ( (tc+i != c ) ) { 
						for (x=0; x < (c - tc) -i; x++){
							tr.append('<td>&nbsp;</td>'); 
						}
						tr.append('<td class="amount">' + total + '</td>');
					} else { 
						tr.append('<td class="amount">' + total + '</td>');	 
					} 
				} 
				tc++;
			});
			 
			//append till the last cell   
			for (x=0; x < (table.find('tbody tr:last').find('td').length - c ); x++){ 
				tr.append('<td>&nbsp;</td>');
			} 
			
			//Finally insert into tfoot as first row  (create if not exist) 
			if (table.find('tfoot').length == 0){
				//<tfoot> not found! create with wrap 
				table.append($('<tfoot />').append(tr)); 
			} else {
				//Just insert the <tr> because it was reset / removed
				table.find('tfoot').append(tr);    	 
			} 
		},
		SumTableColumn: function(){
			alert('Container of table(s) is not supported yet!');
			return false;
		},
		AddHelpTool: function(item){
			var table = this.element;
			var id = table.attr('id'); 	
			var tds = table.find('tbody tr:first').children('td').length; 
			var tr = $('<tr style="font-size:smaller;" id="_mytblhlp_m'+ id +'">'+
					 '<td colspan="'+ tds +'" /></tr>');
			var m = $('#_mytblhlp_m'+ id);  
			
			switch (item){
				case 'clipboard':  
					var a = '<a id="_mytblhlp_copy_' + id +  
							'" onmouseOver="$(\'#' + id + '\').tableHelp(\'clipboardThis\',\'' +
							id + '\');">&nbsp;COPY&nbsp;</a>';
					if (!m.html()){
						//no menu bar yet
						tr.find('td:first').append(a);  
						
						if( table.find('tfoot tr:last').html() ){ 
							//<tfoot> exists
							table.find('tfoot tr:last').after(tr);
						} else {   
							//<tfoot> not exist
							table.append('<tfoot>'+ tr +'</tfoot>'); 
						}  
					} else {
						//append
						if( table.find('tfoot tr:last').html() ){ 
							//<tfoot> exists
							table.find('tfoot tr:last').after('<tr>'+ m.html() +'</tr>');
						} else {   
							//<tfoot> not exist
							table.append('<tfoot><tr>'+ m.html() +'</tr></tfoot>'); 
						}  
					}  
					break;
				case 'columnFilter': 
					alert('under construction');
					//Add "COLUMN" link in <tfoot>
					var a = '<a id="_mytblhlp_cf_'+ id + 
							'" onmouseOver="$(\'#' + id + '\').tableHelp(\'FilterColumn\',\'' +
							id + '\');">&nbsp;COLUMN&nbsp;</a>';
					
					if (!m.html()){
						//
						tr.find('td:first').append(a); 
						if( table.find('tfoot tr:last').html() ){ 
							//<tfoot> exists
							table.find('tfoot tr:last').after(tr);
						} else {   
							//<tfoot> not exist
							table.append('<tfoot>'+ tr +'</tfoot>'); 
						}   
					} else {
						//append 
						$(a).insertAfter(m.find('a:last'))  
					}		 
					break;				
			};		
		}, 
		clipboardThis: function(id){
			ZeroClipboard.setMoviePath('scripts/media/ZeroClipboard.swf'); 
			clip = new ZeroClipboard.Client();  
			clip.addEventListener('complete', function () {  
				alert('Copied to clipboard.'); 
			});
			var txt = '';
			$("#" + id + ' tr:not(tfoot tr)').each(function () {
				$(this).find('td, th').each(function () { 
					//Strip HTML tags
					txt += $(this).html().replace(/(<\/?[^>]+>)/gi, '') + '\t';
				})
				txt += '\n';
			}); 
			clip.setText(txt);
			var width = $('#_mytblhlp_copy_'+id).width();
			var height =  $('#_mytblhlp_copy_'+id).height();
			// make your own div with your own css property and not use clip.glue()
			var flash_movie = '<div>'+clip.getHTML(width, height)+'</div>';
			flash_movie = $(flash_movie).css({
				position: 'relative',
				marginBottom: -height,
				width: width,
				height: height,
				zIndex: 101
			});
			$(flash_movie).hover( function() {
				$(this).css('background','#f60').css('z-index','-101');
			}, function(){
				$(this).css('background','').css('z-index','0');
			})
			$('#_mytblhlp_copy_'+id).before(flash_movie);  
		},
		FilterColumn: function(id){
			//List all column for table with id
			//alert('filter column: '+ id); 
		}		
	});	
  
    // //////////////////////////////////////////////////////////////////////////////////////////////////
	// Wrapper around the constructor, 
	// preventing against multiple instantiations and allowing any
	// public function (ie. a function whose name doesn't start
	// with an underscore) to be called via the jQuery plugin,
	// e.g. $(element).defaultPluginName('functionName', arg1, arg2)
	 $.fn[pluginName] = function ( options ) {
		var args = arguments;
		if (options === undefined || typeof options === 'object') {
			return this.each(function () {
				if (!$.data(this, 'plugin_' + pluginName)) {
					$.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
				}
			});
		} else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {  
			return this.each(function () {
				var instance = $.data(this, 'plugin_' + pluginName);
				if (instance instanceof Plugin && typeof instance[options] === 'function') {
					instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
				}
			});
		}
	}
  
}(jQuery, window));

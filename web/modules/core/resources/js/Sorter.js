/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function Sorter(formData, htmlId, okHandler, okHandlerContext) {
    this.htmlId = htmlId;
    this.okHandler = okHandler;
    this.okHandlerContext = okHandlerContext;
    this.items = formData.items;
    this.data = [];
    for(var key in this.items) {
        this.data.push(this.items[key].id);       
    }
}
Sorter.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.show();
}
Sorter.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Items</span><div class="comment1">Drag and drop items to sort them</div></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><div id="' + this.htmlId + '_items" style="border: 1px solid #999999;"></div></td>';
    html += '</tr>';
    html += '</table>';
    return html;
}
Sorter.prototype.updateView = function() {
    this.updateItemsView();
}
Sorter.prototype.updateItemsView = function() {
    var html = '';
    for(var key in this.data) {
        var id = this.data[key];
        var item = this.getItem(id);
        html += '<div id="' + this.htmlId + '_' + item.id + '"  class="ui-state-default" style="margin: 3px; padding: 3px; white-space: nowrap;">' + item.text + '</div>';
    }
    $('#' + this.htmlId + '_items').html(html);
}
Sorter.prototype.setHandlers = function() {
    var form = this;
}
Sorter.prototype.makeSortables = function() {
    var form = this;
    $('#' + this.htmlId + '_items').sortable({
        containment: "parent",
        cursor: "move",
        stop: function( event, ui ) {
            form.sortStopHandle(event, ui);
        }
    });   
}
Sorter.prototype.sortStopHandle = function(event, ui) {
    var data = [];
    $('#' + this.htmlId + '_items div').each(function(index, element) {
        var textId = element.id;
        var tmp = textId.split('_');
        var id = parseInt(tmp[tmp.length - 1]);
        data.push(id);
    });
    this.data = data;
    this.updateItemsView();
}
Sorter.prototype.show = function() {
    var title = 'Sort items'
    var form = this;
    $("#" + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    this.updateView();
    this.makeSortables();
    $("#" + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        activity: 'center',
        width: 600,
        height: 400,
        buttons: {
            Ok: function() {
                $(this).dialog( "close" );
                form.okClickHandle();
            },
            Cancel: function() {
                $(this).dialog( "close" );
            }
	},
        close: function(event, ui) {
            releasePopupLayer();
        } 
    });
}

Sorter.prototype.okClickHandle = function() {
    this.okHandler.call(this.okHandlerContext, this.data);          
}
Sorter.prototype.getItem = function(id) {
    for(var key in this.items) {
        var item = this.items[key];
        if(item.id == id) {
            return item;
        }
    }
    return null;
}

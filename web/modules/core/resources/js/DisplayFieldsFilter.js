/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function DisplayFieldsFilter(htmlId, moduleName, displayFields, possibleFields, callback, callbackContext) {
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.moduleName = moduleName;
    this.callback = callback;
    this.callbackContext = callbackContext;
    this.displayFields = clone(displayFields);
    this.possibleFields = possibleFields;
}
DisplayFieldsFilter.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.show();
}
DisplayFieldsFilter.prototype.getLayoutHtml = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td>Field Name</td><td>Show</td></tr>';
    for(var field in this.possibleFields) {
        var fieldTitle = this.possibleFields[field];
        html += '<tr><td>' + fieldTitle + '</td><td><input type="checkbox" id="' + this.htmlId + '_field_' + field + '"></td></tr>';
    }
    html += '</table>';
    return html;
}
DisplayFieldsFilter.prototype.show = function() {
    var title = 'Display fields'
    var form = this;
    $('#' + this.containerHtmlId).html(this.getLayoutHtml());
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 250,
        height: 500,
        buttons: {
            OK: function() {
                form.okHandle.call(form);
                $(this).dialog( "close" );
            },
            Cancel: function() {
                $(this).dialog( "close" );
                $('#' + form.containerHtmlId).html("");
            }
	},
        close: function(event, ui) {
            releasePopupLayer();
        } 
    });
    this.updateView();
}
DisplayFieldsFilter.prototype.setHandlers = function() {
    var form = this;   
    $('input[id^="' + this.htmlId + '_field_"]').bind("click", function(event) {form.fieldChangedHandle.call(form, event)});
}

DisplayFieldsFilter.prototype.fieldChangedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var field = parts[parts.length - 1];
    this.displayFields[field] = $('#' + this.htmlId + '_field_' + field).is(':checked');
    this.updateDisplayView();
}



DisplayFieldsFilter.prototype.updateView = function() {  
    this.updateDisplayView();
}

DisplayFieldsFilter.prototype.updateDisplayView = function() {
    for(var field in this.possibleFields) {
        var fieldTitle = this.possibleFields[field];
        if(this.displayFields[field] == true) {
            $('#' + this.htmlId + '_field_' + field).attr("checked", true);
        } else {
            $('#' + this.htmlId + '_field_' + field).attr("checked", false);
        }
    }
}
DisplayFieldsFilter.prototype.okHandle = function() {
    this.callback.call(this.callbackContext, this.displayFields);
}
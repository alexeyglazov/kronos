/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ColorMapperForm(htmlId, okHandler, okHandlerContext) {
    this.config = {
        endpointUrl: endpointsFolder + "ColorMapperForm.jsp"
    }
    this.htmlId = htmlId;
    this.okHandler = okHandler;
    this.okHandlerContext = okHandlerContext;
    this.loaded = {
        "clients": []
    }
    this.selected = {
    }
    this.data = {
        changedClientColors: {}
    }

}
ColorMapperForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
}
ColorMapperForm.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.clients = result.clients;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ColorMapperForm.prototype.getHtml = function() {
    var html = '';
    html += '<div id="' + this.htmlId + '_clients"></div>';
    return html;
}
ColorMapperForm.prototype.updateView = function() {
    this.updateClientsView();
    this.updateClientColorsView();
}
ColorMapperForm.prototype.updateClientsView = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader">';
    html += '<td>Group</td>';
    html += '<td>Client</td>';
    html += '<td>Color</td>';
    html += '</tr>';
    for(var key in this.loaded.clients) {
        var client = this.loaded.clients[key];
        html += '<tr>';
        html += '<td>' + (client.groupName != null ? client.groupName : 'NO GROUP') + '</td>';
        html += '<td>' + client.clientName + '</td>';
        html += '<td><input type="input" id="' + this.htmlId + '_color_' + client.clientId + '"></td>';

        html += '</tr>';
    }
    html += '</table>';
    $('#' + this.htmlId + '_clients').html(html);
    var form = this;
    $('input[id^="' + this.htmlId + '_color_"]').colorpicker({
        parts: 'full',
        //showOn: 'both',
        buttonColorize: null,
        showNoneButton: true,
        alpha: true,
        colorFormat: '#HEX',
        select: function(event, color) {form.colorSelected(event, color);}
   });
   $('input[id^="' + this.htmlId + '_color_"]').bind("change", function(event) {form.colorChangedHandle.call(form, event);});

}
ColorMapperForm.prototype.updateClientColorsView = function() {
    for(var key in this.loaded.clients) {
        var client = this.loaded.clients[key];
        var textColor = null;
        var backgroundColor = null;
        var text = null;
        if(client.clientColor == null) {
            var textColor = '#000000';
            var backgroundColor = '#ffffff';
            var text = '';
        } else {
            var textColor = getContrastColor(client.clientColor);
            var backgroundColor = client.clientColor;
            var text = backgroundColor;
        }
        $('#' + this.htmlId + '_color_' + client.clientId).val(text);
        $('#' + this.htmlId + '_color_' + client.clientId).css( "background-color", backgroundColor);
        $('#' + this.htmlId + '_color_' + client.clientId).css( "color", textColor);
    }    
}
ColorMapperForm.prototype.updateClientColorView = function(id) {
    var client = null;
    for(var key in this.loaded.clients) {
        var clientTmp = this.loaded.clients[key];
        if(clientTmp.clientId == id) {
            client = clientTmp;
            break;
        }
    }
    var textColor = null;
    var backgroundColor = null;
    var text = null;
    if(client.clientColor == null) {
        var textColor = '#000000';
        var backgroundColor = '#ffffff';    
        var text = '';
    } else {
        var textColor = getContrastColor(client.clientColor);
        var backgroundColor = client.clientColor;                
        var text = backgroundColor;
    }
    $('#' + this.htmlId + '_color_' + client.clientId).val(text);
    $('#' + this.htmlId + '_color_' + client.clientId).css( "background-color", backgroundColor);
    $('#' + this.htmlId + '_color_' + client.clientId).css( "color", textColor);
}
ColorMapperForm.prototype.setHandlers = function() {
    var form = this;
}
ColorMapperForm.prototype.colorChangedHandle = function(event) {
    var colorTxt = $(event.currentTarget).val().trim();
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parts[parts.length - 1];
    this.setColor(id, colorTxt);
}
ColorMapperForm.prototype.colorSelected = function(event, color) {
    var colorTxt = color.formatted;
    var idTxt = event.target.id;
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    this.setColor(id, colorTxt);
}
ColorMapperForm.prototype.setColor = function(id, color) {
    var client = null;
    for(var key in this.loaded.clients) {
        var clientTmp = this.loaded.clients[key];
        if(clientTmp.clientId == id) {
            client = clientTmp;
            break;
        }
    }
    client.clientColor = color;
    
    if(this.data.changedClientColors[id] == null) {
        this.data.changedClientColors[id] = color;
    } else if(this.data.changedClientColors[id] != color) {
        this.data.changedClientColors[id] = color;
    }
                
    this.updateClientColorView(id);
}

ColorMapperForm.prototype.show = function() {
    var title = 'Set color'
    var form = this;
    $("#" + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    this.updateView();
    $("#" + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        department: 'center',
        width: 700,
        height: 300,
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
ColorMapperForm.prototype.okClickHandle = function() {
   var form = this;
    var data = {};
    data.command = "save";
    data.form = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.data.id = result.id;
            doAlert("Info", "Changed colors have been successfully saved", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
    
}
ColorMapperForm.prototype.afterSave = function() {
    this.okHandler.call(this.okHandlerContext);
}
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ClientPicker(formData, htmlId, okHandler, okHandlerContext, moduleName) {
    this.config = {
        endpointUrl: endpointsFolder + "ClientPicker.jsp"
    }
    this.mode = formData.mode;
    this.pickedClients = [];
    this.htmlId = htmlId;
    this.okHandler = okHandler;
    this.okHandlerContext = okHandlerContext;
    this.moduleName = moduleName;
    this.loaded = {
        "groups": [],
        "clients": []
    }
    this.data = {
        clientFilter: ''
    }
    this.selected = {
        "groupId": null,
        "clientId": null,
        "pickedClientId": null
    }
}
ClientPicker.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
}
ClientPicker.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.moduleName = this.moduleName;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.groups = result.groups;
            form.loaded.clients = result.clients;

            form.selected.groupId = null;
            form.selected.clientId = null;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ClientPicker.prototype.loadGroupContent = function() {
    var form = this;
    var data = {};
    data.command = "getGroupContent";
    data.moduleName = this.moduleName;
    data.groupId = this.selected.groupId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.clients = result.clients;

            form.selected.clientId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ClientPicker.prototype.loadNoGroupContent = function() {
    var form = this;
    var data = {};
    data.command = "getNoGroupContent";
    data.moduleName = this.moduleName;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.clients = result.clients;
            form.selected.clientId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ClientPicker.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Group</span></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><select id="' + this.htmlId + '_group"></select></td>';
    html += '</tr>';
    html += '</table>';
    
    html += '<span class="label1">Client</span><br />';
    html += '<span class="label1">Filter</span> <input type="text" id="' + this.htmlId + '_clientFilter"><br />';
    html += '<table>';
    html += '<tr>';
    html += '<td><select id="' + this.htmlId + '_client" size="8" style="width: 300px;"></select></td>';
    if(this.mode == 'MULTIPLE') {
        html += '<td style="vertical-align: top;"><span id="' + this.htmlId + '_client_pick" title="Pick selected">Pick</span></td>';
    }
    html += '</tr>';
    html += '</table>';
    
    if(this.mode == 'MULTIPLE') {
        html += '<span class="label1">Picked clients</span><br />';
        html += '<table>';
        html += '<tr>';
        html += '<td><select id="' + this.htmlId + '_pickedClient" size="5" style="width: 500px; height: 150px;"></select></td>';
        html += '<td style="vertical-align: top;"><span id="' + this.htmlId + '_client_clear" title="Remove selected">Remove</span></td>';
        html += '</tr>';
        html += '</table>';
    }
    return html;
}
ClientPicker.prototype.makeButtons = function() {
    var form = this;
    $('#' + this.htmlId + '_client_pick')
      .button()
      .click(function( event ) {
        form.pickClient.call(form);
    });
    
    $('#' + this.htmlId + '_client_clear')
      .button()
      .click(function( event ) {
        form.clearClient.call(form);
    });
}    
ClientPicker.prototype.updateView = function() {
    this.updateGroupView();
    this.updateClientFilterView();
    this.updateClientView();
}
ClientPicker.prototype.updateGroupView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.groups) {
        var group = this.loaded.groups[key];
        var isSelected = "";
        if(group.id == this.selected.groupId) {
           isSelected = "selected";
        }
        html += '<option value="' + group.id + '" ' + isSelected + '>' + group.name + '</option>';
    }
    $('#' + this.htmlId + '_group').html(html);
}
ClientPicker.prototype.updateClientFilterView = function() {
    $('#' + this.htmlId + '_clientFilter').val(this.data.clientFilter);
}

ClientPicker.prototype.updateClientView = function() {
    var html = '';
    var filter = null;
    if(this.data.clientFilter != null && this.data.clientFilter != '') {
        filter = this.data.clientFilter.toLowerCase();
    }
    for(var key in this.loaded.clients) {
        var client = this.loaded.clients[key];
        var found = true;
        if(filter != null) {
            found = false;
            if(client.name.toLowerCase().indexOf(filter) != -1 ) {
                found = true;
            }
        }
        if(! found) {
            continue;
        }        
        var isSelected = "";
        if(client.id == this.selected.clientId) {
           isSelected = "selected";
        }
        html += '<option value="' + client.id + '" ' + isSelected + '>' + client.name + '</option>';
    }
    $('#' + this.htmlId + '_client').html(html);
}
ClientPicker.prototype.updatePickedClientView = function() {
    var html = '';
    for(var key in this.pickedClients) {
        var client = this.pickedClients[key].client;
        var path = this.pickedClients[key].path;
        var isSelected = "";
        if(client.id == this.selected.pickedClientId) {
           isSelected = "selected";
        }
        html += '<option value="' + client.id + '" ' + isSelected + '>' + path + '</option>';
    }
    $('#' + this.htmlId + '_pickedClient').html(html);
}
ClientPicker.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_group').bind("change", function(event) {form.groupChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_clientFilter').bind("keyup", function(event) {form.clientFilterChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_client').bind("change", function(event) {form.clientChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_pickedClient').bind("change", function(event) {form.pickedClientChangedHandle.call(form, event);});
}
ClientPicker.prototype.groupChangedHandle = function(event) {
    var htmlId = $('#' + this.htmlId + '_group').val();
    if(htmlId == null || htmlId == '') {
        this.selected.groupId = null;
    } else {
        this.selected.groupId = parseInt(htmlId);
    }
    if(this.selected.groupId == null) {
        this.loadNoGroupContent();
    } else {
        this.loadGroupContent();
    }
}
ClientPicker.prototype.clientFilterChangedHandle = function(event) {
    var value = $('#' + this.htmlId + '_clientFilter').val();
    value = $.trim(value);
    if(value != this.data.clientFilter) {
        this.data.clientFilter = value;
        this.selected.clientId = null;
        this.updateClientView();
    }
    this.updateClientFilterView();
}
ClientPicker.prototype.clientChangedHandle = function(event) {
    var htmlId = $('#' + this.htmlId + '_client').val();
    if(htmlId == null || htmlId == '') {
        this.selected.clientId = null;
    } else {
        this.selected.clientId = parseInt(htmlId);
    }
}
ClientPicker.prototype.pickedClientChangedHandle = function(event) {
    var htmlId = $('#' + this.htmlId + '_pickedClient').val();
    if(htmlId == null || htmlId == '') {
        this.selected.pickedClientId = null;
    } else {
        this.selected.pickedClientId = parseInt(htmlId);
    }
}
ClientPicker.prototype.pickClient = function(event) {
    if(this.selected.clientId == null) {
        doAlert('Alert', 'Client is not selected', null, null);
        return;
    }
    var client = this.getClient(this.selected.clientId);
    var clientTmp = jQuery.grep(this.pickedClients, function(element, i) {
        return (client.id == element.client.id);
    });
    if(clientTmp.length == 0) {
        if(this.selected.groupId == null) {
            this.loadGroupByClient(client);
        } else {
            var path = this.getPath(this.selected.groupId, this.selected.clientId);
            this.pickedClients.push({
                "client": client,
                "path": path
            });
            this.selected.pickedClientId = null;
            this.sortPickedClients();
            this.updatePickedClientView();
        }
    } else {
        doAlert('Alert', 'This client is already picked', null, null);
    }
}
ClientPicker.prototype.loadGroupByClient = function(client) {
    var form = this;
    var data = {};
    data.command = "getGroup";
    data.clientId = client.id;
    data.moduleName = this.moduleName;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            var groupId = null;
            if(result.group != null) {
                groupId = result.group.id;
            }
            var path = form.getPath(groupId, client.id);
            form.pickedClients.push({
                "client": client,
                "path": path
            });
            
            form.selected.pickedClientId = null;
            form.sortPickedClients();
            form.updatePickedClientView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });    
}
ClientPicker.prototype.clearClient = function(event) {
    if(this.selected.pickedClientId == null) {
        doAlert('Alert', 'Client is not selected', null, null);
        return;
    }
    var index = null;
    for(var key in this.pickedClients) {
        if(this.pickedClients[key].client.id == this.selected.pickedClientId) {
            index = key;
            break;
        }
    }
    if(index != null) {
        this.pickedClients.splice(index, 1);
        this.selected.pickedClientId = null;
        this.updatePickedClientView();
    }
}
ClientPicker.prototype.show = function() {
    var title = 'Pick Client'
    var form = this;
    var height = 400;
    if(this.mode == 'MULTIPLE') {
        height = 550;
    }
    $("#" + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    this.updateView();
    this.makeButtons();
    $("#" + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        client: 'center',
        width: 600,
        height: height,
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
ClientPicker.prototype.okClickHandle = function() {
    if(this.mode == 'MULTIPLE') {
        this.okHandler.call(this.okHandlerContext, this.pickedClients);        
    } else {
        var client = this.getClient(this.selected.clientId);
        this.okHandler.call(this.okHandlerContext, client);
    }    
}
ClientPicker.prototype.getClient = function(id) {
    if(id == null) {
        return null;
    }    
    for(var key in this.loaded.clients) {
        if(this.loaded.clients[key].id == id) {
            return this.loaded.clients[key];
        }
    }
    return null;
}
ClientPicker.prototype.getGroup = function(id) {
    if(id == null) {
        return null;
    }    
    for(var key in this.loaded.groups) {
        if(this.loaded.groups[key].id == id) {
            return this.loaded.groups[key];
        }
    }
    return null;
}
ClientPicker.prototype.getPath = function(groupId, clientId) {
    var groupName = 'NO GROUP';
    if(groupId != null) {
        groupName = this.getGroup(groupId).name;
    }
    var client = this.getClient(clientId);
    return groupName + ' / ' + client.name;
}
ClientPicker.prototype.sortPickedClients = function() {
    this.pickedClients.sort(function(o1, o2){
        if(o1.path == o2.path) return 0;
        return o1.path > o2.path ? 1: -1;
    }); 
}
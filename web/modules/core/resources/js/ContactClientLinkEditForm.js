/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ContactClientLinkEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "ContactClientLinkEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.moduleName = "Clients";
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.loaded = {
        employee: null,
        contact: null
    }
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "contactId": formData.contactId,
        "clientId": formData.clientId
    }
    this.selected = {
        contactEmployeeId: null
    }
}
ContactClientLinkEditForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
    this.dataChanged(false);
}
ContactClientLinkEditForm.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.clientId = this.data.clientId;
    data.contactId = this.data.contactId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.client = result.client;
            form.loaded.contact = result.contact;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ContactClientLinkEditForm.prototype.loadContactContent = function() {
    var form = this;
    var data = {};
    data.command = "getContactContent";
    data.contactId = this.data.contactId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.contact = result.contact;
            form.updateContactView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ContactClientLinkEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Contact</span></td>';
    html += '<td><div id="' + this.htmlId + '_contact"></div></td>';
    html += '<td><button id="' + this.htmlId + '_contact_pick">Pick</button></td>';
    html += '<td><button id="' + this.htmlId + '_contact_clear">Clear</button></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><span class="label1">Client</span></td>';
    html += '<td><div id="' + this.htmlId + '_client"></div></td>';
    html += '<td><button id="' + this.htmlId + '_client_pick">Pick</button></td>';
    html += '<td><button id="' + this.htmlId + '_client_clear">Clear</button></td>';
    html += '</tr>';
    html += '</table>';
    return html;
}
ContactClientLinkEditForm.prototype.setHandlers = function() {
    var form = this;
    //$('#' + this.htmlId + '_comment').bind("change", function(event) {form.commentChangedHandle.call(form, event);});
}
ContactClientLinkEditForm.prototype.makeButtons = function() {
    var form = this;
    $('#' + this.htmlId + '_contact_pick')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.contactPickHandle.call(form);
    });
    
    $('#' + this.htmlId + '_contact_clear')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.contactClearHandle.call(form);
    });
    
    $('#' + this.htmlId + '_client_pick')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.clientPickHandle.call(form);
    });
    
    $('#' + this.htmlId + '_client_clear')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.clientClearHandle.call(form);
    });    
}


ContactClientLinkEditForm.prototype.contactPickHandle = function(event) {
    var formData = {
        "mode": 'SINGLE'
    };
    this.contactPicker = new ContactPicker(formData, "contactPicker", this.contactsPicked, this, this.moduleName);
    this.contactPicker.init();
}
ContactClientLinkEditForm.prototype.contactsPicked = function(contactIds) {
    if(contactIds != null && contactIds.length > 0) {
        this.data.contactId = contactIds[0];
    }
    this.loadContactContent();
    this.dataChanged(true);
}
ContactClientLinkEditForm.prototype.contactClearHandle = function(event) {
    if(this.data.contactId != null) {
        doConfirm('Confirm', 'Proceed with deleting this contact?', this, this.contactDoClearHandle, null, null)
    }
}
ContactClientLinkEditForm.prototype.contactDoClearHandle = function(event) {
    this.data.contactId = null;
    this.loaded.contact = null;
    this.updateContactView();
    this.dataChanged(true);    
}

ContactClientLinkEditForm.prototype.clientPickHandle = function(event) {
    var formData = {
        "mode": 'SINGLE'
    };
    this.clientPicker = new ClientPicker(formData, "clientPicker", this.clientPicked, this, this.moduleName);
    this.clientPicker.init();
}
ContactClientLinkEditForm.prototype.clientPicked = function(client) {
    this.data.clientId = client.id;
    this.loaded.client = client;
    this.updateClientView();
    this.dataChanged(true);
}
ContactClientLinkEditForm.prototype.clientClearHandle = function(event) {
    if(this.data.clientId != null) {
        doConfirm('Confirm', 'Proceed with deleting this client?', this, this.clientDoClearHandle, null, null)
    }
}
ContactClientLinkEditForm.prototype.clientDoClearHandle = function(event) {
    this.data.clientId = null;
    this.loaded.client = null;
    this.updateClientView();
    this.dataChanged(true);    
}

ContactClientLinkEditForm.prototype.updateView = function() {
    this.updateContactView();
    this.updateClientView();
}
ContactClientLinkEditForm.prototype.updateContactView = function() {
    var html = 'Undefind';
    if(this.data.contactId != null) {
        html = this.loaded.contact.firstName + ' ' + this.loaded.contact.lastName;
    }
    $('#' + this.htmlId + '_contact').html(html); 
    
}
ContactClientLinkEditForm.prototype.updateClientView = function() {
    var html = 'Undefind';
    if(this.data.clientId != null) {
        html = this.loaded.client.name;
    }
    $('#' + this.htmlId + '_client').html(html);
}

ContactClientLinkEditForm.prototype.show = function() {
    var title = 'Update contact-client link';
    if(this.data.mode == 'CREATE') {
        title = 'Create contact-client link';
    }    
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    this.makeButtons();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 400,
        height: 300,
        buttons: {
            Ok: function() {
                form.save();
            },
            Cancel: function() {
                $(this).dialog( "close" );
                form.dataChanged(false);
            }
	},
        close: function(event, ui) {
            releasePopupLayer();
        } 
    });
    this.updateView();
}
ContactClientLinkEditForm.prototype.validate = function() {
    var errors = [];
    var emailRE = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if(this.data.contactId == null) {
        errors.push("Contact is not set");
    }
    if(this.data.clientId == null) {
        errors.push("Client is not set");
    }
    return errors;
}
ContactClientLinkEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var serverFormData = clone(this.data);

    var form = this;
    var data = {};
    data.command = "saveContactClientLink";
    data.contactClientLinkEditForm = getJSON(serverFormData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Contact-client Link has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ContactClientLinkEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}

ContactClientLinkEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}





//==================================================

function ContactClientLinkDeleteForm(contactClientLinkId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "ContactClientLinkEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": contactClientLinkId
    }
}
ContactClientLinkDeleteForm.prototype.init = function() {
    //this.checkDependencies();
    this.show();
}
ContactClientLinkDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkContactClientLinkDependencies";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.analyzeDependencies(result);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ContactClientLinkDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.projectCodes == 0) {
        this.show();
    } else {
        var html = 'This ContactClientLink has dependencies and can not be deleted<br />';
        html += 'ContactClientLinks: ' + dependencies.projectCodes + '<br />';
        doAlert("Dependencies found", html, null, null);
    }
}
ContactClientLinkDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this Contact-Client Link", this, function() {this.doDeleteContactClientLink()}, null, null);
}
ContactClientLinkDeleteForm.prototype.doDeleteContactClientLink = function() {
    var form = this;
    var data = {};
    data.command = "deleteContactClientLink";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function() {
            doAlert("Info", "Contact-Client Link has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ContactClientLinkDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}
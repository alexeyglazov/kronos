/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function EmployeeContactLinkEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "EmployeeContactLinkEditForm.jsp"
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
        "employeeId": formData.employeeId,
        "comment": formData.comment
    }
    this.selected = {
        contactEmployeeId: null
    }
}
EmployeeContactLinkEditForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
    this.dataChanged(false);
}
EmployeeContactLinkEditForm.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.employeeId = this.data.employeeId;
    data.contactId = this.data.contactId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.employee = result.employee;
            form.loaded.contact = result.contact;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeContactLinkEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Contact</span></td>';
    html += '<td><div id="' + this.htmlId + '_contact"></div></td>';
    html += '<td></td><td></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><span class="label1">Employee</span></td>';
    html += '<td><div id="' + this.htmlId + '_employee"></div></td>';
    html += '<td><button id="' + this.htmlId + '_employee_pick">Pick</button></td>';
    html += '<td><button id="' + this.htmlId + '_employee_clear">Clear</button></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><span class="label1">Comment</span></td>';
    html += '<td><textarea id="' + this.htmlId + '_comment" style="width: 300px; height: 80px;"></textarea></td>';
    html += '<td></td><td></td>';
    html += '</tr>';
    html += '</table>';
    return html;
}
EmployeeContactLinkEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_comment').bind("change", function(event) {form.commentChangedHandle.call(form, event);});
}
EmployeeContactLinkEditForm.prototype.makeButtons = function() {
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
    
    $('#' + this.htmlId + '_employee_pick')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.employeePickHandle.call(form);
    });
    
    $('#' + this.htmlId + '_employee_clear')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.employeeClearHandle.call(form);
    });    
}


EmployeeContactLinkEditForm.prototype.contactPickHandle = function(event) {
    var formData = {
        "mode": 'SINGLE'
    };
    this.contactPicker = new ContactPicker(formData, "contactPicker", this.contactPicked, this, this.moduleName);
    this.contactPicker.init();
}
EmployeeContactLinkEditForm.prototype.contactPicked = function(contact) {
    this.data.contactId = contact.id;
    this.loaded.contact = contact;
    this.updateContactView();
    this.dataChanged(true);
}
EmployeeContactLinkEditForm.prototype.contactClearHandle = function(event) {
    if(this.data.contactId != null) {
        doConfirm('Confirm', 'Proceed with deleting this contact?', this, this.contactDoClearHandle, null, null)
    }
}
EmployeeContactLinkEditForm.prototype.contactDoClearHandle = function(event) {
    this.data.contactId = null;
    this.loaded.contact = null;
    this.updateContactView();
    this.dataChanged(true);    
}

EmployeeContactLinkEditForm.prototype.employeePickHandle = function(event) {
    this.employeePicker = new EmployeePicker("employeePicker", this.employeePicked, this, this.moduleName);
    this.employeePicker.init();
}
EmployeeContactLinkEditForm.prototype.employeePicked = function(employee) {
    this.data.employeeId = employee.id;
    this.loaded.employee = employee;
    this.updateEmployeeView();
    this.dataChanged(true);
}
EmployeeContactLinkEditForm.prototype.employeeClearHandle = function(event) {
    if(this.data.employeeId != null) {
        doConfirm('Confirm', 'Proceed with deleting this employee?', this, this.employeeDoClearHandle, null, null)
    }
}
EmployeeContactLinkEditForm.prototype.employeeDoClearHandle = function(event) {
    this.data.employeeId = null;
    this.loaded.employee = null;
    this.updateEmployeeView();
    this.dataChanged(true);    
}

EmployeeContactLinkEditForm.prototype.commentChangedHandle = function(event) {
    this.data.comment = jQuery.trim(event.currentTarget.value);
    this.updateCommentView();
    this.dataChanged(true); 
}
EmployeeContactLinkEditForm.prototype.updateView = function() {
    this.updateContactView();
    this.updateEmployeeView();
    this.updateCommentView();
}
EmployeeContactLinkEditForm.prototype.updateContactView = function() {
    var html = 'Undefind';
    if(this.data.contactId != null) {
        html = this.loaded.contact.firstName + ' ' + this.loaded.contact.lastName;
    }
    $('#' + this.htmlId + '_contact').html(html); 
    
}
EmployeeContactLinkEditForm.prototype.updateEmployeeView = function() {
    var html = 'Undefind';
    if(this.data.employeeId != null) {
        html = this.loaded.employee.firstName + ' ' + this.loaded.employee.lastName + ' (' +this.loaded.employee.userName + ')';
    }
    $('#' + this.htmlId + '_employee').html(html);
}
EmployeeContactLinkEditForm.prototype.updateCommentView = function() {
    $('#' + this.htmlId + '_comment').val(this.data.comment); 
}

EmployeeContactLinkEditForm.prototype.show = function() {
    var title = 'Update employee contact link';
    if(this.data.mode == 'CREATE') {
        title = 'Create employee contact link';
    }    
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    this.makeButtons();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 600,
        height: 600,
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
EmployeeContactLinkEditForm.prototype.validate = function() {
    var errors = [];
    var emailRE = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if(this.data.contactId == null) {
        errors.push("Contact is not set");
    }
    if(this.data.employeeId == null) {
        errors.push("Employee is not set");
    }
    return errors;
}
EmployeeContactLinkEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var serverFormData = clone(this.data);

    var form = this;
    var data = {};
    data.command = "saveEmployeeContactLink";
    data.employeeContactLinkEditForm = getJSON(serverFormData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Employee Contact Link has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeContactLinkEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}

EmployeeContactLinkEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}





//==================================================

function EmployeeContactLinkDeleteForm(employeeContactLinkId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "EmployeeContactLinkEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": employeeContactLinkId
    }
}
EmployeeContactLinkDeleteForm.prototype.init = function() {
    //this.checkDependencies();
    this.show();
}
EmployeeContactLinkDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkEmployeeContactLinkDependencies";
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
EmployeeContactLinkDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.projectCodes == 0) {
        this.show();
    } else {
        var html = 'This EmployeeContactLink has dependencies and can not be deleted<br />';
        html += 'EmployeeContactLinks: ' + dependencies.projectCodes + '<br />';
        doAlert("Dependencies found", html, null, null);
    }
}
EmployeeContactLinkDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this EmployeeContactLink", this, function() {this.doDeleteEmployeeContactLink()}, null, null);
}
EmployeeContactLinkDeleteForm.prototype.doDeleteEmployeeContactLink = function() {
    var form = this;
    var data = {};
    data.command = "deleteEmployeeContactLink";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function() {
            doAlert("Info", "EmployeeContactLink has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeContactLinkDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}
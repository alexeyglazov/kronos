/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function EmployeeProjectCodeAccessItemEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "EmployeeProjectCodeAccessItemEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.moduleName = "Rights";
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.loaded = {
        employee: null,
        projectCode: null
    }
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "employeeId": formData.employeeId,
        "projectCodeId": formData.projectCodeId
    }
    this.selected = {
        contactEmployeeId: null
    }
}
EmployeeProjectCodeAccessItemEditForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
    this.dataChanged(false);
}
EmployeeProjectCodeAccessItemEditForm.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.employeeId = this.data.employeeId;
    data.projectCodeId = this.data.projectCodeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.employee = result.employee;
            form.loaded.projectCode = result.projectCode;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeProjectCodeAccessItemEditForm.prototype.loadEmployeeContent = function() {
    var form = this;
    var data = {};
    data.command = "getEmployeeContent";
    data.employeeId = this.data.employeeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.employee = result.employee;
            form.updateEmployeeView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeProjectCodeAccessItemEditForm.prototype.loadProjectCodeContent = function() {
    var form = this;
    var data = {};
    data.command = "getProjectCodeContent";
    data.projectCodeId = this.data.projectCodeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.projectCode = result.projectCode;
            form.updateProjectCodeView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeProjectCodeAccessItemEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Employee</span></td>';
    html += '<td><div id="' + this.htmlId + '_employee"></div></td>';
    html += '<td><button id="' + this.htmlId + '_employee_pick">Pick</button></td>';
    html += '<td><button id="' + this.htmlId + '_employee_clear">Clear</button></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><span class="label1">Project code</span></td>';
    html += '<td><div id="' + this.htmlId + '_projectCode"></div></td>';
    html += '<td><button id="' + this.htmlId + '_projectCode_pick">Pick</button></td>';
    html += '<td><button id="' + this.htmlId + '_projectCode_clear">Clear</button></td>';
    html += '</tr>';
    html += '</table>';
    return html;
}
EmployeeProjectCodeAccessItemEditForm.prototype.setHandlers = function() {
    var form = this;
    //$('#' + this.htmlId + '_comment').bind("change", function(event) {form.commentChangedHandle.call(form, event);});
}
EmployeeProjectCodeAccessItemEditForm.prototype.makeButtons = function() {
    var form = this;
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
    
    $('#' + this.htmlId + '_projectCode_pick')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.projectCodePickHandle.call(form);
    });
    
    $('#' + this.htmlId + '_projectCode_clear')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.projectCodeClearHandle.call(form);
    });    
}


EmployeeProjectCodeAccessItemEditForm.prototype.employeePickHandle = function(event) {
    this.employeePicker = new EmployeePicker("employeePicker", this.employeePicked, this, this.moduleName);
    this.employeePicker.init();
}
EmployeeProjectCodeAccessItemEditForm.prototype.employeePicked = function(pickedEmployee) {
    this.data.employeeId = pickedEmployee.id;
    this.loadEmployeeContent();
    this.dataChanged(true);
}
EmployeeProjectCodeAccessItemEditForm.prototype.employeeClearHandle = function(event) {
    if(this.data.employeeId != null) {
        doConfirm('Confirm', 'Proceed with deleting this employee?', this, this.employeeDoClearHandle, null, null)
    }
}
EmployeeProjectCodeAccessItemEditForm.prototype.employeeDoClearHandle = function(event) {
    this.data.employeeId = null;
    this.loaded.employee = null;
    this.updateEmployeeView();
    this.dataChanged(true);    
}

EmployeeProjectCodeAccessItemEditForm.prototype.projectCodePickHandle = function(event) {
    var options = {
        "mode": 'SINGLE',
        "restriction": {
            client: null,
            subdepartment: null
        }
    };
    this.projectCodePicker = new ProjectCodePicker(options, "projectCodePicker", this.projectCodePicked, this, this.moduleName);
    this.projectCodePicker.init();
}
EmployeeProjectCodeAccessItemEditForm.prototype.projectCodePicked = function(projectCode) {
    this.data.projectCodeId = projectCode.id;
    this.loadProjectCodeContent();
    this.dataChanged(true);
}
EmployeeProjectCodeAccessItemEditForm.prototype.projectCodeClearHandle = function(event) {
    if(this.data.projectCodeId != null) {
        doConfirm('Confirm', 'Proceed with deleting this project code?', this, this.projectCodeDoClearHandle, null, null)
    }
}
EmployeeProjectCodeAccessItemEditForm.prototype.projectCodeDoClearHandle = function(event) {
    this.data.projectCodeId = null;
    this.loaded.projectCode = null;
    this.updateProjectCodeView();
    this.dataChanged(true);    
}

EmployeeProjectCodeAccessItemEditForm.prototype.updateView = function() {
    this.updateEmployeeView();
    this.updateProjectCodeView();
}
EmployeeProjectCodeAccessItemEditForm.prototype.updateEmployeeView = function() {
    var html = 'Undefind';
    if(this.data.employeeId != null) {
        html = this.loaded.employee.firstName + ' ' + this.loaded.employee.lastName;
    }
    $('#' + this.htmlId + '_employee').html(html); 
    
}
EmployeeProjectCodeAccessItemEditForm.prototype.updateProjectCodeView = function() {
    var html = 'Undefind';
    if(this.data.projectCodeId != null) {
        html = this.loaded.projectCode.code;
    }
    $('#' + this.htmlId + '_projectCode').html(html);
}

EmployeeProjectCodeAccessItemEditForm.prototype.show = function() {
    var title = 'Update employee project code access item';
    if(this.data.mode == 'CREATE') {
        title = 'Create employee project code access item';
    }    
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    this.makeButtons();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 500,
        height: 200,
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
EmployeeProjectCodeAccessItemEditForm.prototype.validate = function() {
    var errors = [];
    var emailRE = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if(this.data.employeeId == null) {
        errors.push("Employee is not set");
    }
    if(this.data.projectCodeId == null) {
        errors.push("Project code is not set");
    }
    return errors;
}
EmployeeProjectCodeAccessItemEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var serverFormData = clone(this.data);

    var form = this;
    var data = {};
    data.command = "saveEmployeeProjectCodeAccessItem";
    data.employeeProjectCodeAccessItemEditForm = getJSON(serverFormData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Employee Project Code Access Item has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeProjectCodeAccessItemEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}

EmployeeProjectCodeAccessItemEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}





//==================================================

function EmployeeProjectCodeAccessItemDeleteForm(employeeProjectCodeAccessItemId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "EmployeeProjectCodeAccessItemEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": employeeProjectCodeAccessItemId
    }
}
EmployeeProjectCodeAccessItemDeleteForm.prototype.init = function() {
    //this.checkDependencies();
    this.show();
}
EmployeeProjectCodeAccessItemDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkEmployeeProjectCodeAccessItemDependencies";
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
EmployeeProjectCodeAccessItemDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    //if(dependencies.projectCodes == 0) {
        this.show();
    //} else {
    //    var html = 'This ContactClientLink has dependencies and can not be deleted<br />';
    //    html += 'ContactClientLinks: ' + dependencies.projectCodes + '<br />';
    //    doAlert("Dependencies found", html, null, null);
    //}
}
EmployeeProjectCodeAccessItemDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this Employee Project Code Access Item", this, function() {this.doDeleteEmployeeProjectCodeAccessItem()}, null, null);
}
EmployeeProjectCodeAccessItemDeleteForm.prototype.doDeleteEmployeeProjectCodeAccessItem = function() {
    var form = this;
    var data = {};
    data.command = "deleteEmployeeProjectCodeAccessItem";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function() {
            doAlert("Info", "Employee Project Code Access Item has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeProjectCodeAccessItemDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}
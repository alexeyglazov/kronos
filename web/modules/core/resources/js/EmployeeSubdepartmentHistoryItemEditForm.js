/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function EmployeeSubdepartmentHistoryItemEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "EmployeeSubdepartmentHistoryItemEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.types = ["PROJECT_ACCESS", "TASK_AND_PROJECT_ACCESS", "PROJECT_CODE_CONFLICT_NOTIFICATION", "CLIENT_CONFLICT_NOTIFICATION"];
    this.picked = {
        "employee": null
    };
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "type": formData.type,
        "employeeId": formData.employeeId,
        "subdepartmentId": formData.subdepartmentId,
        "start": calendarVisualizer.getHtml(formData.start),
        "end": calendarVisualizer.getHtml(formData.end)
    }
}
EmployeeSubdepartmentHistoryItemEditForm.prototype.start = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    if(this.data.mode == "UPDATE") {
        this.show();
        //this.checkDependencies();
    } else {
       this.show();
    }
    this.dataChanged(false);
}
EmployeeSubdepartmentHistoryItemEditForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkEmployeeDependencies";
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
EmployeeSubdepartmentHistoryItemEditForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.timeSpentItems == 0 && dependencies.createdProjectCodes == 0 && dependencies.closedProjectCodes == 0 && dependencies.clientHistoryItems == 0) {
        this.show();
    } else {
        var html = 'This Employee has dependencies and can not be updated<br />';
        html += 'Time Spent Items: ' + dependencies.timeSpentItems + '<br />';
        html += 'Created Project Codes: ' + dependencies.createdProjectCodes + '<br />';
        html += 'Closed Project Codes: ' + dependencies.closedProjectCodes + '<br />';
        html += 'Client History Items: ' + dependencies.clientHistoryItems + '<br />';
        doAlert("Dependencies found", html, null, null);
    }
}
EmployeeSubdepartmentHistoryItemEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    if(this.data.mode == "CREATE") {
        html += '<tr><td>Employee</td><td><input type="text" id="' + this.htmlId + '_employee" disabled><span id="' + this.htmlId + '_employeePick" class="link">Pick</span></td></tr>';
    }
    if(this.data.mode == "CREATE") {
        html += '<tr><td>Subdepartment</td><td><input type="text" id="' + this.htmlId + '_subdepartment" disabled><span id="' + this.htmlId + '_subdepartmentPick" class="link">Pick</span></td></tr>';
    }
    html += '<tr><td>Type</td><td><select id="' + this.htmlId + '_type"></select></td></tr>';
    html += '<tr><td>Start</td><td><input type="text" id="' + this.htmlId + '_start"></td></tr>';
    html += '<tr><td>End</td><td><input type="text" id="' + this.htmlId + '_end"></td></tr>';
    html += '</table>';
    html += '<div id="' + this.htmlId + '_popup"></div>';
    return html
}
EmployeeSubdepartmentHistoryItemEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_employeePick').bind("click", function(event) {form.openEmployeePicker.call(form, event);});
    $('#' + this.htmlId + '_subdepartmentPick').bind("click", function(event) {form.openSubdepartmentPicker.call(form, event);});
    $('#' + this.htmlId + '_type').bind("change", function(event) {form.typeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_start').bind("change", function(event) {form.startTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_end').bind("change", function(event) {form.endTextChangedHandle.call(form, event)});
}
EmployeeSubdepartmentHistoryItemEditForm.prototype.makeDatePickers = function() {
    var form = this;
    $('#' + this.htmlId + '_start').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.startChangedHandle(dateText, inst)}
    });
    $('#' + this.htmlId + '_end').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.endChangedHandle(dateText, inst)}
    });
}
EmployeeSubdepartmentHistoryItemEditForm.prototype.openEmployeePicker = function(event) {
    var employeePicker = new EmployeePicker("employeePicker", this.pickEmployee, this, "Rights");
    employeePicker.init();
}
EmployeeSubdepartmentHistoryItemEditForm.prototype.openSubdepartmentPicker = function(event) {
    var subdepartmentPicker = new SubdepartmentPicker("subdepartmentPicker", this.pickSubdepartment, this, "Rights");
    subdepartmentPicker.init();
}
EmployeeSubdepartmentHistoryItemEditForm.prototype.pickEmployee = function(employee) {
    this.picked.employee = employee;
    this.data.employeeId = this.picked.employee.id;
    this.updateEmployeeView();
    this.dataChanged(true);
}
EmployeeSubdepartmentHistoryItemEditForm.prototype.pickSubdepartment = function(subdepartment) {
    this.picked.subdepartment = subdepartment;
    this.data.subdepartmentId = this.picked.subdepartment.id;
    this.updateSubdepartmentView();
    this.dataChanged(true);
}
EmployeeSubdepartmentHistoryItemEditForm.prototype.typeChangedHandle = function(dateText, inst) {
    this.data.type = $('#' + this.htmlId + '_type').val();
    this.dataChanged(true);
}
EmployeeSubdepartmentHistoryItemEditForm.prototype.startChangedHandle = function(dateText, inst) {
    this.data.start = dateText;
    this.dataChanged(true);
}
EmployeeSubdepartmentHistoryItemEditForm.prototype.startTextChangedHandle = function(event) {
    this.data.start = jQuery.trim(event.currentTarget.value);
    this.updateStartView();
    this.dataChanged(true);
}
EmployeeSubdepartmentHistoryItemEditForm.prototype.endChangedHandle = function(dateText, inst) {
    this.data.end = dateText;
    this.dataChanged(true);
}
EmployeeSubdepartmentHistoryItemEditForm.prototype.endTextChangedHandle = function(event) {
    this.data.end = jQuery.trim(event.currentTarget.value);
    this.updateEndView();
    this.dataChanged(true);
}
EmployeeSubdepartmentHistoryItemEditForm.prototype.updateView = function() {
    this.updateEmployeeView();
    this.updateTypeView();
    this.updateStartView();
    this.updateEndView();
}
EmployeeSubdepartmentHistoryItemEditForm.prototype.updateEmployeeView = function() {
    if(this.picked.employee == null) {
        $('#' + this.htmlId + '_employee').val("");
    } else {
        $('#' + this.htmlId + '_employee').val(this.picked.employee.userName);
    }
}
EmployeeSubdepartmentHistoryItemEditForm.prototype.updateSubdepartmentView = function() {
    if(this.picked.subdepartment == null) {
        $('#' + this.htmlId + '_subdepartment').val("");
    } else {
        $('#' + this.htmlId + '_subdepartment').val(this.picked.subdepartment.name);
    }
}
EmployeeSubdepartmentHistoryItemEditForm.prototype.updateTypeView = function() {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.types) {
        var type = this.types[key];
        var isSelected = "";
        if(type == this.data.type) {
           isSelected = "selected";
        }
        html += '<option value="' + type + '" ' + isSelected + '>' + type + '</option>';
    }
    $('#'+ this.htmlId + '_type').html(html);
}
EmployeeSubdepartmentHistoryItemEditForm.prototype.updateStartView = function() {
    $('#' + this.htmlId + '_start').val(this.data.start);
}
EmployeeSubdepartmentHistoryItemEditForm.prototype.updateEndView = function() {
    $('#' + this.htmlId + '_end').val(this.data.end);
}
EmployeeSubdepartmentHistoryItemEditForm.prototype.show = function() {
    var title = 'Update Employee Subdepartment History Item'
    if(this.data.mode == 'CREATE') {
        title = 'Create Employee Subdepartment History Item';
    }
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
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
    this.makeDatePickers();
    this.updateView();
}
EmployeeSubdepartmentHistoryItemEditForm.prototype.validate = function() {
    var errors = [];
    var start = null;
    var end = null;
    if(this.data.subdepartmentId == null) {
        errors.push("Subdepartment is not set");
    }
    if(this.data.employeeId == null) {
        errors.push("Employee is not set");
    }
    if(this.data.type == null) {
        errors.push("Type is not set");
    }
    if(this.data.start == null || this.data.start == "") {
        errors.push("Start date is not set");
    } else if(! isDateValid(this.data.start)) {
        errors.push("Start date has incorrect format");
    } else {
        start = parseDateString(this.data.start);
    }
    if(this.data.end == null || this.data.end == "") {
    } else if(! isDateValid(this.data.end)) {
        errors.push("End date has incorrect format");
    } else {
        end = parseDateString(this.data.end);
    }
    if(start != null && end != null && start > end) {
        errors.push("End date is less than Start date");
    }
    return errors;
}
EmployeeSubdepartmentHistoryItemEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        var message = "";
        for(var key in errors) {
            message += errors[key] + "<br />";
        }
        doAlert("Validation error", message, null, null);
        return;
    }
    var employeeSubdepartmentHistoryItemEditForm = clone(this.data);
    employeeSubdepartmentHistoryItemEditForm.start = getYearMonthDateFromDateString(this.data.start);
    employeeSubdepartmentHistoryItemEditForm.end = getYearMonthDateFromDateString(this.data.end);
    var form = this;
    var data = {};
    data.command = "saveEmployeeSubdepartmentHistoryItem";
    data.employeeSubdepartmentHistoryItemEditForm = getJSON(employeeSubdepartmentHistoryItemEditForm);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "This Employee Subdepartment History Item Item has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeSubdepartmentHistoryItemEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}

EmployeeSubdepartmentHistoryItemEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}


//==================================================

function EmployeeSubdepartmentHistoryItemDeleteForm(employeeSubdepartmentHistoryItemId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "EmployeeSubdepartmentHistoryItemEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": employeeSubdepartmentHistoryItemId
    }
}
EmployeeSubdepartmentHistoryItemDeleteForm.prototype.start = function() {
    this.checkDependencies();
}
EmployeeSubdepartmentHistoryItemDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkEmployeeSubdepartmentHistoryItemDependencies";
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
EmployeeSubdepartmentHistoryItemDeleteForm.prototype.analyzeDependencies = function(dependencies) {
//    if(dependencies.employeePositionHistoryItems > 1) {
        this.show();
//    } else {
//        var html = 'This Employee Position History Item is the last one and can not be deleted<br />';
//        doAlert("Dependencies found", html, null, null);
//    }
}
EmployeeSubdepartmentHistoryItemDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this Employee Subdepartment History Item", this, function() {this.doDeleteEmployeeSubdepartmentHistoryItem()}, null, null);
}
EmployeeSubdepartmentHistoryItemDeleteForm.prototype.doDeleteEmployeeSubdepartmentHistoryItem = function() {
    var form = this;
    var data = {};
    data.command = "deleteEmployeeSubdepartmentHistoryItem";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Employee Subdepartment History Item has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeSubdepartmentHistoryItemDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}
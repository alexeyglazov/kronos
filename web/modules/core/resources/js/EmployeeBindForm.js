/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function EmployeeBindForm(formData, htmlId, containerHtmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "EmployeeEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.loaded = {
        "countries": [],
        "offices": [],
        "departments": [],
        "subdepartments": [],
        "positions": [],
        "employees": []
    }
    this.selected = {
        "countryId": null,
        "officeId": null,
        "departmentId": null,
        "subdepartmentId": null,
        "positionId": null
    }
    this.data = {
        "positionId": formData.positionId,
        "employeeId": null
    }
}
EmployeeBindForm.prototype.start = function() {
    this.loadCountriesOfficesDepartmentsSubdepartmentsPositionsEmployees();
    this.dataChanged(false);
}
EmployeeBindForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td style="height: 30px;"><select id="' + this.htmlId + '_country"></select></td><td><select id="' + this.htmlId + '_office"></select></td></tr>';
    html += '<tr><td style="height: 30px;"><select id="' + this.htmlId + '_department"></select></td><td><select id="' + this.htmlId + '_subdepartment"></select></td></tr>';
    html += '<tr><td style="height: 30px;" colspan="2"><select id="' + this.htmlId + '_position"></select></td></tr>';
    html += '</table>';
    html += '<table><tr><td style="height: 200px; width: 400px; vertical-align: top;"><div id="' + this.htmlId + '_employee" class="selector" style="height: 200px;"></div></td></tr></table>';
    return html;
}
EmployeeBindForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_country').bind("change", function(event) {form.countryChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_office').bind("change", function(event) {form.officeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_department').bind("change", function(event) {form.departmentChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_subdepartment').bind("change", function(event) {form.subdepartmentChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_position').bind("change", function(event) {form.positionChangedHandle.call(form, event);});
}
EmployeeBindForm.prototype.countryChangedHandle = function(event) {
    this.selected.countryId = parseInt($('#' + this.htmlId + '_country').val());
    var form = this;
    var data = {};
    data.command = "getOfficesDepartmentsSubdepartmentsPositionsEmployees";
    data.countryId = this.selected.countryId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.offices = result.offices;
            form.loaded.departments = result.departments;
            form.loaded.subdepartments = result.subdepartments;
            form.loaded.positions = result.positions;
            form.loaded.employees = result.employees;
            if(form.loaded.offices.length > 0) {
                form.selected.officeId = form.loaded.offices[0].id;
            } else {
                form.selected.officeId = null;
            }
            if(form.loaded.departments.length > 0) {
                form.selected.departmentId = form.loaded.departments[0].id;
            } else {
                form.selected.departmentId = null;
            }
            if(form.loaded.subdepartments.length > 0) {
                form.selected.subdepartmentId = form.loaded.subdepartments[0].id;
            } else {
                form.selected.subdepartmentId = null;
            }
            if(form.loaded.positions.length > 0) {
                form.selected.positionId = form.loaded.positions[0].id;
            } else {
                form.selected.positionId = null;
            }
            if(form.loaded.employees.length > 0) {
                form.data.employeeId = form.loaded.employees[0].id;
            } else {
                form.data.employeeId = null;
            }
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
    this.dataChanged(true);
}
EmployeeBindForm.prototype.officeChangedHandle = function(event) {
    this.selected.officeId = parseInt($('#' + this.htmlId + '_office').val());
    var form = this;
    var data = {};
    data.command = "getDepartmentsSubdepartmentsPositionsEmployees";
    data.officeId = this.selected.officeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.departments = result.departments;
            form.loaded.subdepartments = result.subdepartments;
            form.loaded.positions = result.positions;
            form.loaded.employees = result.employees;
            if(form.loaded.departments.length > 0) {
                form.selected.departmentId = form.loaded.departments[0].id;
            } else {
                form.selected.departmentId = null;
            }
            if(form.loaded.subdepartments.length > 0) {
                form.selected.subdepartmentId = form.loaded.subdepartments[0].id;
            } else {
                form.selected.subdepartmentId = null;
            }
            if(form.loaded.positions.length > 0) {
                form.selected.positionId = form.loaded.positions[0].id;
            } else {
                form.selected.positionId = null;
            }
            if(form.loaded.employees.length > 0) {
                form.data.employeeId = form.loaded.employees[0].id;
            } else {
                form.data.employeeId = null;
            }
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
    this.dataChanged(true);
}
EmployeeBindForm.prototype.departmentChangedHandle = function(event) {
    this.selected.departmentId = parseInt($('#' + this.htmlId + '_department').val());
    var form = this;
    var data = {};
    data.command = "getSubdepartmentsPositionsEmployees";
    data.departmentId = this.selected.departmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.subdepartments = result.subdepartments;
            form.loaded.positions = result.positions;
            form.loaded.employees = result.employees;
            if(form.loaded.subdepartments.length > 0) {
                form.selected.subdepartmentId = form.loaded.subdepartments[0].id;
            } else {
                form.selected.subdepartmentId = null;
            }
            if(form.loaded.positions.length > 0) {
                form.selected.positionId = form.loaded.positions[0].id;
            } else {
                form.selected.positionId = null;
            }
            if(form.loaded.employees.length > 0) {
                form.data.employeeId = form.loaded.employees[0].id;
            } else {
                form.data.employeeId = null;
            }
            form.updateView();            
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
    this.dataChanged(true);
}
EmployeeBindForm.prototype.subdepartmentChangedHandle = function(event) {
    this.selected.subdepartmentId = parseInt($('#' + this.htmlId + '_subdepartment').val());
    var form = this;
    var data = {};
    data.command = "getPositionsEmployees";
    data.subdepartmentId = this.selected.subdepartmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.positions = result.positions;
            form.loaded.employees = result.employees;
            if(form.loaded.positions.length > 0) {
                form.selected.positionId = form.loaded.positions[0].id;
            } else {
                form.selected.positionId = null;
            }
            if(form.loaded.employees.length > 0) {
                form.data.employeeId = form.loaded.employees[0].id;
            } else {
                form.data.employeeId = null;
            }
            form.updateView();            
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
    this.dataChanged(true);
}
EmployeeBindForm.prototype.positionChangedHandle = function(event) {
    this.selected.positionId = parseInt($('#' + this.htmlId + '_position').val());
    var form = this;
    var data = {};
    data.command = "getEmployees";
    data.positionId = this.selected.positionId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.employees = result.employees;
            if(form.loaded.employees.length > 0) {
                form.data.employeeId = form.loaded.employees[0].id;
            } else {
                form.data.employeeId = null;
            }
            form.updateView();            
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
    this.dataChanged(true);
}
EmployeeBindForm.prototype.employeeClickedHandle = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    this.data.employeeId = parseInt(tmp[tmp.length - 1]);
    this.updateEmployeeView();
    this.dataChanged(true);
}
EmployeeBindForm.prototype.updateView = function() {
    this.updateCountryView();
    this.updateOfficeView();
    this.updateDepartmentView();
    this.updateSubdepartmentView();
    this.updatePositionView();
    this.updateEmployeeView();
}
EmployeeBindForm.prototype.updateCountryView = function() {
    var html = '';
    for(var key in this.loaded.countries) {
        var country = this.loaded.countries[key];
        var isSelected = "";
        if(country.id == this.selected.countryId) {
           isSelected = "selected";
        }
        html += '<option value="' + country.id + '" ' + isSelected + '>' + country.name + '</option>';
    }
    $('#' + this.htmlId + '_country').html(html);
}
EmployeeBindForm.prototype.updateOfficeView = function() {
    var html = '';
    for(var key in this.loaded.offices) {
        var office = this.loaded.offices[key];
        var isSelected = "";
        if(office.id == this.selected.officeId) {
           isSelected = "selected";
        }
        html += '<option value="' + office.id + '" ' + isSelected + '>' + office.name + '</option>';
    }
    $('#' + this.htmlId + '_office').html(html);
}
EmployeeBindForm.prototype.updateDepartmentView = function() {
    var html = '';
    for(var key in this.loaded.departments) {
        var department = this.loaded.departments[key];
        var isSelected = "";
        if(department.id == this.selected.departmentId) {
           isSelected = "selected";
        }
        html += '<option value="' + department.id + '" ' + isSelected + '>' + department.name + '</option>';
    }
    $('#' + this.htmlId + '_department').html(html);
}
EmployeeBindForm.prototype.updateSubdepartmentView = function() {
    var html = '';
    for(var key in this.loaded.subdepartments) {
        var subdepartment = this.loaded.subdepartments[key];
        var isSelected = "";
        if(subdepartment.id == this.selected.subdepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="' + subdepartment.id + '" ' + isSelected + '>' + subdepartment.name + '</option>';
    }
    $('#' + this.htmlId + '_subdepartment').html(html);
}
EmployeeBindForm.prototype.updatePositionView = function() {
    var html = '';
    for(var key in this.loaded.positions) {
        var position = this.loaded.positions[key];
        var isSelected = "";
        if(position.id == this.selected.positionId) {
           isSelected = "selected";
        }
        html += '<option value="' + position.id + '" ' + isSelected + '>' + position.name + '</option>';
    }
    $('#' + this.htmlId + '_position').html(html);
}
EmployeeBindForm.prototype.updateEmployeeView = function() {
    var html = '';
    for(var key in this.loaded.employees) {
        var employee = this.loaded.employees[key];
        var classSelected = "";
        if(employee.id == this.data.employeeId) {
           classSelected = 'class="selected"';
        }
        html += '<div id="' + this.htmlId + '_employee_' + employee.id + '" ' + classSelected + '>' + employee.userName + ' (' + employee.firstName + ' ' + employee.lastName + ')' + '</div>';
    }
    $('#' + this.htmlId + '_employee').html(html);
    var form = this;
    $('div[id^="' + this.htmlId + '_employee_"]').bind("click", function(event) {form.employeeClickedHandle(event);});
}
EmployeeBindForm.prototype.loadCountriesOfficesDepartmentsSubdepartmentsPositionsEmployees = function() {
    var form = this;
    var data = {};
    data.command = "getCountriesOfficesDepartmentsSubdepartmentsPositionsEmployees";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.countries = result.countries;
            form.loaded.offices = result.offices;
            form.loaded.departments = result.departments;
            form.loaded.subdepartments = result.subdepartments;
            form.loaded.positions = result.positions;
            form.loaded.employees = result.employees;
            if(form.loaded.countries.length > 0) {
                form.selected.countryId = form.loaded.countries[0].id;
            } else {
                form.selected.countryId = null;
            }
            if(form.loaded.offices.length > 0) {
                form.selected.officeId = form.loaded.offices[0].id;
            } else {
                form.selected.officeId = null;
            }
            if(form.loaded.departments.length > 0) {
                form.selected.departmentId = form.loaded.departments[0].id;
            } else {
                form.selected.departmentId = null;
            }
            if(form.loaded.subdepartments.length > 0) {
                form.selected.subdepartmentId = form.loaded.subdepartments[0].id;
            } else {
                form.selected.subdepartmentId = null;
            }
            if(form.loaded.positions.length > 0) {
                form.selected.positionId = form.loaded.positions[0].id;
            } else {
                form.selected.positionId = null;
            }
            if(form.loaded.employees.length > 0) {
                form.data.employeeId = form.loaded.employees[0].id;
            } else {
                form.data.employeeId = null;
            }
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeBindForm.prototype.show = function() {
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: "Bind employee",
        modal: true,
        position: 'center',
        width: 600,
        height: 500,
        buttons: {
            Ok: function() {
                form.save();
            },
            Cancel: function() {
                $(this).dialog( "close" );
                form.dataChanged(false);
            }
	}
    });
    this.updateView();
}
EmployeeBindForm.prototype.validate = function() {
    var errors = [];
    if(this.data.employeeId == null) {
        errors.push("Employee is not selected");
    }
    if(this.data.positionId == null) {
        errors.push("Position is not selected");
    }
    return errors;
}
EmployeeBindForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        var message = "";
        for(var key in errors) {
            message += errors[key] + "<br />";
        }
        doAlert("Validation error", message, null, null);
        return;
    }
    var form = this;
    var data = {};
    data.command = "bindEmployee";
    data.employeeBindForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Employee has been successfully bound to this position", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeBindForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}

EmployeeEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}


//==================================================

function EmployeeUnbindForm(formData, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "EmployeeEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "employeeId": formData.employeeId,
        "positionId": formData.positionId
    }
}
EmployeeUnbindForm.prototype.start = function() {
    this.checkDependencies();
}
EmployeeUnbindForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkEmployeeDependenciesToUnbind";
    data.employeeId = this.data.employeeId;
    data.positionId = this.data.positionId;
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
EmployeeUnbindForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.currentSubdepartments == 1) {
        var html = 'This Employee is currently bound to only one subdepartment and can not be unbound<br />';
        doAlert("Dependencies found", html, null, null);
    } else if(dependencies.remainingCurrentMainEmployeePositionHistoryItems == 0) {
        var html = 'You are about to unbound the last Main subdepartment<br />Employee should have at least one main subdepartment';
        doAlert("Dependencies found", html, null, null);
    } else {
        this.show();
    }
}
EmployeeUnbindForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to unbind this Employee from this Position", this, function() {this.doDeleteEmployee()}, null, null);
}
EmployeeUnbindForm.prototype.doDeleteEmployee = function() {
    var form = this;
    var data = {};
    data.command = "unbindEmployee";
    data.employeeId = this.data.employeeId;
    data.positionId = this.data.positionId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Employee has been successfully unbound", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeUnbindForm.prototype.afterSave = function() {
    $("#admin_info").dialog("close");
    this.successHandler.call(this.successContext);
}
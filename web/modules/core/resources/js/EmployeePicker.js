/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function EmployeePicker(htmlId, okHandler, okHandlerContext, moduleName, options) {
    this.config = {
        endpointUrl: endpointsFolder + "EmployeePicker.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.okHandler = okHandler;
    this.okHandlerContext = okHandlerContext;
    this.moduleName = moduleName;
    this.loaded = {
        "offices": [],
        "departments": [],
        "subdepartments": [],
        "standardPositions": [],
        "employees": []
    }
    this.data = {
        employeeFilter: ''
    }
    this.selected = {
        "officeId": null,
        "departmentId": null,
        "subdepartmentId": null,
        "standardPositionIds": null,
        "employeeId": null,
        "active" : true
    }
    if(options != null) {
        this.selected.standardPositionIds = options.standardPositionIds;
    }
}
EmployeePicker.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
}
EmployeePicker.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.moduleName = this.moduleName;
    data.active = this.selected.active;
    data.standardPositionIds = getJSON({"list": this.selected.standardPositionIds});
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.offices = result.offices;
            form.loaded.departments = [];
            form.loaded.subdepartments = [];
            form.loaded.standardPositions = result.standardPositions;
            form.loaded.employees = result.employees;
            form.selected.officeId = null;
            form.selected.departmentId = null;
            form.selected.subdepartmentId = null;
            if(form.selected.standardPositionIds == null) {
                form.selected.standardPositionIds = [];
                for(var key in form.loaded.standardPositions) {
                    var standardPositionId = form.loaded.standardPositions[key].id;
                    form.selected.standardPositionIds.push(standardPositionId);
                }
            }    
            if(form.loaded.employees.length > 0) {
                form.selected.employeeId = form.loaded.employees[0].id;
            } else {
                form.selected.employeeId = null;
            }
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeePicker.prototype.loadNullOfficeContent = function() {
    var form = this;
    var data = {};
    data.command = "getNullOfficeContent";
    data.moduleName = this.moduleName;
    data.active = this.selected.active;
    data.standardPositionIds = getJSON({"list": this.selected.standardPositionIds});
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.departments = [];
            form.loaded.subdepartments = [];
            form.loaded.employees = result.employees;
            form.selected.departmentId = null;
            form.selected.subdepartmentId = null;
            if(form.loaded.employees.length > 0) {
                form.selected.employeeId = form.loaded.employees[0].id;
            } else {
                form.selected.employeeId = null;
            }
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeePicker.prototype.loadOfficeContent = function() {
    var form = this;
    var data = {};
    data.command = "getOfficeContent";
    data.officeId = this.selected.officeId;
    data.moduleName = this.moduleName;
    data.active = this.selected.active;
    data.standardPositionIds = getJSON({"list": this.selected.standardPositionIds});
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.departments = result.departments;
            form.loaded.subdepartments = [];
            form.loaded.employees = result.employees;
            form.selected.departmentId = null;
            form.selected.subdepartmentId = null;
            if(form.loaded.employees.length > 0) {
                form.selected.employeeId = form.loaded.employees[0].id;
            } else {
                form.selected.employeeId = null;
            }
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeePicker.prototype.loadDepartmentContent = function() {
    var form = this;
    var data = {};
    data.command = "getDepartmentContent";
    data.departmentId = this.selected.departmentId;
    data.moduleName = this.moduleName;
    data.active = this.selected.active;
    data.standardPositionIds = getJSON({"list": this.selected.standardPositionIds});
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.subdepartments = result.subdepartments;
            form.loaded.employees = result.employees;
            form.selected.subdepartmentId = null;
            if(form.loaded.employees.length > 0) {
                form.selected.employeeId = form.loaded.employees[0].id;
            } else {
                form.selected.employeeId = null;
            }
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeePicker.prototype.loadSubdepartmentContent = function() {
    var form = this;
    var data = {};
    data.command = "getSubdepartmentContent";
    data.subdepartmentId = this.selected.subdepartmentId;
    data.moduleName = this.moduleName;
    data.active = this.selected.active;
    data.standardPositionIds = getJSON({"list": this.selected.standardPositionIds});
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.employees = result.employees;
            if(form.loaded.employees.length > 0) {
                form.selected.employeeId = form.loaded.employees[0].id;
            } else {
                form.selected.employeeId = null;
            }
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}

EmployeePicker.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Office</span></td>';
    html += '<td><span class="label1">Department</span></td>';
    html += '<td><span class="label1">Subdepartment</span></td>';
    html += '<td><span class="label1">Only active</span></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><select id="' + this.htmlId + '_office"></select></td>';
    html += '<td><select id="' + this.htmlId + '_department"></select></td>';
    html += '<td><select id="' + this.htmlId + '_subdepartment"></select></td>';
    html += '<td><input type="checkbox" id="' + this.htmlId + '_active"></td>';
    html += '</tr>';

    html += '</table>';
    html += '<table>';
    html += '<tr><td><span class="label1">Standard position</span></td><td><span class="label1">Employee</span></td></tr>';
    html += '<tr><td style="vertical-align: top;">';
    html += '<table>';
    for(var key in this.loaded.standardPositions) {
        var standardPosition = this.loaded.standardPositions[key];
        html += '<tr><td><input type="checkbox" id="' + this.htmlId + '_standardPosition_' + standardPosition.id + '"></td><td>' + standardPosition.name + '</td></tr>'
    }
    html += '</table>';
    html += '</td><td><span class="label1">Filter</span> <input type="text" id="' + this.htmlId + '_employeeFilter"><br /><select id="' + this.htmlId + '_employee" size="15" style="width: 400px;"></select></td></tr>';
    html += '</table>';
    return html;
}
EmployeePicker.prototype.updateView = function() {
    this.updateOfficeView();
    this.updateDepartmentView();
    this.updateSubdepartmentView();
    this.updateStandardPositionView();
    this.updateEmployeeFilterView();
    this.updateEmployeeView();
    this.updateActiveView();
}
EmployeePicker.prototype.updateOfficeView = function() {
    var html = '';
    html += '<option value="ALL">ALL</option>';
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
EmployeePicker.prototype.updateDepartmentView = function() {
    var html = '';
    html += '<option value="ALL">ALL</option>';
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
EmployeePicker.prototype.updateSubdepartmentView = function() {
    var html = '';
    html += '<option value="ALL">ALL</option>';
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
EmployeePicker.prototype.updateStandardPositionView = function() {
    var html = '';
    for(var key in this.loaded.standardPositions) {
        var standardPosition = this.loaded.standardPositions[key];
        if($.inArray(standardPosition.id, this.selected.standardPositionIds) != -1) {
            $('#' + this.htmlId + '_standardPosition_' + standardPosition.id).attr("checked", true);
        } else {
            $('#' + this.htmlId + '_standardPosition_' + standardPosition.id).attr("checked", false);
        }
    }
}
EmployeePicker.prototype.updateEmployeeFilterView = function() {
    $('#' + this.htmlId + '_employeeFilter').val(this.data.employeeFilter);
}
EmployeePicker.prototype.updateEmployeeView = function() {
    var html = '';
    var filter = null;
    if(this.data.employeeFilter != null && this.data.employeeFilter != '') {
        filter = this.data.employeeFilter.toLowerCase();
    }
    for(var key in this.loaded.employees) {
        var employee = this.loaded.employees[key];
        var found = true;
        if(filter != null) {
            found = false;
            if(employee.firstName.toLowerCase().indexOf(filter) != -1 ) {
                found = true;
            } else if(employee.lastName.toLowerCase().indexOf(filter) != -1 ) {
                found = true;
            } else if(employee.userName.toLowerCase().indexOf(filter) != -1 ) {
                found = true;
            } else if(employee.firstNameLocalLanguage != null && employee.firstNameLocalLanguage.toLowerCase().indexOf(filter) != -1 ) {
                found = true;
            } else if(employee.lastNameLocalLanguage != null && employee.lastNameLocalLanguage.toLowerCase().indexOf(filter) != -1 ) {
                found = true;
            }
        }
        if(! found) {
            continue;
        }
        var isSelected = "";
        if(employee.id == this.selected.employeeId) {
           isSelected = "selected";
        }
        html += '<option value="' + employee.id + '" ' + isSelected + '>' + employee.firstName + ' ' + employee.lastName + '</option>';
    }
    $('#' + this.htmlId + '_employee').html(html);
}
EmployeePicker.prototype.updateActiveView = function() {
    $('#' + this.htmlId + '_active').attr("checked", this.selected.active);
}
EmployeePicker.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_office').bind("change", function(event) {form.officeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_department').bind("change", function(event) {form.departmentChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_subdepartment').bind("change", function(event) {form.subdepartmentChangedHandle.call(form, event);});
    $('input[id^="' + this.htmlId + '_standardPosition_"]').bind("click", function(event) {form.standardPositionChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_employeeFilter').bind("keyup", function(event) {form.employeeFilterChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_employee').bind("change", function(event) {form.employeeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_active').bind("change", function(event) {form.activeChangedHandle.call(form, event);});
}
EmployeePicker.prototype.officeChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_office').val();
    if(idTxt == 'ALL') {
        this.selected.officeId = null;
    } else {
        this.selected.officeId = parseInt(idTxt);
    }
    if(this.selected.officeId == null) {
        this.loadNullOfficeContent();
    } else {
        this.loadOfficeContent();
    }
}
EmployeePicker.prototype.departmentChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_department').val();
    if(idTxt == 'ALL') {
        this.selected.departmentId = null;
    } else {
        this.selected.departmentId = parseInt(idTxt);
    }
    if(this.selected.departmentId == null) {
        this.loadOfficeContent();
    } else {
        this.loadDepartmentContent();
    }
}
EmployeePicker.prototype.subdepartmentChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_subdepartment').val();
    if(idTxt == 'ALL') {
        this.selected.subdepartmentId = null;
    } else {
        this.selected.subdepartmentId = parseInt(idTxt);
    }
    if(this.selected.subdepartmentId == null) {
        this.loadDepartmentContent();
    } else {
        this.loadSubdepartmentContent();
    }
}
EmployeePicker.prototype.standardPositionChangedHandle = function(event) {
    this.selected.standardPositionIds = [];
    for(var key in this.loaded.standardPositions) {
        var standardPosition = this.loaded.standardPositions[key];
        var isChecked = $('#' + this.htmlId + '_standardPosition_' + standardPosition.id).is(":checked");
        if(isChecked) {
            this.selected.standardPositionIds.push(standardPosition.id);
        }
    }
    this.updateStandardPositionView();
    this.generalStateChangedHandle();
}
EmployeePicker.prototype.employeeFilterChangedHandle = function(event) {
    var value = $('#' + this.htmlId + '_employeeFilter').val();
    value = $.trim(value);
    if(value != this.data.employeeFilter) {
        this.data.employeeFilter = value;
        this.selected.employeeId = null;
        this.updateEmployeeView();
    }
    this.updateEmployeeFilterView();
}
EmployeePicker.prototype.employeeChangedHandle = function(event) {
    var htmlId = $('#' + this.htmlId + '_employee').val();
    if(htmlId == null || htmlId == '') {
        this.selected.employeeId = null;
    } else {
        this.selected.employeeId = parseInt(htmlId);
    }
}
EmployeePicker.prototype.activeChangedHandle = function(event) {
    this.selected.active = $('#' + this.htmlId + '_active').is(':checked');
    this.generalStateChangedHandle();
}
EmployeePicker.prototype.generalStateChangedHandle = function(event) {
    if(this.selected.subdepartmentId != null) {
        this.loadSubdepartmentContent();
    } else if(this.selected.departmentId != null) {
        this.loadDepartmentContent();
    } else if(this.selected.officeId != null) {
        this.loadOfficeContent();
    } else {
        this.loadNullOfficeContent();
    }
}
EmployeePicker.prototype.show = function() {
    var title = 'Pick Employee'
    var form = this;
    $("#" + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    $("#" + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 700,
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
    this.updateView();
}
EmployeePicker.prototype.okClickHandle = function() {
    var employee = null;
    if(this.selected.employeeId != null) {
        for(var key in this.loaded.employees) {
            if(this.loaded.employees[key].id == this.selected.employeeId) {
                employee = this.loaded.employees[key];
            }
        }
    }
    this.okHandler.call(this.okHandlerContext, employee);
}
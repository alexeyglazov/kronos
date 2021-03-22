/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function RightsManager(htmlId, containerHtmlId) {
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.config = {
        endpointUrl: endpointsFolder+ "RightsManager.jsp"
    };
    this.loaded = {
        "modules": [],
        "countries": [],
        "offices": [],
        "departments": [],
        "subdepartments": [],
        "employees": []
    };
    this.selected = {
        "countryId": null,
        "officeId": null,
        "departmentId": null,
        "subdepartmentId": null,
        "employeeId": null
    }
    this.data = {
        "employeeProfiles" : []
    }
}
RightsManager.prototype.init = function() {
    this.loadInitialContent();
}
RightsManager.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.modules = result.modules;
            form.loaded.countries = result.countries;
            form.loaded.offices = result.offices;
            form.loaded.departments = [];
            form.loaded.subdepartments = [];
            form.loaded.employees = result.employees;
            if(form.loaded.countries.length > 0) {
                form.selected.countryId = form.loaded.countries[0].id;
            } else {
                form.selected.countryId = null;
            }
            form.selected.officeId = null;
            form.selected.departmentId = null;
            form.selected.subdepartmentId = null;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
RightsManager.prototype.loadCountryContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getOfficesEmployees";
    data.countryId = this.selected.countryId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.offices = result.offices;
            form.loaded.departments = [];
            form.loaded.subdepartments = [];
            form.loaded.employees = result.employees;
            form.selected.officeId = null;
            form.selected.departmentId = null;
            form.selected.subdepartmentId = null;
            form.data.employeeProfiles = [];
            form.clearEmployeeSelection();
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
RightsManager.prototype.loadOfficeContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getDepartmentsEmployees";
    data.officeId = this.selected.officeId;
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
            form.data.employeeProfiles = [];
            form.clearEmployeeSelection();
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
RightsManager.prototype.loadDepartmentContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getSubdepartmentsEmployees";
    data.departmentId = this.selected.departmentId;
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
            form.data.employeeProfiles = [];
            form.clearEmployeeSelection();
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
RightsManager.prototype.loadSubdepartmentContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getEmployees";
    data.subdepartmentId = this.selected.subdepartmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data) {
        ajaxResultHandle(data, form, function(result) {
            form.loaded.employees = result.employees;
            form.data.employeeProfiles = [];
            form.clearEmployeeSelection();
            form.show();
        })
     },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
RightsManager.prototype.countryChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_country').val();
    if(idTxt == 'ALL') {
        this.selected.countryId = null;
    } else {
        this.selected.countryId = parseInt(idTxt);
    }
    if(this.selected.countryId == null) {
        this.loadInitialContent();
    } else {
        this.loadCountryContent();
    }
}
RightsManager.prototype.officeChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_office').val();
    if(idTxt == 'ALL') {
        this.selected.officeId = null;
    } else {
        this.selected.officeId = parseInt(idTxt);
    }
    if(this.selected.officeId == null) {
        this.loadCountryContent();
    } else {
        this.loadOfficeContent();
    }
}
RightsManager.prototype.departmentChangedHandle = function(event) {
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
RightsManager.prototype.subdepartmentChangedHandle = function(event) {
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

RightsManager.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getLayoutHtml());
    this.makeElementsDroppable();
    this.updateView();
    this.setHandlers();
}
RightsManager.prototype.makeElementsDroppable = function() {
    var form = this;
    $( '#' + this.htmlId + '_nonUser').droppable({
            drop: function( event, ui ) {
                    form.employeeDropHandle.call(form, event, ui, "NON_USER");
            },
            activeClass: "ui-state-hover",
            accept: 'div[id^="' + this.htmlId + '_employee_USER_"], div[id^="' + this.htmlId + '_employee_SUPER_USER_"], div[id^="' + this.htmlId + '_employee_COUNTRY_ADMINISTRATOR_"]'
    });
    $( '#' + this.htmlId + '_user').droppable({
            drop: function( event, ui ) {
                    form.employeeDropHandle.call(form, event, ui, "USER");
            },
            activeClass: "ui-state-hover",
            accept: 'div[id^="' + this.htmlId + '_employee_NON_USER_"], div[id^="' + this.htmlId + '_employee_SUPER_USER_"], div[id^="' + this.htmlId + '_employee_COUNTRY_ADMINISTRATOR_"]'
    });
    if(currentUser.profile == "COUNTRY_ADMINISTRATOR") {
        $( '#' + this.htmlId + '_superUser').droppable({
                drop: function( event, ui ) {
                        form.employeeDropHandle.call(form, event, ui, "SUPER_USER");
                },
                activeClass: "ui-state-hover",
                accept: 'div[id^="' + this.htmlId + '_employee_NON_USER_"], div[id^="' + this.htmlId + '_employee_USER_"], div[id^="' + this.htmlId + '_employee_COUNTRY_ADMINISTRATOR_"]'
        });
    }
    if(currentUser.profile == "COUNTRY_ADMINISTRATOR" && currentUser.isAdministrator) {
        $( '#' + this.htmlId + '_countryAdministrator').droppable({
                drop: function( event, ui ) {
                        form.employeeDropHandle.call(form, event, ui, "COUNTRY_ADMINISTRATOR");
               },
                activeClass: "ui-state-hover",
                accept: 'div[id^="' + this.htmlId + '_employee_NON_USER_"], div[id^="' + this.htmlId + '_employee_USER_"], div[id^="' + this.htmlId + '_employee_SUPER_USER_"]'
        });
    }
}
RightsManager.prototype.clearEmployeeSelection = function() {
    this.selected.employeeId = null;
    this.updateView();
}
RightsManager.prototype.getLayoutHtml = function() {
    var html = '';

    html += '<fieldset>';
    html += '<legend>Employee Filter</legend>';
    html += '<table>';
    html += '<tr><td><span class="label1">Country</span></td><td><span class="label1">Office</span></td><td><span class="label1">Department</span></td><td><span class="label1">Subdepartment</span></td></tr>';
    html += '<tr>';
    html += '<td><select id="' + this.htmlId + '_country"></select></td>';
    html += '<td><select id="' + this.htmlId + '_office"></select></td>';
    html += '<td><select id="' + this.htmlId + '_department"></select></td>';
    html += '<td><select id="' + this.htmlId + '_subdepartment"></select></td>';
    html += '</tr>';
    html += '</table>';
    html += '</fieldset>';
    html += '<table>';
    html += '<tr><td><span class="label1">Non-Users</span></td><td><span class="label1">Users</span></td><td><span class="label1">Superusers</span> <span class="link" id="' + this.htmlId + '_editRights" title="Edit rights of selected superuser">Rights</span></td><td><span class="label1">Country Administrators</span></td></tr>';
    html += '<tr>';
    html += '<td style="height: 200px; width: 400px; vertical-align: top;"><div id="' + this.htmlId + '_nonUser" class="selector" style="height: 200px;"></div></td>';
    html += '<td style="height: 200px; width: 400px; vertical-align: top;"><div id="' + this.htmlId + '_user" class="selector" style="height: 200px;"></div></td>';
    html += '<td style="height: 200px; width: 400px; vertical-align: top;"><div id="' + this.htmlId + '_superUser" class="selector" style="height: 200px;"></div></td>';
    html += '<td style="height: 200px; width: 400px; vertical-align: top;"><div id="' + this.htmlId + '_countryAdministrator" class="selector" style="height: 200px;"></div></td>';
    html += '</tr></table>';
    html += '<div class="comment1">Use Drag&Drop to change Employee profile</div>';
    html += '<input type="button" value="Save" id="' + this.htmlId + '_save">';

    return html;
}
RightsManager.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_country').bind("change", function(event) {form.countryChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_office').bind("change", function(event) {form.officeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_department').bind("change", function(event) {form.departmentChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_subdepartment').bind("change", function(event) {form.subdepartmentChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_editRights').bind("click", function(event) {form.editRights.call(form, event);});
    $('#' + this.htmlId + '_save').bind("click", function(event) {form.save.call(form, event);});
}
RightsManager.prototype.updateView = function() {
    this.updateCountryView();
    this.updateOfficeView();
    this.updateDepartmentView();
    this.updateSubdepartmentView();
    this.updateEmployeeView();
    this.updateSaveView();
}
RightsManager.prototype.updateSaveView = function() {
    if(this.data.employeeProfiles.length > 0) {
        $('#' + this.htmlId + '_save').attr("disabled", false);
    } else {
        $('#' + this.htmlId + '_save').attr("disabled", true);
    }
}
RightsManager.prototype.updateCountryView = function() {
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
RightsManager.prototype.updateOfficeView = function() {
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
RightsManager.prototype.updateDepartmentView = function() {
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
RightsManager.prototype.updateSubdepartmentView = function() {
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
RightsManager.prototype.updateEmployeeView = function() {
    var htmlNonUser = '';
    var htmlUser = '';
    var htmlSuperUser = '';
    var htmlCountryAdministrator = '';
    for(var key in this.loaded.employees) {
        var employee = this.loaded.employees[key];
        var classSelected = "";
        if(employee.id == this.selected.employeeId) {
           classSelected = 'class="selected"';
        }
        var html = '<div id="' + this.htmlId + '_employee_' + employee.profile + '_' + employee.id + '" ' + classSelected + '>' + employee.userName + ' (' + employee.firstName + ' ' + employee.lastName + ')' + '</div>';
        if(employee.profile == 'NON_USER') {
            htmlNonUser += html;
        } else if(employee.profile == 'USER') {
            htmlUser += html;
        } else if(employee.profile == 'SUPER_USER') {
            htmlSuperUser += html;
        } else if(employee.profile == 'COUNTRY_ADMINISTRATOR') {
            htmlCountryAdministrator += html;
        }
    }
    $('#' + this.htmlId + '_nonUser').html(htmlNonUser);
    $('#' + this.htmlId + '_user').html(htmlUser);
    $('#' + this.htmlId + '_superUser').html(htmlSuperUser);
    $('#' + this.htmlId + '_countryAdministrator').html(htmlCountryAdministrator);
    var form = this;
    $('div[id^="' + this.htmlId + '_employee_"]').bind("click", function(event) {form.employeeClickedHandle(event);});
    $('div[id^="' + this.htmlId + '_employee_NON_USER_"]').draggable({
        helper : 'clone',
        opacity : 0.3
    });
    $('div[id^="' + this.htmlId + '_employee_USER_"]').draggable({
        helper : 'clone',
        opacity : 0.3
    });
    if(currentUser.profile == "COUNTRY_ADMINISTRATOR") {
        $('div[id^="' + this.htmlId + '_employee_SUPER_USER_"]').draggable({
            helper : 'clone',
            opacity : 0.3
        });
    }
   if(currentUser.profile == "COUNTRY_ADMINISTRATOR" && currentUser.isAdministrator) {
        $('div[id^="' + this.htmlId + '_employee_COUNTRY_ADMINISTRATOR_"]').draggable({
            helper : 'clone',
            opacity : 0.3
        });
    }
}
RightsManager.prototype.employeeDropHandle = function(event, ui, target) {
    var targetProfile = target;
    var htmlId = ui.draggable[0].id;
    var tmp  = htmlId.split("_");
    var id = tmp[tmp.length - 1];
    var employee;
    for(var key in this.loaded.employees) {
        if(this.loaded.employees[key].id == id) {
            employee = this.loaded.employees[key];
            break;
        }
    }
    if(employee.profile != targetProfile) {
        employee.profile = targetProfile;
        var employeeTmp;
        var alreadyAdded = false;
        for(var key in this.data.employeeProfiles) {
            if(this.data.employeeProfiles[key].id == employee.id) {
                alreadyAdded = true;
                this.data.employeeProfiles[key].profile == employee.profile;
            }
        }
        if(! alreadyAdded) {
            this.data.employeeProfiles.push({
                "id": employee.id,
                "profile": employee.profile
            });
        }
        this.updateView();
        this.dataChanged(true);
    }
}
RightsManager.prototype.employeeClickedHandle = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    this.selected.employeeId = parseInt(tmp[tmp.length - 1]);
    this.updateEmployeeView();
}
RightsManager.prototype.editRights = function(event) {
    if(currentUser.profile == "COUNTRY_ADMINISTRATOR") {
        var employee = null;
        for(var key in this.loaded.employees) {
            if(this.loaded.employees[key].id == this.selected.employeeId) {
                employee = this.loaded.employees[key];
                break;
            }
        }
        if(employee != null && employee.profile == 'SUPER_USER') {
            this.employeeRightsForm = new EmployeeRightsForm(employee, 'employeeRightsForm', null, null);
            this.employeeRightsForm.init();
        } else {
            doAlert("Info", "Select Employee of SUPER_USER type to assign rights");
        }
    } else {
        doAlert("Info", "Only COUNTRY_ADMINISTRATOR can do that")
    }
}

RightsManager.prototype.validate = function() {
    var errors = [];
    if(this.data.employeeProfiles.length == 0) {
        errors.push("No employee has been updated");
    }
    return errors;
}
RightsManager.prototype.save = function() {
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
    data.command = "saveChangedProfiles";
    data.profilesManagementForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "The info about changed profiles has been successfully saved.", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
RightsManager.prototype.afterSave = function() {
    this.data.employeeProfiles = [];
    this.clearEmployeeSelection();
    this.updateSaveView();
}
RightsManager.prototype.dataChanged = function(value) {
    dataChanged = value;
}





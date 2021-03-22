/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function EmployeeToProjectAssignmentManager(projectCodeFilter, htmlId, containerHtmlId) {
   this.config = {
        endpointUrl: endpointsFolder + "EmployeeToProjectAssignmentManager.jsp"
   };
   this.htmlId = htmlId;
   this.containerHtmlId = containerHtmlId;
   this.loaded = {
       "employeeOffices": [],
       "employeeDepartments": [],
       "employeeSubdepartments": [],
       "employees": [],
       "employeeProjectCodeAccessItems": []
   }
   this.selected = {
       employeeOfficeId: null,
       employeeDepartmentId: null,
       employeeSubdepartmentId: null,
       employeeId: null,
       employeeProjectCodeAccessItemId: null
   }
    this.projectCodeFilterForm = null;
    this.projectCodeFilter = ProjectCodesListFilter.prototype.getDefaultFilter();    
    var projectCodeFilterIsUsed = false;
    if(projectCodeFilter != null) {
        if(projectCodeFilter.code != null && projectCodeFilter.code != '') {
            this.projectCodeFilter.code = projectCodeFilter.code;
            projectCodeFilterIsUsed = true;
        }
    }
    if(! projectCodeFilterIsUsed) {
        var filterStr = getCookie("projectCodesListFilter");
        if(filterStr != null) {
            try{
                this.projectCodeFilter = ProjectCodesListFilter.prototype.normalizeFilter(jQuery.parseJSON(filterStr));
            } catch (e) {
                deleteCookie("projectCodesListFilter");
            }
        }
    }
    
    this.sorter = {
        "field": 'CODE',
        "order": 'ASC'
    };
    this.limiter = {
        "page": 0,
        "itemsPerPage": 100
    };
    
}
EmployeeToProjectAssignmentManager.prototype.init = function() {
    this.loadInitialContent();
}
EmployeeToProjectAssignmentManager.prototype.loadInitialContent = function() {
    var employeeFilter = {
        "officeId" : this.selected.employeeOfficeId,
        "departmentId" : this.selected.employeeDepartmentId,
        "subdepartmentId" : this.selected.employeeSubdepartmentId,
        "employeeId" : this.selected.employeeId
    };
    var form = this; 
    var data = {};
    data.command = "getInitialContent";
    data.projectCodeFilter = getJSON(this.projectCodeFilter);
    data.employeeFilter = getJSON(employeeFilter);
    data.sorter = getJSON(this.sorter);
    data.limiter = getJSON(this.limiter);

    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.employeeOffices = result.employeeOffices;
            form.loaded.employeeProjectCodeAccessItems = result.employeeProjectCodeAccessItems;
            form.loaded.count = result.count;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeToProjectAssignmentManager.prototype.loadEmployeeOfficeContent = function() {
    var employeeFilter = {
        "officeId" : this.selected.employeeOfficeId,
        "departmentId" : this.selected.employeeDepartmentId,
        "subdepartmentId" : this.selected.employeeSubdepartmentId,
        "employeeId" : this.selected.employeeId
    };
    var form = this;
    var data = {};
    data.command = "getEmployeeOfficeContent";
    data.employeeOfficeId = this.selected.employeeOfficeId;
    data.projectCodeFilter = getJSON(this.projectCodeFilter);
    data.employeeFilter = getJSON(employeeFilter);
    data.sorter = getJSON(this.sorter);
    data.limiter = getJSON(this.limiter);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.employeeDepartments = result.employeeDepartments;
            form.loaded.employeeSubdepartments = [];
            form.loaded.employees = [];
            form.selected.employeeDepartmentId = null;
            form.selected.employeeSubdepartmentId = null;
            form.selected.employeeId = null;
            form.loaded.employeeProjectCodeAccessItems = result.employeeProjectCodeAccessItems;
            form.loaded.count = result.count;
            form.updateEmployeeDepartmentView();
            form.updateEmployeeSubdepartmentView();
            form.updateEmployeeView();
            form.updateEmployeeProjectCodeAccessItemsView();
            form.updateLimiterView();
            form.updateLimiterSizeView();
            
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });  
}
EmployeeToProjectAssignmentManager.prototype.loadEmployeeDepartmentContent = function() {
    var employeeFilter = {
        "officeId" : this.selected.employeeOfficeId,
        "departmentId" : this.selected.employeeDepartmentId,
        "subdepartmentId" : this.selected.employeeSubdepartmentId,
        "employeeId" : this.selected.employeeId
    };
    var form = this;
    var data = {};
    data.command = "getEmployeeDepartmentContent";
    data.employeeDepartmentId = this.selected.employeeDepartmentId;
    data.projectCodeFilter = getJSON(this.projectCodeFilter);
    data.employeeFilter = getJSON(employeeFilter);
    data.sorter = getJSON(this.sorter);
    data.limiter = getJSON(this.limiter);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.employeeSubdepartments = result.employeeSubdepartments;
            form.loaded.employees = [];
            form.selected.employeeSubdepartmentId = null;
            form.selected.employeeId = null;
            form.loaded.employeeProjectCodeAccessItems = result.employeeProjectCodeAccessItems;
            form.loaded.count = result.count;
            form.updateEmployeeSubdepartmentView();
            form.updateEmployeeView();
            form.updateEmployeeProjectCodeAccessItemsView();
            form.updateLimiterView();
            form.updateLimiterSizeView();            
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });    
}
EmployeeToProjectAssignmentManager.prototype.loadEmployeeSubdepartmentContent = function() {
    var employeeFilter = {
        "officeId" : this.selected.employeeOfficeId,
        "departmentId" : this.selected.employeeDepartmentId,
        "subdepartmentId" : this.selected.employeeSubdepartmentId,
        "employeeId" : this.selected.employeeId
    };
    var form = this;
    var data = {};
    data.command = "getEmployeeSubdepartmentContent";
    data.employeeSubdepartmentId = this.selected.employeeSubdepartmentId;
    data.projectCodeFilter = getJSON(this.projectCodeFilter);
    data.employeeFilter = getJSON(employeeFilter);
    data.sorter = getJSON(this.sorter);
    data.limiter = getJSON(this.limiter);
     $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.employees = result.employees;
            form.selected.employeeId = null;
            form.loaded.employeeProjectCodeAccessItems = result.employeeProjectCodeAccessItems;
            form.loaded.count = result.count;
            form.updateEmployeeView();
            form.updateEmployeeProjectCodeAccessItemsView();
            form.updateLimiterView();
            form.updateLimiterSizeView();            
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });      
}
EmployeeToProjectAssignmentManager.prototype.loadEmployeeProjectCodeAccessItems = function() {
    var employeeFilter = {
        "officeId" : this.selected.employeeOfficeId,
        "departmentId" : this.selected.employeeDepartmentId,
        "subdepartmentId" : this.selected.employeeSubdepartmentId,
        "employeeId" : this.selected.employeeId
    };
    var form = this;
    var data = {};
    data.command = "getEmployeeProjectCodeAccessItems";
    data.projectCodeFilter = getJSON(this.projectCodeFilter);
    data.employeeFilter = getJSON(employeeFilter);
    data.sorter = getJSON(this.sorter);
    data.limiter = getJSON(this.limiter);
    
    $.ajax({
        url: this.config.endpointUrl,
        data: data,
        cache: false,
        type: "POST",
        success: function(data){
            ajaxResultHandle(data, form, function(result) {
                form.loaded.employeeProjectCodeAccessItems = result.employeeProjectCodeAccessItems;
                form.loaded.count = result.count;
                form.updateEmployeeProjectCodeAccessItemsView();
                form.updateLimiterView();
                form.updateLimiterSizeView();
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
        }
    });
}
EmployeeToProjectAssignmentManager.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeButtons();
    this.updateView();
    this.setHandlers();
}
EmployeeToProjectAssignmentManager.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Project code</span></td>';
    html += '<td><span class="label1">Office</span></td>';
    html += '<td><span class="label1">Department</span></td>';
    html += '<td><span class="label1">Subdepartment</span></td>';
    html += '<td><span class="label1">Employee</span></td>';
    html += '<td><span class="label1">Assign</span></td>';
    html += '</tr>';    
    html += '<tr>';
    html += '<td id="' + this.htmlId + '_projectCodeFilterCell"><span id="' + this.htmlId + '_projectCodeFilterBtn" title="Project code filter">Project code filter</span></td>';
    html += '<td><select id="' + this.htmlId + '_employeeOffice' + '"></select></td>';
    html += '<td><select id="' + this.htmlId + '_employeeDepartment' + '"></select></td>';
    html += '<td><select id="' + this.htmlId + '_employeeSubdepartment' + '"></select></td>';
    html += '<td><select id="' + this.htmlId + '_employee' + '"></select></td>';
    html += '<td><button id="' + this.htmlId + '_addBtn">Add</button></td>';
    html += '</tr>';
    html += '</table>';

    html += '<div id="' + this.htmlId + '_employeeProjectCodeAccessItems"></div>';
    html += '<div><select id="' + this.htmlId + '_limiter_size"></select> <span id="' + this.htmlId + '_limiter"></span></div>';
    return html;
}
EmployeeToProjectAssignmentManager.prototype.makeButtons = function() {
    var form = this;
    
    $('#' + this.htmlId + '_projectCodeFilterBtn').button({
        icons: {
            primary: "ui-icon-search"
        }
    }).click(function(event) {
        form.showFilter.call(form);
    });
    $('#' + this.htmlId + '_addBtn')
      .button({

      })
      .click(function(event) {
          form.startAddingEmployeeProjectCodeAccessItem.call(form);
      });
}
EmployeeToProjectAssignmentManager.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_employeeOffice').bind("change", function(event) {form.employeeOfficeChangedHandle.call(form)});
    $('#' + this.htmlId + '_employeeDepartment').bind("change", function(event) {form.employeeDepartmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_employeeSubdepartment').bind("change", function(event) {form.employeeSubdepartmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_employee').bind("change", function(event) {form.employeeChangedHandle.call(form)});
    $('#' + this.htmlId + '_limiter_size').bind("change", function(event) {form.limiterSizeChangedHandle.call(form, event)});
}
EmployeeToProjectAssignmentManager.prototype.updateView = function() {
    this.updateProjectCodeFilterSelectionView();
    this.updateEmployeeOfficeView();
    this.updateEmployeeDepartmentView();
    this.updateEmployeeSubdepartmentView();    
    this.updateEmployeeView();    
    this.updateEmployeeProjectCodeAccessItemsView();
    this.updateLimiterView();
    this.updateLimiterSizeView();
}
EmployeeToProjectAssignmentManager.prototype.updateProjectCodeFilterSelectionView = function() {
    if(ProjectCodesListFilter.prototype.isFilterUsed(this.projectCodeFilter)) {
        $('#' + this.htmlId + '_projectCodeFilterCell').css('border-left', '3px solid #009900');
    } else {
        $('#' + this.htmlId + '_projectCodeFilterCell').css('border-left', '0px');
    }
}

EmployeeToProjectAssignmentManager.prototype.updateEmployeeOfficeView = function() {
   var html = "";
   html += '<option value="">ALL</option>';
    for(var key in this.loaded.employeeOffices) {
        var office = this.loaded.employeeOffices[key];
        var isSelected = "";
        if(office.id == this.selected.employeeOfficeId) {
           isSelected = "selected";
        }
        html += '<option value="'+ office.id +'" ' + isSelected + '>' + office.name + '</option>';
    }
    $('#' + this.htmlId + '_employeeOffice').html(html);
}
EmployeeToProjectAssignmentManager.prototype.updateEmployeeDepartmentView = function() {
   var html = "";
   html += '<option value="">ALL</option>';
    for(var key in this.loaded.employeeDepartments) {
        var department = this.loaded.employeeDepartments[key];
        var isSelected = "";
        if(department.id == this.selected.employeeDepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="'+ department.id +'" ' + isSelected + '>' + department.name + '</option>';
    }
    $('#' + this.htmlId + '_employeeDepartment').html(html);
}
EmployeeToProjectAssignmentManager.prototype.updateEmployeeSubdepartmentView = function() {
    var html = "";
    html += '<option value="">ALL</option>';
    for(var key in this.loaded.employeeSubdepartments) {
        var subdepartment = this.loaded.employeeSubdepartments[key];
        var isSelected = "";
        if(subdepartment.id == this.selected.employeeSubdepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="'+ subdepartment.id +'" ' + isSelected + '>' + subdepartment.name + '</option>';
    }
    $('#' + this.htmlId + '_employeeSubdepartment').html(html);
}
EmployeeToProjectAssignmentManager.prototype.updateEmployeeView = function() {
    var html = "";
    html += '<option value="">ALL</option>';
    for(var key in this.loaded.employees) {
        var employee = this.loaded.employees[key];
        var isSelected = "";
        if(employee.id == this.selected.employeeId) {
           isSelected = "selected";
        }
        html += '<option value="'+ employee.id +'" ' + isSelected + '>' + employee.lastName + ' ' + employee.firstName + ' (' + employee.userName + ')' + '</option>';
    }
    $('#' + this.htmlId + '_employee').html(html);
}
EmployeeToProjectAssignmentManager.prototype.updateEmployeeProjectCodeAccessItemsView = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td colspan="4">Employee</td><td colspan="5">Project Code</td><td colspan="2"></td></tr>';
    html += '<tr class="dgHeader"><td>Office</td><td>Department</td><td>Subdepartment</td><td>Employee</td><td>Office</td><td>Department</td><td>Subdepartment</td><td>Project Code</td><td>Hidden</td><td>Update</td><td>Delete</td></tr>';
    if(this.loaded.employeeProjectCodeAccessItems == null || this.loaded.employeeProjectCodeAccessItems.length == 0) {
        html += '<tr><td colspan="11">No data for these filter settings</td></tr>';
    } else {
        for(var key in this.loaded.employeeProjectCodeAccessItems) {
            var item = this.loaded.employeeProjectCodeAccessItems[key];
            html += '<tr>';
            html += '<td>' + item.employeeOfficeName + '</td>';
            html += '<td>' + item.employeeDepartmentName + '</td>';
            html += '<td>' + item.employeeSubdepartmentName + '</td>';
            html += '<td>' + (item.employeeFirstName + ' ' + item.employeeLastName) + '</td>';
            html += '<td>' + item.projectCodeOfficeName + '</td>';
            html += '<td>' + item.projectCodeDepartmentName + '</td>';
            html += '<td>' + item.projectCodeSubdepartmentName + '</td>';
            html += '<td>' + item.projectCodeCode + '</td>';
            html += '<td>' + booleanVisualizer.getHtml(item.projectCodeIsHidden) + '</td>';
            html += '<td><span class="link" id="' + this.htmlId + '_employeeProjectCodeAccessItem_update_' + item.id + '">Update</span></td>';
            html += '<td><span class="link" id="' + this.htmlId + '_employeeProjectCodeAccessItem_delete_' + item.id + '">Delete</span></td>';
            html += '</tr>';
        }
    }
    html += '</table>';
    $('#' + this.htmlId + '_employeeProjectCodeAccessItems').html(html);
    var form = this;
    $('span[id^="' + this.htmlId + '_employeeProjectCodeAccessItem_update_"]').bind('click', function(event) {form.startUpdatingEmployeeProjectCodeAccessItem.call(form, event)});
    $('span[id^="' + this.htmlId + '_employeeProjectCodeAccessItem_delete_"]').bind('click', function(event) {form.startDeletingEmployeeProjectCodeAccessItem.call(form, event)});
}
EmployeeToProjectAssignmentManager.prototype.updateLimiterView = function() {
    var pagesCount = parseInt(this.loaded.count / this.limiter.itemsPerPage) + 1;
    var html = 'Found: ' + this.loaded.count + '. ';
    if(pagesCount > 1) {
        for(var i = 0; i < pagesCount; i++) {
            if(this.limiter.page - i > 5) {
                continue;
            }
            if(i - this.limiter.page > 5) {
                break;
            }
            if(i == this.limiter.page) {
                html += '<span>' + (i + 1) + '</span>';
            } else {
                html += '<span class="link" id="' + this.htmlId + '_limiter_page_' + i + '">' + (i + 1) + '</span>';
            }
        }
    }
    $('#' + this.htmlId + '_limiter').html(html);
    var form = this;
    $('span[id^="' + this.htmlId + '_limiter_page_"]').bind("click", function(event) {form.pageClickHandle.call(form, event)});
}
EmployeeToProjectAssignmentManager.prototype.updateLimiterSizeView = function() {
    var options = {"100": "100", "500": "500", "3000": "3000"}
    var html = '';
    for(var key in options) {
        var isSelected = '';
        if(key == this.limiter.itemsPerPage) {
            isSelected = 'selected';
        }
        html += '<option ' + isSelected + ' value="' + key + '">' + options[key] + '</option>';
    }
    $("#" + this.htmlId + '_limiter_size').html(html);
    
}

EmployeeToProjectAssignmentManager.prototype.employeeOfficeChangedHandle = function() {
    this.limiter.page = 0;
    var idTxt = $('#' + this.htmlId + '_employeeOffice').val();
    if(idTxt == '') {
        this.selected.employeeOfficeId = null;
    } else {
        this.selected.employeeOfficeId = parseInt(idTxt);
    }
    if(this.selected.employeeOfficeId == null) {
        this.selected.employeeDepartmentId = null;
        this.selected.employeeSubdepartmentId = null;
        this.selected.employeeId = null;
        this.loaded.employeeDepartments = [];
        this.loaded.employeeSubdepartments = [];
        this.loaded.employees = [];
        this.updateEmployeeDepartmentView();
        this.updateEmployeeSubdepartmentView();
        this.updateEmployeeView();
        this.loadEmployeeProjectCodeAccessItems();
    } else {
        this.loadEmployeeOfficeContent();
    }
}
EmployeeToProjectAssignmentManager.prototype.employeeDepartmentChangedHandle = function() {
    this.limiter.page = 0;
    var idTxt = $('#' + this.htmlId + '_employeeDepartment').val();
    if(idTxt == '') {
        this.selected.employeeDepartmentId = null;
    } else {
        this.selected.employeeDepartmentId = parseInt(idTxt);
    }
    if(this.selected.employeeDepartmentId == null) {
        this.selected.employeeSubdepartmentId = null;
        this.selected.employeeId = null;
        this.loaded.employeeSubdepartments = [];
        this.loaded.employees = [];
        this.updateEmployeeSubdepartmentView();
        this.updateEmployeeView();
        this.loadEmployeeProjectCodeAccessItems();
    } else {
        this.loadEmployeeDepartmentContent();
    }
}
EmployeeToProjectAssignmentManager.prototype.employeeSubdepartmentChangedHandle = function() {
    this.limiter.page = 0;
    var idTxt = $('#' + this.htmlId + '_employeeSubdepartment').val();
    if(idTxt == '') {
        this.selected.employeeSubdepartmentId = null;
    } else {
        this.selected.employeeSubdepartmentId = parseInt(idTxt);
    }
    if(this.selected.employeeSubdepartmentId == null) {
        this.selected.employeeId = null;
        this.loaded.employees = [];
        this.updateEmployeeView();
        this.loadEmployeeProjectCodeAccessItems();
    } else {
        this.loadEmployeeSubdepartmentContent();
    }
}
EmployeeToProjectAssignmentManager.prototype.employeeChangedHandle = function() {
    this.limiter.page = 0;
    var idTxt = $('#' + this.htmlId + '_employee').val();
    if(idTxt == '') {
        this.selected.employeeId = null;
    } else {
        this.selected.employeeId = parseInt(idTxt);
    }
    this.loadEmployeeProjectCodeAccessItems();    
}
EmployeeToProjectAssignmentManager.prototype.validate = function() {
    var errors = [];
    var warnings = [];
    var startDate = null;
    var endDate = null;
    if(this.data.startDate == null || this.data.startDate == "") {
        //errors.push("Start date is not set");
    } else if(! isDateValid(this.data.startDate)) {
        errors.push("Start date has incorrect format");
    } else {
        startDate = parseDateString(this.data.startDate);
    }
    if(this.data.endDate == null || this.data.endDate == "") {
        //errors.push("End date is not set");
    } else if(! isDateValid(this.data.endDate)) {
        errors.push("End date has incorrect format");
    } else {
        endDate = parseDateString(this.data.endDate);
    }
    if(startDate != null && endDate != null && startDate > endDate) {
        errors.push("End date is less than Start date");
    }
    return {
     "errors": errors,
     "warnings": warnings
    };
}
EmployeeToProjectAssignmentManager.prototype.showFilter = function(event) {
    this.projectCodeFilterForm = new ProjectCodesListFilter("projectCodesListFilter", this.moduleName, this.projectCodeFilter, this.acceptProjectCodeFilterData, this);
    this.projectCodeFilterForm.init();
}
EmployeeToProjectAssignmentManager.prototype.acceptProjectCodeFilterData = function(filter) {
    this.limiter.page = 0;
    this.projectCodeFilter = filter;
    this.selected.employeeProjectCodeAccessItemId = null;
    this.updateProjectCodeFilterSelectionView();
    var filterStr = getJSON(this.projectCodeFilter);
    var expire = new Date();
    expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 100);
    setCookie("projectCodesListFilter", filterStr, expire.toGMTString(), null);    
    
    this.loadEmployeeProjectCodeAccessItems();
}
EmployeeToProjectAssignmentManager.prototype.limiterSizeChangedHandle = function(event) {
    this.limiter.itemsPerPage = $(event.currentTarget).val();
    this.limiter.page = 0;
    this.loadEmployeeProjectCodeAccessItems();
}
EmployeeToProjectAssignmentManager.prototype.pageClickHandle = function(event) {
    var htmlId = $(event.currentTarget).attr("id");
    var tmp = htmlId.split("_");
    var page = parseInt(tmp[tmp.length - 1]);
    this.limiter.page = page;
    this.loadEmployeeProjectCodeAccessItems();
}
EmployeeToProjectAssignmentManager.prototype.startAddingEmployeeProjectCodeAccessItem = function() {
    var employeeProjectCodeAccessItemEditForm = new EmployeeProjectCodeAccessItemEditForm(
    {
        "mode": 'CREATE',
        "id": null,
        "employeeId": null,
        "projectCodeId": null
    },
    "employeeProjectCodeAccessItemEditForm",
    this.startLoadingEmployeeProjectCodeAccessItems,
    this
    );
    employeeProjectCodeAccessItemEditForm.init();
}
EmployeeToProjectAssignmentManager.prototype.startUpdatingEmployeeProjectCodeAccessItem = function(event) {
    var idTxt = event.currentTarget.id;
    var tmp = idTxt.split('_');
    var employeeProjectCodeAccessItemId = parseInt(tmp[tmp.length - 1]);
    
    var employeeProjectCodeAccessItem = null;
    for(var key in this.loaded.employeeProjectCodeAccessItems) {
        var itemTmp = this.loaded.employeeProjectCodeAccessItems[key];
        if(itemTmp.id == employeeProjectCodeAccessItemId) {
            employeeProjectCodeAccessItem = itemTmp;
            break;
        }
    }
    var employeeProjectCodeAccessItemEditForm = new EmployeeProjectCodeAccessItemEditForm({
        "mode": 'UPDATE',
        "id": employeeProjectCodeAccessItem.id,
        "projectCodeId": employeeProjectCodeAccessItem.projectCodeId,
        "employeeId": employeeProjectCodeAccessItem.employeeId
    }, "employeeProjectCodeAccessItemEditForm", this.startLoadingEmployeeProjectCodeAccessItems, this);
    employeeProjectCodeAccessItemEditForm.init();
}
EmployeeToProjectAssignmentManager.prototype.startDeletingEmployeeProjectCodeAccessItem = function(event) {
    var idTxt = event.currentTarget.id;
    var tmp = idTxt.split('_');
    var employeeProjectCodeAccessItemId = parseInt(tmp[tmp.length - 1]);
    var employeeProjectCodeAccessItemDeleteForm = new EmployeeProjectCodeAccessItemDeleteForm(employeeProjectCodeAccessItemId, this.startLoadingEmployeeProjectCodeAccessItems, this);
    employeeProjectCodeAccessItemDeleteForm.init();    
}
EmployeeToProjectAssignmentManager.prototype.startLoadingEmployeeProjectCodeAccessItems = function(event) {
    this.limiter.page = 0;
    this.loadEmployeeProjectCodeAccessItems();
}
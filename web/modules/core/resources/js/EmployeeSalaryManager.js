/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function EmployeeSalaryManager(htmlId, containerHtmlId) {
   this.config = {
        endpointUrl: endpointsFolder + "EmployeeSalaryManager.jsp"
   };
   this.htmlId = htmlId;
   this.containerHtmlId = containerHtmlId;
   this.popupContainerId = this.htmlId + "_popup";
   this.moduleName = "Salary";
   this.loaded = {
       "offices": [],
       "departments": [],
       "subdepartments": [],
       "positions": [],
       "employees": [],
       "employee": null,
       "employeePositionHistoryItems": [],
       "leavesItems": [],
       "salaries": [],
       "holidays": []
   }
   this.selected = {
       "officeId": null,
       "departmentId": null,
       "subdepartmentId": null,
       "positionId": null,
       "employeeId": null,
       "isActive" : true,
       "salaryVisibility" : true
   }
   this.isActiveOptions = {
       true: 'Yes',
       false: 'No'
   }   
}
EmployeeSalaryManager.prototype.init = function() {
    contentSizeChangedEventSubscribers.push({"context": this, "function": this.normalizeContentSize});
    this.loadInitialContent();
}
EmployeeSalaryManager.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.isActive = this.selected.isActive;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.offices = result.offices;
            form.loaded.departments = [];
            form.loaded.subdepartments = [];
            form.loaded.positions = [];
            form.loaded.employees = result.employees;
            form.loaded.employee = null;
            form.loaded.employeePositionHistoryItems = [];
            form.loaded.leavesItems = [];
            form.loaded.salaries = [];
            form.loaded.currencies = result.currencies;
            form.loaded.holidays = result.holidays;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeSalaryManager.prototype.loadOfficeContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getOfficeContent";
    data.officeId = this.selected.officeId;
    data.isActive = this.selected.isActive;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.departments = result.departments;
            form.loaded.subdepartments = [];
            form.loaded.positions = [];
            form.loaded.employees = result.employees;
            form.loaded.employee = null;
            form.loaded.employeePositionHistoryItems = [];
            form.loaded.leavesItems = [];
            form.loaded.salaries = [];
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeSalaryManager.prototype.loadDepartmentContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getDepartmentContent";
    data.departmentId = this.selected.departmentId;
    data.isActive = this.selected.isActive;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.subdepartments = result.subdepartments;
            form.loaded.positions = [];
            form.loaded.employees = result.employees;
            form.loaded.employee = null;
            form.loaded.employeePositionHistoryItems = [];
            form.loaded.leavesItems = [];
            form.loaded.salaries = [];
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeSalaryManager.prototype.loadSubdepartmentContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getSubdepartmentContent";
    data.subdepartmentId = this.selected.subdepartmentId;
    data.isActive = this.selected.isActive;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.positions = result.positions;
            form.loaded.employees = result.employees;
            form.loaded.employee = null;
            form.loaded.employeePositionHistoryItems = [];
            form.loaded.leavesItems = [];
            form.loaded.salaries = [];
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeSalaryManager.prototype.loadPositionContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getPositionContent";
    data.positionId = this.selected.positionId;
    data.isActive = this.selected.isActive;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.employees = result.employees;
            form.loaded.employee = null;
            form.loaded.employeePositionHistoryItems = [];
            form.loaded.leavesItems = [];
            form.loaded.salaries = [];
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeSalaryManager.prototype.loadEmployeeContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getEmployeeContent";
    data.employeeId = this.selected.employeeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.employee = result.employee;
            form.loaded.employeePositionHistoryItems = result.employeePositionHistoryItems;
            form.loaded.leavesItems = result.leavesItems;
            form.loaded.salaries = result.salaries;
            form.loaded.linkedEmployees = result.linkedEmployees;
            form.updateEmployeeFullView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeSalaryManager.prototype.refreshInfo = function() {
    if(this.selected.employeeId != null) {
        this.loadEmployeeContent();
    } else if(this.selected.positionId != null) {
        this.loadPositionContent();
    } else if(this.selected.subdepartmentId != null) {
        this.loadSubdepartmentContent();
    } else if(this.selected.departmentId != null) {
        this.loadDepartmentContent();
    } else if(this.selected.OfficeId != null) {
        this.loadOfficeContent();
    } else  {
        this.loadInitialContent();
    }
}
EmployeeSalaryManager.prototype.show = function() {
  this.makeLayout();
  this.normalizeContentSize();
  this.setHandlers();
  this.makeButtons();
  this.updateView();
}
EmployeeSalaryManager.prototype.normalizeContentSize = function() {
    var layoutWidth = contentWidth - 40;
    var layoutHeight = contentHeight - 100;
    $('#' + this.htmlId + '_layout').width(layoutWidth);
    $('#' + this.htmlId + '_layout').height(layoutHeight);
    $('#' + this.htmlId + '_layout_left').width(layoutWidth * 0.5);
    $('#' + this.htmlId + '_layout_left').height(layoutHeight);
    $('#' + this.htmlId + '_layout_right').width(layoutWidth * 0.5);
    $('#' + this.htmlId + '_layout_right').height(layoutHeight);
    
    jQuery('#' + this.htmlId + '_layout_employees_main').jqGrid('setGridWidth', layoutWidth * 0.5);
    jQuery('#' + this.htmlId + '_layout_employees_main').jqGrid('setGridHeight', layoutHeight - 70);
}
EmployeeSalaryManager.prototype.makeLayout = function() {
    var html = '';
    html += '<table>'
    html += '<tr><td><span class="label1">Office</span></td><td><span class="label1">Department</span></td><td><span class="label1">Subdepartment</span></td><td><span class="label1">Position</span></td><td><span class="label1">Active</span></td><td><span class="label1">Filter</span></td><td></td></tr>';
    html += '<tr><td><select id="' + this.htmlId + '_office"></select></td><td><select id="' + this.htmlId + '_department"></select></td><td><select id="' + this.htmlId + '_subdepartment"></select></td><td><select id="' + this.htmlId + '_position"></select></td><td><select id="' + this.htmlId + '_isActive"></select></td><td><input type="text" id="' + this.htmlId + '_filter"></td><td><button id="' + this.htmlId + '_salaryVisibility">Toggle salary</button></td></tr>';
    html += '</table>';
    html += '<table id="' + this.htmlId + '_layout">'
    html += '<tr>';
    html += '<td><div id="' + this.htmlId + '_layout_left">';
    html += '<div id="' + this.htmlId + '_layout_employees"></div>';
    html += '</div></td>';
    html += '<td><div style="overflow: auto;" id="' + this.htmlId + '_layout_right">';
        html += '<table>'
        html += '<tr><td id="' + this.htmlId + '_layout_employee" colspan="2"></td></tr>';
        html += '<tr><td id="' + this.htmlId + '_layout_employeePositionHistoryItems" colspan="2"></td></tr>';
        html += '<tr><td id="' + this.htmlId + '_layout_leavesItems"></td><td id="' + this.htmlId + '_layout_leavesBalanceCalculator"></td></tr>';
        html += '<tr><td id="' + this.htmlId + '_layout_salaries" colspan="2"></td></tr>';
        html += '</table>';
    html += '</div></td>';
    html += '</tr>';
    html += '</table>'
    $('#' + this.containerHtmlId).html(html);
}
EmployeeSalaryManager.prototype.updateView = function() {
    this.updateOfficeView();
    this.updateDepartmentView();
    this.updateSubdepartmentView();
    this.updatePositionView();
    this.updateIsActiveView();
    this.updateFilterView();
    this.updateSalaryVisibilityView();
    this.updateEmployeesView();
    this.updateEmployeeFullView();
}
EmployeeSalaryManager.prototype.updateEmployeeFullView = function() {
    this.updateEmployeeView();
    this.updateEmployeePositionHistoryItemsView();
    this.updateLeavesItemsView();
    this.updateLeavesBalanceView();    
    this.updateSalariesView();
}
EmployeeSalaryManager.prototype.updateOfficeView = function() {
   var html = "";
   html += '<option value="">...</option>';
    for(var key in this.loaded.offices) {
        var office = this.loaded.offices[key];
        var isSelected = "";
        if(office.id == this.selected.officeId) {
           isSelected = "selected";
        }
        html += '<option value="'+ office.id +'" ' + isSelected + '>' + office.name + '</option>';
    }
    $('#' + this.htmlId + '_office').html(html);
}
EmployeeSalaryManager.prototype.updateDepartmentView = function() {
   var html = "";
   html += '<option value="">...</option>';
    for(var key in this.loaded.departments) {
        var department = this.loaded.departments[key];
        var isSelected = "";
        if(department.id == this.selected.departmentId) {
           isSelected = "selected";
        }
        html += '<option value="'+ department.id +'" ' + isSelected + '>' + department.name + '</option>';
    }
    $('#' + this.htmlId + '_department').html(html);   
}
EmployeeSalaryManager.prototype.updateSubdepartmentView = function() {
   var html = "";
   html += '<option value="">...</option>';
    for(var key in this.loaded.subdepartments) {
        var subdepartment = this.loaded.subdepartments[key];
        var isSelected = "";
        if(subdepartment.id == this.selected.subdepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="'+ subdepartment.id +'" ' + isSelected + '>' + subdepartment.name + '</option>';
    }
    $('#' + this.htmlId + '_subdepartment').html(html);       
}
EmployeeSalaryManager.prototype.updatePositionView = function() {
   var html = "";
   html += '<option value="">...</option>';
    for(var key in this.loaded.positions) {
        var position = this.loaded.positions[key];
        var isSelected = "";
        if(position.id == this.selected.positionId) {
           isSelected = "selected";
        }
        html += '<option value="'+ position.id +'" ' + isSelected + '>' + position.name + '</option>';
    }
    $('#' + this.htmlId + '_position').html(html);   
}
EmployeeSalaryManager.prototype.updateIsActiveView = function() {
    var html = "";
    html += '<option value="">All</option>';
    for(var key in this.isActiveOptions) {
        var isActiveOption = this.isActiveOptions[key];
        var isSelected = '';
        if(key == '' + this.selected.isActive) {
            isSelected = 'selected';
        }
        html += '<option value="' + key + '" ' + isSelected + '>' + isActiveOption + '</option>';
    }
    $('#' + this.htmlId + '_isActive').html(html);   
}
EmployeeSalaryManager.prototype.updateFilterView = function() {
    $('#' + this.htmlId + '_filter').val(this.selected.filter);
}
EmployeeSalaryManager.prototype.updateSalaryVisibilityView = function() {
    var html = "";
    if(this.selected.salaryVisibility) {
        html += 'Hide salary';
    } else {
        html += 'Show salary';
    }
    $('#' + this.htmlId + '_salaryVisibility').button( 'option', 'label', html );   
}
EmployeeSalaryManager.prototype.updateEmployeesView = function() {
    var form = this;
    var html ='';
    var filter = null;
    if(this.selected.filter != null && this.selected.filter != '') {
        filter = this.selected.filter.toLowerCase();
    }    
    html += '<table id="' + this.htmlId + '_layout_employees_main"></table>';
    $('#' + this.htmlId + '_layout_employees').html(html);
    jQuery('#' + this.htmlId + '_layout_employees_main').jqGrid('clearGridData');
    jQuery('#' + this.htmlId + '_layout_employees_main').jqGrid({
        datatype: "local",
        height: 250,
        colNames:['Office', 'Department', 'Subdepartment', 'Position', 'First Name', 'Last Name'],
        colModel:[
            {name:'officeName',index:'officeName', width:100},
            {name:'departmentName',index:'departmentName', width:100},		
            {name:'subdepartmentName',index:'subdepartmentName', width:100},
            {name:'positionName',index:'positionName', width:100},
            {name:'firstName',index:'firstName', width:100},		
            {name:'lastName',index:'lastName', width:100}		
        ],
        rowNum:1000,
        multiselect: false,
        //caption: "Employees",
        shrinkToFit: true,
        toolbar: [true,"top"],
        onSelectRow: function(ids) {
            if(ids == null) {
                doAlert('Alert', 'Nothing selected', null, null);
            } else {
                form.showEmployee(ids);		
            }
	}
    });
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
        jQuery('#' + this.htmlId + '_layout_employees_main').jqGrid('addRowData', employee.id, employee);
    }
    $('#t_' + this.htmlId + '_layout_employees_main').append('<button id="' + this.htmlId + '_layout_employees_main_add" title="Add Employee">Add Employee</button>');
    $('#' + this.htmlId + '_layout_employees_main_add').button({
            icons: {
                primary: "ui-icon-plusthick"
            }
        }).click(function(event) {
        form.createEmployee.call(form);
    });
    $('#t_' + this.htmlId + '_layout_employees_main').height(33);
    this.normalizeContentSize();
}
EmployeeSalaryManager.prototype.updateEmployeeView = function() {
    if(this.loaded.employee == null) {
        $('#' + this.htmlId + "_layout_employee").html("");
        return;
    }
    
    var txtLinkedEmployees = '';
    for(var key in this.loaded.linkedEmployees) {
        var linkedEmployee = this.loaded.linkedEmployees[key];
        txtLinkedEmployees += linkedEmployee.firstName + ' ' + linkedEmployee.lastName + '(' + linkedEmployee.userName + ')<br />';
    }
    this.loaded.employee.txtLinkedEmployees = txtLinkedEmployees;
    
    var rows = [];
    rows.push({"name": "External Id (1C)", "property": "externalId"});
    rows.push({"name": "User name", "property": "userName"});
    rows.push({"name": "First Name", "property": "firstName"});
    rows.push({"name": "Last Name", "property": "lastName"});
    rows.push({"name": "First Name (Local Language)", "property": "firstNameLocalLanguage"});
    rows.push({"name": "Last Name (Local Language)", "property": "lastNameLocalLanguage"});
    rows.push({"name": "Maiden Name", "property": "maidenName"});
    rows.push({"name": "E-mail", "property": "email"});
    rows.push({"name": "Profile", "property": "profile"});
    rows.push({"name": "Active", "property": "isActive", visualizer: booleanVisualizer});
    rows.push({"name": "Future", "property": "isFuture", visualizer: booleanVisualizer});
    rows.push({"name": "Password To Be Changed", "property": "passwordToBeChanged", visualizer: booleanVisualizer});
    rows.push({"name": "Linked employees", "property": "txtLinkedEmployees"});
    var controls = [];
    controls.push({"id": "edit", "text": "Edit", "icon": imagePath+"/icons/edit.png", "click": {"handler": this.editEmployee, "context": this}});
    controls.push({"id": "delete", "text": "Delete", "click": {"handler": this.deleteEmployee, "context": this}});
    controls.push({"id": "regeneratePassword", "text": "Regenerate Password", "click": {"handler": this.startRegeneratePassword, "context": this}});
    controls.push({"id": "editCarreer", "text": "Edit Carreer", "click": {"handler": this.editCarreer, "context": this}});
    controls.push({"id": "editExternalId", "text": "Edit External Id", "click": {"handler": this.editExternalId, "context": this}});
    var propertyGrid = new PropertyGrid("admin_employee", this.loaded.employee, rows, "Employee", controls);
    propertyGrid.show(this.htmlId + "_layout_employee");
}
EmployeeSalaryManager.prototype.updateEmployeePositionHistoryItemsView = function() {
    if(this.loaded.employee == null) {
        $('#' + this.htmlId + "_layout_employeePositionHistoryItems").html("");
        return;
    }
    for(var key in this.loaded.employeePositionHistoryItems) {
        var employeePositionHistoryItem = this.loaded.employeePositionHistoryItems[key];
        if(employeePositionHistoryItem.contractType == 'PART_TIME') {
            employeePositionHistoryItem.contractTypeModified = employeePositionHistoryItem.contractType + '/' + employeePositionHistoryItem.partTimePercentage;
        } else {
            employeePositionHistoryItem.contractTypeModified = employeePositionHistoryItem.contractType;
        }
    }
    var columns = [];
    columns.push({"name": "Office", "property": "officeName"});
    columns.push({"name": "Department", "property": "departmentName"});
    columns.push({"name": "Subdepartment", "property": "subdepartmentName"});
    columns.push({"name": "Position", "property": "positionName"});
    columns.push({"name": "Standard Position", "property": "standardPositionName"});
    columns.push({"name": "Start", "property": "start", "visualizer": calendarVisualizer});
    columns.push({"name": "End", "property": "end", "visualizer": calendarVisualizer});
    columns.push({"name": "Contract", "property": "contractTypeModified"});
    columns.push({"name": "Career Status", "property": "careerStatus"});
    columns.push({"name": "Time Status", "property": "timeStatus"});
    var extraColumns = [];
    var controls = [];
    var dataGrid = new DataGrid("employeePositionHistoryItems", this.loaded.employeePositionHistoryItems, columns, "Carreer", controls, extraColumns, "id");
    dataGrid.show(this.htmlId + "_layout_employeePositionHistoryItems");
}
EmployeeSalaryManager.prototype.updateLeavesItemsView = function() {
    if(this.loaded.employee == null) {
        $('#' + this.htmlId + "_layout_leavesItems").html("");
        return;
    }
    var leavesItems = [];
    for(var key in this.loaded.leavesItems) {
        var leavesItem = this.loaded.leavesItems[key];
        var days = getDaysInRange(leavesItem.start, leavesItem.end) + 1;
        var holidays = sliceDaysByRange(this.loaded.holidays, leavesItem.start, leavesItem.end);
        days = days - holidays.length;        
        leavesItems.push({
            id: leavesItem.id,
            type: leavesItem.type,
            start: leavesItem.start,
            end: leavesItem.end,
            days: days
        });
    }
    var columns = [];
    columns.push({"name": "Leave Type", "property": "type"});
    columns.push({"name": "Start", "property": "start", "visualizer": calendarVisualizer});
    columns.push({"name": "End", "property": "end", "visualizer": calendarVisualizer});
    columns.push({"name": "Days w/o holidays", "property": "days"});
    var extraColumns = [];
    var controls = [];
    var dataGrid = new DataGrid("leavesItems", leavesItems, columns, "Leaves", controls, extraColumns, "id");
    dataGrid.show(this.htmlId + "_layout_leavesItems");
}
EmployeeSalaryManager.prototype.updateLeavesBalanceView = function() {
    if(this.loaded.employee == null) {
        $('#' + this.htmlId + "_layout_leavesBalanceCalculator").html("");
        return;
    }
    var now = new Date();
    var date = {
        year: now.getFullYear(),
        month: now.getMonth(),
        dayOfMonth: now.getDate()
    }
    var formData = {
        "date": date,
        "employeeId": this.selected.employeeId
    }
    this.leavesBalanceCalculator = new LeavesBalanceCalculator(formData, this.htmlId + '_leavesBalanceCalculator', this.htmlId + '_layout_leavesBalanceCalculator', this.moduleName);
    this.leavesBalanceCalculator.init();
}
EmployeeSalaryManager.prototype.updateSalariesView = function() {
    if(this.loaded.employee == null || this.selected.salaryVisibility != true) {
        $('#' + this.htmlId + "_layout_salaries").html("");
        return;
    }
    var data = [];
    for(var key in this.loaded.salaries) {
        var salary = this.loaded.salaries[key];
        var currency = null;
        for(var currencyKey in this.loaded.currencies) {
            var currencyTmp = this.loaded.currencies[currencyKey];
            if(currencyTmp.id == salary.currencyId) {
                currency = currencyTmp;
                break;
            }
        }
        data.push({
            "id": salary.id,
            "salaryValue": salary.value,
            "salaryStart": salary.start,
            "salaryEnd": salary.end,
            "currencyCode": currency.code
        });
    }
    var columns = [];
    columns.push({"name": "Salary", "property": "salaryValue"});
    columns.push({"name": "Start", "property": "salaryStart", "visualizer": calendarVisualizer});
    columns.push({"name": "End", "property": "salaryEnd", "visualizer": calendarVisualizer});
    columns.push({"name": "Currency", "property": "currencyCode"});
    var extraColumns = [];
    extraColumns.push({"name": "Edit", "property": "edit", "text": "Edit",  "click": {"handler": this.editSalary, "context": this}});
    extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteSalary, "context": this}});
    var controls = [];
    controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.createSalary, "context": this}});
    var dataGrid = new DataGrid("salary", data, columns, "Salary", controls, extraColumns, "id");
    dataGrid.show(this.htmlId + "_layout_salaries");
}
EmployeeSalaryManager.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_office').bind("change", function(event) {form.officeChangedHandle.call(form)});
    $('#' + this.htmlId + '_department').bind("change", function(event) {form.departmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_subdepartment').bind("change", function(event) {form.subdepartmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_position').bind("change", function(event) {form.positionChangedHandle.call(form)});
    $('#' + this.htmlId + '_isActive').bind("change", function(event) {form.isActiveChangedHandle.call(form)});
    $('#' + this.htmlId + '_filter').bind("change", function(event) {form.filterChangedHandle.call(form)});
}
EmployeeSalaryManager.prototype.makeButtons = function() {
    var form = this;
    $('#' + this.htmlId + '_salaryVisibility')
    .button().width(100)
    .click(function( event ) {
        form.salaryVisibilityChangedHandle.call(form);
    });
}
EmployeeSalaryManager.prototype.officeChangedHandle = function() {
    this.selected.departmentId = null;
    this.selected.subdepartmentId = null;
    this.selected.positionId = null;
    var idTxt = $('#' + this.htmlId + '_office').val();
    if(idTxt == '') {
        this.selected.officeId = null;
    } else {
        this.selected.officeId = parseInt(idTxt);
    }
    if(this.selected.officeId == null) {
        this.loadInitialContent();
    } else {
        this.loadOfficeContent();
    }
}
EmployeeSalaryManager.prototype.departmentChangedHandle = function() {
    this.selected.subdepartmentId = null;
    this.selected.positionId = null;
    var idTxt = $('#' + this.htmlId + '_department').val();
    if(idTxt == '') {
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
EmployeeSalaryManager.prototype.subdepartmentChangedHandle = function() {
    this.selected.positionId = null;
    var idTxt = $('#' + this.htmlId + '_subdepartment').val();
    if(idTxt == '') {
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
EmployeeSalaryManager.prototype.positionChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_position').val();
    if(idTxt == '') {
        this.selected.positionId = null;
    } else {
        this.selected.positionId = parseInt(idTxt);
    }
    if(this.selected.positionId == null) {
        this.loadSubdepartmentContent();
    } else {
        this.loadPositionContent();
    }
}
EmployeeSalaryManager.prototype.isActiveChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_isActive').val();
    if(idTxt == '') {
        this.selected.isActive = null;
    } else if(idTxt == 'true'){
        this.selected.isActive = true;
    } else {
        this.selected.isActive = false;
    }
    this.updateIsActiveView();
    if(this.selected.positionId != null) {
        this.loadPositionContent();
    } else if(this.selected.subdepartmentId != null) {
        this.loadSubdepartmentContent();
    } else if(this.selected.departmentId != null) {
        this.loadDepartmentContent();
    } else if(this.selected.officeId != null) {
        this.loadOfficeContent();
    } else {
        this.loadInitialContent();
    }
}
EmployeeSalaryManager.prototype.filterChangedHandle = function(event) {
    var value = $('#' + this.htmlId + '_filter').val();
    value = $.trim(value);
    if(value != this.selected.filter) {
        this.selected.filter = value;
        this.selected.employeeId = null;
        this.updateEmployeesView();
    }
    this.updateFilterView();
}
EmployeeSalaryManager.prototype.salaryVisibilityChangedHandle = function() {
    if(this.selected.salaryVisibility) {
        this.selected.salaryVisibility = false;
    } else {
        this.selected.salaryVisibility = true;
    }
    this.updateSalaryVisibilityView();
    this.updateSalariesView();
}    
EmployeeSalaryManager.prototype.showEmployee = function(id) {
    this.selected.employeeId = id;
    this.loadEmployeeContent();
}
EmployeeSalaryManager.prototype.createEmployee = function(event) {
    var employeeEditForm = new EmployeeEditForm({
        "mode": 'CREATE',
        "id": null,
        "externalId": null,
        "positionId": null,
        "userName": "",
        "firstName": "",
        "lastName": "",
        "firstNameLocalLanguage": "",
        "lastNameLocalLanguage": "",
        "maidenName": "",
        "email": "",
        "profile": "USER",
        "isActive": true,
        "isFuture": false,
        "contractType": "FULL_TIME",
        "partTimePercentage": null
    }, "employeeEditForm", this.refreshInfo, this, this.moduleName);
    employeeEditForm.start();
}
EmployeeSalaryManager.prototype.editEmployee = function(event) {
    var employeeEditForm = new EmployeeEditForm({
        "mode": 'UPDATE',
        "id": this.loaded.employee.id,
        "positionId": this.loaded.employee.positionId,
        "externalId": this.loaded.employee.externalId,
        "userName": this.loaded.employee.userName,
        "password": this.loaded.employee.password,
        "firstName": this.loaded.employee.firstName,
        "lastName": this.loaded.employee.lastName,
        "firstNameLocalLanguage": this.loaded.employee.firstNameLocalLanguage,
        "lastNameLocalLanguage": this.loaded.employee.lastNameLocalLanguage,
        "maidenName": this.loaded.employee.maidenName,
        "email": this.loaded.employee.email,
        "profile": this.loaded.employee.profile,
        "isActive": this.loaded.employee.isActive,
        "isFuture": this.loaded.employee.isFuture,
        "contractType": null,
        "partTimePercentage": null
    }, "employeeEditForm", this.loadEmployeeContent, this, this.moduleName);
    employeeEditForm.start();
}
EmployeeSalaryManager.prototype.editExternalId = function(event) {
    var employeeExternalIdEditForm = new EmployeeExternalIdEditForm({
        "id": this.loaded.employee.id,
        "externalId": this.loaded.employee.externalId
    }, "employeeEditForm", this.loadEmployeeContent, this, this.moduleName);
    employeeExternalIdEditForm.init();
}
EmployeeSalaryManager.prototype.deleteEmployee = function(event) {
    var employeeDeleteForm = new EmployeeDeleteForm(this.loaded.employee.id, this.refreshInfoAfterDelete, this);
    employeeDeleteForm.start();
}
EmployeeSalaryManager.prototype.refreshInfoAfterDelete = function() {
    this.selected.employeeId = null;
    this.refreshInfo();
}

EmployeeSalaryManager.prototype.startRegeneratePassword = function(event) {
    var message = 'You are about to regenerate employee\'s password.<br />';
    message += 'Random password will be generated automatically and sent to the employee via e-mail.<br />';
    message += 'Proceed with update?';
    doConfirm("Confirm", message, this, this.regeneratePassword, null, null);
}
EmployeeSalaryManager.prototype.regeneratePassword = function(event) {
    var form = this;
    var data = {};
    data.command = "regeneratePassword";
    data.employeeId = this.loaded.employee.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Success", "Password has been successfully changed. An email has been sent to this employee", null, null);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeSalaryManager.prototype.editCarreer = function(event) {
    var carreerEditForm = new CarreerEditForm(this.loaded.employee.id, "carreerEditForm", this.refreshInfo, this, this.moduleName);
    carreerEditForm.init();
}
EmployeeSalaryManager.prototype.createSalary = function(event) {
    var salaryEditForm = new SalaryEditForm({
        "mode": 'CREATE',
        "id": null,
        "employeeId": this.loaded.employee.id,
        "value": 0,
        "start": null,
        "end": null,
        "currencyId": null
    }, "salaryEditForm", this.loadEmployeeContent, this);
    salaryEditForm.start();
}
EmployeeSalaryManager.prototype.editSalary = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    var salaryId = parseInt(tmp[tmp.length - 1]);
    var salary = null;
    for(var key in this.loaded.salaries) {
        var salaryTmp = this.loaded.salaries[key];
        if(salaryTmp.id == salaryId) {
            salary = salaryTmp;
            break;
        }
    }
    var salaryEditForm = new SalaryEditForm({
        "mode": 'UPDATE',
        "id": salary.id,
        "employeeId": this.loaded.employee.id,
        "value": salary.value,
        "start": salary.start,
        "end": salary.end,
        "currencyId": salary.currencyId
    }, "salaryEditForm", this.loadEmployeeContent, this);
    salaryEditForm.start();
}
EmployeeSalaryManager.prototype.deleteSalary = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    var salaryId = parseInt(tmp[tmp.length - 1]);
    var salaryDeleteForm = new SalaryDeleteForm(salaryId, this.loadEmployeeContent, this);
    salaryDeleteForm.start();
}
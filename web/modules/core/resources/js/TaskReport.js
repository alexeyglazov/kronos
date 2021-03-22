/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function TaskReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "TaskReport.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.loaded = {
        "offices" : [],
        "departments" : [],
        "subdepartments": [],
        "taskTypes": [],
        "tasks": []
    }
    this.selected = {
        "officeId" : null,
        "departmentId" : null,
        "subdepartmentId" : null,
        "taskTypeId" : null,
        "taskId" : null
    }
    this.data = {}
    this.reports = {};
}
TaskReport.prototype.init = function() {
    this.loadInitialContent();
}
TaskReport.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
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
            form.loaded.taskTypes = [];
            form.loaded.tasks = [];
            form.selected.officeId = null;
            form.selected.departmentId = null;
            form.selected.subdepartmentId = null;
            form.selected.taskTypeId = null;
            form.selected.taskId = null;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
TaskReport.prototype.loadOfficeContent = function() {
    var form = this;
    var data = {};
    data.command = "getOfficeContent";
    data.officeId = this.selected.officeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.departments = result.departments;
            form.loaded.subdepartments = [];
            form.loaded.taskTypes = [];
            form.loaded.tasks = [];            
            form.selected.departmentId = null;
            form.selected.subdepartmentId = null;
            form.selected.taskTypeId = null;
            form.selected.taskId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
TaskReport.prototype.loadDepartmentContent = function() {
    var form = this;
    var data = {};
    data.command = "getDepartmentContent";
    data.departmentId = this.selected.departmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.subdepartments = result.subdepartments;
            form.loaded.taskTypes = [];
            form.loaded.tasks = [];            
            form.selected.subdepartmentId = null;
            form.selected.taskTypeId = null;
            form.selected.taskId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
TaskReport.prototype.loadSubdepartmentContent = function() {
    var form = this;
    var data = {};
    data.command = "getSubdepartmentContent";
    data.subdepartmentId = this.selected.subdepartmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.taskTypes = result.taskTypes;
            form.loaded.tasks = [];
            form.selected.taskTypeId = null;
            form.selected.taskId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
TaskReport.prototype.loadTaskTypeContent = function() {
    var form = this;
    var data = {};
    data.command = "getTaskTypeContent";
    data.taskTypeId = this.selected.taskTypeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.tasks = result.tasks;
            form.selected.taskId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
TaskReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeDatePickers();
    this.updateView();
    this.setHandlers();
}
TaskReport.prototype.getHtml = function() {
    var html = '';
    html += '<fieldset>';
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Office</span></td>';
    html += '<td><span class="label1">Department</span></td>';
    html += '<td><span class="label1">Subdepartment</span></td>';
    html += '<td><span class="label1">Task type</span></td>';
    html += '<td><span class="label1">Task</span></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><select id="' + this.htmlId + '_office' + '"></select></td>';
    html += '<td><select id="' + this.htmlId + '_department' + '"></select></td>';
    html += '<td><select id="' + this.htmlId + '_subdepartment' + '"></select></td>';
    html += '<td><select id="' + this.htmlId + '_taskType' + '"></select></td>';
    html += '<td><select id="' + this.htmlId + '_task' + '"></select></td>';
    html += '</tr>';
    html += '</table>';
    html += '<table>';
    html += '<tr><td><span class="label1">From</span></td><td><span class="label1">To</span></td></tr>';
    html += '<tr><td><input type="text" id="' + this.htmlId + '_startDate' + '"></td><td><input type="text" id="' + this.htmlId + '_endDate' + '"></td></tr>';
    html += '<tr><td colspan="2"><input type="button" id="' + this.htmlId + '_generateBtn' + '" value="Generate"> <input type="button" id="' + this.htmlId + '_generateXLSBtn' + '" value="Generate XLS"></td></tr>';
    html += '</table>';
    html += '</fieldset>';
    html += '<div id="' + this.htmlId + '_report"></div>';
    html += '<form id="' + this.htmlId + '_xlsForm' + '" target="_blank" action="' + this.config.endpointUrl + '" method="post">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_command' + '" name="command" value="">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="taskReportForm" value="">';
    html += '</form>';
    return html;
}
TaskReport.prototype.makeDatePickers = function() {
    var form = this;
    $( '#' + this.htmlId + '_startDate' ).datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.startDateChangedHandle(dateText, inst)}
    });
    $( '#' + this.htmlId + '_endDate' ).datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.endDateChangedHandle(dateText, inst)}
    });
}
TaskReport.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_office').bind("change", function(event) {form.officeChangedHandle.call(form)});
    $('#' + this.htmlId + '_department').bind("change", function(event) {form.departmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_subdepartment').bind("change", function(event) {form.subdepartmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_taskType').bind("change", function(event) {form.taskTypeChangedHandle.call(form)});
    $('#' + this.htmlId + '_task').bind("change", function(event) {form.taskChangedHandle.call(form)});
    $('#' + this.htmlId + '_startDate').bind("change", function(event) {form.startDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_endDate').bind("change", function(event) {form.endDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_generateBtn').bind("click", function(event) {form.startGenerating.call(form, event)});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
}
TaskReport.prototype.officeChangedHandle = function(event) {
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
TaskReport.prototype.departmentChangedHandle = function(event) {
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
TaskReport.prototype.subdepartmentChangedHandle = function() {
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
TaskReport.prototype.taskTypeChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_taskType').val();
    if(idTxt == '') {
        this.selected.taskTypeId = null;
    } else {
        this.selected.taskTypeId = parseInt(idTxt);
    }
    if(this.selected.taskTypeId == null) {
        this.loadSubdepartmentContent();
    } else {
        this.loadTaskTypeContent();
    }
}
TaskReport.prototype.taskChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_task').val();
    if(idTxt == '') {
        this.selected.taskId = null;
    } else {
        this.selected.taskId = parseInt(idTxt);
    }
}
TaskReport.prototype.startDateChangedHandle = function(dateText, inst) {
    this.data.startDate = dateText;
}
TaskReport.prototype.startDateTextChangedHandle = function(event) {
    this.data.startDate = jQuery.trim(event.currentTarget.value);
}
TaskReport.prototype.endDateChangedHandle = function(dateText, inst) {
    this.data.endDate = dateText;
}
TaskReport.prototype.endDateTextChangedHandle = function(event) {
    this.data.endDate = jQuery.trim(event.currentTarget.value);
}
TaskReport.prototype.updateView = function() {
    this.updateOfficeView();
    this.updateDepartmentView();
    this.updateSubdepartmentView();
    this.updateTaskTypeView();
    this.updateTaskView();
    this.updateStartDateView();
    this.updateEndDateView();
}
TaskReport.prototype.updateOfficeView = function() {
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
TaskReport.prototype.updateDepartmentView = function() {
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
TaskReport.prototype.updateSubdepartmentView = function() {
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
TaskReport.prototype.updateTaskTypeView = function() {
    var html = "";
    html += '<option value="">...</option>';
    for(var key in this.loaded.taskTypes) {
        var taskType = this.loaded.taskTypes[key];
        var isSelected = "";
        if(taskType.id == this.selected.taskTypeId) {
           isSelected = "selected";
        }
        html += '<option value="'+ taskType.id +'" ' + isSelected + '>' + taskType.name + '</option>';
    }
    $('#' + this.htmlId + '_taskType').html(html);
}
TaskReport.prototype.updateTaskView = function() {
    var html = "";
    html += '<option value="">...</option>';
    for(var key in this.loaded.tasks) {
        var task = this.loaded.tasks[key];
        var isSelected = "";
        if(task.id == this.selected.taskId) {
           isSelected = "selected";
        }
        html += '<option value="'+ task.id +'" ' + isSelected + '>' + task.name + '</option>';
    }
    $('#' + this.htmlId + '_task').html(html);
}
TaskReport.prototype.updateStartDateView = function() {
    $('#' + this.htmlId + '_startDate').val(this.data.startDate);
}
TaskReport.prototype.updateEndDateView = function() {
    $('#' + this.htmlId + '_endDate').val(this.data.endDate);
}
TaskReport.prototype.validate = function() {
    var errors = [];
    if(this.selected.taskId == null) {
        errors.push("Task is not set");
    }
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
    return errors;
}
TaskReport.prototype.startGenerating = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
      this.generate();
    }
}
TaskReport.prototype.startGeneratingXLS = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
      this.generateXLS();
    }
}
TaskReport.prototype.generateXLS = function() {
    var serverFormatData = {
        "taskId" : this.selected.taskId,
        "startDate": getYearMonthDateFromDateString(this.data.startDate),
        "endDate": getYearMonthDateFromDateString(this.data.endDate)
    };
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReport');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(serverFormatData));
    $('#' + this.htmlId + '_xlsForm').submit();
}
TaskReport.prototype.generate = function() {
    $('#' + this.htmlId + '_report').html("In progress...");
    var serverFormatData = {
        "taskId" : this.selected.taskId,
        "startDate": getYearMonthDateFromDateString(this.data.startDate),
        "endDate": getYearMonthDateFromDateString(this.data.endDate)
    };
    var form = this;
    var data = {};
    data.command = "generateReport";
    data.taskReportForm = getJSON(serverFormatData);
    $.ajax({
        url: this.config.endpointUrl,
        data: data,
        cache: false,
        type: "POST",
        success: function(data){
            ajaxResultHandle(data, form, function(result) {
                form.report = result.report;
                form.updateReportView();
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
        }
    });
}
TaskReport.prototype.updateReportView = function() {
    var html = '<table><tr><td id="' + this.htmlId + '_heading"></td></tr><tr><td id="' + this.htmlId + '_body" style="padding-left: 15px;"></td></tr></table>';
    $('#' + this.htmlId + '_report').html(html);
    this.updateReportHeaderView();
    this.updateReportBodyView();
}
TaskReport.prototype.updateReportHeaderView = function() {
    var headingHtml = '';
    headingHtml += '<table class="datagrid">';
    headingHtml += '<tr><td>Task</td><td>' + this.report.formTaskName + '</td></tr>';
    headingHtml += '<tr><td>From</td><td>' + getStringFromYearMonthDate(this.report.formStartDate) + '</td></tr>';
    headingHtml += '<tr><td>To</td><td>' + getStringFromYearMonthDate(this.report.formEndDate) + '</td></tr>';
    headingHtml += '<tr><td>Report generated at</td><td>' + getStringFromYearMonthDateTime(this.report.createdAt) + '</td></tr>';
    headingHtml += '</table>';
    $('#' + this.htmlId + '_heading').html(headingHtml);  
}
TaskReport.prototype.updateReportBodyView = function() {
    var bodyHtml = '';
    bodyHtml += '<table id="' + this.htmlId + '_table" class="datagrid">';
    bodyHtml += '<tr class="dgHeader" id="' + this.htmlId + '_tableHeader">';
    bodyHtml += '<td>Project Code</td>';
    bodyHtml += '<td>Client</td>';
    bodyHtml += '<td>Group</td>';
    bodyHtml += '<td>Timespent</td>';
    bodyHtml += '</tr>';
    for(var key in this.report.offices) {
        var office = this.report.offices[key];
        var officeRows = this.getOfficeRows(office.id, this.report.rows);
        bodyHtml += this.showOffice(office.id, officeRows);
    }
    bodyHtml += this.showTotal();
    bodyHtml += '</table>';
    $('#' + this.htmlId + '_body').html(bodyHtml);
    $('#' + this.htmlId + '_table').treeTable({
        expandable: true
    });
}
TaskReport.prototype.showTotal = function(officeId, officeRows) {
    var html = '';
    var row = this.getSumRow(this.report.rows);
    html += '<tr id="' + this.htmlId + '_row_total" class="dgHighlight">';
    html += '<td>Total</td>';
    html += '<td></td>';
    html += '<td></td>';    
    html += '<td>' + (row.timeSpent != null ? minutesAsHoursVisualizer.getHtml(row.timeSpent) : '') + '</td>';
    html += '</tr>';
    return html;    
}
TaskReport.prototype.showOffice = function(officeId, officeRows) {
    var html = '';
    var row = this.getSumRow(officeRows);
    var office = this.getOffice(officeId);
    html += '<tr id="' + this.htmlId + '_row_' + officeId + '" class="child-of-' + this.htmlId + '_tableHeader">';
    html += '<td>' + office.name + '</td>';
    html += '<td></td>';
    html += '<td></td>';    
    html += '<td>' + (row.timeSpent != null ? minutesAsHoursVisualizer.getHtml(row.timeSpent) : '') + '</td>';
    html += '</tr>';
    var departmentIds = this.getDepartmentIds(officeRows);
    for(var key in departmentIds) {
        var departmentId = departmentIds[key];
        var departmentRows = this.getDepartmentRows(departmentId, officeRows);
        html += this.showDepartment(officeId, departmentId, departmentRows);
    }
    return html;
}
TaskReport.prototype.showDepartment = function(officeId, departmentId, departmentRows) {
    var html = '';
    var row = this.getSumRow(departmentRows);
    var department = this.getDepartment(departmentId);
    html += '<tr id="' + this.htmlId + '_row_' + officeId + '_' + departmentId + '" class="child-of-' + this.htmlId + '_row_' + officeId + '">';
    html += '<td>' + department.name + '</td>';
    html += '<td></td>';
    html += '<td></td>';    
    html += '<td>' + (row.timeSpent != null ? minutesAsHoursVisualizer.getHtml(row.timeSpent) : '') + '</td>';
    html += '</tr>';
    var subdepartmentIds = this.getSubdepartmentIds(departmentRows);
    for(var key in subdepartmentIds) {
        var subdepartmentId = subdepartmentIds[key];
        var subdepartmentRows = this.getSubdepartmentRows(subdepartmentId, departmentRows);
        html += this.showSubdepartment(officeId, departmentId, subdepartmentId, subdepartmentRows);
    }
    return html;        
}
TaskReport.prototype.showSubdepartment = function(officeId, departmentId, subdepartmentId, subdepartmentRows) {
    var html = '';
    var row = this.getSumRow(subdepartmentRows);
    var subdepartment = this.getSubdepartment(subdepartmentId);
    html += '<tr id="' + this.htmlId + '_row_' + officeId + '_' + departmentId + '_' + subdepartmentId + '" class="child-of-' + this.htmlId + '_row_' + officeId + '_' + departmentId + '">';
    html += '<td>' + subdepartment.name + '</td>';
    html += '<td></td>';
    html += '<td></td>';    
    html += '<td>' + (row.timeSpent != null ? minutesAsHoursVisualizer.getHtml(row.timeSpent) : '') + '</td>';
    html += '</tr>';
    var positionIds = this.getPositionIds(subdepartmentRows);
    for(var key in positionIds) {
        var positionId = positionIds[key];
        var positionRows = this.getPositionRows(positionId, subdepartmentRows);
        html += this.showPosition(officeId, departmentId, subdepartmentId, positionId, positionRows);
    }
    return html;
}
TaskReport.prototype.showPosition = function(officeId, departmentId, subdepartmentId, positionId, positionRows) {
    var html = '';
    var row = this.getSumRow(positionRows);
    var position = this.getPosition(positionId);
    html += '<tr id="' + this.htmlId + '_row_' + officeId + '_' + departmentId + '_' + subdepartmentId + '_' + positionId + '" class="child-of-' + this.htmlId + '_row_' + officeId + '_' + departmentId + '_' + subdepartmentId + '">';
    html += '<td>' + position.name + '</td>';
    html += '<td></td>';
    html += '<td></td>';    
    html += '<td>' + (row.timeSpent != null ? minutesAsHoursVisualizer.getHtml(row.timeSpent) : '') + '</td>';
    html += '</tr>';
    var employeeIds = this.getEmployeeIds(positionRows);
    for(var key in employeeIds) {
        var employeeId = employeeIds[key];
        var employeeRows = this.getEmployeeRows(employeeId, positionRows);
        html += this.showEmployee(officeId, departmentId, subdepartmentId, positionId, employeeId, employeeRows);
    }
    return html;
}
TaskReport.prototype.showEmployee = function(officeId, departmentId, subdepartmentId, positionId, employeeId, employeeRows) {
    var html = '';
    var row = this.getSumRow(employeeRows);
    var employee = this.getEmployee(employeeId);
    html += '<tr id="' + this.htmlId + '_row_' + officeId + '_' + departmentId + '_' + subdepartmentId + '_' + positionId + '_' + employeeId + '" class="child-of-' + this.htmlId + '_row_' + officeId + '_' + departmentId + '_' + subdepartmentId + '_' + positionId + '">';
    html += '<td>' + (employee.firstName + ' ' + employee.lastName) + '</td>';
    html += '<td></td>';
    html += '<td></td>';    
    html += '<td>' + (row.timeSpent != null ? minutesAsHoursVisualizer.getHtml(row.timeSpent) : '') + '</td>';
    html += '</tr>';
    for(var key in employeeRows) {
        var employeeRow = employeeRows[key];
        html += this.showProjectCode(officeId, departmentId, subdepartmentId, positionId, employeeId, employeeRow);
    }
    return html;
}
TaskReport.prototype.showProjectCode = function(officeId, departmentId, subdepartmentId, positionId, employeeId, row) {
    var html = '';
    var projectCode = this.getProjectCode(row.projectCodeId);
    var client = this.getClient(row.clientId);
    var group = this.getGroup(row.groupId);
    html += '<tr id="' + this.htmlId + '_row_' + officeId + '_' + departmentId + '_' + subdepartmentId + '_' + positionId + '_' + employeeId + '_' + row.projectCodeId + '" class="child-of-' + this.htmlId + '_row_' + officeId + '_' + departmentId + '_' + subdepartmentId + '_' + positionId + '_' + employeeId + '">';
    html += '<td>' + (projectCode != null ? projectCode.code : 'No code') + '</td>';
    html += '<td>' + (client != null ? client.name : '') + '</td>';
    html += '<td>' + (group != null ? group.name : '') + '</td>';    
    html += '<td>' + (row.timeSpent != null ? minutesAsHoursVisualizer.getHtml(row.timeSpent) : '') + '</td>';
    html += '</tr>';
    return html;
}

TaskReport.prototype.getOfficeRows = function(officeId, rows) {
    var officeRows = [];
    for(var key in rows) {
        var row = rows[key];
        if(row.officeId == officeId) {
            officeRows.push(row);
        }
    }
    return officeRows;
}
TaskReport.prototype.getDepartmentRows = function(departmentId, rows) {
    var departmentRows = [];
    for(var key in rows) {
        var row = rows[key];
        if(row.departmentId == departmentId) {
            departmentRows.push(row);
        }
    }
    return departmentRows;    
}
TaskReport.prototype.getSubdepartmentRows = function(subdepartmentId, rows) {
    var subdepartmentRows = [];
    for(var key in rows) {
        var row = rows[key];
        if(row.subdepartmentId == subdepartmentId) {
            subdepartmentRows.push(row);
        }
    }
    return subdepartmentRows;    
}
TaskReport.prototype.getPositionRows = function(positionId, rows) {
    var positionRows = [];
    for(var key in rows) {
        var row = rows[key];
        if(row.positionId == positionId) {
            positionRows.push(row);
        }
    }
    return positionRows;    
}
TaskReport.prototype.getEmployeeRows = function(employeeId, rows) {
    var employeeRows = [];
    for(var key in rows) {
        var row = rows[key];
        if(row.employeeId == employeeId) {
            employeeRows.push(row);
        }
    }
    return employeeRows;    
}
TaskReport.prototype.getOfficeIds = function(rows) {
    var officeIds = [];
    for(var key in rows) {
        var row = rows[key];
        if(jQuery.inArray(row.officeId, officeIds) == -1) {
            officeIds.push(row.officeId);
        }
    }
    return officeIds;
}
TaskReport.prototype.getDepartmentIds = function(rows) {
    var departmentIds = [];
    for(var key in rows) {
        var row = rows[key];
        if(jQuery.inArray(row.departmentId, departmentIds) == -1) {
            departmentIds.push(row.departmentId);
        }
    }
    return departmentIds;    
}
TaskReport.prototype.getSubdepartmentIds = function(rows) {
    var subdepartmentIds = [];
    for(var key in rows) {
        var row = rows[key];
        if(jQuery.inArray(row.subdepartmentId, subdepartmentIds) == -1) {
            subdepartmentIds.push(row.subdepartmentId);
        }
    }
    return subdepartmentIds;    
}
TaskReport.prototype.getPositionIds = function(rows) {
    var positionIds = [];
    for(var key in rows) {
        var row = rows[key];
        if(jQuery.inArray(row.positionId, positionIds) == -1) {
            positionIds.push(row.positionId);
        }
    }
    return positionIds;    
}
TaskReport.prototype.getEmployeeIds = function(rows) {
    var employeeIds = [];
    for(var key in rows) {
        var row = rows[key];
        if(jQuery.inArray(row.employeeId, employeeIds) == -1) {
            employeeIds.push(row.employeeId);
        }
    }
    return employeeIds;    
}
TaskReport.prototype.getOffice = function(officeId) {
    for(var key in this.report.offices) {
        var office = this.report.offices[key];
        if(office.id == officeId) {
            return office;
        }
    }
    return null;
}
TaskReport.prototype.getDepartment = function(departmentId) {
    for(var key in this.report.departments) {
        var department = this.report.departments[key];
        if(department.id == departmentId) {
            return department;
        }
    }
    return null;    
}
TaskReport.prototype.getSubdepartment = function(subdepartmentId) {
    for(var key in this.report.subdepartments) {
        var subdepartment = this.report.subdepartments[key];
        if(subdepartment.id == subdepartmentId) {
            return subdepartment;
        }
    }
    return null;    
}
TaskReport.prototype.getPosition = function(positionId) {
    for(var key in this.report.positions) {
        var position = this.report.positions[key];
        if(position.id == positionId) {
            return position;
        }
    }
    return null;    
}
TaskReport.prototype.getEmployee = function(employeeId) {
    for(var key in this.report.employees) {
        var employee = this.report.employees[key];
        if(employee.id == employeeId) {
            return employee;
        }
    }
    return null;    
}
TaskReport.prototype.getProjectCode = function(projectCodeId) {
    for(var key in this.report.projectCodes) {
        var projectCode = this.report.projectCodes[key];
        if(projectCode.id == projectCodeId) {
            return projectCode;
        }
    }
    return null;    
}
TaskReport.prototype.getClient = function(clientId) {
    for(var key in this.report.clients) {
        var client = this.report.clients[key];
        if(client.id == clientId) {
            return client;
        }
    }
    return null;    
}
TaskReport.prototype.getGroup = function(groupId) {
    for(var key in this.report.groups) {
        var group = this.report.groups[key];
        if(group.id == groupId) {
            return group;
        }
    }
    return null;    
}

TaskReport.prototype.getSumRow = function(rows) {
    var sumRow = {
        "timeSpent" : null
    };
    for(var key in rows) {
        var row = rows[key];
        if(row.timeSpent != null) {
            if(sumRow.timeSpent == null) {
                sumRow.timeSpent = row.timeSpent;
            } else {
                sumRow.timeSpent += row.timeSpent;
            }
        }
    }
    return sumRow;
}
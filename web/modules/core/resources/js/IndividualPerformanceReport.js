/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function IndividualPerformanceReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "IndividualPerformanceReport.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.loaded = {
        "offices" : [],
        "departments" : [],
        "subdepartments": [],
        "employees": []
    }
    this.selected = {
        "officeId" : null,
        "departmentId" : null,
        "subdepartmentId" : null,
        "employeeId" : null
    }
    this.data = {}
    this.report = null;
}
IndividualPerformanceReport.prototype.init = function() {
    this.loadInitialContent();
}
IndividualPerformanceReport.prototype.loadInitialContent = function() {
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
            form.loaded.employees = [];
            form.selected.officeId = null;
            form.selected.departmentId = null;
            form.selected.subdepartmentId = null;
            form.selected.employeeId = null;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
IndividualPerformanceReport.prototype.loadOfficeContent = function() {
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
            form.loaded.employees = [];
            form.selected.departmentId = null;
            form.selected.subdepartmentId = null;
            form.selected.employeeId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
IndividualPerformanceReport.prototype.loadDepartmentContent = function() {
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
            form.loaded.employees = [];
            form.selected.subdepartmentId = null;
            form.selected.employeeId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
IndividualPerformanceReport.prototype.loadSubdepartmentContent = function() {
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
            form.loaded.employees = result.employees;
            form.selected.employeeId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
IndividualPerformanceReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeDatePickers();
    this.updateView();
    this.setHandlers();
}
IndividualPerformanceReport.prototype.getHtml = function() {
    var html = '';
    html += '<fieldset>';
    html += '<table>';
    html += '<tr><td><span class="label1">Office</span></td><td><span class="label1">Department</span></td><td><span class="label1">Subdepartment</span></td><td><span class="label1">Employee</span></td></tr>';
    html += '<tr><td><select id="' + this.htmlId + '_office' + '"></select></td><td><select id="' + this.htmlId + '_department' + '"></select></td><td><select id="' + this.htmlId + '_subdepartment' + '"></select></td><td><select id="' + this.htmlId + '_employee' + '"></select></td></tr>';
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
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="individualPerformanceReportForm" value="">';
    html += '</form>';
    return html;
}
IndividualPerformanceReport.prototype.makeDatePickers = function() {
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
IndividualPerformanceReport.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_office').bind("change", function(event) {form.officeChangedHandle.call(form)});
    $('#' + this.htmlId + '_department').bind("change", function(event) {form.departmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_subdepartment').bind("change", function(event) {form.subdepartmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_employee').bind("change", function(event) {form.employeeChangedHandle.call(form)});
    $('#' + this.htmlId + '_startDate').bind("change", function(event) {form.startDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_endDate').bind("change", function(event) {form.endDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_generateBtn').bind("click", function(event) {form.startGenerating.call(form, event)});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
}
IndividualPerformanceReport.prototype.officeChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_office').val();
    if(idTxt == 'ALL') {
        this.selected.officeId = null;
    } else {
        this.selected.officeId = parseInt(idTxt);
    }
    if(this.selected.officeId == null) {
        this.loaded.departments = [];
        this.loaded.subdepartments = [];
        this.loaded.employees = [];
        this.selected.departmentId = null;
        this.selected.subdepartmentId = null;
        this.selected.employeeId = null;
        this.updateView();
    } else {
        this.loadOfficeContent();
    }
}
IndividualPerformanceReport.prototype.departmentChangedHandle = function(event) {
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
IndividualPerformanceReport.prototype.subdepartmentChangedHandle = function(event) {
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
IndividualPerformanceReport.prototype.employeeChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_employee').val();
    if(idTxt == 'ALL') {
        this.selected.employeeId = null;
    } else {
        this.selected.employeeId = parseInt(idTxt);
    }
}
IndividualPerformanceReport.prototype.startDateChangedHandle = function(dateText, inst) {
    this.data.startDate = dateText;
}
IndividualPerformanceReport.prototype.startDateTextChangedHandle = function(event) {
    this.data.startDate = jQuery.trim(event.currentTarget.value);
}
IndividualPerformanceReport.prototype.endDateChangedHandle = function(dateText, inst) {
    this.data.endDate = dateText;
}
IndividualPerformanceReport.prototype.endDateTextChangedHandle = function(event) {
    this.data.endDate = jQuery.trim(event.currentTarget.value);
}
IndividualPerformanceReport.prototype.updateView = function() {
    this.updateOfficeView();
    this.updateDepartmentView();
    this.updateSubdepartmentView();
    this.updateEmployeeView();
    this.updateStartDateView();
    this.updateEndDateView();
}
IndividualPerformanceReport.prototype.updateOfficeView = function() {
   var html = "";
   html += '<option value="ALL">ALL</option>';
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
IndividualPerformanceReport.prototype.updateDepartmentView = function() {
   var html = "";
   html += '<option value="ALL">ALL</option>';
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
IndividualPerformanceReport.prototype.updateSubdepartmentView = function() {
    var html = "";
    html += '<option value="ALL">ALL</option>';
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
IndividualPerformanceReport.prototype.updateEmployeeView = function() {
    var html = "";
    html += '<option value="ALL">ALL</option>';
    for(var key in this.loaded.employees) {
        var employee = this.loaded.employees[key];
        var isSelected = "";
        if(employee.id == this.selected.employeeId) {
           isSelected = "selected";
        }
        html += '<option value="'+ employee.id +'" ' + isSelected + '>' + employee.userName + ' (' + employee.firstName + ' ' + employee.lastName + ')' + '</option>';
    }
    $('#' + this.htmlId + '_employee').html(html);
}
IndividualPerformanceReport.prototype.updateStartDateView = function() {
    $('#' + this.htmlId + '_startDate').val(this.data.startDate);
}
IndividualPerformanceReport.prototype.updateEndDateView = function() {
    $('#' + this.htmlId + '_endDate').val(this.data.endDate);
}
IndividualPerformanceReport.prototype.validate = function(mode) {
    var errors = [];
    var warnings = [];
    var startDate = null;
    var endDate = null;
    if(mode == "HTML") {
        if(this.selected.employeeId == null) {
            errors.push("Employee must be selected when report is presented here"); 
        }
    }
    if(this.data.startDate == null || this.data.startDate == "") {
        errors.push("Start date is not set");
    } else if(! isDateValid(this.data.startDate)) {
        errors.push("Start date has incorrect format");
    } else {
        startDate = parseDateString(this.data.startDate);
    }
    if(this.data.endDate == null || this.data.endDate == "") {
        errors.push("End date is not set");
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
IndividualPerformanceReport.prototype.startGenerating = function() {
    var mode = "HTML";
    var result = this.validate(mode);
    if(result.errors.length > 0) {
        showErrors(result.errors);
    } else {
        this.generate();
    }
}
IndividualPerformanceReport.prototype.startGeneratingXLS = function() {
    var mode = "XLS";
    var result = this.validate(mode);
    if(result.errors.length > 0) {
        showErrors(result.errors);
    } else {
        this.generateXLS();
    }
}
IndividualPerformanceReport.prototype.generateXLS = function() {
    var serverFormatData = {
        "officeId" : this.selected.officeId,
        "departmentId" : this.selected.departmentId,
        "subdepartmentId" : this.selected.subdepartmentId,
        "employeeId" : this.selected.employeeId,
        "startDate": getYearMonthDateFromDateString(this.data.startDate),
        "endDate": getYearMonthDateFromDateString(this.data.endDate)
    };
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReport');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(serverFormatData));
    $('#' + this.htmlId + '_xlsForm').submit();
}
IndividualPerformanceReport.prototype.generate = function() {
    $('#' + this.htmlId + '_report').html("In progress...");
    var serverFormatData = {
        "officeId" : this.selected.officeId,
        "departmentId" : this.selected.departmentId,
        "subdepartmentId" : this.selected.subdepartmentId,
        "employeeId" : this.selected.employeeId,
        "startDate": getYearMonthDateFromDateString(this.data.startDate),
        "endDate": getYearMonthDateFromDateString(this.data.endDate)
    };
    var form = this;
    var data = {};
    data.command = "generateReport";
    data.individualPerformanceReportForm = getJSON(serverFormatData);
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
IndividualPerformanceReport.prototype.updateReportView = function() {
    var html = '<table><tr><td id="' + this.htmlId + '_heading"></td></tr><tr><td id="' + this.htmlId + '_body"></td></tr></table>';
    $('#' + this.htmlId + '_report').html(html);

    var headingHtml = '';
    headingHtml += '<table class="datagrid">';
    headingHtml += '<tr><td>Office</td><td>' + this.report.formOfficeName + '</td></tr>';
    headingHtml += '<tr><td>Department</td><td>' + this.report.formDepartmentName + '</td></tr>';
    headingHtml += '<tr><td>Subdepartment</td><td>' + this.report.formSubdepartmentName + '</td></tr>';
    headingHtml += '<tr><td>Employee</td><td>' + this.report.formEmployeeUserName + '</td></tr>';
    headingHtml += '<tr><td>Start</td><td>' + calendarVisualizer.getHtml(this.report.formStartDate) + '</td></tr>';
    headingHtml += '<tr><td>End</td><td>' + calendarVisualizer.getHtml(this.report.formEndDate) + '</td></tr>';
    headingHtml += '<tr><td>Report Generated at</td><td>' + this.report.createdAt + '</td></tr>';
    headingHtml += '</table>';
    $('#' + this.htmlId + '_heading').html(headingHtml);
    
    if(this.report.employeeReports.length > 0) {
        for(var key in this.report.employeeReports) {
            var employeeReport = this.report.employeeReports[key];
            var bodyHtml = '';

            bodyHtml += '<table id="' + this.htmlId + '_employee_' + employeeReport.employee.id + '_carreer"></table><br />';
            bodyHtml += '<table id="' + this.htmlId + '_employee_' + employeeReport.employee.id + '_projectTimespent"></table><br />';
            bodyHtml += '<table id="' + this.htmlId + '_employee_' + employeeReport.employee.id + '_notInternalTaskTimespent"></table><br />';
            bodyHtml += '<table id="' + this.htmlId + '_employee_' + employeeReport.employee.id + '_internalTaskTimespent"></table><br />';
            $('#' + this.htmlId + '_body').append(bodyHtml);
            this.showEmployeeCarreer(this.htmlId + '_employee_' + employeeReport.employee.id + '_carreer', employeeReport.employee, employeeReport.carreerItems);
            this.showProjectTimespentEmployeeReport(this.htmlId + '_employee_' + employeeReport.employee.id + '_projectTimespent', employeeReport.clientTimespentItems);
            this.showNotInternalTaskTimespentEmployeeReport(this.htmlId + '_employee_' + employeeReport.employee.id + '_notInternalTaskTimespent', employeeReport.notInternalTaskTimespentItems);
            this.showInternalTaskTimespentEmployeeReport(this.htmlId + '_employee_' + employeeReport.employee.id + '_internalTaskTimespent', employeeReport.internalTaskTimespentItems);
        }
    } else {
        var bodyHtml = 'No time was reported in this period for this filter settings';
        $('#' + this.htmlId + '_body').html(bodyHtml);
        
    }
}
IndividualPerformanceReport.prototype.showEmployeeCarreer = function(htmlContainerId, employee, carreerItems) {
    var employeeFullName = employee.firstName + ' ' + employee.lastName;
    var normalizedData = [];
    for(var key in carreerItems) {
        var item = carreerItems[key];
        normalizedData.push({
            "employeePositionHistoryItemId": item.employeePositionHistoryItemId,
            "positionName": item.positionName,
            "start": calendarVisualizer.getHtml(item.start),
            "end": calendarVisualizer.getHtml(item.end),
            "standardPositionName": item.standardPositionName,
            "subdepartmentName": item.subdepartmentName,
            "departmentName": item.departmentName,
            "officeName": item.officeName
        });
    }
    jQuery('#' + htmlContainerId).jqGrid('clearGridData');
    jQuery('#' + htmlContainerId).jqGrid({
        data: normalizedData,
        datatype: "local",
        height: 'auto',
        colNames:['Office', 'Department', 'Subdepartment', 'Position', 'Standard position', 'Start', 'End'],
        colModel:[
            {name:'officeName',index:'officeName', width:100, sortable:false},
            {name:'departmentName',index:'departmentName', width:100, sortable:false},
            {name:'subdepartmentName',index:'subdepartmentName', width:100, sortable:false},
            {name:'positionName',index:'positionName', width:100, sortable:false},
            {name:'standardPositionName',index:'standardPositionName', width:100, sortable:false},
            {name:'start',index:'start', width:80, sortable:false},
            {name:'end',index:'end', width:80, sortable:false}	
        ],
        rowNum:1000,
        multiselect: false,
        shrinkToFit: false,
        caption: employeeFullName
    });
}
IndividualPerformanceReport.prototype.showProjectTimespentEmployeeReport = function(htmlContainerId, data) {
    var normalizedData = [];
    var totalTimespent = 0;
    for(var key in data) {
        var item = data[key];
        var timespent = item.timespent/60.0;
        totalTimespent += timespent;
        normalizedData.push({
            "groupId": item.groupId,
            "groupName": item.groupName,
            "clientId": item.clientId,
            "clientName": item.clientName,
            "timespent": timespent
        });
    }
    jQuery('#' + htmlContainerId).jqGrid('clearGridData');
    jQuery('#' + htmlContainerId).jqGrid({
        userData: {'clientName': 'Total', 'timespent': totalTimespent},
        data: normalizedData,
        datatype: "local",
        height: 'auto',
        colNames:['Group', 'Client', 'Time spent'],
        colModel:[
            {name:'groupName',index:'groupName', width:80},
            {name:'clientName',index:'clientName', width:150},
            {name:'timespent',index:'timespent', width:70, sorttype:"float"}	
        ],
        rowNum:1000,
        multiselect: false,
        footerrow : true,
	userDataOnFooter : true,
        shrinkToFit: false,
        caption: "Time spent on client"
    });
}
IndividualPerformanceReport.prototype.showNotInternalTaskTimespentEmployeeReport = function(htmlContainerId, data) {
    var normalizedData = [];
    var totalTimespent = 0;
    for(var key in data) {
        var item = data[key];
        var timespent = item.timespent/60.0;
        totalTimespent += timespent;
        normalizedData.push({
            "taskTypeId": item.taskTypeId,
            "taskTypeName": item.taskTypeName,
            "taskId": item.taskId,
            "taskName": item.taskName,
            "timespent": timespent
        });
        
    }
    jQuery('#' + htmlContainerId).jqGrid('clearGridData');
    jQuery('#' + htmlContainerId).jqGrid({
        userData: {'taskName': 'Total', 'timespent': totalTimespent},
        data: normalizedData,
        datatype: "local",
        height: 'auto',
        colNames:['Task Type', 'Task', 'Time spent'],
        colModel:[
            {name:'taskTypeName',index:'taskTypeName', width:120},
            {name:'taskName',index:'taskName', width:300},
            {name:'timespent',index:'timespent', width:70, sorttype:"float"}	
        ],
        rowNum:1000,
        multiselect: false,
        footerrow : true,
	userDataOnFooter : true,
        shrinkToFit: false,
        caption: "Time spent per task"
    });  
}
IndividualPerformanceReport.prototype.showInternalTaskTimespentEmployeeReport = function(htmlContainerId, data) {
    var normalizedData = [];
    var totalTimespent = 0;
    for(var key in data) {
        var item = data[key];
        var timespent = item.timespent/60.0;
        totalTimespent += timespent;
        normalizedData.push({
            "taskId": item.taskId,
            "taskName": item.taskName,
            "timespent": timespent
        });
        
    }
    jQuery('#' + htmlContainerId).jqGrid('clearGridData');
    jQuery('#' + htmlContainerId).jqGrid({
        userData: {'taskName': 'Total', 'timespent': totalTimespent},
        data: normalizedData,        
        datatype: "local",
        height: 'auto',
        colNames:['Task', 'Time spent'],
        colModel:[
            {name:'taskName',index:'taskName', width:300},
            {name:'timespent',index:'timespent', width:70, sorttype:"float"}	
        ],
        rowNum:1000,
        multiselect: false,
        footerrow : true,
	userDataOnFooter : true,
	altRows : true,
        caption: "Time spent internal"
    });  
}

/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function TimeSheetReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "TimeSheetReport.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;

    this.years = [];
    var date = new Date();
    this.loaded = {
        "departments" : [],
        "subdepartments": [],
        "employees": []
    }
    this.selected = {
        "departmentId" : null,
        "subdepartmentId" : null,
        "employeeIds" : [],
        "onlyActiveEmployees": true

    }
    this.data = {
        "employeeIds" : [],
        "startDate" : null,
        "endDate" : null
    }
    this.reports = {};
}
TimeSheetReport.prototype.init = function() {
    this.loadInitialContent();
}
TimeSheetReport.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.onlyActiveEmployees = this.selected.onlyActiveEmployees;
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
            form.loaded.employees = result.employees;
            form.selected.officeId = null;
            form.selected.departmentId = null;
            form.selected.subdepartmentId = null;
            form.data.employeeIds = [];
            form.selected.employeeIds = form.data.employeeIds;
            var startYear = form.data.year;
            if(result.minYear != null && result.minYear < startYear) {
                startYear = result.minYear;
            }
            for(var i = startYear; i <= form.data.year + 1; i++) {
               form.years.push(i);
            }
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
TimeSheetReport.prototype.loadOfficeContent = function() {
    var form = this;
    var data = {};
    data.command = "getOfficeContent";
    data.officeId = this.selected.officeId;
    data.onlyActiveEmployees = this.selected.onlyActiveEmployees;
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
TimeSheetReport.prototype.loadDepartmentContent = function() {
    var form = this;
    var data = {};
    data.command = "getDepartmentContent";
    data.departmentId = this.selected.departmentId;
    data.onlyActiveEmployees = this.selected.onlyActiveEmployees;
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
TimeSheetReport.prototype.loadSubdepartmentContent = function() {
    var form = this;
    var data = {};
    data.command = "getSubdepartmentContent";
    data.subdepartmentId = this.selected.subdepartmentId;
    data.onlyActiveEmployees = this.selected.onlyActiveEmployees;
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
TimeSheetReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.makeDatePickers();
    this.setHandlers();
}
TimeSheetReport.prototype.getHtml = function() {
    var html = '';
    html += '<fieldset>';
    html += '<table>';
    html += '<tr><td><span class="label1">Office</span></td><td><span class="label1">Department</span></td><td><span class="label1">Subdepartment</span></td><td><span class="label1">Only active</span></td></tr>';
    html += '<tr><td><select id="' + this.htmlId + '_office"></select></td><td><select id="' + this.htmlId + '_department"></select></td><td><select id="' + this.htmlId + '_subdepartment"></select></td><td><input type="checkbox" id="' + this.htmlId + '_onlyActiveEmployees"></td></tr>';
    html += '</table>';
    html += '<table>';
    html += '<tr><td><span class="label1">Employees</span></td><td><select id="' + this.htmlId + '_employee" size="10" style="width: 400px;"></select></td></tr>';
    html += '</table>';
    
    html += '<table>';
    html += '<tr><td><span class="label1">From</span></td><td><span class="label1">To</span></td></tr>';
    html += '<tr>';
    html += '<td><input type="text" id="' + this.htmlId + '_startDate' + '"></td>';
    html += '<td><input type="text" id="' + this.htmlId + '_endDate' + '"></td>';
    html += '</tr>';
    html += '</table>';
    html += '<table>';
    html += '<tr><td colspan="2"><input type="button" id="' + this.htmlId + '_generateHTMLBtn' + '" value="Show here"><input type="button" id="' + this.htmlId + '_generateXLSBtn' + '" value="Generate XLS"></td></tr>';
    html += '</table>';
    html += '</fieldset>';
    html += '<div id="' + this.htmlId + '_report"></div>';
    html += '<form id="' + this.htmlId + '_xlsForm' + '" target="_blank" action="' + this.config.endpointUrl + '" method="post">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_command' + '" name="command" value="">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="timeSheetReportForm" value="">';
    html += '</form>';
    return html;
}
TimeSheetReport.prototype.makeDatePickers = function() {
    var form = this;
    $('#' + this.htmlId + '_startDate').datepicker({
        dateFormat: 'dd.mm.yy',
        changeMonth: true,
        changeYear: true,
        onSelect: function(dateText, inst) {
            form.startDateChangedHandle(dateText, inst)
        }
    });
    $('#' + this.htmlId + '_endDate').datepicker({
        dateFormat: 'dd.mm.yy',
        changeMonth: true,
        changeYear: true,
        onSelect: function(dateText, inst) {
            form.endDateChangedHandle(dateText, inst)
        }
    });
}
TimeSheetReport.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_office').bind("change", function(event) {form.officeChangedHandle.call(form)});
    $('#' + this.htmlId + '_department').bind("change", function(event) {form.departmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_subdepartment').bind("change", function(event) {form.subdepartmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_startDate').bind("change", function(event) {form.startDateTextChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_endDate').bind("change", function(event) {form.endDateTextChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_employee').bind("change", function(event) {form.employeeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_onlyActiveEmployees').bind("click", function(event) {form.onlyActiveEmployeesChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
    $('#' + this.htmlId + '_generateHTMLBtn').bind("click", function(event) {form.startGeneratingHTML.call(form, event)});
}
TimeSheetReport.prototype.officeChangedHandle = function(event) {
    this.selected.employeeIds = [];
    var idTxt = $('#' + this.htmlId + '_office').val();
    if(idTxt == 'ALL') {
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
TimeSheetReport.prototype.departmentChangedHandle = function(event) {
    this.selected.employeeIds = [];
    var idTxt = $('#' + this.htmlId + '_department').val();
    if(idTxt == 'ALL') {
        this.selected.departmentId = null;
    } else {
        this.selected.departmentId = parseInt(idTxt);
    }
    if(this.selected.departmentId == null) {
        this.loadInitialContent();
    } else {
        this.loadDepartmentContent();
    }
}
TimeSheetReport.prototype.subdepartmentChangedHandle = function(event) {
    this.selected.employeeIds = [];
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

TimeSheetReport.prototype.startDateChangedHandle = function(dateText, inst) {
    var date = dateText;
    this.startDateStringChangedHandle(date);
}
TimeSheetReport.prototype.startDateTextChangedHandle = function(event) {
    var date = jQuery.trim(event.currentTarget.value);
    this.startDateStringChangedHandle(date);
}
TimeSheetReport.prototype.startDateStringChangedHandle = function(date) {
    if(date == null || $.trim(date) == '') {
        this.data.startDate = null;
    } if (isDateValid(date)) {
        this.data.startDate = getYearMonthDateFromDateString(date);
    }
    this.updateStartDateView();
}

TimeSheetReport.prototype.endDateChangedHandle = function(dateText, inst) {
    var date = dateText;
    this.endDateStringChangedHandle(date);
}
TimeSheetReport.prototype.endDateTextChangedHandle = function(event) {
    var date = jQuery.trim(event.currentTarget.value);
    this.endDateStringChangedHandle(date);
}
TimeSheetReport.prototype.endDateStringChangedHandle = function(date) {
    if(date == null || $.trim(date) == '') {
        this.data.endDate = null;
    } if (isDateValid(date)) {
        this.data.endDate = getYearMonthDateFromDateString(date);
    }
    this.updateEndDateView();
}

TimeSheetReport.prototype.employeeChangedHandle = function(event) {
    var htmlId = $('#' + this.htmlId + '_employee').val();
    if(htmlId == '') {
        this.selected.employeeIds = [];
    } else {
        this.selected.employeeIds = [];
        this.selected.employeeIds.push(parseInt(htmlId));
    }
    this.data.employeeIds = this.selected.employeeIds;
    this.updateEmployeeView();
    this.updateButtonsView();
}
TimeSheetReport.prototype.onlyActiveEmployeesChangedHandle = function(event) {
    var htmlId = event.currentTarget.id;
    if($(event.currentTarget).is(':checked')) {
        this.selected.onlyActiveEmployees = true;
    } else {
        this.selected.onlyActiveEmployees = false;
    }
    if(this.selected.subdepartmentId != null) {
        this.loadSubdepartmentContent();
    } else if(this.selected.departmentId != null) {
        this.loadDepartmentContent();
    } else if(this.selected.officeId != null) {
        this.loadOfficeContent();
    } else {
        this.loadInitialContent();
    }
}
TimeSheetReport.prototype.updateView = function() {
    this.updateOfficeView();
    this.updateDepartmentView();
    this.updateSubdepartmentView();
    this.updateEmployeeView();
    this.updateStartDateView();
    this.updateEndDateView();
    this.updateOnlyActiveEmployeesView();
    this.updateButtonsView();
}
TimeSheetReport.prototype.updateOfficeView = function() {
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
TimeSheetReport.prototype.updateDepartmentView = function() {
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
TimeSheetReport.prototype.updateSubdepartmentView = function() {
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
TimeSheetReport.prototype.updateStartDateView = function() {
    $('#' + this.htmlId + '_startDate').val(getStringFromYearMonthDate(this.data.startDate));
}
TimeSheetReport.prototype.updateEndDateView = function() {
    $('#' + this.htmlId + '_endDate').val(getStringFromYearMonthDate(this.data.endDate));
}
TimeSheetReport.prototype.updateOnlyActiveEmployeesView = function() {
    $('#' + this.htmlId + '_onlyActiveEmployees').attr('checked', this.selected.onlyActiveEmployees);
}
TimeSheetReport.prototype.updateEmployeeView = function() {
    var html = '';
    for(var key in this.loaded.employees) {
        var employee = this.loaded.employees[key];
        var isSelected = "";
        if(jQuery.inArray(employee.id, this.selected.employeeIds) != -1) {
           isSelected = "selected";
        }
        html += '<option value="' + employee.id + '" ' + isSelected + '>' + employee.lastName + ' ' + employee.firstName + ' (' + employee.userName + ')' + '</option>';
    }
    $('#' + this.htmlId + '_employee').html(html);
}
TimeSheetReport.prototype.updateButtonsView = function() {
    if(this.selected.employeeIds.length == 0) {
        $('#' + this.htmlId + '_generateXLSBtn').attr("disabled", true);
        $('#' + this.htmlId + '_generateHTMLBtn').attr("disabled", true);
    } else if(this.selected.employeeIds.length == 1) {
        $('#' + this.htmlId + '_generateXLSBtn').attr("disabled", false);
        $('#' + this.htmlId + '_generateHTMLBtn').attr("disabled", false);
    } else {
        $('#' + this.htmlId + '_generateXLSBtn').attr("disabled", false);
        $('#' + this.htmlId + '_generateHTMLBtn').attr("disabled", true);
    }
}
TimeSheetReport.prototype.validate = function() {
    var errors = [];
    if(this.data.startDate == null) {
        errors.push("Start date is not set");
    }
    if(this.data.endDate == null) {
        errors.push("End date is not set");
    }
    if(this.data.startDate != null && this.data.endDate != null && compareYearMonthDate(this.data.startDate, this.data.endDate) > 0) {
        errors.push("End date is less than Start date");
    }

    if(this.data.employeeIds != null && this.data.employeeIds.length == 0) {
        errors.push("At least one Employee must be selected");
    }
    return errors;
}
TimeSheetReport.prototype.startGeneratingXLS = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
      this.generateXLSReports();
    }
}
TimeSheetReport.prototype.generateXLSReports = function() {
    var serverFormatData = {
        "startDate": this.data.startDate,
        "endDate": this.data.endDate,
        "employeeId": this.data.employeeIds[0]
    }
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReport');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(serverFormatData));
    $('#' + this.htmlId + '_xlsForm').submit();
}
TimeSheetReport.prototype.startGeneratingHTML = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
      this.generateHTML();
    }
}
TimeSheetReport.prototype.generateHTML = function() {
    var form = this;
    var data = {};
    var serverFormatData = {
        "startDate": this.data.startDate,
        "endDate": this.data.endDate,
        "employeeId": this.data.employeeIds[0]
    }    
    data.command = "generateReport";
    data.timeSheetReportForm = getJSON(serverFormatData);
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

TimeSheetReport.prototype.updateReportView = function(status, comment) {
    if(status == "PROGRESS") {
        $('#' + this.htmlId + '_reportFull').html("In progress...");
    } else if(status == "FAIL") {
        $('#' + this.htmlId + '_reportFull').html(comment);
    } else {
        this.updateReportViewWithContent(this.htmlId + '_report');
    }
}

TimeSheetReport.prototype.updateReportViewWithContent = function(containerHtmlId) {
    var html = '<table><tr><td id="' + containerHtmlId + '_heading"></td></tr><tr><td id="' + containerHtmlId + '_body"></td></tr></table>';
    $('#' + containerHtmlId).html(html);

    var headingHtml = '';
    headingHtml += '<table class="datagrid">';
    headingHtml += '<tr><td>Report on employee</td><td>' + this.report.formEmployee.userName + ' (' + this.report.formEmployee.firstName + ' ' + this.report.formEmployee.lastName + ')' + '</td></tr>';
    headingHtml += '<tr><td>Sub-Department</td><td>' + this.report.formEmployeeSubdepartment.name + '</td></tr>';
    headingHtml += '<tr><td>Department</td><td>' + this.report.formEmployeeDepartment.name + '</td></tr>';
    headingHtml += '<tr><td>Report Generated at</td><td>' + getStringFromYearMonthDateTime(this.report.createdAt) + '</td></tr>';
    headingHtml += '</table>';
    $('#' + containerHtmlId + '_heading').html(headingHtml);
    
    var bodyHtml = '';
    bodyHtml += '<table class="datagrid">';
    bodyHtml += '<tr class="dgHeader"><td colspan="9">Time Sheet Report</td></tr>';
    bodyHtml += '<tr class="dgHeader"><td>Group</td><td>Client</td><td>Code</td><td>Date</td><td>Time Spent</td><td>Description</td><td>Task Type</td><td>Task</td><td>Modified At</td></tr>';

    for(var key in this.report.rows) {
        var row = this.report.rows[key];
        bodyHtml += '<tr>';
        if(row.code == null) {
            bodyHtml += '<td>Internal</td>';
            bodyHtml += '<td>Internal</td>';
            bodyHtml += '<td>Internal</td>';
        } else {
            bodyHtml += '<td>' + row.groupName + '</td>';
            bodyHtml += '<td>' + row.clientName + '</td>';
            bodyHtml += '<td>' + row.code + '</td>';
        }
        bodyHtml += '<td>' + calendarVisualizer.getHtml(row.day) + '</td>';
        bodyHtml += '<td>' + minutesAsHoursVisualizer.getHtml(row.timeSpent) + '</td>';
        bodyHtml += '<td>' + row.description + '</td>';
        bodyHtml += '<td>' + row.taskTypeName + '</td>';
        bodyHtml += '<td>' + row.taskName + '</td>';
        bodyHtml += '<td>' + getStringFromYearMonthDateTime(row.modifiedAt) + '</td>';
        bodyHtml += '</tr>';
    }
    bodyHtml += '<tr class="dgHighlight"><td colspan="4" style="text-align: center;">&Sigma;</td><td>' + minutesAsHoursVisualizer.getHtml(this.getTotalTimeSpent()) + '</td><td colspan="4"></td></tr>';
    bodyHtml += '</table>';
    $('#' + containerHtmlId + '_body').html(bodyHtml);
}
TimeSheetReport.prototype.getTotalTimeSpent = function() {
    var totalTimeSpent = 0;
    for(var key in this.report.rows) {
        var row = this.report.rows[key];
        if(row.timeSpent != null) {
            totalTimeSpent += row.timeSpent;
        }
    }
    return totalTimeSpent;
}
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function EmployeesForProjectsReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "EmployeesForProjectsReport.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    this.years = [];
    var date = new Date();
    this.loaded = {
        offices: [],
        departments: [],
        subdepartment: []
    }
    this.data = {
        "year" : date.getFullYear(),
        "month" : date.getMonth(),
        "officeId": null,
        "departmentId": null,
        "subdepartmentId": null
    }
    this.reports = {};
}
EmployeesForProjectsReport.prototype.init = function() {
    this.loadInitialContent();
}
EmployeesForProjectsReport.prototype.loadInitialContent = function() {
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
            var startYear = form.data.year;
            if(result.minYear != null && result.minYear < startYear) {
                startYear = result.minYear;
            }
            for(var i = startYear; i <= form.data.year + 1; i++) {
               form.years.push(i);
            }
            form.loaded.offices = result.offices;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeesForProjectsReport.prototype.loadOfficeContent = function() {
    var form = this;
    var data = {};
    data.command = "getOfficeContent";
    data.officeId = this.data.officeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.departments = result.departments;
            form.loaded.subdepartments = [];
            form.updateDepartmentView();
            form.updateSubdepartmentView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeesForProjectsReport.prototype.loadDepartmentContent = function() {
    var form = this;
    var data = {};
    data.command = "getDepartmentContent";
    data.departmentId = this.data.departmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.subdepartments = result.subdepartments;
            form.updateSubdepartmentView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeesForProjectsReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.setHandlers();
}
EmployeesForProjectsReport.prototype.getHtml = function() {
    var html = '';
    html += '<fieldset>';
    html += '<table>';
    html += '<tr><td><span class="label1">Ofice</span></td><td><span class="label1">Department</span></td><td><span class="label1">Subdepartment</span></td></tr>';
    html += '<tr><td><select id="' + this.htmlId + '_office"></select></td><td><select id="' + this.htmlId + '_department"></select></td><td><select id="' + this.htmlId + '_subdepartment"></select></td></tr>';
    html += '</table>';
    html += '<table>';
    html += '<tr><td><span class="label1">Year</span></td><td><span class="label1">Month</span></td></tr>';
    html += '<tr><td><select id="' + this.htmlId + '_year"></select></td><td><select id="' + this.htmlId + '_month"></select></td></tr>';
    html += '<tr><td colspan="2"><input type="button" id="' + this.htmlId + '_generateHTMLBtn' + '" value="Show here"><input type="button" id="' + this.htmlId + '_generateXLSBtn' + '" value="Generate XLS"></td></tr>';
    html += '</table>';
    html += '</fieldset>';
    html += '<div id="' + this.htmlId + '_report"></div>';
    html += '<form id="' + this.htmlId + '_xlsForm' + '" target="_blank" action="' + this.config.endpointUrl + '" method="post">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_command' + '" name="command" value="">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="employeesForProjectsReportForm" value="">';
    html += '</form>';
    return html;
}
EmployeesForProjectsReport.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_office').bind("change", function(event) {form.officeChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_department').bind("change", function(event) {form.departmentChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_subdepartment').bind("change", function(event) {form.subdepartmentChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_year').bind("change", function(event) {form.yearChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_month').bind("change", function(event) {form.monthChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
    $('#' + this.htmlId + '_generateHTMLBtn').bind("click", function(event) {form.startGeneratingHTML.call(form, event)});
}
EmployeesForProjectsReport.prototype.officeChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_office').val();
    if(idTxt == '') {
        this.data.officeId = null;
    } else {
        this.data.officeId = parseInt(idTxt);
    }
    if(this.data.officeId == null) {
        this.loaded.departments = [];
        this.loaded.subdepartments = [];
        this.data.departmentId = null;
        this.data.subdepartmentId = null;
        this.updateDepartmentView();
        this.updateSubdepartmentView();
    } else {
        this.loadOfficeContent();
    }
}
EmployeesForProjectsReport.prototype.departmentChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_department').val();
    if(idTxt == '') {
        this.data.departmentId = null;
    } else {
        this.data.departmentId = parseInt(idTxt);
    }
    if(this.data.departmentId == null) {
        this.loaded.subdepartments = [];
        this.data.subdepartmentId = null;
        this.updateSubdepartmentView();        
    } else {
        this.loadDepartmentContent();
    }
}
EmployeesForProjectsReport.prototype.subdepartmentChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_subdepartment').val();
    if(idTxt == '') {
        this.data.subdepartmentId = null;
    } else {
        this.data.subdepartmentId = parseInt(idTxt);
    }
}
EmployeesForProjectsReport.prototype.yearChangedHandle = function(event) {
    this.data.year = parseInt($('#' + this.htmlId + '_year').val());
}
EmployeesForProjectsReport.prototype.monthChangedHandle = function(event) {
    this.data.month = parseInt($('#' + this.htmlId + '_month').val());
}
EmployeesForProjectsReport.prototype.updateView = function() {
    this.updateOfficeView();
    this.updateDepartmentView();
    this.updateSubdepartmentView();
    this.updateYearView();
    this.updateMonthView();
}
EmployeesForProjectsReport.prototype.updateOfficeView = function() {
   var html = "";
   html += '<option value="">...</option>';
    for(var key in this.loaded.offices) {
        var office = this.loaded.offices[key];
        var isSelected = "";
        if(office.id == this.data.officeId) {
           isSelected = "selected";
        }
        html += '<option value="'+ office.id +'" ' + isSelected + '>' + office.name + '</option>';
    }
    $('#' + this.htmlId + '_office').html(html);
}
EmployeesForProjectsReport.prototype.updateDepartmentView = function() {
   var html = "";
   html += '<option value="">...</option>';
    for(var key in this.loaded.departments) {
        var department = this.loaded.departments[key];
        var isSelected = "";
        if(department.id == this.data.departmentId) {
           isSelected = "selected";
        }
        html += '<option value="'+ department.id +'" ' + isSelected + '>' + department.name + '</option>';
    }
    $('#' + this.htmlId + '_department').html(html);
}
EmployeesForProjectsReport.prototype.updateSubdepartmentView = function() {
    var html = "";
    html += '<option value="">...</option>';
    for(var key in this.loaded.subdepartments) {
        var subdepartment = this.loaded.subdepartments[key];
        var isSelected = "";
        if(subdepartment.id == this.data.subdepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="'+ subdepartment.id +'" ' + isSelected + '>' + subdepartment.name + '</option>';
    }
    $('#' + this.htmlId + '_subdepartment').html(html);
}

EmployeesForProjectsReport.prototype.updateYearView = function() {
    var html = '';
    for(var key in this.years) {
        var year = this.years[key];
        var isSelected = "";
        if(year == this.data.year) {
           isSelected = "selected";
        }
        html += '<option value="' + year + '" ' + isSelected + '>' + year + '</option>';
    }
    $('#' + this.htmlId + '_year').html(html);
}
EmployeesForProjectsReport.prototype.updateMonthView = function() {
    var html = '';
    for(var key in this.months) {
        var month = this.months[key];
        var isSelected = "";
        if(key == this.data.month) {
           isSelected = "selected";
        }
        html += '<option value="' + key + '" ' + isSelected + '>' + month + '</option>';
    }
    $('#' + this.htmlId + '_month').html(html);
}

EmployeesForProjectsReport.prototype.validate = function() {
    var errors = [];
    //if(this.data.subdepartmentId == null) {
    //    errors.push("Subdepartment is not selected");
    //}
    return errors;
}
EmployeesForProjectsReport.prototype.startGeneratingXLS = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
      this.generateXLSReports();
    }
}
EmployeesForProjectsReport.prototype.generateXLSReports = function() {
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReport');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(this.data));
    $('#' + this.htmlId + '_xlsForm').submit();
}
EmployeesForProjectsReport.prototype.startGeneratingHTML = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
      this.generateHTML();
    }
}
EmployeesForProjectsReport.prototype.generateHTML = function() {
    var form = this;
    var data = {};
    data.command = "generateReport";
    data.employeesForProjectsReportForm = getJSON(this.data);
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

EmployeesForProjectsReport.prototype.updateReportView = function(status, comment) {
    if(status == "PROGRESS") {
        $('#' + this.htmlId + '_reportFull').html("In progress...");
    } else if(status == "FAIL") {
        $('#' + this.htmlId + '_reportFull').html(comment);
    } else {
        this.updateReportViewWithContent(this.htmlId + '_report');
    }
}

EmployeesForProjectsReport.prototype.updateReportViewWithContent = function(containerHtmlId) {
    var html = '<table><tr><td id="' + containerHtmlId + '_heading"></td></tr><tr><td id="' + containerHtmlId + '_body"></td></tr></table>';
    $('#' + containerHtmlId).html(html);

    var feesActDatesMaxCount = 0;
    for(var key in this.report.rows) {
        var row = this.report.rows[key];
        if(row.feesActDates.length > feesActDatesMaxCount) {
            feesActDatesMaxCount = row.feesActDates.length;
        }
    }   

    var headingHtml = '';
    headingHtml += '<table class="datagrid">';
    headingHtml += '<tr><td>Year</td><td>' + this.report.formYear + '</td></tr>';
    headingHtml += '<tr><td>Month</td><td>' + this.months[this.report.formMonth] + '</td></tr>';
    headingHtml += '<tr><td>Subdepartment</td><td>' + this.report.formOfficeName + '/' + this.report.formDepartmentName + '/' + this.report.formSubdepartmentName + '</td></tr>';
    headingHtml += '<tr><td>Report Generated at</td><td>' + getStringFromYearMonthDateTime(this.report.createdAt) + '</td></tr>';
    headingHtml += '</table>';
    $('#' + containerHtmlId + '_heading').html(headingHtml);
    
    var bodyHtml = '';
    bodyHtml += '<table class="datagrid">';
    bodyHtml += '<tr class="dgHeader"><td colspan="' + (12 + feesActDatesMaxCount) + '">Employees for Projects Report</td></tr>';
    bodyHtml += '<tr class="dgHeader">';
    bodyHtml += '<td>Office</td><td>Department</td><td>Subdepartment</td><td>ID</td><td>User Name</td><td>First Name</td><td>Last Name</td><td>Full Name (Local Language)</td><td>Project Code</td><td>PC Dead</td><td>Time Spent</td><td>Percentage</td>';
    for(var i = 0; i < feesActDatesMaxCount; i++) {
        bodyHtml += '<td>Fees Act</td>';
    }
    bodyHtml += '</tr>';
    
    var totalTimeSpent = 0;
    var userTotalTimeSpents = this.getUserTotalTimeSpents();
    for(var key in this.report.rows) {
        var row = this.report.rows[key];
        var fullNameLocalLanguage = "";
        if(row.employeeLastNameLocalLanguage != null) {
            fullNameLocalLanguage += row.employeeLastNameLocalLanguage;
        }
        if(row.employeeFirstNameLocalLanguage != null) {
            if(row.employeeLastNameLocalLanguage != null) {
                fullNameLocalLanguage += " ";
            }
            fullNameLocalLanguage += row.employeeFirstNameLocalLanguage;
        }
        if(row.timeSpent != null) {
            totalTimeSpent += row.timeSpent;
        }
        bodyHtml += '<tr>';
        bodyHtml += '<td>' + row.officeName + '</td>';
        bodyHtml += '<td>' + row.departmentName + '</td>';
        bodyHtml += '<td>' + row.subdepartmentName + '</td>';
        bodyHtml += '<td>' + row.employeeId + '</td>';
        bodyHtml += '<td>' + row.employeeUserName + '</td>';
        bodyHtml += '<td>' + row.employeeFirstName + '</td>';
        bodyHtml += '<td>' + row.employeeLastName + '</td>';
        bodyHtml += '<td>' + fullNameLocalLanguage + '</td>';
        if(row.projectCodeCode != null) {
            bodyHtml += '<td>' + row.projectCodeCode + '</td>';
            bodyHtml += '<td>' + booleanVisualizer.getHtml(row.projectCodeIsDead) + '</td>';
        } else {
            bodyHtml += '<td>' + 'Internal' + '</td>';
            bodyHtml += '<td>-</td>';
        }
        bodyHtml += '<td>' + minutesAsHoursVisualizer.getHtml(row.timeSpent) + '</td>';
        bodyHtml += '<td>' + getPercentHtml(row.timeSpent / userTotalTimeSpents[row.employeeId]) + '</td>';
        for(var i = 0; i < feesActDatesMaxCount; i++) {
            bodyHtml += '<td>' + ((row.feesActDates[i] != null) ? getStringFromYearMonthDate(row.feesActDates[i]) : '') + '</td>';
        }
        bodyHtml += '</tr>';
    }
    bodyHtml += '<tr class="dgHighlight">';
    bodyHtml += '<td colspan="10" style="text-align: center;">&Sigma;</td><td>' + minutesAsHoursVisualizer.getHtml(totalTimeSpent) + '</td><td></td>';
    if(feesActDatesMaxCount > 0) {
        bodyHtml += '<td colspan="' + (feesActDatesMaxCount) + '"></td>';
    }
    bodyHtml += '</tr>';
    bodyHtml += '</table>';
    $('#' + containerHtmlId + '_body').html(bodyHtml);
}
EmployeesForProjectsReport.prototype.getUserTotalTimeSpents = function() {
    var userTotalTimeSpents = {};
    for(var key in this.report.rows) {
        var row = this.report.rows[key];
        var id = row.employeeId;
        var timeSpent = row.timeSpent;
        if(userTotalTimeSpents[id] == null) {
            userTotalTimeSpents[id] = timeSpent;
        } else {
            userTotalTimeSpents[id] += timeSpent;
        }
    }
    return userTotalTimeSpents;
}

/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ProductivityAndCompletionReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "ProductivityAndCompletionReport.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.loaded = {
        "offices" : [],
        "departments" : [],
        "subdepartments": []
    }
    this.selected = {
        "officeId" : null,
        "departmentId" : null,
        "subdepartmentId" : null,
        "employeeIds" : []
    }
    this.data = {
        "completionThreshold" : 100,
        "comment" : null,
        "commentColor" : 'red'
    }
    var date = new Date();
    if(date.getDate() > 15) {
        date = new Date(date.getTime() + 16 * 24 * 60 * 60 * 1000);
    }
    var time = {
        year: date.getFullYear(),
        month: date.getMonth(),
        dayOfMonth: 1,
        hour: 18,
        minute: 0,
        second: 0,
    }
    this.data.comment = 'DEADLINE: ' + getStringFromYearMonthDateTime(time);
    this.reports = {};
}
ProductivityAndCompletionReport.prototype.init = function() {
    this.loadInitialContent();
}
ProductivityAndCompletionReport.prototype.loadInitialContent = function() {
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
ProductivityAndCompletionReport.prototype.loadOfficeContent = function() {
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
            form.selected.departmentId = null;
            form.selected.subdepartmentId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProductivityAndCompletionReport.prototype.loadDepartmentContent = function() {
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
            form.selected.subdepartmentId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProductivityAndCompletionReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeDatePickers();
    this.makeSliders();
    this.updateView();
    this.setHandlers();
}
ProductivityAndCompletionReport.prototype.getHtml = function() {
    var html = '';
    html += '<fieldset>';
    html += '<table>';
    html += '<tr><td><span class="label1">Office</span></td><td><span class="label1">Department</span></td><td><span class="label1">Subdepartment</span></td></tr>';
    html += '<tr><td><select id="' + this.htmlId + '_office' + '"></select></td><td><select id="' + this.htmlId + '_department' + '"></select></td><td><select id="' + this.htmlId + '_subdepartment' + '"></select></td></tr>';
    html += '</table>';
    html += '<table>';
    html += '<tr><td><span class="label1">From</span></td><td><span class="label1">To</span></td><td><span class="label1">Completion threshold</span></td></tr>';
    html += '<tr><td><input type="text" id="' + this.htmlId + '_startDate' + '"></td><td><input type="text" id="' + this.htmlId + '_endDate' + '"></td><td style="width: 200px;"><div id="' + this.htmlId + '_completionThresholdSlider"></div></td><td><span id="' + this.htmlId + '_completionThreshold" class="label1"></span></td></tr>';
    html += '<tr><td colspan="2"><input type="button" id="' + this.htmlId + '_generateBtn' + '" value="Generate"> <input type="button" id="' + this.htmlId + '_generateXLSBtn' + '" value="Generate XLS"></td></tr>';
    html += '</table>';
    html += '</fieldset>';
    html += '<div id="' + this.htmlId + '_report"></div>';
    html += '<form id="' + this.htmlId + '_xlsForm' + '" target="_blank" action="' + this.config.endpointUrl + '" method="post">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_command' + '" name="command" value="">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="productivityAndCompletionReportForm" value="">';
    html += '</form>';
    return html;
}
ProductivityAndCompletionReport.prototype.makeDatePickers = function() {
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
ProductivityAndCompletionReport.prototype.makeSliders = function() {
    var form = this;
    $('#' + this.htmlId + '_completionThresholdSlider').slider({
            min: 0,
            max: 100,
            //range: "min",
            //value: 50,
            slide: function( event, ui ) {
                form.data.completionThreshold = ui.value;
                form.updateCompletionThresholdView();
                form.paintCompletionThreshold();
            }
        });
}
ProductivityAndCompletionReport.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_office').bind("change", function(event) {form.officeChangedHandle.call(form)});
    $('#' + this.htmlId + '_department').bind("change", function(event) {form.departmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_subdepartment').bind("change", function(event) {form.subdepartmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_startDate').bind("change", function(event) {form.startDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_endDate').bind("change", function(event) {form.endDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_generateBtn').bind("click", function(event) {form.startGenerating.call(form, event)});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
}
ProductivityAndCompletionReport.prototype.officeChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_office').val();
    if(idTxt == 'ALL') {
        this.selected.officeId = null;
    } else {
        this.selected.officeId = parseInt(idTxt);
    }
    if(this.selected.officeId == null) {
        this.loaded.departments = [];
        this.loaded.subdepartments = [];
        this.selected.departmentId = null;
        this.selected.subdepartmentId = null;
        this.updateDepartmentView();
        this.updateSubdepartmentView();
    } else {
        this.loadOfficeContent();
    }
}
ProductivityAndCompletionReport.prototype.departmentChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_department').val();
    if(idTxt == 'ALL') {
        this.selected.departmentId = null;
    } else {
        this.selected.departmentId = parseInt(idTxt);
    }
    if(this.selected.departmentId == null) {
        this.loaded.subdepartments = [];
        this.selected.subdepartmentId = null;
        this.updateSubdepartmentView();
    } else {
        this.loadDepartmentContent();
    }
}
ProductivityAndCompletionReport.prototype.subdepartmentChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_subdepartment').val();
    if(idTxt == 'ALL') {
        this.selected.subdepartmentId = null;
    } else {
        this.selected.subdepartmentId = parseInt(idTxt);
    }
}
ProductivityAndCompletionReport.prototype.startDateChangedHandle = function(dateText, inst) {
    this.data.startDate = dateText;
}
ProductivityAndCompletionReport.prototype.startDateTextChangedHandle = function(event) {
    this.data.startDate = jQuery.trim(event.currentTarget.value);
}
ProductivityAndCompletionReport.prototype.endDateChangedHandle = function(dateText, inst) {
    this.data.endDate = dateText;
}
ProductivityAndCompletionReport.prototype.endDateTextChangedHandle = function(event) {
    this.data.endDate = jQuery.trim(event.currentTarget.value);
}
ProductivityAndCompletionReport.prototype.employeeClickedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    var index = jQuery.inArray(id, this.selected.employeeIds);
    if(index != -1) {
        this.selected.employeeIds.splice(index, 1);
    } else {
        this.selected.employeeIds.push(id);
    }
    this.updateEmployeesSelection();
}
ProductivityAndCompletionReport.prototype.employeeSelectorClickedHandle = function(event) {
    this.selected.employeeIds = [];
    for(var key in this.report.rows) {
        var row = this.report.rows[key];
        if( $('#' + this.htmlId + '_employeeSelect_' + row.employeeId).is(':checked') ) {
            this.selected.employeeIds.push(row.employeeId);
        }
    }
}
ProductivityAndCompletionReport.prototype.commentChangedHandle = function(event) {
    this.data.comment = jQuery.trim(event.currentTarget.value);
    this.updateCommentView();
}
ProductivityAndCompletionReport.prototype.commentColorChangedHandle = function(event) {
    var commentColor = jQuery.trim(event.currentTarget.value);
    var colors = new Array('', 'black', 'red', 'green', 'yellow', 'blue', 'brown', 'magenta', 'cyan', 'orange', 'violet', 'lilac', 'grey');
    if($.inArray(commentColor, colors) != -1) {
        this.data.commentColor = commentColor;
    }
    this.updateCommentColorView();
}
ProductivityAndCompletionReport.prototype.updateView = function() {
    this.updateOfficeView();
    this.updateDepartmentView();
    this.updateSubdepartmentView();
    this.updateStartDateView();
    this.updateEndDateView();
    this.updateCompletionThresholdView();
}
ProductivityAndCompletionReport.prototype.updateOfficeView = function() {
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
ProductivityAndCompletionReport.prototype.updateDepartmentView = function() {
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
ProductivityAndCompletionReport.prototype.updateSubdepartmentView = function() {
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
ProductivityAndCompletionReport.prototype.updateStartDateView = function() {
    $('#' + this.htmlId + '_startDate').val(this.data.startDate);
}
ProductivityAndCompletionReport.prototype.updateEndDateView = function() {
    $('#' + this.htmlId + '_endDate').val(this.data.endDate);
}
ProductivityAndCompletionReport.prototype.updateCompletionThresholdView = function() {
    $('#' + this.htmlId + '_completionThresholdSlider').slider( "value", this.data.completionThreshold);
    $('#' + this.htmlId + '_completionThreshold').html(this.data.completionThreshold + '%');
}
ProductivityAndCompletionReport.prototype.updateEmployeesSelection = function() {
    for(var key in this.report.rows) {
        var row = this.report.rows[key];;
        var value = false;
        if(jQuery.inArray(row.employeeId, this.selected.employeeIds) != -1) {
            value = true;
        }
        $('#' + this.htmlId + '_employeeSelect_' + row.employeeId).prop("checked", value);
    }    
}
ProductivityAndCompletionReport.prototype.updateCommentView = function() {
    $('#' + this.htmlId + '_comment').val(this.data.comment);    
}
ProductivityAndCompletionReport.prototype.updateCommentColorView = function() {
    $('#' + this.htmlId + '_commentColor').val(this.data.commentColor);  
}

ProductivityAndCompletionReport.prototype.validate = function() {
    var errors = [];
    var startDate = null;
    var endDate = null;
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
    return errors;
}
ProductivityAndCompletionReport.prototype.startGenerating = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        var message = "";
        for(var key in errors) {
            message += errors[key] + "<br />";
        }
        doAlert("Validation error", message, null, null);
    } else {
      this.generate();
    }
}
ProductivityAndCompletionReport.prototype.startGeneratingXLS = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        var message = "";
        for(var key in errors) {
            message += errors[key] + "<br />";
        }
        doAlert("Validation error", message, null, null);
    } else {
      this.generateXLS();
    }
}
ProductivityAndCompletionReport.prototype.generateXLS = function() {
    var serverFormatData = {
        "countryId" : this.selected.countryId,
        "officeId" : this.selected.officeId,
        "departmentId" : this.selected.departmentId,
        "subdepartmentId" : this.selected.subdepartmentId,
        "startDate": getYearMonthDateFromDateString(this.data.startDate),
        "endDate": getYearMonthDateFromDateString(this.data.endDate)
    };
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReport');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(serverFormatData));
    $('#' + this.htmlId + '_xlsForm').submit();
}
ProductivityAndCompletionReport.prototype.generate = function() {
    this.selected.employeeIds = [];
    $('#' + this.htmlId + '_report').html("In progress...");
    var serverFormatData = {
        "countryId" : this.selected.countryId,
        "officeId" : this.selected.officeId,
        "departmentId" : this.selected.departmentId,
        "subdepartmentId" : this.selected.subdepartmentId,
        "startDate": getYearMonthDateFromDateString(this.data.startDate),
        "endDate": getYearMonthDateFromDateString(this.data.endDate)
    };
    var form = this;
    var data = {};
    data.command = "generateReport";
    data.productivityAndCompletionReportForm = getJSON(serverFormatData);
    $.ajax({
        url: this.config.endpointUrl,
        data: data,
        cache: false,
        type: "POST",
        success: function(data){
            ajaxResultHandle(data, form, function(result) {
                form.report = result.report;
                form.calculateTotals();
                form.calculateCompletions();
                form.updateReportView();
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
        }
    });
}
ProductivityAndCompletionReport.prototype.updateReportView = function() {
    var html = '';
    html += '<div id="' + this.htmlId + '_reportHeader"></div>'
    html += '<div id="' + this.htmlId + '_reportBody"></div>'
    $('#' + this.htmlId + '_report').html(html);
    this.updateReportBodyView();
    this.updateReportHeaderView();
}
ProductivityAndCompletionReport.prototype.updateReportBodyView = function() {
    var bodyHtml = '';
    bodyHtml += '<table class="datagrid">';
    bodyHtml += '<tr class="dgHeader"><td colspan="' + (16 + this.report.idleTasks.length) + '">Productivity and Completion Report</td></tr>';
    bodyHtml += '<tr class="dgHeader"><td></td><td>First Name</td><td>Last Name</td><td>Position</td><td>Standard Position</td><td>Subdepartment</td><td>Working Days</td><td>Project Time Spent</td>';
    for(var key in this.report.idleTasks) {
        var idleTask = this.report.idleTasks[key];
        bodyHtml += '<td>' + idleTask.name + '</td>';
    }
    bodyHtml += '<td>Internal Time Spent</td><td>Total Time Spent</td><td>Completion, %</td><td>Productivity, %</td><td>Leave Status</td><td>Entry Date</td><td>Exit Date</td><td>Contract Type</td></tr>';

    var totalAll = 0;
    var notIdleDaysCountAll = 0;
    for(var key in this.report.rows) {
        var row = this.report.rows[key];
        var notIdleDaysCount = row.notIdleDaysCount;
        if(notIdleDaysCount == null) {
            notIdleDaysCount = 0;
        }
        var productivity = '-';
        if(row.projectTimespent + row.notIdleInternalTimespent != 0) {
            productivity = row.projectTimespent / (row.projectTimespent + row.notIdleInternalTimespent);
        }
        notIdleDaysCountAll += notIdleDaysCount;
        totalAll += row.total;
        bodyHtml += '<tr>';
        bodyHtml += '<td><input type="checkbox" id="' + this.htmlId + '_employeeSelect_' + row.employeeId +'"></td>';
        bodyHtml += '<td>' + row.employeeFirstName + '</td>';
        bodyHtml += '<td>' + row.employeeLastName + '</td>';
        bodyHtml += '<td>' + row.positionName + '</td>';
        bodyHtml += '<td>' + row.standardPositionName + '</td>';
        bodyHtml += '<td>' + row.subdepartmentName + '</td>';
        bodyHtml += '<td>' + notIdleDaysCount + '</td>';
        bodyHtml += '<td>' + minutesAsHoursVisualizer.getHtml(row.projectTimespent) + '</td>';
        for(var idleKey in this.report.idleTasks) {
            var idleTask = this.report.idleTasks[idleKey];
            bodyHtml += '<td>' + minutesAsHoursVisualizer.getHtml(row.idleTimespentItems[idleTask.id]) + '</td>';
        }
        bodyHtml += '<td>' + minutesAsHoursVisualizer.getHtml(row.notIdleInternalTimespent) + '</td>';
        bodyHtml += '<td class="dgHighlight">' + minutesAsHoursVisualizer.getHtml(row.total) + '</td>';
        bodyHtml += '<td class="dgHighlight" id="' + this.htmlId + '_completion_' + key + '"><span class="link" id="' + this.htmlId + '_employee_' + row.employeeId + '">' + (row.completion != null ? getPercentHtml(row.completion) : '-') + '</span></td>';
        bodyHtml += '<td class="dgHighlight">' + getPercentHtml(productivity) + '</td>';
        if(row.leavesItemType != null) {
            bodyHtml += '<td>' + row.leavesItemType + '</td>';
        } else {
            bodyHtml += '<td>&nbsp;</td>';
        }
        bodyHtml += '<td>' + calendarVisualizer.getHtml(row.entryDate) + '</td>';
        bodyHtml += '<td>' + calendarVisualizer.getHtml(row.exitDate) + '</td>';
        bodyHtml += '<td>' + row.contractType + (row.partTimePercentage != null ? '/' + row.partTimePercentage : '&nbsp;') + '</td>';
        bodyHtml += '</tr>';
    }

    bodyHtml += '<tr class="dgHighlight"><td colspan="6" style="text-align: center;">&Sigma;</td><td>' + notIdleDaysCountAll + '</td><td>' + minutesAsHoursVisualizer.getHtml(this.getTotalProjectTimeSpent()) + '</td>';
    for(var key in this.report.idleTasks) {
        var idleTask = this.report.idleTasks[key];
        bodyHtml += '<td>' + minutesAsHoursVisualizer.getHtml(this.getTotalIdleTaskTimeSpent(idleTask.id)) + '</td>';
    }
    bodyHtml += '<td>' + minutesAsHoursVisualizer.getHtml(this.getTotalNotIdleInternalTimeSpent()) + '</td>';
    bodyHtml += '<td>' + minutesAsHoursVisualizer.getHtml(totalAll) + '</td>';
    bodyHtml += '<td colspan="6"></td></tr>';
    bodyHtml += '</table>';
    $('#' + this.htmlId + '_reportBody').html(bodyHtml);

    var form = this;
    $('input[id^="' + this.htmlId + '_employeeSelect_"]').bind("click", function(event) {form.employeeSelectorClickedHandle.call(form, event);});
    $('span[id^="' + this.htmlId + '_employee_"]').bind('click', function(event) {form.employeeClickedHandle.call(form, event)});

    this.paintCompletionThreshold();
    this.updateEmployeesSelection();
}
ProductivityAndCompletionReport.prototype.updateReportHeaderView = function() {
    var html = '';
    html += '<button id="' + this.htmlId + '_resetSelectionBtn' + '">Reset selected</button>';
    html += '<button id="' + this.htmlId + '_selectByCompletionThresholdBtn' + '">Select by completion</button>';
    html += '<button id="' + this.htmlId + '_notifyAboutCompletionBtn' + '">Notify about completion</button>';
    $('#' + this.htmlId + '_reportHeader').html(html);
    
    var form = this;
    $('#' + this.htmlId + '_resetSelectionBtn')
      .button({
        icons: {
            primary: "ui-icon-close"
        },
        text: true
        })
      .click(function( event ) {
        form.resetSelection.call(form);
    });    
    $('#' + this.htmlId + '_selectByCompletionThresholdBtn')
      .button({
        icons: {
            primary: "ui-icon-check"
        },
        text: true
        })
      .click(function( event ) {
        form.selectByCompletionThreshold.call(form);
    });    
    $('#' + this.htmlId + '_notifyAboutCompletionBtn')
      .button({
        icons: {
            primary: "ui-icon-mail-closed"
        },
        text: true
        })
      .click(function( event ) {
        form.notifyAboutCompletion.call(form);
    });
}
ProductivityAndCompletionReport.prototype.paintCompletionThreshold = function() {
    if(this.report == null || this.report.rows == null || this.report.rows.length == 0 ) {
        return;
    }
    for(var key in this.report.rows) {
        var row = this.report.rows[key];
        var completion = row.completion;
        if(completion == null) {
            continue;
        }
        if((completion * 100) >= this.data.completionThreshold) {
            $('#' +  this.htmlId + '_completion_' + key).addClass('good');
            $('#' +  this.htmlId + '_completion_' + key).removeClass('bad');            
        } else {
            $('#' +  this.htmlId + '_completion_' + key).addClass('bad');
            $('#' +  this.htmlId + '_completion_' + key).removeClass('good');             
        }
    }    
}
ProductivityAndCompletionReport.prototype.getTotalProjectTimeSpent = function() {
    var total = 0;
    for(var key in this.report.rows) {
        var row = this.report.rows[key];
        if(row.projectTimespent != null) {
            total += row.projectTimespent;
        }
    }
    return total;
}
ProductivityAndCompletionReport.prototype.getTotalNotIdleInternalTimeSpent = function() {
    var total = 0;
    for(var key in this.report.rows) {
        var row = this.report.rows[key];
        if(row.notIdleInternalTimespent != null) {
            total += row.notIdleInternalTimespent;
        }
    }
    return total;
}
ProductivityAndCompletionReport.prototype.getTotalIdleTaskTimeSpent = function(idleTaskId) {
    var total = 0;
    for(var key in this.report.rows) {
        var row = this.report.rows[key];
        if(row.idleTimespentItems != null && row.idleTimespentItems[idleTaskId] != null) {
            total += row.idleTimespentItems[idleTaskId];
        }
    }
    return total;
}
ProductivityAndCompletionReport.prototype.getTotalRowTimeSpent = function(row) {
    var total = 0;
    total += row.projectTimespent;
    for(var idleKey in row.idleTimespentItems) {
        total += row.idleTimespentItems[idleKey];
    }
    total += row.notIdleInternalTimespent;
    return total;
}
ProductivityAndCompletionReport.prototype.getCompletion = function(row) {
    var completion = null;
    var total = row.total;
    if(total == null) {
        total = this.getTotalRowTimeSpent(row);
        row.total = total;
    }
    if(row.workingDaysCount != 0 && row.workingDaysCount != null) {
        completion = total / (row.workingDaysCount * 8 * 60);
        if(row.contractType == 'PART_TIME') {
            completion = 100 * completion / row.partTimePercentage;
        }
    }
    return completion;
}
ProductivityAndCompletionReport.prototype.calculateTotals = function() {
    for(var key in this.report.rows) {
        var row = this.report.rows[key];
        var total = this.getTotalRowTimeSpent(row);
        row.total = total;
    }    
}
ProductivityAndCompletionReport.prototype.calculateCompletions = function() {
    for(var key in this.report.rows) {
        var row = this.report.rows[key];
        var completion = this.getCompletion(row);
        row.completion = completion;
    }        
}
ProductivityAndCompletionReport.prototype.round = function(value) {
    return (parseInt(value * 100) + 0.0)/100
}
ProductivityAndCompletionReport.prototype.resetSelection = function() {
    this.selected.employeeIds = [];
    this.updateEmployeesSelection();
}
ProductivityAndCompletionReport.prototype.selectByCompletionThreshold = function() {
    this.selected.employeeIds = [];
    for(var key in this.report.rows) {
        var row = this.report.rows[key];
        if((row.completion * 100) < this.data.completionThreshold) {
            this.selected.employeeIds.push(row.employeeId);
        }
    }
    this.updateEmployeesSelection();
}
ProductivityAndCompletionReport.prototype.notifyAboutCompletion = function() {
    if(this.selected.employeeIds.length == 0) {
        doAlert('Alert', 'No employee selected', null, null);
    } else {
        doConfirm('Confirm', 'Proceed with sending emails to selected employees?', this, this.showFormToNotifyAboutCompletion, null, null);
    }
}
ProductivityAndCompletionReport.prototype.showFormToNotifyAboutCompletion = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td><span class="label1">Comment color</span><br /><span class="comment1">Optional</span></td><td><input id="' + this.htmlId + '_commentColor"></td></tr>';
    html += '<tr><td><span class="label1">Comment</span><br /><span class="comment1">Optional</span></td><td><textarea id="' + this.htmlId + '_comment" style="width: 300px; height: 100px;"></textarea></td></tr>';
    html += '</table>';
    this.popupHtmlId = getNextPopupHtmlContainer();
    $('#' + this.popupHtmlId).html(html);

    this.updateCommentColorView();
    this.updateCommentView();
    var form = this;
    $('#' + this.htmlId + '_commentColor').bind("change", function(event) {form.commentColorChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_comment').bind("change", function(event) {form.commentChangedHandle.call(form, event)});
    
    $('#' + this.popupHtmlId).dialog({
        title: "Sending completion notification",
        modal: true,
        position: 'center',
        width: 450,
        height: 300,
        buttons: {
            Ok: function() {
                $('#' + form.popupHtmlId).dialog("close");
                form.doNotifyAboutCompletion();
            },
            Cancel: function() {
                $('#' + form.popupHtmlId).dialog("close");
            }
	},
        close: function(event, ui) {
            releasePopupLayer();
        } 
    });    
}
ProductivityAndCompletionReport.prototype.doNotifyAboutCompletion = function() {
    var serverFormatData = {
        "countryId" : this.selected.countryId,
        "officeId" : this.selected.officeId,
        "departmentId" : this.selected.departmentId,
        "subdepartmentId" : this.selected.subdepartmentId,
        "startDate": getYearMonthDateFromDateString(this.data.startDate),
        "endDate": getYearMonthDateFromDateString(this.data.endDate)
    };    
    var form = this;
    var data = {};
    data.command = "notifyAboutCompletion";
    data.employeeIds = getJSON({"list": this.selected.employeeIds});
    data.commentColor = this.data.commentColor;
    data.comment = this.data.comment;
    data.productivityAndCompletionReportForm = getJSON(serverFormatData);
    $.ajax({
        url: this.config.endpointUrl,
        data: data,
        cache: false,
        type: "POST",
        success: function(data){
            ajaxResultHandle(data, form, function(result) {
                form.afterNotifyAboutCompletion(result.passedEmails, result.failedEmails);
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
        }
    });

}
ProductivityAndCompletionReport.prototype.afterNotifyAboutCompletion = function(passedEmails, failedEmails) {
    var message = '<span class="label1">Notification has been sent to the following emails:</span><br />';
    if(passedEmails == null || passedEmails.length == 0) {
         message += 'No entries<br />';
    }
    for(var key in passedEmails) {
        var email = passedEmails[key];
        message += email + '<br />';
    }
    if(failedEmails != null && failedEmails.length > 0) {
        message += '<span class="label1">Sending has failed to the following emails:</span><br />';
        for(var key in failedEmails) {
            var email = failedEmails[key];
            message += email + '<br />';
        }
    }
    showPopup('Success', message, 400, 300, null, null);
}
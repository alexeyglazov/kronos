/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function TrainingReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "TrainingReport.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.data = {
        "startDate" : null,
        "endDate" : null,
        "searchType": null,
        "keyword" : null
    }
    this.searchTypes = {
        "TRAINING" : "Training",
        "KEYWORD" : "Keyword"
    }
    this.report = null;
}
TrainingReport.prototype.init = function() {
    this.show();
}
TrainingReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeDatePickers();
    this.updateView();
    this.setHandlers();
}
TrainingReport.prototype.getHtml = function() {
    var html = '';
    html += '<fieldset>';
    html += '<table>';
    html += '<tr><td><span class="label1">From</span></td><td><input type="text" id="' + this.htmlId + '_startDate' + '"></td></tr>';
    html += '<tr><td><span class="label1">To</span></td><td><input type="text" id="' + this.htmlId + '_endDate' + '"></td></tr>';
    html += '<tr><td><span class="label1">Search Type</span></td><td><select id="' + this.htmlId + '_searchType' + '"></select></td></tr>';
    html += '<tr id="' + this.htmlId + '_keywordBlock' + '"><td><span class="label1">Key word</span></td><td><input type="text" id="' + this.htmlId + '_keyword' + '"></td></tr>';
    html += '<tr><td colspan="2"><input type="button" id="' + this.htmlId + '_generateBtn' + '" value="Generate"><input type="button" id="' + this.htmlId + '_generateXLSBtn' + '" value="Generate XLS"></td></tr>';
    html += '</table>';
    html += '</fieldset>';
    html += '<div id="' + this.htmlId + '_report"></div>';
    html += '<form id="' + this.htmlId + '_xlsForm' + '" target="_blank" action="' + this.config.endpointUrl + '" method="post">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_command' + '" name="command" value="">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="trainingReportForm" value="">';
    html += '</form>';
    return html;
}
TrainingReport.prototype.makeDatePickers = function() {
    var form = this;
    $( '#' + this.htmlId + '_startDate' ).datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.startDateChangedHandle(dateText, inst)}
    });
    $( '#' + this.htmlId + '_endDate' ).datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.endDateChangedHandle(dateText, inst)}
    });
}
TrainingReport.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_startDate').bind("change", function(event) {form.startDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_endDate').bind("change", function(event) {form.endDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_searchType').bind("change", function(event) {form.searchTypeChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_keyword').bind("change", function(event) {form.keywordChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_generateBtn').bind("click", function(event) {form.startGenerating.call(form, event)});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
}
TrainingReport.prototype.startDateChangedHandle = function(dateText, inst) {
    this.data.startDate = dateText;
}
TrainingReport.prototype.startDateTextChangedHandle = function(event) {
    this.data.startDate = jQuery.trim(event.currentTarget.value);
}
TrainingReport.prototype.endDateChangedHandle = function(dateText, inst) {
    this.data.endDate = dateText;
}
TrainingReport.prototype.endDateTextChangedHandle = function(event) {
    this.data.endDate = jQuery.trim(event.currentTarget.value);
}
TrainingReport.prototype.searchTypeChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_searchType').val();
    if(idTxt == 'ALL') {
        this.data.searchType = null;
    } else {
        this.data.searchType = idTxt;
    }
    this.updateSearchTypeView();
}
TrainingReport.prototype.keywordChangedHandle = function(event) {
    this.data.keyword = jQuery.trim(event.currentTarget.value);
    this.updateKeywordView();
}

TrainingReport.prototype.updateView = function() {
    this.updateStartDateView();
    this.updateEndDateView();
    this.updateSearchTypeView();
    this.updateKeywordView();
}
TrainingReport.prototype.updateStartDateView = function() {
    $('#' + this.htmlId + '_startDate').val(this.data.startDate);
}
TrainingReport.prototype.updateEndDateView = function() {
    $('#' + this.htmlId + '_endDate').val(this.data.endDate);
}
TrainingReport.prototype.updateSearchTypeView = function() {
    var html = "";
    html += '<option value="">...</option>';
    for(var key in this.searchTypes) {
        var searchType = this.searchTypes[key];
        var isSelected = "";
        if(key == this.data.searchType) {
           isSelected = "selected";
        }
        html += '<option value="'+ key +'" ' + isSelected + '>' + searchType + '</option>';
    }
    $('#' + this.htmlId + '_searchType').html(html);
    this.data.keyword = '';
    this.updateKeywordView();
    if(this.data.searchType == "KEYWORD") {
        $('#' + this.htmlId + '_keywordBlock').show('fast');
    } else {
        $('#' + this.htmlId + '_keywordBlock').hide('fast');
    }
}
TrainingReport.prototype.updateKeywordView = function() {
    $('#' + this.htmlId + '_keyword').val(this.data.keyword);
}
TrainingReport.prototype.validate = function() {
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
    if(this.data.searchType == null) {
        errors.push("Search Type is not set");
    } else if(this.data.searchType == "KEYWORD") {
        if(this.data.keyword == null || this.data.keyword == "") {
            errors.push("Keyword is not set");
        }
    }
    return errors;
}
TrainingReport.prototype.startGeneratingXLS = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        var message = "";
        for(var key in errors) {
            message += errors[key] + "<br />";
        }
        doAlert("Validation error", message, null, null);
    } else {
      this.generateXLSReports();
    }
}
TrainingReport.prototype.generateXLSReports = function() {
    var serverFormatData = {
        "startDate": getYearMonthDateFromDateString(this.data.startDate),
        "endDate": getYearMonthDateFromDateString(this.data.endDate),
        "searchType": this.data.searchType,
        "keyword": this.data.keyword
    };
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReports');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(serverFormatData));
    $('#' + this.htmlId + '_xlsForm').submit();
}
TrainingReport.prototype.startGenerating = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        var message = "";
        for(var key in errors) {
            message += errors[key] + "<br />";
        }
        doAlert("Validation error", message, null, null);
    } else {
      this.generateReports();
    }
}
TrainingReport.prototype.generateReports = function() {
    var serverFormatData = {
        "startDate": getYearMonthDateFromDateString(this.data.startDate),
        "endDate": getYearMonthDateFromDateString(this.data.endDate),
        "searchType": this.data.searchType,
        "keyword": this.data.keyword
    };
    var form = this;
    var data = {};
    data.command = "generateReports";
    data.trainingReportForm = getJSON(serverFormatData);
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
TrainingReport.prototype.updateReportView = function() {
    var html = '<table><tr><td id="' + this.htmlId + '_heading"></td></tr><tr><td id="' + this.htmlId + '_body"></td></tr></table>';
    $('#' + this.htmlId + '_report').html(html);
    this.updateHeadingView();
    this.updateBodyView();
}
TrainingReport.prototype.updateHeadingView = function() {  
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr><td>Start</td><td>' + calendarVisualizer.getHtml(this.report.formStartDate) + '</td></tr>';
    html += '<tr><td>End</td><td>' + calendarVisualizer.getHtml(this.report.formEndDate) + '</td></tr>';
    html += '<tr><td>Search Type</td><td>' + this.report.formSearchType + '</td></tr>';
    if(this.report.formSearchType == 'KEYWORD') {
        html += '<tr><td>Keyword</td><td>' + this.report.formKeyword + '</td></tr>';
    }
    html += '<tr><td>Report generated at</td><td>' + getStringFromYearMonthDateTime(this.report.createdAt) + '</td></tr>';
    html += '</table>';
    $('#' + this.htmlId + '_heading').html(html);
}
TrainingReport.prototype.updateBodyView = function() { 
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader">';
    html += '<td>Employee</td><td>Office</td><td>Department</td><td>Sub department</td><td>Task</td><td>Time spent</td><td>Day</td><td>Description</td><td>Modified at</td>';
    html += '</tr>';
    for(var rowKey in this.report.rows) {
        var row = this.report.rows[rowKey];
        html += '<tr>';
        html += '<td>' + row.employeeFullName + '</td>';
        html += '<td>' + row.officeName + '</td>';
        html += '<td>' + row.departmentName + '</td>';
        html += '<td>' + row.subdepartmentName + '</td>';
        html += '<td>' + row.taskName + '</td>';
        html += '<td>' + minutesAsHoursVisualizer.getHtml(row.timeSpent) + '</td>';
        html += '<td>' + getStringFromYearMonthDate(row.day) + '</td>';
        html += '<td>' + row.description + '</td>';
        html += '<td>' + getStringFromYearMonthDateTime(row.modifiedAt) + '</td>';
        html += '</tr>';
    }    
    html += '</table>';
    $('#' + this.htmlId + '_body').html(html);
}    

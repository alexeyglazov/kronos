/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function WorkInProgressReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "WorkInProgressReport.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.loaded = {};
    this.moduleName = "Financial Information Report";
    this.projectCodePeriodTypes = {
        "QUARTER" : "Quarter",
        "MONTH" : "Month",
        "DATE" : "Date",
        "COUNTER" : "Counter"
    }
    this.budgetTypes = {
        "NO_BUDGET" : "No budget",
        "FLAT_FEE" : "Flat Fee",
        "TIMESPENT" : "Time Spent",
        "QUOTATION" : "Quotation"
    }
    this.projectCodeYears = [];
    this.data = {
        "endDate" : null,
        "currencyRates" : {},
        "filter": {
            "office": null,
            "department": null,
            "subdepartment": null,
            "activity": null,
            "group": null,
            "client": null,
            "projectCodeYear": null,
            "projectCodePeriodType": null,
            "budgetType": null
        }
    }
    this.reports = {};
}
WorkInProgressReport.prototype.init = function() {
    this.loadInitialContent();
}
WorkInProgressReport.prototype.loadInitialContent = function() {
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
            form.loaded.mainCurrency = result.mainCurrency;
            form.loaded.currencies = result.currencies;
            form.loaded.projectCodeMinYear = result.projectCodeMinYear;

            var currentYear = (new Date()).getFullYear();
            var minYear = form.loaded.projectCodeMinYear;
            var maxYear = currentYear + 1;
            if(minYear == null) {
                minYear = currentYear - 1;
            }
            for(var i = minYear; i <= maxYear; i++ ) {
                form.projectCodeYears.push(i);
            }
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
WorkInProgressReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeDatePickers();
    this.updateView();
    this.setHandlers();
}
WorkInProgressReport.prototype.getHtml = function() {
    var html = '';
    html += '<fieldset>';
    html += '<table>';
    html += '<tr>';
    html += '<td>';

    html += '<table>';
    html += '<tr><td><span class="label1">Date</span></td><td><input type="text" id="' + this.htmlId + '_endDate' + '"></td></tr>';
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        if(currency.id == this.loaded.mainCurrency.id) {
            continue;
        }
        html += '<tr><td><span class="label1">' + this.loaded.mainCurrency.code + '(s) for 1 ' + currency.code + '</span></td><td><input type="text" id="' + this.htmlId + '_currencyRate_' + currency.id + '"></td></tr>';
    }
    html += '<tr><td colspan="2"><input type="button" id="' + this.htmlId + '_generateBtn' + '" value="Generate"><input type="button" id="' + this.htmlId + '_generateXLSBtn' + '" value="Generate XLS"></td></tr>';
    html += '</table>';

    html += '</td>';
    html += '<td>';

    html += '<table>';
    html += '<tr><td><span class="label1">Office</span></td><td><input type="text" id="' + this.htmlId + '_office' + '"></td><td><span class="link" id="' + this.htmlId + '_office_pick"><img src="' + imagePath + '/icons/search.png' + '"></span></td><td><span class="link" id="' + this.htmlId + '_office_clear"><img src="' + imagePath + '/icons/clear.png' + '"></span></td></tr>';
    html += '<tr><td><span class="label1">Department</span></td><td><input type="text" id="' + this.htmlId + '_department' + '"></td><td><span class="link" id="' + this.htmlId + '_department_pick"><img src="' + imagePath + '/icons/search.png' + '"></span></td><td><span class="link" id="' + this.htmlId + '_department_clear"><img src="' + imagePath + '/icons/clear.png' + '"></span></td></tr>';
    html += '<tr><td><span class="label1">Subdepartment</span></td><td><input type="text" id="' + this.htmlId + '_subdepartment' + '"></td><td><span class="link" id="' + this.htmlId + '_subdepartment_pick"><img src="' + imagePath + '/icons/search.png' + '"></span></td><td><span class="link" id="' + this.htmlId + '_subdepartment_clear"><img src="' + imagePath + '/icons/clear.png' + '"></span></td></tr>';
    html += '<tr><td><span class="label1">Activity</span></td><td><input type="text" id="' + this.htmlId + '_activity' + '"></td><td><span class="link" id="' + this.htmlId + '_activity_pick"><img src="' + imagePath + '/icons/search.png' + '"></span></td><td><span class="link" id="' + this.htmlId + '_activity_clear"><img src="' + imagePath + '/icons/clear.png' + '"></span></td></tr>';
    html += '<tr><td><span class="label1">Group</span></td><td><input type="text" id="' + this.htmlId + '_group' + '"></td><td><span class="link" id="' + this.htmlId + '_group_pick"><img src="' + imagePath + '/icons/search.png' + '"></span></td><td><span class="link" id="' + this.htmlId + '_group_clear"><img src="' + imagePath + '/icons/clear.png' + '"></span></td></tr>';
    html += '<tr><td><span class="label1">Client</span></td><td><input type="text" id="' + this.htmlId + '_client' + '"></td><td><span class="link" id="' + this.htmlId + '_client_pick"><img src="' + imagePath + '/icons/search.png' + '"></span></td><td><span class="link" id="' + this.htmlId + '_client_clear"><img src="' + imagePath + '/icons/clear.png' + '"></span></td></tr>';
    html += '<tr><td><span class="label1">Project Code Year</span></td><td><select id="' + this.htmlId + '_projectCodeYear' + '"></select></td><td colspan="2">&nbsp;</td></tr>';
    html += '<tr><td><span class="label1">Project Code Period</span></td><td><select id="' + this.htmlId + '_projectCodePeriodType' + '"></select></td><td colspan="2">&nbsp;</td></tr>';
    html += '<tr><td><span class="label1">Budget Type</span></td><td><select id="' + this.htmlId + '_budgetType' + '"></select></td><td colspan="2">&nbsp;</td></tr>';
    html += '</table>';

    html += '</td>';
    html += '</tr>';
    html += '</table>';



    html += '</fieldset>';
    html += '<div id="' + this.htmlId + '_heading"></div>';
    html += '<div id="' + this.htmlId + '_report"></div>';
    html += '<form id="' + this.htmlId + '_xlsForm' + '" target="_blank" action="' + this.config.endpointUrl + '" method="post">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_command' + '" name="command" value="">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="workInProgressReportForm" value="">';
    html += '</form>';
    html += '<div id="' + this.htmlId + '_info"></div>';
    return html;
}
WorkInProgressReport.prototype.makeDatePickers = function() {
    var form = this;
    $( '#' + this.htmlId + '_endDate' ).datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.endDateChangedHandle(dateText, inst)}
    });
}
WorkInProgressReport.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_endDate').bind("change", function(event) {form.endDateTextChangedHandle.call(form, event)});
    $('input[id^="' + this.htmlId + '_currencyRate_"]').bind("change", function(event) {form.currencyRateChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_generateBtn').bind("click", function(event) {form.startGenerating.call(form, event)});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
    this.setFilterHandlers();
}

WorkInProgressReport.prototype.endDateChangedHandle = function(dateText, inst) {
    this.data.endDate = dateText;
    this.updateEndDateView();
}
WorkInProgressReport.prototype.endDateTextChangedHandle = function(event) {
    this.data.endDate = jQuery.trim(event.currentTarget.value);
    this.updateEndDateView();
}
WorkInProgressReport.prototype.currencyRateChangedHandle = function(event) {
    var currencyRateRE = /^[0-9]*[\.]?[0-9]*$/;
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var currencyId = tmp[tmp.length - 1];
    var value = jQuery.trim(event.currentTarget.value);
    if(value == "") {
        this.data.currencyRates[currencyId] = null;
    } else if(currencyRateRE.test(value)) {
        this.data.currencyRates[currencyId] = parseFloat(value);
    } else {
    }
    this.updateCurrencyRatesView();
}

WorkInProgressReport.prototype.setFilterHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_office_pick').bind("click", function(event) {form.officePickHandle.call(form)});
    $('#' + this.htmlId + '_office_clear').bind("click", function(event) {form.officeClearHandle.call(form)});
    $('#' + this.htmlId + '_department_pick').bind("click", function(event) {form.departmentPickHandle.call(form)});
    $('#' + this.htmlId + '_department_clear').bind("click", function(event) {form.departmentClearHandle.call(form)});
    $('#' + this.htmlId + '_subdepartment_pick').bind("click", function(event) {form.subdepartmentPickHandle.call(form)});
    $('#' + this.htmlId + '_subdepartment_clear').bind("click", function(event) {form.subdepartmentClearHandle.call(form)});
    $('#' + this.htmlId + '_activity_pick').bind("click", function(event) {form.activityPickHandle.call(form)});
    $('#' + this.htmlId + '_activity_clear').bind("click", function(event) {form.activityClearHandle.call(form)});
    $('#' + this.htmlId + '_group_pick').bind("click", function(event) {form.groupPickHandle.call(form)});
    $('#' + this.htmlId + '_group_clear').bind("click", function(event) {form.groupClearHandle.call(form)});
    $('#' + this.htmlId + '_client_pick').bind("click", function(event) {form.clientPickHandle.call(form)});
    $('#' + this.htmlId + '_client_clear').bind("click", function(event) {form.clientClearHandle.call(form)});
    $('#' + this.htmlId + '_projectCodeYear').bind("change", function(event) {form.projectCodeYearChangeHandle.call(form)});
    $('#' + this.htmlId + '_projectCodePeriodType').bind("change", function(event) {form.projectCodePeriodTypeChangeHandle.call(form)});
    $('#' + this.htmlId + '_budgetType').bind("change", function(event) {form.budgetTypeChangeHandle.call(form)});
}
WorkInProgressReport.prototype.officePickHandle = function() {
    this.officePicker = new OfficePicker("officePicker", this.officePicked, this, this.moduleName);
    this.officePicker.init();
}
WorkInProgressReport.prototype.officePicked = function(office) {
    this.data.filter.office = office;
    this.data.filter.department = null;
    this.data.filter.subdepartment = null;
    this.data.filter.activity = null;
    this.updateFilterView();
}
WorkInProgressReport.prototype.officeClearHandle = function() {
    this.data.filter.office = null;
    this.updateOfficeView();
}
WorkInProgressReport.prototype.departmentPickHandle = function() {
    this.departmentPicker = new DepartmentPicker("departmentPicker", this.departmentPicked, this, this.moduleName);
    this.departmentPicker.init();
}
WorkInProgressReport.prototype.departmentPicked = function(department) {
    this.data.filter.office = null;
    this.data.filter.department = department;
    this.data.filter.subdepartment = null;
    this.data.filter.activity = null;
    this.updateFilterView();
}
WorkInProgressReport.prototype.departmentClearHandle = function() {
    this.data.filter.department = null;
    this.updateDepartmentView();
}
WorkInProgressReport.prototype.subdepartmentPickHandle = function() {
    this.subdepartmentPicker = new SubdepartmentPicker("subdepartmentPicker", this.subdepartmentPicked, this, this.moduleName);
    this.subdepartmentPicker.init();
}
WorkInProgressReport.prototype.subdepartmentPicked = function(subdepartment) {
    this.data.filter.office = null;
    this.data.filter.department = null;
    this.data.filter.subdepartment = subdepartment;
    this.data.filter.activity = null;
    this.updateFilterView();
}
WorkInProgressReport.prototype.subdepartmentClearHandle = function() {
    this.data.filter.subdepartment = null;
    this.updateSubdepartmentView();
}
WorkInProgressReport.prototype.activityPickHandle = function() {
    var formData = {
        "mode": 'SINGLE'
    };
    this.activityPicker = new ActivityPicker(formData, "activityPicker", this.activityPicked, this, this.moduleName);
    this.activityPicker.init();
}
WorkInProgressReport.prototype.activityPicked = function(activity) {
    this.data.filter.office = null;
    this.data.filter.department = null;
    this.data.filter.subdepartment = null;
    this.data.filter.activity = activity;
    this.updateFilterView();
}
WorkInProgressReport.prototype.activityClearHandle = function() {
    this.data.filter.activity = null;
    this.updateActivityView();
}
WorkInProgressReport.prototype.groupPickHandle = function() {
    this.groupPicker = new GroupPicker("groupPicker", this.groupPicked, this, this.moduleName);
    this.groupPicker.init();
}
WorkInProgressReport.prototype.groupPicked = function(group) {
    this.data.filter.group = group;
    this.data.filter.client = null;
    this.updateFilterView();
}
WorkInProgressReport.prototype.groupClearHandle = function() {
    this.data.filter.group = null;
    this.updateGroupView();
}
WorkInProgressReport.prototype.clientPickHandle = function() {
    var formData = {
        "mode": 'SINGLE'
    };
    this.clientPicker = new ClientPicker(formData, "clientPicker", this.clientPicked, this, this.moduleName);
    this.clientPicker.init();
}
WorkInProgressReport.prototype.clientPicked = function(client) {
    this.data.filter.group = null;
    this.data.filter.client = client;
    this.updateFilterView();
}
WorkInProgressReport.prototype.clientClearHandle = function() {
    this.data.filter.client = null;
    this.updateClientView();
}
WorkInProgressReport.prototype.projectCodeYearChangeHandle = function() {
    var idTxt = $('#' + this.htmlId + '_projectCodeYear').val();
    if(idTxt == '') {
        this.data.filter.projectCodeYear = null;
    } else {
        this.data.filter.projectCodeYear = parseInt(idTxt);
    }
    this.updateProjectCodeYearView();
}
WorkInProgressReport.prototype.projectCodePeriodTypeChangeHandle = function() {
    var idTxt = $('#' + this.htmlId + '_projectCodePeriodType').val();
    if(idTxt == '') {
        this.data.filter.projectCodePeriodType = null;
    } else {
        this.data.filter.projectCodePeriodType = idTxt;
    }
    this.updateProjectCodePeriodTypeView();
}
WorkInProgressReport.prototype.budgetTypeChangeHandle = function() {
    var idTxt = $('#' + this.htmlId + '_budgetType').val();
    if(idTxt == '') {
        this.data.filter.budgetType = null;
    } else {
        this.data.filter.budgetType = idTxt;
    }
    this.updateBudgetTypeView();
}

WorkInProgressReport.prototype.updateView = function() {
    this.updateEndDateView();
    this.updateCurrencyRatesView();
    this.updateFilterView();
}
WorkInProgressReport.prototype.updateEndDateView = function() {
    $('#' + this.htmlId + '_endDate').val(this.data.endDate);
}
WorkInProgressReport.prototype.updateCurrencyRatesView = function() {
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        if(currency.id == this.loaded.mainCurrency.id) {
            continue;
        }
        $('#' + this.htmlId + '_currencyRate_' + currency.id).val(this.data.currencyRates[currency.id]);
    }
}
WorkInProgressReport.prototype.updateFilterView = function() {
   this.updateOfficeView();
   this.updateDepartmentView();
   this.updateSubdepartmentView();
   this.updateActivityView();
   this.updateGroupView();
   this.updateClientView();
   this.updateProjectCodeYearView();
   this.updateProjectCodePeriodTypeView();
   this.updateBudgetTypeView();
}
// start of filter view update

WorkInProgressReport.prototype.updateOfficeView = function() {
    $('#' + this.htmlId + '_office').attr("disabled", true);
    var officeName = "";
    if(this.data.filter.office != null) {
        officeName = this.data.filter.office.name;
    }
    $('#' + this.htmlId + '_office').val(officeName);
}
WorkInProgressReport.prototype.updateDepartmentView = function() {
    $('#' + this.htmlId + '_department').attr("disabled", true);
    var departmentName = "";
    if(this.data.filter.department != null) {
        departmentName = this.data.filter.department.name;
    }
    $('#' + this.htmlId + '_department').val(departmentName);
}
WorkInProgressReport.prototype.updateSubdepartmentView = function() {
    $('#' + this.htmlId + '_subdepartment').attr("disabled", true);
    var subdepartmentName = "";
    if(this.data.filter.subdepartment != null) {
        subdepartmentName = this.data.filter.subdepartment.name;
    }
    $('#' + this.htmlId + '_subdepartment').val(subdepartmentName);
}
WorkInProgressReport.prototype.updateActivityView = function() {
    $('#' + this.htmlId + '_activity').attr("disabled", true);
    var activityName = "";
    if(this.data.filter.activity != null) {
        activityName = this.data.filter.activity.name;
    }
    $('#' + this.htmlId + '_activity').val(activityName);
}
WorkInProgressReport.prototype.updateGroupView = function() {
    $('#' + this.htmlId + '_group').attr("disabled", true);
    var groupName = "";
    if(this.data.filter.group != null) {
        groupName = this.data.filter.group.name;
    }
    $('#' + this.htmlId + '_group').val(groupName);
}
WorkInProgressReport.prototype.updateClientView = function() {
    $('#' + this.htmlId + '_client').attr("disabled", true);
    var clientName = "";
    if(this.data.filter.client != null) {
        clientName = this.data.filter.client.name;
    }
    $('#' + this.htmlId + '_client').val(clientName);
}
WorkInProgressReport.prototype.updateProjectCodeYearView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    if(this.projectCodeYears != null) {
        for(var key in this.projectCodeYears) {
            var projectCodeYear = this.projectCodeYears[key];
            var isSelected = "";
            if(projectCodeYear == this.data.filter.projectCodeYear) {
               isSelected = "selected";
            }
            html += '<option value="' + projectCodeYear + '" ' + isSelected + '>' + projectCodeYear + '</option>';
        }
    }
    $('#' + this.htmlId + '_projectCodeYear').html(html);
}
WorkInProgressReport.prototype.updateProjectCodePeriodTypeView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.projectCodePeriodTypes) {
        var projectCodePeriodType = this.projectCodePeriodTypes[key];
        var isSelected = "";
        if(key == this.data.filter.projectCodePeriodType) {
           isSelected = "selected";
        }
        html += '<option value="' + key + '" ' + isSelected + '>' + projectCodePeriodType + '</option>';
    }
    $('#' + this.htmlId + '_projectCodePeriodType').html(html);
}
WorkInProgressReport.prototype.updateBudgetTypeView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.budgetTypes) {
        var budgetType = this.budgetTypes[key];
        var isSelected = "";
        if(key == this.data.filter.budgetType) {
           isSelected = "selected";
        }
        html += '<option value="' + key + '" ' + isSelected + '>' + budgetType + '</option>';
    }
    $('#' + this.htmlId + '_budgetType').html(html);
}
// end of filter view update

WorkInProgressReport.prototype.validate = function() {
    var errors = [];
    var endDate = null;
    var numberRE = /^[0-9]*[\.]?[0-9]*$/;
    if(this.data.endDate == null || this.data.endDate == "") {
        errors.push("Date is not set");
    } else if(! isDateValid(this.data.endDate)) {
        errors.push("Date has incorrect format");
    } else {
        endDate = parseDateString(this.data.endDate);
    }
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        if(currency.id == this.loaded.mainCurrency.id) {
            continue;
        }
        var rate = this.data.currencyRates[currency.id];
        if(rate == null || jQuery.trim(rate) == '') {
            errors.push('Rate for ' + currency.code + ' is not set');
        } else if(! numberRE.test(rate)) {
            errors.push('Rate for ' + currency.code + ' is not a number');
        } else if(isNaN(parseFloat(rate))) {
            errors.push('Rate for ' + currency.code + ' is not a number');
        } else if(parseFloat(rate) <= 0) {
            errors.push('Rate for ' + currency.code + ' must be a positive number');
        }
    }
    return errors;
}
WorkInProgressReport.prototype.startGeneratingXLS = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
      this.generateXLSReports();
    }
}
WorkInProgressReport.prototype.getServerFormatData = function() {
    var serverFormatData = {
        "endDate": getYearMonthDateFromDateString(this.data.endDate),
        "currencyRates": this.data.currencyRates,
        "filter" : {}
    };
    if(this.data.filter.office != null) {
        serverFormatData.filter.officeId = this.data.filter.office.id;
    }
    if(this.data.filter.department != null) {
        serverFormatData.filter.departmentId = this.data.filter.department.id;
    }
    if(this.data.filter.subdepartment != null) {
        serverFormatData.filter.subdepartmentId = this.data.filter.subdepartment.id;
    }
    if(this.data.filter.activity != null) {
        serverFormatData.filter.activityId = this.data.filter.activity.id;
    }
    if(this.data.filter.group != null) {
        serverFormatData.filter.groupId = this.data.filter.group.id;
    }
    if(this.data.filter.client != null) {
        serverFormatData.filter.clientId = this.data.filter.client.id;
    }
    serverFormatData.filter.projectCodeYear = this.data.filter.projectCodeYear;
    serverFormatData.filter.projectCodePeriodType = this.data.filter.projectCodePeriodType;
    serverFormatData.filter.budgetType = this.data.filter.budgetType;
    return serverFormatData;
}
WorkInProgressReport.prototype.generateXLSReports = function() {
    var serverFormatData = this.getServerFormatData();
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReports');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(serverFormatData));
    $('#' + this.htmlId + '_xlsForm').submit();
}
WorkInProgressReport.prototype.startGenerating = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
      this.generateReports();
    }
}
WorkInProgressReport.prototype.generateReports = function() {
    var serverFormatData = this.getServerFormatData();
    var form = this;
    var data = {};
    data.command = "generateReports";
    data.workInProgressReportForm = getJSON(serverFormatData);
    $.ajax({
        url: this.config.endpointUrl,
        data: data,
        cache: false,
        type: "POST",
        success: function(data){
            ajaxResultHandle(data, form, function(result) {
                form.workInProgressReport = result.workInProgressReport;
                form.updateReportView();
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
        }
    });
}
WorkInProgressReport.prototype.updateReportView = function() {
    var html = '<table><tr><td id="' + this.htmlId + '_heading"></td></tr><tr><td id="' + this.htmlId + '_body" style="padding-left: 15px;"></td></tr><tr><td id="' + this.htmlId + '_comment" style="padding-left: 15px;"></td></tr></table>';
    $('#' + this.htmlId + '_report').html(html);
    this.updateReportHeaderView();
    this.updateReportBodyView();
}
WorkInProgressReport.prototype.updateReportHeaderView = function() {
    var headingHtml = '';
    headingHtml += '<table class="datagrid">';
    headingHtml += '<tr><td>End Date</td><td>' + calendarVisualizer.getHtml(this.workInProgressReport.endDate) + '</td></tr>';
    for(var key in this.workInProgressReport.currencies) {
        var currency = this.workInProgressReport.currencies[key];
        if(currency.id == this.workInProgressReport.mainCurrency.id) {
            continue;
        }
        headingHtml += '<tr><td>' + currency.code + ' / ' + this.workInProgressReport.mainCurrency.code + '</td><td>' + this.workInProgressReport.currencyRates[currency.id] + '</td></tr>';
    }
    headingHtml += '<tr><td>Report Generated at</td><td>' + this.workInProgressReport.createdAt + '</td></tr>';
    headingHtml += '</table>';
    $('#' + this.htmlId + '_heading').html(headingHtml);    
}
WorkInProgressReport.prototype.updateReportBodyView = function() {
    var html = "";
    //html += '<div style="width: 1000px; height: 41px; overflow: hidden; padding-right: 25px; border-right: 1px solid gray;" id="' + this.htmlId + '_report_header_container"><table class="datagrid nowrap" id="' + this.htmlId + '_report_header"></table></div>';
    //html += '<div style="width: 1000px; height: 500px; overflow : scroll; padding-right: 25px;" id="' + this.htmlId + '_report_body_container">';
    html += '<table class="datagrid nowrap" id="' + this.htmlId + '_report_body">';

    html += this.getHeaderHtml();
    for(var key in this.workInProgressReport.noBudgetSubreports) {
        var noBudgetSubreport = this.workInProgressReport.noBudgetSubreports[key];
        html += this.getNoBudgetSubreportHtml(noBudgetSubreport);
    }
    for(var key in this.workInProgressReport.quotationSubreports) {
        var quotationSubreport = this.workInProgressReport.quotationSubreports[key];
        html += this.getQuotationSubreportHtml(quotationSubreport);
    }
    for(var key in this.workInProgressReport.flatFeeSubreports) {
        var flatFeeSubreport = this.workInProgressReport.flatFeeSubreports[key];
        html += this.getFlatFeeSubreportHtml(flatFeeSubreport);
    }
    for(var key in this.workInProgressReport.timeSpentSubreports) {
        var timeSpentSubreport = this.workInProgressReport.timeSpentSubreports[key];
        html += this.getTimeSpentSubreportHtml(timeSpentSubreport);
    }
    html += '</table>';
    html += '</div>';
    $('#' + this.htmlId + '_body').html(html);
    $('#' + this.htmlId + '_report_body').treeTable({
        expandable: true
    });
    //this.makeHeader();
}
WorkInProgressReport.prototype.getHeaderHtml = function() {
    var html = "";
    html += '<tr class="dgHeader"><td colspan="' + 24 + '">Work In Progress Report</td></tr>';
    html += '<tr class="dgHeader">';
    html += '<td>Group</td>';
    html += '<td>Client</td>';
    html += '<td>Code</td>';
    html += '<td>Start</td>';
    html += '<td>End</td>';
    html += '<td>Budget Type</td>';
    html += '<td>Position</td>';
    html += '<td>Standard Position</td>';
    html += '<td>Budgeted hours</td>';
    html += '<td>Standard Rate</td>';
    for(var key in this.workInProgressReport.currencies) {
        var currency = this.workInProgressReport.currencies[key];
        html += '<td>' + currency.code + '</td>';
    }
    html += '<td>Ccy Rate</td>';
    html += '<td>Cv ' + this.workInProgressReport.mainCurrency.code + '</td>';
    html += '<td>Spent Hours</td>';
    html += '<td>Prorata</td>';
    html += '<td>Limited to budget</td>';
    html += '<td>Ccy Rate</td>';
    html += '<td>WIP ' + this.workInProgressReport.mainCurrency.code + '</td>';
    html += '<td>Achieved</td>';
    html += '<td>Remaining Time</td>';
    html += '</tr>';
    return html;
}
WorkInProgressReport.prototype.getNoBudgetSubreportHtml = function(subreport) {
    var html = "";
    var spentTimeTotal = 0;
    var standardRateActualAverage = 0;
    var wipCVTotal = 0;

    for(var key2 in subreport.rows) {
        var row = subreport.rows[key2];
        var standardRate = row.averageCvStandardSellingRate;
        var spentTime = row.spentTime;
        var wipCV = standardRate * spentTime / 60;
        spentTimeTotal += spentTime;
        wipCVTotal += wipCV;
    }
    standardRateActualAverage = 60 * wipCVTotal / spentTimeTotal;
    html += '<tr class="dgHighlight" id="' + this.htmlId + '_subtotal_' + subreport.projectCodeId + '">';
    html += '<td>' + subreport.groupName + '</td>';
    html += '<td>' + subreport.clientName + '</td>';
    html += '<td>' + subreport.code + '</td>';
    html += '<td>' + calendarVisualizer.getHtml(subreport.projectCodeStart) + '</td>';
    html += '<td>' + calendarVisualizer.getHtml(subreport.projectCodeEnd) + '</td>';
    html += '<td>No Budget</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>&nbsp;</td>';
    for(var i=0; i<this.workInProgressReport.currencies.length; i++) {
        html += '<td>&nbsp;</td>';
    }
    html += '<td>&nbsp;</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>' + minutesAsHoursVisualizer.getHtml(spentTimeTotal) + '</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>' + getRoundHtml(standardRateActualAverage) + '</td>';
    html += '<td>' + getRoundHtml(wipCVTotal) + '</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>&nbsp;</td>';
    html += '</tr>';
    
    for(var key2 in subreport.rows) {
        var row = subreport.rows[key2];
        var standardRate = row.averageCvStandardSellingRate;
        var spentTime = row.spentTime;
        var wipCV = standardRate * spentTime / 60;
        html += '<tr class="child-of-' + this.htmlId + '_subtotal_' + subreport.projectCodeId + '">';
        html += '<td></td><td></td><td></td><td></td><td></td><td></td>';
        html += '<td>' + row.positionName + '</td>';
        html += '<td>' + row.standardPositionName + '</td>';
        for(var i=0; i<(4 + this.workInProgressReport.currencies.length); i++) {
            html += '<td></td>';
        }
        html += '<td>' + minutesAsHoursVisualizer.getHtml(spentTime) + '</td>';
        html += '<td></td><td></td>';
        html += '<td>' + getRoundHtml(standardRate) + '</td>';
        html += '<td>' + getRoundHtml(wipCV) + '</td>';
        html += '<td></td><td></td>';
        html += '</tr>';
    }
    return html;
}
WorkInProgressReport.prototype.getQuotationSubreportHtml = function(subreport) {
    var html = "";
    var budgetTimeTotal = 0;
    var standardRateBudgetAverage = 0;
    var subtotal = 0;
    var subtotalCV = 0;
    var spentTimeTotal = 0;
    var prorataTotal = null;
    var limitedToBudgetTotal = 0;
    var standardRateActualAverage = 0;
    var wipCVTotal = 0;
    var achivedTotal = 0;
    var remainingTimeTotal = 0;
    var discount = 0;
    var discountedWipCVTotal = 0;
    var quotationSellingRateCurrencyRate = 1;
    var invoiceCurrencyRate = 1;
    var negociatedCV;
    
    if(subreport.quotationSellingRateCurrencyId == this.workInProgressReport.mainCurrency.id) {
        quotationSellingRateCurrencyRate = 1;
    } else {
        for(var currencyId in this.workInProgressReport.currencyRates) {
            if(subreport.quotationSellingRateCurrencyId == parseInt(currencyId)) {
                quotationSellingRateCurrencyRate = this.workInProgressReport.currencyRates[currencyId];
                break;
            }
        }
    }   
    if(subreport.invoiceCurrencyId == this.workInProgressReport.mainCurrency.id) {
        invoiceCurrencyRate = 1;
    } else {
        for(var currencyId in this.workInProgressReport.currencyRates) {
            if(subreport.invoiceCurrencyId == parseInt(currencyId)) {
                invoiceCurrencyRate = this.workInProgressReport.currencyRates[currencyId];
                break;
            }
        }
    }   
    negociatedCV = invoiceCurrencyRate*subreport.negociated;
    for(var key2 in subreport.rows) {
        var row = subreport.rows[key2];
        var budgetTime = row.positionQuotationTime;
        var quotationStandardRate = row.positionQuotationRate;
        var averageCvStandardSellingRate = row.averageCvStandardSellingRate;
        var sellingValue = budgetTime * quotationStandardRate / 60;
        var sellingValueCV = sellingValue * quotationSellingRateCurrencyRate;
        var spentTime = row.spentTime;
        var prorata = (budgetTime != null && budgetTime != 0) ? spentTime / budgetTime : null;
        var limitedToBudget = budgetTime < spentTime ? budgetTime : spentTime;
        var wipCV = averageCvStandardSellingRate * limitedToBudget / 60;
        var remainingTime = budgetTime - spentTime;
        budgetTimeTotal += budgetTime;
        subtotal += sellingValue;
        subtotalCV += sellingValueCV;
        spentTimeTotal += spentTime;
        limitedToBudgetTotal += limitedToBudget;
        wipCVTotal += wipCV;
        remainingTimeTotal += remainingTime;
    }    
    standardRateBudgetAverage = 60 * subtotal / budgetTimeTotal;
    prorataTotal = (budgetTimeTotal != 0) ? spentTimeTotal / budgetTimeTotal : null;
    standardRateActualAverage = 60 * wipCVTotal / limitedToBudgetTotal;
    achivedTotal = wipCVTotal/subtotalCV;
    discount = 1 - negociatedCV/subtotalCV;
    discountedWipCVTotal = wipCVTotal*(1 - discount);
    
    html += '<tr class="dgHighlight" id="' + this.htmlId + '_subtotal_' + subreport.projectCodeId + '">';
    html += '<td>' + subreport.groupName + '</td>';
    html += '<td>' + subreport.clientName + '</td>';
    html += '<td>' + subreport.code + '</td>';
    html += '<td>' + calendarVisualizer.getHtml(subreport.projectCodeStart) + '</td>';
    html += '<td>' + calendarVisualizer.getHtml(subreport.projectCodeEnd) + '</td>';
    html += '<td>Quotation</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>' + minutesAsHoursVisualizer.getHtml(budgetTimeTotal) + '</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>&nbsp;</td>';
    for(var key in this.workInProgressReport.currencies) {
        var currency = this.workInProgressReport.currencies[key];
        if(currency.id == subreport.invoicingCurrencyId) {
            html += '<td>' + getRoundHtml(subreport.negociated) + '</td>';
        } else {
            html += '<td>&nbsp;</td>';
        }
    }
    html += '<td>' + invoiceCurrencyRate + '</td>';
    html += '<td>' + negociatedCV  + '</td>';
    html += '<td>' + minutesAsHoursVisualizer.getHtml(spentTimeTotal) + '</td>';
    html += '<td>' + (prorataTotal != null ? getPercentHtml(prorataTotal) : '') + '</td>';
    html += '<td>' + minutesAsHoursVisualizer.getHtml(limitedToBudgetTotal) + '</td>';
    html += '<td>' + getRoundHtml(standardRateActualAverage) + '</td>';
    html += '<td>' + getRoundHtml(discountedWipCVTotal) + '</td>';
    html += '<td>' + getPercentHtml(achivedTotal)  + '</td>';
    html += '<td>' + minutesAsHoursVisualizer.getHtml(remainingTimeTotal) + '</td>';
    html += '</tr>';
    

    
    for(var key2 in subreport.rows) {
        var row = subreport.rows[key2];
        var budgetTime = row.positionQuotationTime;
        var quotationStandardRate = row.positionQuotationRate;
        var averageCvStandardSellingRate = row.averageCvStandardSellingRate;
        var sellingValue = budgetTime * quotationStandardRate / 60;
        var sellingValueCV = sellingValue * quotationSellingRateCurrencyRate;
        var spentTime = row.spentTime;
        var prorata = (budgetTime != null && budgetTime != 0) ? spentTime / budgetTime : null;
        var limitedToBudget = budgetTime < spentTime ? budgetTime : spentTime;
        var wipCV = averageCvStandardSellingRate * limitedToBudget / 60;
        var remainingTime = budgetTime - spentTime;
        
        html += '<tr class="child-of-' + this.htmlId + '_subtotal_' + subreport.projectCodeId + '">';
        html += '<td></td>';
        html += '<td></td>';
        html += '<td></td>';
        html += '<td></td>';
        html += '<td></td>';
        html += '<td></td>';
        html += '<td>' + row.positionName + '</td>';
        html += '<td>' + row.standardPositionName + '</td>';
        html += '<td>' + minutesAsHoursVisualizer.getHtml(budgetTime) + '</td>';
        html += '<td>' + quotationStandardRate + '</td>';
        for(var key in this.workInProgressReport.currencies) {
            var currency = this.workInProgressReport.currencies[key];
            if(currency.id == subreport.standardSellingRateCurrencyId) {
                html += '<td>' + getRoundHtml(sellingValue) + '</td>';
            } else {
                html += '<td>&nbsp;</td>';
            }
        }
        html += '<td>' + invoiceCurrencyRate + '</td>';
        html += '<td>' + getRoundHtml(sellingValueCV) + '</td>';
        html += '<td>' + minutesAsHoursVisualizer.getHtml(spentTime) + '</td>';
        html += '<td>' + (prorata != null ? getPercentHtml(prorata) : '') + '</td>';
        html += '<td>' + minutesAsHoursVisualizer.getHtml(limitedToBudget) + '</td>';
        html += '<td>' + averageCvStandardSellingRate + '</td>';
        html += '<td>' + getRoundHtml(wipCV) + '</td>';
        html += '<td>&nbsp;</td>';
        html += '<td>' + minutesAsHoursVisualizer.getHtml(remainingTime) + '</td>';
        html += '</tr>';
    }

    html += '<tr class="child-of-' + this.htmlId + '_subtotal_' + subreport.projectCodeId + '">';
    html += '<td>&nbsp;</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>' + minutesAsHoursVisualizer.getHtml(budgetTimeTotal) + '</td>';
    html += '<td>' + getRoundHtml(standardRateBudgetAverage) + '</td>';
    for(var key in this.workInProgressReport.currencies) {
        var currency = this.workInProgressReport.currencies[key];
        if(currency.id == subreport.standardSellingRateCurrencyId) {
            html += '<td>' + getRoundHtml(subtotal) + '</td>';
        } else {
            html += '<td>&nbsp;</td>';
        }
    }
    html += '<td>' + invoiceCurrencyRate + '</td>';
    html += '<td>' + subtotalCV + '</td>';
    html += '<td>' + minutesAsHoursVisualizer.getHtml(spentTimeTotal) + '</td>';
    html += '<td>' + getPercentHtml(prorataTotal) + '</td>';
    html += '<td>' + minutesAsHoursVisualizer.getHtml(limitedToBudgetTotal) + '</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>' + getRoundHtml(wipCVTotal) + '</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>' + minutesAsHoursVisualizer.getHtml(remainingTimeTotal) + '</td>';
    html += '</tr>';

    html += '<tr class="child-of-' + this.htmlId + '_subtotal_' + subreport.projectCodeId + '">';
    for(var i=0; i<( 10 + this.workInProgressReport.currencies.length); i++) {
        html += '<td>&nbsp;</td>';
    }
    html += '<td>Discount rate</td>';
    html += '<td>' + getPercentHtml(discount) + '</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>Discount rate</td>';
    html += '<td>' + getPercentHtml(discount) + '</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>&nbsp;</td>';
    html += '</tr>';

    return html;
}
WorkInProgressReport.prototype.getFlatFeeSubreportHtml = function(subreport) {
    var html = "";
    var subtotal = subreport.total;
    var spentTimeTotal = 0;
    var prorataTotal = 0;
    var standardRateActualAverage = 0;
    var wipCVTotal = 0;
    var achivedTotal = 0;
    var totalAmountToMainCurrencyRate = 1;
    
    if(subreport.totalCurrencyId != this.workInProgressReport.mainCurrency.id) {
        for(var currencyId in this.workInProgressReport.currencyRates) {
            if(subreport.totalCurrencyId == parseInt(currencyId)) {
                totalAmountToMainCurrencyRate = this.workInProgressReport.currencyRates[currencyId];
                break;
            }
        }
    }
    var subtotalCV = subtotal * totalAmountToMainCurrencyRate;

    for(var key2 in subreport.rows) {
        var row = subreport.rows[key2];
        var standardRate = row.averageCvStandardSellingRate;
        var spentTime = row.spentTime;
        var wipCV = standardRate * spentTime / 60;
        spentTimeTotal += spentTime;
        wipCVTotal += wipCV;
    }
    var endDate = new Date(this.workInProgressReport.endDate.year, this.workInProgressReport.endDate.month, this.workInProgressReport.endDate.dayOfMonth, 0, 0, 0, 0);
    var start = null;
    if(subreport.projectCodeStart != null) {
        new Date(subreport.projectCodeStart.year, subreport.projectCodeStart.month, subreport.projectCodeStart.dayOfMonth, 0, 0, 0, 0);
    }
    
    var end = null;
    if(subreport.projectCodeEnd != null) {
        new Date(subreport.projectCodeEnd.year, subreport.projectCodeEnd.month, subreport.projectCodeEnd.dayOfMonth, 0, 0, 0, 0);
    }
    if(endDate != null && start != null && end != null) {
        prorataTotal = (endDate.getTime() - start.getTime())/(end.getTime() - start.getTime());
    }
    standardRateActualAverage = 60 * wipCVTotal / spentTimeTotal;
    achivedTotal = wipCVTotal/subtotalCV;
    html += '<tr class="dgHighlight" id="' + this.htmlId + '_subtotal_' + subreport.projectCodeId + '">';
    html += '<td>' + subreport.groupName + '</td>';
    html += '<td>' + subreport.clientName + '</td>';
    html += '<td>' + subreport.code + '</td>';
    html += '<td>' + calendarVisualizer.getHtml(subreport.projectCodeStart) + '</td>';
    html += '<td>' + calendarVisualizer.getHtml(subreport.projectCodeEnd) + '</td>';
    html += '<td>Flat Fee</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>&nbsp;</td>';
    for(var key in this.workInProgressReport.currencies) {
        var currency = this.workInProgressReport.currencies[key];
        if(currency.id == subreport.totalCurrencyId) {
            html += '<td>' + getRoundHtml(subtotal) + '</td>';
        } else {
            html += '<td>&nbsp;</td>';
        }
    }
    html += '<td>' + totalAmountToMainCurrencyRate + '</td>';
    html += '<td>' + getRoundHtml(subtotalCV) + '</td>';
    html += '<td>' + minutesAsHoursVisualizer.getHtml(spentTimeTotal) + '</td>';
    html += '<td>' + getPercentHtml(prorataTotal)  + '</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>' + getRoundHtml(standardRateActualAverage) + '</td>';
    html += '<td>' + getRoundHtml(wipCVTotal) + '</td>';
    html += '<td>' + getPercentHtml(achivedTotal)  + '</td>';
    html += '<td>&nbsp;</td>';
    html += '</tr>';

    for(var key2 in subreport.rows) {
        var row = subreport.rows[key2];
        var standardRate = row.averageCvStandardSellingRate;
        var spentTime = row.spentTime;
        var wipCV = standardRate * spentTime / 60;
        html += '<tr class="child-of-' + this.htmlId + '_subtotal_' + subreport.projectCodeId + '">';
        html += '<td></td>';
        html += '<td></td>';
        html += '<td></td>';
        html += '<td></td>';
        html += '<td></td>';
        html += '<td></td>';
        html += '<td>' + row.positionName + '</td>';
        html += '<td>' + row.standardPositionName + '</td>';
        for(var i=0; i<(4 + this.workInProgressReport.currencies.length); i++) {
            html += '<td></td>';
        }
        html += '<td>' + minutesAsHoursVisualizer.getHtml(spentTime) + '</td>';
        html += '<td>&nbsp;</td>';
        html += '<td>&nbsp;</td>';
        html += '<td>' + getRoundHtml(standardRate) + '</td>';
        html += '<td>' + getRoundHtml(wipCV) + '</td>';
        html += '<td>&nbsp;</td>';
        html += '<td>&nbsp;</td>';
        html += '</tr>';
    }
    return html;
}
WorkInProgressReport.prototype.getTimeSpentSubreportHtml = function(subreport) {
    var html = "";
    var subtotal = subreport.total;
    var spentTimeTotal = 0;
    var standardRateActualAverage = 0;
    var wipCVTotal = 0;
    var achivedTotal = 0;
    var totalAmountToMainCurrencyRate = 1;

    if(subreport.totalCurrencyId != this.workInProgressReport.mainCurrency.id) {
        for(var currencyId in this.workInProgressReport.currencyRates) {
            if(subreport.totalCurrencyId == parseInt(currencyId)) {
                totalAmountToMainCurrencyRate = this.workInProgressReport.currencyRates[currencyId];
                break;
            }
        }
    }
    var subtotalCV = subtotal * totalAmountToMainCurrencyRate;
    var minimizedSubtotalCV = subtotalCV;
    for(var key2 in subreport.rows) {
        var row = subreport.rows[key2];
        var standardRate = row.averageCvStandardSellingRate;
        var spentTime = row.spentTime;
        var wipCV = standardRate * spentTime / 60;
        spentTimeTotal += spentTime;
        wipCVTotal += wipCV;
    }
    if(wipCVTotal < minimizedSubtotalCV) {
        minimizedSubtotalCV = wipCVTotal;
    }
    standardRateActualAverage = 60 * wipCVTotal / spentTimeTotal;
    achivedTotal = wipCVTotal/minimizedSubtotalCV;
    html += '<tr class="dgHighlight" id="' + this.htmlId + '_subtotal_' + subreport.projectCodeId + '">';
    html += '<td>' + subreport.groupName + '</td>';
    html += '<td>' + subreport.clientName + '</td>';
    html += '<td>' + subreport.code + '</td>';
    html += '<td>' + calendarVisualizer.getHtml(subreport.projectCodeStart) + '</td>';
    html += '<td>' + calendarVisualizer.getHtml(subreport.projectCodeEnd) + '</td>';
    html += '<td>Time spent</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>&nbsp;</td>';
    for(var key in this.workInProgressReport.currencies) {
        var currency = this.workInProgressReport.currencies[key];
        if(currency.id == subreport.totalCurrencyId) {
            html += '<td>' + getRoundHtml(subtotal) + '</td>';
        } else {
            html += '<td>&nbsp;</td>';
        }
    }
    html += '<td>' + totalAmountToMainCurrencyRate + '</td>';
    html += '<td>' + getRoundHtml(minimizedSubtotalCV) + '</td>';
    html += '<td>' + minutesAsHoursVisualizer.getHtml(spentTimeTotal) + '</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>&nbsp;</td>';
    html += '<td>' + getRoundHtml(standardRateActualAverage) + '</td>';
    html += '<td>' + getRoundHtml(wipCVTotal) + '</td>';
    html += '<td>' + getPercentHtml(achivedTotal)  + '</td>';
    html += '<td>&nbsp;</td>';
    html += '</tr>';
    
    for(var key2 in subreport.rows) {
        var row = subreport.rows[key2];
        var standardRate = row.averageCvStandardSellingRate;
        var spentTime = row.spentTime;
        var wipCV = standardRate * spentTime / 60;
        html += '<tr class="child-of-' + this.htmlId + '_subtotal_' + subreport.projectCodeId + '">';
        html += '<td>&nbsp;</td>';
        html += '<td>&nbsp;</td>';
        html += '<td>&nbsp;</td>';
        html += '<td>&nbsp;</td>';
        html += '<td>&nbsp;</td>';
        html += '<td>&nbsp;</td>';
        html += '<td>' + row.positionName + '</td>';
        html += '<td>' + row.standardPositionName + '</td>';
        for(var i=0; i<(4 + this.workInProgressReport.currencies.length); i++) {
            html += '<td></td>';
        }
        html += '<td>' + minutesAsHoursVisualizer.getHtml(spentTime) + '</td>';
        html += '<td>&nbsp;</td>';
        html += '<td>&nbsp;</td>';
        html += '<td>' + getRoundHtml(standardRate) + '</td>';
        html += '<td>' + getRoundHtml(wipCV) + '</td>';
        html += '<td>&nbsp;</td>';
        html += '<td>&nbsp;</td>';
        html += '</tr>';
    }
    return html;
}
WorkInProgressReport.prototype.makeHeader = function() {
    var form = this;
    $('#' + this.htmlId + '_report_body_container').bind('scroll', function(event) {
        var a = $(event.currentTarget).scrollLeft();
        $('#' + form.htmlId + '_report_header_container').scrollLeft(a);
    });

    var headerCellWidths = [];
    $('#' + this.htmlId + '_report_body tr.dgHeader:last td').each(function(index) {
        headerCellWidths[index] = $(this).width();
    });
    var width = $('#' + this.htmlId + '_report_body').width();
    $('#' + this.htmlId + '_report_header').width(width);
    $('#' + this.htmlId + '_report_body').width(width);

    $('#' + this.htmlId + '_report_body tr.dgHeader').clone().appendTo($('#' + this.htmlId + '_report_header'));
    for(var index in headerCellWidths) {
        var headerCellWidth = headerCellWidths[index];
        $($('#' + this.htmlId + '_report_header tr:last td')[index]).width(headerCellWidth);
    };
    $('#' + this.htmlId + '_report_body tr.dgHeader').remove();
    for(var index in headerCellWidths) {
        var headerCellWidth = headerCellWidths[index];
        $($('tr[id^="' + this.htmlId + '_subtotal_"]:first td')[index]).width(headerCellWidth);
    };
}
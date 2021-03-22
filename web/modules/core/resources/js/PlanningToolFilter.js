/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function PlanningToolFilter(htmlId, filter, callback, callbackContext) {
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.callback = callback;
    this.callbackContext = callbackContext;
    if(filter != null) {
        this.filter = filter;
    } else {
        this.filter = this.getDefaultFilter()
    }
}
PlanningToolFilter.prototype.getDefaultFilter = function() {
    return {
        "subdepartment": null
    }
}
PlanningToolFilter.prototype.normalizeFilter = function(obj) {
    var normalizedFilter = {
        "subdepartment": obj.subdepartment
    }
    return normalizedFilter;
}
PlanningToolFilter.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.show();
}
PlanningToolFilter.prototype.getLayoutHtml = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td>Field Name</td><td>Filter</td></tr>';
    html += '<tr><td>Subdepartment</td><td><input type="text" id="' + this.htmlId + '_subdepartment_name"><button id="' + this.htmlId + '_subdepartment_pick">Pick</button><button id="' + this.htmlId + '_subdepartment_clear">Clear</button></td></tr>';
    html += '</table>';
    return html;
}
PlanningToolFilter.prototype.show = function() {
    var title = 'Filter data'
    var form = this;
    $('#' + this.containerHtmlId).html(this.getLayoutHtml());
    this.setHandlers();
    this.makeButtons();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 400,
        height: 500,
        buttons: {
            OK: function() {
                form.okHandle.call(form);
                $(this).dialog( "close" );
            },
            Cancel: function() {
                $(this).dialog( "close" );
                $('#' + form.containerHtmlId).html("");
            }
	},
        close: function(event, ui) {
            releasePopupLayer();
        } 
    });
    this.makeDatePickers();
    this.updateView();
}
PlanningToolFilter.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_year').bind("change", function(event) {form.yearChangedHandle.call(form)});
    $('#' + this.htmlId + '_financialYear').bind("change", function(event) {form.financialYearChangedHandle.call(form)});
    $('#' + this.htmlId + '_isClosed').bind("change", function(event) {form.isClosedChangedHandle.call(form)});
    $('#' + this.htmlId + '_isFuture').bind("change", function(event) {form.isFutureChangedHandle.call(form)});
    $('#' + this.htmlId + '_isDead').bind("change", function(event) {form.isDeadChangedHandle.call(form)});
    $('#' + this.htmlId + '_periodType').bind("change", function(event) {form.periodTypeChangedHandle.call(form)});
    $('#' + this.htmlId + '_periodQuarter').bind("change", function(event) {form.periodQuarterChangedHandle.call(form)});
    $('#' + this.htmlId + '_periodMonth').bind("change", function(event) {form.periodMonthChangedHandle.call(form)});
    $('#' + this.htmlId + '_periodDate').bind("change", function(event) {form.periodDateChangedHandle.call(form)});
    $('#' + this.htmlId + '_periodCounter').bind("change", function(event) {form.periodCounterChangedHandle.call(form)});

    $('#' + this.htmlId + '_createdAt_from').bind("change", function(event) {form.createdAtFromChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_createdAt_to').bind("change", function(event) {form.createdAtToChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_closedAt_from').bind("change", function(event) {form.closedAtFromChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_closedAt_to').bind("change", function(event) {form.closedAtToChangedHandle.call(form, event)});

    $('#' + this.htmlId + '_startDate_from').bind("change", function(event) {form.startDateFromChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_startDate_to').bind("change", function(event) {form.startDateToChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_endDate_from').bind("change", function(event) {form.endDateFromChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_endDate_to').bind("change", function(event) {form.endDateToChangedHandle.call(form, event)});
    
}
PlanningToolFilter.prototype.makeButtons = function() {
    var form = this;
    $('#' + this.htmlId + '_client_pick')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.clientPickHandle.call(form, event);
    });    
    $('#' + this.htmlId + '_client_clear')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.clientClearHandle.call(form, event);
    });    
    $('#' + this.htmlId + '_office_pick')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.officePickHandle.call(form, event);
    });    
    $('#' + this.htmlId + '_office_clear')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.officeClearHandle.call(form, event);
    });    
    $('#' + this.htmlId + '_subdepartment_pick')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.subdepartmentPickHandle.call(form, event);
    });    
    $('#' + this.htmlId + '_subdepartment_clear')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.subdepartmentClearHandle.call(form, event);
    });    
    $('#' + this.htmlId + '_activity_pick')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.activityPickHandle.call(form, event);
    });    
    $('#' + this.htmlId + '_activity_clear')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.activityClearHandle.call(form, event);
    });    
    $('#' + this.htmlId + '_inChargePerson_pick')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.inChargePersonPickHandle.call(form, event);
    });    
    $('#' + this.htmlId + '_inChargePerson_clear')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.inChargePersonClearHandle.call(form, event);
    });    
}
PlanningToolFilter.prototype.makeDatePickers = function() {
    var form = this;
    $('#' + this.htmlId + '_createdAt_from').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.createdAtFromSelectHandle(dateText, inst)}
    });
    $( '#' + this.htmlId + '_createdAt_to').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.createdAtToSelectHandle(dateText, inst)}
    });

    $('#' + this.htmlId + '_closedAt_from').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.closedAtFromSelectHandle(dateText, inst)}
    });
    $('#' + this.htmlId + '_closedAt_to').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.closedAtToSelectHandle(dateText, inst)}
    });

    $('#' + this.htmlId + '_startDate_from').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.startDateFromSelectHandle(dateText, inst)}
    });
    $('#' + this.htmlId + '_startDate_to').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.startDateToSelectHandle(dateText, inst)}
    });

    $('#' + this.htmlId + '_endDate_from').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.endDateFromSelectHandle(dateText, inst)}
    });
    $('#' + this.htmlId + '_endDate_to').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.endDateToSelectHandle(dateText, inst)}
    });

}



PlanningToolFilter.prototype.clientPickHandle = function() {
    var formData = {
        "mode": 'SINGLE'
    };
    this.clientPicker = new ClientPicker(formData, "clientPicker", this.clientPicked, this, this.moduleName);
    this.clientPicker.init();
}
PlanningToolFilter.prototype.clientPicked = function(client) {
    this.filter.client = client;
    this.updateClientView();
}
PlanningToolFilter.prototype.clientClearHandle = function() {
    this.filter.client = null;
    this.updateClientView();
}
PlanningToolFilter.prototype.officePickHandle = function() {
    this.officePicker = new OfficePicker("officePicker", this.officePicked, this, this.moduleName);
    this.officePicker.init();
}
PlanningToolFilter.prototype.officePicked = function(office) {
    this.filter.office = office;
    this.updateOfficeView();
}
PlanningToolFilter.prototype.officeClearHandle = function() {
    this.filter.office = null;
    this.updateOfficeView();
}
PlanningToolFilter.prototype.subdepartmentPickHandle = function() {
    this.subdepartmentPicker = new SubdepartmentPicker("subdepartmentPicker", this.subdepartmentPicked, this, this.moduleName);
    this.subdepartmentPicker.init();
}
PlanningToolFilter.prototype.subdepartmentPicked = function(subdepartment) {
    this.filter.subdepartment = subdepartment;
    this.updateSubdepartmentView();
}
PlanningToolFilter.prototype.subdepartmentClearHandle = function() {
    this.filter.subdepartment = null;
    this.updateSubdepartmentView();
}
PlanningToolFilter.prototype.activityPickHandle = function() {
    var formData = {
        "mode": 'SINGLE'
    };
    this.activityPicker = new ActivityPicker(formData, "activityPicker", this.activityPicked, this, this.moduleName);
    this.activityPicker.init();
}
PlanningToolFilter.prototype.activityPicked = function(activity) {
    this.filter.activity = activity;
    this.updateActivityView();
}
PlanningToolFilter.prototype.activityClearHandle = function() {
    this.filter.activity = null;
    this.updateActivityView();
}
PlanningToolFilter.prototype.yearChangedHandle = function(event) {
    this.filter.year = jQuery.trim($('#' + this.htmlId + '_year').val());
    if(this.filter.year == "") {
        this.filter.year = null;
    }
    this.updateYearView();    
}
PlanningToolFilter.prototype.financialYearChangedHandle = function(event) {
    this.filter.financialYear = $('#' + this.htmlId + '_financialYear').val();
    if(this.filter.financialYear == "") {
        this.filter.financialYear = null;
    }
    this.updateFinancialYearView();
}
PlanningToolFilter.prototype.createdAtFromSelectHandle = function(dateText, inst) {
    if(dateText != null && jQuery.trim(dateText) != "") {
        this.filter.createdAtRange.from = getYearMonthDateFromDateString(jQuery.trim(dateText));
    } else {
        this.filter.createdAtRange.from = null;
    }
    this.updateCreatedAtView();
}
PlanningToolFilter.prototype.createdAtFromChangedHandle = function(event) {
    var dateText = $(event.currentTarget).val();
    if(dateText.trim() != "") {
        this.filter.createdAtRange.from = getYearMonthDateFromDateString(dateText);
    } else {
        this.filter.createdAtRange.from = null;
    }
    this.updateCreatedAtView();
}
PlanningToolFilter.prototype.createdAtToSelectHandle = function(dateText, inst) {
    if(dateText != null && jQuery.trim(dateText) != "") {
        this.filter.createdAtRange.to = getYearMonthDateFromDateString(jQuery.trim(dateText));
    } else {
        this.filter.createdAtRange.to = null;
    }
    this.updateCreatedAtView();
}
PlanningToolFilter.prototype.createdAtToChangedHandle = function(event) {
    var dateText = $(event.currentTarget).val();
    if(dateText.trim() != "") {
        this.filter.createdAtRange.to = getYearMonthDateFromDateString(dateText);
    } else {
        this.filter.createdAtRange.to = null;
    }
    this.updateCreatedAtView();
}
PlanningToolFilter.prototype.closedAtFromSelectHandle = function(dateText, inst) { 
    if(dateText != null && jQuery.trim(dateText) != "") {
        this.filter.closedAtRange.from = getYearMonthDateFromDateString(jQuery.trim(dateText));
    } else {
        this.filter.closedAtRange.from = null;
    }
    this.updateCreatedAtView();
}
PlanningToolFilter.prototype.closedAtFromChangedHandle = function(event) {
    var dateText = $(event.currentTarget).val();
    if(dateText.trim() != "") {
        this.filter.closedAtRange.from = getYearMonthDateFromDateString(dateText);
    } else {
        this.filter.closedAtRange.from = null;
    }
    this.updateClosedAtView();
}
PlanningToolFilter.prototype.closedAtToSelectHandle = function(dateText, inst) {
    if(dateText != null && jQuery.trim(dateText) != "") {
        this.filter.closedAtRange.to = getYearMonthDateFromDateString(jQuery.trim(dateText));
    } else {
        this.filter.closedAtRange.to = null;
    }
    this.updateCreatedAtView();
}
PlanningToolFilter.prototype.closedAtToChangedHandle = function(event) {
    var dateText = $(event.currentTarget).val();
    if(dateText.trim() != "") {
        this.filter.closedAtRange.to = getYearMonthDateFromDateString(dateText);
    } else {
        this.filter.closedAtRange.to = null;
    }
    this.updateClosedAtView();
}
PlanningToolFilter.prototype.startDateFromSelectHandle = function(dateText, inst) {
    if(dateText.trim() != "") {
        this.filter.startDateRange.from = getYearMonthDateFromDateString(dateText);
    } else {
        this.filter.startDateRange.from = null;
    }
    this.updateStartDateView();
}
PlanningToolFilter.prototype.startDateFromChangedHandle = function(event) {
    var dateText = $(event.currentTarget).val();
    if(dateText.trim() != "") {
        this.filter.startDateRange.from = getYearMonthDateFromDateString(dateText);
    } else {
        this.filter.startDateRange.from = null;
    }
    this.updateStartDateView();
}
PlanningToolFilter.prototype.startDateToSelectHandle = function(dateText, inst) {
    if(dateText.trim() != "") {
        this.filter.startDateRange.to = getYearMonthDateFromDateString(dateText);
    } else {
        this.filter.startDateRange.to = null;
    }
    this.updateStartDateView();
}
PlanningToolFilter.prototype.startDateToChangedHandle = function(event) {
    var dateText = $(event.currentTarget).val();
    if(dateText.trim() != "") {
        this.filter.startDateRange.to = getYearMonthDateFromDateString(dateText);
    } else {
        this.filter.startDateRange.to = null;
    }
    this.updateStartDateView();
}
PlanningToolFilter.prototype.endDateFromSelectHandle = function(dateText, inst) {
    if(dateText.trim() != "") {
        this.filter.endDateRange.from = getYearMonthDateFromDateString(dateText);
    } else {
        this.filter.endDateRange.from = null;
    }
    this.updateEndDateView();
}
PlanningToolFilter.prototype.endDateFromChangedHandle = function(event) {
    var dateText = $(event.currentTarget).val();
    if(dateText.trim() != "") {
        this.filter.endDateRange.from = getYearMonthDateFromDateString(dateText);
    } else {
        this.filter.endDateRange.from = null;
    }
    this.updateEndDateView();
}

PlanningToolFilter.prototype.endDateToSelectHandle = function(dateText, inst) {
    if(dateText.trim() != "") {
        this.filter.endDateRange.to = getYearMonthDateFromDateString(dateText);
    } else {
        this.filter.endDateRange.to = null;
    }
    this.updateEndDateView();
}
PlanningToolFilter.prototype.endDateToChangedHandle = function(event) {
    var dateText = $(event.currentTarget).val();
    if(dateText.trim() != "") {
        this.filter.endDateRange.to = getYearMonthDateFromDateString(dateText);
    } else {
        this.filter.endDateRange.to = null;
    }
    this.updateEndDateView();
}
PlanningToolFilter.prototype.isClosedChangedHandle = function(event) {
    this.filter.isClosed = $('#' + this.htmlId + '_isClosed').val();
    this.updateIsClosedView();
}
PlanningToolFilter.prototype.inChargePersonPickHandle = function() {
    this.employeePicker = new EmployeePicker("employeePicker", this.inChargePersonPicked, this, this.moduleName);
    this.employeePicker.init();
}
PlanningToolFilter.prototype.inChargePersonPicked = function(inChargePerson) {
    this.filter.inChargePerson = inChargePerson;
    this.updateInChargePersonView();
}
PlanningToolFilter.prototype.inChargePersonClearHandle = function() {
    this.filter.inChargePerson = null;
    this.updateInChargePersonView();
}

PlanningToolFilter.prototype.isFutureChangedHandle = function(event) {
    this.filter.isFuture = $('#' + this.htmlId + '_isFuture').val();
    this.updateIsFutureView();
}
PlanningToolFilter.prototype.isDeadChangedHandle = function(event) {
    this.filter.isDead = $('#' + this.htmlId + '_isDead').val();
    this.updateIsDeadView();
}
PlanningToolFilter.prototype.periodTypeChangedHandle = function(event) {
    this.filter.periodType = $('#' + this.htmlId + '_periodType').val();
    this.updatePeriodTypeView();
}
PlanningToolFilter.prototype.periodQuarterChangedHandle = function(event) {
    this.filter.periodQuarter = $('#' + this.htmlId + '_periodQuarter').val();
    this.updatePeriodQuarterView();
}
PlanningToolFilter.prototype.periodMonthChangedHandle = function(event) {
    this.filter.periodMonth = $('#' + this.htmlId + '_periodMonth').val();
    this.updatePeriodMonthView();
}
PlanningToolFilter.prototype.periodDateChangedHandle = function(event) {
    this.filter.periodDate = $('#' + this.htmlId + '_periodDate').val();
    this.updatePeriodDateView();
}
PlanningToolFilter.prototype.periodCounterChangedHandle = function(event) {
    this.filter.periodCounter = jQuery.trim($('#' + this.htmlId + '_periodCounter').val());
    if(this.filter.periodCounter == "") {
        this.filter.periodCounter = null;
    }
    this.updatePeriodCounterView();
}



PlanningToolFilter.prototype.updateView = function() {
    this.updateClientView();
    this.updateOfficeView();
    this.updateSubdepartmentView();
    this.updateActivityView();
    this.updateYearView();
    this.updateFinancialYearView();
    this.updateIsClosedView();
    this.updateIsFutureView();
    this.updateIsDeadView();
    this.updateInChargePersonView();
    this.updatePeriodTypeView();
    this.updatePeriodQuarterView();
    this.updatePeriodMonthView();
    this.updatePeriodDateView();
    this.updatePeriodCounterView();

    this.updateCreatedAtView();
    this.updateClosedAtView();
    this.updateStartDateView();
    this.updateEndDateView();
    this.updateFinancialYearView();
}
PlanningToolFilter.prototype.updateClientView = function() {
    $('#' + this.htmlId + '_client_name').attr("disabled", true);
    if(this.filter.client != null) {
        $('#' + this.htmlId + '_client_name').val(this.filter.client.name);
    } else {
        $('#' + this.htmlId + '_client_name').val("");
    }
}
PlanningToolFilter.prototype.updateOfficeView = function() {
    $('#' + this.htmlId + '_office_name').attr("disabled", true);
    if(this.filter.office != null) {
        $('#' + this.htmlId + '_office_name').val(this.filter.office.name);
    } else {
        $('#' + this.htmlId + '_office_name').val("");
    }
}
PlanningToolFilter.prototype.updateSubdepartmentView = function() {
    $('#' + this.htmlId + '_subdepartment_name').attr("disabled", true);
    if(this.filter.subdepartment != null) {
        $('#' + this.htmlId + '_subdepartment_name').val(this.filter.subdepartment.name);
    } else {
        $('#' + this.htmlId + '_subdepartment_name').val("");
    }
}
PlanningToolFilter.prototype.updateActivityView = function() {
    $('#' + this.htmlId + '_activity_name').attr("disabled", true);
    if(this.filter.activity != null) {
        $('#' + this.htmlId + '_activity_name').val(this.filter.activity.name);
    } else {
        $('#' + this.htmlId + '_activity_name').val("");
    }
}
PlanningToolFilter.prototype.updateYearView = function() {
    $('#' + this.htmlId + '_year').val(this.filter.year);
}
PlanningToolFilter.prototype.updateFinancialYearView = function() {
    var html = "";
    html += '<option value="">...</option>';
    for(var key in this.financialYears) {
        var financialYear = this.financialYears[key];
        var isSelected = "";
        if(key == this.filter.financialYear) {
            isSelected = "selected";
        }
        html += '<option value="'+ key +'" ' + isSelected + '>' + financialYear + '</option>';
    }
    $('#' + this.htmlId + '_financialYear').html(html);
}
PlanningToolFilter.prototype.updateCreatedAtView = function() {
    $('#' + this.htmlId + '_createdAt_from').val(getStringFromYearMonthDate(this.filter.createdAtRange.from));
    $('#' + this.htmlId + '_createdAt_to').val(getStringFromYearMonthDate(this.filter.createdAtRange.to));
}
PlanningToolFilter.prototype.updateClosedAtView = function() {
    $('#' + this.htmlId + '_closedAt_from').val(getStringFromYearMonthDate(this.filter.closedAtRange.from));
    $('#' + this.htmlId + '_closedAt_to').val(getStringFromYearMonthDate(this.filter.closedAtRange.to));
}
PlanningToolFilter.prototype.updateStartDateView = function() {
    $('#' + this.htmlId + '_startDate_from').val(getStringFromYearMonthDate(this.filter.startDateRange.from));
    $('#' + this.htmlId + '_startDate_to').val(getStringFromYearMonthDate(this.filter.startDateRange.to));
}
PlanningToolFilter.prototype.updateEndDateView = function() {
    $('#' + this.htmlId + '_endDate_from').val(getStringFromYearMonthDate(this.filter.endDateRange.from));
    $('#' + this.htmlId + '_endDate_to').val(getStringFromYearMonthDate(this.filter.endDateRange.to));
}
PlanningToolFilter.prototype.updateIsClosedView = function() {
    var options = {"ALL": "All", "TRUE": "True", "FALSE": "False"}
    this.updateSelectorView(this.htmlId + '_isClosed', this.filter.isClosed, options);
}
PlanningToolFilter.prototype.updateIsFutureView = function() {
    var options = {"ALL": "All", "TRUE": "True", "FALSE": "False"}
    this.updateSelectorView(this.htmlId + '_isFuture', this.filter.isFuture, options);
}
PlanningToolFilter.prototype.updateIsDeadView = function() {
    var options = {"ALL": "All", "TRUE": "True", "FALSE": "False"}
    this.updateSelectorView(this.htmlId + '_isDead', this.filter.isDead, options);
}
PlanningToolFilter.prototype.updateInChargePersonView = function() {
    $('#' + this.htmlId + '_inChargePerson_userName').attr("disabled", true);
    if(this.filter.inChargePerson != null) {
        $('#' + this.htmlId + '_inChargePerson_userName').val(this.filter.inChargePerson.userName);
    } else {
        $('#' + this.htmlId + '_inChargePerson_userName').val("");
    }
}
PlanningToolFilter.prototype.updatePeriodTypeView = function() {
    var options = {"ALL": "All", "QUARTER": "Quarter", "MONTH": "Month", "DATE": "Date", "COUNTER": "Counter"}
    this.updateSelectorView(this.htmlId + '_periodType', this.filter.periodType, options);
}
PlanningToolFilter.prototype.updatePeriodQuarterView = function() {
    var options = {"ALL": "All", "FIRST": "First", "SECOND": "Second", "THIRD": "Third", "FOURTH": "Fourth"}
    this.updateSelectorView(this.htmlId + '_periodQuarter', this.filter.periodQuarter, options);
}
PlanningToolFilter.prototype.updatePeriodMonthView = function() {
    var options = {"ALL": "All", "JANUARY": "January", "FEBRUARY": "February", "MARCH": "March", "APRIL": "April", "MAY": "May", "JUNE": "June", "JULY": "July", "AUGUST": "August", "SEPTEMBER": "September", "OCTOBER": "October", "NOVEMBER": "November", "DECEMBER": "December"}
    this.updateSelectorView(this.htmlId + '_periodMonth', this.filter.periodMonth, options);
}
PlanningToolFilter.prototype.updatePeriodDateView = function() {
    var options = {"ALL": "All", "D3101": "3101", "D2802": "2802", "D3103": "3103", "D3004": "3004", "D3105": "3105", "D3006": "3006", "D3107": "3107", "D3108": "3108", "D3009": "3009", "D3110": "3110", "D3011": "3011", "D3112": "3112"}
    this.updateSelectorView(this.htmlId + '_periodDate', this.filter.periodDate, options);
}
PlanningToolFilter.prototype.updatePeriodCounterView = function() {
    $('#' + this.htmlId + '_periodCounter').val(this.filter.periodCounter);
}
PlanningToolFilter.prototype.updateSelectorView = function(id, value, options) {
    var html = '';
    for(var key in options) {
        var isSelected = '';
        if(key == value) {
            isSelected = 'selected';
        }
        html += '<option ' + isSelected + ' value="' + key + '">' + options[key] + '</option>';
    }
    $("#" + id).html(html);
}
PlanningToolFilter.prototype.okHandle = function() {
    this.callback.call(this.callbackContext, this.filter);
}
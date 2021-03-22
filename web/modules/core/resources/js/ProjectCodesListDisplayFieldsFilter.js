/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ProjectCodesListDisplayFieldsFilter(htmlId, moduleName, displayFields, callback, callbackContext) {
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.moduleName = moduleName;
    this.callback = callback;
    this.callbackContext = callbackContext;
    if(displayFields != null) {
        this.displayFields = displayFields;
    } else {
        this.displayFields = this.getDefaultDisplayFields();
    }    
}
ProjectCodesListDisplayFieldsFilter.prototype.getDefaultDisplayFields = function() {
    return {
        "id": true,
        "code": true,
        "client": true,
        "office": true,
        "subdepartment": true,
        "activity": true,
        "year": false,
        "financialYear": false,
        "periodType": false,
        "periodQuarter": false,
        "periodMonth": false,
        "periodDate": false,
        "periodCounter": false,
        "description": true,
        "comment": false,
        "createdAt": true,
        "createdBy": false,
        "isClosed": false,
        "closedAt": true,
        "closedBy" : false,
        "inChargePerson" : false,
        "inChargePartner" : false,
        "startDate": false,
        "endDate": false,
        "isFuture" : false,
        "isDead" : false,
        "isHidden" : false,
        "conflictStatus" : false
    }
}
ProjectCodesListDisplayFieldsFilter.prototype.normalizeDisplayFields = function(obj) {
    return {
        "id": obj.id,
        "code": obj.code,
        "client": obj.client,
        "office": obj.office,
        "subdepartment": obj.subdepartment,
        "activity": obj.activity,
        "year": obj.year,
        "financialYear": obj.financialYear,
        "periodType": obj.periodType,
        "periodQuarter": obj.periodQuarter,
        "periodMonth": obj.periodMonth,
        "periodDate": obj.periodDate,
        "periodCounter": obj.periodCounter,
        "description": obj.description,
        "comment": obj.comment,
        "createdAt": obj.createdAt,
        "createdBy": obj.createdBy,
        "isClosed": obj.isClosed,
        "closedAt": obj.closedAt,
        "closedBy" : obj.closedBy,
        "inChargePerson" : obj.inChargePerson,
        "inChargePartner" : obj.inChargePartner,
        "startDate": obj.startDate,
        "endDate": obj.endDate,
        "isFuture" : obj.isFuture,
        "isDead" : obj.isDead,
        "isHidden" : obj.isHidden,
        "conflictStatus" : obj.conflictStatus
    }
}
ProjectCodesListDisplayFieldsFilter.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.show();
}
ProjectCodesListDisplayFieldsFilter.prototype.getLayoutHtml = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td>Field Name</td><td>Show</td></tr>';
    html += '<tr><td>ID</td><td><input type="checkbox" id="' + this.htmlId + '_id_display"></td></tr>';
    html += '<tr><td>Code</td><td><input type="checkbox" id="' + this.htmlId + '_code_display"></td></tr>';
    html += '<tr><td>Client</td><td><input type="checkbox" id="' + this.htmlId + '_client_display"></td></tr>';
    html += '<tr><td>Office</td><td><input type="checkbox" id="' + this.htmlId + '_office_display"></td></tr>';
    html += '<tr><td>Subdepartment</td><td><input type="checkbox" id="' + this.htmlId + '_subdepartment_display"></td></tr>';
    html += '<tr><td>Activity</td><td><input type="checkbox" id="' + this.htmlId + '_activity_display"></td></tr>';
    html += '<tr><td>Year</td><td><input type="checkbox" id="' + this.htmlId + '_year_display"></td></tr>';
    html += '<tr><td>Financial Year</td><td><input type="checkbox" id="' + this.htmlId + '_financialYear_display"></td></tr>';
    html += '<tr><td>Period Type</td><td><input type="checkbox" id="' + this.htmlId + '_periodType_display"></td></tr>';
    html += '<tr><td>Quarter</td><td><input type="checkbox" id="' + this.htmlId + '_periodQuarter_display"></td></tr>';
    html += '<tr><td>Month</td><td><input type="checkbox" id="' + this.htmlId + '_periodMonth_display"></td></tr>';
    html += '<tr><td>Date</td><td><input type="checkbox" id="' + this.htmlId + '_periodDate_display"></td></tr>';
    html += '<tr><td>Counter</td><td><input type="checkbox" id="' + this.htmlId + '_periodCounter_display"></td></tr>';
    html += '<tr><td>Start</td><td><input type="checkbox" id="' + this.htmlId + '_startDate_display"></td></tr>';
    html += '<tr><td>End</td><td><input type="checkbox" id="' + this.htmlId + '_endDate_display"></td></tr>';
    html += '<tr><td>Description</td><td><input type="checkbox" id="' + this.htmlId + '_description_display"></td></tr>';
    html += '<tr><td>Comment</td><td><input type="checkbox" id="' + this.htmlId + '_comment_display"></td></tr>';
    html += '<tr><td>Created At</td><td><input type="checkbox" id="' + this.htmlId + '_createdAt_display"></td></tr>';
    html += '<tr><td>Created by</td><td><input type="checkbox" id="' + this.htmlId + '_createdBy_display"></td></tr>';
    html += '<tr><td>Closed</td><td><input type="checkbox" id="' + this.htmlId + '_isClosed_display"></td></tr>';
    html += '<tr><td>Closed at</td><td><input type="checkbox" id="' + this.htmlId + '_closedAt_display"></td></tr>';
    html += '<tr><td>Closed by</td><td><input type="checkbox" id="' + this.htmlId + '_closedBy_display"></td></tr>';
    html += '<tr><td>Person in charge</td><td><input type="checkbox" id="' + this.htmlId + '_inChargePerson_display"></td></tr>';
    html += '<tr><td>Partner in charge</td><td><input type="checkbox" id="' + this.htmlId + '_inChargePartner_display"></td></tr>';
    html += '<tr><td>Future</td><td><input type="checkbox" id="' + this.htmlId + '_isFuture_display"></td></tr>';
    html += '<tr><td>Dead</td><td><input type="checkbox" id="' + this.htmlId + '_isDead_display"></td></tr>';
    html += '<tr><td>Hidden</td><td><input type="checkbox" id="' + this.htmlId + '_isHidden_display"></td></tr>';
    html += '<tr><td>Conflict status</td><td><input type="checkbox" id="' + this.htmlId + '_conflictStatus_display"></td></tr>';
    html += '</table>';
    return html;
}
ProjectCodesListDisplayFieldsFilter.prototype.show = function() {
    var title = 'Display fields'
    var form = this;
    $('#' + this.containerHtmlId).html(this.getLayoutHtml());
    this.setHandlers();
    this.makeButtons();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 250,
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
ProjectCodesListDisplayFieldsFilter.prototype.setHandlers = function() {
    var form = this;   
    $('#' + this.htmlId + '_id_display').bind("click", function(event) {form.idDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_code_display').bind("click", function(event) {form.codeDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_client_display').bind("click", function(event) {form.clientDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_office_display').bind("click", function(event) {form.officeDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_subdepartment_display').bind("click", function(event) {form.subdepartmentDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_activity_display').bind("click", function(event) {form.activityDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_year_display').bind("click", function(event) {form.yearDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_financialYear_display').bind("click", function(event) {form.financialYearDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_periodType_display').bind("click", function(event) {form.periodTypeDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_periodQuarter_display').bind("click", function(event) {form.periodQuarterDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_periodMonth_display').bind("click", function(event) {form.periodMonthDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_periodDate_display').bind("click", function(event) {form.periodDateDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_periodCounter_display').bind("click", function(event) {form.periodCounterDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_startDate_display').bind("click", function(event) {form.startDateDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_endDate_display').bind("click", function(event) {form.endDateDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_description_display').bind("click", function(event) {form.descriptionDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_comment_display').bind("click", function(event) {form.commentDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_createdAt_display').bind("click", function(event) {form.createdAtDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_createdBy_display').bind("click", function(event) {form.createdByDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_isClosed_display').bind("click", function(event) {form.isClosedDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_closedAt_display').bind("click", function(event) {form.closedAtDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_closedBy_display').bind("click", function(event) {form.closedByDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_inChargePerson_display').bind("click", function(event) {form.inChargePersonDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_inChargePartner_display').bind("click", function(event) {form.inChargePartnerDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_isFuture_display').bind("click", function(event) {form.isFutureDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_isDead_display').bind("click", function(event) {form.isDeadDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_isHidden_display').bind("click", function(event) {form.isHiddenDisplayChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_conflictStatus_display').bind("click", function(event) {form.conflictStatusDisplayChangedHandle.call(form, event)});
}
ProjectCodesListDisplayFieldsFilter.prototype.makeButtons = function() {
    var form = this;
}
ProjectCodesListDisplayFieldsFilter.prototype.makeDatePickers = function() {
    var form = this;
}


ProjectCodesListDisplayFieldsFilter.prototype.idDisplayChangedHandle = function(event) {
    this.displayFields.id = $('#' + this.htmlId + '_id_display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.codeDisplayChangedHandle = function(event) {
    this.displayFields.code = $('#' + this.htmlId + '_code_display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.clientDisplayChangedHandle = function(event) {
    this.displayFields.client = $('#' + this.htmlId + '_client_display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.officeDisplayChangedHandle = function(event) {
    this.displayFields.office = $('#' + this.htmlId + '_office_display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.subdepartmentDisplayChangedHandle = function(event) {
    this.displayFields.subdepartment = $('#' + this.htmlId + '_subdepartment_display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.activityDisplayChangedHandle = function(event) {
    this.displayFields.activity = $('#' + this.htmlId + '_activity_display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.yearDisplayChangedHandle = function(event) {
    this.displayFields.year = $('#' + this.htmlId + '_year_display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.financialYearDisplayChangedHandle = function(event) {
    this.displayFields.financialYear = $('#' + this.htmlId + '_financialYear_display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.periodTypeDisplayChangedHandle = function(event) {
    this.displayFields.periodType = $('#' + this.htmlId + '_periodType_display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.periodQuarterDisplayChangedHandle = function(event) {
    this.displayFields.periodQuarter = $('#' + this.htmlId + '_periodQuarter_display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.periodMonthDisplayChangedHandle = function(event) {
    this.displayFields.periodMonth = $('#' + this.htmlId + '_periodMonth_display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.periodDateDisplayChangedHandle = function(event) {
    this.displayFields.periodDate  = $('#' + this.htmlId + '_periodDate _display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.periodCounterDisplayChangedHandle = function(event) {
    this.displayFields.periodCounter = $('#' + this.htmlId + '_periodCounter_display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.startDateDisplayChangedHandle = function(event) {
    this.displayFields.startDate = $('#' + this.htmlId + '_startDate_display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.endDateDisplayChangedHandle = function(event) {
    this.displayFields.endDate = $('#' + this.htmlId + '_endDate_display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.inChargePersonDisplayChangedHandle = function(event) {
    this.displayFields.inChargePerson = $('#' + this.htmlId + '_inChargePerson_display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.inChargePartnerDisplayChangedHandle = function(event) {
    this.displayFields.inChargePartner = $('#' + this.htmlId + '_inChargePartner_display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.descriptionDisplayChangedHandle = function(event) {
    this.displayFields.description = $('#' + this.htmlId + '_description_display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.commentDisplayChangedHandle = function(event) {
    this.displayFields.comment = $('#' + this.htmlId + '_comment_display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.createdAtDisplayChangedHandle = function(event) {
    this.displayFields.createdAt = $('#' + this.htmlId + '_createdAt_display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.createdByDisplayChangedHandle = function(event) {
    this.displayFields.createdBy = $('#' + this.htmlId + '_createdBy_display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.isClosedDisplayChangedHandle = function(event) {
    this.displayFields.isClosed = $('#' + this.htmlId + '_isClosed_display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.closedAtDisplayChangedHandle = function(event) {
    this.displayFields.closedAt = $('#' + this.htmlId + '_closedAt_display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.closedByDisplayChangedHandle = function(event) {
    this.displayFields.closedBy = $('#' + this.htmlId + '_closedBy_display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.isFutureDisplayChangedHandle = function(event) {
    this.displayFields.isFuture = $('#' + this.htmlId + '_isFuture_display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.isDeadDisplayChangedHandle = function(event) {
    this.displayFields.isDead = $('#' + this.htmlId + '_isDead_display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.isHiddenDisplayChangedHandle = function(event) {
    this.displayFields.isHidden = $('#' + this.htmlId + '_isHidden_display').is(':checked');
}
ProjectCodesListDisplayFieldsFilter.prototype.conflictStatusDisplayChangedHandle = function(event) {
    this.displayFields.conflictStatus = $('#' + this.htmlId + '_conflictStatus_display').is(':checked');
}


ProjectCodesListDisplayFieldsFilter.prototype.updateView = function() {  
    this.updateDisplayView();
}

ProjectCodesListDisplayFieldsFilter.prototype.updateDisplayView = function() {
    $('#' + this.htmlId + '_id_display').attr("checked", this.displayFields.id);
    $('#' + this.htmlId + '_code_display').attr("checked", this.displayFields.code);
    $('#' + this.htmlId + '_client_display').attr("checked", this.displayFields.client);
    $('#' + this.htmlId + '_office_display').attr("checked", this.displayFields.office);
    $('#' + this.htmlId + '_subdepartment_display').attr("checked", this.displayFields.subdepartment);
    $('#' + this.htmlId + '_activity_display').attr("checked", this.displayFields.activity);
    $('#' + this.htmlId + '_year_display').attr("checked", this.displayFields.year);
    $('#' + this.htmlId + '_financialYear_display').attr("checked", this.displayFields.financialYear);
    $('#' + this.htmlId + '_periodType_display').attr("checked", this.displayFields.periodType);
    $('#' + this.htmlId + '_periodQuarter_display').attr("checked", this.displayFields.periodQuarter);
    $('#' + this.htmlId + '_periodMonth_display').attr("checked", this.displayFields.periodMonth);
    $('#' + this.htmlId + '_periodDate_display').attr("checked", this.displayFields.periodDate);
    $('#' + this.htmlId + '_periodCounter_display').attr("checked", this.displayFields.periodCounter);
    $('#' + this.htmlId + '_startDate_display').attr("checked", this.displayFields.startDate);
    $('#' + this.htmlId + '_endDate_display').attr("checked", this.displayFields.endDate);
    $('#' + this.htmlId + '_description_display').attr("checked", this.displayFields.description);
    $('#' + this.htmlId + '_comment_display').attr("checked", this.displayFields.comment);
    $('#' + this.htmlId + '_createdAt_display').attr("checked", this.displayFields.createdAt);
    $('#' + this.htmlId + '_createdBy_display').attr("checked", this.displayFields.createdBy);
    $('#' + this.htmlId + '_isClosed_display').attr("checked", this.displayFields.isClosed);
    $('#' + this.htmlId + '_closedAt_display').attr("checked", this.displayFields.closedAt);
    $('#' + this.htmlId + '_closedBy_display').attr("checked", this.displayFields.closedBy);
    $('#' + this.htmlId + '_inChargePerson_display').attr("checked", this.displayFields.inChargePerson);
    $('#' + this.htmlId + '_inChargePartner_display').attr("checked", this.displayFields.inChargePartner);
    $('#' + this.htmlId + '_isFuture_display').attr("checked", this.displayFields.isFuture);
    $('#' + this.htmlId + '_isDead_display').attr("checked", this.displayFields.isDead);
    $('#' + this.htmlId + '_isHidden_display').attr("checked", this.displayFields.isHidden);
    $('#' + this.htmlId + '_conflictStatus_display').attr("checked", this.displayFields.conflictStatus);
}
ProjectCodesListDisplayFieldsFilter.prototype.updateSelectorView = function(id, value, options) {
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
ProjectCodesListDisplayFieldsFilter.prototype.okHandle = function() {
    this.callback.call(this.callbackContext, this.displayFields);
}
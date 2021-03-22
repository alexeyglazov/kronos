/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function AnnualPaidLeaveEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "AnnualPaidLeaveEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.contractTypes = {
        "FULL_TIME": "Full time",
        "PART_TIME": "Part time",
        "TIME_SPENT": "Time spent"
    };
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "positionId": formData.positionId,
        "contractType": formData.contractType,
        "start": formData.start,
        "end": formData.end,
        "duration": formData.duration
    }
}
AnnualPaidLeaveEditForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.show();
    this.dataChanged(false);
}
AnnualPaidLeaveEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td>Contract Type</td><td><select id="' + this.htmlId + '_contractType"></select></td></tr>';
    html += '<tr><td>Start</td><td><input type="text" id="' + this.htmlId + '_start"></td></tr>';
    html += '<tr><td>End</td><td><input type="text" id="' + this.htmlId + '_end"></td></tr>';
    html += '<tr><td>Duration</td><td><input type="text" id="' + this.htmlId + '_duration" style="width: 25px;"></td></tr>';
    html += '</table>';
    return html
}
AnnualPaidLeaveEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_contractType').bind("change", function(event) {form.contractTypeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_start').bind("change", function(event) {form.startTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_end').bind("change", function(event) {form.endTextChangedHandle.call(form, event)});
}
AnnualPaidLeaveEditForm.prototype.makeDatePickers = function() {
    var form = this;
    $('#' + this.htmlId + '_start').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.startChangedHandle(dateText, inst)}
    });
    $('#' + this.htmlId + '_end').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.endChangedHandle(dateText, inst)}
    });
}
AnnualPaidLeaveEditForm.prototype.makeSpinners = function () {
    var form = this;
    $('#' + this.htmlId + '_duration')
      .spinner({
           min: 0,
           max: 56,
           step: 1,
           page: 7,
           change: function( event, ui ) {
               form.durationChangedHandle.call(form, event);
           }
      }
    );
}
AnnualPaidLeaveEditForm.prototype.contractTypeChangedHandle = function(event) {
    var val = $('#' + this.htmlId + '_contractType').val();
    if(val == '') {
        this.data.contractType = null;
    } else {
        this.data.contractType = val;
    }
    this.dataChanged(true);
}
AnnualPaidLeaveEditForm.prototype.startChangedHandle = function(dateText, inst) {
    this.startDateHandle(dateText);
}
AnnualPaidLeaveEditForm.prototype.startTextChangedHandle = function(event) {
    this.startDateHandle(jQuery.trim(event.currentTarget.value));
}
AnnualPaidLeaveEditForm.prototype.startDateHandle = function(dateTxt) {
    var errors = [];
    var startDate = null;
    if(dateTxt == null || dateTxt == "") {
    } else if(! isDateValid(dateTxt)) {
        errors.push("Start date has incorrect format");
    } else {
        startDate = getYearMonthDateFromDateString(dateTxt);
    }
    if(errors.length == 0) {
        this.data.start = startDate;
        this.updateStartView();
        this.dataChanged(true);
    } else {
        this.updateStartView();
        showErrors(errors);
    }
}
AnnualPaidLeaveEditForm.prototype.endChangedHandle = function(dateText, inst) {
    this.endDateHandle(dateText);
}
AnnualPaidLeaveEditForm.prototype.endTextChangedHandle = function(event) {
    this.endDateHandle(jQuery.trim(event.currentTarget.value));
}
AnnualPaidLeaveEditForm.prototype.endDateHandle = function(dateTxt) {
    var errors = [];
    var endDate = null;
    if(dateTxt == null || dateTxt == "") {

    } else if(! isDateValid(dateTxt)) {
        errors.push("End date has incorrect format");
    } else {
        endDate = getYearMonthDateFromDateString(dateTxt);
    }
    if(errors.length == 0) {
        this.data.end = endDate;
        this.updateEndView();
        this.dataChanged(true);
    } else {
        this.updateEndView();
        showErrors(errors);
    }
}
AnnualPaidLeaveEditForm.prototype.durationChangedHandle = function(event) {
    var integerRE = /^[0-9]*$/;
    var value = jQuery.trim(event.currentTarget.value);
    if(value == "") {
        this.data.duration = 0;
    } else if(integerRE.test(value)) {
        this.data.duration = parseInt(value);
    } else {
    }
    this.updateDurationView();
}
AnnualPaidLeaveEditForm.prototype.updateView = function() {
    this.updateContractTypeView();
    this.updateStartView();
    this.updateEndView();
    this.updateDurationView();
}
AnnualPaidLeaveEditForm.prototype.updateContractTypeView = function() {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.contractTypes) {
        var contractType = this.contractTypes[key];
        var isSelected = "";
        if(key == this.data.contractType) {
           isSelected = "selected";
        }
        html += '<option value="' + key + '" ' + isSelected + '>' + contractType + '</option>';
    }
    $('#' + this.htmlId + '_contractType').html(html);
    $('#' + this.htmlId + '_contractType').attr("disabled", true);
}
AnnualPaidLeaveEditForm.prototype.updateStartView = function() {
    $('#' + this.htmlId + '_start').val(getStringFromYearMonthDate(this.data.start));
}
AnnualPaidLeaveEditForm.prototype.updateEndView = function() {
    $('#' + this.htmlId + '_end').val(getStringFromYearMonthDate(this.data.end));
}
AnnualPaidLeaveEditForm.prototype.updateDurationView = function() {
    $('#' + this.htmlId + '_duration').val(this.data.duration);
}
AnnualPaidLeaveEditForm.prototype.show = function() {
    var title = 'Update Annual Paid Leave'
    if(this.data.mode == 'CREATE') {
        title = 'Create Annual Paid Leave';
    }
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 400,
        height: 250,
        buttons: {
            Ok: function() {
                form.save();
            },
            Cancel: function() {
                $(this).dialog( "close" );
                form.dataChanged(false);
            }
	},
        close: function(event, ui) {
            releasePopupLayer();
        } 
    });
    this.makeDatePickers();
    this.makeSpinners();
    this.updateView();
}
AnnualPaidLeaveEditForm.prototype.validate = function() {
    var errors = [];
    var integerRE = /^[0-9]*$/;
    var start = null;
    var end = null;
    if(this.data.contractType == null) {
        errors.push("Contract Type is not set");
    }
    if(this.data.start == null) {
        errors.push("Start date is not set");
    }
    if(this.data.start != null && this.data.end != null) {
        var start = parseDateString(getStringFromYearMonthDate(this.data.start));
        var end = parseDateString(getStringFromYearMonthDate(this.data.end));
        if(end < start) {
            errors.push("End date is less than Start date");
        }
    }
    if(this.data.duration == null) {
        errors.push("Duration is not set");
    } else if(! integerRE.test(this.data.duration)) {
        errors.push("Duration must be integer");
    }
    return errors;
}
AnnualPaidLeaveEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    this.doSave(this.data);
}
AnnualPaidLeaveEditForm.prototype.doSave = function(annualPaidLeaveEditForm) {
    var form = this;
    var data = {};
    data.command = "save";
    data.form = getJSON(annualPaidLeaveEditForm);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "This Annual Paid Leave has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
            form.afterSave();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
AnnualPaidLeaveEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    if(this.successHandler != null && this.successContext != null) {
        this.successHandler.call(this.successContext);
    }
}

AnnualPaidLeaveEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}


//==================================================

function AnnualPaidLeaveDeleteForm(leavesItemId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "AnnualPaidLeaveEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": leavesItemId
    }
}
AnnualPaidLeaveDeleteForm.prototype.init = function() {
    this.checkDependencies();
}
AnnualPaidLeaveDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkDependencies";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.analyzeDependencies(result);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
AnnualPaidLeaveDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    if(
        //dependencies.positions == 0
        true
    ) {
        this.show();
    } else {
        var html = 'This Annual Paid Leave has dependencies and can not be deleted<br />';
        //html += 'Positions: ' + dependencies.positions + '<br />';
        doAlert("Dependencies found", html, null, null);
    }
}
AnnualPaidLeaveDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this Annual Paid Leave", this, function() {
            this.doDeleteLeavesItem();
      }, null, null);
}
AnnualPaidLeaveDeleteForm.prototype.doDeleteLeavesItem = function() {
    var form = this;
    var data = {};
    data.command = "delete";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Annual Paid Leave has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
AnnualPaidLeaveDeleteForm.prototype.afterSave = function() {
  if(this.successHandler != null && this.successContext != null) {
    this.successHandler.call(this.successContext);
  }
}
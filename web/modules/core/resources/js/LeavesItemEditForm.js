/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function LeavesItemEditForm(formData, htmlId, successHandler, successContext, dataTargetHandler, dataTargetContext) {
    this.config = {
        endpointUrl: endpointsFolder + "LeavesItemEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.dataTargetHandler = dataTargetHandler;
    this.dataTargetContext = dataTargetContext;
    this.types = {
        "MATERNITY_LEAVE": "Maternity Leave",
        "LONG_LEAVE": "Long Leave",
        "PARENTAL_LEAVE": "Parental Leave",
        "PAID_LEAVE": "Paid Leave",
        "UNPAID_LEAVE": "Unpaid Leave"
    };
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "employeeId": formData.employeeId,
        "type": formData.type,
        "start": calendarVisualizer.getHtml(formData.start),
        "end": calendarVisualizer.getHtml(formData.end)
    }
    if(this.data.mode == "CREATE") {
        this.data.type = "MATERNITY_LEAVE";
    }
    this.selected = {
        "type": this.data.type
    };
}
LeavesItemEditForm.prototype.start = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.show();
    this.dataChanged(false);
}
LeavesItemEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td>Type</td><td><select id="' + this.htmlId + '_type"></select></td></tr>';
    html += '<tr><td>Start</td><td><input type="text" id="' + this.htmlId + '_start"></td></tr>';
    html += '<tr><td>End</td><td><input type="text" id="' + this.htmlId + '_end"></td></tr>';
    html += '</table>';
    return html
}
LeavesItemEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_type').bind("change", function(event) {form.typeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_start').bind("change", function(event) {form.startTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_end').bind("change", function(event) {form.endTextChangedHandle.call(form, event)});
}
LeavesItemEditForm.prototype.makeDatePickers = function() {
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
LeavesItemEditForm.prototype.typeChangedHandle = function(event) {
    this.selected.type = $('#' + this.htmlId + '_type').val();
    this.data.type = this.selected.type;
    this.dataChanged(true);
}
LeavesItemEditForm.prototype.startChangedHandle = function(dateText, inst) {
    this.data.start = dateText;
    this.dataChanged(true);
}
LeavesItemEditForm.prototype.startTextChangedHandle = function(event) {
    this.data.start = jQuery.trim(event.currentTarget.value);
    this.updateStartView();
    this.dataChanged(true);
}
LeavesItemEditForm.prototype.endChangedHandle = function(dateText, inst) {
    this.data.end = dateText;
    this.dataChanged(true);
}
LeavesItemEditForm.prototype.endTextChangedHandle = function(event) {
    this.data.end = jQuery.trim(event.currentTarget.value);
    this.updateEndView();
    this.dataChanged(true);
}
LeavesItemEditForm.prototype.updateView = function() {
    this.updateTypeView();
    this.updateStartView();
    this.updateEndView();
}
LeavesItemEditForm.prototype.updateTypeView = function() {
    var html = '';
    for(var key in this.types) {
        var type = this.types[key];
        var isSelected = "";
        if(key == this.selected.type) {
           isSelected = "selected";
        }
        html += '<option value="' + key + '" ' + isSelected + '>' + type + '</option>';
    }
    $('#' + this.htmlId + '_type').html(html);
}
LeavesItemEditForm.prototype.updateStartView = function() {
    $('#' + this.htmlId + '_start').val(this.data.start);
}
LeavesItemEditForm.prototype.updateEndView = function() {
    $('#' + this.htmlId + '_end').val(this.data.end);
}
LeavesItemEditForm.prototype.show = function() {
    var title = 'Update Leave Item'
    if(this.data.mode == 'CREATE') {
        title = 'Create Leave Item';
    }
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 400,
        height: 200,
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
    this.updateView();
}
LeavesItemEditForm.prototype.validate = function() {
    var errors = [];
    var start = null;
    var end = null;
    if(this.data.type == null) {
        errors.push("Type is not set");
    }
    if(this.data.start == null || this.data.start == "") {
        errors.push("Start date is not set");
    } else if(! isDateValid(this.data.start)) {
        errors.push("Start date has incorrect format");
    } else {
        start = parseDateString(this.data.start);
    }
    if(this.data.end == null || this.data.end == "") {
    } else if(! isDateValid(this.data.end)) {
        errors.push("End date has incorrect format");
    } else {
        end = parseDateString(this.data.end);
    }
    if(start != null && end != null && start > end) {
        errors.push("End date is less than Start date");
    }
    return errors;
}
LeavesItemEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        var message = "";
        for(var key in errors) {
            message += errors[key] + "<br />";
        }
        doAlert("Validation error", message, null, null);
        return;
    }
    var leavesItemEditForm = clone(this.data);
    leavesItemEditForm.start = getYearMonthDateFromDateString(this.data.start);
    leavesItemEditForm.end = getYearMonthDateFromDateString(this.data.end);
    if(this.dataTargetHandler == null || this.dataTargetContext == null) {
        this.doSave(leavesItemEditForm);
    } else {
        this.dataTargetHandler.call(this.dataTargetContext, leavesItemEditForm);
        this.afterSave();
    }
}
LeavesItemEditForm.prototype.doSave = function(leavesItemEditForm) {
    var form = this;
    var data = {};
    data.command = "saveLeavesItem";
    data.leavesItemEditForm = getJSON(leavesItemEditForm);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "This Leaves Item has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
LeavesItemEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    if(this.successHandler != null && this.successContext != null) {
        this.successHandler.call(this.successContext);
    }
}

LeavesItemEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}


//==================================================

function LeavesItemDeleteForm(leavesItemId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "LeavesItemEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": leavesItemId
    }
}
LeavesItemDeleteForm.prototype.start = function() {
    this.show();
}
LeavesItemDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this Leaves Item", this, function() {
            this.doDeleteLeavesItem();
      }, null, null);
}
LeavesItemDeleteForm.prototype.doDeleteLeavesItem = function() {
    var form = this;
    var data = {};
    data.command = "deleteLeavesItem";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Leaves Item has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
LeavesItemDeleteForm.prototype.afterSave = function() {
  if(this.successHandler != null && this.successContext != null) {
    this.successHandler.call(this.successContext);
  }
}
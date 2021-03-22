/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function FeesAdvanceEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "FeesAdvanceEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.successHandler = successHandler;
    this.successContext = successContext;

    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "feesItemId": formData.feesItemId,
        "amount": formData.amount,
        "date": formData.date,
        "isAdvance": formData.isAdvance
    }
}
FeesAdvanceEditForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.show();
    this.dataChanged(false);
}
FeesAdvanceEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td>Advance</td><td><input type="checkbox" id="' + this.htmlId + '_isAdvance"></td></tr>';
    html += '<tr><td>Amount</td><td><input type="text" id="' + this.htmlId + '_amount"></td></tr>';
    html += '<tr><td>Date</td><td><input type="text" id="' + this.htmlId + '_date"></td></tr>';
    html += '</table>';
    return html
}
FeesAdvanceEditForm.prototype.makeDatePickers = function() {
    var form = this;
    $( '#' + this.htmlId + '_date' ).datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.dateChangedHandle(dateText, inst)}
    });
}
FeesAdvanceEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_isAdvance').bind("click", function(event) {form.isAdvanceChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_amount').bind("change", function(event) {form.amountChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_date').bind("change", function(event) {form.dateTextChangedHandle.call(form, event);});
}
FeesAdvanceEditForm.prototype.isAdvanceChangedHandle = function(event) {
    this.data.isAdvance = $(event.currentTarget).is(':checked');
    this.updateIsAdvanceView();
    this.dataChanged(true);
}
FeesAdvanceEditForm.prototype.amountChangedHandle = function(event) {
    this.data.amount = jQuery.trim(event.currentTarget.value);
    this.updateAmountView();
    this.dataChanged(true);
}
FeesAdvanceEditForm.prototype.dateChangedHandle = function(dateText, inst) {
    this.data.date = dateText;
    this.updateDateView();
    this.dataChanged(true);
}
FeesAdvanceEditForm.prototype.dateTextChangedHandle = function(event) {
    this.data.date = jQuery.trim(event.currentTarget.value);
    this.updateDateView();
    this.dataChanged(true);
}
FeesAdvanceEditForm.prototype.updateView = function() {
    this.updateIsAdvanceView();
    this.updateAmountView();
    this.updateDateView();
}
FeesAdvanceEditForm.prototype.updateIsAdvanceView = function() {
    $('#' + this.htmlId + '_isAdvance').attr("checked", this.data.isAdvance);
}
FeesAdvanceEditForm.prototype.updateAmountView = function() {
    $('#' + this.htmlId + '_amount').val(this.data.amount);
}
FeesAdvanceEditForm.prototype.updateDateView = function() {
    $('#' + this.htmlId + '_date').val(this.data.date);
}

FeesAdvanceEditForm.prototype.show = function() {
    var title = 'Update Advance'
    if(this.data.mode == 'CREATE') {
        title = 'Create Advance';
    }
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeDatePickers();
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 350,
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
    this.updateView();
}
FeesAdvanceEditForm.prototype.validate = function() {
    var errors = [];
    var float2digitsRE = /^[0-9]*\.?[0-9]{0,2}$/;
    if(this.data.amount == null || this.data.amount == "") {
        errors.push("Amount is not set");
    } else if(!float2digitsRE.test(this.data.amount)) {
        errors.push("Amount has incorrect format. Digits, decimal point and two digits after the point are allowed only.");
    }
    if(this.data.date == null || this.data.date == "") {
        errors.push("Date is not set");
    } else if(! isDateValid(this.data.date)) {
        errors.push("Date has incorrect format");
    }
    return errors;
}
FeesAdvanceEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        var message = "";
        for(var key in errors) {
            message += errors[key] + "<br />";
        }
        doAlert("Validation error", message, null, null);
        return;
    }
    var serverFormatData = clone(this.data);
    serverFormatData.date = getYearMonthDateFromDateString(this.data.date);
    var form = this;
    var data = {};
    data.command = "saveFeesAdvance";
    data.feesAdvanceEditForm = getJSON(serverFormatData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Fees Advance has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
FeesAdvanceEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}

FeesAdvanceEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}



//==================================================

function FeesAdvanceDeleteForm(feesAdvanceId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "FeesAdvanceEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": feesAdvanceId
    }
}
FeesAdvanceDeleteForm.prototype.start = function() {
    this.checkDependencies();
}
FeesAdvanceDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkFeesAdvanceDependencies";
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
FeesAdvanceDeleteForm.prototype.analyzeDependencies = function(dependencies) {
  // there are no dependant entities now at all
    if(true) {
        this.show();
    } else {
        var html = 'This FeesAdvance has dependencies and can not be deleted<br />';
        doAlert("Dependencies found", html, null, null);
    }
}
FeesAdvanceDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this FeesAdvance", this, function() {this.doDeleteFeesAdvance()}, null, null);
}
FeesAdvanceDeleteForm.prototype.doDeleteFeesAdvance = function() {
    var form = this;
    var data = {};
    data.command = "deleteFeesAdvance";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "FeesAdvance has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
FeesAdvanceDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}
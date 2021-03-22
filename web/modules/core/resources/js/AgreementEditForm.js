/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function AgreementEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "AgreementEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.enums = {
        "types": {
            "SINGLE": "Single",
            "MULTIPLE" : "Multiple"
        }
    }
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "projectCodeId": formData.projectCodeId,
        "number": formData.number,
        "isSigned": formData.isSigned,
        "date": formData.date,
        "type": formData.type,
        "isRenewal": formData.isRenewal,
        "comment": formData.comment
    }
}
AgreementEditForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.show();
    this.dataChanged(false);
}
AgreementEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td>Number</td><td><input type="text" id="' + this.htmlId + '_number"></td></tr>';
    html += '<tr><td>Signed</td><td><input type="checkbox" id="' + this.htmlId + '_isSigned"></td></tr>';
    html += '<tr><td>Date</td><td><input type="text" id="' + this.htmlId + '_date"></td></tr>';
    html += '<tr><td>Type</td><td><select id="' + this.htmlId + '_type"></select></td></tr>';
    html += '<tr><td>Renewal</td><td><input type="checkbox" id="' + this.htmlId + '_isRenewal"></td></tr>';
    html += '<tr><td>Comment</td><td><textarea id="' + this.htmlId + '_comment"></textarea></td></tr>';
    html += '</table>';
    return html
}
AgreementEditForm.prototype.makeDatePickers = function() {
    var form = this;
    $( '#' + this.htmlId + '_date' ).datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.dateChangedHandle(dateText, inst)}
    });
}
AgreementEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_number').bind("change", function(event) {form.numberChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isSigned').bind("click", function(event) {form.isSignedChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_date').bind("change", function(event) {form.dateTextChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_type').bind("change", function(event) {form.typeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isRenewal').bind("click", function(event) {form.isRenewalChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_comment').bind("change", function(event) {form.commentChangedHandle.call(form, event);});
}
AgreementEditForm.prototype.numberChangedHandle = function(event) {
    this.data.number = jQuery.trim(event.currentTarget.value);
    this.updateNumberView();
    this.dataChanged(true);
}
AgreementEditForm.prototype.isSignedChangedHandle = function(event) {
    this.data.isSigned = $(event.currentTarget).is(':checked');
    this.updateIsSignedView();
    this.dataChanged(true);
}
AgreementEditForm.prototype.dateChangedHandle = function(dateText, inst) {
    this.data.date = dateText;
    this.updateDateView();
    this.dataChanged(true);
}
AgreementEditForm.prototype.dateTextChangedHandle = function(event) {
    this.data.date = jQuery.trim(event.currentTarget.value);
    this.updateDateView();
    this.dataChanged(true);
}
AgreementEditForm.prototype.typeChangedHandle = function(event) {
    var valueTxt = event.currentTarget.value;
    if(valueTxt == '') {
        this.data.type = null;
    } else {
        this.data.type = valueTxt;
    }
    this.updateTypeView();
    this.dataChanged(true);
}
AgreementEditForm.prototype.isRenewalChangedHandle = function(event) {
    this.data.isRenewal = $(event.currentTarget).is(':checked');
    this.updateIsRenewalView();
    this.dataChanged(true);
}
AgreementEditForm.prototype.commentChangedHandle = function(event) {
    this.data.comment = jQuery.trim(event.currentTarget.value);
    this.updateCommentView();
    this.dataChanged(true);
}
AgreementEditForm.prototype.updateView = function() {
    this.updateNumberView();
    this.updateIsSignedView();
    this.updateDateView();
    this.updateTypeView();
    this.updateIsRenewalView();
    this.updateCommentView();
}
AgreementEditForm.prototype.updateNumberView = function() {
    $('#' + this.htmlId + '_number').val(this.data.number);
}
AgreementEditForm.prototype.updateIsSignedView = function() {
    $('#' + this.htmlId + '_isSigned').attr("checked", this.data.isSigned);
}
AgreementEditForm.prototype.updateDateView = function() {
    $('#' + this.htmlId + '_date').val(this.data.date);
}
AgreementEditForm.prototype.updateTypeView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.enums.types) {
        var type = this.enums.types[key];
        var isSelected = "";
        if(key == this.data.type) {
           isSelected = "selected";
        }
        html += '<option value="' + key + '" ' + isSelected + '>' + type + '</option>';
    }
    $('#' + this.htmlId + '_type').html(html);
}
AgreementEditForm.prototype.updateIsRenewalView = function() {
    $('#' + this.htmlId + '_isRenewal').attr("checked", this.data.isRenewal);
}
AgreementEditForm.prototype.updateCommentView = function() {
    $('#' + this.htmlId + '_comment').val(this.data.comment);
}

AgreementEditForm.prototype.show = function() {
    var title = 'Update Agreement'
    if(this.data.mode == 'CREATE') {
        title = 'Create Agreement';
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
        height: 300,
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
AgreementEditForm.prototype.validate = function() {
    var errors = [];
    var numberRE = /^[A-Za-z0-9]*$/;
    if(this.data.number == null || this.data.number == "") {
        errors.push("Number is not set");
    } else if(!numberRE.test(this.data.number)) {
        //errors.push("Number has incorrect format. Alphanumerical characters are allowed only.");
    }
    if(this.data.date == null || this.data.date == "") {
        errors.push("Date is not set");
    } else if(! isDateValid(this.data.date)) {
        errors.push("Date has incorrect format");
    }
    if(this.data.type == null) {
        errors.push("Type is not set");
    }
    return errors;
}
AgreementEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var serverFormatData = clone(this.data);
    serverFormatData.date = getYearMonthDateFromDateString(this.data.date);
    var form = this;
    var data = {};
    data.command = "saveAgreement";
    data.agreementEditForm = getJSON(serverFormatData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Agreement has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
AgreementEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}

AgreementEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}



//==================================================

function AgreementDeleteForm(agreementId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "AgreementEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": agreementId
    }
}
AgreementDeleteForm.prototype.start = function() {
    this.checkDependencies();
}
AgreementDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkAgreementDependencies";
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
AgreementDeleteForm.prototype.analyzeDependencies = function(dependencies) {
  // there are no dependant entities now at all
    if(true) {
        this.show();
    } else {
        var html = 'This Agreement has dependencies and can not be deleted<br />';
        doAlert("Dependencies found", html, null, null);
    }
}
AgreementDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this Agreement", this, function() {this.doDeleteAgreement()}, null, null);
}
AgreementDeleteForm.prototype.doDeleteAgreement = function() {
    var form = this;
    var data = {};
    data.command = "deleteAgreement";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Agreement has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
AgreementDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}
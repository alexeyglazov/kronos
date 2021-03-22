/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function TaxInvoiceRequestEditForm(formData, moduleName, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "TaxInvoiceRequestEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.moduleName = moduleName;
    this.enums = {
        "statuses": {
            "SUSPENDED": "Suspended",
            "ACTIVE": "Active",
            "LOCKED": "Locked",
            "CLOSED": "Closed"
        }
    }
    this.loaded = {
        "projectCode": null,
        "actRequests": []
    }
    this.picked = {
    }
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "invoiceRequestPacketId": formData.invoiceRequestPacketId,
        "status": formData.status,
        "isCancelled": formData.isCancelled
    }
}
TaxInvoiceRequestEditForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
    this.dataChanged(false);
}
TaxInvoiceRequestEditForm.prototype.loadInitialContent = function() {
   var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.invoiceRequestPacketId = this.data.invoiceRequestPacketId;
    if(this.data.actRequestId != null) {
        data.actRequestId = this.data.actRequestId;
    }
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.projectCode = result.projectCode;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
TaxInvoiceRequestEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr><td><label for="' + this.htmlId + '_status">Status</label></td><td><select id="' + this.htmlId + '_status"></select></td></tr>';
    if(this.data.mode != 'CREATE') {
        html += '<tr><td><label for="' + this.htmlId + '_status">Cancelled</label></td><td><input type="checkbox" id="' + this.htmlId + '_isCancelled"></td></tr>';
    }
    html += '</table>';
    return html
}
TaxInvoiceRequestEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_status').bind("change", function(event) {form.statusChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isCancelled').bind("click", function(event) {form.isCancelledClickedHandle.call(form, event);});
}
TaxInvoiceRequestEditForm.prototype.statusChangedHandle = function(event) {
    this.data.status = jQuery.trim(event.currentTarget.value);
    if(this.data.status == '') {
        this.data.status = null;
    }
    this.updateStatusView();
    this.dataChanged(true);
}
TaxInvoiceRequestEditForm.prototype.isCancelledClickedHandle = function(event) {
    this.data.isCancelled = $(event.currentTarget).is(":checked");
    this.updateIsCancelledView();
    this.dataChanged(true);
}
TaxInvoiceRequestEditForm.prototype.updateView = function(event) {
    this.updateStatusView();
    this.updateIsCancelledView();
}
TaxInvoiceRequestEditForm.prototype.updateStatusView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.enums.statuses) {
        var status = this.enums.statuses[key];
        var isSelected = "";
        if(key == this.data.status) {
           isSelected = "selected";
        }
        html += '<option value="' + key + '" ' + isSelected + '>' + status + '</option>';
    }
    $('#' + this.htmlId + '_status').html(html);
}
TaxInvoiceRequestEditForm.prototype.updateIsCancelledView = function() {
    $('#' + this.htmlId + '_isCancelled').attr("checked", this.data.isCancelled);
}
TaxInvoiceRequestEditForm.prototype.show = function() {
    var title = 'Update Tax Invoice Request';
    if(this.data.mode == 'CREATE') {
        title = 'Create Tax Invoice Request';
    }
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 400,
        height: 350,
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
}
TaxInvoiceRequestEditForm.prototype.validate = function() {
    var errors = [];
    var integerRE = /^[0-9]*$/;
    var float2digitsRE = /^[0-9]*\.?[0-9]{0,2}$/;
    if(this.data.invoiceRequestPacketId == null) {
        errors.push("Invoice Request Packet is not set");
    }
    if(this.data.status === null) {
        errors.push("Status is not set");
    } else if(this.data.status == 'CLOSED' || this.data.status == 'LOCKED') {
        errors.push("Saving request with LOCKED or CLOSED status is not allowed");
    }
    if(this.data.mode == 'CREATE' && this.data.isCancelled == true) {
        errors.push("New request can not be cancelled");
    }    
    return errors;
}
TaxInvoiceRequestEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var serverFormatData = clone(this.data);
    var form = this;
    var data = {};
    data.command = "saveTaxInvoiceRequest";
    data.taxInvoiceRequestEditForm = getJSON(serverFormatData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Data have been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
TaxInvoiceRequestEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}
TaxInvoiceRequestEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}




//==================================================

function TaxInvoiceRequestDeleteForm(taxInvoiceRequestId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "TaxInvoiceRequestEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": taxInvoiceRequestId
    }
}
TaxInvoiceRequestDeleteForm.prototype.init = function() {
    this.checkDependencies();
}
TaxInvoiceRequestDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkTaxInvoiceRequestDependencies";
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
TaxInvoiceRequestDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.hasClosedStatusInHistory == true) {
        var html = 'This Tax Invoice Request was once closed and can not be deleted<br />';
        html += 'You can cancel it<br />';
        doAlert("Alert", html, null, null);
    } else {
        this.show();
    }
}
TaxInvoiceRequestDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Proceed to delete this Tax Invoice Request?", this, function() {this.doDeleteTaxInvoiceRequest()}, null, null);
}
TaxInvoiceRequestDeleteForm.prototype.doDeleteTaxInvoiceRequest = function() {
    var form = this;
    var data = {};
    data.command = "deleteTaxInvoiceRequest";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Tax Invoice Request has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
TaxInvoiceRequestDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}

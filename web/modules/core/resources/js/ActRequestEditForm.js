/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ActRequestEditForm(formData, moduleName, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "ActRequestEditForm.jsp"
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
        "client": null,
        "currencies": [],
        "actRequests": []
    }
    this.picked = {
        "client": null
    }
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "invoiceRequestPacketId": formData.invoiceRequestPacketId,
        "createTaxInvoiceRequest": false,
        "clientId" : formData.clientId,
        "description" : formData.description,
        "date" : formData.date,
        "invoiceCurrencyId" : formData.invoiceCurrencyId,
        "paymentCurrencyId": formData.paymentCurrencyId,
        "status": formData.status,
        "actRequestItems": formData.actRequestItems,
        "isCancelled": formData.isCancelled
    }
}
ActRequestEditForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
    this.dataChanged(false);
}
ActRequestEditForm.prototype.loadInitialContent = function() {
   var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.invoiceRequestPacketId = this.data.invoiceRequestPacketId;
    if(this.data.clientId != null) {
        data.clientId = this.data.clientId;
    }
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.projectCode = result.projectCode;
            form.loaded.currencies = result.currencies;
            form.loaded.invoiceRequests = result.invoiceRequests;
            form.picked.client = result.client;
            form.data.clientId = result.client.id;
            if(form.data.mode == 'CREATE') {
                form.data.description = form.loaded.projectCode.description;
                for(var key1 in form.loaded.invoiceRequests) {
                    var invoiceRequest = form.loaded.invoiceRequests[key1];
                    for(var key2 in invoiceRequest.invoiceRequestItems) {
                        var invoiceRequestItem = invoiceRequest.invoiceRequestItems[key2];
                        form.data.actRequestItems.push({
                            "name": invoiceRequestItem.name,
                            "amount": invoiceRequestItem.amount
                        });
                    }
                }
                form.data.invoiceCurrencyId = form.loaded.invoiceRequests[0].invoiceCurrencyId;
                form.data.paymentCurrencyId = form.loaded.invoiceRequests[0].paymentCurrencyId;
                form.data.date = calendarVisualizer.getHtml(form.loaded.invoiceRequests[0].date);
            }
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ActRequestEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr><td><label for="' + this.htmlId + '_description">Description</label></td><td><textarea id="' + this.htmlId + '_description" style="height: 120px; width: 450px;"></textarea></td></tr>';
    html += '<tr><td><label for="' + this.htmlId + '_invoiceCurrency">Invoice currency</label></td><td><select id="' + this.htmlId + '_invoiceCurrency"></select></td></tr>';
    html += '<tr><td><label for="' + this.htmlId + '_paymentCurrency">Payment currency</label></td><td><select id="' + this.htmlId + '_paymentCurrency"></select></td></tr>';
    html += '<tr><td><label for="' + this.htmlId + '_client">Client</label></td><td><input id="' + this.htmlId + '_client"><button id="' + this.htmlId + '_clientPickBtn' + '">Pick</button><button id="' + this.htmlId + '_clientClearBtn' + '">Reset</button></td></tr>';
    html += '<tr><td><label for="' + this.htmlId + '_date">Date</label></td><td><input id="' + this.htmlId + '_date"></td></tr>';
    html += '<tr><td><label for="' + this.htmlId + '_status">Status</label></td><td><select id="' + this.htmlId + '_status"></select></td></tr>';
    if(this.data.mode != 'CREATE') {
        html += '<tr><td><label for="' + this.htmlId + '_status">Cancelled</label></td><td><input type="checkbox" id="' + this.htmlId + '_isCancelled"></td></tr>';
    }
    html += '</table>';
    
    html += '<div id="' + this.htmlId + '_actRequestItems' + '"></div>';
    return html
}
ActRequestEditForm.prototype.makeDatePickers = function() {
    var form = this;
    $( '#' + this.htmlId + '_date' ).datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.dateChangedHandle(dateText, inst)}
    });
}
ActRequestEditForm.prototype.makeButtons = function() {
    var form = this;
    $('#' + this.htmlId + '_clientPickBtn')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.clientPickHandle.call(form);
    });    
    $('#' + this.htmlId + '_clientClearBtn')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.clientClearHandle.call(form);
    }); }
ActRequestEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_description').bind("change", function(event) {form.descriptionChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_invoiceCurrency').bind("change", function(event) {form.invoiceCurrencyChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_paymentCurrency').bind("change", function(event) {form.paymentCurrencyChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_date').bind("change", function(event) {form.dateTextChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_status').bind("change", function(event) {form.statusChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isCancelled').bind("click", function(event) {form.isCancelledClickedHandle.call(form, event);});
}
ActRequestEditForm.prototype.descriptionChangedHandle = function(event) {
    this.data.description = jQuery.trim(event.currentTarget.value);
    this.updateDescriptionView();
    this.dataChanged(true);
}
ActRequestEditForm.prototype.invoiceCurrencyChangedHandle = function(event) {
    var valueTxt = event.currentTarget.value;
    if(valueTxt == '') {
        this.data.invoiceCurrencyId = null;
    } else {
        this.data.invoiceCurrencyId = parseInt(valueTxt);
    }
    this.updateInvoiceCurrencyView();
    this.makeActRequestItemsLayout();
    this.updateActRequestItemNamesView();
    this.updateActRequestItemAmountsView();
    this.dataChanged(true);
}
ActRequestEditForm.prototype.paymentCurrencyChangedHandle = function(event) {
    var valueTxt = event.currentTarget.value;
    if(valueTxt == '') {
        this.data.paymentCurrencyId = null;
    } else {
        this.data.paymentCurrencyId = parseInt(valueTxt);
    }
    this.updatePaymentCurrencyView();
    this.makeActRequestItemsLayout();
    this.updateActRequestItemNamesView();
    this.updateActRequestItemAmountsView();
    this.dataChanged(true);
}
ActRequestEditForm.prototype.dateChangedHandle = function(dateText, inst) {
    this.data.date = dateText;
    this.updateDateView();
    this.dataChanged(true);
}
ActRequestEditForm.prototype.dateTextChangedHandle = function(event) {
    this.data.date = jQuery.trim(event.currentTarget.value);
    this.updateDateView();
    this.dataChanged(true);
}
ActRequestEditForm.prototype.statusChangedHandle = function(event) {
    this.data.status = jQuery.trim(event.currentTarget.value);
    if(this.data.status == '') {
        this.data.status = null;
    }
    this.updateStatusView();
    this.dataChanged(true);
}
ActRequestEditForm.prototype.isCancelledClickedHandle = function(event) {
    this.data.isCancelled = $(event.currentTarget).is(":checked");
    this.updateIsCancelledView();
    this.dataChanged(true);
}
ActRequestEditForm.prototype.clientPickHandle = function() {
    var formData = {
        "mode": 'SINGLE'
    };
    this.clientPicker = new ClientPicker(formData, "clientPicker", this.clientPicked, this, this.moduleName);
    this.clientPicker.init();
}
ActRequestEditForm.prototype.clientPicked = function(client) {
    this.picked.client = client;
    this.data.clientId = client.id;
    this.updateClientView();
}
ActRequestEditForm.prototype.clientClearHandle = function() {
    this.picked.client = null;
    this.data.clientId = null;
    this.updateClientView();
}
ActRequestEditForm.prototype.actRequestItemNameChangedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var index = parseInt(parts[parts.length - 1]);
    var value = jQuery.trim($(event.currentTarget).val());
    this.data.actRequestItems[index].name = value;
    this.updateActRequestItemNamesView();
}
ActRequestEditForm.prototype.actRequestItemAmountChangedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var index = parseInt(parts[parts.length - 1]);
    var value = jQuery.trim($(event.currentTarget).val());
    value = value.getReducedToNumber();
    this.data.actRequestItems[index].amount = value;
    this.updateActRequestItemAmountsView();
}
ActRequestEditForm.prototype.addActRequestItem = function(event) {
    this.data.actRequestItems.push({"name": null, "amount": null});
    this.makeActRequestItemsLayout();
    this.updateActRequestItemNamesView();
    this.updateActRequestItemAmountsView();
}
ActRequestEditForm.prototype.removeActRequestItem = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var index = parseInt(parts[parts.length - 1]);
    this.data.actRequestItems.splice(index, 1);
    this.makeActRequestItemsLayout();
    this.updateActRequestItemNamesView();
    this.updateActRequestItemAmountsView();
}
ActRequestEditForm.prototype.updateView = function(event) {
    this.updateInvoiceCurrencyView();
    this.updatePaymentCurrencyView();
    this.updateClientView();
    this.updateDescriptionView();
    this.updateDateView();
    this.updateStatusView();
    this.updateIsCancelledView();
    this.makeActRequestItemsLayout();
    this.updateActRequestItemNamesView();
    this.updateActRequestItemAmountsView();
}
ActRequestEditForm.prototype.updateInvoiceCurrencyView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        var isSelected = "";
        if(currency.id == this.data.invoiceCurrencyId) {
           isSelected = "selected";
        }
        html += '<option value="' + currency.id + '" ' + isSelected + '>' + currency.code + '</option>';
    }
    $('#' + this.htmlId + '_invoiceCurrency').html(html);
}
ActRequestEditForm.prototype.updatePaymentCurrencyView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        var isSelected = "";
        if(currency.id == this.data.paymentCurrencyId) {
           isSelected = "selected";
        }
        html += '<option value="' + currency.id + '" ' + isSelected + '>' + currency.code + '</option>';
    }
    $('#' + this.htmlId + '_paymentCurrency').html(html);
}
ActRequestEditForm.prototype.makeActRequestItemsLayout = function() {
    var html = '';
    var currency = null;
    if(this.data.invoiceCurrencyId != null) {
        for(var key in this.loaded.currencies) {
            if(this.loaded.currencies[key].id == this.data.invoiceCurrencyId) {
                currency = this.loaded.currencies[key];
                break;
            }
        }
    }
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td>Name</td><td>Amount ' + ((currency != null) ? (' (' + currency.code) + ')' : '') + '</td><td></td></tr>';
    if(this.data.actRequestItems != null && this.data.actRequestItems.length > 0) {
        for(var key in this.data.actRequestItems) {
            //var actRequestItem = this.data.actRequestItems[key];
            html += '<tr>';
            html += '<td><textarea type="text" id="' + this.htmlId + '_actRequestItem_name_' + key + '" style="width: 450px; height: 120px;"></textarea></td>';
            html += '<td><input type="text" id="' + this.htmlId + '_actRequestItem_amount_' + key + '" style="width: 70px;"></td>';
            html += '<td><button id="' + this.htmlId + '_removeActRequestItemBtn_' + key + '">Remove</button></td>';
            html += '</tr>';
        }
    } else {
        html += '<tr><td colspan="3">No items</td></tr>';
    }
    html += '<tr><td>Total</td><td><span id="' + this.htmlId + '_totalAmount"></span></td><td></td></tr>';
    html += '<tr><td colspan="3"><button id="' + this.htmlId + '_addActRequestItemBtn">Add</button></td></tr>';
    html += '</table>';
    $('#' + this.htmlId + '_actRequestItems').html(html);
    
    var form = this;
    $('#' + this.htmlId + '_addActRequestItemBtn')
      .button({
        icons: {
            primary: "ui-icon-plus"
        },
        text: true
        })
      .click(function( event ) {
        form.addActRequestItem.call(form);
    });    
    
    $('button[id^="' + this.htmlId + '_removeActRequestItemBtn_"]')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.removeActRequestItem.call(form, event);
    });    
    
    $('textarea[id^="' + this.htmlId + '_actRequestItem_name_"]').bind("change", function(event) {form.actRequestItemNameChangedHandle.call(form, event);});
    $('input[id^="' + this.htmlId + '_actRequestItem_amount_"]').bind("change", function(event) {form.actRequestItemAmountChangedHandle.call(form, event);});
}
ActRequestEditForm.prototype.updateClientView = function() {
    $('#' + this.htmlId + '_client').attr("disabled", true);
    if(this.picked.client != null) {
        $('#' + this.htmlId + '_client').val(this.picked.client.name);
    } else {
        $('#' + this.htmlId + '_client').val('');
    }
}
ActRequestEditForm.prototype.updateDescriptionView = function() {
    $('#' + this.htmlId + '_description').val(this.data.description);
}
ActRequestEditForm.prototype.updateDateView = function() {
    $('#' + this.htmlId + '_date').val(this.data.date);
}
ActRequestEditForm.prototype.updateStatusView = function() {
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
ActRequestEditForm.prototype.updateIsCancelledView = function() {
    $('#' + this.htmlId + '_isCancelled').attr("checked", this.data.isCancelled);
}
ActRequestEditForm.prototype.updateActRequestItemNamesView = function() {
    for(var key in this.data.actRequestItems) {
        var actRequestItem = this.data.actRequestItems[key];
        $('#' + this.htmlId + '_actRequestItem_name_' + key).val(actRequestItem.name);
    }
}
ActRequestEditForm.prototype.updateActRequestItemAmountsView = function() {
    var totalAmount = 0;
    var hasBadValue = false;
    for(var key in this.data.actRequestItems) {
        var actRequestItem = this.data.actRequestItems[key];
        $('#' + this.htmlId + '_actRequestItem_amount_' + key).val(actRequestItem.amount);
        if(actRequestItem.amount == null || isNaN(actRequestItem.amount)) {
            hasBadValue = true;
        } else {
            totalAmount += parseFloat(actRequestItem.amount);
        }        
    }
    if(! hasBadValue) {
        $('#' + this.htmlId + '_totalAmount').html(totalAmount);
    } else {
        $('#' + this.htmlId + '_totalAmount').html('NaN');
    }    
}
ActRequestEditForm.prototype.show = function() {
    var title = 'Update Act Request';
    if(this.data.mode == 'CREATE') {
        title = 'Create Act Request';
    }
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeDatePickers();
    this.makeButtons();
    this.updateView();
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 600,
        height: 500,
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
ActRequestEditForm.prototype.validate = function() {
    var errors = [];
    var integerRE = /^[0-9]*$/;
    var float2digitsRE = /^[0-9]*\.?[0-9]{0,2}$/;
    if(this.data.clientId == null) {
        errors.push("Client is not set");
    }
    if(this.data.status === null) {
        errors.push("Status is not set");
    } else if(this.data.status == 'CLOSED' || this.data.status == 'LOCKED') {
        errors.push("Saving request with LOCKED or CLOSED status is not allowed");
    }
    if(this.data.mode == 'CREATE' && this.data.isCancelled == true) {
        errors.push("New request can not be cancelled");
    }    
    if(this.data.description == null || this.data.description == "") {
        errors.push("Description is not set");
    }
    if(this.data.invoiceCurrencyId === null) {
        errors.push("Invoice Currency is not set");
    }
    if(this.data.paymentCurrencyId === null) {
        errors.push("Payment Currency is not set");
    }
    if(this.data.date == null || this.data.date == "") {
        errors.push("Date is not set");
    } else if(! isDateValid(this.data.date)) {
        errors.push("Date has incorrect format");
    }
    if(this.data.actRequestItems == null || this.data.actRequestItems.length == 0) {
        errors.push("At least one act request item should be defined");
    } else {
        for(var key in this.data.actRequestItems) {
            var actRequestItem = this.data.actRequestItems[key];
            if(actRequestItem.name == null || actRequestItem.name == "") {
                errors.push('Name for item ' + key + ' is not set');
            }
            if(actRequestItem.amount == null || actRequestItem.amount == "") {
                errors.push('Amount for item ' + key + ' is not set');
            } else if(!float2digitsRE.test(actRequestItem.amount)) {
                errors.push('Amount for item ' + key + ' has incorrect format. Digits, decimal point and two digits after the point are allowed only.');
            }
        }
    }
    return errors;
}
ActRequestEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var serverFormatData = clone(this.data);
    serverFormatData.date = getYearMonthDateFromDateString(serverFormatData.date);
    var form = this;
    var data = {};
    data.command = "saveActRequest";
    data.actRequestEditForm = getJSON(serverFormatData);
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
ActRequestEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}
ActRequestEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}




//==================================================

function ActRequestDeleteForm(actRequestId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "ActRequestEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": actRequestId
    }
}
ActRequestDeleteForm.prototype.init = function() {
    this.checkDependencies();
}
ActRequestDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkActRequestDependencies";
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
ActRequestDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.hasClosedStatusInHistory == true) {
        var html = 'This Invoice Request Packet was once closed and can not be deleted<br />';
        html += 'You can cancel it<br />';
        doAlert("Alert", html, null, null);
    } else if(dependencies.taxInvoiceRequest == true) {
        var html = 'Invoice Request Packet has Tax Invoice Request<br />';
        doAlert("Dependencies found", html, null, null);
    } else {
        this.show();
    }
}
ActRequestDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Proceed to delete this Act Request?", this, function() {this.doDeleteActRequest()}, null, null);
}
ActRequestDeleteForm.prototype.doDeleteActRequest = function() {
    var form = this;
    var data = {};
    data.command = "deleteActRequest";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Act Request has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ActRequestDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}

/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

InvoiceRequestsList = function(formData, htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder+ "InvoiceRequestsList.jsp"
    }
    this.moduleName = "Financial Information";
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.loaded = {
        "invoiceRequestPackets": [],
        "outOfPocketRequest": null
    }
    this.enums = {
        "types": {
            "FULL": "100%",
            "LIMITED" : "Limited",
            "NO" : "No"
        }
    }    
    this.projectCodeId = formData.projectCodeId;
    if(formData.invoiceRequestPackets != null) {
        this.loaded.invoiceRequestPackets = formData.invoiceRequestPackets;
    }   
    this.selected = {
        
    }
}
InvoiceRequestsList.prototype.init = function() {
    if(this.loaded.invoiceRequestPackets == null || this.loaded.invoiceRequestPackets.length == 0 || this.loaded.outOfPocketRequest == null) {
        this.loadAll();
    } else {
        this.show();
    }
}
InvoiceRequestsList.prototype.refreshInfo = function() {
    this.loadAll(this.projectCodeId);
}
InvoiceRequestsList.prototype.loadAll = function(id) {
    var form = this;
    var data = {};
    data.command = "getInvoiceRequestPackets";
    data.projectCodeId = this.projectCodeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'post',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {         
            form.loaded.invoiceRequestPackets = result.invoiceRequestPackets;
            form.loaded.outOfPocketRequest = result.outOfPocketRequest;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
InvoiceRequestsList.prototype.loadInvoiceRequestPacketHistoryItems = function(id) {
    var form = this;
    var data = {};
    data.command = "getInvoiceRequestPacketHistoryItems";
    data.invoiceRequestPacketId = id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'post',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {         
            form.loaded.invoiceRequestPacketHistoryItems = result.invoiceRequestPacketHistoryItems;
            form.showInvoiceRequestPacketHistoryItems();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
InvoiceRequestsList.prototype.loadInvoiceRequestPacketSummaryInfo = function(id) {
    var form = this;
    var data = {};
    data.command = "getInvoiceRequestPacketSummary";
    data.invoiceRequestPacketId = id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'post',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {         
            form.loaded.projectCode = result.projectCode;
            form.loaded.client = result.client;
            form.loaded.timeSpent = result.timeSpent;
            form.showInvoiceRequestPacketSummaryInfo();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
InvoiceRequestsList.prototype.loadOutOfPocketRequestHistoryItems = function(id) {
    var form = this;
    var data = {};
    data.command = "getOutOfPocketRequestHistoryItems";
    data.outOfPocketRequestId = id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'post',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {         
            form.loaded.outOfPocketRequestHistoryItems = result.outOfPocketRequestHistoryItems;
            form.showOutOfPocketRequestHistoryItems();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
InvoiceRequestsList.prototype.show = function() {
  $('#' + this.containerHtmlId).html(this.getHtml());
  this.updateView();
}
InvoiceRequestsList.prototype.getHtml = function() {
    var html = '';
    html += '<div id="' + this.htmlId + '_invoiceRequestList"></div>';
    html += '<div id="' + this.htmlId + '_outOfPocketRequest"></div>';
    return html;
}
InvoiceRequestsList.prototype.updateView = function() {
    this.updateInvoiceRequestsView();
    this.updateOutOfPocketRequestView();
}
InvoiceRequestsList.prototype.getHtmlForInvoiceRequest = function(invoiceRequest) {
    var html = '';
    var totalAmount = 0;
    for(var key in invoiceRequest.invoiceRequestItems) {
        var invoiceRequestItem = invoiceRequest.invoiceRequestItems[key];
        totalAmount += invoiceRequestItem.amount;
        html += '<tr>';
        html += '<td></td>';      
        html += '<td>' + invoiceRequestItem.name + '</td>';
        html += '<td>' + decimalVisualizer.getHtml(invoiceRequestItem.amount) + '</td>';
        html += '<td colspan="8"></td>';
        html += '</tr>';      
    }
    html += '<tr class="dgHighlight">';
    html += '<td>INVOICE</td>';
    html += '<td>' + invoiceRequest.description + '</td>';
    html += '<td>' + decimalVisualizer.getHtml(totalAmount) + '</td>';
    html += '<td>' + invoiceRequest.invoiceCurrencyCode + '</td>';
    html += '<td>' + invoiceRequest.paymentCurrencyCode + '</td>';
    html += '<td>' + invoiceRequest.clientName + '</td>';
    html += '<td>' + calendarVisualizer.getHtml(invoiceRequest.date) + '</td>';
    html += '<td>' + invoiceRequest.reference + '</td>';
    html += '<td ' + (invoiceRequest.isCancelled ? 'class="alert"' : '') + '>' + booleanVisualizer.getHtml(invoiceRequest.isCancelled) + '</td>';
    html += '<td><button id="' + this.htmlId + '_updateInvoiceRequestBtn_' + invoiceRequest.id + '">Update</button></td>';
    html += '<td><button id="' + this.htmlId + '_deleteInvoiceRequestBtn_' + invoiceRequest.id + '">Delete</button></td>';
    html += '</tr>';    
    return html;
}
InvoiceRequestsList.prototype.getHtmlForActRequest = function(actRequest) {
    var html = '';
    var totalAmount = 0;
    for(var key in actRequest.actRequestItems) {
        var actRequestItem = actRequest.actRequestItems[key];
        totalAmount += actRequestItem.amount;
        html += '<tr>';
        html += '<td></td>';
        html += '<td>' + actRequestItem.name + '</td>';
        html += '<td>' + decimalVisualizer.getHtml(actRequestItem.amount) + '</td>';
        html += '<td colspan="8"></td>';
        html += '</tr>';      
    }
    html += '<tr class="dgHighlight">';
    html += '<td>ACT</td>';
    html += '<td>' + actRequest.description + '</td>';
    html += '<td>' + decimalVisualizer.getHtml(totalAmount) + '</td>';
    html += '<td>' + actRequest.invoiceCurrencyCode + '</td>';
    html += '<td>' + actRequest.paymentCurrencyCode + '</td>';
    html += '<td>' + actRequest.clientName + '</td>';
    html += '<td>' + calendarVisualizer.getHtml(actRequest.date) + '</td>';
    html += '<td>' + actRequest.reference + '</td>';
    html += '<td ' + (actRequest.isCancelled ? 'class="alert"' : '') + '>' + booleanVisualizer.getHtml(actRequest.isCancelled) + '</td>';
    html += '<td><button id="' + this.htmlId + '_updateActRequestBtn_' + actRequest.id + '">Update</button></td>';
    html += '<td><button id="' + this.htmlId + '_deleteActRequestBtn_' + actRequest.id + '">Delete</button></td>';
    html += '</tr>'; 
    return html;
}
InvoiceRequestsList.prototype.getHtmlForTaxInvoiceRequest = function(taxInvoiceRequest) {
    var html = '';
    html += '<tr class="dgHighlight">';
    html += '<td>TAX INVOICE</td>';
    html += '<td colspan="6"></td>';
    html += '<td>' + taxInvoiceRequest.reference + '</td>';
    html += '<td ' + (taxInvoiceRequest.isCancelled ? 'class="alert"' : '') + '>' + booleanVisualizer.getHtml(taxInvoiceRequest.isCancelled) + '</td>';
    html += '<td><button id="' + this.htmlId + '_updateTaxInvoiceRequestBtn_' + taxInvoiceRequest.id + '">Update</button></td>';
    html += '<td><button id="' + this.htmlId + '_deleteTaxInvoiceRequestBtn_' + taxInvoiceRequest.id + '">Delete</button></td>';
    html += '</tr>'; 
    return html;
}
InvoiceRequestsList.prototype.updateInvoiceRequestsView = function() {
    var html = '';
    html += '<button id="' + this.htmlId + '_addInvoiceRequestPacketBtn' + '">Request packet</button><br />';
    if(this.loaded.invoiceRequestPackets.length == 0) {
        html += 'There are no requests for this project code<br />';
    } else {    
        for(var keyIRP in this.loaded.invoiceRequestPackets) {
            var invoiceRequestPacket = this.loaded.invoiceRequestPackets[keyIRP];
            var actRequest = invoiceRequestPacket.actRequest;
            var taxInvoiceRequest = invoiceRequestPacket.taxInvoiceRequest;
            html += '<table class="datagrid">';
            html += '<tr class="dgHeader"><td colspan="11">';
            html += 'Status: ' + invoiceRequestPacket.status + ', ';
            html += 'With VAT: ' + booleanVisualizer.getHtml(invoiceRequestPacket.withVAT);
            html += '</td></tr>';
            if(invoiceRequestPacket.comment != null && $.trim(invoiceRequestPacket.comment) != '') {
                html += '<tr class="dgHeader"><td colspan="11">';
                html += 'Comment: ' + invoiceRequestPacket.comment;
                html += '</td></tr>';
            }
            html += '<tr class="dgHeader">';
            html += '<td>Type</td>';
            html += '<td>Description</td>';
            html += '<td>Amount</td>';
            html += '<td>Invoice</td>';
            html += '<td>Payment</td>';
            html += '<td>Client</td>';
            html += '<td>Date</td>';
            html += '<td>Reference</td>';
            html += '<td>Cancelled</td>';
            html += '<td></td>';
            html += '<td></td>';
            html += '</tr>';
            for(var keyIR in invoiceRequestPacket.invoiceRequests) {
                var invoiceRequest = invoiceRequestPacket.invoiceRequests[keyIR];
                html += this.getHtmlForInvoiceRequest(invoiceRequest);
            }
            if(actRequest != null) {
                html += this.getHtmlForActRequest(actRequest);
            }
            if(taxInvoiceRequest != null) {
                html += this.getHtmlForTaxInvoiceRequest(taxInvoiceRequest);
            }
            html += '<tr><td colspan="11">';
            html += '<button id="' + this.htmlId + '_addInvoiceRequestBtn_' + invoiceRequestPacket.id + '">Add invoice request</button>';
            html += '<button id="' + this.htmlId + '_addActRequestBtn_' + invoiceRequestPacket.id + '">Add act request</button>';
            html += '<button id="' + this.htmlId + '_addTaxInvoiceRequestBtn_' + invoiceRequestPacket.id + '">Add tax invoice request</button>';
            html += '<button id="' + this.htmlId + '_updateInvoiceRequestPacketBtn_' + invoiceRequestPacket.id + '">Update invoice request packet</button>';
            html += '<button id="' + this.htmlId + '_deleteInvoiceRequestPacketBtn_' + invoiceRequestPacket.id + '">Delete invoice request packet</button>';
            html += '<button id="' + this.htmlId + '_showInvoiceRequestPacketHistoryBtn_' + invoiceRequestPacket.id + '">Show history</button>';
            html += '<button id="' + this.htmlId + '_showInvoiceRequestPacketSummaryBtn_' + invoiceRequestPacket.id + '">Summary</button>';
            html += '</td></tr>';
            html += '</table>';
        }
    }
    


    $('#' + this.htmlId + "_invoiceRequestList").html(html);

    var form = this;
    $('#' + this.htmlId + '_addInvoiceRequestPacketBtn')
      .button({
        icons: {
           primary: "ui-icon-plus"
        },
        text: true
        })
      .click(function( event ) {
        form.addInvoiceRequestPacket.call(form, event);
    });
    $('button[id^="' + this.htmlId + '_updateInvoiceRequestPacketBtn_"]')
      .button({
        icons: {
           primary: "ui-icon-pencil"
        },
        text: false
        })
      .click(function( event ) {
        form.updateInvoiceRequestPacket.call(form, event);
    });
    $('button[id^="' + this.htmlId + '_deleteInvoiceRequestPacketBtn_"]')
      .button({
        icons: {
           primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.deleteInvoiceRequestPacket.call(form, event);
    });
    $('button[id^="' + this.htmlId + '_showInvoiceRequestPacketHistoryBtn_"]')
      .button({
        icons: {
            primary: "ui-icon-comment"
        },
        text: false
        })
      .click(function( event ) {
        form.showInvoiceRequestPacketHistory.call(form, event);
    });
    $('button[id^="' + this.htmlId + '_showInvoiceRequestPacketSummaryBtn_"]')
      .button({
        icons: {
            primary: "ui-icon-folder-open"
        },
        text: true
        })
      .click(function( event ) {
        form.showInvoiceRequestPacketSummary.call(form, event);
    });
    
    $('button[id^="' + this.htmlId + '_addInvoiceRequestBtn_"]')
      .button({
        icons: {
           primary: "ui-icon-plus",
           secondary: "ui-icon-document"
        },
        text: false
        })
      .click(function( event ) {
        form.addInvoiceRequest.call(form, event);
    });
    

    $('button[id^="' + this.htmlId + '_addActRequestBtn_"]')
      .button({
        icons: {
           primary: "ui-icon-plus",
           secondary: "ui-icon-document-b"
        },
        text: false
        })
      .click(function( event ) {
        form.addActRequest.call(form, event);
    });
    
    $('button[id^="' + this.htmlId + '_addTaxInvoiceRequestBtn_"]')
      .button({
        icons: {
           primary: "ui-icon-plus",
           secondary: "ui-icon-copy"
        },
        text: false
        })
      .click(function( event ) {
        form.addTaxInvoiceRequest.call(form, event);
    });
    
    $('button[id^="' + this.htmlId + '_updateInvoiceRequestBtn_"]')
      .button({
        icons: {
            primary: "ui-icon-pencil"
        },
        text: false
        })
      .click(function( event ) {
        form.updateInvoiceRequest.call(form, event);
    });
    
    $('button[id^="' + this.htmlId + '_deleteInvoiceRequestBtn_"]')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.deleteInvoiceRequest.call(form, event);
    });


    $('button[id^="' + this.htmlId + '_updateActRequestBtn_"]')
      .button({
        icons: {
            primary: "ui-icon-pencil"
        },
        text: false
        })
      .click(function( event ) {
        form.updateActRequest.call(form, event);
    });
    
    $('button[id^="' + this.htmlId + '_deleteActRequestBtn_"]')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.deleteActRequest.call(form, event);
    });

    $('button[id^="' + this.htmlId + '_updateTaxInvoiceRequestBtn_"]')
      .button({
        icons: {
            primary: "ui-icon-pencil"
        },
        text: false
        })
      .click(function( event ) {
        form.updateTaxInvoiceRequest.call(form, event);
    });
    
    $('button[id^="' + this.htmlId + '_deleteTaxInvoiceRequestBtn_"]')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.deleteTaxInvoiceRequest.call(form, event);
    });

}
InvoiceRequestsList.prototype.updateOutOfPocketRequestView = function() {
    var html = '';
    if(this.loaded.outOfPocketRequest == null) {
        html += 'There is no Out of Pocket request<br />';
        html += '<button id="' + this.htmlId + '_addOutOfPocketRequestBtn' + '">Out of pocket request</button><br />';
    } else {    
        var outOfPocket = this.loaded.outOfPocketRequest;
        html += '<table class="datagrid">';
        html += '<tr class="dgHeader"><td colspan="6">';
        html += 'Out of pocket request';
        html += '</td></tr>';
        html += '<tr class="dgHeader">';
        html += '<td>Status</td>';
        html += '<td>Type</td>';
        html += '<td>Description</td>';
        if(outOfPocket.type == 'LIMITED') {
            html += '<td>Amount</td>';
            html += '<td>Currency</td>';
        }
        html += '<td>Has actual OOP</td>';
        html += '</tr>';

        html += '<tr>';
        html += '<td>' + outOfPocket.status + '</td>';
        html += '<td>' + this.enums.types[outOfPocket.type] + '</td>';
        html += '<td>' + outOfPocket.description + '</td>';
        if(outOfPocket.type == 'LIMITED') {
            html += '<td>' + outOfPocket.amount + '</td>';
            html += '<td>' + outOfPocket.currencyCode + '</td>';
        }
        html += '<td>' + booleanVisualizer.getHtml(outOfPocket.hasActualOutOfPocketExpenses) + '</td>';
        html += '</tr>';

        html += '<tr><td colspan="6">';
        html += '<button id="' + this.htmlId + '_updateOutOfPocketRequestBtn">Update out of pocket request</button>';
        html += '<button id="' + this.htmlId + '_deleteOutOfPocketRequestBtn">Delete out of pocket request</button>';
        html += '<button id="' + this.htmlId + '_showOutOfPocketRequestHistoryBtn">Show history</button>';
        html += '</td></tr>';
        html += '</table>';
    }

    $('#' + this.htmlId + "_outOfPocketRequest").html(html);

    var form = this;
    $('#' + this.htmlId + '_addOutOfPocketRequestBtn')
      .button({
        icons: {
           primary: "ui-icon-plus"
        },
        text: true
        })
      .click(function( event ) {
        form.addOutOfPocketRequest.call(form, event);
    });
    
    $('#' + this.htmlId + '_updateOutOfPocketRequestBtn')
      .button({
        icons: {
           primary: "ui-icon-pencil"
        },
        text: false
        })
      .click(function( event ) {
        form.updateOutOfPocketRequest.call(form, event);
    });
    $('#' + this.htmlId + '_deleteOutOfPocketRequestBtn')
      .button({
        icons: {
           primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.deleteOutOfPocketRequest.call(form, event);
    });
    $('#' + this.htmlId + '_showOutOfPocketRequestHistoryBtn')
      .button({
        icons: {
            primary: "ui-icon-comment"
        },
        text: false
        })
      .click(function( event ) {
        form.showOutOfPocketRequestHistory.call(form, event);
    });
}
InvoiceRequestsList.prototype.showInvoiceRequestPacketHistoryItems = function() {
    var message = '';
    message += '<table class="datagrid">';
    message += '<tr class="dgHeader">';
    message += '<td>Status</td>';
    message += '<td>Comment</td>';
    message += '<td>Time</td>';
    message += '<td>Employee</td>';
    message += '</tr>';
    for(var key in this.loaded.invoiceRequestPacketHistoryItems) {
        var invoiceRequestPacketHistoryItem = this.loaded.invoiceRequestPacketHistoryItems[key];
        message += '<tr>';
        message += '<td>' + invoiceRequestPacketHistoryItem.status + '</td>';
        message += '<td>' + invoiceRequestPacketHistoryItem.comment + '</td>';
        message += '<td>' + getStringFromYearMonthDateTime(invoiceRequestPacketHistoryItem.time) + '</td>';
        message += '<td>' + invoiceRequestPacketHistoryItem.employeeUserName + '</td>';
        message += '</tr>';
    }
    message += '</table>';
    showPopup('Invoice request packet history', message, 400, 400, null, null);    
}
InvoiceRequestsList.prototype.showInvoiceRequestPacketSummaryInfo = function() {
    var invoiceRequestPacket = null;
    for(var keyIRP in this.loaded.invoiceRequestPackets) {
        if(this.loaded.invoiceRequestPackets[keyIRP].id == this.selected.invoiceRequestPacketId) {
            invoiceRequestPacket = this.loaded.invoiceRequestPackets[keyIRP];
            break;
        }
    }    
    var actRequest = invoiceRequestPacket.actRequest;
    var taxInvoiceRequest = invoiceRequestPacket.taxInvoiceRequest;

            //html += 'Status: ' + invoiceRequestPacket.status + ', ';
            //html += 'With VAT: ' + booleanVisualizer.getHtml(invoiceRequestPacket.withVAT);
            //if(invoiceRequestPacket.comment != null && $.trim(invoiceRequestPacket.comment) != '') {
            //    html += 'Comment: ' + invoiceRequestPacket.comment;
            //}
            //for(var keyIR in invoiceRequestPacket.invoiceRequests) {
            //    var invoiceRequest = invoiceRequestPacket.invoiceRequests[keyIR];
            //    html += this.getHtmlForInvoiceRequest(invoiceRequest);
            //}
            //if(actRequest != null) {
            //    html += this.getHtmlForActRequest(actRequest);
            //}
            //if(taxInvoiceRequest != null) {
            //    html += this.getHtmlForTaxInvoiceRequest(taxInvoiceRequest);
            //}
            
   
    var message = '';
    message += '<br />';
    message += '<table class="datagrid">';
    message += '<tr>';
    message += '<td><span class="label1">Project code</span></td>';
    message += '<td>' + this.loaded.projectCode.code + '</td>';
    message += '</tr>';
    for(var keyIR in invoiceRequestPacket.invoiceRequests) {
        var invoiceRequest = invoiceRequestPacket.invoiceRequests[keyIR];
        var totalAmount = 0;
        for(var keyIRI in invoiceRequest.invoiceRequestItems) {
            var invoiceRequestItem = invoiceRequest.invoiceRequestItems[keyIRI];
            totalAmount += invoiceRequestItem.amount;
        }
        
        message += '<tr>';
        message += '<td><span class="label1">Client</span></td>';
        message += '<td>' + invoiceRequest.clientName + '</td>';
        message += '</tr>';
        
        for(var keyIRI in invoiceRequest.invoiceRequestItems) {
            var invoiceRequestItem = invoiceRequest.invoiceRequestItems[keyIRI];
            message += '<tr>';
            message += '<td><span class="label1">Description</span></td>';
            message += '<td>' + invoiceRequestItem.name + ": " + invoiceRequestItem.amount + ' ' + invoiceRequest.invoiceCurrencyCode + '</td>';
            message += '</tr>';            
        }     
        
        //message += '<tr>';
        //message += '<td><span class="label1">Description</span></td>';
        //message += '<td>' + invoiceRequest.description + '</td>';
        //message += '</tr>';
        
        message += '<tr>';
        message += '<td><span class="label1">Amount without VAT</span></td>';
        message += '<td>' + decimalVisualizer.getHtml(totalAmount) + ' ' + invoiceRequest.invoiceCurrencyCode + '</td>';
        message += '</tr>';
        message += '<tr>';
        message += '<td><span class="label1">Invoice reference</span></td>';
        message += '<td>' + (invoiceRequest.reference != null ? invoiceRequest.reference : '') + '</td>';
        message += '</tr>';
        message += '<tr>';
        message += '<td><span class="label1">Date</span></td>';
        message += '<td>' + (invoiceRequest.date != null ? calendarVisualizer.getHtml(invoiceRequest.date) : '') + '</td>';
        message += '</tr>';
    }
    if(actRequest != null) {
        message += '<tr>';
        message += '<td><span class="label1">Act reference</span></td>';
        message += '<td>' + (actRequest.reference != null ? actRequest.reference : '') + '</td>';
        message += '</tr>';
        message += '<tr>';
        message += '<td><span class="label1">Date</span></td>';
        message += '<td>' + (actRequest.date != null ? calendarVisualizer.getHtml(actRequest.date) : '') + '</td>';
        message += '</tr>';
    }
    if(taxInvoiceRequest != null) {
        message += '<tr>';
        message += '<td><span class="label1">Tax invoice reference</span></td>';
        message += '<td>' + (taxInvoiceRequest.reference != null ? taxInvoiceRequest.reference : '') + '</td>';
        message += '</tr>';
    }
    message += '<tr>';
    message += '<td><span class="label1">Time spent, H</span></td>';
    message += '<td>' + minutesAsHoursVisualizer.getHtml(this.loaded.timeSpent) + '</td>';
    message += '</tr>';
    message += '</table>';
    message += '<br />';
    showPopup('Invoice request packet summary', message, 700, 400, null, null)        
}
InvoiceRequestsList.prototype.addInvoiceRequestPacket = function(event) {
    var formData = {
        "id": null,
        "projectCodeId": this.projectCodeId,
        "clientId" : null,
        "description" : null,
        "date" : null,
        "invoiceCurrencyId" : null,
        "paymentCurrencyId": null,
        "status": null,
        "invoiceRequestItems": [],
        "comment": null,
        "withVAT": false
    };
    formData.invoiceRequestItems.push({"name": null, "amount": null});
    var invoiceRequestPacketCreationForm = new InvoiceRequestPacketCreationForm(formData, this.moduleName,  "invoiceRequestPacketCreationForm", this.refreshInfo, this);
    invoiceRequestPacketCreationForm.init();
}
InvoiceRequestsList.prototype.updateInvoiceRequestPacket = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    var invoiceRequestPacket = null;
    for(var key in this.loaded.invoiceRequestPackets) {
        var invoiceRequestPacketTmp = this.loaded.invoiceRequestPackets[key];
        if(id == invoiceRequestPacketTmp.id) {
            invoiceRequestPacket = invoiceRequestPacketTmp;
            break;
        }
    }
    var formData = {
        "id": invoiceRequestPacket.id,
        "projectCodeId": invoiceRequestPacket.projectCodeId,
        "status": invoiceRequestPacket.status,
        "comment": invoiceRequestPacket.comment,
        "withVAT": invoiceRequestPacket.withVAT
    };
    var invoiceRequestPacketEditForm = new InvoiceRequestPacketEditForm(formData, this.moduleName,  "invoiceRequestPacketEditForm", this.refreshInfo, this);
    invoiceRequestPacketEditForm.init();
}
InvoiceRequestsList.prototype.deleteInvoiceRequestPacket = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);    
    var invoiceRequestPacketDeleteForm = new InvoiceRequestPacketDeleteForm(id, this.refreshInfo, this);
    invoiceRequestPacketDeleteForm.init();
}
InvoiceRequestsList.prototype.addInvoiceRequest = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    var formData = {
        "mode": 'CREATE',
        "id": null,
        "invoiceRequestPacketId": id,
        "clientId" : null,
        "description" : null,
        "date" : null,
        "invoiceCurrencyId" : null,
        "paymentCurrencyId": null,
        "status": null,
        "invoiceRequestItems": [],
        "isCancelled": false
    };
    formData.invoiceRequestItems.push({"name": null, "amount": null});
    var invoiceRequestEditForm = new InvoiceRequestEditForm(formData, this.moduleName,  "invoiceRequestEditForm", this.refreshInfo, this);
    invoiceRequestEditForm.init();
}
InvoiceRequestsList.prototype.addActRequest = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    var invoiceRequestPacket = null;
    for(var key in this.loaded.invoiceRequestPackets) {
        var invoiceRequestPacketTmp = this.loaded.invoiceRequestPackets[key];
        if(id == invoiceRequestPacketTmp.id) {
            invoiceRequestPacket = invoiceRequestPacketTmp;
            break;
        }
    }
    if(invoiceRequestPacket.actRequest != null) {
        doAlert('Alert', 'This packet has Act Request', null, null);
        return;
    }
    var formData = {
        "mode": 'CREATE',
        "id": null,
        "invoiceRequestPacketId": id,
        "clientId" : null,
        "description" : null,
        "date" : null,
        "invoiceCurrencyId" : null,
        "paymentCurrencyId": null,
        "status": null,
        "actRequestItems": [],
        "isCancelled": false
    };
    var actRequestEditForm = new ActRequestEditForm(formData, this.moduleName,  "actRequestEditForm", this.refreshInfo, this);
    actRequestEditForm.init();
}
InvoiceRequestsList.prototype.addTaxInvoiceRequest = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    var invoiceRequestPacket = null;
    for(var key in this.loaded.invoiceRequestPackets) {
        var invoiceRequestPacketTmp = this.loaded.invoiceRequestPackets[key];
        if(id == invoiceRequestPacketTmp.id) {
            invoiceRequestPacket = invoiceRequestPacketTmp;
            break;
        }
    }
    if(invoiceRequestPacket.taxInvoiceRequest != null) {
        doAlert('Alert', 'This packet has Tax Invoice Request', null, null);
        return;
    }
    var formData = {
        "mode": 'CREATE',
        "id": null,
        "invoiceRequestPacketId": id,
        "withVAT" : false,
        "status": null,
        "isCancelled": false
    };
    var taxInvoiceRequestEditForm = new TaxInvoiceRequestEditForm(formData, this.moduleName,  "taxInvoiceRequestEditForm", this.refreshInfo, this);
    taxInvoiceRequestEditForm.init();
}
InvoiceRequestsList.prototype.updateInvoiceRequest = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);

    var invoiceRequest = null;
    var invoiceRequestPacket = null;
    for(var key in this.loaded.invoiceRequestPackets) {
        var invoiceRequestPacketTmp = this.loaded.invoiceRequestPackets[key];
        for(var key2 in invoiceRequestPacketTmp.invoiceRequests) {
            var invoiceRequestTmp = invoiceRequestPacketTmp.invoiceRequests[key2];
            if(id == invoiceRequestTmp.id) {
                invoiceRequest = invoiceRequestTmp;
                invoiceRequestPacket = invoiceRequestPacketTmp;
                break;
            }
        }
    }
    if(invoiceRequestPacket.status == 'LOCKED') {
        doAlert("Alert", 'This invoice request packet is locked and can not be edited', null, null);
        return;     
    }
    var formData = {};
    formData.mode = 'UPDATE';
    formData.id = invoiceRequest.id;
    formData.invoiceRequestPacketId = invoiceRequestPacket.id;
    formData.clientId = invoiceRequest.clientId;
    formData.actRequestId = invoiceRequest.actRequestId;
    formData.description = invoiceRequest.description;
    formData.date = calendarVisualizer.getHtml(invoiceRequest.date);
    formData.invoiceCurrencyId = invoiceRequest.invoiceCurrencyId;
    formData.paymentCurrencyId = invoiceRequest.paymentCurrencyId;
    formData.status = invoiceRequestPacket.status;
    formData.isCancelled = invoiceRequest.isCancelled;
    formData.invoiceRequestItems = invoiceRequest.invoiceRequestItems;
    var invoiceRequestEditForm = new InvoiceRequestEditForm(formData, this.moduleName,  "invoiceRequestEditForm", this.refreshInfo, this);
    invoiceRequestEditForm.init();
}
InvoiceRequestsList.prototype.updateActRequest = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);    

    var actRequest = null;
    var invoiceRequestPacket = null;
    for(var key in this.loaded.invoiceRequestPackets) {
        var invoiceRequestPacketTmp = this.loaded.invoiceRequestPackets[key];
        if(invoiceRequestPacketTmp.actRequest != null) {
            if(id == invoiceRequestPacketTmp.actRequest.id) {
                actRequest = invoiceRequestPacketTmp.actRequest;
                invoiceRequestPacket = invoiceRequestPacketTmp;
                break;
            }
        }
    }
    if(invoiceRequestPacket.status == 'LOCKED') {
        doAlert("Alert", 'This invoice request packet is locked and can not be edited', null, null);
        return;     
    }      
    
    var formData = {};
    formData.mode = 'UPDATE';
    formData.id = actRequest.id;
    formData.invoiceRequestPacketId = invoiceRequestPacket.id;
    formData.clientId = actRequest.clientId;
    formData.description = actRequest.description;
    formData.date = calendarVisualizer.getHtml(actRequest.date);
    formData.invoiceCurrencyId = actRequest.invoiceCurrencyId;
    formData.paymentCurrencyId = actRequest.paymentCurrencyId;
    formData.status = invoiceRequestPacket.status;
    formData.isCancelled = actRequest.isCancelled;
    formData.actRequestItems = actRequest.actRequestItems;
    var actRequestEditForm = new ActRequestEditForm(formData, this.moduleName,  "actRequestEditForm", this.refreshInfo, this);
    actRequestEditForm.init();

}
InvoiceRequestsList.prototype.updateTaxInvoiceRequest = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);    

    var taxInvoiceRequest = null;
    var invoiceRequestPacket = null;
    for(var key in this.loaded.invoiceRequestPackets) {
        var invoiceRequestPacketTmp = this.loaded.invoiceRequestPackets[key];
        if(invoiceRequestPacketTmp.taxInvoiceRequest != null) {
            if(id == invoiceRequestPacketTmp.taxInvoiceRequest.id) {
                taxInvoiceRequest = invoiceRequestPacketTmp.taxInvoiceRequest;
                invoiceRequestPacket = invoiceRequestPacketTmp;
                break;
            }
        }
    }
    if(invoiceRequestPacket.status == 'LOCKED') {
        doAlert("Alert", 'This invoice request packet is locked and can not be edited', null, null);
        return;     
    }      
    
    var formData = {};
    formData.mode = 'UPDATE';
    formData.id = taxInvoiceRequest.id;
    formData.invoiceRequestPacketId = invoiceRequestPacket.id;
    formData.actRequestId = taxInvoiceRequest.actRequestId;
    formData.withVAT = taxInvoiceRequest.withVAT;
    formData.status = invoiceRequestPacket.status;
    formData.isCancelled = taxInvoiceRequest.isCancelled;
    var taxInvoiceRequestEditForm = new TaxInvoiceRequestEditForm(formData, this.moduleName,  "taxInvoiceRequestEditForm", this.refreshInfo, this);
    taxInvoiceRequestEditForm.init();        
}
InvoiceRequestsList.prototype.deleteInvoiceRequest = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);    
    var invoiceRequestDeleteForm = new InvoiceRequestDeleteForm(id, this.refreshInfo, this);
    invoiceRequestDeleteForm.init();
}
InvoiceRequestsList.prototype.deleteActRequest = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);    
    var actRequestDeleteForm = new ActRequestDeleteForm(id, this.refreshInfo, this);
    actRequestDeleteForm.init();
}
InvoiceRequestsList.prototype.deleteTaxInvoiceRequest = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);    
    var taxInvoiceRequestDeleteForm = new TaxInvoiceRequestDeleteForm(id, this.refreshInfo, this);
    taxInvoiceRequestDeleteForm.init();
}
InvoiceRequestsList.prototype.showInvoiceRequestPacketHistory = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    this.loadInvoiceRequestPacketHistoryItems(id);
}
InvoiceRequestsList.prototype.showInvoiceRequestPacketSummary = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    this.selected.invoiceRequestPacketId = id;
    this.loadInvoiceRequestPacketSummaryInfo(id);
}
InvoiceRequestsList.prototype.showActRequestHistory = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    this.loadActRequestHistoryItems(id);
}
InvoiceRequestsList.prototype.showTaxInvoiceRequestHistory = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);    
    this.loadTaxInvoiceRequestHistoryItems(id);
}

InvoiceRequestsList.prototype.addOutOfPocketRequest = function(event) {
    var description = '';
    if(this.loaded.invoiceRequestPackets != null && this.loaded.invoiceRequestPackets.length != 0) {
        var lastInvoiceRequestPacket = this.loaded.invoiceRequestPackets[this.loaded.invoiceRequestPackets.length - 1];
        if(lastInvoiceRequestPacket.invoiceRequests != null && lastInvoiceRequestPacket.invoiceRequests.length != 0) {
            description = lastInvoiceRequestPacket.invoiceRequests[lastInvoiceRequestPacket.invoiceRequests.length - 1].description;
        }        
    }
    var formData = {
        "mode": 'CREATE',
        "id": null,
        "projectCodeId": this.projectCodeId,
        "status": 'SUSPENDED',
        "type" : null,
        "amount": null,
        "description": description,
        "currencyId": null
    };
    var outOfPocketRequestEditForm = new OutOfPocketRequestEditForm(formData, this.moduleName,  "outOfPocketRequestEditForm", this.refreshInfo, this);
    outOfPocketRequestEditForm.init();
}
InvoiceRequestsList.prototype.updateOutOfPocketRequest = function(event) {
    var outOfPocketRequest = this.loaded.outOfPocketRequest;
    var formData = {
        "mode": 'UPDATE',
        "id": outOfPocketRequest.id,
        "projectCodeId": this.projectCodeId,
        "status": outOfPocketRequest.status,
        "type" : outOfPocketRequest.type,
        "amount": outOfPocketRequest.amount,
        "description": outOfPocketRequest.description,
        "currencyId": outOfPocketRequest.currencyId
    };
    var outOfPocketRequestEditForm = new OutOfPocketRequestEditForm(formData, this.moduleName,  "outOfPocketRequestEditForm", this.refreshInfo, this);
    outOfPocketRequestEditForm.init();
}
InvoiceRequestsList.prototype.deleteOutOfPocketRequest = function(event) {
    var id = this.loaded.outOfPocketRequest.id;    
    var outOfPocketRequestDeleteForm = new OutOfPocketRequestDeleteForm(id, this.refreshInfo, this);
    outOfPocketRequestDeleteForm.init();
}
InvoiceRequestsList.prototype.showOutOfPocketRequestHistory = function(event) {
    var id = this.loaded.outOfPocketRequest.id;
    this.loadOutOfPocketRequestHistoryItems(id);
}
InvoiceRequestsList.prototype.showOutOfPocketRequestHistoryItems = function() {
    var message = '';
    message += '<table class="datagrid">';
    message += '<tr class="dgHeader">';
    message += '<td>Status</td>';
    message += '<td>Comment</td>';
    message += '<td>Time</td>';
    message += '<td>Employee</td>';
    message += '</tr>';
    for(var key in this.loaded.outOfPocketRequestHistoryItems) {
        var outOfPocketRequestHistoryItem = this.loaded.outOfPocketRequestHistoryItems[key];
        message += '<tr>';
        message += '<td>' + outOfPocketRequestHistoryItem.status + '</td>';
        message += '<td>' + outOfPocketRequestHistoryItem.comment + '</td>';
        message += '<td>' + getStringFromYearMonthDateTime(outOfPocketRequestHistoryItem.time) + '</td>';
        message += '<td>' + outOfPocketRequestHistoryItem.employeeUserName + '</td>';
        message += '</tr>';
    }
    message += '</table>';
    showPopup('Out of pocket request packet history', message, 400, 400, null, null)    
}


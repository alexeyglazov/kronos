/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function InvoiceRequestReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "InvoiceRequestReport.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.moduleName = "Financial Information Report";
    this.invoiceRequestsFilter = InvoiceRequestsFilter.prototype.getDefaultFilter();
    this.filter = ProjectCodesListFilter.prototype.getDefaultFilter(); 
    
    this.sorter = {
        "field": 'CODE',
        "order": 'ASC'
    };
    this.limiter = {
        "page": 0,
        "itemsPerPage": 10
    };
    this.reports = {};
}
InvoiceRequestReport.prototype.init = function() {
    contentSizeChangedEventSubscribers.push({"context": this, "function": this.normalizeContentSize});
    this.show();
}
InvoiceRequestReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeButtons();
    this.updateView();
    this.setHandlers();
    this.normalizeContentSize();
}
InvoiceRequestReport.prototype.getHtml = function() {
    var html = '';
    html += '<fieldset>';
    html += '<table>';
    html += '<tr>';
    html += '<td id="' + this.htmlId + '_filterCell"><button id="' + this.htmlId + '_filterBtn">Project code filter</button></td>';
    html += '<td id="' + this.htmlId + '_invoiceRequestsFilterCell"><button id="' + this.htmlId + '_invoiceRequestsFilterBtn">Invoice filter</button></td>';
    html += '</tr>';
    html += '</table>';
    html += '<table>';
    html += '<tr><td><input type="button" id="' + this.htmlId + '_generateBtn' + '" value="Generate"><input type="button" id="' + this.htmlId + '_generateXLSBtn' + '" value="Generate XLS"></td></tr>';
    html += '</table>';

    html += '</fieldset>';
    html += '<div id="' + this.htmlId + '_heading"></div>';
    html += '<div id="' + this.htmlId + '_report"></div>';
    html += '<form id="' + this.htmlId + '_xlsForm' + '" target="_blank" action="' + this.config.endpointUrl + '" method="post">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_command' + '" name="command" value="">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_filter' + '" name="filter" value="">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_invoiceRequestsFilter' + '" name="invoiceRequestsFilter" value="">';
    html += '</form>';
    html += '<div id="' + this.htmlId + '_info"></div>';
    return html;
}
InvoiceRequestReport.prototype.makeButtons = function() {
    var form = this;
    $('#' + this.htmlId + '_filterBtn')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: true
        })
      .click(function( event ) {
        form.showFilter.call(form);
    });

    $('#' + this.htmlId + '_invoiceRequestsFilterBtn')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: true
        })
      .click(function( event ) {
        form.showInvoiceRequestsFilter.call(form);
    });
}    
InvoiceRequestReport.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_generateBtn').bind("click", function(event) {form.startGenerating.call(form, event)});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
}

InvoiceRequestReport.prototype.showFilter = function() {
    this.filterForm = new ProjectCodesListFilter("projectCodesListFilter", this.moduleName, this.filter, this.acceptFilterData, this);
    this.filterForm.init();
}
InvoiceRequestReport.prototype.showInvoiceRequestsFilter = function() {
    this.invoiceRequestsFilterForm = new InvoiceRequestsFilter("invoiceRequestsFilter", this.moduleName, this.invoiceRequestsFilter, this.acceptInvoiceRequestsFilterData, this);
    this.invoiceRequestsFilterForm.init(); 
}
InvoiceRequestReport.prototype.acceptFilterData = function(filter) {
    this.limiter.page = 0;
    this.filter = filter;
    var filterStr = getJSON(this.filter);
    var expire = new Date();
    expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 100);
    setCookie("projectCodesListFilter", filterStr, expire.toGMTString(), null);
    this.updateFilterSelectionView();
}
InvoiceRequestReport.prototype.acceptInvoiceRequestsFilterData = function(invoiceRequestsFilter) {
    this.limiter.page = 0;
    this.invoiceRequestsFilter = invoiceRequestsFilter;
//    var filterStr = getJSON(this.filter);
//    var expire = new Date();
//    expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 100);
//    setCookie("projectCodesListFilter", filterStr, expire.toGMTString(), null);
    this.updateFilterSelectionView();
}

InvoiceRequestReport.prototype.updateView = function() {
    this.updateFilterSelectionView();
}
InvoiceRequestReport.prototype.updateFilterSelectionView = function() {
    if(ProjectCodesListFilter.prototype.isFilterUsed(this.filter)) {
        $('#' + this.htmlId + '_filterCell').css('border-left', '3px solid #009900');
    } else {
        $('#' + this.htmlId + '_filterCell').css('border-left', '0px');
    }
    if(InvoiceRequestsFilter.prototype.isFilterUsed(this.invoiceRequestsFilter)) {
        $('#' + this.htmlId + '_invoiceRequestsFilterCell').css('border-left', '3px solid #009900');
    } else {
        $('#' + this.htmlId + '_invoiceRequestsFilterCell').css('border-left', '0px');
    }
}
InvoiceRequestReport.prototype.validate = function() {
    var errors = [];
    var numberRE = /^[0-9]*[\.]?[0-9]*$/;
    return errors;
}
InvoiceRequestReport.prototype.startGeneratingXLS = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
      this.generateXLSReport();
    }
}
InvoiceRequestReport.prototype.generateXLSReport = function() {
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReport');
    $('#' + this.htmlId + '_xlsForm_filter').val(getJSON(this.filter));
    $('#' + this.htmlId + '_xlsForm_invoiceRequestsFilter').val(getJSON(this.invoiceRequestsFilter));
    $('#' + this.htmlId + '_xlsForm').submit();
}
InvoiceRequestReport.prototype.startGenerating = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
      this.generateReport();
    }
}
InvoiceRequestReport.prototype.generateReport = function() {
    var form = this;
    var data = {};
    data.command = "generateReport";
    data.filter = getJSON(this.filter);
    data.invoiceRequestsFilter = getJSON(this.invoiceRequestsFilter);
    $.ajax({
        url: this.config.endpointUrl,
        data: data,
        cache: false,
        type: "POST",
        success: function(data){
            ajaxResultHandle(data, form, function(result) {
                form.invoiceRequestReport = result.invoiceRequestReport;
                form.updateReportView();
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
        }
    });
}
InvoiceRequestReport.prototype.updateReportView = function() {
    this.updateReportHeaderView();
    this.updateReportBodyView();
}
InvoiceRequestReport.prototype.updateReportHeaderView = function(financialYear) {
    var headingHtml = '';
    headingHtml += '<table class="datagrid">';
    headingHtml += '<tr><td>Project code filter is used</td><td>' + booleanVisualizer.getHtml(this.invoiceRequestReport.isFilterUsed) + '</td></tr>';
    headingHtml += '<tr><td>Invoice requests filter is used</td><td>' + booleanVisualizer.getHtml(this.invoiceRequestReport.isInvoiceRequestsFilterUsed) + '</td></tr>';
    headingHtml += '<tr><td>Report generated at</td><td>' + getStringFromYearMonthDateTime(this.invoiceRequestReport.createdAt) + '</td></tr>';
    headingHtml += '</table>';
    $('#' + this.htmlId + '_heading').html(headingHtml);    
}
InvoiceRequestReport.prototype.updateReportBodyView = function(financialYear) {
    var html = "";
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td colspan="' + (16 + this.invoiceRequestReport.currencies.length*3) + '">Invoice Request Report</td></tr>';
    html += '<tr class="dgHeader">';
    html += '<td colspan="9"></td>';
    html += '<td colspan="' + (this.invoiceRequestReport.currencies.length) + '">Invoices to issue</td>';
    html += '<td colspan="' + (2 + this.invoiceRequestReport.currencies.length) + '">Invoices</td>';
    html += '<td colspan="' + (3 + this.invoiceRequestReport.currencies.length) + '">Act</td>';
    html += '<td colspan="2">Tax Invoice</td>';
    html += '</tr>';
    html += '<tr class="dgHeader">';
    html += '<td>Client</td>';
    html += '<td>Project Code</td>';
    html += '<td>Description</td>';
    html += '<td>CreatedAt</td>';
    html += '<td>ClosedAt</td>';
    html += '<td>Time spent</td>';
    html += '<td>Last filling day</td>';
    html += '<td>Status</td>';
    html += '<td>With VAT</td>';
    for(var key in this.invoiceRequestReport.currencies) {
        var currency = this.invoiceRequestReport.currencies[key];
        html += '<td>' + currency.code + '</td>';
    }
    for(var key in this.invoiceRequestReport.currencies) {
        var currency = this.invoiceRequestReport.currencies[key];
        html += '<td>' + currency.code + '</td>';
    }
    html += '<td>Date</td>';
    html += '<td>Reference</td>';    
    html += '<td></td>';             
    for(var key in this.invoiceRequestReport.currencies) {
        var currency = this.invoiceRequestReport.currencies[key];
        html += '<td>' + currency.code + '</td>';
    }
    html += '<td>Date</td>';
    html += '<td>Reference</td>';
    html += '<td></td>';             
    html += '<td>Reference</td>';
    html += '</tr>';

    for(var key in this.invoiceRequestReport.blocks) {
        var invoiceRequestTotalAmountSums = {};
        var block = this.invoiceRequestReport.blocks[key];
        for(var key in block.invoiceRequestEntries) {
            var invoiceRequestEntry = block.invoiceRequestEntries[key];
            html += '<tr>';
            html += '<td colspan="9"></td>';
            html += '<td colspan="' + (this.invoiceRequestReport.currencies.length) + '"></td>';
            for(var key in this.invoiceRequestReport.currencies) {
                var currency = this.invoiceRequestReport.currencies[key];               
                if(currency.id == invoiceRequestEntry.invoiceCurrencyId) {
                    if(invoiceRequestTotalAmountSums[currency.id] == null) {
                        invoiceRequestTotalAmountSums[currency.id] = invoiceRequestEntry.totalAmount;
                    } else {
                        invoiceRequestTotalAmountSums[currency.id] += invoiceRequestEntry.totalAmount;
                    }                    
                    html += '<td>' + invoiceRequestEntry.totalAmount + '</td>';
                } else {
                    html += '<td></td>';
                } 
            }
            html += '<td>' + getStringFromYearMonthDate(invoiceRequestEntry.date) + '</td>';
            html += '<td>' + (invoiceRequestEntry.reference != null ? invoiceRequestEntry.reference : '')  + '</td>';
            html += '<td colspan="' + (2 + this.invoiceRequestReport.currencies.length) + '"></td>';
            html += '<td colspan="' + (2 + this.invoiceRequestReport.currencies.length) + '"></td>';            
            html += '</tr>';            
        }
        html += '<tr>';
        html += '<td>' + block.clientName + '</td>';
        html += '<td>' + block.projectCodeCode + '</td>';
        html += '<td>' + block.projectCodeDescription + '</td>';
        html += '<td>' + getStringFromYearMonthDateTime(block.projectCodeCreatedAt) + '</td>';
        html += '<td>' + getStringFromYearMonthDateTime(block.projectCodeClosedAt) + '</td>';
        html += '<td>' + minutesAsHoursVisualizer.getHtml(block.timeSpent) + '</td>';
        html += '<td>' + calendarVisualizer.getHtml(block.lastFillingDay) + '</td>';
        html += '<td>' + (block.status == null ? 'NO PACKET' : block.status) + '</td>';
        html += '<td>' + booleanVisualizer.getHtml(block.withVAT) + '</td>';
        
        var feesAdvanceEntry = block.feesAdvanceEntry;
        if(feesAdvanceEntry != null) {           
            for(var key in this.invoiceRequestReport.currencies) {
                var currency = this.invoiceRequestReport.currencies[key];        
                if(feesAdvanceEntry.feesAdvanceCurrencyId == currency.id) {
                    html += '<td>' + feesAdvanceEntry.totalAmount + '</td>';
                } else {
                    html += '<td></td>';
                }
            }
        } else {       
            for(var key in this.invoiceRequestReport.currencies) {
                html += '<td></td>';
            }
        }
        
        for(var key in this.invoiceRequestReport.currencies) {
            var currency = this.invoiceRequestReport.currencies[key];
            if(invoiceRequestTotalAmountSums[currency.id] != null) {
                html += '<td>' + invoiceRequestTotalAmountSums[currency.id] + '</td>';
            } else {
                html += '<td></td>';
            }
        }
        html += '<td>-</td>';
        html += '<td>-</td>';
        
        var actRequestEntry = block.actRequestEntry;
        if(actRequestEntry != null) {
            html += '<td>Yes</td>';            
            for(var key in this.invoiceRequestReport.currencies) {
                var currency = this.invoiceRequestReport.currencies[key];        
                if(actRequestEntry.invoiceCurrencyId == currency.id) {
                    html += '<td>' + actRequestEntry.totalAmount + '</td>';
                } else {
                    html += '<td></td>';
                }
            }
            html += '<td>' + getStringFromYearMonthDate(actRequestEntry.date) + '</td>';
            html += '<td>' + (actRequestEntry.reference != null ? actRequestEntry.reference : '')  + '</td>';
        } else {
            html += '<td>No</td>';            
            for(var key in this.invoiceRequestReport.currencies) {
                html += '<td></td>';
            }
            html += '<td></td>';
            html += '<td></td>';
        }
        
        var taxInvoiceRequestEntry = block.taxInvoiceRequestEntry;
        if(taxInvoiceRequestEntry != null) {
            html += '<td>Yes</td>';            
            html += '<td>' + (taxInvoiceRequestEntry.reference != null ? taxInvoiceRequestEntry.reference : '')  + '</td>';
        } else {
            html += '<td>No</td>';            
            html += '<td></td>';            
        }  

        html += '</tr>';
    }
    html += '</table>';
    $('#' + this.htmlId + '_report').html(html);
}

InvoiceRequestReport.prototype.normalizeContentSize = function() {
    var layoutWidth = contentWidth - 10;
    var layoutHeight = contentHeight - 100;
    
    jQuery('#' + this.htmlId + '_report_body').jqGrid('setGridWidth', layoutWidth -50);
    jQuery('#' + this.htmlId + '_report_body').jqGrid('setGridHeight', layoutHeight - 75);
}
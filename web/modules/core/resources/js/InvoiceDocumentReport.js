/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function InvoiceDocumentReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "InvoiceDocumentReport.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.loaded = {
    };
    this.moduleName = "Financial Information Report";
    
    this.invoiceRequestsFilter = InvoiceRequestsFilter.prototype.getDefaultFilter();
    this.filter = ProjectCodesListFilter.prototype.getDefaultFilter();
    this.showAllInDateRange = false;
    
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
InvoiceDocumentReport.prototype.init = function() {
    contentSizeChangedEventSubscribers.push({"context": this, "function": this.normalizeContentSize});
    this.show();
}
InvoiceDocumentReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeButtons();
    this.updateView();
    this.setHandlers();
    this.normalizeContentSize();
}
InvoiceDocumentReport.prototype.getHtml = function() {
    var html = '';
    html += '<fieldset>';
    html += '<table>';
    html += '<tr>';
    html += '<td id="' + this.htmlId + '_filterCell"><button id="' + this.htmlId + '_filterBtn">Project code filter</button></td>';
    html += '<td id="' + this.htmlId + '_invoiceRequestsFilterCell"><button id="' + this.htmlId + '_invoiceRequestsFilterBtn">Invoice filter</button></td>';
    html += '<td id="' + this.htmlId + '_showAllInDateRangeCell"><input type="checkbox" id="' + this.htmlId + '_showAllInDateRange">Show all documents in date range</td>';
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
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_showAllInDateRange' + '" name="showAllInDateRange" value="">';
    html += '</form>';
    html += '<div id="' + this.htmlId + '_info"></div>';
    return html;
}
InvoiceDocumentReport.prototype.makeButtons = function() {
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
InvoiceDocumentReport.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_showAllInDateRange').bind("click", function(event) {form.showAllInDateRangeClickHandle.call(form, event)});
    $('#' + this.htmlId + '_generateBtn').bind("click", function(event) {form.startGenerating.call(form, event)});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
}

InvoiceDocumentReport.prototype.showFilter = function() {
    this.filterForm = new ProjectCodesListFilter("projectCodesListFilter", this.moduleName, this.filter, this.acceptFilterData, this);
    this.filterForm.init();
}
InvoiceDocumentReport.prototype.showInvoiceRequestsFilter = function() {
    this.invoiceRequestsFilterForm = new InvoiceRequestsFilter("invoiceRequestsFilter", this.moduleName, this.invoiceRequestsFilter, this.acceptInvoiceRequestsFilterData, this);
    this.invoiceRequestsFilterForm.init(); 
}
InvoiceDocumentReport.prototype.showAllInDateRangeClickHandle = function(event) {
    if($(event.currentTarget).is(':checked')) {
        this.showAllInDateRange = true;
    } else {
        this.showAllInDateRange = false;
    }
    this.updateShowAllInDateRangeView();
}
InvoiceDocumentReport.prototype.acceptFilterData = function(filter) {
    this.limiter.page = 0;
    this.filter = filter;
    var filterStr = getJSON(this.filter);
    var expire = new Date();
    expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 100);
    setCookie("projectCodesListFilter", filterStr, expire.toGMTString(), null);    
    this.updateFilterSelectionView();
}
InvoiceDocumentReport.prototype.acceptInvoiceRequestsFilterData = function(invoiceRequestsFilter) {
    this.limiter.page = 0;
    this.invoiceRequestsFilter = invoiceRequestsFilter;
//    var filterStr = getJSON(this.filter);
//    var expire = new Date();
//    expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 100);
//    setCookie("projectCodesListFilter", filterStr, expire.toGMTString(), null);
    this.updateFilterSelectionView();
    this.updateShowAllInDateRangeView();
}


InvoiceDocumentReport.prototype.updateView = function() {
    this.updateFilterSelectionView();
    this.updateShowAllInDateRangeView();
}
InvoiceDocumentReport.prototype.updateFilterSelectionView = function() {
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
InvoiceDocumentReport.prototype.updateShowAllInDateRangeView = function() {
    $('#' + this.htmlId + '_showAllInDateRange').attr('checked', this.showAllInDateRange);
    var dateRangeUsed = false;
    if(this.invoiceRequestsFilter.hasRequests == 'TRUE' && 
            (this.invoiceRequestsFilter.startDate != null || this.invoiceRequestsFilter.endDate != null)
            ) {
        dateRangeUsed = true;
    }
    if(dateRangeUsed) {
        $('#' + this.htmlId + '_showAllInDateRangeCell').show();
    } else {
        $('#' + this.htmlId + '_showAllInDateRangeCell').hide();
    }    
}

InvoiceDocumentReport.prototype.validate = function() {
    var errors = [];
    var numberRE = /^[0-9]*[\.]?[0-9]*$/;
    //if(this.data.startDate == null) {
    //    errors.push("Start date is not set");
    //}
    //if(this.data.endDate == null) {
    //    errors.push("End date is not set");
    //}
    //if(this.data.startDate != null && this.data.endDate != null && compareYearMonthDate(this.data.startDate, this.data.endDate) > 0) {
    //    errors.push("End date is less than Start date");
    //}    
    return errors;
}
InvoiceDocumentReport.prototype.startGeneratingXLS = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
      this.generateXLSReport();
    }
}
InvoiceDocumentReport.prototype.generateXLSReport = function() {
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReport');
    $('#' + this.htmlId + '_xlsForm_filter').val(getJSON(this.filter));
    $('#' + this.htmlId + '_xlsForm_invoiceRequestsFilter').val(getJSON(this.invoiceRequestsFilter));
    $('#' + this.htmlId + '_xlsForm_showAllInDateRange').val(getJSON(this.showAllInDateRange));
    $('#' + this.htmlId + '_xlsForm').submit();
}
InvoiceDocumentReport.prototype.startGenerating = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
        this.generateReport();
    }
}
InvoiceDocumentReport.prototype.generateReport = function() {
    var form = this;
    var data = {};
    data.command = "generateReport";
    data.filter = getJSON(this.filter);
    data.invoiceRequestsFilter = getJSON(this.invoiceRequestsFilter);
    data.showAllInDateRange = getJSON(this.showAllInDateRange);
    $.ajax({
        url: this.config.endpointUrl,
        data: data,
        cache: false,
        type: "POST",
        success: function(data){
            ajaxResultHandle(data, form, function(result) {
                form.invoiceDocumentReport = result.invoiceDocumentReport;
                form.updateReportView();
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
        }
    });
}
InvoiceDocumentReport.prototype.updateReportView = function() {
    this.updateReportHeaderView();
    this.updateReportBodyView();
}
InvoiceDocumentReport.prototype.updateReportHeaderView = function(financialYear) {
    var headingHtml = '';
    headingHtml += '<table class="datagrid">';
    headingHtml += '<tr><td>Project code filter is used</td><td>' + booleanVisualizer.getHtml(this.invoiceDocumentReport.isFilterUsed) + '</td></tr>';
    headingHtml += '<tr><td>Invoice requests filter is used</td><td>' + booleanVisualizer.getHtml(this.invoiceDocumentReport.isInvoiceRequestsFilterUsed) + '</td></tr>';
    headingHtml += '<tr><td>Report generated at</td><td>' + getStringFromYearMonthDateTime(this.invoiceDocumentReport.createdAt) + '</td></tr>';
    headingHtml += '</table>';
    $('#' + this.htmlId + '_heading').html(headingHtml);    
}
InvoiceDocumentReport.prototype.updateReportBodyView = function(financialYear) {
    var html = "";
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td colspan="' + (9 + this.invoiceDocumentReport.currencies.length*3) + '">Invoice document report</td></tr>';
    html += '<tr class="dgHeader">';
    html += '<td>Time</td>';
    html += '<td>Client</td>';
    html += '<td>Project Code</td>';
    html += '<td>Description</td>';
    html += '<td>Type</td>';
    html += '<td>Reference</td>';
    html += '<td>Date</td>';   
    html += '<td>With VAT</td>';
    for(var key in this.invoiceDocumentReport.currencies) {
        var currency = this.invoiceDocumentReport.currencies[key];
        html += '<td>' + currency.code + '</td>';
    }
    html += '<td>Payment</td>';
    html += '<td>Status</td>';
    html += '<td>Internal comment</td>';    
    html += '</tr>';

    for(var key in this.invoiceDocumentReport.rows) {
        var row = this.invoiceDocumentReport.rows[key];
        var type = row.type;
        var invoiceTotalAmount = null;
        var invoiceCurrency = null;
        var paymentCurrency = null;
        var reference = null;
        var comment = '';
        var date = null;
        if(type == 'INVOICE') {
            invoiceTotalAmount = row.invoiceTotalAmount;
            invoiceCurrency = this.getCurrency(row.invoiceInvoiceCurrencyId);
            paymentCurrency = this.getCurrency(row.invoicePaymentCurrencyId);
            date = row.invoiceDate;
            reference = row.invoiceReference;
            comment = row.invoiceComment;
        } else if(type == 'ACT') {
            invoiceTotalAmount = row.actTotalAmount;
            invoiceCurrency = this.getCurrency(row.actInvoiceCurrencyId);
            paymentCurrency = this.getCurrency(row.actPaymentCurrencyId);
            date = row.actDate;
            reference = row.actReference;
            comment = row.actComment;
        } else if(type == 'TAX_INVOICE') {
            reference = row.taxInvoiceReference;
            //exclude TAX_INVOICE
            continue;
        }
        
        html += '<tr>';
        html += '<td>' + getStringFromYearMonthDate(row.time) + '</td>';
        html += '<td>' + row.clientName + '</td>';
        html += '<td>' + row.projectCodeCode + '</td>';
        //html += '<td>' + row.projectCodeDescription + '</td>';
        html += '<td>' + comment + '</td>';
        html += '<td>' + type + '</td>';
        html += '<td>' + (reference != null ? reference : '') + '</td>';
        html += '<td>' + getStringFromYearMonthDate(date) + '</td>';
        html += '<td>' + booleanVisualizer.getHtml(row.withVAT) + '</td>';
        
        for(var key in this.invoiceDocumentReport.currencies) {
            var currency = this.invoiceDocumentReport.currencies[key];
            if(invoiceCurrency != null && currency.id == invoiceCurrency.id && invoiceTotalAmount != null) {
                html += '<td>' + invoiceTotalAmount + '</td>';
            } else {
                html += '<td></td>';
            }
        }
        
        html += '<td>' + (paymentCurrency != null ? paymentCurrency.code : '') + '</td>';
        html += '<td>' + row.status + '</td>';
        html += '<td>' + (row.comment != null ? row.comment : '') + '</td>';
        html += '</tr>';
    }
    html += '</table>';
    $('#' + this.htmlId + '_report').html(html);
}

InvoiceDocumentReport.prototype.getFinancialYearView = function(financialYear) {
    if(financialYear == null) {
        return null;
    }
    return financialYear + '-' + (financialYear + 1)
}
InvoiceDocumentReport.prototype.normalizeContentSize = function() {
    var layoutWidth = contentWidth - 10;
    var layoutHeight = contentHeight - 100;
    
    jQuery('#' + this.htmlId + '_report_body').jqGrid('setGridWidth', layoutWidth -50);
    jQuery('#' + this.htmlId + '_report_body').jqGrid('setGridHeight', layoutHeight - 75);
}
InvoiceDocumentReport.prototype.getCurrency = function(id) {
    for(var key in this.invoiceDocumentReport.currencies) {
        var currency = this.invoiceDocumentReport.currencies[key];
        if(currency.id == id) {
            return currency;
        }
    }
    return null;
}
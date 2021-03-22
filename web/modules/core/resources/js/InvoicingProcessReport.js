/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function InvoicingProcessReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "InvoicingProcessReport.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.loaded = {
    };
    this.moduleName = "Financial Information Report";
    
    this.filter = ProjectCodesListFilter.prototype.getDefaultFilter();
    if(! ProjectCodesListFilter.prototype.isFilterUsed(this.filter)) {
        this.filter.year = (new Date()).getFullYear();;
    }
    this.data = {
        startDate: null,
        endDate: null,
        documentTypeToSearch: 'INVOICE_TO_ISSUE',
        documentTypeToShow: 'INVOICE_TO_ISSUE',
        view: 'RESTRICTED'
    };
    this.sorter = {
        "field": 'CODE',
        "order": 'ASC'
    };
    this.limiter = {
        "page": 0,
        "itemsPerPage": 10
    };
    this.enums = {
        documentTypes: {
            "ALL" : "All",
            "INVOICE_TO_ISSUE" : "Invoice to issue",
            "INVOICE_ISSUED" : "Invoice issued",
            "PAYMENT" : "Payment"
        },
        views: {
            "FULL" : "Full",
            "RESTRICTED" : "Restricted"
        }
    }    
    this.reports = {};
}
InvoicingProcessReport.prototype.init = function() {
    contentSizeChangedEventSubscribers.push({"context": this, "function": this.normalizeContentSize});
    this.show();
}
InvoicingProcessReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeButtons();
    this.makeDatePickers();
    this.updateView();
    this.setHandlers();
    this.normalizeContentSize();
}
InvoicingProcessReport.prototype.getHtml = function() {
    var html = '';
    html += '<fieldset>';
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Project code filter</span></td>';
    html += '<td><span class="label1">Start date</span></td>';
    html += '<td><span class="label1">End date</span></td>';
    html += '<td><span class="label1">Document to search</span></td>';
    html += '<td><span class="label1">Document to show</span></td>';
    html += '<td><span class="label1">View</span></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td id="' + this.htmlId + '_filterCell"><button id="' + this.htmlId + '_filterBtn">Filter</button></td>';
    html += '<td><input id="' + this.htmlId + '_startDate"></td>';
    html += '<td><input id="' + this.htmlId + '_endDate"></td>';
    html += '<td><select id="' + this.htmlId + '_documentTypeToSearch"></select></td>';
    html += '<td><select id="' + this.htmlId + '_documentTypeToShow"></select></td>';
    html += '<td><select id="' + this.htmlId + '_view"></select></td>';
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
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="invoicingProcessReportForm" value="">';
    html += '</form>';
    html += '<div id="' + this.htmlId + '_info"></div>';
    return html;
}
InvoicingProcessReport.prototype.makeButtons = function() {
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
}
InvoicingProcessReport.prototype.makeDatePickers = function() {
    var form = this;
    $( '#' + this.htmlId + '_startDate' ).datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.startDatePickedHandle(dateText, inst)}
    });
    $( '#' + this.htmlId + '_endDate' ).datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.endDatePickedHandle(dateText, inst)}
    });
}
InvoicingProcessReport.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_startDate').bind("change", function(event) {form.startDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_endDate').bind("change", function(event) {form.endDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_documentTypeToSearch').bind("change", function(event) {form.documentTypeToSearchChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_documentTypeToShow').bind("change", function(event) {form.documentTypeToShowChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_view').bind("change", function(event) {form.viewChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_generateBtn').bind("click", function(event) {form.startGenerating.call(form, event)});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
}

InvoicingProcessReport.prototype.showFilter = function() {
    this.filterForm = new ProjectCodesListFilter("projectCodesListFilter", this.moduleName, this.filter, this.acceptFilterData, this);
    this.filterForm.init();
}
InvoicingProcessReport.prototype.acceptFilterData = function(filter) {
    this.limiter.page = 0;
    this.filter = filter;
    var filterStr = getJSON(this.filter);
    var expire = new Date();
    expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 100);
    setCookie("projectCodesListFilter", filterStr, expire.toGMTString(), null);    
    this.updateFilterSelectionView();
}


InvoicingProcessReport.prototype.startDatePickedHandle = function(dateText, inst) {
    this.startDateChangedHandle(dateText);
}
InvoicingProcessReport.prototype.startDateTextChangedHandle = function(event) {
    this.startDateChangedHandle(jQuery.trim(event.currentTarget.value));
}
InvoicingProcessReport.prototype.startDateChangedHandle = function(date) {
    if(isDateValid(date)) {
        this.data.startDate = getYearMonthDateFromDateString(date);
    } else {
    }
    this.updateStartDateView();
}

InvoicingProcessReport.prototype.endDatePickedHandle = function(dateText, inst) {
    this.endDateChangedHandle(dateText);
}
InvoicingProcessReport.prototype.endDateTextChangedHandle = function(event) {
    this.endDateChangedHandle(jQuery.trim(event.currentTarget.value));
}
InvoicingProcessReport.prototype.endDateChangedHandle = function(date) {
    if(isDateValid(date)) {
        this.data.endDate = getYearMonthDateFromDateString(date);
    } else {
    }
    this.updateEndDateView();
}

InvoicingProcessReport.prototype.documentTypeToSearchChangedHandle = function(event) {
    this.data.documentTypeToSearch = event.currentTarget.value;
    this.updateDocumentTypeToSearchView();
}
InvoicingProcessReport.prototype.documentTypeToShowChangedHandle = function(event) {
    this.data.documentTypeToShow = event.currentTarget.value;
    this.updateDocumentTypeToShowView();
}
InvoicingProcessReport.prototype.viewChangedHandle = function(event) {
    this.data.view = event.currentTarget.value;
    this.updateViewView();
}
InvoicingProcessReport.prototype.updateView = function() {
    this.updateStartDateView();
    this.updateEndDateView();
    this.updateDocumentTypeToSearchView();
    this.updateDocumentTypeToShowView();
    this.updateViewView();
    this.updateFilterSelectionView();
}
InvoicingProcessReport.prototype.updateStartDateView = function() {
    $('#' + this.htmlId + '_startDate').val(getStringFromYearMonthDate(this.data.startDate));
}
InvoicingProcessReport.prototype.updateEndDateView = function() {
    $('#' + this.htmlId + '_endDate').val(getStringFromYearMonthDate(this.data.endDate));
}
InvoicingProcessReport.prototype.updateDocumentTypeToSearchView = function() {
    var html = "";
    for(var key in this.enums.documentTypes) {
        var documentType = this.enums.documentTypes[key];
        var isSelected = "";
        if(key == this.data.documentTypeToSearch) {
           isSelected = "selected";
        }
        html += '<option value="'+ key +'" ' + isSelected + '>' + documentType + '</option>';
    }
    $('#' + this.htmlId + '_documentTypeToSearch').html(html);    
}
InvoicingProcessReport.prototype.updateDocumentTypeToShowView = function() {
    var html = "";
    for(var key in this.enums.documentTypes) {
        var documentType = this.enums.documentTypes[key];
        var isSelected = "";
        if(key == this.data.documentTypeToShow) {
           isSelected = "selected";
        }
        html += '<option value="'+ key +'" ' + isSelected + '>' + documentType + '</option>';
    }
    $('#' + this.htmlId + '_documentTypeToShow').html(html);        
}
InvoicingProcessReport.prototype.updateViewView = function() {
    var html = "";
    for(var key in this.enums.views) {
        var view = this.enums.views[key];
        var isSelected = "";
        if(key == this.data.view) {
           isSelected = "selected";
        }
        html += '<option value="'+ key +'" ' + isSelected + '>' + view + '</option>';
    }
    $('#' + this.htmlId + '_view').html(html);        
}
InvoicingProcessReport.prototype.updateFilterSelectionView = function() {
    if(ProjectCodesListFilter.prototype.isFilterUsed(this.filter)) {
        $('#' + this.htmlId + '_filterCell').css('border-left', '3px solid #009900');
    } else {
        $('#' + this.htmlId + '_filterCell').css('border-left', '0px');
    }
}

InvoicingProcessReport.prototype.validate = function() {
    var errors = [];
    var numberRE = /^[0-9]*[\.]?[0-9]*$/;
    if(! ProjectCodesListFilter.prototype.isFilterUsed(this.filter)) {
        errors.push("Nothing is set in the filter.");
    }
    if(this.data.startDate == null) {
        errors.push("Start date is not set");
    }
    if(this.data.endDate == null) {
        errors.push("End date is not set");
    }
    if(this.data.startDate != null && this.data.endDate != null && compareYearMonthDate(this.data.startDate, this.data.endDate) > 0) {
        errors.push("End date is less than Start date");
    }    
    return errors;
}
InvoicingProcessReport.prototype.startGeneratingXLS = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
      this.generateXLSReport();
    }
}
InvoicingProcessReport.prototype.generateXLSReport = function() {
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReport');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON({
                projectCodeListFilter: this.filter,
                startDate: this.data.startDate,
                endDate: this.data.endDate,
                documentTypeToSearch: this.data.documentTypeToSearch,
                documentTypeToShow: this.data.documentTypeToShow,
                view: this.data.view
                })
            );
    $('#' + this.htmlId + '_xlsForm').submit();
}
InvoicingProcessReport.prototype.startGenerating = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
        this.generateReport();
    }
}
InvoicingProcessReport.prototype.generateReport = function() {
    var form = this;
    var data = {};
    data.command = "generateReport";
    data.invoicingProcessReportForm = getJSON({
        projectCodeListFilter: this.filter,
        startDate: this.data.startDate,
        endDate: this.data.endDate,
        documentTypeToSearch: this.data.documentTypeToSearch,
        documentTypeToShow: this.data.documentTypeToShow,
        view: this.data.view
    });    
    $.ajax({
        url: this.config.endpointUrl,
        data: data,
        cache: false,
        type: "POST",
        success: function(data){
            ajaxResultHandle(data, form, function(result) {
                form.invoicingProcessReport = result.invoicingProcessReport;
                form.updateReportView();
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
        }
    });
}
InvoicingProcessReport.prototype.updateReportView = function() {
    this.updateReportHeaderView();
    this.updateReportBodyView();
}
InvoicingProcessReport.prototype.updateReportHeaderView = function(financialYear) {
    var headingHtml = '';
    headingHtml += '<table class="datagrid">';
    headingHtml += '<tr><td>Project code filter is used</td><td>' + booleanVisualizer.getHtml(this.invoicingProcessReport.isFilterUsed) + '</td></tr>';
    headingHtml += '<tr><td>Start date</td><td>' + getStringFromYearMonthDate(this.invoicingProcessReport.formStartDate) + '</td></tr>';
    headingHtml += '<tr><td>End date</td><td>' + getStringFromYearMonthDate(this.invoicingProcessReport.formEndDate) + '</td></tr>';
    headingHtml += '<tr><td>Document to search</td><td>' + this.invoicingProcessReport.formDocumentTypeToSearch + '</td></tr>';
    headingHtml += '<tr><td>Document to show</td><td>' + this.invoicingProcessReport.formDocumentTypeToShow + '</td></tr>';
    headingHtml += '<tr><td>Generated at</td><td>' + getStringFromYearMonthDateTime(this.invoicingProcessReport.createdAt) + '</td></tr>';
    headingHtml += '</table>';
    $('#' + this.htmlId + '_heading').html(headingHtml);    
}
InvoicingProcessReport.prototype.updateReportBodyView = function() {
    if(this.data.view == 'FULL') {
        this.updateReportBodyFullView();
    } else if(this.data.view == 'RESTRICTED') {
        this.updateReportBodyRestrictedView();        
    }
}
InvoicingProcessReport.prototype.updateReportBodyFullView = function(financialYear) {
    var columnsCount = 1;
    var showFeesAdvances = false;
    var showFeesInvoices = false;
    var showFeesPayments = false;
    if(this.invoicingProcessReport.formDocumentTypeToShow == 'ALL') {
        columnsCount = (3 + 3 + this.invoicingProcessReport.currencies.length*(1 + 2 + 1));
        showFeesAdvances = true;
        showFeesInvoices = true;
        showFeesPayments = true;
    } else if(this.invoicingProcessReport.formDocumentTypeToShow == 'INVOICE_TO_ISSUE') {
        columnsCount = (3 + 1 + this.invoicingProcessReport.currencies.length);
        showFeesAdvances = true;
    } else if(this.invoicingProcessReport.formDocumentTypeToShow == 'INVOICE_ISSUED') {
        columnsCount = (3 + 1 + this.invoicingProcessReport.currencies.length*2);
        showFeesInvoices = true;       
    } else if(this.invoicingProcessReport.formDocumentTypeToShow == 'INVOICE_PAYMENT') {
        columnsCount = (3 + 1 + this.invoicingProcessReport.currencies.length);
        showFeesPayments = true;        
    }
    var html = "";
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td colspan="' + columnsCount + '">Invoice document report</td></tr>';
    html += '<tr class="dgHeader">';
    html += '<td colspan="3"></td>';
    if(showFeesAdvances) {
        html += '<td colspan="' + (1 + this.invoicingProcessReport.currencies.length) + '">Invoice to issue</td>';
    }
    if(showFeesInvoices) {
        html += '<td colspan="' + (this.invoicingProcessReport.currencies.length) + '">Invoice issued</td>';
        html += '<td colspan="' + (1 + this.invoicingProcessReport.currencies.length) + '">Invoice issued with VAT</td>';
    }
    if(showFeesPayments) {
        html += '<td colspan="' + (1 + this.invoicingProcessReport.currencies.length) + '">Payment</td>';
    }
    html += '</tr>';
    html += '<tr class="dgHeader">';
    html += '<td>Group</td>';
    html += '<td>Client</td>';
    html += '<td>Project Code</td>';
    if(showFeesAdvances) {
        for(var key in this.invoicingProcessReport.currencies) {
        var currency = this.invoicingProcessReport.currencies[key];
        html += '<td>' + currency.code + '</td>';
    }
        html += '<td>Date</td>';
    }
    if(showFeesInvoices) {
        for(var key in this.invoicingProcessReport.currencies) {
        var currency = this.invoicingProcessReport.currencies[key];
        html += '<td>' + currency.code + '</td>';
    }
        for(var key in this.invoicingProcessReport.currencies) {
        var currency = this.invoicingProcessReport.currencies[key];
        html += '<td>' + currency.code + '</td>';
    }
        html += '<td>Date</td>';
    }
    if(showFeesPayments) {
        for(var key in this.invoicingProcessReport.currencies) {
        var currency = this.invoicingProcessReport.currencies[key];
        html += '<td>' + currency.code + '</td>';
    }
        html += '<td>Date</td>';
    }
    html += '</tr>';

    for(var key in this.invoicingProcessReport.projectCodeBlocks) {
        var projectCodeBlock = this.invoicingProcessReport.projectCodeBlocks[key];
        var maxDocumentCount = 0;
        if(showFeesAdvances && projectCodeBlock.feesAdvances.length > maxDocumentCount) {
            maxDocumentCount = projectCodeBlock.feesAdvances.length;
        }
        if(showFeesInvoices && projectCodeBlock.feesInvoices.length > maxDocumentCount) {
            maxDocumentCount = projectCodeBlock.feesInvoices.length;
        }
        if(showFeesPayments && projectCodeBlock.feesPayments.length > maxDocumentCount) {
            maxDocumentCount = projectCodeBlock.feesPayments.length;
        }
        var totalFeesAdvanceAmount = this.getTotalFeesAdvanceAmount(projectCodeBlock);
        var totalFeesInvoiceAmount = this.getTotalFeesInvoiceAmount(projectCodeBlock);
        var totalFeesInvoiceVatIncludedAmount = this.getTotalFeesInvoiceVatIncludedAmount(projectCodeBlock);
        var totalFeesPaymentAmount = this.getTotalFeesPaymentAmount(projectCodeBlock);
        for(var i = 0; i < maxDocumentCount; i++) {
            html += '<tr>';
            html += '<td colspan="3"></td>';
            if(showFeesAdvances) {
                var feesAdvance = projectCodeBlock.feesAdvances[i];
                for(var key in this.invoicingProcessReport.currencies) {
                    var currency = this.invoicingProcessReport.currencies[key];
                    if(currency.id == projectCodeBlock.feesItem.feesAdvanceCurrencyId && feesAdvance != null) {
                        html += '<td>' + decimalVisualizer.getHtml(feesAdvance.amount) + '</td>';
                    } else {
                        html += '<td></td>';
                    }
                }
                html += '<td>' + (feesAdvance != null ? calendarVisualizer.getHtml(feesAdvance.date) : '')+ '</td>';
            }
            if(showFeesInvoices) {
                var feesInvoice = projectCodeBlock.feesInvoices[i];
                for(var key in this.invoicingProcessReport.currencies) {
                    var currency = this.invoicingProcessReport.currencies[key];
                    if(currency.id == projectCodeBlock.feesItem.feesInvoiceCurrencyId && feesInvoice != null) {
                        html += '<td>' + decimalVisualizer.getHtml(feesInvoice.amount) + '</td>';
                    } else {
                        html += '<td></td>';
                    }
                }
                for(var key in this.invoicingProcessReport.currencies) {
                    var currency = this.invoicingProcessReport.currencies[key];
                    if(currency.id == projectCodeBlock.feesItem.feesAdvanceCurrencyId && feesInvoice != null) {
                        html += '<td>' + decimalVisualizer.getHtml(feesInvoice.vatIncludedAmount) + '</td>';
                    } else {
                        html += '<td></td>';
                    }
                }
                html += '<td>' + (feesInvoice != null ? calendarVisualizer.getHtml(feesInvoice.date) : '')+ '</td>';
            }   
            if(showFeesPayments) {
                var feesPayment = projectCodeBlock.feesPayments[i];
                for(var key in this.invoicingProcessReport.currencies) {
                    var currency = this.invoicingProcessReport.currencies[key];
                    if(currency.id == projectCodeBlock.feesItem.feesPaymentCurrencyId && feesPayment != null) {
                        html += '<td>' + decimalVisualizer.getHtml(feesPayment.amount) + '</td>';
                    } else {
                        html += '<td></td>';
                    }
                }
                html += '<td>' + (feesPayment != null ? calendarVisualizer.getHtml(feesPayment.date) : '')+ '</td>';
            }        
            html += '</tr>';
        }
        html += '<tr class="dgHighlight">';
        html += '<td>' + ((projectCodeBlock.groupName != null) ? projectCodeBlock.groupName : '') + '</td>';
        html += '<td>' + projectCodeBlock.clientName + '</td>';
        html += '<td>' + projectCodeBlock.projectCodeCode + '</td>';
       
        if(showFeesAdvances) {
            for(var key in this.invoicingProcessReport.currencies) {
            var currency = this.invoicingProcessReport.currencies[key];
            if(currency.id == projectCodeBlock.feesItem.feesAdvanceCurrencyId) {
                html += '<td>' + decimalVisualizer.getHtml(totalFeesAdvanceAmount) + '</td>';
            } else {
                html += '<td></td>';
            }
        }
            html += '<td></td>';
        }
        
        if(showFeesInvoices) {
            for(var key in this.invoicingProcessReport.currencies) {
            var currency = this.invoicingProcessReport.currencies[key];
            if(currency.id == projectCodeBlock.feesItem.feesInvoiceCurrencyId) {
                html += '<td>' + decimalVisualizer.getHtml(totalFeesInvoiceAmount) + '</td>';
            } else {
                html += '<td></td>';
            }
        }
            for(var key in this.invoicingProcessReport.currencies) {
            var currency = this.invoicingProcessReport.currencies[key];
            if(currency.id == projectCodeBlock.feesItem.feesInvoiceCurrencyId) {
                html += '<td>' + decimalVisualizer.getHtml(totalFeesInvoiceVatIncludedAmount) + '</td>';
            } else {
                html += '<td></td>';
            }
        }       
            html += '<td></td>';
        }
        
        if(showFeesPayments) {
            for(var key in this.invoicingProcessReport.currencies) {
            var currency = this.invoicingProcessReport.currencies[key];
            if(currency.id == projectCodeBlock.feesItem.feesPaymentCurrencyId) {
                html += '<td>' + decimalVisualizer.getHtml(totalFeesPaymentAmount) + '</td>';
            } else {
                html += '<td></td>';
            }
        }
            html += '<td></td>';
        }
        
        html += '</tr>';
    }
    html += '</table>';
    $('#' + this.htmlId + '_report').html(html);
}
InvoicingProcessReport.prototype.updateReportBodyRestrictedView = function(financialYear) {
    var columnsCount = 1;
    var showFeesAdvances = false;
    var showFeesInvoices = false;
    var showFeesPayments = false;
    if(this.invoicingProcessReport.formDocumentTypeToShow == 'ALL') {
        columnsCount = (3 + 3 + this.invoicingProcessReport.currencies.length*(1 + 2 + 1));
        showFeesAdvances = true;
        showFeesInvoices = true;
        showFeesPayments = true;
    } else if(this.invoicingProcessReport.formDocumentTypeToShow == 'INVOICE_TO_ISSUE') {
        columnsCount = (3 + 1 + this.invoicingProcessReport.currencies.length);
        showFeesAdvances = true;
    } else if(this.invoicingProcessReport.formDocumentTypeToShow == 'INVOICE_ISSUED') {
        columnsCount = (3 + 1 + this.invoicingProcessReport.currencies.length*2);
        showFeesInvoices = true;       
    } else if(this.invoicingProcessReport.formDocumentTypeToShow == 'INVOICE_PAYMENT') {
        columnsCount = (3 + 1 + this.invoicingProcessReport.currencies.length);
        showFeesPayments = true;        
    }
    var html = "";
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td colspan="' + columnsCount + '">Invoice document report</td></tr>';
    html += '<tr class="dgHeader">';
    html += '<td colspan="3"></td>';
    if(showFeesAdvances) {
        html += '<td colspan="' + (1 + this.invoicingProcessReport.currencies.length) + '">Invoice to issue</td>';
    }
    if(showFeesInvoices) {
        html += '<td colspan="' + (this.invoicingProcessReport.currencies.length) + '">Invoice issued</td>';
        html += '<td colspan="' + (1 + this.invoicingProcessReport.currencies.length) + '">Invoice issued with VAT</td>';
    }
    if(showFeesPayments) {
        html += '<td colspan="' + (1 + this.invoicingProcessReport.currencies.length) + '">Payment</td>';
    }
    html += '</tr>';
    html += '<tr class="dgHeader">';
    html += '<td>Group</td>';
    html += '<td>Client</td>';
    html += '<td>Project Code</td>';
    if(showFeesAdvances) {
        for(var key in this.invoicingProcessReport.currencies) {
        var currency = this.invoicingProcessReport.currencies[key];
        html += '<td>' + currency.code + '</td>';
    }
        html += '<td>Date</td>';
    }
    if(showFeesInvoices) {
        for(var key in this.invoicingProcessReport.currencies) {
        var currency = this.invoicingProcessReport.currencies[key];
        html += '<td>' + currency.code + '</td>';
    }
        for(var key in this.invoicingProcessReport.currencies) {
        var currency = this.invoicingProcessReport.currencies[key];
        html += '<td>' + currency.code + '</td>';
    }
        html += '<td>Date</td>';
    }
    if(showFeesPayments) {
        for(var key in this.invoicingProcessReport.currencies) {
        var currency = this.invoicingProcessReport.currencies[key];
        html += '<td>' + currency.code + '</td>';
    }
        html += '<td>Date</td>';
    }
    html += '</tr>';

    for(var key in this.invoicingProcessReport.projectCodeBlocks) {
        var projectCodeBlock = this.invoicingProcessReport.projectCodeBlocks[key];
        var feesAdvances = this.getFilteredFeesAdvances(projectCodeBlock, this.data.startDate, this.data.endDate);
        var feesInvoices = this.getFilteredFeesInvoices(projectCodeBlock, this.data.startDate, this.data.endDate);
        var feesPayments = this.getFilteredFeesPayments(projectCodeBlock, this.data.startDate, this.data.endDate);

        var maxDocumentCount = 0;
        if(showFeesAdvances && feesAdvances.length > maxDocumentCount) {
            maxDocumentCount = feesAdvances.length;
        }
        if(showFeesInvoices && feesInvoices.length > maxDocumentCount) {
            maxDocumentCount = feesInvoices.length;
        }
        if(showFeesPayments && feesPayments.length > maxDocumentCount) {
            maxDocumentCount = feesPayments.length;
        }
        for(var i = 0; i < maxDocumentCount; i++) {
            html += '<tr>';
            html += '<td>' + ((projectCodeBlock.groupName != null) ? projectCodeBlock.groupName : '') + '</td>';
            html += '<td>' + projectCodeBlock.clientName + '</td>';
            html += '<td>' + projectCodeBlock.projectCodeCode + '</td>';
            if(showFeesAdvances) {
                var feesAdvance = feesAdvances[i];
                for(var key in this.invoicingProcessReport.currencies) {
                    var currency = this.invoicingProcessReport.currencies[key];
                    if(currency.id == projectCodeBlock.feesItem.feesAdvanceCurrencyId && feesAdvance != null) {
                        html += '<td>' + decimalVisualizer.getHtml(feesAdvance.amount) + '</td>';
                    } else {
                        html += '<td></td>';
                    }
                }
                html += '<td>' + (feesAdvance != null ? calendarVisualizer.getHtml(feesAdvance.date) : '')+ '</td>';
            }
            if(showFeesInvoices) {
                var feesInvoice = feesInvoices[i];
                for(var key in this.invoicingProcessReport.currencies) {
                    var currency = this.invoicingProcessReport.currencies[key];
                    if(currency.id == projectCodeBlock.feesItem.feesInvoiceCurrencyId && feesInvoice != null) {
                        html += '<td>' + decimalVisualizer.getHtml(feesInvoice.amount) + '</td>';
                    } else {
                        html += '<td></td>';
                    }
                }
                for(var key in this.invoicingProcessReport.currencies) {
                    var currency = this.invoicingProcessReport.currencies[key];
                    if(currency.id == projectCodeBlock.feesItem.feesAdvanceCurrencyId && feesInvoice != null) {
                        html += '<td>' + decimalVisualizer.getHtml(feesInvoice.vatIncludedAmount) + '</td>';
                    } else {
                        html += '<td></td>';
                    }
                }
                html += '<td>' + (feesInvoice != null ? calendarVisualizer.getHtml(feesInvoice.date) : '')+ '</td>';
            }   
            if(showFeesPayments) {
                var feesPayment = feesPayments[i];
                for(var key in this.invoicingProcessReport.currencies) {
                    var currency = this.invoicingProcessReport.currencies[key];
                    if(currency.id == projectCodeBlock.feesItem.feesPaymentCurrencyId && feesPayment != null) {
                        html += '<td>' + decimalVisualizer.getHtml(feesPayment.amount) + '</td>';
                    } else {
                        html += '<td></td>';
                    }
                }
                html += '<td>' + (feesPayment != null ? calendarVisualizer.getHtml(feesPayment.date) : '')+ '</td>';
            }        
            html += '</tr>';
        }
    }
    html += '</table>';
    $('#' + this.htmlId + '_report').html(html);
}

InvoicingProcessReport.prototype.getFinancialYearView = function(financialYear) {
    if(financialYear == null) {
        return null;
    }
    return financialYear + '-' + (financialYear + 1)
}
InvoicingProcessReport.prototype.normalizeContentSize = function() {
    var layoutWidth = contentWidth - 10;
    var layoutHeight = contentHeight - 100;
    
    jQuery('#' + this.htmlId + '_report_body').jqGrid('setGridWidth', layoutWidth -50);
    jQuery('#' + this.htmlId + '_report_body').jqGrid('setGridHeight', layoutHeight - 75);
}
InvoicingProcessReport.prototype.getCurrency = function(id) {
    for(var key in this.invoicingProcessReport.currencies) {
        var currency = this.invoicingProcessReport.currencies[key];
        if(currency.id == id) {
            return currency;
        }
    }
    return null;
}
InvoicingProcessReport.prototype.getTotalFeesAdvanceAmount = function(projectCodeBlock) {
    var totalFeesAdvanceAmount = 0;
    for(var key in projectCodeBlock.feesAdvances) {
        totalFeesAdvanceAmount += projectCodeBlock.feesAdvances[key].amount;
    }
    return totalFeesAdvanceAmount;
}
InvoicingProcessReport.prototype.getTotalFeesInvoiceAmount = function(projectCodeBlock) {
    var totalFeesInvoiceAmount = 0;
    for(var key in projectCodeBlock.feesInvoices) {
        totalFeesInvoiceAmount += projectCodeBlock.feesInvoices[key].amount;
    }
    return totalFeesInvoiceAmount;
}
InvoicingProcessReport.prototype.getTotalFeesInvoiceVatIncludedAmount = function(projectCodeBlock) {
    var totalFeesInvoiceVatIncludedAmount = 0;
    for(var key in projectCodeBlock.feesInvoices) {
        if(projectCodeBlock.feesInvoices[key].vatIncludedAmount != null) {
            totalFeesInvoiceVatIncludedAmount += projectCodeBlock.feesInvoices[key].vatIncludedAmount;
        }
    }
    return totalFeesInvoiceVatIncludedAmount;    
}
InvoicingProcessReport.prototype.getTotalFeesPaymentAmount = function(projectCodeBlock) {
    var totalFeesPaymentAmount = 0;
    for(var key in projectCodeBlock.feesPayments) {
        totalFeesPaymentAmount += projectCodeBlock.feesPayments[key].amount;
    }
    return totalFeesPaymentAmount;
    
}
InvoicingProcessReport.prototype.getFilteredFeesAdvances = function(projectCodeBlock, startDate, endDate) {
    var feesAdvances = [];
    for(var key in projectCodeBlock.feesAdvances) {
        var feesAdvance = projectCodeBlock.feesAdvances[key];
        if(compareYearMonthDate(feesAdvance.date, startDate) >= 0 && compareYearMonthDate(feesAdvance.date, endDate) <= 0) {
            feesAdvances.push(feesAdvance);
        }
    }
    return feesAdvances;
    
}
InvoicingProcessReport.prototype.getFilteredFeesInvoices = function(projectCodeBlock, startDate, endDate) {
    var feesInvoices = [];
    for(var key in projectCodeBlock.feesInvoices) {
        var feesInvoice = projectCodeBlock.feesInvoices[key];
        if(compareYearMonthDate(feesInvoice.date, startDate) >= 0 && compareYearMonthDate(feesInvoice.date, endDate) <= 0) {
            feesInvoices.push(feesInvoice);
        }
    }
    return feesInvoices;
    
}
InvoicingProcessReport.prototype.getFilteredFeesPayments = function(projectCodeBlock, startDate, endDate) {
    var feesPayments = [];
    for(var key in projectCodeBlock.feesPayments) {
        var feesPayment = projectCodeBlock.feesPayments[key];
        if(compareYearMonthDate(feesPayment.date, startDate) >= 0 && compareYearMonthDate(feesPayment.date, endDate) <= 0) {
            feesPayments.push(feesPayment);
        }
    }
    return feesPayments;
}
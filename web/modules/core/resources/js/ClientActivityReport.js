/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ClientActivityReport(htmlId, containerHtmlId) {
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.moduleName = "Clients";
    this.config = {
         endpointUrl: endpointsFolder + "ClientActivityReport.jsp"
    };
    this.loaded = {
        "countries": [],
        "languages": [],
        "clientActivityInfoItems": []
    };
    this.selected = {
        "clientIds": []
    }
    this.clientActivityFilter = {
        "projectsCount": null,
        "startDate" : null,
        "endDate" : null        
    }
    this.clientFilter = ClientsListFilter.prototype.getDefaultFilter();    
    var filterStr = getCookie("clientsListFilter");
    if(filterStr != null) {
        try{
            this.clientFilter = ClientsListFilter.prototype.normalizeFilter(jQuery.parseJSON(filterStr));
        } catch (e) {
            deleteCookie("clientsListFilter");
        }
    }
    var now = new Date();
    this.clientActivityFilter.endDate = {
        year: now.getFullYear(),
        month: now.getMonth(),
        dayOfMonth: now.getDate()
    }
    this.clientActivityFilter.startDate = getShiftedYearMonthDate(this.clientActivityFilter.endDate, -183);
    
    this.limiter = {
        "page": 0,
        "itemsPerPage": 100
    };
    this.sorter = {
        "field": 'NAME',
        "order": 'ASC'
    };
}
ClientActivityReport.prototype.init = function() {
    this.makeLayout();
    this.makeButtons();
    this.setHandlers();
    this.updateView();
}
ClientActivityReport.prototype.makeLayout = function() {
    var html = '';
    html += '<div id="' + this.htmlId + '_panel"></div><br />';
    html += '<div id="' + this.htmlId + '_report"></div>';
    $('#' + this.containerHtmlId).html(html);   
}
ClientActivityReport.prototype.makeButtons = function() {
    var form = this;
}    
ClientActivityReport.prototype.setHandlers = function() {
    var form = this;
}
ClientActivityReport.prototype.projectsCountChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_projectsCount').val();
    if(idTxt == '') {
        this.clientActivityFilter.projectsCount = null;
    }
    this.clientActivityFilter.projectsCount = idTxt;
}
ClientActivityReport.prototype.startDateChangedHandle = function(dateText, inst) {
    this.processStartDateChanged(dateText);
}
ClientActivityReport.prototype.startDateTextChangedHandle = function(event) {
    var dateText = $(event.currentTarget).val();
    this.processStartDateChanged(dateText);
}
ClientActivityReport.prototype.processStartDateChanged = function(dateText) {
    if(dateText == null || jQuery.trim(dateText) == '') {
        this.clientActivityFilter.startDate = null;
    } else {
        if(isDateValid(dateText)) {
            this.clientActivityFilter.startDate = getYearMonthDateFromDateString(jQuery.trim(dateText));
        } else {
        }
    }
    this.updateStartDateView();
}
ClientActivityReport.prototype.endDateChangedHandle = function(dateText, inst) {
    this.processEndDateChanged(dateText);
}
ClientActivityReport.prototype.endDateTextChangedHandle = function(event) {
    var dateText = $(event.currentTarget).val();
    this.processEndDateChanged(dateText);
}
ClientActivityReport.prototype.processEndDateChanged = function(dateText) {
    if(dateText == null || jQuery.trim(dateText) == '') {
        this.clientActivityFilter.endDate = null;
    } else {
        if(isDateValid(dateText)) {
            this.clientActivityFilter.endDate = getYearMonthDateFromDateString(jQuery.trim(dateText));
        } else {
        }
    }
    this.updateEndDateView();
}
ClientActivityReport.prototype.updateView = function() {
    this.updatePanelView();
}
ClientActivityReport.prototype.updatePanelView = function() {
    var html = '';
    html += '<table>';
    html += '<tr>';
    html += '<td></td>';
    html += '<td><span class="label1">Active projects</span></td>';
    html += '<td><span class="label1">From</span></td>';
    html += '<td><span class="label1">To</span></td>';
    html + '</tr>';
    html += '<tr>';
    html += '<td id="' + this.htmlId + '_clientFilterCell"><button id="' + this.htmlId + '_clientFilterBtn" title="Client filter">Client filter</button></td>';
    html += '<td><select id="' + this.htmlId + '_projectsCount" title="Filters clients by active projects count"></select></td>';
    html += '<td><input type="text" id="' + this.htmlId + '_startDate' + '" title="Filters clients by their projects dates"></td>';
    html += '<td><input type="text" id="' + this.htmlId + '_endDate' + '" title="Filters clients by their projects dates"></td>';
    html += '<td><button id="' + this.htmlId + '_generateBtn" title="Generate report on page">Generate</button></td>';
    html += '<td><button id="' + this.htmlId + '_generateXLSBtn" title="Generate report as Excel file">Generate XLS</button></td>';
    html += '</tr>';
    html += '</table>';    
    html += '<form id="' + this.htmlId + '_xlsForm' + '" target="_blank" action="' + this.config.endpointUrl + '" method="post">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_command' + '" name="command" value="">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_clientActivityReportForm' + '" name="clientActivityReportForm" value="">';
    html += '</form>';
    $('#' + this.htmlId + '_panel').html(html);
    this.updateFilterSelectionView();

    var form = this;
    $('#' + this.htmlId + '_clientFilterBtn').button({
        icons: {
            primary: "ui-icon-search"
        }
    }).click(function(event) {
        form.showClientsListFilter.call(form);
    });

    $('#' + this.htmlId + '_generateBtn').button({
        icons: {
            primary: "ui-icon-document"
        }
    }).click(function(event) {
        form.startGenerating.call(form);
    });
    
    $('#' + this.htmlId + '_generateXLSBtn').button({
        icons: {
            primary: "ui-icon-document"
        }
    }).click(function(event) {
        form.startGeneratingXLS.call(form, true);
    });

    $('#' + this.htmlId + '_projectsCount').bind("change", function(event) {form.projectsCountChangedHandle.call(form)});
    $('#' + this.htmlId + '_startDate').bind("change", function(event) {form.startDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_endDate').bind("change", function(event) {form.endDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_startDate').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.startDateChangedHandle(dateText, inst)}
    });
    $('#' + this.htmlId + '_endDate').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.endDateChangedHandle(dateText, inst)}
    });
    
    this.updateProjectsCountView();
    this.updateStartDateView();
    this.updateEndDateView();
}
ClientActivityReport.prototype.updateFilterSelectionView = function() {
    if(ClientsListFilter.prototype.isFilterUsed(this.clientFilter)) {
        $('#' + this.htmlId + '_clientFilterCell').css('border-left', '3px solid #009900');
    } else {
        $('#' + this.htmlId + '_clientFilterCell').css('border-left', '0px');
    }
}
ClientActivityReport.prototype.updateProjectsCountView = function() {
    var values = {
        'ZERO': '0',
        'MORE_THAN_ZERO': 'More than 0'
    }    
    var html = "";
    html += '<option value="">All</option>';
    for(var key in values) {
        var value = values[key];
        var isSelected = "";
        if(key == this.clientActivityFilter.projectsCount) {
           isSelected = "selected";
        }
        html += '<option value="'+ key +'" ' + isSelected + '>' + value + '</option>';
    }
    $('#' + this.htmlId + '_projectsCount').html(html);
}
ClientActivityReport.prototype.updateStartDateView = function() {
    $('#' + this.htmlId + '_startDate').val(getStringFromYearMonthDate(this.clientActivityFilter.startDate));
}
ClientActivityReport.prototype.updateEndDateView = function() {
    $('#' + this.htmlId + '_endDate').val(getStringFromYearMonthDate(this.clientActivityFilter.endDate));
}
ClientActivityReport.prototype.updateReportView = function() {
    var html = '';
    html += '<div id="' + this.htmlId + '_reportHeader"></div>';
    html += '<div id="' + this.htmlId + '_reportBody"></div>';
    $('#' + this.htmlId + '_report').html(html);
    this.updateReportHeaderView();
    this.updateReportBodyView();
}
ClientActivityReport.prototype.updateReportHeaderView = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr><td>Report Generated at</td><td>' + yearMonthDateTimeVisualizer.getHtml(this.report.createdAt) + '</td></tr>';
    html += '</table>';

    $('#' + this.htmlId + '_reportHeader').html(html);
}
ClientActivityReport.prototype.updateReportBodyView = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader">';
    html += '<td>Client</td>';
    html += '<td>Group</td>';
    html += '<td>Active</td>';
    html += '<td>Country</td>';
    html += '<td>Project count</td>';
    for(var key in this.report.currencies) {
        var currency = this.report.currencies[key];
        html += '<td>' + currency.code + '</td>';
    }
    html += '</tr>';
    for(var key in this.report.rows) {
        var row = this.report.rows[key];
        var totalSubdepartmentCount = 0;
        for(var key2 in row.subdepartmentCounts) {
            var subdepartmentCount = row.subdepartmentCounts[key2];
            totalSubdepartmentCount += subdepartmentCount;
        }
        
        html += '<tr>';
        html += '<td>' + row.clientName + '</td>';
        html += '<td>' + (row.groupName != null ? row.groupName : '') + '</td>';
        html += '<td>' + booleanVisualizer.getHtml(row.clientIsActive) + '</td>';
        html += '<td>' + (row.countryName != null ? row.countryName : '') + '</td>';
        html += '<td>' + totalSubdepartmentCount + '</td>';
        for(var key3 in this.report.currencies) {
            var currency = this.report.currencies[key3];
            var amount = null;
            if(row.currencyAmounts != null) {
                amount = row.currencyAmounts[currency.id];
            }
            html += '<td>' + (amount != null ? decimalVisualizer.getHtml(amount) : '') + '</td>';
        }
        html += '</tr>';
    }
    html += '</table>';
    $('#' + this.htmlId + '_reportBody').html(html);
}
ClientActivityReport.prototype.showClientsListFilter = function() {
    this.clientsListFilter = new ClientsListFilter(this.htmlId + '_contactManagerFilter', this.moduleName, this.clientFilter, this.clientFilterChangedHandler, this);
    this.clientsListFilter.init();   
}
ClientActivityReport.prototype.clientFilterChangedHandler = function(filter) {
    this.limiter.page = 0;
    this.clientFilter = filter;
    this.selected = {
        "groupIds": [],
        "clientIds": []
    }
    this.rememberFilter();
    this.updatePanelView();
}
ClientActivityReport.prototype.rememberFilter = function() {
    var filterStr = getJSON(this.clientFilter);
    var expire = new Date();
    expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 100);
    setCookie("clientsListFilter", filterStr, expire.toGMTString(), null);        
}
ClientActivityReport.prototype.validate = function() {
    var errors = [];
    if(this.clientActivityFilter.startDate != null && this.clientActivityFilter.endDate != null && compareYearMonthDate(this.clientActivityFilter.startDate, this.clientActivityFilter.endDate) > 0 ) {
        errors.push("End date is less than Start date");
    }
    return {
        'errors' : errors,
        'warnings' : []
    };
}
ClientActivityReport.prototype.startGenerating = function() {
    var result = this.validate();
    if(result.errors.length > 0) {
        showErrors(result.errors);
    } else {
        this.generate();
    }
}
ClientActivityReport.prototype.startGeneratingXLS = function() {
    var result = this.validate();
    if(result.errors.length > 0) {
        showErrors(result.errors);
    } else {
        this.generateXLS();
    }
}
ClientActivityReport.prototype.generateXLS = function() {
    var serverFormatData = {
    };
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReport');
    $('#' + this.htmlId + '_xlsForm_clientActivityReportForm').val(getJSON({
            clientFilter: this.clientFilter,
            clientActivityFilter: this.clientActivityFilter
        })
    );
    $('#' + this.htmlId + '_xlsForm').submit();
}
ClientActivityReport.prototype.generate = function() {
    $('#' + this.htmlId + '_report').html("In progress...");
    var form = this;
    var data = {};
    data.command = "generateReport";
    
    data.clientActivityReportForm = getJSON({
        clientFilter: this.clientFilter,
        clientActivityFilter: this.clientActivityFilter
    });
    $.ajax({
        url: this.config.endpointUrl,
        data: data,
        cache: false,
        type: "POST",
        success: function(data){
            ajaxResultHandle(data, form, function(result) {
                form.report = result.report;
                form.updateReportView();
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
        }
    });
}
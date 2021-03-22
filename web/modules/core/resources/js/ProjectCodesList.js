/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ProjectCodesList(filter, htmlId, containerHtmlId) {
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.config = {
        endpointUrl: endpointsFolder+ "ProjectCodesList.jsp"
    }
    this.moduleName = "Code";
    this.sortFields = {
        //"id": "ID",
        "code": "CODE",
        "client": "CLIENT",
        "subdepartment": "SUBDEPARTMENT",
        "activity": "ACTIVITY",
        "office": "OFFICE",
        "periodType": "PERIOD_TYPE",
        "periodQuarter": "PERIOD_QUARTER",
        "periodMonth": "PERIOD_MONTH",
        "periodDate": "PERIOD_DATE",
        "periodCounter": "PERIOD_COUNTER",
        "year": "YEAR",
        "financialYear": "FINANCIAL_YEAR",
        "description": "DESCRIPTION",
        "comment": "COMMENT",
        "createdAt": "CREATED_AT",
        "createdBy": "CREATED_BY",
        "isClosed": "IS_CLOSED",
        "closedAt": "CLOSED_AT",
        "closedBy": "CLOSED_BY",
        "inChargePerson": "IN_CHARGE_PERSON",
        "inChargePartner": "IN_CHARGE_PARTNER",
        "startDate": "START_DATE",
        "endDate": "END_DATE",
        "isFuture": "IS_FUTURE",
        "isDead": "IS_DEAD"
    }
    this.loaded = {
        "offices": [],
        "subdeparments": [],
        "clients": [],
        "activities": []
    }
    this.projectCodes = [];
    this.filterForm = null;
    this.filter = {};
    
    this.filter = ProjectCodesListFilter.prototype.getDefaultFilter();    
    var filterIsUsed = false;
    if(filter != null) {
        if(filter.code != null && filter.code != '') {
            this.filter.code = filter.code;
            filterIsUsed = true;
        }
    }
    if(! filterIsUsed) {
        var filterStr = getCookie("projectCodesListFilter");
        if(filterStr != null) {
            try{
                this.filter = ProjectCodesListFilter.prototype.normalizeFilter(jQuery.parseJSON(filterStr));
            } catch (e) {
                deleteCookie("projectCodesListFilter");
            }
        }
    }

    this.invoiceRequestsFilter = InvoiceRequestsFilter.prototype.getDefaultFilter();
    var invoiceRequestsFilterStr = getCookie("invoiceRequestsFilter");
    if(invoiceRequestsFilterStr != null) {
        try{
            this.invoiceRequestsFilter = InvoiceRequestsFilter.prototype.normalizeFilter(jQuery.parseJSON(invoiceRequestsFilterStr));
        } catch (e) {
            deleteCookie("invoiceRequestsFilter");
        }
    }

    var displayFieldsStr = getCookie("projectCodeListDisplayFields");
    if(displayFieldsStr != null) {
        try{
            this.displayFields = ProjectCodesListDisplayFieldsFilter.prototype.normalizeDisplayFields(jQuery.parseJSON(displayFieldsStr));
        } catch (e) {
            deleteCookie("projectCodeListDisplayFields");
        }
    }
    if(this.displayFields == null) {
        this.displayFields = ProjectCodesListDisplayFieldsFilter.prototype.getDefaultDisplayFields();
    }
    this.sorter = {
        "field": 'CODE',
        "order": 'ASC'
    };
    this.limiter = {
        "page": 0,
        "itemsPerPage": 10
    };
    this.batch = {
        "action": null,
        "projectCodeIds": []
    };
    this.selected  = {
        projectCodeIds : []
    }
}
ProjectCodesList.prototype.resetFilters = function() {
    this.limiter.page = 0;
    this.filter = ProjectCodesListFilter.prototype.getDefaultFilter();
    this.invoiceRequestsFilter = InvoiceRequestsFilter.prototype.getDefaultFilter();
    this.selected.projectCodeIds = [];
    var filterStr = getJSON(this.filter);
    var invoiceRequestsFilterStr = getJSON(this.invoiceRequestsFilter);
    var expire = new Date();
    expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 100);
    setCookie("projectCodesListFilter", filterStr, expire.toGMTString(), null);        
    setCookie("invoiceRequestsFilter", invoiceRequestsFilterStr, expire.toGMTString(), null);        
    this.getProjectCodeList();
}
ProjectCodesList.prototype.init = function() {
    contentSizeChangedEventSubscribers.push({"context": this, "function": this.normalizeContentSize});
    this.getProjectCodeList();
}
ProjectCodesList.prototype.getProjectCodeList = function() {
    var form = this;
    var data = {};
    data.command = "getProjectCodesList";
    data.filter = getJSON(this.filter);
    data.sorter = getJSON(this.sorter);
    data.limiter = getJSON(this.limiter);
    data.invoiceRequestsFilter = getJSON(this.invoiceRequestsFilter);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.count = result.count;
            form.projectCodes = result.projectCodes;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProjectCodesList.prototype.loadSummary = function() {
    var form = this;
    var data = {};
    data.command = "getSummary";
    data.id = this.selected.projectCodeIds[0];
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.projectCode = result.projectCode;
            form.client = result.client;
            form.inChargePerson = result.inChargePerson;
            form.inChargePartner = result.inChargePartner;
            form.feesAdvances = result.feesAdvances;
            form.currency = result.currency;
            form.showSummary();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProjectCodesList.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getLayoutHtml());
    this.updateTableView();
    this.updateBatchActionView();
    this.updateLimiterSizeView();
    this.updateLimiterView();

    this.setEventHandlers();
    this.normalizeContentSize();
}
ProjectCodesList.prototype.getLayoutHtml = function() {
    var html = '';
    html += '<div id="' + this.htmlId + '_projectCodes"></div>';
    return html;
}
ProjectCodesList.prototype.updateTableView = function() {
    var colNames = [];
    var colModel = [];
    if(this.displayFields.id) {
        colNames.push('ID');
        colModel.push({name:'id',index:'id', width:30, frozen : true});
    }
    if(this.displayFields.code) {
        colNames.push('Code');
        colModel.push({name:'code',index:'code', width:400, frozen : false});
    }
    if(this.displayFields.client) {
        colNames.push('Client');
        colModel.push({name:'client',index:'client', width:80});
    }
    if(this.displayFields.office) {
        colNames.push('Office');
        colModel.push({name:'office',index:'office', width:80});
    }
    if(this.displayFields.subdepartment) {
        colNames.push('Subdepartment');
        colModel.push({name:'subdepartment',index:'subdepartment', width:100});
    }
    if(this.displayFields.activity) {
        colNames.push('Activity');
        colModel.push({name:'activity',index:'activity', width:100});
    }
    if(this.displayFields.year) {
        colNames.push('Year');
        colModel.push({name:'year',index:'year', width:50});
    }
    if(this.displayFields.financialYear) {
        colNames.push('Financial Year');
        colModel.push({name:'financialYear',index:'financialYear', width:80});
    }
    if(this.displayFields.periodType) {
        colNames.push('Period Type');
        colModel.push({name:'periodType',index:'periodType', width:100});
    }
    if(this.displayFields.periodQuarter) {
        colNames.push('Quarter');
        colModel.push({name:'periodQuarter',index:'periodQuarter', width:100});
    }
    if(this.displayFields.periodMonth) {
        colNames.push('Month');
        colModel.push({name:'periodMonth',index:'periodMonth', width:100});
    }
    if(this.displayFields.periodDate) {
        colNames.push('Date');
        colModel.push({name:'periodDate',index:'periodDate', width:100});
    }
    if(this.displayFields.periodCounter) {
        colNames.push('Counter');
        colModel.push({name:'periodCounter',index:'periodCounter', width:100});
    }
    if(this.displayFields.description) {
        colNames.push('Description');
        colModel.push({name:'description',index:'description', width:150});
    }
    if(this.displayFields.comment) {
        colNames.push('Comment');
        colModel.push({name:'comment',index:'comment', width:150});
    }
    if(this.displayFields.createdAt) {
        colNames.push('Created at');
        colModel.push({name:'createdAt',index:'createdAt', width:120});
    }
    if(this.displayFields.createdBy) {
        colNames.push('Created by');
        colModel.push({name:'createdBy',index:'createdBy', width:100});
    }
    if(this.displayFields.isClosed) {
        colNames.push('Closed');
        colModel.push({name:'isClosed',index:'isClosed', width:40});
    }
    if(this.displayFields.closedAt) {
        colNames.push('Closed at');
        colModel.push({name:'closedAt',index:'closedAt', width:120});
    }
    if(this.displayFields.closedBy) {
        colNames.push('Closed by');
        colModel.push({name:'closedBy',index:'closedBy', width:100});
    }
    if(this.displayFields.inChargePerson) {
        colNames.push('Person In Charge');
        colModel.push({name:'inChargePersonFullName',index:'inChargePersonFullName', width:100});
    }
    if(this.displayFields.inChargePartner) {
        colNames.push('Partner In Charge');
        colModel.push({name:'inChargePartnerFullName',index:'inChargePartnerFullName', width:100});
    }
    if(this.displayFields.startDate) {
        colNames.push('Start');
        colModel.push({name:'startDate',index:'startDate', width:80});
    }
    if(this.displayFields.endDate) {
        colNames.push('End');
        colModel.push({name:'endDate',index:'endDate', width:80});
    }
    if(this.displayFields.isFuture) {
        colNames.push('Future');
        colModel.push({name:'isFuture',index:'isFuture', width:40});
    }
    if(this.displayFields.isDead) {
        colNames.push('Dead');
        colModel.push({name:'isDead',index:'isDead', width:40});
    }
    if(this.displayFields.isHidden) {
        colNames.push('Hidden');
        colModel.push({name:'isHidden',index:'isHidden', width:40});
    }
    if(this.displayFields.conflictStatus) {
        colNames.push('Conflict status');
        colModel.push({name:'conflictStatus',index:'conflictStatus', width:40});
    }
    var normalizedData = [];
    for(var key in this.projectCodes) {
        var projectCode = this.projectCodes[key];
        var item = {
            "id": projectCode.id,
            "code": projectCode.code,
            "client": projectCode.client,
            "office": projectCode.office,
            "subdepartment": projectCode.subdepartment,
            "activity": projectCode.activity,
            "year": projectCode.year,
            "financialYear": projectCode.financialYear != null ? '' + projectCode.financialYear + '-' + (projectCode.financialYear + 1) : '',
            "periodType": projectCode.periodType,
            "periodQuarter": projectCode.periodQuarter,
            "periodMonth": projectCode.periodMonth,
            "periodDate": projectCode.periodDate,
            "periodCounter": projectCode.periodCounter,
            "description": projectCode.description,
            "comment": projectCode.comment,
            "createdAt": getStringFromYearMonthDateTime(projectCode.createdAt),
            "createdBy": projectCode.createdBy,
            "isClosed": booleanVisualizer.getHtml(projectCode.isClosed),
            "closedAt": getStringFromYearMonthDateTime(projectCode.closedAt),
            "closedBy" : projectCode.closedBy,
            "inChargePersonFullName" : projectCode.inChargePerson != null ? (projectCode.inChargePerson.firstName + ' ' + projectCode.inChargePerson.lastName) : '', 
            "inChargePartnerFullName" : projectCode.inChargePartner != null ? (projectCode.inChargePartner.firstName + ' ' + projectCode.inChargePartner.lastName) : '',
            "startDate": calendarVisualizer.getHtml(projectCode.startDate),
            "endDate": calendarVisualizer.getHtml(projectCode.endDate),
            "isFuture" : booleanVisualizer.getHtml(projectCode.isFuture),
            "isDead" : booleanVisualizer.getHtml(projectCode.isDead),
            "isHidden" : booleanVisualizer.getHtml(projectCode.isHidden),
            "conflictStatus" : projectCode.conflictStatus
        }
        normalizedData.push(item);
    }
    var form = this;
    var html ='';
    html += '<table id="' + this.htmlId + '_projectCodesTable"></table>';
    $('#' + this.htmlId + '_projectCodes').html(html);
    jQuery('#' + this.htmlId + '_projectCodesTable').jqGrid('clearGridData');
    jQuery('#' + this.htmlId + '_projectCodesTable').jqGrid({
        datatype: "local",
        data: normalizedData,
        height: 250,
        width: 1000,
        colNames: colNames,
        colModel: colModel,
        rowNum:1000,
        multiselect: true,
        //caption: "Project Codes",
        emptyrecords: "Nothing to display for current filter settings and data saved",
        viewrecords: true,
        toolbar: [true,"both"],
        shrinkToFit: false,
        sortname: form.sorter != null && form.sorter.field != null ? form.getColumnNameByServerSortName(form.sorter.field) : null,
        sortorder: form.sorter != null && form.sorter.order != null ? form.sorter.order.toLowerCase() : null,
        onSelectRow: function(id, status) {
            var index = jQuery.inArray(id, form.selected.projectCodeIds);
            if(index == -1 && status == true) {
                form.selected.projectCodeIds.push(id);
            } else if(index != -1 && status == false) {
                form.selected.projectCodeIds.splice(index, 1);
            }
            form.updateLinksView();
	},
        onSelectAll: function(ids, status) {
            if(status == true) {
                form.selected.projectCodeIds = ids;
            } else {
                form.selected.projectCodeIds = [];
            }
        },
        onSortCol: function(index, iCol, sortorder) {
            form.sorter = {
                "field": form.sortFields[index],
                "order": sortorder.toUpperCase()
            };
            form.getProjectCodeList();
            return 'stop';
        }
    });
    var toolbarHtml = '';
    toolbarHtml += '<table><tr>';
    toolbarHtml += '<td id="' + this.htmlId + '_filterCell"><button id="' + this.htmlId + '_filterBtn" title="Filter data">Filter</button></td>';
    toolbarHtml += '<td id="' + this.htmlId + '_invoiceRequestsFilterCell"><button  id="' + this.htmlId + '_invoiceRequestsFilterBtn" title="Filter invoice requests">Invoice</button></td>';
    toolbarHtml += '<td><button id="' + this.htmlId + '_resetFiltersBtn' + '">Reset</button></td>';
    toolbarHtml += '<td><button  id="' + this.htmlId + '_displayBtn" title="Define displayed fields">Display</button> </td>';
    toolbarHtml += '<td><button  id="' + this.htmlId + '_summaryBtn" title="Project code summary">Summary</button> </td>';
    toolbarHtml += '<td><select id="' + this.htmlId + '_batch_action" title="Batch_action"></select></td>';
    toolbarHtml += '<td><button  id="' + this.htmlId + '_batch" title="Update data">Update</button> </td>';
    toolbarHtml += '<td><button id="' + this.htmlId + '_edit" title="Edit selected project code">Edit</button> </td>';
    toolbarHtml += '<td><button  id="' + this.htmlId + '_delete" title="Delete selected project code">Delete</button> </td>';
    toolbarHtml += '<td><span  id="' + this.htmlId + '_links"></span> </td>';
    toolbarHtml += '</tr></table>';
    $('#t_' + this.htmlId + '_projectCodesTable').append(toolbarHtml);
    this.updateFilterSelectionView();
    
    var limiterHtml = '';
    limiterHtml += '<select id="' + this.htmlId + '_limiter_size"></select><span id="' + this.htmlId + '_limiter"></span>';
    $('#tb_' + this.htmlId + '_projectCodesTable').append(limiterHtml);
    
    $('#' + this.htmlId + '_filterBtn').button({
        icons: {
            primary: "ui-icon-search"
        }
    }).click(function(event) {
        form.showFilter.call(form);
    });
    $('#' + this.htmlId + '_invoiceRequestsFilterBtn')
      .button({
        icons: {
            primary: "ui-icon-zoomin"
        },
        text: true
        })
      .click(function( event ) {
        form.showInvoiceRequestsFilter.call(form);
    });
    
    $('#' + this.htmlId + '_resetFiltersBtn')
      .button({
        icons: {
            primary: "ui-icon-arrowthick-1-w"
        },
        text: true
        })
      .click(function( event ) {
        form.resetFilters.call(form);
    });
    
    $('#' + this.htmlId + '_displayBtn').button({
        icons: {
            primary: "ui-icon-grip-dotted-horizontal"
        }
    }).click(function(event) {
        form.showDisplayFieldsFilter.call(form);
    });

    $('#' + this.htmlId + '_summaryBtn').button({
        icons: {
            primary: "ui-icon-comment"
        }
    }).click(function(event) {
        form.summaryClickedHandle.call(form);
    });

    $('#' + this.htmlId + '_batch').button({
        icons: {
            primary: "ui-icon-gear"
        }
    }).click(function(event) {
        form.startBatchUpdate.call(form, event);
    });
    
    $('#' + this.htmlId + '_edit').button({
        icons: {
            primary: "ui-icon-pencil"
        }
    }).click(function(event) {
        form.editClickedHandle.call(form, event);
    });
    $('#' + this.htmlId + '_delete').button({
        icons: {
            primary: "ui-icon-trash"
        }
    }).click(function(event) {
        form.deleteClickedHandle.call(form, event);
    });
    $('#t_' + this.htmlId + '_projectCodesTable').height(33);
    $('#tb_' + this.htmlId + '_projectCodesTable').height(33);
}
ProjectCodesList.prototype.updateFilterSelectionView = function() {
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
ProjectCodesList.prototype.updateBatchActionView = function() {
    var options = {
        "": "...",
        "SET_CLOSED": "Set as Closed",
        "SET_NON_CLOSED": "Set as Non-Closed",
        "SET_FUTURE": "Set as Future",
        "SET_NON_FUTURE": "Set as Non-Future",
        "SET_DEAD": "Set as Dead",
        "SET_NON_DEAD": "Set as Non-Dead",
        "SET_HIDDEN": "Set as Hidden",
        "SET_NON_HIDDEN": "Set as Non-Hidden"
    };
    this.updateSelectorView(this.htmlId + '_batch_action', this.batch.action, options);
}
ProjectCodesList.prototype.updateLinksView = function() {
    var html = '';
    if(this.selected.projectCodeIds.length == 1) {
        var projectCode = null;
        for(var key in this.projectCodes) {
            if(this.projectCodes[key].id == this.selected.projectCodeIds[0]) {
                projectCode = this.projectCodes[key];
                break;
            }
        }
        html += ' | <span class="link"><a href="../../financial_information/fees/index.jsp?code=' + escape(projectCode.code) + '">Budget management</a></span> ';
        html += ' | <span class="link"><a href="../../reports/code/project_code_approvement/index.jsp?code=' + escape(projectCode.code) + '">Approvement</a></span>';
        html += ' | <span class="link"><a href="../../reports/code/code_detail/index.jsp?code=' + escape(projectCode.code) + '">Code detail report</a></span>';
    }
    $('#' + this.htmlId + '_links').html(html);
}

ProjectCodesList.prototype.updateSelectorView = function(id, value, options) {
    var html = '';
    for(var key in options) {
        var isSelected = '';
        if(key == value) {
            isSelected = 'selected';
        }
        html += '<option ' + isSelected + ' value="' + key + '">' + options[key] + '</option>';
    }
    $("#" + id).html(html);
}

ProjectCodesList.prototype.setEventHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_batch_action').bind("change", function(event) {form.batchActionChangedHandle.call(form, event)});
    $('span[id^="' + this.htmlId + '_limiter_page_"]').bind("click", function(event) {form.pageClickHandle.call(form, event)});
    $('#' + this.htmlId + '_limiter_size').bind("change", function(event) {form.limiterSizeChangedHandle.call(form, event)});
}
ProjectCodesList.prototype.batchActionChangedHandle = function(event) {
    var action = $('#' + this.htmlId + '_batch_action').val();
    if(action == "") {
        this.batch.action = null;
    } else {
        this.batch.action = action;
    }
}
ProjectCodesList.prototype.summaryClickedHandle = function(event) {
    if(this.selected.projectCodeIds.length == 0) {
        doAlert("Info", "No Project Code selected", null, null);
    } else if(this.selected.projectCodeIds.length > 1) {
        doAlert("Info", "This action can be applied to one selected Project Code only", null, null);
    } else {
        this.loadSummary();
    }
}
ProjectCodesList.prototype.deleteClickedHandle = function(event) {
    if(this.selected.projectCodeIds.length == 0) {
        doAlert("Info", "No Project Code selected", null, null);
    } else if(this.selected.projectCodeIds.length > 1) {
        doAlert("Info", "This action can be applied to one selected Project Code only", null, null);
    } else {
        this.checkDeleteDependencies();
    }
}

ProjectCodesList.prototype.editClickedHandle = function(event) {
    if(this.selected.projectCodeIds.length == 0) {
        doAlert("Info", "No Project Code selected", null, null);
    } else {
        var formData = {
            "projectCodeIds": this.selected.projectCodeIds
        }
        this.projectCodeBatchEditForm = new ProjectCodeBatchEditForm(formData, this.htmlId + '_projectCodeBatchEditForm', this.getProjectCodeList, this);
        this.projectCodeBatchEditForm.init();         
    }
}

ProjectCodesList.prototype.checkDeleteDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkProjectCodeDependencies";
    data.id = this.selected.projectCodeIds[0];
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.analyzeDeleteDependencies(result);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}

ProjectCodesList.prototype.showFilter = function() {
    this.filterForm = new ProjectCodesListFilter("projectCodesListFilter", this.moduleName, this.filter, this.acceptFilterData, this);
    this.filterForm.init();
}
ProjectCodesList.prototype.showInvoiceRequestsFilter = function() {
    this.invoiceRequestsFilterForm = new InvoiceRequestsFilter("invoiceRequestsFilter", this.moduleName, this.invoiceRequestsFilter, this.acceptInvoiceRequestsFilterData, this);
    this.invoiceRequestsFilterForm.init(); 
}
ProjectCodesList.prototype.acceptFilterData = function(filter) {
    this.limiter.page = 0;
    this.filter = filter;
    this.selected.projectCodeIds = [];
    var filterStr = getJSON(this.filter);
    var expire = new Date();
    expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 100);
    setCookie("projectCodesListFilter", filterStr, expire.toGMTString(), null);    
    this.getProjectCodeList();
}
ProjectCodesList.prototype.acceptInvoiceRequestsFilterData = function(invoiceRequestsFilter) {
    this.limiter.page = 0;
    this.invoiceRequestsFilter = invoiceRequestsFilter;
    this.selected.projectCodeIds = [];
    var invoiceRequestsFilterStr = getJSON(this.invoiceRequestsFilter);
    var expire = new Date();
    expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 100);
    setCookie("invoiceRequestsFilter", invoiceRequestsFilterStr, expire.toGMTString(), null);        
    this.getProjectCodeList();
}
ProjectCodesList.prototype.showDisplayFieldsFilter = function() {
    this.filterDisplayFieldsForm = new ProjectCodesListDisplayFieldsFilter("projectCodeListDisplayFieldsFilter", this.moduleName, this.displayFields, this.acceptDisplayFieldsFilterData, this);
    this.filterDisplayFieldsForm.init();
}
ProjectCodesList.prototype.acceptDisplayFieldsFilterData = function(displayFields) {
    this.limiter.page = 0;
    this.displayFields = displayFields;
    var displayFieldsStr = getJSON(this.displayFields);
    var expire = new Date();
    expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 100);
    setCookie("projectCodeListDisplayFields", displayFieldsStr, expire.toGMTString(), null);
    this.getProjectCodeList();
}

ProjectCodesList.prototype.deleteProjectCode = function() {
    var form = this;
    var data = {};
    data.command = "deleteProjectCode";
    data.id = this.selected.projectCodeIds[0];
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Project Code has been successfully deleted", form, form.afterDeleteHandle);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProjectCodesList.prototype.doBatchUpdate = function(event) {
    this.batch.projectCodeIds = this.selected.projectCodeIds;
    var form = this;
    var data = {};
    data.command = "doBatchUpdate";
    data.batch = getJSON(this.batch);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", 'Batch update has been successfully performed', form, form.afterBatchUpdateHandle);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}

ProjectCodesList.prototype.limiterSizeChangedHandle = function(event) {
    this.limiter.itemsPerPage = $(event.currentTarget).val();
    this.limiter.page = 0;
    this.resetSelection();
    this.getProjectCodeList();
}
ProjectCodesList.prototype.pageClickHandle = function(event) {
    var htmlId = $(event.currentTarget).attr("id");
    var tmp = htmlId.split("_");
    var page = parseInt(tmp[tmp.length - 1]);
    this.limiter.page = page;
    this.resetSelection();
    this.getProjectCodeList();
}

ProjectCodesList.prototype.updateLimiterSizeView = function() {
    var options = {"10": "10", "50": "50", "100": "100"}
    this.updateSelectorView(this.htmlId + '_limiter_size', this.limiter.itemsPerPage, options);
}


ProjectCodesList.prototype.showSummary = function() {
    var html = '';
    html += '<span class="label1">Project code:</span> ' + this.projectCode.code + '<br />';
    html += '<span class="label1">Client:</span> ' + this.client.name + '<br />';
    html += '<span class="label1">Description:</span> ' + this.projectCode.description + '<br />';
    for(var key in this.feesAdvances) {
        var feesAdvance = this.feesAdvances[key];
        html += '<span class="label1">Invoice to issue:</span> ' + feesAdvance.amount + ' ' + this.currency.code + '<br />';
        html += '<span class="label1">Date:</span> ' + calendarVisualizer.getHtml(feesAdvance.date) + '<br />';
    }
    if(this.inChargePerson != null) {
        html += '<span class="label1">Person in charge:</span> ' + this.inChargePerson.firstName + ' ' + this.inChargePerson.lastName + '<br />';
    }
    if(this.inChargePartner != null) {
        html += '<span class="label1">Partner in charge:</span> ' + this.inChargePartner.firstName + ' ' + this.inChargePartner.lastName + '<br />';
    }
    this.popupHtmlId = getNextPopupHtmlContainer();
    $('#' + this.popupHtmlId).html(html);
    var form = this;
    $('#' + this.popupHtmlId).dialog({
        title: "Project code summary",
        modal: true,
        position: 'center',
        width: 600,
        height: 400,
        buttons: {
            Ok: function() {
                $('#' + form.popupHtmlId).dialog("close");
            }
	},
        close: function(event, ui) {
            releasePopupLayer();
        } 
    });
}


ProjectCodesList.prototype.updateLimiterView = function() {
    var pagesCount = parseInt(this.count / this.limiter.itemsPerPage) + 1;
    var html = 'Found: ' + this.count + '. ';
    if(pagesCount > 1) {
        for(var i = 0; i < pagesCount; i++) {
            if(this.limiter.page - i > 5) {
                continue;
            }
            if(i - this.limiter.page > 5) {
                break;
            }
            if(i == this.limiter.page) {
                html += '<span>' + (i + 1) + '</span>';
            } else {
                html += '<span class="link" id="' + this.htmlId + '_limiter_page_' + i + '">' + (i + 1) + '</span>';
            }
        }
    }
    $('#' + this.htmlId + '_limiter').html(html);
}
ProjectCodesList.prototype.limiterSizeChangedHandle = function(event) {
    this.limiter.itemsPerPage = $(event.currentTarget).val();
    this.limiter.page = 0;
    this.resetSelection();
    this.getProjectCodeList();
}
ProjectCodesList.prototype.pageClickHandle = function(event) {
    var htmlId = $(event.currentTarget).attr("id");
    var tmp = htmlId.split("_");
    var page = parseInt(tmp[tmp.length - 1]);
    this.limiter.page = page;
    this.resetSelection();
    this.getProjectCodeList();
}

ProjectCodesList.prototype.startBatchUpdate = function(event) {
    if(this.selected.projectCodeIds.length == 0) {
        doAlert("Info", "Select Project Codes and apply choosed batch update action to them", null, null);
    } else if(this.batch.action == null) {
        doAlert("Info", "Select Action to apply to selected project codes", null, null);
    } else {
        if(this.batch.action == 'SET_DEAD') {
            doConfirm("Info", 'Proceed with applying this action (' + this.batch.action + ') to selected Project Codes', this, this.checkSetDeadBatchUpdate, null, null);
        } else {
            doConfirm("Info", 'Proceed with applying this action (' + this.batch.action + ') to selected Project Codes', this, this.doBatchUpdate, null, null);
        }
    }
}
ProjectCodesList.prototype.deleteClickedHandle = function(event) {
    if(this.selected.projectCodeIds.length == 0) {
        doAlert("Info", "No Project Code selected", null, null);
    } else if(this.selected.projectCodeIds.length > 1) {
        doAlert("Info", "This action can be applied to one selected Project Code only", null, null);
    } else {
        this.checkDeleteDependencies();
    }
}
ProjectCodesList.prototype.checkDeleteDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkProjectCodeDependencies";
    data.id = this.selected.projectCodeIds[0];
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.analyzeDeleteDependencies(result);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProjectCodesList.prototype.analyzeDeleteDependencies = function(dependencies) {
    if(dependencies.timeSpentItems == 0 && 
            dependencies.feesItem != true && 
            dependencies.outOfPocketItems != true && 
            dependencies.agreement != true &&
            dependencies.invoiceRequestPackets == 0
            ) {
        doConfirm("Confirm", "Do you really want to delete this Project Code?", this, this.deleteProjectCode, null, null);
    } else {
        var html = 'This Project Code has dependencies and can not be deleted<br />';
        html += 'Time Spent Items: ' + dependencies.timeSpentItems + '<br />';
        html += 'Fees item exists: ' + dependencies.feesItem + '<br />';
        html += 'Out Of Pocket item exists: ' + dependencies.outOfPocketItem + '<br />';
        html += 'Agreement exists: ' + dependencies.agreement + '<br />';
        html += 'Invoice Request Packets: ' + dependencies.invoiceRequestPackets + '<br />';
        doAlert("Dependencies found", html, null, null);
    }
}
ProjectCodesList.prototype.deleteProjectCode = function() {
    var form = this;
    var data = {};
    data.command = "deleteProjectCode";
    data.id = this.selected.projectCodeIds[0];
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Project Code has been successfully deleted", form, form.afterDeleteHandle);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProjectCodesList.prototype.checkSetDeadBatchUpdate = function() {
    var form = this;
    var data = {};
    data.command = "checkSetDeadBatchUpdate";
    data.projectCodeIds = getJSON({"list": this.selected.projectCodeIds});
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.analyzeSetDeadBatchUpdate(result);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProjectCodesList.prototype.analyzeSetDeadBatchUpdate = function(dependencies) {
    if(dependencies.timeSheetedProjectCodes.length > 0) {
        var message = 'The following codes have been used in timesheets.<br />';
        for(var key in dependencies.timeSheetedProjectCodes) {
            var projectCode = dependencies.timeSheetedProjectCodes[key];
            message += projectCode.code + '<br />';
        }
        message += 'Proceed with setting all selected codes as Dead?';
        doConfirm("Confirm", message, this, this.doBatchUpdate, null, null);
    } else {
        this.doBatchUpdate();
    }
}
ProjectCodesList.prototype.doBatchUpdate = function(event) {
    this.batch.projectCodeIds = this.selected.projectCodeIds;
    var form = this;
    var data = {};
    data.command = "doBatchUpdate";
    data.batch = getJSON(this.batch);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", 'Batch update has been successfully performed', form, form.afterBatchUpdateHandle);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProjectCodesList.prototype.afterDeleteHandle = function(event) {
    this.limiter.page = 0;
    this.resetSelection();
    this.getProjectCodeList();
}
ProjectCodesList.prototype.afterBatchUpdateHandle = function(event) {
    this.limiter.page = 0;
    this.resetSelection();
    this.getProjectCodeList();
}
ProjectCodesList.prototype.resetSelection = function(event) {
    this.selected.projectCodeIds = [];
}
ProjectCodesList.prototype.normalizeContentSize = function() {
    var layoutWidth = contentWidth - 10;
    var layoutHeight = contentHeight - 100;
   
    jQuery('#' + this.htmlId + '_projectCodesTable').jqGrid('setGridWidth', layoutWidth - 5);
    jQuery('#' + this.htmlId + '_projectCodesTable').jqGrid('setGridHeight', layoutHeight - 30);
}
ProjectCodesList.prototype.getColumnNameByServerSortName = function(serverSortName) {
    for(var key in this.sortFields) {
        if(this.sortFields[key] == serverSortName) {
            return key;
        }
    }
    return null;
}
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ProjectCodesListFilter(htmlId, moduleName, filter, callback, callbackContext) {
    this.config = {
        endpointUrl: endpointsFolder + "ProjectCodesListFilter.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.moduleName = moduleName;
    this.callback = callback;
    this.callbackContext = callbackContext;
    this.disabled = {
        "id": false,
        "code": false,
        "group": false,
        "client": false,
        "office": false,
        "department": false,
        "subdepartment": false,
        "subdepartmentName": false,
        "activity": false,
        "activityName": false,
        "periodType": false,
        "periodQuarter": false,
        "periodMonth": false,
        "periodDate": false,
        "periodCounter": false,
        "code": false,
        "year": false,
        "financialYear": false,
        "description": false,
        "comment": false,
        "createdAtRange": false,
        "createdBy": false,
        "isClosed": false,
        "inChargePerson": false,
        "inChargePartner": false,
        "closedAtRange": false,
        "closedBy": null,
        "startDateRange": false,
        "endDateRange": false,
        "isFuture": false,
        "isDead": false,
        "isHidden": false,
        "projectCodeConflictStatus": false
    };
    if(filter != null) {
        this.filter = clone(filter);
    } else {
        this.filter = this.getDefaultFilter();
    } 
    this.loaded = {
        groups: [],
        clients: [],
        offices: [],
        departments: [],
        subdepartments: [],
        activities: [],
        inChargePerson: null,
        inChargePartner: null
    }
    this.financialYears = {};
    this.internalFilter = {
        'client': null,
        'group': null
    }
    var currentYear = (new Date()).getFullYear();
    for(var i = 2008; i <= currentYear + 1; i++) {
        this.financialYears[i] = '' + i + '-' + (i + 1);
    }
}
ProjectCodesListFilter.prototype.isFilterUsed = function(filter) {
    if(filter.id != null) {
        return true;
    }
    if(filter.groupId != null) {
        return true;
    }
    if(filter.clientId != null) {
        return true;
    }
    if(filter.departmentId != null) {
        return true;
    }
    if(filter.subdepartmentId != null) {
        return true;
    }
    if(filter.subdepartmentName != null && filter.subdepartmentName != '') {
        return true;
    }
    if(filter.activityId != null) {
        return true;
    }
    if(filter.activityName != null && filter.activityName != '') {
        return true;
    }
    if(filter.officeId != null) {
        return true;
    }
    if(filter.periodType != null && filter.periodType != 'ALL') {
        return true;
    }
    if(filter.periodQuarter != null && filter.periodQuarter != 'ALL') {
        return true;
    }
    if(filter.periodMonth != null && filter.periodMonth != 'ALL') {
        return true;
    }
    if(filter.periodDate != null && filter.periodDate != 'ALL') {
        return true;
    }
    if(filter.periodCounter != null && filter.periodCounter != 'ALL') {
        return true;
    }
    if(filter.code != null && filter.code != '') {
        return true;
    }
    if(filter.year != null && filter.year != '') {
        return true;
    }
    if(filter.financialYear != null && filter.financialYear != '') {
        return true;
    }
    if(filter.description != null && filter.description != '') {
        return true;
    }
    if(filter.comment != null && filter.comment != '') {
        return true;
    }
    if(filter.createdAtRange != null && (filter.createdAtRange.from != null || filter.createdAtRange.to != null)) {
        return true;
    }
    if(filter.createdById != null) {
        return true;
    }
    if(filter.isClosed != null && filter.isClosed != 'ALL') {
        return true;
    }
    if(filter.closedAtRange && (filter.closedAtRange.from != null || filter.closedAtRange.to != null)) {
        return true;
    }
    if(filter.closedById != null) {
        return true;
    }
    if(filter.inChargePersonId != null) {
        return true;
    }
    if(filter.inChargePartnerId != null) {
        return true;
    }
    if(filter.startDateRange && (filter.startDateRange.from != null || filter.startDateRange.to != null)) {
        return true;
    }
    if(filter.endDateRange && (filter.endDateRange.from != null || filter.endDateRange.to != null)) {
        return true;
    }
    if(filter.isFuture != null && filter.isFuture != 'ALL') {
        return true;
    }
    if(filter.isDead != null && filter.isDead != 'ALL') {
        return true;
    }
    if(filter.isHidden != null && filter.isHidden != 'ALL') {
        return true;
    }
    if(filter.projectCodeConflictStatus != null) {
        return true;
    }
    return false;
}
ProjectCodesListFilter.prototype.getDefaultFilter = function() {
    return {
        "id": null,
        "code": null,
        "groupId": null,
        "clientId": null,
        "officeId": null,
        "departmentId": null,
        "subdepartmentId": null,
        "subdepartmentName": null,
        "activityId": null,
        "activityName": null,
        "periodType": "ALL",
        "periodQuarter": "ALL",
        "periodMonth": "ALL",
        "periodDate": "ALL",
        "periodCounter": null,
        "code": null,
        "year": null,
        "financialYear": null,
        "description": null,
        "comment": null,
        "createdAtRange": {
            "from": null,
            "to": null
        },
        "createdBy": null,
        "isClosed": "ALL",
        "closedAtRange": {
            "from": null,
            "to": null
        },
        "closedBy" : null,
        "inChargePersonId" : null,
        "inChargePartnerId" : null,
        "startDateRange": {
            "from": null,
            "to": null
        },
        "endDateRange": {
            "from": null,
            "to": null
        },
        "isFuture" : "ALL",
        "isDead" : "ALL",
        "isHidden" : "ALL",
        "projectCodeConflictStatus" : null
    }
}
ProjectCodesListFilter.prototype.normalizeFilter = function(obj) {
    var normalizedFilter = {
        "id": obj.id,
        "code": obj.code,
        "groupId": obj.groupId,
        "clientId": obj.clientId,
        "officeId": obj.officeId,
        "departmentId": obj.departmentId,
        "subdepartmentId": obj.subdepartmentId,
        "subdepartmentName": obj.subdepartmentName,
        "activityId": obj.activityId,
        "activityName": obj.activityName,
        "year": obj.year,
        "financialYear": obj.financialYear,
        "periodType": obj.periodType,
        "periodQuarter": obj.periodQuarter,
        "periodMonth": obj.periodMonth,
        "periodDate": obj.periodDate,
        "periodCounter": obj.periodCounter,
        "description": obj.description,
        "comment": obj.comment,
        "createdBy": obj.createdBy,
        "isClosed": obj.isClosed,
        "closedBy" : obj.closedBy,
        "inChargePersonId" : obj.inChargePersonId,
        "inChargePartnerId" : obj.inChargePartnerId,
        "isFuture" : obj.isFuture,
        "isDead" : obj.isDead,
        "isHidden" : obj.isHidden,
        "projectCodeConflictStatus" : obj.projectCodeConflictStatus
    }
    if(obj.createdAtRange != null) {
        normalizedFilter.createdAtRange = {
            from: obj.createdAtRange.from,
            to: obj.createdAtRange.to        
        }
    } else {
        normalizedFilter.createdAtRange = {
            from: null,
            to: null        
        }
    }   
    if(obj.startDateRange != null) {
        normalizedFilter.startDateRange = {
            from: obj.startDateRange.from,
            to: obj.startDateRange.to        
        }
    } else {
        normalizedFilter.startDateRange = {
            from: null,
            to: null        
        }
    }       
    if(obj.endDateRange != null) {
        normalizedFilter.endDateRange = {
            from: obj.endDateRange.from,
            to: obj.endDateRange.to        
        }
    } else {
        normalizedFilter.endDateRange = {
            from: null,
            to: null        
        }
    }       
    if(obj.closedAtRange != null) {
        normalizedFilter.closedAtRange = {
            from: obj.closedAtRange.from,
            to: obj.closedAtRange.to        
        }
    } else {
        normalizedFilter.closedAtRange = {
            from: null,
            to: null        
        }
    }       
    return normalizedFilter;
}
ProjectCodesListFilter.prototype.setDisabled = function(disabled) {
    for(var key in this.disabled) {
        this.disabled[key] = false;
    }
    for(var key in disabled) {
        this.disabled[key] = disabled[key];
    }
}
ProjectCodesListFilter.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
}
ProjectCodesListFilter.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.moduleName = this.moduleName;
    data.filter = getJSON(this.filter);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.groups = result.groups;
            form.loaded.clients = result.clients;
            form.loaded.offices = result.offices;
            form.loaded.departments = result.departments;
            form.loaded.subdepartments = result.subdepartments;
            form.loaded.activities = result.activities;
            form.loaded.inChargePerson = result.inChargePerson;
            form.loaded.inChargePartner = result.inChargePartner;
            
            form.filter.groupId = result.groupId;
            form.filter.clientId = result.clientId;
            form.filter.officeId = result.officeId;
            form.filter.departmentId = result.departmentId;
            form.filter.subdepartmentId = result.subdepartmentId;
            form.filter.activityId = result.activityId;
            
            if(form.loaded.inChargePerson != null) {
                form.filter.inChargePersonId = form.loaded.inChargePerson.id;
            } else {
                form.filter.inChargePersonId = null;
            }
            if(form.loaded.inChargePartner != null) {
                form.filter.inChargePartnerId = form.loaded.inChargePartner.id;
            } else {
                form.filter.inChargePartnerId = null;
            }
            form.show();
        })          
       },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProjectCodesListFilter.prototype.loadGroupContent = function() {
    var form = this;
    var data = {};
    data.command = "getGroupContent";
    data.moduleName = this.moduleName;
    if(this.filter.groupId != null) {
        data.groupId = this.filter.groupId;
    }
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.clients = result.clients;

            form.filter.clientId = null;
            form.updateClientView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProjectCodesListFilter.prototype.loadOfficeContent = function() {
    var form = this;
    var data = {};
    data.command = "getOfficeContent";
    data.moduleName = this.moduleName;
    data.officeId = this.filter.officeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.departments = result.departments;
            form.loaded.subdepartments = [];
            form.loaded.activities = [];

            form.filter.departmentId = null;
            form.filter.subdepartmentId = null;
            form.filter.activityId = null;
            form.updateDepartmentView();
            form.updateSubdepartmentView();
            form.updateActivityView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProjectCodesListFilter.prototype.loadDepartmentContent = function() {
    var form = this;
    var data = {};
    data.command = "getDepartmentContent";
    data.moduleName = this.moduleName;
    data.departmentId = this.filter.departmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.subdepartments = result.subdepartments;
            form.loaded.activities = [];

            form.filter.subdepartmentId = null;
            form.filter.activityId = null;
            form.updateSubdepartmentView();
            form.updateActivityView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProjectCodesListFilter.prototype.loadSubdepartmentContent = function() {
    var form = this;
    var data = {};
    data.command = "getSubdepartmentContent";
    data.moduleName = this.moduleName;
    data.subdepartmentId = this.filter.subdepartmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.activities = result.activities;

            form.filter.activityId = null;
            form.updateActivityView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}

ProjectCodesListFilter.prototype.getLayoutHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td>';
    html += '<button id="' + this.htmlId + '_reset">Reset all</button>';
    html += '</td></tr>';
    html += '</table>';
    
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td>Field Name</td><td>Filter</td></tr>';
    html += '<tr><td>Code</td><td><input type="text" id="' + this.htmlId + '_code" style="width: 300px;"><button id="' + this.htmlId + '_code_clear">Clear</button><br /><span class="comment1">Use the asterisk (*) wildcard character to search</span></td></tr>';
    html += '<tr><td>Group</td><td><input type="text" id="' + this.htmlId + '_groupFilter" style="width: 60px;"><br /><select id="' + this.htmlId + '_group"></td></tr>';
    html += '<tr><td>Client</td><td><input type="text" id="' + this.htmlId + '_clientFilter" style="width: 60px;"><br /><select id="' + this.htmlId + '_client"></td></tr>';
    html += '<tr><td>Office</td><td><select type="text" id="' + this.htmlId + '_office"></td></tr>';
    html += '<tr><td>Department</td><td><select type="text" id="' + this.htmlId + '_department"></td></tr>';
    html += '<tr><td>Subdepartment</td><td><select id="' + this.htmlId + '_subdepartment"></td></tr>';
    html += '<tr><td>Subdepartment name</td><td><input type="text" id="' + this.htmlId + '_subdepartmentName"></td></tr>';
    html += '<tr><td>Activity</td><td><select id="' + this.htmlId + '_activity"></td></tr>';
    html += '<tr><td>Activity name</td><td><input type="text" id="' + this.htmlId + '_activityName"></td></tr>';
    html += '<tr><td>Year</td><td><input type="text" id="' + this.htmlId + '_year" style="width: 60px;"></td></tr>';
    html += '<tr><td>Financial Year</td><td><select id="' + this.htmlId + '_financialYear"></select></td></tr>';
    html += '<tr><td>Period Type</td><td><select id="' + this.htmlId + '_periodType"></select></td></tr>';
    html += '<tr><td>Quarter</td><td><select id="' + this.htmlId + '_periodQuarter"></select></td></tr>';
    html += '<tr><td>Month</td><td><select id="' + this.htmlId + '_periodMonth"></select></td></tr>';
    html += '<tr><td>Date</td><td><select id="' + this.htmlId + '_periodDate"></select></td></tr>';
    html += '<tr><td>Counter</td><td><input type="text" id="' + this.htmlId + '_periodCounter" style="width: 50px;"></td></tr>';
    html += '<tr><td>Start</td><td><input type="text" id="' + this.htmlId + '_startDate_from" style="width: 80px;">-<input type="text" id="' + this.htmlId + '_startDate_to" style="width: 80px;"></td></tr>';
    html += '<tr><td>End</td><td><input type="text" id="' + this.htmlId + '_endDate_from" style="width: 80px;">-<input type="text" id="' + this.htmlId + '_endDate_to" style="width: 80px;"></td></tr>';
    html += '<tr><td>Created At</td><td><input type="text" id="' + this.htmlId + '_createdAt_from" style="width: 80px;">-<input type="text" id="' + this.htmlId + '_createdAt_to" style="width: 80px;"></td></tr>';
    html += '<tr><td>Closed</td><td><select id="' + this.htmlId + '_isClosed"></select></td></tr>';
    html += '<tr><td>Closed at</td><td><input type="text" id="' + this.htmlId + '_closedAt_from" style="width: 80px;">-<input type="text" id="' + this.htmlId + '_closedAt_to" style="width: 80px;"></td></tr>';
    html += '<tr><td>Person in charge</td><td><input type="text" id="' + this.htmlId + '_inChargePerson_userName" style="width: 200px;"><button id="' + this.htmlId + '_inChargePerson_pick">Pick</button><button id="' + this.htmlId + '_inChargePerson_clear">Clear</button></td></tr>';
    html += '<tr><td>Partner in charge</td><td><input type="text" id="' + this.htmlId + '_inChargePartner_userName" style="width: 200px;"><button id="' + this.htmlId + '_inChargePartner_pick">Pick</button><button id="' + this.htmlId + '_inChargePartner_clear">Clear</button></td></tr>';
    html += '<tr><td>Future</td><td><select id="' + this.htmlId + '_isFuture"></select></td></tr>';
    html += '<tr><td>Dead</td><td><select id="' + this.htmlId + '_isDead"></select></td></tr>';
    html += '<tr><td>Hidden</td><td><select id="' + this.htmlId + '_isHidden"></select></td></tr>';
    html += '<tr><td>Conflict status</td><td><select id="' + this.htmlId + '_projectCodeConflictStatus"></select></td></tr>';
    html += '</table>';
    return html;
}
ProjectCodesListFilter.prototype.show = function() {
    var title = 'Filter data'
    var form = this;
    $('#' + this.containerHtmlId).html(this.getLayoutHtml());
    this.setHandlers();
    this.makeButtons();
    this.makeAutocompletes();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 500,
        height: 500,
        buttons: {
            OK: function() {
                form.okHandle.call(form);
                $(this).dialog( "close" );
            },
            Cancel: function() {
                $(this).dialog( "close" );
                $('#' + form.containerHtmlId).html("");
            }
	},
        close: function(event, ui) {
            releasePopupLayer();
        } 
    });
    this.makeDatePickers();
    this.updateView();
}
ProjectCodesListFilter.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_groupFilter').bind("change", function(event) {form.groupFilterChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_clientFilter').bind("change", function(event) {form.clientFilterChangedHandle.call(form, event);});
    
    $('#' + this.htmlId + '_code').bind("change", function(event) {form.codeChangedHandle.call(form)});
    $('#' + this.htmlId + '_group').bind("change", function(event) {form.groupChangedHandle.call(form)});
    $('#' + this.htmlId + '_client').bind("change", function(event) {form.clientChangedHandle.call(form)});
    $('#' + this.htmlId + '_office').bind("change", function(event) {form.officeChangedHandle.call(form)});
    $('#' + this.htmlId + '_department').bind("change", function(event) {form.departmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_subdepartment').bind("change", function(event) {form.subdepartmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_subdepartmentName').bind("change", function(event) {form.subdepartmentNameChangedHandle.call(form)});
    $('#' + this.htmlId + '_activity').bind("change", function(event) {form.activityChangedHandle.call(form)});
    $('#' + this.htmlId + '_activityName').bind("change", function(event) {form.activityNameChangedHandle.call(form)});
    $('#' + this.htmlId + '_year').bind("change", function(event) {form.yearChangedHandle.call(form)});
    $('#' + this.htmlId + '_financialYear').bind("change", function(event) {form.financialYearChangedHandle.call(form)});
    $('#' + this.htmlId + '_isClosed').bind("change", function(event) {form.isClosedChangedHandle.call(form)});
    $('#' + this.htmlId + '_isFuture').bind("change", function(event) {form.isFutureChangedHandle.call(form)});
    $('#' + this.htmlId + '_isDead').bind("change", function(event) {form.isDeadChangedHandle.call(form)});
    $('#' + this.htmlId + '_isHidden').bind("change", function(event) {form.isHiddenChangedHandle.call(form);});
    $('#' + this.htmlId + '_projectCodeConflictStatus').bind("change", function(event) {form.projectCodeConflictStatusChangedHandle.call(form);});
    $('#' + this.htmlId + '_periodType').bind("change", function(event) {form.periodTypeChangedHandle.call(form)});
    $('#' + this.htmlId + '_periodQuarter').bind("change", function(event) {form.periodQuarterChangedHandle.call(form)});
    $('#' + this.htmlId + '_periodMonth').bind("change", function(event) {form.periodMonthChangedHandle.call(form)});
    $('#' + this.htmlId + '_periodDate').bind("change", function(event) {form.periodDateChangedHandle.call(form)});
    $('#' + this.htmlId + '_periodCounter').bind("change", function(event) {form.periodCounterChangedHandle.call(form)});

    $('#' + this.htmlId + '_createdAt_from').bind("change", function(event) {form.createdAtFromChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_createdAt_to').bind("change", function(event) {form.createdAtToChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_closedAt_from').bind("change", function(event) {form.closedAtFromChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_closedAt_to').bind("change", function(event) {form.closedAtToChangedHandle.call(form, event)});

    $('#' + this.htmlId + '_startDate_from').bind("change", function(event) {form.startDateFromChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_startDate_to').bind("change", function(event) {form.startDateToChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_endDate_from').bind("change", function(event) {form.endDateFromChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_endDate_to').bind("change", function(event) {form.endDateToChangedHandle.call(form, event)});
    
}
ProjectCodesListFilter.prototype.makeButtons = function() {
    var form = this;
    $('#' + this.htmlId + '_reset')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: true
        })
      .click(function( event ) {
        form.reset.call(form, event);
    });    

    $('#' + this.htmlId + '_code_clear')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.codeClearHandle.call(form, event);
    });    
    
    $('#' + this.htmlId + '_inChargePerson_pick')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.inChargePersonPickHandle.call(form, event);
    });    
    $('#' + this.htmlId + '_inChargePerson_clear')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.inChargePersonClearHandle.call(form, event);
    });    
    $('#' + this.htmlId + '_inChargePartner_pick')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.inChargePartnerPickHandle.call(form, event);
    });    
    $('#' + this.htmlId + '_inChargePartner_clear')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.inChargePartnerClearHandle.call(form, event);
    });    
}
ProjectCodesListFilter.prototype.makeDatePickers = function() {
    var form = this;
    $('#' + this.htmlId + '_createdAt_from').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.createdAtFromSelectHandle(dateText, inst)}
    });
    $( '#' + this.htmlId + '_createdAt_to').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.createdAtToSelectHandle(dateText, inst)}
    });

    $('#' + this.htmlId + '_closedAt_from').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.closedAtFromSelectHandle(dateText, inst)}
    });
    $('#' + this.htmlId + '_closedAt_to').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.closedAtToSelectHandle(dateText, inst)}
    });

    $('#' + this.htmlId + '_startDate_from').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.startDateFromSelectHandle(dateText, inst)}
    });
    $('#' + this.htmlId + '_startDate_to').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.startDateToSelectHandle(dateText, inst)}
    });

    $('#' + this.htmlId + '_endDate_from').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.endDateFromSelectHandle(dateText, inst)}
    });
    $('#' + this.htmlId + '_endDate_to').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.endDateToSelectHandle(dateText, inst)}
    });

}
ProjectCodesListFilter.prototype.makeAutocompletes = function() {
    var form = this;
    $('#' + this.htmlId + '_subdepartmentName').autocomplete({
        source: function( request, response ) {
            $.ajax({
                url: form.config.endpointUrl,
                type: "POST",
                cache: false,
                data: {
                    'command': 'searchSubdepartments',
                    'moduleName': form.moduleName,
                    'subdepartmentName': request.term
                },
                success: function( data ) {
                    ajaxResultHandle(data, form, function(result) {
                        response(result.subdepartments);
                    })
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
                }
            });
        },
        minLength: 2,
        select: function( event, ui ) {
            form.filter.subdepartmentName = ui.item.value;
        }
    });
    
    $('#' + this.htmlId + '_activityName').autocomplete({
        source: function( request, response ) {
            $.ajax({
                url: form.config.endpointUrl,
                type: "POST",
                cache: false,
                data: {
                    'command': 'searchActivities',
                    'moduleName': form.moduleName,
                    'activityName': request.term
                },
                success: function( data ) {
                    ajaxResultHandle(data, form, function(result) {
                        response(result.activities);
                    })
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
                }
            });
        },
        minLength: 2,
        select: function( event, ui ) {
            form.filter.activityName = ui.item.value;
        }
    });    
}
ProjectCodesListFilter.prototype.reset = function(event) {
    this.filter = this.getDefaultFilter();
    this.loadInitialContent();
}
ProjectCodesListFilter.prototype.groupFilterChangedHandle = function(event) {
    var value = $('#' + this.htmlId + '_groupFilter').val();
    value = $.trim(value);
    if(value != this.internalFilter.group) {
        this.internalFilter.group = value;
        this.filter.groupId = null;
        this.updateGroupView();
        this.loadGroupContent();
    }
    this.updateGroupFilterView();
}
ProjectCodesListFilter.prototype.clientFilterChangedHandle = function(event) {
    var value = $('#' + this.htmlId + '_clientFilter').val();
    value = $.trim(value);
    if(value != this.internalFilter.client) {
        this.internalFilter.client = value;
        this.filter.clientId = null;
        this.updateClientView();
    }
    this.updateClientFilterView();
}

ProjectCodesListFilter.prototype.codeChangedHandle = function(event) {
    if(this.disabled.code) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        this.filter.code = jQuery.trim($('#' + this.htmlId + '_code').val());
        if(this.filter.year == "") {
            this.filter.year = null;
        }
    }
    this.updateCodeView();    
}
ProjectCodesListFilter.prototype.codeClearHandle = function() {
    if(this.disabled.code) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {    
        this.filter.code = '';
    }
    this.updateCodeView();
}

ProjectCodesListFilter.prototype.groupChangedHandle = function() {
    var htmlId = $('#' + this.htmlId + '_group').val();
    if(htmlId == '') {
        this.filter.groupId = null;
    } else {
        this.filter.groupId = parseInt(htmlId);
    }
    if(this.filter.groupId == null) {
        this.loadGroupContent();
    } else {
        this.loadGroupContent();
    }
}
ProjectCodesListFilter.prototype.clientChangedHandle = function() {
    var htmlId = $('#' + this.htmlId + '_client').val();
    if(htmlId == '') {
        this.filter.clientId = null;
    } else {
        this.filter.clientId = parseInt(htmlId);
    }
}
ProjectCodesListFilter.prototype.officeChangedHandle = function() {
    var htmlId = $('#' + this.htmlId + '_office').val();
    if(htmlId == '') {
        this.filter.officeId = null;
    } else {
        this.filter.officeId = parseInt(htmlId);
    }
    if(this.filter.officeId == null) {
        this.loaded.departments = [];
        this.loaded.subdepartments = [];
        this.loaded.activities = [];
        this.filter.departmentId = null;
        this.filter.subdepartmentId = null;
        this.filter.activityId = null;
        this.updateDepartmentView();
        this.updateSubdepartmentView();
        this.updateActivityView();
    } else {
        this.loadOfficeContent();
    }
}
ProjectCodesListFilter.prototype.departmentChangedHandle = function() {
    var htmlId = $('#' + this.htmlId + '_department').val();
    if(htmlId == '') {
        this.filter.departmentId = null;
    } else {
        this.filter.departmentId = parseInt(htmlId);
    }
    if(this.filter.departmentId == null) {
        this.loaded.subdepartments = [];
        this.loaded.activities = [];
        this.filter.subdepartmentId = null;
        this.filter.activityId = null;
        this.updateSubdepartmentView();
        this.updateActivityView();
    } else {
        this.loadDepartmentContent();
    }
}
ProjectCodesListFilter.prototype.subdepartmentChangedHandle = function() {
    var htmlId = $('#' + this.htmlId + '_subdepartment').val();
    if(htmlId == '') {
        this.filter.subdepartmentId = null;
    } else {
        this.filter.subdepartmentId = parseInt(htmlId);
    }
    if(this.filter.subdepartmentId == null) {
        this.loaded.activities = [];
        this.filter.activityId = null;
        this.updateActivityView();
    } else {
        this.loadSubdepartmentContent();
    }
}
ProjectCodesListFilter.prototype.subdepartmentNameChangedHandle = function(event) {
    if(this.disabled.subdepartmentName) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        this.filter.subdepartmentName = jQuery.trim($('#' + this.htmlId + '_subdepartmentName').val());
        if(this.filter.subdepartmentName == "") {
            this.filter.subdepartmentName = null;
        }
    }
    this.updateSubdepartmentNameView();    
}
ProjectCodesListFilter.prototype.activityChangedHandle = function() {
    var htmlId = $('#' + this.htmlId + '_activity').val();
    if(htmlId == null || htmlId == '') {
        this.filter.activityId = null;
    } else {
        this.filter.activityId = parseInt(htmlId);
    }
}
ProjectCodesListFilter.prototype.activityNameChangedHandle = function(event) {
    if(this.disabled.activityName) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        this.filter.activityName = jQuery.trim($('#' + this.htmlId + '_activityName').val());
        if(this.filter.activityName == "") {
            this.filter.activityName = null;
        }
    }
    this.updateActivityNameView();    
}
ProjectCodesListFilter.prototype.yearChangedHandle = function(event) {
    if(this.disabled.year) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        this.filter.year = jQuery.trim($('#' + this.htmlId + '_year').val());
        if(this.filter.year == "") {
            this.filter.year = null;
        }
    }
    this.updateYearView();    
}
ProjectCodesListFilter.prototype.financialYearChangedHandle = function(event) {
    if(this.disabled.financialYear) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        this.filter.financialYear = $('#' + this.htmlId + '_financialYear').val();
        if(this.filter.financialYear == "") {
            this.filter.financialYear = null;
        }
    }
    this.updateFinancialYearView();
}
ProjectCodesListFilter.prototype.createdAtFromSelectHandle = function(dateText, inst) {
    if(this.disabled.createdAtRange) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        if(dateText != null && jQuery.trim(dateText) != "") {
            this.filter.createdAtRange.from = getYearMonthDateFromDateString(jQuery.trim(dateText));
        } else {
            this.filter.createdAtRange.from = null;
        }
    }    
    this.updateCreatedAtView();
}
ProjectCodesListFilter.prototype.createdAtFromChangedHandle = function(event) {
    if(this.disabled.createdAtRange) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        var dateText = $(event.currentTarget).val();
        if(dateText.trim() != "") {
            this.filter.createdAtRange.from = getYearMonthDateFromDateString(dateText);
        } else {
            this.filter.createdAtRange.from = null;
        }
    }
    this.updateCreatedAtView();
}
ProjectCodesListFilter.prototype.createdAtToSelectHandle = function(dateText, inst) {
    if(this.disabled.createdAtRange) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        if(dateText != null && jQuery.trim(dateText) != "") {
            this.filter.createdAtRange.to = getYearMonthDateFromDateString(jQuery.trim(dateText));
        } else {
            this.filter.createdAtRange.to = null;
        }
    }    
    this.updateCreatedAtView();
}
ProjectCodesListFilter.prototype.createdAtToChangedHandle = function(event) {
    if(this.disabled.createdAtRange) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        var dateText = $(event.currentTarget).val();
        if(dateText.trim() != "") {
            this.filter.createdAtRange.to = getYearMonthDateFromDateString(dateText);
        } else {
            this.filter.createdAtRange.to = null;
        }
    }    
    this.updateCreatedAtView();
}
ProjectCodesListFilter.prototype.closedAtFromSelectHandle = function(dateText, inst) { 
    if(this.disabled.closedAtRange) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        if(dateText != null && jQuery.trim(dateText) != "") {
            this.filter.closedAtRange.from = getYearMonthDateFromDateString(jQuery.trim(dateText));
        } else {
            this.filter.closedAtRange.from = null;
        }
    }    
    this.updateClosedAtView();
}
ProjectCodesListFilter.prototype.closedAtFromChangedHandle = function(event) {
    if(this.disabled.closedAtRange) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        var dateText = $(event.currentTarget).val();
        if(dateText.trim() != "") {
            this.filter.closedAtRange.from = getYearMonthDateFromDateString(dateText);
        } else {
            this.filter.closedAtRange.from = null;
        }
    }    
    this.updateClosedAtView();
}
ProjectCodesListFilter.prototype.closedAtToSelectHandle = function(dateText, inst) {
    if(this.disabled.closedAtRange) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        if(dateText != null && jQuery.trim(dateText) != "") {
            this.filter.closedAtRange.to = getYearMonthDateFromDateString(jQuery.trim(dateText));
        } else {
            this.filter.closedAtRange.to = null;
        }
    }    
    this.updateClosedAtView();
}
ProjectCodesListFilter.prototype.closedAtToChangedHandle = function(event) {
    if(this.disabled.closedAtRange) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        var dateText = $(event.currentTarget).val();
        if(dateText.trim() != "") {
            this.filter.closedAtRange.to = getYearMonthDateFromDateString(dateText);
        } else {
            this.filter.closedAtRange.to = null;
        }
    }    
    this.updateClosedAtView();
}
ProjectCodesListFilter.prototype.startDateFromSelectHandle = function(dateText, inst) {
    if(this.disabled.startDateRange) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        if(dateText.trim() != "") {
            this.filter.startDateRange.from = getYearMonthDateFromDateString(dateText);
        } else {
            this.filter.startDateRange.from = null;
        }
    }
    this.updateStartDateView();
}
ProjectCodesListFilter.prototype.startDateFromChangedHandle = function(event) {
    if(this.disabled.startDateRange) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        var dateText = $(event.currentTarget).val();
        if(dateText.trim() != "") {
            this.filter.startDateRange.from = getYearMonthDateFromDateString(dateText);
        } else {
            this.filter.startDateRange.from = null;
        }
    }    
    this.updateStartDateView();
}
ProjectCodesListFilter.prototype.startDateToSelectHandle = function(dateText, inst) {
    if(this.disabled.startDateRange) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        if(dateText.trim() != "") {
            this.filter.startDateRange.to = getYearMonthDateFromDateString(dateText);
        } else {
            this.filter.startDateRange.to = null;
        }
    }    
    this.updateStartDateView();
}
ProjectCodesListFilter.prototype.startDateToChangedHandle = function(event) {
    if(this.disabled.startDateRange) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        var dateText = $(event.currentTarget).val();
        if(dateText.trim() != "") {
            this.filter.startDateRange.to = getYearMonthDateFromDateString(dateText);
        } else {
            this.filter.startDateRange.to = null;
        }
    }    
    this.updateStartDateView();
}
ProjectCodesListFilter.prototype.endDateFromSelectHandle = function(dateText, inst) {
    if(this.disabled.endDateRange) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        if(dateText.trim() != "") {
            this.filter.endDateRange.from = getYearMonthDateFromDateString(dateText);
        } else {
            this.filter.endDateRange.from = null;
        }
    }    
    this.updateEndDateView();
}
ProjectCodesListFilter.prototype.endDateFromChangedHandle = function(event) {
    if(this.disabled.endDateRange) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        var dateText = $(event.currentTarget).val();
        if(dateText.trim() != "") {
            this.filter.endDateRange.from = getYearMonthDateFromDateString(dateText);
        } else {
            this.filter.endDateRange.from = null;
        }
    }
    this.updateEndDateView();
}
ProjectCodesListFilter.prototype.endDateToSelectHandle = function(dateText, inst) {
    if(this.disabled.endDateRange) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        if(dateText.trim() != "") {
            this.filter.endDateRange.to = getYearMonthDateFromDateString(dateText);
        } else {
            this.filter.endDateRange.to = null;
        }
    }    
    this.updateEndDateView();
}
ProjectCodesListFilter.prototype.endDateToChangedHandle = function(event) {
    if(this.disabled.endDateRange) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        var dateText = $(event.currentTarget).val();
        if(dateText.trim() != "") {
            this.filter.endDateRange.to = getYearMonthDateFromDateString(dateText);
        } else {
            this.filter.endDateRange.to = null;
        }
    }    
    this.updateEndDateView();
}
ProjectCodesListFilter.prototype.isClosedChangedHandle = function(event) {
    if(this.disabled.isClosed) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        this.filter.isClosed = $('#' + this.htmlId + '_isClosed').val();
    }
    this.updateIsClosedView();
}
ProjectCodesListFilter.prototype.inChargePersonPickHandle = function() {
    this.employeePicker = new EmployeePicker("employeePicker", this.inChargePersonPicked, this, this.moduleName);
    this.employeePicker.init();
}
ProjectCodesListFilter.prototype.inChargePersonPicked = function(inChargePerson) {
    if(this.disabled.inChargePerson) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        this.filter.inChargePersonId = inChargePerson.id;
        this.loaded.inChargePerson = inChargePerson;
    }
    this.updateInChargePersonView();
}
ProjectCodesListFilter.prototype.inChargePersonClearHandle = function() {
    if(this.disabled.inChargePerson) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        this.filter.inChargePersonId = null;
        this.loaded.inChargePerson = null;
    }
    this.updateInChargePersonView();
}
ProjectCodesListFilter.prototype.inChargePartnerPickHandle = function() {
    this.employeePicker = new EmployeePicker("employeePicker", this.inChargePartnerPicked, this, this.moduleName);
    this.employeePicker.init();
}
ProjectCodesListFilter.prototype.inChargePartnerPicked = function(inChargePartner) {
    if(this.disabled.inChargePartner) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        this.filter.inChargePartnerId = inChargePartner.id;
        this.loaded.inChargePartner = inChargePartner;
    }
    this.updateInChargePartnerView();
}
ProjectCodesListFilter.prototype.inChargePartnerClearHandle = function() {
    if(this.disabled.inChargePartner) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        this.filter.inChargePartnerId = null;
        this.loaded.inChargePartner = null;
    }
    this.updateInChargePartnerView();
}

ProjectCodesListFilter.prototype.isFutureChangedHandle = function(event) {
    if(this.disabled.isFuture) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        this.filter.isFuture = $('#' + this.htmlId + '_isFuture').val();
    }
    this.updateIsFutureView();
}
ProjectCodesListFilter.prototype.isDeadChangedHandle = function(event) {
    if(this.disabled.isDead) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        this.filter.isDead = $('#' + this.htmlId + '_isDead').val();
    }
    this.updateIsDeadView();
}
ProjectCodesListFilter.prototype.isHiddenChangedHandle = function(event) {
    if(this.disabled.isHidden) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        this.filter.isHidden = $('#' + this.htmlId + '_isHidden').val();
    }
    this.updateIsHiddenView();
}
ProjectCodesListFilter.prototype.projectCodeConflictStatusChangedHandle = function(event) {
    if(this.disabled.projectCodeConflictStatus) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        var value = $('#' + this.htmlId + '_projectCodeConflictStatus').val();
        if(value == '') {
            this.filter.projectCodeConflictStatus = null;
        } else {
            this.filter.projectCodeConflictStatus = value;
        } 
    }
    this.updateProjectCodeConflictStatusView();
}
ProjectCodesListFilter.prototype.periodTypeChangedHandle = function(event) {
    if(this.disabled.periodType) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        this.filter.periodType = $('#' + this.htmlId + '_periodType').val();
    }
    this.updatePeriodTypeView();
}
ProjectCodesListFilter.prototype.periodQuarterChangedHandle = function(event) {
    if(this.disabled.periodQuarter) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        this.filter.periodQuarter = $('#' + this.htmlId + '_periodQuarter').val();
    }
    this.updatePeriodQuarterView();
}
ProjectCodesListFilter.prototype.periodMonthChangedHandle = function(event) {
    if(this.disabled.periodMonth) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        this.filter.periodMonth = $('#' + this.htmlId + '_periodMonth').val();
    }
    this.updatePeriodMonthView();
}
ProjectCodesListFilter.prototype.periodDateChangedHandle = function(event) {
    if(this.disabled.periodDate) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        this.filter.periodDate = $('#' + this.htmlId + '_periodDate').val();
    }
    this.updatePeriodDateView();
}
ProjectCodesListFilter.prototype.periodCounterChangedHandle = function(event) {
    if(this.disabled.periodCounter) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        this.filter.periodCounter = jQuery.trim($('#' + this.htmlId + '_periodCounter').val());
        if(this.filter.periodCounter == "") {
            this.filter.periodCounter = null;
        }
    }
    this.updatePeriodCounterView();
}

ProjectCodesListFilter.prototype.updateView = function() {
    this.updateGroupFilterView();
    this.updateClientFilterView();
    
    this.updateCodeView();
    this.updateGroupView();
    this.updateClientView();
    this.updateOfficeView();
    this.updateDepartmentView();
    this.updateSubdepartmentView();
    this.updateSubdepartmentNameView();
    this.updateActivityView();
    this.updateActivityNameView();
    this.updateYearView();
    this.updateFinancialYearView();
    this.updateIsClosedView();
    this.updateIsFutureView();
    this.updateIsDeadView();
    this.updateIsHiddenView();
    this.updateProjectCodeConflictStatusView();
    this.updateInChargePersonView();
    this.updateInChargePartnerView();
    this.updatePeriodTypeView();
    this.updatePeriodQuarterView();
    this.updatePeriodMonthView();
    this.updatePeriodDateView();
    this.updatePeriodCounterView();

    this.updateCreatedAtView();
    this.updateClosedAtView();
    this.updateStartDateView();
    this.updateEndDateView();
    this.updateFinancialYearView();
}

ProjectCodesListFilter.prototype.updateCodeView = function() {
    $('#' + this.htmlId + '_code').attr("disabled", this.disabled.code);
    $('#' + this.htmlId + '_code').val(this.filter.code);
}
ProjectCodesListFilter.prototype.updateGroupFilterView = function() {
    $('#' + this.htmlId + '_groupFilter').attr("disabled", this.disabled.group);
    $('#' + this.htmlId + '_groupFilter').val(this.internalFilter.group);
}
ProjectCodesListFilter.prototype.updateGroupView = function() {
    $('#' + this.htmlId + '_group').attr("disabled", this.disabled.group);

    var html = '';
    var filter = null;
    if(this.internalFilter.group != null && this.internalFilter.group != '') {
        filter = this.internalFilter.group.toLowerCase();
    }    
    html += '<option value="" >...</option>';
    for(var key in this.loaded.groups) {
        var group = this.loaded.groups[key];
        var found = true;
        if(filter != null) {
            found = false;
            if(group.name.toLowerCase().indexOf(filter) != -1 ) {
                found = true;
            }
        }
        if(! found) {
            continue;
        }        
        var isSelected = "";
        if(group.id == this.filter.groupId) {
           isSelected = "selected";
        }
        html += '<option value="' + group.id + '" ' + isSelected + '>' + group.name + '</option>';
    }
    $('#' + this.htmlId + '_group').html(html);
}
ProjectCodesListFilter.prototype.updateClientFilterView = function() {
    $('#' + this.htmlId + '_clientFilter').attr("disabled", this.disabled.client);
    $('#' + this.htmlId + '_clientFilter').val(this.internalFilter.client);
}
ProjectCodesListFilter.prototype.updateClientView = function() {
    $('#' + this.htmlId + '_client').attr("disabled", this.disabled.client);
    
    var html = '';
    var filter = null;
    if(this.internalFilter.client != null && this.internalFilter.client != '') {
        filter = this.internalFilter.client.toLowerCase();
    }    
    html += '<option value="" >...</option>';
    for(var key in this.loaded.clients) {
        var client = this.loaded.clients[key];
        var found = true;
        if(filter != null) {
            found = false;
            if(client.name.toLowerCase().indexOf(filter) != -1 ) {
                found = true;
            }
        }
        if(! found) {
            continue;
        }        
        var isSelected = "";
        if(client.id == this.filter.clientId) {
           isSelected = "selected";
        }
        html += '<option value="' + client.id + '" ' + isSelected + '>' + client.name + '</option>';
    }
    $('#' + this.htmlId + '_client').html(html);
}

ProjectCodesListFilter.prototype.updateOfficeView = function() {
    $('#' + this.htmlId + '_office').attr("disabled", this.disabled.office);
    
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.offices) {
        var office = this.loaded.offices[key];
        var isSelected = "";
        if(office.id == this.filter.officeId) {
           isSelected = "selected";
        }
        html += '<option value="' + office.id + '" ' + isSelected + '>' + office.name + '</option>';
    }
    $('#' + this.htmlId + '_office').html(html);
}
ProjectCodesListFilter.prototype.updateDepartmentView = function() {
    $('#' + this.htmlId + '_department').attr("disabled", this.disabled.department);

    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.departments) {
        var department = this.loaded.departments[key];
        var isSelected = "";
        if(department.id == this.filter.departmentId) {
           isSelected = "selected";
        }
        html += '<option value="' + department.id + '" ' + isSelected + '>' + department.name + '</option>';
    }
    $('#' + this.htmlId + '_department').html(html);
}
ProjectCodesListFilter.prototype.updateSubdepartmentView = function() {
    $('#' + this.htmlId + '_subdepartment').attr("disabled", this.disabled.subdepartment);
    
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.subdepartments) {
        var subdepartment = this.loaded.subdepartments[key];
        var isSelected = "";
        if(subdepartment.id == this.filter.subdepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="' + subdepartment.id + '" ' + isSelected + '>' + subdepartment.name + '</option>';
    }
    $('#' + this.htmlId + '_subdepartment').html(html);
}
ProjectCodesListFilter.prototype.updateSubdepartmentNameView = function() {
    $('#' + this.htmlId + '_subdepartmentName').attr("disabled", this.disabled.subdepartmentName);
    $('#' + this.htmlId + '_subdepartmentName').val(this.filter.subdepartmentName);
}
ProjectCodesListFilter.prototype.updateActivityView = function() {
    $('#' + this.htmlId + '_activity').attr("disabled", this.disabled.activity);
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.activities) {
        var activity = this.loaded.activities[key];
        var isSelected = "";
        if(activity.id == this.filter.activityId) {
           isSelected = "selected";
        }
        html += '<option value="' + activity.id + '" ' + isSelected + '>' + activity.name + '</option>';
    }
    $('#' + this.htmlId + '_activity').html(html);
}
ProjectCodesListFilter.prototype.updateActivityNameView = function() {
    $('#' + this.htmlId + '_activityName').attr("disabled", this.disabled.activityName);
    $('#' + this.htmlId + '_activityName').val(this.filter.activityName);
}
ProjectCodesListFilter.prototype.updateYearView = function() {
    $('#' + this.htmlId + '_year').attr("disabled", this.disabled.year);

    $('#' + this.htmlId + '_year').val(this.filter.year);
}
ProjectCodesListFilter.prototype.updateFinancialYearView = function() {
    $('#' + this.htmlId + '_financialYear').attr("disabled", this.disabled.financialYear);

    var html = "";
    html += '<option value="">...</option>';
    for(var key in this.financialYears) {
        var financialYear = this.financialYears[key];
        var isSelected = "";
        if(key == this.filter.financialYear) {
            isSelected = "selected";
        }
        html += '<option value="'+ key +'" ' + isSelected + '>' + financialYear + '</option>';
    }
    $('#' + this.htmlId + '_financialYear').html(html);
}
ProjectCodesListFilter.prototype.updateCreatedAtView = function() {
    $('#' + this.htmlId + '_createdAt_from').attr("disabled", this.disabled.createdAtRange);
    $('#' + this.htmlId + '_createdAt_to').attr("disabled", this.disabled.createdAtRange);
    $('#' + this.htmlId + '_createdAt_from').val(getStringFromYearMonthDate(this.filter.createdAtRange.from));
    $('#' + this.htmlId + '_createdAt_to').val(getStringFromYearMonthDate(this.filter.createdAtRange.to));
}
ProjectCodesListFilter.prototype.updateClosedAtView = function() {
    $('#' + this.htmlId + '_closedAt_from').attr("disabled", this.disabled.closedAtRange);
    $('#' + this.htmlId + '_closedAt_to').attr("disabled", this.disabled.closedAtRange);
    $('#' + this.htmlId + '_closedAt_from').val(getStringFromYearMonthDate(this.filter.closedAtRange.from));
    $('#' + this.htmlId + '_closedAt_to').val(getStringFromYearMonthDate(this.filter.closedAtRange.to));
}
ProjectCodesListFilter.prototype.updateStartDateView = function() {
    $('#' + this.htmlId + '_startDate_from').attr("disabled", this.disabled.startDateRange);
    $('#' + this.htmlId + '_startDate_to').attr("disabled", this.disabled.startDateRange);
    $('#' + this.htmlId + '_startDate_from').val(getStringFromYearMonthDate(this.filter.startDateRange.from));
    $('#' + this.htmlId + '_startDate_to').val(getStringFromYearMonthDate(this.filter.startDateRange.to));
}
ProjectCodesListFilter.prototype.updateEndDateView = function() {
    $('#' + this.htmlId + '_endDate_from').attr("disabled", this.disabled.endDateRange);
    $('#' + this.htmlId + '_endDate_to').attr("disabled", this.disabled.endDateRange);
    $('#' + this.htmlId + '_endDate_from').val(getStringFromYearMonthDate(this.filter.endDateRange.from));
    $('#' + this.htmlId + '_endDate_to').val(getStringFromYearMonthDate(this.filter.endDateRange.to));
}
ProjectCodesListFilter.prototype.updateIsClosedView = function() {
    $('#' + this.htmlId + '_isClosed').attr("disabled", this.disabled.isClosed);
    var options = {"ALL": "All", "TRUE": "Yes", "FALSE": "No"}
    this.updateSelectorView(this.htmlId + '_isClosed', this.filter.isClosed, options);
}
ProjectCodesListFilter.prototype.updateIsFutureView = function() {
    $('#' + this.htmlId + '_isFuture').attr("disabled", this.disabled.isFuture);
    var options = {"ALL": "All", "TRUE": "Yes", "FALSE": "No"}
    this.updateSelectorView(this.htmlId + '_isFuture', this.filter.isFuture, options);
}
ProjectCodesListFilter.prototype.updateIsDeadView = function() {
    $('#' + this.htmlId + '_isDead').attr("disabled", this.disabled.isDead);
    var options = {"ALL": "All", "TRUE": "Yes", "FALSE": "No"}
    this.updateSelectorView(this.htmlId + '_isDead', this.filter.isDead, options);
}
ProjectCodesListFilter.prototype.updateIsHiddenView = function() {
    $('#' + this.htmlId + '_isHidden').attr("disabled", this.disabled.isHidden);
    var options = {"ALL": "All", "TRUE": "Yes", "FALSE": "No"}
    this.updateSelectorView(this.htmlId + '_isHidden', this.filter.isHidden, options);
}
ProjectCodesListFilter.prototype.updateProjectCodeConflictStatusView = function() {
    $('#' + this.htmlId + '_projectCodeConflictStatus').attr("disabled", this.disabled.projectCodeConflictStatus);
    var options = {"": "All", "NOT_DETECTED": "Not detected", "DETECTED": "Detected", "IRRESOLVABLE": "Irresolvable", "RESOLVED": "Resolved"}
    this.updateSelectorView(this.htmlId + '_projectCodeConflictStatus', this.filter.projectCodeConflictStatus, options);
}
ProjectCodesListFilter.prototype.updateInChargePersonView = function() {
    $('#' + this.htmlId + '_inChargePerson_userName').attr("disabled", true);
    if(this.filter.inChargePersonId != null) {
        $('#' + this.htmlId + '_inChargePerson_userName').val(this.loaded.inChargePerson.userName);
    } else {
        $('#' + this.htmlId + '_inChargePerson_userName').val("");
    }
}
ProjectCodesListFilter.prototype.updateInChargePartnerView = function() {
    $('#' + this.htmlId + '_inChargePartner_userName').attr("disabled", true);
    if(this.filter.inChargePartnerId != null) {
        $('#' + this.htmlId + '_inChargePartner_userName').val(this.loaded.inChargePartner.userName);
    } else {
        $('#' + this.htmlId + '_inChargePartner_userName').val("");
    }
}
ProjectCodesListFilter.prototype.updatePeriodTypeView = function() {
    $('#' + this.htmlId + '_periodType').attr("disabled", this.disabled.periodType);
    var options = {"ALL": "All", "QUARTER": "Quarter", "MONTH": "Month", "DATE": "Date", "COUNTER": "Counter"}
    this.updateSelectorView(this.htmlId + '_periodType', this.filter.periodType, options);
}
ProjectCodesListFilter.prototype.updatePeriodQuarterView = function() {
    $('#' + this.htmlId + '_periodQuarter').attr("disabled", this.disabled.periodQuarter);
    var options = {"ALL": "All", "FIRST": "First", "SECOND": "Second", "THIRD": "Third", "FOURTH": "Fourth"}
    this.updateSelectorView(this.htmlId + '_periodQuarter', this.filter.periodQuarter, options);
}
ProjectCodesListFilter.prototype.updatePeriodMonthView = function() {
    $('#' + this.htmlId + '_periodMonth').attr("disabled", this.disabled.periodMonth);
    var options = {"ALL": "All", "JANUARY": "January", "FEBRUARY": "February", "MARCH": "March", "APRIL": "April", "MAY": "May", "JUNE": "June", "JULY": "July", "AUGUST": "August", "SEPTEMBER": "September", "OCTOBER": "October", "NOVEMBER": "November", "DECEMBER": "December"}
    this.updateSelectorView(this.htmlId + '_periodMonth', this.filter.periodMonth, options);
}
ProjectCodesListFilter.prototype.updatePeriodDateView = function() {
    $('#' + this.htmlId + '_periodDate').attr("disabled", this.disabled.periodDate);
    var options = {"ALL": "All", "D3101": "3101", "D2802": "2802", "D3103": "3103", "D3004": "3004", "D3105": "3105", "D3006": "3006", "D3107": "3107", "D3108": "3108", "D3009": "3009", "D3110": "3110", "D3011": "3011", "D3112": "3112"}
    this.updateSelectorView(this.htmlId + '_periodDate', this.filter.periodDate, options);
}
ProjectCodesListFilter.prototype.updatePeriodCounterView = function() {
    $('#' + this.htmlId + '_periodCounter').attr("disabled", this.disabled.periodCounter);
    $('#' + this.htmlId + '_periodCounter').val(this.filter.periodCounter);
}
ProjectCodesListFilter.prototype.updateSelectorView = function(id, value, options) {
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
ProjectCodesListFilter.prototype.okHandle = function() {
    this.callback.call(this.callbackContext, this.filter);
}

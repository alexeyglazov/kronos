/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ProjectCodeForm(htmlId, containerHtmlId) {
    this.createdProjectCodeId = null; // for callbacks
    this.config = {
        endpointUrl: endpointsFolder + "ProjectCodeForm.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.moduleName = "Code";
    this.periodTypes = {
        'QUARTER': 'Quarter',
        'MONTH': 'Month',
        'DATE': 'Date',
        'COUNTER': 'Counter'
    }
    this.periodQuarters = {
        "FIRST" : "First",
        "SECOND" : "Second",
        "THIRD" : "Third",
        "FOURTH" : "Fourth"
    };
    this.periodQuartersForCode = {
        "FIRST" : "1",
        "SECOND" : "2",
        "THIRD" : "3",
        "FOURTH" : "4"
    };
    this.periodMonths = {
        "JANUARY" : "January",
        "FEBRUARY" : "February",
        "MARCH" : "March",
        "APRIL" : "April",
        "MAY" : "May",
        "JUNE" : "June",
        "JULY" : "July",
        "AUGUST" : "August",
        "SEPTEMBER" : "September",
        "OCTOBER" : "October",
        "NOVEMBER" : "November",
        "DECEMBER" : "December"
    };
    this.periodMonthsForCode = {
        "JANUARY" : "1",
        "FEBRUARY" : "2",
        "MARCH" : "3",
        "APRIL" : "4",
        "MAY" : "5",
        "JUNE" : "6",
        "JULY" : "7",
        "AUGUST" : "8",
        "SEPTEMBER" : "9",
        "OCTOBER" : "10",
        "NOVEMBER" : "11",
        "DECEMBER" : "12"
    };
    this.periodDates = {
        "D3101" : "3101",
        "D2802" : "2802",
        "D3103" : "3103",
        "D3004" : "3004",
        "D3105" : "3105",
        "D3006" : "3006",
        "D3107" : "3107",
        "D3108" : "3108",
        "D3009" : "3009",
        "D3110" : "3110",
        "D3011" : "3011",
        "D3112" : "3112"
    };
    this.years = [];
    this.financialYears = {};
    var currentYear = (new Date()).getFullYear();
    var currentYearChange = new Date(currentYear, 04, 01); // May 01
    var currentYearStart = currentYear - 3;
    if((new Date()) > currentYearChange ) {
        currentYearStart = currentYear - 2;
    }    
    for(var i = currentYearStart; i <= currentYear + 1; i++) {
        this.years.push(i);
    }
    var currentFinancialYearChange = new Date(currentYear, 08, 01); // September 01
    var currentFinancialYear = currentYear - 1;
    if((new Date()) > currentFinancialYearChange ) {
        currentFinancialYear = currentYear;
    }
    var currentFinancialYearEnd = currentFinancialYear; // don't look too far in the future
    if(currentFinancialYear < currentYear) {
        currentFinancialYearEnd = currentFinancialYear + 1;
    }
    for(var i = currentFinancialYear; i <= currentFinancialYearEnd; i++) {
        this.financialYears[i] = '' + i + '-' + (i + 1);
    }
    this.loaded = {
        "currencies": [],
        "offices": [],
        "departments": [],
        "subdepartments": [],
        "projectCodeComments": [],
        "activities": [],
        "groups": [],
        "clients": []
    }
    this.data = {
        officeId : null,
        departmentId : null,
        subdepartmentId : null,
        groupId : null,
        clientFilter: null,
        clientId : null,
        year : null,
        financialYear : null,
        activityId : null,
        periodType : null,
        periodQuarter : "FIRST",
        periodMonth : "JANUARY",
        periodDate : "D3101",
        periodCounter : null,
        description : "",
        comment : "",
        isFuture: false,
        isDead: false,
        isClosed: false,
        inChargePerson: null,
        feesAdvanceAmount: null,
        feesAdvanceCurrencyId: null,
        feesPaymentCurrencyId: null,
        feesAdvanceDate: null
    };
    this.selected = {
        projectCodeCommentId: null
    }
    this.generatedCode = "";
}
ProjectCodeForm.prototype.init = function() {
    this.loadInitialContent();
    this.dataChanged(false);
}
ProjectCodeForm.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeDatePickers();
    this.makeButtons();
    this.setHandlers();
    this.updateView();
}
ProjectCodeForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Office</span></td>';
    html += '<td><span class="label1">Department</span></td>';
    html += '<td><span class="label1">Subdepartment</span></td>';
    html += '<td><span class="label1">Activity</span></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><select id="' + this.htmlId + '_office"></select></td>';
    html += '<td><select id="' + this.htmlId + '_department"></select></td>';
    html += '<td><select id="' + this.htmlId + '_subdepartment"></select></td>';
    html += '<td><select id="' + this.htmlId + '_activity"></select></td>';
    html += '</tr>';
    html += '</table>';
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Group</span> <span class="comment2">(optional)</span></td>';
    html += '<td><span class="label1">Client</span> <input type="text" id="' + this.htmlId + '_clientFilter"></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><select id="' + this.htmlId + '_group"></select></td>';
    html += '<td><select id="' + this.htmlId + '_client"></select></td>';
    html += '</tr>';
    html += '</table>';
    
    
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Year</span></td>';
    html += '<td><span class="label1">Financial Year</span></td>';
    html += '<td style="padding-left: 30px;"><span class="label1">Person in charge</span></td>';
    html += '<td style="padding-left: 30px;"><span class="label1">Partner in charge</span></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><select id="' + this.htmlId + '_year"></select></td>';
    html += '<td><select id="' + this.htmlId + '_financialYear"></select></td>';
    html += '<td style="padding-left: 30px;">';
        html += '<input type="text" id="' + this.htmlId + '_inChargePerson_userName">';
        html += '<button id="' + this.htmlId + '_inChargePerson_pick">Pick</button><button id="' + this.htmlId + '_inChargePerson_clear" title="Clear">Delete</button>';
    html += '</td>';
    html += '<td style="padding-left: 30px;">';
        html += '<input type="text" id="' + this.htmlId + '_inChargePartner_userName">';
        html += '<button id="' + this.htmlId + '_inChargePartner_pick">Pick</button><button id="' + this.htmlId + '_inChargePartner_clear" title="Clear">Delete</button>';
    html += '</td>';
    html += '</tr>';
    html += '</table>';
    
    html += '<table>';
    html += '<tr><td><span class="label1">Type</span></td><td><span class="label1"></span></td></tr>';
    html += '<tr><td><select style="min-width: 100px;" id="' + this.htmlId + '_periodType"></select></td>';
    html += '<td>';
    html += '<select style="min-width: 100px; display: none;" id="' + this.htmlId + '_periodQuarter"></select>';
    html += '<select style="min-width: 100px; display: none;" id="' + this.htmlId + '_periodMonth"></select>';
    html += '<select style="min-width: 100px; display: none;" id="' + this.htmlId + '_periodDate"></select>';
    html += '<span style="min-width: 100px; display: none;" id="' + this.htmlId + '_periodCounter">Auto</span>';
    html += '</td>';
    html += '</tr>';
    html += '</table>';
    
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Comment</span><span class="link" id="' + this.htmlId + '_pickComment">Pick</span></td>';
    html += '<td></td>';
    html += '<td><span class="label1">Description (for invoicing)</span></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><textarea style="width: 300px; height: 150px;" id="' + this.htmlId + '_comment"></textarea></td>';
    html += '<td><button id="' + this.htmlId + '_commentToDescription">Copy comment to description</button><br /><button id="' + this.htmlId + '_descriptionToComment">Copy description to comment</button></td>';
    html += '<td><textarea style="width: 300px; height: 150px;" id="' + this.htmlId + '_description"></textarea></td>';
    html += '</tr>';
    html += '</table>';
    
        html += '<table>';
        html += '<tr>';
        html += '<td><span class="label1">Future project</span></td>';
        html += '<td><span class="label1">Invoice to issue amount</span></td>';
        html += '<td><span class="label1">Currency</span></td>';
        html += '<td><span class="label1">Payment currency</span></td>';
        html += '<td><span class="label1">Date</span></td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td><input type="checkbox" id="' + this.htmlId + '_isFuture"></td>';
        html += '<td><input type="text" id="' + this.htmlId + '_feesAdvanceAmount"></td>';
        html += '<td><select id="' + this.htmlId + '_feesAdvanceCurrency"></select></td>';
        html += '<td><select id="' + this.htmlId + '_feesPaymentCurrency"></select></td>';
        html += '<td><input type="text" id="' + this.htmlId + '_feesAdvanceDate"></td>';
        html += '</tr>';
        html += '</table>';

    html += '<table><tr>';
    html += '<td><input type="button" value="Generate" id="' + this.htmlId + '_previewBtn"></td>';
    html += '<td><input type="text" style="width: 500px;" value="" disabled id="' + this.htmlId + '_code"></td>';
    html += '<td><input type="button" value="Save" id="' + this.htmlId + '_saveBtn"></td>';
    html += '</tr></table>';
    return html;
}
ProjectCodeForm.prototype.reset = function() {
    this.data = {
        officeId : null,
        departmentId : null,
        subdepartmentId : null,
        groupId : null,
        clientFilter: null,
        clientId : null,
        year : null,
        financialYear : null,
        activityId : null,
        periodType : null,
        periodQuarter : "FIRST",
        periodMonth : "JANUARY",
        periodDate : "D3101",
        periodCounter : null,
        description : "",
        comment : "",
        isFuture: false,
        isDead: false,
        isClosed: false,
        inChargePerson: null,
        feesAdvanceAmount: null,
        feesAdvanceCurrencyId: null,
        feesPaymentCurrencyId: null,
        feesAdvanceDate: null
    };
    this.generatedCode = "";
    this.init();
}
ProjectCodeForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_office').bind("change", function(event) {form.officeChangedHandle.call(form)});
    $('#' + this.htmlId + '_department').bind("change", function(event) {form.departmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_subdepartment').bind("change", function(event) {form.subdepartmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_group').bind("change", function(event) {form.groupChangedHandle.call(form)});
    $('#' + this.htmlId + '_clientFilter').bind("change", function(event) {form.clientFilterChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_client').bind("change", function(event) {form.clientChangedHandle.call(form)});
    $('#' + this.htmlId + '_year').bind("change", function(event) {form.yearChangedHandle.call(form)});
    $('#' + this.htmlId + '_financialYear').bind("change", function(event) {form.financialYearChangedHandle.call(form)});
    $('#' + this.htmlId + '_activity').bind("change", function(event) {form.activityChangedHandle.call(form)});
    $('#' + this.htmlId + '_periodType').bind("change", function(event) {form.periodTypeChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_periodQuarter').bind("change", function(event) {form.periodQuarterChangedHandle.call(form)});
    $('#' + this.htmlId + '_periodMonth').bind("change", function(event) {form.periodMonthChangedHandle.call(form)});
    $('#' + this.htmlId + '_periodDate').bind("change", function(event) {form.periodDateChangedHandle.call(form)});
    $('#' + this.htmlId + '_description').bind("change", function(event) {form.descriptionChangedHandle.call(form)});
    $('#' + this.htmlId + '_pickComment').bind("click", function(event) {form.pickComment.call(form)});
    $('#' + this.htmlId + '_comment').bind("change", function(event) {form.commentChangedHandle.call(form)});
    $('#' + this.htmlId + '_isFuture').bind("click", function(event) {form.isFutureChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_feesAdvanceAmount').bind("change", function(event) {form.feesAdvanceAmountChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_feesAdvanceCurrency').bind("change", function(event) {form.feesAdvanceCurrencyChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_feesPaymentCurrency').bind("change", function(event) {form.feesPaymentCurrencyChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_feesAdvanceDate').bind("change", function(event) {form.feesAdvanceDateTextChangedHandle.call(form, event)});
   
}
ProjectCodeForm.prototype.makeDatePickers = function() {
    var form = this;
    $('#' + this.htmlId + '_feesAdvanceDate').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.feesAdvanceDateChangedHandle(dateText, inst)}
    });
}
ProjectCodeForm.prototype.makeButtons = function() {
    var form = this;
    $('#' + this.htmlId + '_previewBtn')
      .button()
      .click(function( event ) {
        form.previewCode.call(form, event);
    });
    
    $('#' + this.htmlId + '_saveBtn')
      .button()
      .click(function( event ) {
        form.save.call(form, event);
    });
      
   $('#' + this.htmlId + '_inChargePerson_pick')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.inChargePersonPickHandle.call(form);
    });
    
    $('#' + this.htmlId + '_inChargePerson_clear')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.inChargePersonClearHandle.call(form);
    });

  $('#' + this.htmlId + '_inChargePartner_pick')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.inChargePartnerPickHandle.call(form);
    });
    
    $('#' + this.htmlId + '_inChargePartner_clear')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.inChargePartnerClearHandle.call(form);
    });

    $('#' + this.htmlId + '_commentToDescription')
      .button({
        icons: {
            primary: "ui-icon-arrowthick-1-e"
        },
        text: false
        })
      .click(function( event ) {
        form.copyCommentToDescription.call(form);
    });

    $('#' + this.htmlId + '_descriptionToComment')
      .button({
        icons: {
            primary: "ui-icon-arrowthick-1-w"
        },
        text: false
        })
      .click(function( event ) {
        form.copyDescriptionToComment.call(form);
    });
}
ProjectCodeForm.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.currencies = result.currencies;
            form.loaded.offices = result.offices;
            form.loaded.groups = result.groups;
            form.loaded.clients = result.clients;
            form.loaded.standardPositions = result.standardPositions;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProjectCodeForm.prototype.loadOfficeContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getDepartments";
    data.officeId = this.data.officeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.departments = result.departments;
            form.loaded.subdepartments = [];
            form.loaded.projectCodeComments = result.projectCodeComments;
            form.loaded.activities = [];
            form.data.departmentId = null;
            form.data.subdepartmentId = null;
            form.data.activityId = null;
            form.selected.projectCodeCommentId = null;
            form.updateDepartmentView();
            form.updateSubdepartmentView();
            form.updateActivityView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
    this.dataChanged(true);
}
ProjectCodeForm.prototype.loadDepartmentContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getSubdepartments";
    data.departmentId = this.data.departmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.subdepartments = result.subdepartments;
            form.loaded.projectCodeComments = result.projectCodeComments;           
            form.loaded.activities = [];
            form.data.subdepartmentId = null;
            form.data.activityId = null;
            form.selected.projectCodeCommentId = null;
            form.updateSubdepartmentView();
            form.updateActivityView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
    this.dataChanged(true);
}
ProjectCodeForm.prototype.loadSubdepartmentContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getActivities";
    data.subdepartmentId = this.data.subdepartmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.activities = result.activities;
            form.loaded.projectCodeComments = result.projectCodeComments;
            form.data.activityId = null;
            form.selected.projectCodeCommentId = null;
            form.updateActivityView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
    this.dataChanged(true);
}
ProjectCodeForm.prototype.loadGroupContent = function(event) {
    var form = this;
    var data = {};
    data.command = "getClients";
    data.groupId = this.data.groupId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.clients = result.clients;
            form.data.clientId = null;
            form.updateClientView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
    this.dataChanged(true);
}
ProjectCodeForm.prototype.loadAllClients = function(event) {
    var form = this;
    var data = {};
    data.command = "getAllClients";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.clients = result.clients;
            form.data.clientId = null;
            form.updateClientView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
    this.dataChanged(true);
}
ProjectCodeForm.prototype.officeChangedHandle = function() {
    this.formDataChanged();
    var idTxt = $('#' + this.htmlId + '_office').val();
    if(idTxt == '') {
        this.data.officeId = null;
    } else {
        this.data.officeId = parseInt(idTxt);
    }
    if(this.data.officeId == null) {
        this.data.departmentId = null;
        this.data.subdepartmentId = null;
        this.data.activityId = null;
        this.updateDepartmentView();
        this.updateSubdepartmentView();
        this.updateActivityView();
    } else {
        this.loadOfficeContent();
    }
}
ProjectCodeForm.prototype.departmentChangedHandle = function() {
    this.formDataChanged();
    var idTxt = $('#' + this.htmlId + '_department').val();
    if(idTxt == '') {
        this.data.departmentId = null;
    } else {
        this.data.departmentId = parseInt(idTxt);
    }
    if(this.data.departmentId == null) {
        this.loadOfficeContent();
    } else {
        this.loadDepartmentContent();
    }
}
ProjectCodeForm.prototype.subdepartmentChangedHandle = function() {
    this.formDataChanged();
    var idTxt = $('#' + this.htmlId + '_subdepartment').val();
    if(idTxt == '') {
        this.data.subdepartmentId = null;
    } else {
        this.data.subdepartmentId = parseInt(idTxt);
    }
    if(this.data.subdepartmentId == null) {
        this.loadDepartmentContent();
    } else {
        this.loadSubdepartmentContent();
    }
}
ProjectCodeForm.prototype.groupChangedHandle = function() {
    this.formDataChanged();
    var idTxt = $('#' + this.htmlId + '_group').val();
    if(idTxt == '') {
        this.data.groupId = null;
    } else {
        this.data.groupId = parseInt(idTxt);
    }
    if(this.data.groupId == null) {
        this.loadAllClients();
    } else {
        this.loadGroupContent();
    }
}
ProjectCodeForm.prototype.clientFilterChangedHandle = function(event) {
    var value = $('#' + this.htmlId + '_clientFilter').val();
    value = $.trim(value);
    if(value != this.data.clientFilter) {
        this.data.clientFilter = value;
        this.data.clientId = null;
        this.updateClientView();
    }
    this.updateClientFilterView();
}
ProjectCodeForm.prototype.clientChangedHandle = function() {
    this.formDataChanged();
    var idTxt = $('#' + this.htmlId + '_client').val();
    if(idTxt == '') {
        this.data.clientId = null;
    } else {
        this.data.clientId = parseInt(idTxt);
    }
    this.dataChanged(true);
}
ProjectCodeForm.prototype.yearChangedHandle = function() {
    this.formDataChanged();
    var idTxt = $('#' + this.htmlId + '_year').val();
    if(idTxt == '') {
        this.data.year = null;
    } else {
        this.data.year = parseInt(idTxt);
    }
    this.dataChanged(true);
}
ProjectCodeForm.prototype.financialYearChangedHandle = function() {
    this.formDataChanged();
    var idTxt = $('#' + this.htmlId + '_financialYear').val();
    if(idTxt == '') {
        this.data.financialYear = null;
    } else {
        this.data.financialYear = parseInt(idTxt);
    }
    this.dataChanged(true);
}
ProjectCodeForm.prototype.activityChangedHandle = function() {
    this.formDataChanged();
    var idTxt = $('#' + this.htmlId + '_activity').val();
    if(idTxt == '') {
        this.data.activityId = null;
    } else {
        this.data.activityId = parseInt(idTxt);
    }
    this.dataChanged(true);
}
ProjectCodeForm.prototype.periodTypeChangedHandle = function(event) {
    this.formDataChanged();
    this.data.periodType = event.currentTarget.value;
    this.updatePeriodView();
    this.dataChanged(true);
}
ProjectCodeForm.prototype.periodQuarterChangedHandle = function(event) {
    this.formDataChanged();
    this.data.periodQuarter = $('#' + this.htmlId + '_periodQuarter').val();
    this.dataChanged(true);
}
ProjectCodeForm.prototype.periodMonthChangedHandle = function(event) {
    this.formDataChanged();
    this.data.periodMonth = $('#' + this.htmlId + '_periodMonth').val();
    this.dataChanged(true);
}
ProjectCodeForm.prototype.periodDateChangedHandle = function(event) {
    this.formDataChanged();
    this.data.periodDate = $('#' + this.htmlId + '_periodDate').val();
    this.dataChanged(true);
}
ProjectCodeForm.prototype.descriptionChangedHandle = function() {
    this.data.description = jQuery.trim($('#' + this.htmlId + '_description').val());
    this.updateDescriptionView();
    this.dataChanged(true);
}
ProjectCodeForm.prototype.commentChangedHandle = function() {
    this.data.comment = jQuery.trim($('#' + this.htmlId + '_comment').val());
    this.updateCommentView();
    this.dataChanged(true);
}
ProjectCodeForm.prototype.pickComment = function() {
    if(this.data.subdepartmentId == null) {
        doAlert('Alert', 'Please select subdepartment', null, null);
        return;
    }
    this.updateProjectCodeCommentsView();   
}
ProjectCodeForm.prototype.updateProjectCodeCommentsView = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader">';
    html += '<td></td>';
    html += '<td>Content</td>';
    html += '</tr>';
    if(this.loaded.projectCodeComments != null && this.loaded.projectCodeComments.length > 0) {
        for(var key in this.loaded.projectCodeComments) {
            var projectCodeComment = this.loaded.projectCodeComments[key];
            html += '<tr>';
            html += '<td><input type="checkbox" id="' + this.htmlId + '_projectCodeComment_' + projectCodeComment.id + '"></td>';
            html += '<td>' + projectCodeComment.content + '</td>';
            html += '</tr>';          
        }
    } else {
        html += '<tr><td colspan="2">There are no comments for this subdepartment. Use admin interface to set typical comments.</td></tr>';
    }
    html += '</table>';

    this.popupHtmlId = getNextPopupHtmlContainer();
    $('#' + this.popupHtmlId).html(html);
    $('input[id^="' + this.htmlId + '_projectCodeComment_"]').bind("change", function(event) {form.projectCodeCommentChangedHandle.call(form, event);});

    var form = this;
    $('#' + this.popupHtmlId).dialog({
        title: "Contact",
        modal: true,
        position: 'center',
        width: 700,
        height: 400,
        buttons: {
            Ok: function() {
                $(this).dialog( "close" );
                form.pickProjectCodeComment();
            },
            Cancel: function() {
                $(this).dialog( "close" );
            }          
        },
        close: function(event, ui) {
            releasePopupLayer();
        } 
  });
}
ProjectCodeForm.prototype.projectCodeCommentChangedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var projectCodeCommentId = parseInt(parts[parts.length - 1]);
    this.selected.projectCodeCommentId = null;
    if( $('#' + this.htmlId + '_projectCodeComment_' + projectCodeCommentId).is(':checked') ) {
        this.selected.projectCodeCommentId = projectCodeCommentId;
    }
    this.updateProjectCodeCommentSelection();    
}
ProjectCodeForm.prototype.updateProjectCodeCommentSelection = function(event) {
    for(var key in this.loaded.projectCodeComments) {
        var projectCodeComment = this.loaded.projectCodeComments[key];
        var value = false;
        if(projectCodeComment.id == this.selected.projectCodeCommentId) {
            value = true;
        }
        $('#' + this.htmlId + '_projectCodeComment_' + projectCodeComment.id).prop("checked", value);
    }    
}
ProjectCodeForm.prototype.pickProjectCodeComment = function() {
    if(this.selected.projectCodeCommentId == null) {
        return;
    }
    var projectCodeCommentId = this.selected.projectCodeCommentId;
    var projectCodeComment = null;
    for(var key in this.loaded.projectCodeComments) {
        if(this.loaded.projectCodeComments[key].id == projectCodeCommentId) {
            projectCodeComment = this.loaded.projectCodeComments[key];
            break;
        }
    }
    this.selected.projectCodeCommentId = null;
    this.data.comment = projectCodeComment.content;
    this.updateCommentView();
    this.dataChanged(true);
}
ProjectCodeForm.prototype.isFutureChangedHandle = function(event) {
    this.data.isFuture = $(event.currentTarget).is(':checked');
    this.updateIsFutureView();
    this.dataChanged(true);
}
ProjectCodeForm.prototype.inChargePersonPickHandle = function() {
    var options = {
        standardPositionIds: []
    }
    for(var key in this.loaded.standardPositions) {
        var standardPosition = this.loaded.standardPositions[key];
        if(standardPosition.sortValue <= 3) { // Manager or higher
            options.standardPositionIds.push(standardPosition.id);
        }
    }    
    this.employeePicker = new EmployeePicker("employeePicker", this.inChargePersonPicked, this, this.moduleName, options);
    this.employeePicker.init();
}
ProjectCodeForm.prototype.inChargePersonPicked = function(employee) {
    this.data.inChargePerson = employee;
    this.updateInChargePersonView();
}
ProjectCodeForm.prototype.inChargePersonClearHandle = function() {
    this.data.inChargePerson = null;
    this.updateInChargePersonView();
}
ProjectCodeForm.prototype.inChargePartnerPickHandle = function() {
    var options = {
        standardPositionIds: []
    }
    for(var key in this.loaded.standardPositions) {
        var standardPosition = this.loaded.standardPositions[key];
        if(standardPosition.sortValue == 1) { // only Partner
            options.standardPositionIds.push(standardPosition.id);
        }
    }
    this.employeePicker = new EmployeePicker("employeePicker", this.inChargePartnerPicked, this, this.moduleName, options);
    this.employeePicker.init();
}
ProjectCodeForm.prototype.inChargePartnerPicked = function(employee) {
    this.data.inChargePartner = employee;
    this.updateInChargePartnerView();
}
ProjectCodeForm.prototype.inChargePartnerClearHandle = function() {
    this.data.inChargePartner = null;
    this.updateInChargePartnerView();
}
ProjectCodeForm.prototype.feesAdvanceAmountChangedHandle = function(event) {
    var value = $(event.currentTarget).val().trim();
    value = value.getReducedToNumber();
    this.data.feesAdvanceAmount = value;
    this.updateFeesAdvanceAmountView();
    this.dataChanged(true);
}
ProjectCodeForm.prototype.feesAdvanceCurrencyChangedHandle = function(event) {
    var value = $(event.currentTarget).val();
    if(value == '') {
        value = null;
    }
    this.data.feesAdvanceCurrencyId = value;
    this.updateFeesAdvanceCurrencyView();
    this.dataChanged(true);
}
ProjectCodeForm.prototype.feesPaymentCurrencyChangedHandle = function(event) {
    var value = $(event.currentTarget).val();
    if(value == '') {
        value = null;
    }
    this.data.feesPaymentCurrencyId = value;
    this.updateFeesPaymentCurrencyView();
    this.dataChanged(true);
}
ProjectCodeForm.prototype.feesAdvanceDateChangedHandle = function(dateText, inst) {
    var value = dateText;
    this.data.feesAdvanceDate = value;
    this.updateFeesAdvanceDateView();
    this.dataChanged(true);
}
ProjectCodeForm.prototype.feesAdvanceDateTextChangedHandle = function(event) {
    var value = $(event.currentTarget).val().trim();
    this.data.feesAdvanceDate = value;
    this.updateFeesAdvanceDateView();
    this.dataChanged(true);
}
ProjectCodeForm.prototype.copyCommentToDescription = function() {
    this.data.description = this.data.comment;
    this.updateDescriptionView();
    this.dataChanged(true);
}
ProjectCodeForm.prototype.copyDescriptionToComment = function() {
    this.data.comment = this.data.description;
    this.updateCommentView();
    this.dataChanged(true);
}
ProjectCodeForm.prototype.formDataChanged = function() {
    this.generatedCode = "";
    this.updateCodeView();
}
ProjectCodeForm.prototype.updateView = function() {
    this.updateOfficeView();
    this.updateDepartmentView();
    this.updateSubdepartmentView();
    this.updateGroupView();
    this.updateClientFilterView();
    this.updateClientView();
    this.updateYearView();
    this.updateFinancialYearView();
    this.updateActivityView();
    this.updatePeriodView();
    this.updatePeriodQuartersView();
    this.updatePeriodMonthsView();
    this.updatePeriodDatesView();
    this.updateDescriptionView();
    this.updateCommentView();
    this.updateCodeView();
    this.updateIsFutureView();
    this.updateInChargePersonView();
    this.updateInChargePartnerView();
    this.updateFeesAdvanceAmountView();
    this.updateFeesAdvanceCurrencyView();
    this.updateFeesPaymentCurrencyView();
    this.updateFeesAdvanceDateView();
}
ProjectCodeForm.prototype.updateOfficeView = function() {
   var html = "";
   html += '<option value="">...</option>';
    for(var key in this.loaded.offices) {
        var office = this.loaded.offices[key];
        html += '<option value="'+ office.id +'">' + office.name + '</option>';
    }
    $('#' + this.htmlId + '_office').html(html);
}
ProjectCodeForm.prototype.updateDepartmentView = function() {
   var html = "";
   html += '<option value="">...</option>';
    for(var key in this.loaded.departments) {
        var department = this.loaded.departments[key];
        html += '<option value="'+ department.id +'">' + department.name + '</option>';
    }
    $('#' + this.htmlId + '_department').html(html);
}
ProjectCodeForm.prototype.updateSubdepartmentView = function() {
    var html = "";
   html += '<option value="">...</option>';
    for(var key in this.loaded.subdepartments) {
        var subdepartment = this.loaded.subdepartments[key];
        html += '<option value="'+ subdepartment.id +'">' + subdepartment.name + '</option>';
    }
    $('#' + this.htmlId + '_subdepartment').html(html);
}
ProjectCodeForm.prototype.updateGroupView = function() {
    var html = "";
   html += '<option value="">...</option>';
    for(var key in this.loaded.groups) {
        var group = this.loaded.groups[key];
        var isSelected = "";
        if(group.id == this.data.groupId) {
           isSelected = "selected";
        }
        html += '<option value="'+ group.id +'" ' + isSelected + '>' + group.name + '</option>';
    }
    $('#' + this.htmlId + '_group').html(html);
}
ProjectCodeForm.prototype.updateClientFilterView = function() {
    $('#' + this.htmlId + '_clientFilter').val(this.data.clientFilter);
}
ProjectCodeForm.prototype.updateClientView = function() {
    var html = "";
    var filter = null;
    if(this.data.clientFilter != null && this.data.clientFilter != '') {
        filter = this.data.clientFilter.toLowerCase();
    }
    html += '<option value="">...</option>';
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
        if(client.id == this.data.clientId) {
           isSelected = "selected";
        }
        html += '<option value="'+ client.id +'" ' + isSelected + '>' + client.name + '</option>';
    }
    $('#' + this.htmlId + '_client').html(html);
}
ProjectCodeForm.prototype.updateYearView = function() {
    var html = "";
   html += '<option value="">...</option>';
    for(var key in this.years) {
        var year = this.years[key];
        html += '<option value="'+ year +'">' + year + '</option>';
    }
    $('#' + this.htmlId + '_year').html(html);
}
ProjectCodeForm.prototype.updateFinancialYearView = function() {
    var html = "";
   html += '<option value="">...</option>';
    for(var key in this.financialYears) {
        var financialYear = this.financialYears[key];
        html += '<option value="'+ key +'">' + financialYear + '</option>';
    }
    $('#' + this.htmlId + '_financialYear').html(html);
}
ProjectCodeForm.prototype.updateActivityView = function() {
    var html = "";
   html += '<option value="">...</option>';
    for(var key in this.loaded.activities) {
        var activity = this.loaded.activities[key];
        html += '<option value="'+ activity.id +'">' + activity.name + '</option>';
    }
    $('#' + this.htmlId + '_activity').html(html);
}
ProjectCodeForm.prototype.updatePeriodView = function() {
    var html = "";
    $('#' + this.htmlId + '_periodQuarter').hide();
    $('#' + this.htmlId + '_periodMonth').hide();
    $('#' + this.htmlId + '_periodDate').hide();
    $('#' + this.htmlId + '_periodCounter').hide();
    html += '<option value="" >...</option>';
    for(var key in this.periodTypes) {
        var periodType = this.periodTypes[key];
        var isSelected = "";
        if(key == this.data.periodType) {
           isSelected = "selected";
        }
        html += '<option value="'+ key +'" ' + isSelected + '>' + periodType + '</option>';
    }
    $('#' + this.htmlId + '_periodType').html(html);  
    if(this.data.periodType == "QUARTER") {
        this.updatePeriodQuartersView();
        $('#' + this.htmlId + '_periodQuarter').show("slow");
    } else if(this.data.periodType == "MONTH") {
        this.updatePeriodMonthsView();
        $('#' + this.htmlId + '_periodMonth').show("slow");
    } else if(this.data.periodType == "DATE") {
        this.updatePeriodDatesView();
        $('#' + this.htmlId + '_periodDate').show("slow");
    } else if(this.data.periodType == "COUNTER") {
        $('#' + this.htmlId + '_periodCounter').show("slow");
    }
}
ProjectCodeForm.prototype.updatePeriodQuartersView = function() {
    var html = "";
    for(var key in this.periodQuarters) {
        var periodQuarter = this.periodQuarters[key];
        var isSelected = "";
        if(key == this.data.periodQuarter) {
           isSelected = "selected";
        }
        html += '<option value="'+ key +'" ' + isSelected + '>' + periodQuarter + '</option>';
    }
    $('#' + this.htmlId + '_periodQuarter').html(html);
}
ProjectCodeForm.prototype.updatePeriodMonthsView = function() {
    var html = "";
    for(var key in this.periodMonths) {
        var periodMonth = this.periodMonths[key];
        var isSelected = "";
        if(key == this.data.periodMonth) {
           isSelected = "selected";
        }
        html += '<option value="'+ key +'" ' + isSelected + '>' + periodMonth + '</option>';
    }
    $('#' + this.htmlId + '_periodMonth').html(html);
}
ProjectCodeForm.prototype.updatePeriodDatesView = function() {
    var html = "";
    for(var key in this.periodDates) {
        var periodDate = this.periodDates[key];
        var isSelected = "";
        if(key == this.data.periodDate) {
           isSelected = "selected";
        }
        html += '<option value="'+ key +'" ' + isSelected + '>' + periodDate + '</option>';
    }
    $('#' + this.htmlId + '_periodDate').html(html);
}
ProjectCodeForm.prototype.updateDescriptionView = function() {
    if(this.data.description == null) {
        $('#' + this.htmlId + '_description').val("");
    } else {
        $('#' + this.htmlId + '_description').val(this.data.description);
    }
}
ProjectCodeForm.prototype.updateCommentView = function() {
    if(this.data.comment == null) {
        $('#' + this.htmlId + '_comment').val("");
    } else {
        $('#' + this.htmlId + '_comment').val(this.data.comment);
    }
}
ProjectCodeForm.prototype.updateCodeView = function() {
    $('#' + this.htmlId + '_code').val(this.generatedCode);
}
ProjectCodeForm.prototype.updateIsFutureView = function() {
    $('#' + this.htmlId + '_isFuture').attr("checked", this.data.isFuture);
}
ProjectCodeForm.prototype.updateInChargePersonView = function() {
    $('#' + this.htmlId + '_inChargePerson_userName').attr("disabled", true);
    if(this.data.inChargePerson != null) {
        $('#' + this.htmlId + '_inChargePerson_userName').val(this.data.inChargePerson.userName);
    } else {
        $('#' + this.htmlId + '_inChargePerson_userName').val("");
    }
}
ProjectCodeForm.prototype.updateInChargePartnerView = function() {
    $('#' + this.htmlId + '_inChargePartner_userName').attr("disabled", true);
    if(this.data.inChargePartner != null) {
        $('#' + this.htmlId + '_inChargePartner_userName').val(this.data.inChargePartner.userName);
    } else {
        $('#' + this.htmlId + '_inChargePartner_userName').val("");
    }
}
ProjectCodeForm.prototype.updateFeesAdvanceAmountView = function() {
    $('#' + this.htmlId + '_feesAdvanceAmount').val(this.data.feesAdvanceAmount);
}
ProjectCodeForm.prototype.updateFeesAdvanceCurrencyView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        var isSelected = "";
        if(currency.id == this.data.feesAdvanceCurrencyId) {
            isSelected = "selected";
        }
        html += '<option value="' + currency.id + '" ' + isSelected + '>' + currency.code + '</option>';            
    }
    $('#' + this.htmlId + '_feesAdvanceCurrency').html(html);   
}
ProjectCodeForm.prototype.updateFeesPaymentCurrencyView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        var isSelected = "";
        if(currency.id == this.data.feesPaymentCurrencyId) {
            isSelected = "selected";
        }
        html += '<option value="' + currency.id + '" ' + isSelected + '>' + currency.code + '</option>';            
    }
    $('#' + this.htmlId + '_feesPaymentCurrency').html(html);   
}
ProjectCodeForm.prototype.updateFeesAdvanceDateView = function() {
    $('#' + this.htmlId + '_feesAdvanceDate').val(this.data.feesAdvanceDate);
}
ProjectCodeForm.prototype.startAddingCounterPeriodInfo = function(code) {
    var projectCodeCounterForm = {
        "officeId": this.data.officeId,
        "subdepartmentId": this.data.subdepartmentId,
        "year": this.data.year,
        "clientId": this.data.clientId,
        "activityId": this.data.activityId
    };
    var form = this;
    var data = {};
    data.command = "getMaxPeriodCounter";
    data.projectCodeCounterForm = getJSON(projectCodeCounterForm);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.addCounterPeriodInfo.call(form, code, result.counter);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProjectCodeForm.prototype.addCounterPeriodInfo = function(code, currentCounter) {
    if(currentCounter == null) {
        code += '_' + 1;
    } else {
        code += '_' + (currentCounter + 1);
    }
      this.generatedCode = code;
      this.updateCodeView();
}
ProjectCodeForm.prototype.addNonCounterPeriodInfo = function(code) {
    if(this.data.periodType == "QUARTER") {
        code += '_Q' + this.periodQuartersForCode[this.data.periodQuarter];
    } else if(this.data.periodType == "MONTH") {
        code += '_M' + this.periodMonthsForCode[this.data.periodMonth];
    } else if(this.data.periodType == "DATE") {
        code += '_' + this.periodDates[this.data.periodDate];
    }
    this.generatedCode = code;
    this.updateCodeView();
}
ProjectCodeForm.prototype.validateGeneratingCode = function() {
    var errors = [];
    if(this.data.officeId == null) {
        errors.push('Office is not selected');
    }
    if(this.data.departmentId == null) {
        errors.push('Department is not selected');
    }
    if(this.data.subdepartmentId == null) {
        errors.push('Subdepartment is not selected');
    }
    if(this.data.activityId == null) {
        errors.push('Activity is not selected');
    }
    if(this.data.clientId == null) {
        errors.push('Client is not selected');
    } else {
        var client = null;
        for(var key in this.loaded.clients) {
            var tmpClient = this.loaded.clients[key];
            if(tmpClient.id == this.data.clientId) {
                client = tmpClient;
                break;
            }
        }
        if(client == null || client.codeName == null || client.codeName == '') {
            errors.push('Client Code Name is not good');
        }
    }
    if(this.data.year == null) {
        errors.push("Year is not set");
    }
    if(this.data.periodType == null) {
        errors.push('Period Type is not selected');
    }
    return errors;
}
ProjectCodeForm.prototype.previewCode = function() {
    var errors = this.validateGeneratingCode();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
        var code = '';
        var form = this;
        var office = jQuery.grep(this.loaded.offices, function(element) {return element.id == form.data.officeId})[0]
        var department = jQuery.grep(this.loaded.departments, function(element) {return element.id == form.data.departmentId})[0]
        var subdepartment = jQuery.grep(this.loaded.subdepartments, function(element) {return element.id == form.data.subdepartmentId})[0]
        var client = jQuery.grep(this.loaded.clients, function(element) {return element.id == form.data.clientId})[0]
        var activity = jQuery.grep(this.loaded.activities, function(element) {return element.id == form.data.activityId})[0]
        code += office.codeName;
        code += '_' + department.codeName;
        code += '_' + subdepartment.codeName;
        code += '_' + client.codeName;
        code += '_' + this.data.year;
        code += '_' + activity.codeName;
        if(this.data.periodType == "COUNTER") {
            this.startAddingCounterPeriodInfo(code);
        } else {
            this.addNonCounterPeriodInfo(code);
        }
    }
}
ProjectCodeForm.prototype.validate = function() {
    var errors = [];
    var float2digitsRE = /^[0-9]*\.?[0-9]{0,2}$/;
    if(this.generatedCode == null || this.generatedCode == "") {
        errors.push('You have to generate Code before saving it. Click "Generate" to generate the Code');
        return errors;
    }
    if(this.data.officeId == null) {
        errors.push('Office is not selected');
    }
    if(this.data.departmentId == null) {
        errors.push('Department is not selected');
    }
    if(this.data.subdepartmentId == null) {
        errors.push('Subdepartment is not selected');
    }
    if(this.data.activityId == null) {
        errors.push('Activity is not selected');
    }
    if(this.data.clientId == null) {
        errors.push('Client is not selected');
    }
    if(this.data.year == null) {
        errors.push("Year is not set");
    }
    if(this.data.financialYear == null) {
        errors.push("Financial Year is not set");
    }
    if(this.data.periodType == null) {
        errors.push('Period Type is not selected');
    }
    if(this.data.description == null || this.data.description == "") {
        errors.push("Description is not set");
    }
    if(this.data.comment == null || this.data.comment == "") {
        errors.push("Comment is not set");
    }
    if(this.data.inChargePerson == null) {
        errors.push("Person in Charge is not set");
    }
    if(this.data.inChargePartner == null) {
        errors.push("Partner in Charge is not set");
    }
    var feesAdvanceAmount = this.data.feesAdvanceAmount;
    var feesAdvanceCurrencyId = this.data.feesAdvanceCurrencyId;
    var feesPaymentCurrencyId = this.data.feesPaymentCurrencyId;
    var feesAdvanceDate = this.data.feesAdvanceDate;
    if(feesAdvanceAmount != null && feesAdvanceAmount != "") {
        if(!float2digitsRE.test(feesAdvanceAmount)) {
            errors.push('Invoice Amount has incorrect format');
        }
        if(feesAdvanceCurrencyId == null) {
            errors.push('Invoice Amount currency is not set');
        }
        if(feesPaymentCurrencyId == null) {
            errors.push('Payment currency is not set');
        }
        if(feesAdvanceDate == null || feesAdvanceDate == "") {
            errors.push('Invoice Date is not set');
        }     
    } else if(feesAdvanceCurrencyId != null) {
        if(feesAdvanceAmount == null || feesAdvanceAmount == "") {
            errors.push('Invoice Amount is not set');
        }
        if(feesAdvanceDate == null || feesAdvanceDate == "") {
            errors.push('Invoice Date is not set');
        }
        if(feesPaymentCurrencyId == null) {
            errors.push('Payment currency is not set');
        }
    }  else if(feesPaymentCurrencyId != null) {
        if(feesAdvanceAmount == null || feesAdvanceAmount == "") {
            errors.push('Invoice Amount is not set');
        }
        if(feesAdvanceDate == null || feesAdvanceDate == "") {
            errors.push('Invoice Date is not set');
        }
        if(feesAdvanceCurrencyId == null) {
            errors.push('Invoice Amount currency is not set');
        }
    } else if(feesAdvanceDate != null) {
        if(! isDateValid(feesAdvanceDate)) {
            errors.push('Invoice Date for code has incorrect format');
        }
        if(feesAdvanceAmount == null || feesAdvanceAmount == "") {
            errors.push('Invoice Amount is not set');
        }
        if(feesAdvanceCurrencyId == null) {
            errors.push('Invoice Currency is not set');
        }
        if(feesPaymentCurrencyId == null) {
            errors.push('Payment currency is not set');
        }
    }
    return errors;
}
ProjectCodeForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
        var projectCodeForm = clone(this.data);
        projectCodeForm.inChargePersonId = this.data.inChargePerson.id;
        projectCodeForm.inChargePerson = null;
        projectCodeForm.inChargePartnerId = this.data.inChargePartner.id;
        projectCodeForm.inChargePartner = null;
        projectCodeForm.feesAdvanceDate = getYearMonthDateFromDateString(this.data.feesAdvanceDate);
        projectCodeForm.projectCodeCode = this.generatedCode;
        var form = this;
        var data = {};
        data.command = "saveProjectCode";
        data.projectCodeForm = getJSON(projectCodeForm);
        $.ajax({
            url: this.config.endpointUrl,
            data: data,
            cache: false,
            type: "POST",
            success: function(data){
                ajaxResultHandle(data, form, function(result) {
                    form.createdCode = result.createdCode;
                    var html = 'Project Code ';
                    html += '<a href="../../code/code_management/index.jsp?code=' + escape(form.createdCode) + '">' + form.createdCode + '</a><br />';
                    html += ' has been successfully created'
                    doAlert("Info", html, form, form.reset);
                    form.dataChanged(false);
                })
            },
            error: function(jqXHR, textStatus, errorThrown) {
                ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
            }
        });
    }
}
ProjectCodeForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}
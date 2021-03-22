/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ProjectCodeBatchCreationForm(htmlId, containerHtmlId) {
    this.createdProjectCodeId = null; // for callbacks
    this.config = {
        endpointUrl: endpointsFolder + "ProjectCodeBatchCreationForm.jsp"
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
        "projectCodeComments": []
    }
    this.data = {
        clientIds: [],
        activityIds: [],
       //{"type", "QUARTER", "path": "Quarter / First", "quarter": "FIRST", "month": null, "date": null, "counter": null}
        periods: [],
        year : null,
        financialYear : null,
        description : "",
        comment : "",
        isDead: false,
        isClosed: false,
        inChargePerson: null
    };
    this.projectCodeCodes = [];
    
    
    this.pickedActivities = [];
    this.pickedClients = [];
    this.pickedPeriods = [];
    this.selected = {
        "clientId": null,
        "activityId": null,
        "periodId": null,
        "periods": {
            "quarter": null,
            "month": null,
            "date": null,
            "counter": null
        },
        projectCodeCommentId: null
    }
    this.feesAdvanceAmountItems = {};
    this.feesAdvanceCurrencyItems = {};
    this.feesPaymentCurrencyItems = {};
    this.feesAdvanceDateItems = {};
    this.isFutureItems = {};
    this.inChargePersons = {};
    this.inChargePartners = {};
    
    this.updatedCode = null;
}
ProjectCodeBatchCreationForm.prototype.init = function() {
    this.loadInitialContent();
    this.dataChanged(false);
}
ProjectCodeBatchCreationForm.prototype.loadInitialContent = function() {
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
            form.loaded.standardPositions = result.standardPositions;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProjectCodeBatchCreationForm.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeButtons();
    this.makeDatePickers();
    this.setHandlers();
    this.updateView();
}
ProjectCodeBatchCreationForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Client</span></td>';
    html += '<td><span class="label1">Activity</span></td>';
    html += '<td><span class="label1">Period</span></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><div class="selector" style="width: 300px; height: 150px;" id="' + this.htmlId + '_client"></div></td>';
    html += '<td><div class="selector" style="width: 300px; height: 150px;" id="' + this.htmlId + '_activity"></div></td>';
    html += '<td><div class="selector" style="width: 300px; height: 150px;" id="' + this.htmlId + '_period"></div></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><button id="' + this.htmlId + '_client_pick">Pick</button><button id="' + this.htmlId + '_client_delete">Delete</button></td>';
    html += '<td><button id="' + this.htmlId + '_activity_pick">Pick</button><button id="' + this.htmlId + '_activity_delete">Delete</span></td>';
    html += '<td><button id="' + this.htmlId + '_period_pick">Pick</button><button id="' + this.htmlId + '_period_delete">Delete</span></td>';
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
    html += '<td style="padding-left: 30px;"><input type="text" id="' + this.htmlId + '_inChargePerson_userName">';
    html += '<button id="' + this.htmlId + '_inChargePerson_pick">Pick</button><button id="' + this.htmlId + '_inChargePerson_clear" title="Clear">Delete</button>';
    html += '</td>';
    html += '<td style="padding-left: 30px;"><input type="text" id="' + this.htmlId + '_inChargePartner_userName">';
    html += '<button id="' + this.htmlId + '_inChargePartner_pick">Pick</button><button id="' + this.htmlId + '_inChargePartner_clear" title="Clear">Delete</button>';
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
    html += '<div id="' + this.htmlId + '_previewCodes"></div>';
    html += '<input type="button" value="Preview" id="' + this.htmlId + '_previewBtn">';
    html += '<input type="button" value="Save" id="' + this.htmlId + '_saveBtn">';
    return html;
}
ProjectCodeBatchCreationForm.prototype.reset = function() {
   this.data = {
        clientIds: [],
        activityIds: [],
       //{"type", "QUARTER", "path": "Quarter / First", "quarter": "FIRST", "month": null, "date": null, "counter": null}
        periods: [],
        year : null,
        financialYear : null,
        description : "",
        comment : "",
        isDead: false,
        isClosed: false,
        inChargePerson: null,
        inChargePartner: null
    };
    this.projectCodeCodes = [];
    
    this.pickedActivities = [];
    this.pickedClients = [];
    this.pickedPeriods = [];
    this.selected = {
        "clientId": null,
        "activityId": null,
        "periodId": null,
        "periods": {
            "quarter": null,
            "month": null,
            "date": null,
            "counter": null
        }
    }
    this.feesAdvanceAmountItems = {};
    this.feesAdvanceCurrencyItems = {};
    this.feesPaymentCurrencyItems = {};
    this.feesAdvanceDateItems = {};
    this.isFutureItems = {};
    this.inChargePersons = {};
    this.inChargePartners = {};
    this.init();
}
ProjectCodeBatchCreationForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_year').bind("change", function(event) {form.yearChangedHandle.call(form)});
    $('#' + this.htmlId + '_financialYear').bind("change", function(event) {form.financialYearChangedHandle.call(form)});
    $('#' + this.htmlId + '_isFuture').bind("click", function(event) {form.isFutureChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_description').bind("change", function(event) {form.descriptionChangedHandle.call(form)});
    $('#' + this.htmlId + '_comment').bind("change", function(event) {form.commentChangedHandle.call(form)});
    $('#' + this.htmlId + '_pickComment').bind("click", function(event) {form.pickComment.call(form)});
}
ProjectCodeBatchCreationForm.prototype.makeDatePickers = function() {
    var form = this;
    //$('#' + this.htmlId + '_startDate').datepicker({
    //    dateFormat: 'dd.mm.yy',
    //    onSelect: function(dateText, inst) {form.startDateChangedHandle(dateText, inst)}
    //});
}
ProjectCodeBatchCreationForm.prototype.makeButtons = function() {
    var form = this;
    $('#' + this.htmlId + '_previewBtn')
      .button()
      .click(function( event ) {
        form.previewCodes.call(form);
    });
    
    $('#' + this.htmlId + '_saveBtn')
      .button()
      .click(function( event ) {
        form.save.call(form);
    });
    
    $('#' + this.htmlId + '_client_pick')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.clientPickHandle.call(form);
    });

    $('#' + this.htmlId + '_client_delete')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.clientDeleteHandle.call(form);
    });
    
    $('#' + this.htmlId + '_activity_pick')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.activityPickHandle.call(form);
    });
    
    $('#' + this.htmlId + '_activity_delete')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.activityDeleteHandle.call(form);
    });
    
    $('#' + this.htmlId + '_period_pick')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.periodPickHandle.call(form);
    });
    
    $('#' + this.htmlId + '_period_delete')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.periodDeleteHandle.call(form);
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
ProjectCodeBatchCreationForm.prototype.clientPickHandle = function() {
    var formData = {
        "mode": 'MULTIPLE'
    };
    this.employeePicker = new ClientPicker(formData, "clientPicker", this.clientPicked, this, this.moduleName);
    this.employeePicker.init();
}
ProjectCodeBatchCreationForm.prototype.clientPicked = function(pickedClients) {
    for(var key in pickedClients) {
        var pickedClient = pickedClients[key];
        var exists = false;
        for(var key2 in this.pickedClients) {
            var pickedClient2 = this.pickedClients[key2];
            if(pickedClient.client.id == pickedClient2.client.id) {
                exists = true;
                break;
            }
        }
        if(! exists) {
            this.pickedClients.push(pickedClient);
        }
    }
    this.sortPickedClients();
    this.updateClientView();
    this.formDataChanged();
}
ProjectCodeBatchCreationForm.prototype.clientDeleteHandle = function() {
    if(this.selected.clientId == null) {
        doAlert('Alert', 'Client is not selected', null, null);
        return;
    }
    var index = null;
    for(var key in this.pickedClients) {
        if(this.pickedClients[key].client.id == this.selected.clientId) {
            index = key;
            break;
        }
    }
    if(index != null) {
        this.pickedClients.splice(index, 1);
        this.selected.clientId = null;
        this.updateClientView();
    }
    this.formDataChanged();    
}
ProjectCodeBatchCreationForm.prototype.clientClickedHandle = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    this.selected.clientId = parseInt(tmp[tmp.length - 1]);
    this.updateClientView();
}
ProjectCodeBatchCreationForm.prototype.activityPickHandle = function() {
    var formData = {
        "mode": 'MULTIPLE'
    };
    this.employeePicker = new ActivityPicker(formData, "activityPicker", this.activityPicked, this, this.moduleName);
    this.employeePicker.init();
}
ProjectCodeBatchCreationForm.prototype.activityPicked = function(pickedActivities) {
    for(var key in pickedActivities) {
        var pickedActivity = pickedActivities[key];
        if(pickedActivity.activity.isActive == false) {
            continue;
        }
        var exists = false;
        for(var key2 in this.pickedActivities) {
            var pickedActivity2 = this.pickedActivities[key2];
            if(pickedActivity.activity.id == pickedActivity2.activity.id) {
                exists = true;
                break;
            }
        }
        if(! exists) {
            this.pickedActivities.push(pickedActivity);
        }
    }
    this.sortPickedActivities();
    this.updateActivityView();
    this.formDataChanged();
}
ProjectCodeBatchCreationForm.prototype.activityDeleteHandle = function() {
    if(this.selected.activityId == null) {
        doAlert('Alert', 'Activity is not selected', null, null);
        return;
    }
    var index = null;
    for(var key in this.pickedActivities) {
        if(this.pickedActivities[key].activity.id == this.selected.activityId) {
            index = key;
            break;
        }
    }
    if(index != null) {
        this.pickedActivities.splice(index, 1);
        this.selected.activityId = null;
        this.updateActivityView();
    }
    this.formDataChanged();
}
ProjectCodeBatchCreationForm.prototype.activityClickedHandle = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    this.selected.activityId = parseInt(tmp[tmp.length - 1]);
    this.updateActivityView();
}
ProjectCodeBatchCreationForm.prototype.periodPickHandle = function() {
    var formData = {
        "mode": 'MULTIPLE'
    };
    this.periodPicker = new PeriodPicker(formData, "periodPicker", this.periodPicked, this, this.moduleName);
    this.periodPicker.init();
}
ProjectCodeBatchCreationForm.prototype.periodPicked = function(pickedPeriods) {
    for(var key in pickedPeriods) {
        var pickedPeriod = pickedPeriods[key];
        var exists = false;
        if(pickedPeriod.type != 'COUNTER') {
            for(var key2 in this.pickedPeriods) {
                var pickedPeriod2 = this.pickedPeriods[key2];
                if(pickedPeriod2.type == 'QUARTER') {
                    if(pickedPeriod.quarter == pickedPeriod2.quarter) {
                        exists = true;
                        break;
                    }
                } else if(pickedPeriod2.type == 'MONTH') {
                    if(pickedPeriod.month == pickedPeriod2.month) {
                        exists = true;
                        break;
                    }
                } else if(pickedPeriod2.type == 'DATE') {
                    if(pickedPeriod.date == pickedPeriod2.date) {
                        exists = true;
                        break;
                    }
                }
            }
        }
        if(! exists) {
            this.pickedPeriods.push(pickedPeriod);
        }
    }
    this.sortPickedPeriods();
    this.updatePeriodView();
    this.formDataChanged();
}
ProjectCodeBatchCreationForm.prototype.periodDeleteHandle = function() {
    if(this.selected.periods.quarter == null && this.selected.periods.month == null && this.selected.periods.date == null && this.selected.periods.counter == null) {
        doAlert('Alert', 'Period is not selected', null, null);
        return;
    }
    var index = null;
    var i = 0;
    for(var key in this.pickedPeriods) {
        var period = this.pickedPeriods[key];
        if(period.type == 'QUARTER' && this.selected.periods.quarter == period.quarter) {
            index = key;
            break;           
        }
        if(period.type == 'MONTH' && this.selected.periods.month == period.month) {
            index = key;
            break;           
        }
        if(period.type == 'DATE' && this.selected.periods.date == period.date) {
            index = key;
            break;           
        }
        if(period.type == 'COUNTER') { 
            if(parseInt(this.selected.periods.counter) == i) {
                index = key;
                break;           
            }
            i++;
        }
    }
    if(index != null) {
        this.pickedPeriods.splice(index, 1);
    }
    this.sortPickedPeriods();
    this.selected.periods = {
        "quarter": null,
        "month": null,
        "date": null,
        "counter": null
    }
    this.updatePeriodView();
    this.formDataChanged();
}
ProjectCodeBatchCreationForm.prototype.periodClickedHandle = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    var type = tmp[tmp.length - 2];
    var valueTxt = tmp[tmp.length - 1];
    this.selected.periods = {
        "quarter": null,
        "month": null,
        "date": null,
        "counter": null
    }
    if(type == 'QUARTER') {
        this.selected.periods.quarter = valueTxt;
    } else if(type == 'MONTH') {
        this.selected.periods.month = valueTxt;
    } else if(type == 'DATE') {
        this.selected.periods.date = valueTxt;
    } else if(type == 'COUNTER') {
        this.selected.periods.counter = valueTxt;
    }
    this.updatePeriodView();
}
ProjectCodeBatchCreationForm.prototype.yearChangedHandle = function() {
    this.formDataChanged();
    var idTxt = $('#' + this.htmlId + '_year').val();
    if(idTxt == '') {
        this.data.year = null;
    } else {
        this.data.year = parseInt(idTxt);
    }
    this.dataChanged(true);
}
ProjectCodeBatchCreationForm.prototype.financialYearChangedHandle = function() {
    this.formDataChanged();
    var idTxt = $('#' + this.htmlId + '_financialYear').val();
    if(idTxt == '') {
        this.data.financialYear = null;
    } else {
        this.data.financialYear = parseInt(idTxt);
    }
    this.dataChanged(true);
}
ProjectCodeBatchCreationForm.prototype.descriptionChangedHandle = function() {
    this.data.description = jQuery.trim($('#' + this.htmlId + '_description').val());
    this.updateDescriptionView();
    this.dataChanged(true);
}
ProjectCodeBatchCreationForm.prototype.commentChangedHandle = function() {
    this.data.comment = jQuery.trim($('#' + this.htmlId + '_comment').val());
    this.updateCommentView();
    this.dataChanged(true);
}
ProjectCodeBatchCreationForm.prototype.pickComment = function() {
    if(this.pickedActivities == null || this.pickedActivities.length == 0) {
        doAlert('Alert', 'Please pick activity', null, null);
        return;
    }
    var form = this;
    var activityIds = [];
    for(var key in this.pickedActivities) {
        var pickedActivity = this.pickedActivities[key];
        activityIds.push(pickedActivity.activity.id);
    }
    var form = this;
    var data = {};
    data.command = "getProjectCodeComments";
    data.activityIds = getJSON({"list": activityIds});
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.projectCodeComments = result.projectCodeComments;
            form.updateProjectCodeCommentsView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });  
}
ProjectCodeBatchCreationForm.prototype.updateProjectCodeCommentsView = function() {
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
ProjectCodeBatchCreationForm.prototype.projectCodeCommentChangedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var projectCodeCommentId = parseInt(parts[parts.length - 1]);
    this.selected.projectCodeCommentId = null;
    if( $('#' + this.htmlId + '_projectCodeComment_' + projectCodeCommentId).is(':checked') ) {
        this.selected.projectCodeCommentId = projectCodeCommentId;
    }
    this.updateProjectCodeCommentSelection();    
}
ProjectCodeBatchCreationForm.prototype.updateProjectCodeCommentSelection = function(event) {
    for(var key in this.loaded.projectCodeComments) {
        var projectCodeComment = this.loaded.projectCodeComments[key];
        var value = false;
        if(projectCodeComment.id == this.selected.projectCodeCommentId) {
            value = true;
        }
        $('#' + this.htmlId + '_projectCodeComment_' + projectCodeComment.id).prop("checked", value);
    }    
}
ProjectCodeBatchCreationForm.prototype.pickProjectCodeComment = function() {
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

ProjectCodeBatchCreationForm.prototype.inChargePersonPickHandle = function() {
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
ProjectCodeBatchCreationForm.prototype.inChargePersonPicked = function(employee) {
    this.data.inChargePerson = employee;
    this.updateInChargePersonView();
}
ProjectCodeBatchCreationForm.prototype.inChargePersonClearHandle = function() {
    this.data.inChargePerson = null;
    this.updateInChargePersonView();
}
ProjectCodeBatchCreationForm.prototype.inChargePartnerPickHandle = function() {
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
ProjectCodeBatchCreationForm.prototype.inChargePartnerPicked = function(employee) {
    this.data.inChargePartner = employee;
    this.updateInChargePartnerView();
}
ProjectCodeBatchCreationForm.prototype.inChargePartnerClearHandle = function() {
    this.data.inChargePartner = null;
    this.updateInChargePartnerView();
}
ProjectCodeBatchCreationForm.prototype.specificInChargePersonPickHandle = function(event) {
    var id = $(event.currentTarget).attr("id");
    var parts = id.split('_');
    var rowIndex = parts[parts.length - 1];
    
    var options = {
        standardPositionIds: []
    }
    for(var key in this.loaded.standardPositions) {
        var standardPosition = this.loaded.standardPositions[key];
        if(standardPosition.sortValue <= 3) { // Manager or higher
            options.standardPositionIds.push(standardPosition.id);
        }
    }
    
    this.updatedCode = this.projectCodeCodes[rowIndex];
    this.employeePicker = new EmployeePicker("employeePicker", this.specificInChargePersonPicked, this, this.moduleName, options);
    this.employeePicker.init();
}
ProjectCodeBatchCreationForm.prototype.specificInChargePersonPicked = function(employee) {
    this.inChargePersons[this.updatedCode] = employee;
    this.updateSpecificInChargePersonView();
}
ProjectCodeBatchCreationForm.prototype.specificInChargePersonClearHandle = function(event) {
    var id = $(event.currentTarget).attr("id");
    var parts = id.split('_');
    var rowIndex = parts[parts.length - 1];
    this.updatedCode = this.projectCodeCodes[rowIndex];    
    this.inChargePersons[this.updatedCode] = null;
    this.updateSpecificInChargePersonView();
}
ProjectCodeBatchCreationForm.prototype.specificInChargePartnerPickHandle = function(event) {
    var id = $(event.currentTarget).attr("id");
    var parts = id.split('_');
    var rowIndex = parts[parts.length - 1];
    
    var options = {
        standardPositionIds: []
    }
    for(var key in this.loaded.standardPositions) {
        var standardPosition = this.loaded.standardPositions[key];
        if(standardPosition.sortValue == 1) { // only Partner
            options.standardPositionIds.push(standardPosition.id);
        }
    }
    
    this.updatedCode = this.projectCodeCodes[rowIndex];
    this.employeePicker = new EmployeePicker("employeePicker", this.specificInChargePartnerPicked, this, this.moduleName, options);
    this.employeePicker.init();
}
ProjectCodeBatchCreationForm.prototype.specificInChargePartnerPicked = function(employee) {
    this.inChargePartners[this.updatedCode] = employee;
    this.updateSpecificInChargePartnerView();
}
ProjectCodeBatchCreationForm.prototype.specificInChargePartnerClearHandle = function(event) {
    var id = $(event.currentTarget).attr("id");
    var parts = id.split('_');
    var rowIndex = parts[parts.length - 1];
    this.updatedCode = this.projectCodeCodes[rowIndex];    
    this.inChargePartners[this.updatedCode] = null;
    this.updateSpecificInChargePartnerView();
}
ProjectCodeBatchCreationForm.prototype.feesAdvanceAmountChangedHandle = function(event) {
    var value = $(event.currentTarget).val().trim();
    value = value.getReducedToNumber();
    var id = $(event.currentTarget).attr("id");
    var parts = id.split('_');
    var rowIndex = parts[parts.length - 1];
    var code = this.projectCodeCodes[rowIndex];
    this.feesAdvanceAmountItems[code] = value;
    this.updateFeesAdvanceAmountView();
}
ProjectCodeBatchCreationForm.prototype.feesAdvanceCurrencyChangedHandle = function(event) {
    var value = $(event.currentTarget).val();
    var id = $(event.currentTarget).attr("id");
    if(value == '') {
        value = null;
    }
    var parts = id.split('_');
    var rowIndex = parts[parts.length - 1];
    var code = this.projectCodeCodes[rowIndex];
    this.feesAdvanceCurrencyItems[code] = value;
    this.updateFeesAdvanceCurrencyView();
}
ProjectCodeBatchCreationForm.prototype.feesPaymentCurrencyChangedHandle = function(event) {
    var value = $(event.currentTarget).val();
    var id = $(event.currentTarget).attr("id");
    if(value == '') {
        value = null;
    }
    var parts = id.split('_');
    var rowIndex = parts[parts.length - 1];
    var code = this.projectCodeCodes[rowIndex];
    this.feesPaymentCurrencyItems[code] = value;
    this.updateFeesPaymentCurrencyView();
}
ProjectCodeBatchCreationForm.prototype.feesAdvanceDatePickedHandle = function(dateText, inst) {
    var value = dateText;
    var id = inst.id;
    this.feesAdvanceDateChangedHandle(id, value);
}
ProjectCodeBatchCreationForm.prototype.feesAdvanceDateTextChangedHandle = function(event) {
    var value = $(event.currentTarget).val().trim();
    var id = $(event.currentTarget).attr("id");
    this.feesAdvanceDateChangedHandle(id, value);
}
ProjectCodeBatchCreationForm.prototype.feesAdvanceDateChangedHandle = function(id, value) {
    var parts = id.split('_');
    var rowIndex = parts[parts.length - 1];
    var code = this.projectCodeCodes[rowIndex];
    this.feesAdvanceDateItems[code] = value;

    for(var key in this.projectCodeCodes) {
        var projectCodeCode = this.projectCodeCodes[key];
        if(this.feesAdvanceDateItems[projectCodeCode] == null || this.feesAdvanceDateItems[projectCodeCode] == '') {
            this.feesAdvanceDateItems[projectCodeCode] = value;
        }
    }
    
    this.updateFeesAdvanceDateView();
    this.dataChanged(true);
}
ProjectCodeBatchCreationForm.prototype.isFutureChangedHandle = function(event) {
    var isFuture = $(event.currentTarget).is(':checked');
    var id = $(event.currentTarget).attr("id");
    var parts = id.split('_');
    var rowIndex = parts[parts.length - 1];
    var code = this.projectCodeCodes[rowIndex];
    this.isFutureItems[code] = isFuture;
    this.updateIsFutureView();
}
ProjectCodeBatchCreationForm.prototype.copyCommentToDescription = function() {
    this.data.description = this.data.comment;
    this.updateDescriptionView();
    this.dataChanged(true);
}
ProjectCodeBatchCreationForm.prototype.copyDescriptionToComment = function() {
    this.data.comment = this.data.description;
    this.updateCommentView();
    this.dataChanged(true);
}
ProjectCodeBatchCreationForm.prototype.formDataChanged = function() {
    this.projectCodeCodes = [];
    this.updatePreviewCodesView();
}
ProjectCodeBatchCreationForm.prototype.updateView = function() {
    this.updateClientView();
    this.updateActivityView();
    this.updatePeriodView();
    this.updateYearView();
    this.updateFinancialYearView();
    this.updateDescriptionView();
    this.updateCommentView();
    this.updatePreviewCodesView();
    this.updateIsFutureView();
    this.updateInChargePersonView();
    this.updateInChargePartnerView();
}

ProjectCodeBatchCreationForm.prototype.updateClientView = function() {
    var html = '';
    for(var key in this.pickedClients) {
        var client = this.pickedClients[key].client;
        var path = this.pickedClients[key].path;
        var classSelected = "";
        if(client.id == this.selected.clientId) {
           classSelected = 'class="selected"';
        }
        html += '<div id="' + this.htmlId + '_client_' + client.id + '" ' + classSelected + '>' + path + '</div>';
    }
    $('#' + this.htmlId + '_client').html(html);
    var form = this;
    $('div[id^="' + this.htmlId + '_client_"]').bind("click", function(event) {form.clientClickedHandle(event);});
}
ProjectCodeBatchCreationForm.prototype.updateActivityView = function() {
    var html = '';
    for(var key in this.pickedActivities) {
        var activity = this.pickedActivities[key].activity;
        var path = this.pickedActivities[key].path;
        var classSelected = "";
        if(activity.id == this.selected.activityId) {
           classSelected = 'class="selected"';
        }
        html += '<div id="' + this.htmlId + '_activity_' + activity.id + '" ' + classSelected + '>' + path + '</div>';
    }
    $('#' + this.htmlId + '_activity').html(html);
    var form = this;
    $('div[id^="' + this.htmlId + '_activity_"]').bind("click", function(event) {form.activityClickedHandle(event);});
}
ProjectCodeBatchCreationForm.prototype.updatePeriodView = function() {
    var html = '';
    var i = 0;
    for(var key in this.pickedPeriods) {
        var pickedPeriod = this.pickedPeriods[key];
        var type = pickedPeriod.type;
        var path = pickedPeriod.path;
        var value = null;
        var classSelected = "";
        if(type == 'QUARTER') {
            value = pickedPeriod.quarter;
            if(value == this.selected.periods.quarter) {
                classSelected = 'class="selected"';
            }
        } else if(type == 'MONTH') {
            value = pickedPeriod.month;
            if(value == this.selected.periods.month) {
                classSelected = 'class="selected"';
            }
        } else if(type == 'DATE') {
            value = pickedPeriod.date;
            if(value == this.selected.periods.date) {
                classSelected = 'class="selected"';
            }
        } else if(type == 'COUNTER') {
            value = i;
            if(value == this.selected.periods.counter) {
                classSelected = 'class="selected"';
            }
            i++;
        }     
        html += '<div id="' + this.htmlId + '_period_' + type + '_' + value + '" ' + classSelected + '>' + path + '</div>';
    }
    $('#' + this.htmlId + '_period').html(html);
    var form = this;
    $('div[id^="' + this.htmlId + '_period_"]').bind("click", function(event) {form.periodClickedHandle(event);});
}
ProjectCodeBatchCreationForm.prototype.updateYearView = function() {
    var html = "";
    html += '<option value="">...</option>';
    for(var key in this.years) {
        var year = this.years[key];
        html += '<option value="'+ year +'">' + year + '</option>';
    }
    $('#' + this.htmlId + '_year').html(html);
}
ProjectCodeBatchCreationForm.prototype.updateFinancialYearView = function() {
    var html = "";
   html += '<option value="">...</option>';
    for(var key in this.financialYears) {
        var financialYear = this.financialYears[key];
        html += '<option value="'+ key +'">' + financialYear + '</option>';
    }
    $('#' + this.htmlId + '_financialYear').html(html);
}
ProjectCodeBatchCreationForm.prototype.updateDescriptionView = function() {
    if(this.data.description == null) {
        $('#' + this.htmlId + '_description').val("");
    } else {
        $('#' + this.htmlId + '_description').val(this.data.description);
    }
}
ProjectCodeBatchCreationForm.prototype.updateCommentView = function() {
    if(this.data.comment == null) {
        $('#' + this.htmlId + '_comment').val("");
    } else {
        $('#' + this.htmlId + '_comment').val(this.data.comment);
    }
}
ProjectCodeBatchCreationForm.prototype.updateInChargePersonView = function() {
    $('#' + this.htmlId + '_inChargePerson_userName').attr("disabled", true);
    if(this.data.inChargePerson != null) {
        $('#' + this.htmlId + '_inChargePerson_userName').val(this.data.inChargePerson.userName);
    } else {
        $('#' + this.htmlId + '_inChargePerson_userName').val("");
    }
}
ProjectCodeBatchCreationForm.prototype.updateInChargePartnerView = function() {
    $('#' + this.htmlId + '_inChargePartner_userName').attr("disabled", true);
    if(this.data.inChargePartner != null) {
        $('#' + this.htmlId + '_inChargePartner_userName').val(this.data.inChargePartner.userName);
    } else {
        $('#' + this.htmlId + '_inChargePartner_userName').val("");
    }
}
ProjectCodeBatchCreationForm.prototype.updatePreviewCodesView = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader">';
    html += '<td>Code</td>';
    html += '<td>Invoice to issue amount</td>';
    html += '<td>Currency</td>';
    html += '<td>Payment currency</td>';
    html += '<td>Date</td>';
    html += '<td>Future</td>';
    html += '<td>Person in charge</td>';
    html += '<td>Partner in charge</td>';
    html += '</tr>';    
    for(var key in this.projectCodeCodes) {
        var projectCodeCode = this.projectCodeCodes[key];
        html += '<tr>';
        html += '<td>' + projectCodeCode + '</td>';
        html += '<td><input type="text" id="' + this.htmlId + '_feesAdvanceAmount_' + key + '"></td>';
        html += '<td><select id="' + this.htmlId + '_feesAdvanceCurrency_' + key + '"></select></td>';
        html += '<td><select id="' + this.htmlId + '_feesPaymentCurrency_' + key + '"></select></td>';
        html += '<td><input type="text" id="' + this.htmlId + '_feesAdvanceDate_' + key + '"></td>';
        html += '<td><input type="checkbox" id="' + this.htmlId + '_isFuture_' + key + '"></td>';
        html += '<td>';
        html += '<input type="text" id="' + this.htmlId + '_specificInChargePerson_' + key + '" disabled>';
        html += '<button id="' + this.htmlId + '_specificInChargePerson_pick_' + key + '">Pick</button><button id="' + this.htmlId + '_specificInChargePerson_clear_' + key + '">Delete</button>';
        html += '</td>';
        html += '<td>';
        html += '<input type="text" id="' + this.htmlId + '_specificInChargePartner_' + key + '" disabled>';
        html += '<button id="' + this.htmlId + '_specificInChargePartner_pick_' + key + '">Pick</button><button id="' + this.htmlId + '_specificInChargePartner_clear_' + key + '">Delete</button>';
        html += '</td>';
        html += '</tr>';
    }
    html += '</table>';
    $('#' + this.htmlId + '_previewCodes').html(html);
    var form = this;
    $('input[id^="' + this.htmlId + '_feesAdvanceAmount_"]').bind("change", function(event) {form.feesAdvanceAmountChangedHandle(event);});
    $('select[id^="' + this.htmlId + '_feesAdvanceCurrency_"]').bind("change", function(event) {form.feesAdvanceCurrencyChangedHandle(event);});
    $('select[id^="' + this.htmlId + '_feesPaymentCurrency_"]').bind("change", function(event) {form.feesPaymentCurrencyChangedHandle(event);});
    $('input[id^="' + this.htmlId + '_feesAdvanceDate_"]').bind("change", function(event) {form.feesAdvanceDateTextChangedHandle(event);});
    $('input[id^="' + this.htmlId + '_isFuture_"]').bind("click", function(event) {form.isFutureChangedHandle(event);});
    $('button[id^="' + this.htmlId + '_specificInChargePerson_pick_"]')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.specificInChargePersonPickHandle.call(form, event);
    });
    
    $('button[id^="' + this.htmlId + '_specificInChargePerson_clear_"]')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.specificInChargePersonClearHandle.call(form, event);
    });
    $('button[id^="' + this.htmlId + '_specificInChargePartner_pick_"]')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.specificInChargePartnerPickHandle.call(form, event);
    });
    
    $('button[id^="' + this.htmlId + '_specificInChargePartner_clear_"]')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.specificInChargePartnerClearHandle.call(form, event);
    });
    this.updateFeesAdvanceAmountView();
    this.updateFeesAdvanceCurrencyView();
    this.updateFeesPaymentCurrencyView();
    this.updateFeesAdvanceDateView();
    this.updateIsFutureView();
    this.updateSpecificInChargePersonView();
    this.updateSpecificInChargePartnerView();
    var form = this;
    $('input[id^="' + this.htmlId + '_feesAdvanceDate_"]').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.feesAdvanceDatePickedHandle(dateText, inst)}
    });
}
ProjectCodeBatchCreationForm.prototype.updateFeesAdvanceAmountView = function() {
    for(var key in this.projectCodeCodes) {
        var projectCodeCode = this.projectCodeCodes[key];
        var amount = this.feesAdvanceAmountItems[projectCodeCode];
        $('#' + this.htmlId + '_feesAdvanceAmount_' + key).val(amount);
    }
}
ProjectCodeBatchCreationForm.prototype.updateFeesAdvanceCurrencyView = function() {
    for(var key1 in this.projectCodeCodes) {
        var projectCodeCode = this.projectCodeCodes[key1];
        var currencyHtml = '';
        currencyHtml += '<option value="" >...</option>';
        for(var key2 in this.loaded.currencies) {
            var currency = this.loaded.currencies[key2];
            var isSelected = "";
            if(currency.id == this.feesAdvanceCurrencyItems[projectCodeCode]) {
                isSelected = "selected";
            }
            currencyHtml += '<option value="' + currency.id + '" ' + isSelected + '>' + currency.code + '</option>';            
        }
        $('#' + this.htmlId + '_feesAdvanceCurrency_' + key1).html(currencyHtml);
    }    
}
ProjectCodeBatchCreationForm.prototype.updateFeesPaymentCurrencyView = function() {
    for(var key1 in this.projectCodeCodes) {
        var projectCodeCode = this.projectCodeCodes[key1];
        var currencyHtml = '';
        currencyHtml += '<option value="" >...</option>';
        for(var key2 in this.loaded.currencies) {
            var currency = this.loaded.currencies[key2];
            var isSelected = "";
            if(currency.id == this.feesPaymentCurrencyItems[projectCodeCode]) {
                isSelected = "selected";
            }
            currencyHtml += '<option value="' + currency.id + '" ' + isSelected + '>' + currency.code + '</option>';            
        }
        $('#' + this.htmlId + '_feesPaymentCurrency_' + key1).html(currencyHtml);
    }    
}
ProjectCodeBatchCreationForm.prototype.updateFeesAdvanceDateView = function() {
    for(var key in this.projectCodeCodes) {
        var projectCodeCode = this.projectCodeCodes[key];
        var date = this.feesAdvanceDateItems[projectCodeCode];
        $('#' + this.htmlId + '_feesAdvanceDate_' + key).val(date);
    }
}

ProjectCodeBatchCreationForm.prototype.updateIsFutureView = function() {
    for(var key in this.projectCodeCodes) {
        var projectCodeCode = this.projectCodeCodes[key];
        var isFuture = this.isFutureItems[projectCodeCode];
        if(isFuture == null) {
            isFuture = false;
        }
        $('#' + this.htmlId + '_isFuture_' + key).attr("checked", isFuture);
    }
}
ProjectCodeBatchCreationForm.prototype.populateInChargePersons = function() {
    if(this.data.inChargePerson == null) {
        return;
    }
    for(var key in this.projectCodeCodes) {
        var projectCodeCode = this.projectCodeCodes[key];
        if(this.inChargePersons[projectCodeCode] == null) {
            this.inChargePersons[projectCodeCode] = this.data.inChargePerson;
        }
    }
}
ProjectCodeBatchCreationForm.prototype.populateInChargePartners = function() {
    if(this.data.inChargePartner == null) {
        return;
    }
    for(var key in this.projectCodeCodes) {
        var projectCodeCode = this.projectCodeCodes[key];
        if(this.inChargePartners[projectCodeCode] == null) {
            this.inChargePartners[projectCodeCode] = this.data.inChargePartner;
        }
    }
}
ProjectCodeBatchCreationForm.prototype.updateSpecificInChargePersonView = function() {
    for(var key in this.projectCodeCodes) {
        var projectCodeCode = this.projectCodeCodes[key];
        var inChargePerson = this.inChargePersons[projectCodeCode];
        var userName = '';
        if(inChargePerson != null) {
            userName = inChargePerson.userName;
        }
        $('#' + this.htmlId + '_specificInChargePerson_' + key).val(userName);
    }
}
ProjectCodeBatchCreationForm.prototype.updateSpecificInChargePartnerView = function() {
    for(var key in this.projectCodeCodes) {
        var projectCodeCode = this.projectCodeCodes[key];
        var inChargePartner = this.inChargePartners[projectCodeCode];
        var userName = '';
        if(inChargePartner != null) {
            userName = inChargePartner.userName;
        }
        $('#' + this.htmlId + '_specificInChargePartner_' + key).val(userName);
    }
}
ProjectCodeBatchCreationForm.prototype.validatePreviewCodes = function() {
    var errors = [];
    if(this.data.activityIds == null || this.data.activityIds.length == 0) {
        errors.push('One or more activities should be picked');
    }
    if(this.data.clientIds == null || this.data.clientIds.length == 0) {
        errors.push('One or more clients should be picked');
    } else {
        for(var key in this.pickedClients) {
            var pickedClient = this.pickedClients[key];
            if(pickedClient.client.codeName == null || pickedClient.client.codeName == '') {
                errors.push('Client Code Name is not good (' + pickedClient.client.name + ')');
            }
        }
    }
    if(this.data.periods == null || this.data.periods.length == 0) {
        errors.push('One or more periods should be picked');
    }
    if(this.data.year == null) {
        errors.push("Year is not set");
    }
    return errors;
}
ProjectCodeBatchCreationForm.prototype.previewCodes = function() {
    this.populateDataWithPickedElements();
    var errors = this.validatePreviewCodes();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
        //this.updatePreviewCodesView();
        this.loadPreviewInfo();
        return;
    }
}
ProjectCodeBatchCreationForm.prototype.loadPreviewInfo = function() {
    var form = this;
    var previewDataForm = {
        "clientIds": this.data.clientIds,
        "activityIds": this.data.activityIds,
        "periods": this.data.periods,
        "year": this.data.year
    };
    var form = this;
    var data = {};
    data.command = "getPreviewInfo";
    data.projectCodeBatchCreationPreviewForm = getJSON(previewDataForm);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.projectCodeDeterminants = result.projectCodeDeterminants;
            form.projectCodeCodes = result.projectCodeCodes;
            form.populateInChargePersons();
            form.populateInChargePartners();
            form.updatePreviewCodesView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });    
}
ProjectCodeBatchCreationForm.prototype.validate = function() {
    var errors = [];
    var float2digitsRE = /^[0-9]*\.?[0-9]{0,2}$/;
    if(this.projectCodeCodes == null || this.projectCodeCodes.length == 0) {
        errors.push('You have to prepare codes. Click "Preview" to generate codes');
        return errors;
    }
    for(var key in this.projectCodeCodes) {
        var projectCodeCode = this.projectCodeCodes[key];
        if(this.inChargePersons[projectCodeCode] == null) {
            errors.push('Person in charge is not set for code ' + projectCodeCode + '.');
        }
        if(this.inChargePartners[projectCodeCode] == null) {
            errors.push('Partner in charge is not set for code ' + projectCodeCode + '.');
        }
        var feesAdvanceAmount = this.feesAdvanceAmountItems[projectCodeCode];
        var feesAdvanceCurrencyId = this.feesAdvanceCurrencyItems[projectCodeCode];
        var feesPaymentCurrencyId = this.feesPaymentCurrencyItems[projectCodeCode];
        var feesAdvanceDate = this.feesAdvanceDateItems[projectCodeCode];
        if(feesAdvanceAmount != null && feesAdvanceAmount != "") {
            if(!float2digitsRE.test(feesAdvanceAmount)) {
                errors.push('Amount for code ' + projectCodeCode + ' has incorrect format.');
            }
            if(feesAdvanceCurrencyId == null) {
                errors.push('Currency is not set for code ' + projectCodeCode + '.');
            }
            if(feesPaymentCurrencyId == null) {
                errors.push('Payment currency is not set for code ' + projectCodeCode + '.');
            }
            if(feesAdvanceDate == null || feesAdvanceDate == "") {
                errors.push('Date is not set for code ' + projectCodeCode + '.');
            }     
        } else if(feesAdvanceCurrencyId != null) {
            if(feesAdvanceAmount == null || feesAdvanceAmount == "") {
                errors.push('Amount is not set for code ' + projectCodeCode + '.');
            }
            if(feesPaymentCurrencyId == null) {
                errors.push('Payment currency is not set for code ' + projectCodeCode + '.');
            }
            if(feesAdvanceDate == null || feesAdvanceDate == "") {
                errors.push('Date is not set for code ' + projectCodeCode + '.');
            }
        } else if(feesPaymentCurrencyId != null) {
            if(feesAdvanceAmount == null || feesAdvanceAmount == "") {
                errors.push('Amount is not set for code ' + projectCodeCode + '.');
            }
            if(feesAdvanceCurrencyId == null) {
                errors.push('Currency is not set for code ' + projectCodeCode + '.');
            }
            if(feesAdvanceDate == null || feesAdvanceDate == "") {
                errors.push('Date is not set for code ' + projectCodeCode + '.');
            }
        } else if(feesAdvanceDate != null) {
            if(! isDateValid(feesAdvanceDate)) {
                errors.push('Date for code ' + projectCodeCode + ' has incorrect format');
            }
            if(feesAdvanceAmount == null || feesAdvanceAmount == "") {
                errors.push('Amount is not set for code ' + projectCodeCode + '.');
            }
            if(feesPaymentCurrencyId == null) {
                errors.push('Payment currency is not set for code ' + projectCodeCode + '.');
            }
            if(feesAdvanceCurrencyId == null) {
                errors.push('Currency is not set for code ' + projectCodeCode + '.');
            }
        }
    }
    if(this.data.year == null) {
        errors.push("Year is not set");
    }
    if(this.data.financialYear == null) {
        errors.push("Financial Year is not set");
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
    return errors;
}
ProjectCodeBatchCreationForm.prototype.save = function() {
    this.populateDataWithPickedElements();
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
        var projectCodeBatchCreationForm = clone(this.data);
        projectCodeBatchCreationForm.inChargePerson = null;
        projectCodeBatchCreationForm.inChargePartner = null;
        
        projectCodeBatchCreationForm.projectCodeCodes = [];
        projectCodeBatchCreationForm.feesAdvanceAmounts = {};
        projectCodeBatchCreationForm.feesAdvanceCurrencyIds = {};
        projectCodeBatchCreationForm.feesPaymentCurrencyIds = {};
        projectCodeBatchCreationForm.feesAdvanceDates = {};
        projectCodeBatchCreationForm.isFutureItems = {};
        projectCodeBatchCreationForm.inChargePersonIds = {};
        projectCodeBatchCreationForm.inChargePartnerIds = {};
        for(var key in this.projectCodeCodes) {
            var projectCodeCode = this.projectCodeCodes[key];
            projectCodeBatchCreationForm.projectCodeCodes[key] = projectCodeCode;
        }
        for(var key in this.projectCodeCodes) {
            var projectCodeCode = this.projectCodeCodes[key];           
            projectCodeBatchCreationForm.feesAdvanceAmounts[projectCodeCode] = this.feesAdvanceAmountItems[projectCodeCode];
        }
        for(var key in this.projectCodeCodes) {
            var projectCodeCode = this.projectCodeCodes[key];           
            projectCodeBatchCreationForm.feesAdvanceCurrencyIds[projectCodeCode] = this.feesAdvanceCurrencyItems[projectCodeCode];
        }
        for(var key in this.projectCodeCodes) {
            var projectCodeCode = this.projectCodeCodes[key];           
            projectCodeBatchCreationForm.feesPaymentCurrencyIds[projectCodeCode] = this.feesPaymentCurrencyItems[projectCodeCode];
        }
        for(var key in this.projectCodeCodes) {
            var projectCodeCode = this.projectCodeCodes[key];            
            projectCodeBatchCreationForm.feesAdvanceDates[projectCodeCode] = getYearMonthDateFromDateString(this.feesAdvanceDateItems[projectCodeCode]);
        }
        for(var key in this.projectCodeCodes) {
            var projectCodeCode = this.projectCodeCodes[key];            
            projectCodeBatchCreationForm.isFutureItems[projectCodeCode] = this.isFutureItems[projectCodeCode];
        }
        for(var key in this.projectCodeCodes) {
            var projectCodeCode = this.projectCodeCodes[key];            
            projectCodeBatchCreationForm.inChargePersonIds[projectCodeCode] = this.inChargePersons[projectCodeCode].id;
        }
        for(var key in this.projectCodeCodes) {
            var projectCodeCode = this.projectCodeCodes[key];            
            projectCodeBatchCreationForm.inChargePartnerIds[projectCodeCode] = this.inChargePartners[projectCodeCode].id;
        }
        var form = this;
        var data = {};
        data.command = "saveProjectCodes";
        data.projectCodeBatchCreationForm = getJSON(projectCodeBatchCreationForm);
        $.ajax({
            url: this.config.endpointUrl,
            data: data,
            cache: false,
            type: "POST",
            success: function(data){
                ajaxResultHandle(data, form, function(result) {
                    doAlert("Info", 'Project Code(s) creation completed. ' + result.count + ' code(s) generated.', form, form.reset);
                    form.dataChanged(false);
                })
            },
            error: function(jqXHR, textStatus, errorThrown) {
                ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
            }
        });
    }
}
ProjectCodeBatchCreationForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}
ProjectCodeBatchCreationForm.prototype.sortPickedActivities = function() {
    this.pickedActivities.sort(function(o1, o2){
        if(o1.path == o2.path) return 0;
        return o1.path > o2.path ? 1: -1;
    }); 
}
ProjectCodeBatchCreationForm.prototype.sortPickedClients = function() {
    this.pickedClients.sort(function(o1, o2){
        if(o1.path == o2.path) return 0;
        return o1.path > o2.path ? 1: -1;
    }); 
}
ProjectCodeBatchCreationForm.prototype.sortPickedPeriods = function() {
    var form = this;
    this.pickedPeriods.sort(function(o1, o2) {
        var typeIndex1 = form.getIndexOfKey(form.periodTypes, o1.type);
        var typeIndex2 = form.getIndexOfKey(form.periodTypes, o2.type);
        if(typeIndex1 > typeIndex2) {
            return 1;
        } else if(typeIndex1 < typeIndex2) {
            return -1;
        }
        var index1 = null;
        var index2 = null;
        if(o1.type == 'QUARTER') {
            index1 = form.getIndexOfKey(form.periodQuarters, o1.quarter);
            index2 = form.getIndexOfKey(form.periodQuarters, o2.quarter);
        } else if(o1.type == 'MONTH') {
            index1 = form.getIndexOfKey(form.periodMonths, o1.month);
            index2 = form.getIndexOfKey(form.periodMonths, o2.month);
        } else if(o1.type == 'DATE') {
            index1 = form.getIndexOfKey(form.periodDates, o1.date);
            index2 = form.getIndexOfKey(form.periodDates, o2.date);
        } else if(o1.type == 'COUNTER') {
            return 1;
        }
        if(index1 == index2) return 0;
        return index1 > index2 ? 1: -1;
    }); 
}
ProjectCodeBatchCreationForm.prototype.populateDataWithPickedElements = function() {
    this.data.clientIds = [];
    this.data.activityIds = [];
    this.data.periods = [];
    for(var key in this.pickedClients) {
        var client = this.pickedClients[key];
        this.data.clientIds.push(client.client.id);
    }
    for(var key in this.pickedActivities) {
        var activity = this.pickedActivities[key];
        this.data.activityIds.push(activity.activity.id);
    }
    for(var key in this.pickedPeriods) {
        var period = this.pickedPeriods[key];
        this.data.periods.push({
            "type": period.type,
            "quarter": period.quarter,
            "month": period.month,
            "date": period.date,
            "counter": period.counter
        });
    }    
}
ProjectCodeBatchCreationForm.prototype.getIndexOfKey = function(a, key) {
    var i = 0;
    for(var key2 in a) {
        if(key2 == key) {
            return i;
        }
        i++;
    }
    return -1;
}

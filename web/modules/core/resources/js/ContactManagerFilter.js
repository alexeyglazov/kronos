/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ContactManagerFilter(filter, callback, callbackContext, htmlId, moduleName) {
    this.config = {
        endpointUrl: endpointsFolder + "ContactManagerFilter.jsp"
    }
    
    this.callback = callback;
    this.callbackContext = callbackContext;
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.moduleName = moduleName;
    this.loaded = {
        'groups' : [],
        'clients' : []
    };
    this.picked = {
        subdepartments: [],
        employees: []
    }
    this.selected = {
        subdepartmentId: null,
        employeeId: null
    }    
    this.statuses = {
        'CREATED': 'Created',
        'MODIFIED':  'Modified',
        'SET_ACTIVE': 'Set active',
        'SET_INACTIVE': 'Set inactive',
        'CONFIRMED': 'Confirmed'
    }
    this.data = this.getDefaultFilter();
    this.clientFilter = null;
    if(filter != null) {
        this.data = filter;
    }
}
ContactManagerFilter.prototype.isFilterUsed = function(filter) {
    if(filter.name != null && filter.name != '') {
        return true;
    }
    if(filter.emails != null && filter.emails.length > 0) {
        return true;
    }
    if(filter.employeeIds != null && filter.employeeIds.length > 0) {
        return true;
    }
    //if(filter.isEmployeeInChargePerson != null) {
    //    return true;
    //}
    //if(filter.isEmployeeResponsiblePerson != null) {
    //    return true;
    //}
    if(filter.subdepartmentIds != null && filter.subdepartmentIds.length > 0) {
        return true;
    }
    //if(filter.isSubdepartmentOfProjectCode != null) {
    //    return true;
    //}
    //if(filter.isSubdepartmentOfResponsiblePerson != null) {
    //    return true;
    //}
    if(filter.groupId != null) {
        return true;
    }
    if(filter.clientId != null) {
        return true;
    }
    if(filter.isActive != null) {
        return true;
    }
    if(filter.isNewsletters != null) {
        return true;
    }
    if(filter.isReminder != null) {
        return true;
    }
    if(filter.presentType != null) {
        return true;
    }
    if(filter.contactHistoryItemPresent != null) {
        return true;
    }
    if(filter.contactHistoryItemStatus != null) {
        return true;
    }
    if(filter.contactHistoryItemRange != null && (filter.contactHistoryItemRange.from != null || filter.contactHistoryItemRange.to != null)) {
        return true;
    }
    return false;
}
ContactManagerFilter.prototype.getDefaultFilter  = function() {
    return {
        "name": '',
        "emails": [],
        "employeeIds": [],
        "isEmployeeInChargePerson": true,
        "isEmployeeResponsiblePerson": true,
        "subdepartmentIds": [],
        "isSubdepartmentOfProjectCode": true,
        "isSubdepartmentOfResponsiblePerson": true,
        "groupId": null,
        "clientId": null,
        "isActive": 'TRUE',
        "isNewsletters": null,
        "isReminder": null,
        "presentType": null,
        "contactHistoryItemPresent": null,
        "contactHistoryItemStatus": null,
        "contactHistoryItemRange": {
            "from": null,
            "to": null
        }
    }    
}
ContactManagerFilter.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
}
ContactManagerFilter.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.contactManagerFilterForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.groups = result.groups;
            form.loaded.clients = result.clients;
            form.picked.employees = result.employees;
            form.picked.subdepartments = result.subdepartments;
            form.show();
            
            form.stateChangedHandle();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ContactManagerFilter.prototype.loadGroupContent = function() {
    var form = this;
    var data = {};
    data.command = "getGroupContent";
    if(this.data.groupId != null) {
        data.groupId = this.data.groupId;
    }
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.data.clientId = null;
            form.loaded.clients = result.clients;
            form.updateClientView();
            
            form.stateChangedHandle();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ContactManagerFilter.prototype.show = function() {
    var title = 'Filter data'
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    $( '#' + this.htmlId + '_accordion').accordion({
        collapsible: true,
      heightStyle: "content"
    });    
    this.setHandlers();
    this.makeDatePickers();    
    this.makeButtons();
    this.updateView();    
    
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 700,
        height: 400,
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
}
ContactManagerFilter.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td>';
    html += '<button id="' + this.htmlId + '_reset">Reset all</button>';
    html += '</td></tr>';
    html += '</table>';
    
    html += '<div id="' + this.htmlId + '_accordion' + '">';
    
    html += '<h3>Contact properties</h3>';
    html += '<div>';
    
    html += '<table>';
    html += '<tr><td><span class="label1">Name</span></td><td><span class="label1">E-mails</span></td></tr>';
    html += '<tr><td style="vertical-align: top;"><input type="text" id="' + this.htmlId + '_name' + '"><br /><span class="comment1">Use the asterisk (*) wildcard character to search</span></td><td><textarea id="' + this.htmlId + '_emails' + '" style="width: 300px; height: 100px;"></textarea></td></tr>';
    html += '</table>';
    
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Active</span></td>';
    html += '<td><span class="label1">Newsletters</span></td>';
    html += '<td><span class="label1">Reminder</span></td>';
    html += '<td><span class="label1">Present type</span></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><select id="' + this.htmlId + '_isActive' + '"></select></td>';
    html += '<td><select id="' + this.htmlId + '_isNewsletters' + '"></select></td>';
    html += '<td><select id="' + this.htmlId + '_isReminder' + '"></select></td>';
    html += '<td><select id="' + this.htmlId + '_presentType' + '"></select></td>';
    html += '</tr>';
    html += '</table>';
    
    html += '</div>';
    
    html += '<h3>Client</h3>';
    html += '<div>';
    
    html += '<table>';
    html += '<tr><td><span class="label1">Group</span></td></tr>';
    html += '<tr><td><select id="' + this.htmlId + '_group' + '"></select></td></tr>';
    html += '<tr><td><span class="label1">Client</span> <input type="text" style="width: 50px;" id="' + this.htmlId + '_clientFilter' + '"></td></tr>';
    html += '<tr><td><select id="' + this.htmlId + '_client' + '"></select></td></tr>';
    html += '</table>';
    
    html += '</div>';
    
    html += '<h3>Subdepartments</h3>';
    html += '<div>';
    
    html += '<div class="comment1">Here you can filter contacts by subdepartments of client\'s projects and by subdepartments of personal contacts.</div>';
    html += '<table>';
    html += '<tr>';
    html += '<td>';
    html += '<div class="selector" style="width: 300px; height: 80px;" id="' + this.htmlId + '_subdepartments' + '"></div>';
    html += '<button id="' + this.htmlId + '_subdepartment_pick">Pick</button><button id="' + this.htmlId + '_subdepartment_delete">Delete</button>';
    html += '</td>';
    html += '<td style="vertical-align: top;">';
        html += '<table>';
        html += '<tr><td>of project code</td><td><input type="checkbox" id="' + this.htmlId + '_isSubdepartmentOfProjectCode"></td></tr>';
        html += '<tr><td>of personal contact</td><td><input type="checkbox" id="' + this.htmlId + '_isSubdepartmentOfResponsiblePerson"></td></tr>';
        html += '</table>';
    html += '</td>';
    html += '</tr>';
    html += '</table>';

    html += '</div>';    
    html += '<h3>Employees</h3>';
    html += '<div>';
    
    html += '<div class="comment1">Here you can filter contacts by persons in charge of client\'s projects and by personal contacts.</div>';
    html += '<table>';
    html += '<tr>';
    html += '<td>';
    html += '<div class="selector" style="width: 300px; height: 80px;" id="' + this.htmlId + '_employees' + '"></div>';
    html += '<button id="' + this.htmlId + '_employee_pick">Pick</button><button id="' + this.htmlId + '_employee_delete">Delete</button>';
    html += '</td>';
    html += '<td style="vertical-align: top;">';
        html += '<table>';
        html += '<tr><td>as person in charge</td><td><input type="checkbox" id="' + this.htmlId + '_isEmployeeInChargePerson"></td></tr>';
        html += '<tr><td>as personal contact</td><td><input type="checkbox" id="' + this.htmlId + '_isEmployeeResponsiblePerson"></td></tr>';
        html += '</table>';
    html += '</td>';
    html += '</tr>';
    html += '</table>';

    html += '</div>';
    
    html += '<h3>Other</h3>';
    html += '<div>';
    
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Event in history</span></td>';
    html += '<td><span class="label1">Event registered</span></td>';
    html += '<td><span class="label1">At the period</span></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><select id="' + this.htmlId + '_contactHistoryItemStatus' + '"></select></td>';
    html += '<td><select id="' + this.htmlId + '_contactHistoryItemPresent' + '"></select></td>';
    html += '<td><input id="' + this.htmlId + '_contactHistoryItemRange_from' + '">-<input id="' + this.htmlId + '_contactHistoryItemRange_to' + '"></td>';
    html += '</tr>';
    html += '</table>';
    
    html += '</div>';    
    html += '</div>';
    return html;
}
ContactManagerFilter.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_name').bind("change", function(event) {form.nameChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_emails').bind('change', function(event) {form.emailsChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_group').bind("change", function(event) {form.groupChangedHandle.call(form)});
    $('#' + this.htmlId + '_client').bind("change", function(event) {form.clientChangedHandle.call(form)});
    $('#' + this.htmlId + '_clientFilter').bind("change", function(event) {form.clientFilterChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isActive').bind("change", function(event) {form.isActiveChangedHandle.call(form)});
    $('#' + this.htmlId + '_isNewsletters').bind("change", function(event) {form.isNewslettersChangedHandle.call(form)});
    $('#' + this.htmlId + '_isReminder').bind("change", function(event) {form.isReminderChangedHandle.call(form)});
    $('#' + this.htmlId + '_presentType').bind("change", function(event) {form.presentTypeChangedHandle.call(form)});
    $('#' + this.htmlId + '_contactHistoryItemPresent').bind("change", function(event) {form.contactHistoryItemPresentChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_contactHistoryItemStatus').bind("change", function(event) {form.contactHistoryItemStatusChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_contactHistoryItemRange_from').bind("change", function(event) {form.contactHistoryItemRangeFromChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_contactHistoryItemRange_to').bind("change", function(event) {form.contactHistoryItemRangeToChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_isEmployeeInChargePerson').bind("click", function(event) {form.isEmployeeInChargePersonClickedHandle.call(form, event)});
    $('#' + this.htmlId + '_isEmployeeResponsiblePerson').bind("click", function(event) {form.isEmployeeResponsiblePersonClickedHandle.call(form, event)});
    $('#' + this.htmlId + '_isSubdepartmentOfProjectCode').bind("click", function(event) {form.isSubdepartmentOfProjectCodeClickedHandle.call(form, event)});
    $('#' + this.htmlId + '_isSubdepartmentOfResponsiblePerson').bind("click", function(event) {form.isSubdepartmentOfResponsiblePersonClickedHandle.call(form, event)});
}
ContactManagerFilter.prototype.makeDatePickers = function() {
    var form = this;
    $('#' + this.htmlId + '_contactHistoryItemRange_from').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.contactHistoryItemRangeFromSelectHandle(dateText, inst)}
    });
    $( '#' + this.htmlId + '_contactHistoryItemRange_to').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.contactHistoryItemRangeToSelectHandle(dateText, inst)}
    });
}
ContactManagerFilter.prototype.makeButtons = function() {
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
    
    $('#' + this.htmlId + '_employee_pick')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.employeePickHandle.call(form);
    });

    $('#' + this.htmlId + '_employee_delete')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.employeeDeleteHandle.call(form);
    });    

    $('#' + this.htmlId + '_subdepartment_pick')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.subdepartmentPickHandle.call(form);
    });

    $('#' + this.htmlId + '_subdepartment_delete')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.subdepartmentDeleteHandle.call(form);
    });    
}
ContactManagerFilter.prototype.reset = function(event) {
    this.data = this.getDefaultFilter();
    this.data.isActive = null;
    this.clientFilter = null;
    this.loadInitialContent();
}
ContactManagerFilter.prototype.nameChangedHandle = function(event) {
    this.data.name = jQuery.trim(event.currentTarget.value);
    this.updateNameView();
    this.stateChangedHandle();
}
ContactManagerFilter.prototype.emailsChangedHandle = function() {
    var emailsStr = jQuery.trim($('#' + this.htmlId + '_emails').val());
    var tmpEmails = emailsStr.split(/(\n|\s|,|;)/);
    var emails = [];
    var emailRE = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    for(var key in tmpEmails) {
        var tmpEmail = tmpEmails[key];
        if(tmpEmail != '' && emailRE.test(tmpEmail)) {
            if(jQuery.inArray(tmpEmail, emails) == -1) {
                emails.push(tmpEmail);
            }
        }
    }
    this.data.emails = emails;
    this.updateEmailsView();
}
ContactManagerFilter.prototype.employeePickHandle = function() {
    this.employeePicker = new EmployeePicker("employeePicker", this.employeePicked, this, this.moduleName);
    this.employeePicker.init();
}
ContactManagerFilter.prototype.employeePicked = function(pickedEmployee) {
    var exists = false;
    for(var key in this.picked.employees) {
        var employee = this.picked.employees[key];
        if(pickedEmployee.id == employee.id) {
            exists = true;
            break;
        }
    }
    if(! exists) {
        this.picked.employees.push(pickedEmployee);
    }
    this.data.employeeIds = [];
    for(var key in this.picked.employees) {
        this.data.employeeIds.push(this.picked.employees[key].id);
    }
    this.updateEmployeesView();
    
    this.stateChangedHandle();
}
ContactManagerFilter.prototype.employeeDeleteHandle = function() {
    if(this.selected.employeeId == null) {
        doAlert('Alert', 'Employee is not selected', null, null);
        return;
    }
    var index = null;
    for(var key in this.picked.employees) {
        if(this.picked.employees[key].id == this.selected.employeeId) {
            index = key;
            break;
        }
    }
    if(index != null) {
        this.picked.employees.splice(index, 1);
        this.selected.employeeId = null;
        this.updateEmployeesView();
    }
    this.data.employeeIds = [];
    for(var key in this.picked.employees) {
        this.data.employeeIds.push(this.picked.employees[key].id);
    }    
    this.stateChangedHandle();    
}
ContactManagerFilter.prototype.employeeClickedHandle = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    this.selected.employeeId = parseInt(tmp[tmp.length - 1]);
    this.updateEmployeesView();
}
ContactManagerFilter.prototype.isSubdepartmentOfProjectCodeClickedHandle = function(event) {
    var value = $(event.currentTarget).is(":checked");
    if(this.data.isSubdepartmentOfResponsiblePerson) {
        this.data.isSubdepartmentOfProjectCode = value;
    } else {
        this.data.isSubdepartmentOfProjectCode = true;
    }
    this.updateIsSubdepartmentOfProjectCodeView();
    this.stateChangedHandle();
}
ContactManagerFilter.prototype.isSubdepartmentOfResponsiblePersonClickedHandle = function(event) {
    var value = $(event.currentTarget).is(":checked");
    if(this.data.isSubdepartmentOfProjectCode) {
        this.data.isSubdepartmentOfResponsiblePerson = value;
    } else {
        this.data.isSubdepartmentOfResponsiblePerson = true;
    }
    this.updateIsSubdepartmentOfResponsiblePersonView();
    this.stateChangedHandle();
}

ContactManagerFilter.prototype.subdepartmentPickHandle = function() {
    this.subdepartmentPicker = new SubdepartmentPicker("subdepartmentPicker", this.subdepartmentPicked, this, this.moduleName);
    this.subdepartmentPicker.init();
}
ContactManagerFilter.prototype.subdepartmentPicked = function(pickedSubdepartment) {
    var exists = false;
    for(var key in this.picked.subdepartments) {
        var subdepartment = this.picked.subdepartments[key];
        if(pickedSubdepartment.id == subdepartment.id) {
            exists = true;
            break;
        }
    }
    if(! exists) {
        this.picked.subdepartments.push(pickedSubdepartment);
    }
    this.data.subdepartmentIds = [];
    for(var key in this.picked.subdepartments) {
        this.data.subdepartmentIds.push(this.picked.subdepartments[key].id);
    }
    this.updateSubdepartmentsView();
    
    this.stateChangedHandle();
}
ContactManagerFilter.prototype.subdepartmentDeleteHandle = function() {
    if(this.selected.subdepartmentId == null) {
        doAlert('Alert', 'Subdepartment is not selected', null, null);
        return;
    }
    var index = null;
    for(var key in this.picked.subdepartments) {
        if(this.picked.subdepartments[key].id == this.selected.subdepartmentId) {
            index = key;
            break;
        }
    }
    if(index != null) {
        this.picked.subdepartments.splice(index, 1);
        this.selected.subdepartmentId = null;
        this.updateSubdepartmentsView();
    }
    this.data.subdepartmentIds = [];
    for(var key in this.picked.subdepartments) {
        this.data.subdepartmentIds.push(this.picked.subdepartments[key].id);
    }    
    this.stateChangedHandle();    
}
ContactManagerFilter.prototype.subdepartmentClickedHandle = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    this.selected.subdepartmentId = parseInt(tmp[tmp.length - 1]);
    this.updateSubdepartmentsView();
}


ContactManagerFilter.prototype.isEmployeeInChargePersonClickedHandle = function(event) {
    var value = $(event.currentTarget).is(":checked");
    if(this.data.isEmployeeResponsiblePerson) {
        this.data.isEmployeeInChargePerson = value;
    } else {
        this.data.isEmployeeInChargePerson = true;
    }
    this.updateIsEmployeeInChargePersonView();
    this.stateChangedHandle();
}
ContactManagerFilter.prototype.isEmployeeResponsiblePersonClickedHandle = function(event) {
    var value = $(event.currentTarget).is(":checked");
    if(this.data.isEmployeeInChargePerson) {
        this.data.isEmployeeResponsiblePerson = value;
    } else {
        this.data.isEmployeeResponsiblePerson = true;
    }
    this.updateIsEmployeeResponsiblePersonView();
    this.stateChangedHandle();
}

ContactManagerFilter.prototype.groupChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_group').val();
    if(idTxt == '') {
        this.data.groupId = null;
    } else {
        this.data.groupId = parseInt(idTxt);
    }
    this.loadGroupContent();
}
ContactManagerFilter.prototype.clientChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_client').val();
    if(idTxt == '') {
        this.data.clientId = null;
    } else {
        this.data.clientId = parseInt(idTxt);
    }
    this.stateChangedHandle();
}
ContactManagerFilter.prototype.clientFilterChangedHandle = function(event) {
    var value = $('#' + this.htmlId + '_clientFilter').val();
    value = $.trim(value);
    if(value != this.clientFilter) {
        this.clientFilter = value;
        this.data.clientId = null;
        this.updateClientView();
    }
    this.updateClientFilterView();
}
ContactManagerFilter.prototype.isActiveChangedHandle = function() {
    this.data.isActive = $('#' + this.htmlId + '_isActive').val();
    if(this.data.isActive == '') {
        this.data.isActive = null;
    }
    this.updateIsActiveView();
    this.stateChangedHandle();
}
ContactManagerFilter.prototype.isNewslettersChangedHandle = function() {
    this.data.isNewsletters = $('#' + this.htmlId + '_isNewsletters').val();
    if(this.data.isNewsletters == '') {
        this.data.isNewsletters = null;
    }    
    this.updateIsNewslettersView();
    this.stateChangedHandle();
}
ContactManagerFilter.prototype.isReminderChangedHandle = function() {
    this.data.isReminder = $('#' + this.htmlId + '_isReminder').val();
    if(this.data.isReminder == '') {
        this.data.isReminder = null;
    }    
    this.updateIsReminderView();
    this.stateChangedHandle();
}
ContactManagerFilter.prototype.presentTypeChangedHandle = function() {
    this.data.presentType = $('#' + this.htmlId + '_presentType').val();
    if(this.data.presentType == '') {
        this.data.presentType = null;
    }
    this.updatePresentTypeView();
    this.stateChangedHandle();
}
ContactManagerFilter.prototype.contactHistoryItemPresentChangedHandle = function() {
    var valTxt = $('#' + this.htmlId + '_contactHistoryItemPresent').val();
    if(valTxt == '') {
        this.data.contactHistoryItemPresent = null;
    } else {
        this.data.contactHistoryItemPresent = valTxt;
    }
    this.updateContactHistoryItemPresentView();
    this.stateChangedHandle();
}
ContactManagerFilter.prototype.contactHistoryItemStatusChangedHandle = function() {
    var valTxt = $('#' + this.htmlId + '_contactHistoryItemStatus').val();
    if(valTxt == '') {
        this.data.contactHistoryItemStatus = null;
    } else {
        this.data.contactHistoryItemStatus = valTxt;
    }
    this.updateContactHistoryItemStatusView();
    this.stateChangedHandle();
}
ContactManagerFilter.prototype.contactHistoryItemRangeFromSelectHandle = function(dateText, inst) {
    if(dateText != null && jQuery.trim(dateText) != "") {
        this.data.contactHistoryItemRange.from = getYearMonthDateFromDateString(jQuery.trim(dateText));
    } else {
        this.data.contactHistoryItemRange.from = null;
    }
    this.updateContactHistoryItemRangeView();
    this.stateChangedHandle();
}
ContactManagerFilter.prototype.contactHistoryItemRangeFromChangedHandle = function(event) {
    var dateText = $(event.currentTarget).val();
    if(dateText.trim() != "") {
        this.data.contactHistoryItemRange.from = getYearMonthDateFromDateString(dateText);
    } else {
        this.data.contactHistoryItemRange.from = null;
    }
    this.updateContactHistoryItemRangeView();
    this.stateChangedHandle();
}
ContactManagerFilter.prototype.contactHistoryItemRangeToSelectHandle = function(dateText, inst) {
    if(dateText != null && jQuery.trim(dateText) != "") {
        this.data.contactHistoryItemRange.to = getYearMonthDateFromDateString(jQuery.trim(dateText));
    } else {
        this.data.contactHistoryItemRange.to = null;
    }
    this.updateContactHistoryItemRangeView();
    this.stateChangedHandle();    
}
ContactManagerFilter.prototype.contactHistoryItemRangeToChangedHandle = function(event) {
    var dateText = $(event.currentTarget).val();
    if(dateText.trim() != "") {
        this.data.contactHistoryItemRange.to = getYearMonthDateFromDateString(dateText);
    } else {
        this.data.contactHistoryItemRange.to = null;
    }
    this.updateContactHistoryItemRangeView();
    this.stateChangedHandle();    
}
ContactManagerFilter.prototype.stateChangedHandle = function() {
    //this.stateChangedHandler.call(this.stateChangedHandlerContext, this.data);
}
ContactManagerFilter.prototype.okHandle = function() {
    this.callback.call(this.callbackContext, this.data);
}
ContactManagerFilter.prototype.updateView = function() {
    this.updateNameView();
    this.updateEmailsView();
    this.updateEmployeesView();
    this.updateIsEmployeeInChargePersonView();
    this.updateIsEmployeeResponsiblePersonView();
    this.updateSubdepartmentsView();
    this.updateIsSubdepartmentOfProjectCodeView();
    this.updateIsSubdepartmentOfResponsiblePersonView();
    this.updateGroupView();
    this.updateClientFilterView();
    this.updateClientView();
    this.updateIsActiveView();
    this.updateIsNewslettersView();
    this.updateIsReminderView();
    this.updatePresentTypeView();
    this.updateContactHistoryItemPresentView();
    this.updateContactHistoryItemStatusView();
    this.updateContactHistoryItemRangeView();
}
ContactManagerFilter.prototype.updateNameView = function(event) {
    $('#' + this.htmlId + '_name').val(this.data.name);
}    
ContactManagerFilter.prototype.updateEmailsView = function() {
    var html = '';
    for(var key in this.data.emails) {
        var email = this.data.emails[key];
        html += email + '\n';
    }
    $('#' + this.htmlId + '_emails').val(html);      
}
ContactManagerFilter.prototype.updateEmployeesView = function() {
    var html = '';
    for(var key in this.picked.employees) {
        var employee = this.picked.employees[key];
        var classSelected = "";
        if(employee.id == this.selected.employeeId) {
           classSelected = 'class="selected"';
        }
        html += '<div id="' + this.htmlId + '_employee_' + employee.id + '" ' + classSelected + '>' + employee.firstName + ' ' + employee.lastName + '</div>';
    }
    $('#' + this.htmlId + '_employees').html(html);
    var form = this;
    $('div[id^="' + this.htmlId + '_employee_"]').bind("click", function(event) {form.employeeClickedHandle(event);});
}
ContactManagerFilter.prototype.updateIsEmployeeInChargePersonView = function() {
    $('#' + this.htmlId + '_isEmployeeInChargePerson').prop("checked", this.data.isEmployeeInChargePerson);    
}
ContactManagerFilter.prototype.updateIsEmployeeResponsiblePersonView = function() {
    $('#' + this.htmlId + '_isEmployeeResponsiblePerson').prop("checked", this.data.isEmployeeResponsiblePerson);        
}

ContactManagerFilter.prototype.updateSubdepartmentsView = function() {
    var html = '';
    for(var key in this.picked.subdepartments) {
        var subdepartment = this.picked.subdepartments[key];
        var classSelected = "";
        if(subdepartment.id == this.selected.subdepartmentId) {
           classSelected = 'class="selected"';
        }
        html += '<div id="' + this.htmlId + '_subdepartment_' + subdepartment.id + '" ' + classSelected + '>' + subdepartment.name + '</div>';
    }
    $('#' + this.htmlId + '_subdepartments').html(html);
    var form = this;
    $('div[id^="' + this.htmlId + '_subdepartment_"]').bind("click", function(event) {form.subdepartmentClickedHandle(event);});
}

ContactManagerFilter.prototype.updateIsSubdepartmentOfProjectCodeView = function() {
    $('#' + this.htmlId + '_isSubdepartmentOfProjectCode').prop("checked", this.data.isSubdepartmentOfProjectCode);    
}
ContactManagerFilter.prototype.updateIsSubdepartmentOfResponsiblePersonView = function() {
    $('#' + this.htmlId + '_isSubdepartmentOfResponsiblePerson').prop("checked", this.data.isSubdepartmentOfResponsiblePerson);        
}

ContactManagerFilter.prototype.updateGroupView = function() {
   var html = "";
   html += '<option value="">...</option>';
    for(var key in this.loaded.groups) {
        var group = this.loaded.groups[key];
        var isSelected = '';
        if(group.id == this.data.groupId) {
            isSelected = 'selected';
        }
        html += '<option value="' + group.id + '" ' + isSelected + '>' + group.name + '</option>';
    }
    $('#' + this.htmlId + '_group').html(html);
}
ContactManagerFilter.prototype.updateClientFilterView = function() {
    $('#' + this.htmlId + '_clientFilter').val(this.clientFilter);
}
ContactManagerFilter.prototype.updateClientView = function() {
    var html = "";
    var filter = null;
    if(this.clientFilter != null && this.clientFilter != '') {
        filter = this.clientFilter.toLowerCase();
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
        var isSelected = '';
        if(client.id == this.data.clientId) {
            isSelected = 'selected';
        }
        html += '<option value="' + client.id + '" ' + isSelected + '>' + client.name + '</option>';
    }
    $('#' + this.htmlId + '_client').html(html);
}
ContactManagerFilter.prototype.updateIsActiveView = function() {
    var options = {"": "...", "TRUE": "Yes", "FALSE": "No"}
    this.updateSelectorView(this.htmlId + '_isActive', this.data.isActive, options);
}
ContactManagerFilter.prototype.updateIsNewslettersView = function() {
    var options = {"": "...", "TRUE": "Yes", "FALSE": "No"}
    this.updateSelectorView(this.htmlId + '_isNewsletters', this.data.isNewsletters, options);
}
ContactManagerFilter.prototype.updateIsReminderView = function() {
    var options = {"": "...", "TRUE": "Yes", "FALSE": "No"}
    this.updateSelectorView(this.htmlId + '_isReminder', this.data.isReminder, options);
}
ContactManagerFilter.prototype.updatePresentTypeView = function() {
    var options = {"": "...", "VIP": "VIP", "STANDARD": "Standard", "CARD": "Card", "NO": "No"};
    this.updateSelectorView(this.htmlId + '_presentType', this.data.presentType, options);
}
ContactManagerFilter.prototype.updateContactHistoryItemPresentView = function() {
    var options = {"": "...", "TRUE": "Yes", "FALSE": "No"}
    this.updateSelectorView(this.htmlId + '_contactHistoryItemPresent', this.data.contactHistoryItemPresent, options);
}
ContactManagerFilter.prototype.updateContactHistoryItemStatusView = function() {
    var options = {"": "..."};
    for(var key in this.statuses) {
        options[key] = this.statuses[key];
    }
    this.updateSelectorView(this.htmlId + '_contactHistoryItemStatus', this.data.contactHistoryItemStatus, options);
}
ContactManagerFilter.prototype.updateContactHistoryItemRangeView = function() {
    $('#' + this.htmlId + '_contactHistoryItemRange_from').val(getStringFromYearMonthDate(this.data.contactHistoryItemRange.from));
    $('#' + this.htmlId + '_contactHistoryItemRange_to').val(getStringFromYearMonthDate(this.data.contactHistoryItemRange.to));
}
ContactManagerFilter.prototype.updateSelectorView = function(id, value, options) {
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

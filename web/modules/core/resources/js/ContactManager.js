/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ContactManager(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "ContactManager.jsp"
    }
    this.contactManagerFilter = null;
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.moduleName = 'Clients';
    this.filterData = ContactManagerFilter.prototype.getDefaultFilter();;
    this.filter = null;
    this.loaded = {
        'contactClientLinks' : [],
        'contacts' : [],
        'employeeContactLinks': [],
        'inChargePersons': []
    };
    this.data = {
        "contactIds": []
    }
    this.displayFields = this.getDefaultDisplayFields();
    this.possibleFields = {
        gender: "Gender",
        name: "Name",
        localName: "Local name",
        client: "Client",
        group: "Group",
        classifiedPosition: "Classified position",
        directPhone: "Direct phone",
        mobilePhone: "Mobile phone",
        email: "Email",
        language: "Language",
        residencialCountry: "Residencial country",
        isClientsAddressUsed: "Clients address used",
        street: "Street",
        zipCode: "ZIP code",
        city: "City",
        country: "Country",
        presentType: "Present type",
        isNewsletters: "Newsletters",
        isReminder: "Reminder mailing",
        isActive: "Active",
        comment: "Comment"
    }
    this.batch = {
        "action": null,
        "contactIds": []
    };    
}
ContactManager.prototype.init = function() {
    contentSizeChangedEventSubscribers.push({"context": this, "function": this.normalizeContentSize});
    this.loadInitialContent();
}
ContactManager.prototype.getDefaultDisplayFields = function() {
    return {
        gender: false,
        name: true,
        localName: true,
        client: true,
        group: false,
        classifiedPosition: true,
        directPhone: false,
        mobilePhone: false,
        email: false,
        language: false,
        residencialCountry: false,
        isClientsAddressUsed: false,
        street: false,
        zipCode: false,
        city: false,
        country: false,
        comment: false
    }
}
ContactManager.prototype.filterChangedHandler = function(filterData) {
    this.data = {
        "contactIds": []
    }
    this.filterData = clone(filterData);
    if(this.filterData.contactHistoryItemPresent == null) {
        this.filterData.contactHistoryItemStatus = null;
    }
    if(this.filterData.contactHistoryItemStatus == null) {
        this.filterData.contactHistoryItemRange.from = null;
        this.filterData.contactHistoryItemRange.to = null;        
    }
    
    if(this.filterData.contactHistoryItemPresent != null && this.filterData.contactHistoryItemStatus == null) {
        this.loaded.contacts = [];
        var html = 'Please select event when you work with history filter';
        $('#' + this.htmlId + '_contacts').html(html);
        //this.updateContactsView();
    } else {
        var html = 'In progress...';
        $('#' + this.htmlId + '_contacts').html(html);
        this.loadContactInfo();
    }
}
ContactManager.prototype.acceptDisplayFieldsFilterData = function(displayFields) {
    this.displayFields = displayFields;
    this.updateContactsView();
}
ContactManager.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.contactManagerFilterForm = getJSON(this.filterData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.countries = result.countries;
            form.loaded.languages = result.languages;
            form.loaded.contacts = result.contacts;
            form.show();
            form.normalizeContentSize();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ContactManager.prototype.loadContactInfo = function() {
    var form = this; 
    var data = {};
    data.command = "getContactInfo";
    data.contactManagerFilterForm = getJSON(this.filterData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.contacts = result.contacts;
            form.updatePanelView();
            form.updateContactsView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ContactManager.prototype.doBatchUpdate = function(event) {
    this.batch.contactIds = this.data.contactIds;
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
            doAlert("Info", 'Batch update has been successfully performed', form, form.loadContactInfo);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ContactManager.prototype.loadContactDetails = function() {
  if(this.data.contactIds.length != 1) {
      doAlert('Alert', 'Please select one contact', null, null);
      return;
  }
  var id = this.data.contactIds[0];
  var form = this;
    var data = {};
    data.command = "getContact";
    data.contactId = id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.contact = result.contact;
            form.loaded.contactClientLinks = result.contactClientLinks;
            form.loaded.employeeContactLinks = result.employeeContactLinks;
            form.loaded.inChargePersons = result.inChargePersons;
            form.updateContactView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ContactManager.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.setHandlers();
}
ContactManager.prototype.getHtml = function() {
    var html = '';
    html += '<div id="' + this.htmlId + '_panel"></div><br />';
    html += '<table><tr>';
    html += '<td>';
    html += '<div id="' + this.htmlId + '_contacts" style="overflow: auto;"></div>';
    html += '</td>';
    html += '<td>';
    html += '<div id="' + this.htmlId + '_info" style="overflow: auto;"></div>';
    html += '</td>';
    html += '</tr></table>';
    return html;
}
ContactManager.prototype.setHandlers = function() {
    var form = this;
    //$('#' + this.htmlId + '_client').bind("change", function(event) {form.clientChangedHandle.call(form)});
}

ContactManager.prototype.contactClickedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    this.data.contactIds = [];
    this.data.contactIds.push(id);
    this.selectionChangedHandle();
    this.updateContactsSelection();
}
ContactManager.prototype.contactSelectorClickedHandle = function(event) {
    this.data.contactIds = [];
    for(var key in this.loaded.contacts) {
        var contact = this.loaded.contacts[key];
        if( $('#' + this.htmlId + '_contactSelect_' + contact.id).is(':checked') ) {
            this.data.contactIds.push(contact.id);
        }
    }
    this.selectionChangedHandle();
}
ContactManager.prototype.selectAll = function(event) {
    if(this.data.contactIds.length == 0) {
        this.data.contactIds = [];
        for(var key in this.loaded.contacts) {
            var contact = this.loaded.contacts[key];
            this.data.contactIds.push(contact.id);
        }
    } else {
        this.data.contactIds = [];
    }
    this.selectionChangedHandle();
}
ContactManager.prototype.selectionChangedHandle = function() {
    this.updatePanelView();    
    this.updateContactsSelection();
    this.clearInfo();
    if(this.data.contactIds.length == 1) {
        this.loadContactDetails();
    } else {
        
    }
}
ContactManager.prototype.updateView = function() {
   this.updatePanelView();
   this.updateContactsView();
}
ContactManager.prototype.clearInfo = function() {
    $('#' + this.htmlId + '_info').html('');
}
ContactManager.prototype.updatePanelView = function() {
    var html = '';
    html += '<table><tr>';
    html += '<td id="' + this.htmlId + '_filterCell"><button id="' + this.htmlId + '_filterBtn' + '">Filter</button></td>';
    html += '<td><button id="' + this.htmlId + '_displayBtn' + '">Display</button></td>';
    html += '<td><button id="' + this.htmlId + '_addContactBtn' + '">Add</button></td>';
    html += '<td><button id="' + this.htmlId + '_exportBtn' + '">Export</button></td>';
    if(this.data.contactIds.length == 1) {
        html += '<td><button id="' + this.htmlId + '_contactConfirmBtn' + '">Confirm</button></td>';
        html += '<td><button id="' + this.htmlId + '_contactHistoryBtn' + '">History</button></td>';
        html += '<td><button id="' + this.htmlId + '_contactUpdateBtn' + '">Edit</button></td>';
        html += '<td><button id="' + this.htmlId + '_contactSetInactiveBtn' + '">Set inactive</button></td>';
    }
    if(this.data.contactIds.length > 0) {
        html += '<td><select id="' + this.htmlId + '_batch_action" title="Batch_action"></select></td>';
        html += '<td><button  id="' + this.htmlId + '_batch" title="Update data">Update</button> </td>'; 
    }
    html += '</tr></table>';
    html += '<form id="' + this.htmlId + '_xlsForm' + '" target="_blank" action="' + this.config.endpointUrl + '" method="post">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_command' + '" name="command" value="">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="contactManagerFilterForm" value="">';
    html += '</form>';

    $('#' + this.htmlId + '_panel').html(html);
    this.updateFilterSelectionView();
    this.updateBatchActionView();

    var form = this;

    $('#' + this.htmlId + '_addContactBtn')
      .button({
        icons: {
            primary: "ui-icon-plus"
        },
        text: true
        })
      .click(function( event ) {
        form.addContact.call(form);
    });
    $('#' + this.htmlId + '_exportBtn')
      .button({
        icons: {
            primary: "ui-icon-arrowthickstop-1-s"
        },
        text: true
        })
      .click(function( event ) {
        form.export.call(form);
    });
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
    $('#' + this.htmlId + '_displayBtn').button({
        icons: {
            primary: "ui-icon-grip-dotted-horizontal"
        },
        text: true
    }).click(function(event) {
        form.showDisplayFieldsFilter.call(form);
    });    
    if(this.data.contactIds.length == 1) {
        $('#' + this.htmlId + '_contactConfirmBtn')
          .button({
            icons: {
                primary: "ui-icon-check"
            },
            text: true
            })
          .click(function( event ) {
            form.startContactConfirmation.call(form);
        });
        $('#' + this.htmlId + '_contactHistoryBtn')
          .button({
            icons: {
                primary: "ui-icon-comment"
            },
            text: false
            })
          .click(function( event ) {
            form.showContactHistory.call(form);
        });

        $('#' + this.htmlId + '_contactUpdateBtn')
          .button({
            icons: {
                primary: "ui-icon-pencil"
            },
            text: false
            })
          .click(function( event ) {
            form.startEditContact.call(form);
        });

        $('#' + this.htmlId + '_contactSetInactiveBtn')
          .button({
            icons: {
                primary: "ui-icon-trash"
            },
            text: false
            })
          .click(function( event ) {
            form.startSetInactiveContact.call(form);
        });
    }
    if(this.data.contactIds.length > 0) {
        $('#' + this.htmlId + '_batch').button({
            icons: {
                primary: "ui-icon-gear"
            }
        }).click(function(event) {
            form.startBatchUpdate.call(form, event);
        });
        $('#' + this.htmlId + '_batch_action').bind("change", function(event) {form.batchActionChangedHandle.call(form, event)});
    }
}
ContactManager.prototype.updateFilterSelectionView = function() {
    if(ContactManagerFilter.prototype.isFilterUsed(this.filterData)) {
        $('#' + this.htmlId + '_filterCell').css('border-left', '3px solid #009900');
    } else {
        $('#' + this.htmlId + '_filterCell').css('border-left', '0px');
    }
}
ContactManager.prototype.showFilter = function() {
    this.contactManagerFilter = new ContactManagerFilter(this.filterData, this.filterChangedHandler, this, this.htmlId + '_contactManagerFilter', this.moduleName);
    this.contactManagerFilter.init();   
}
ContactManager.prototype.showDisplayFieldsFilter = function() {
    this.filterDisplayFieldsForm = new DisplayFieldsFilter("displayFieldsFilter", this.moduleName, this.displayFields, this.possibleFields, this.acceptDisplayFieldsFilterData, this);
    this.filterDisplayFieldsForm.init();
}
ContactManager.prototype.updateBatchActionView = function() {
    var options = {
        "": "...",
        "SET_NEWSLETTERS": "Set Newsletters",
        "UNSET_NEWSLETTERS": "Unset Newsletters",
        "SET_REMINDER": "Set Reminder",
        "UNSET_REMINDER": "Unset Reminder"
    };
    this.updateSelectorView(this.htmlId + '_batch_action', this.batch.action, options);
}
ContactManager.prototype.updateContactsView = function() {
    var html = "";
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader">';
    html += '<td>';
    html += '<button id="' + this.htmlId + '_selectAll">Check</button>';
    html += '</td>';
    for(var field in this.possibleFields) {
        var fieldTitle = this.possibleFields[field];
        if(this.displayFields[field] == true) {
            html += '<td>' + fieldTitle + '</td>';
        }
    }
    html += '</tr>';
    if(this.loaded.contacts.length > 0) {
        for(var key in this.loaded.contacts) {
            var contact = this.loaded.contacts[key];
            html += '<tr>';
            html += '<td><input type="checkbox" id="' + this.htmlId + '_contactSelect_' + contact.id +'"></td>';
            if(this.displayFields['gender']) {
                html += '<td>' + (contact.gender != null ? contact.gender : '') + '</td>';
            }
            if(this.displayFields['name']) {
                html += '<td><span class="link" id="' + this.htmlId + '_contact_' + contact.id + '">' + (contact.firstName + ' ' + contact.lastName) + '</span></td>';
            }
            if(this.displayFields['localName']) {
                html += '<td>' + (contact.firstNameLocalLanguage + ' ' + contact.lastNameLocalLanguage) + '</td>';
            }
            if(this.displayFields['client']) {
                html += '<td>' + contact.clientName + '</td>';
            }
            if(this.displayFields['group']) {
                html += '<td>' + (contact.groupName != null ? contact.groupName : '') + '</td>';
            }
            if(this.displayFields['classifiedPosition']) {
                html += '<td>' + ('OTHER' != contact.normalPosition ? (contact.normalPosition != null ? contact.normalPosition : '') : (contact.normalPosition + '/' + contact.otherNormalPosition)) + '</td>';
            }
            if(this.displayFields['directPhone']) {
                html += '<td>' + (contact.directPhone != null ? contact.directPhone : '') + '</td>';
            }
            if(this.displayFields['mobilePhone']) {
                html += '<td>' + (contact.mobilePhone != null ? contact.mobilePhone : '') + '</td>';
            }
            if(this.displayFields['email']) {
                html += '<td>' + (contact.email != null ? contact.email : '') + '</td>';
            }
            if(this.displayFields['language']) {
                html += '<td>' + (contact.language != null ? contact.language : '') + '</td>';
            }
            if(this.displayFields['residencialCountry']) {
                html += '<td>' + (contact.residencialCountryName != null ? contact.residencialCountryName : '') + '</td>';
            }
            if(this.displayFields['isClientsAddressUsed']) {
                html += '<td>' + booleanVisualizer.getHtml(contact.isClientsAddressUsed) + '</td>';
            }
            if(this.displayFields['street']) {
                html += '<td>' + (contact.street != null ? contact.street : '') + '</td>';
            }
            if(this.displayFields['zipCode']) {
                html += '<td>' + (contact.zipCode != null ? contact.zipCode : '') + '</td>';
            }
            if(this.displayFields['city']) {
                html += '<td>' + (contact.city != null ? contact.city : '') + '</td>';
            }
            if(this.displayFields['country']) {
                html += '<td>' + (contact.countryName != null ? contact.countryName : '') + '</td>';
            }
            if(this.displayFields['presentType']) {
                html += '<td>' + (contact.presentType != null ? contact.presentType : '') + '</td>';
            }
            if(this.displayFields['isNewsletters']) {
                html += '<td>' + booleanVisualizer.getHtml(contact.isNewsletters) + '</td>';
            }
            if(this.displayFields['isReminder']) {
                html += '<td>' + booleanVisualizer.getHtml(contact.isReminder) + '</td>';
            }
            if(this.displayFields['isActive']) {
                html += '<td>' + booleanVisualizer.getHtml(contact.isActive) + '</td>';
            } 
            if(this.displayFields['comment']) {
                html += '<td>' + (contact.comment != null ? contact.comment : '') + '</td>';
            }
            html += '</tr>';
        }
    } else {
        html += '<tr><td colspan="13">No data</td></tr>';
    }
    html += '</table>';

    $('#' + this.htmlId + '_contacts').html(html);
    var form = this;
    $('span[id^="' + this.htmlId + '_contact_"]').bind('click', function(event) {form.contactClickedHandle.call(form, event)});
    $('input[id^="' + this.htmlId + '_contactSelect_"]').bind("click", function(event) {form.contactSelectorClickedHandle.call(form, event);});
    $('#' + this.htmlId + '_selectAll')
      .button({
        icons: {
            primary: "ui-icon-check"
        },
        text: false
        })
      .click(function( event ) {
        form.selectAll.call(form);
    });
    this.updateContactsSelection();

}
ContactManager.prototype.updateInfoView = function() {
    var html = "";
    var form = this;
    
}
ContactManager.prototype.updateContactsSelection = function() {
    for(var key in this.loaded.contacts) {
        var contact = this.loaded.contacts[key];
        var value = false;
        if(jQuery.inArray(contact.id, this.data.contactIds) != -1) {
            value = true;
        }
        $('#' + this.htmlId + '_contactSelect_' + contact.id).prop("checked", value);
    }
}

ContactManager.prototype.showContactHistory = function() {
  if(this.data.contactIds.length != 1) {
      doAlert('Alert', 'Please select one contact', null, null);
      return;
  }
  var id = this.data.contactIds[0];
  var form = this;
    var data = {};
    data.command = "getContactHistoryItems";
    data.contactId = id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.contactHistoryItems = result.contactHistoryItems;
            form.updateContactHistoryItemsView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ContactManager.prototype.startEditContact = function() {
    if(this.data.contactIds.length != 1) {
        doAlert('Alert', 'Please select one contact', null, null);
        return;
    }
    var id = this.data.contactIds[0];
    var form = this;
    var data = {};
    data.command = "getContact";
    data.contactId = id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.contact = result.contact;
            form.loaded.contactEmployees = result.contactEmployees;
            form.editContact();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });        
}
ContactManager.prototype.addContact = function() {
    var contactEditForm = new ContactEditForm({
        "mode": 'CREATE',
        "id": null,
        "clientId": null,
        "gender": null,
        "firstName": "",
        "lastName" : "",
        "firstNameLocalLanguage" : "",
        "lastNameLocalLanguage" : "",
        "normalPosition" : null,
        "otherNormalPosition" : null,
        "comment" : "",
        "directPhone" : "",
        "mobilePhone" : "",
        "email" : "",
        "language" : "",
        "isClientsAddressUsed" : true,
        "street" : "",
        "zipCode" : "",
        "city" : "",
        "countryId" : null,
        "residencialCountry" : null,
        "isNewsletters" : true,
        "isReminder" : false,
        "presentType" : null,  
        "isActive" : true,
        "contactEmployees": []
    }, "contactEditForm", this.loadContactInfo, this);
    contactEditForm.start();
}
ContactManager.prototype.editContact = function() {
        var contactEditForm = new ContactEditForm({
        "mode": 'UPDATE',
        "id": this.loaded.contact.id,
        "clientId": this.loaded.contact.clientId,
        "gender": this.loaded.contact.gender,
        "firstName": this.loaded.contact.firstName,
        "lastName" : this.loaded.contact.lastName,
        "firstNameLocalLanguage" : this.loaded.contact.firstNameLocalLanguage,
        "lastNameLocalLanguage" : this.loaded.contact.lastNameLocalLanguage,
        "normalPosition" : this.loaded.contact.normalPosition,
        "otherNormalPosition" : this.loaded.contact.otherNormalPosition,
        "comment" : this.loaded.contact.comment,
        "directPhone" : this.loaded.contact.directPhone,
        "mobilePhone" : this.loaded.contact.mobilePhone,
        "email" : this.loaded.contact.email,
        "language" : this.loaded.contact.language,
        "isClientsAddressUsed" : this.loaded.contact.isClientsAddressUsed,
        "street" : this.loaded.contact.street,
        "zipCode" : this.loaded.contact.zipCode,
        "city" : this.loaded.contact.city,
        "countryId" : this.loaded.contact.countryId,
        "residencialCountryId" : this.loaded.contact.residencialCountryId,
        "isNewsletters" : this.loaded.contact.isNewsletters,
        "isReminder" : this.loaded.contact.isReminder,
        "presentType" : this.loaded.contact.presentType,      
        "isActive" : this.loaded.contact.isActive,
        "contactEmployees": this.loaded.contactEmployees
    }, "contactEditForm", this.loadContactInfo, this);
    contactEditForm.start();
}
ContactManager.prototype.batchActionChangedHandle = function(event) {
    var action = $('#' + this.htmlId + '_batch_action').val();
    if(action == "") {
        this.batch.action = null;
    } else {
        this.batch.action = action;
    }
}
ContactManager.prototype.startSetInactiveContact = function() {
    if(this.data.contactIds.length != 1) {
        doAlert('Alert', 'Please select one contact', null, null);
        return;
    }
    var id = this.data.contactIds[0];
    var contact = null;
    for(var key in this.loaded.contacts) {
        if(this.loaded.contacts[key].id == id) {
            contact = this.loaded.contacts[key];
            break;
        }
    }
    if(contact.isActive != true) {
        doAlert('Alert', 'This contact is already inactive', null, null);
        return;        
    }
    var contactSetInactiveForm = new ContactSetInactiveForm({
        "id": id,
        "reason": ''
    }, "contactSetInactiveForm", this.loadContactInfo, this);
    contactSetInactiveForm.init();
}
ContactManager.prototype.startContactConfirmation = function() {
    doConfirm("Confirm", 'Proceede with confirmation selected contact?', this, this.setContactConfirmed, null, null);
}
ContactManager.prototype.setContactConfirmed = function() {
    var form = this;
    if(this.data.contactIds.length != 1) {
        doAlert('Alert', 'Please select one contact', null, null);
        return;
    }
    var id = this.data.contactIds[0];    
    var data = {};
    data.command = "confirmContact";
    data.contactId = id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert('Info', 'Selected contact has been confirmed', form, form.successOnConfirm);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ContactManager.prototype.startBatchUpdate = function(event) {
    if(this.data.contactIds.length == 0) {
        doAlert("Info", "Select Contacts and apply choosed batch update action to them", null, null);
    } else if(this.batch.action == null) {
        doAlert("Info", "Select Action to apply to selected contacts", null, null);
    } else {
        doConfirm("Info", 'Do you really want to apply this action (' + this.batch.action + ') to selected Contacts', this, this.doBatchUpdate, null, null);
    }
}
ContactManager.prototype.successOnConfirm = function() {
    $('#' + this.popupHtmlId).dialog("close");
    this.loadContactInfo();
}
ContactManager.prototype.contactClientLinkEditClickedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    var contactClientLink = null;
    for(var key in this.loaded.contactClientLinks) {
        if(this.loaded.contactClientLinks[key].id == id) {
            contactClientLink = this.loaded.contactClientLinks[key];
            break;
        }
    }
    var contactClientLinkEditForm = new ContactClientLinkEditForm({
        "mode": 'UPDATE',
        "id": contactClientLink.id,
        "contactId": contactClientLink.contactId,
        "clientId": contactClientLink.clientId
        }, "contactClientLinkEditForm", this.loadContactDetails, this);
    contactClientLinkEditForm.init();

}
ContactManager.prototype.contactClientLinkDeleteClickedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    var contactClientLinkDeleteForm = new ContactClientLinkDeleteForm(id, this.loadContactDetails, this);
    contactClientLinkDeleteForm.init();
}
ContactManager.prototype.addContactClientLink = function(event) {
    var contactClientLinkEditForm = new ContactClientLinkEditForm({
        "mode": 'CREATE',
        "id": null,
        "contactId": this.loaded.contact.id,
        "clientId": null
        }, "contactClientLinkEditForm", this.loadContactDetails, this);
    contactClientLinkEditForm.init();
}
ContactManager.prototype.employeeContactLinkEditClickedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    var employeeContactLink = null;
    for(var key in this.loaded.employeeContactLinks) {
        if(this.loaded.employeeContactLinks[key].id == id) {
            employeeContactLink = this.loaded.employeeContactLinks[key];
            break;
        }
    }
    var employeeContactLinkEditForm = new EmployeeContactLinkEditForm({
        "mode": 'UPDATE',
        "id": employeeContactLink.id,
        "contactId": employeeContactLink.contactId,
        "employeeId": employeeContactLink.employeeId,
        "comment": employeeContactLink.comment,
        }, "employeeContactLinkEditForm", this.loadContactDetails, this);
    employeeContactLinkEditForm.init();

}
ContactManager.prototype.employeeContactLinkDeleteClickedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    var employeeContactLinkDeleteForm = new EmployeeContactLinkDeleteForm(id, this.loadContactDetails, this);
    employeeContactLinkDeleteForm.init();
}
ContactManager.prototype.addEmployeeContactLink = function(event) {
    var employeeContactLinkEditForm = new EmployeeContactLinkEditForm({
        "mode": 'CREATE',
        "id": null,
        "contactId": this.loaded.contact.id,
        "employeeId": null,
        "comment": '',
        }, "employeeContactLinkEditForm", this.loadContactDetails, this);
    employeeContactLinkEditForm.init();
}
ContactManager.prototype.export = function(event) {
    var data = this.filterData;
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLS');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(data));
    $('#' + this.htmlId + '_xlsForm').submit();

}
ContactManager.prototype.updateContactView = function(event) {
      var residencialCountryName = "Not defined";
      var countryName = "Not defined";
      for(var key in this.loaded.countries) {
          var countryTmp = this.loaded.countries[key];
          if(countryTmp.id == this.loaded.contact.residencialCountryId) {
              residencialCountryName = countryTmp.name;
              break;
          }
      }
      for(var key in this.loaded.countries) {
          var countryTmp = this.loaded.countries[key];
          if(countryTmp.id == this.loaded.contact.countryId) {
              countryName = countryTmp.name;
              break;
          }
      }
      
      var html = '';
      html += '<div id="' + this.htmlId + '_accordion' + '">';
    
      html += '<h3>Contact</h3>';
      html += '<div>';      
      
      html += '<table class="datagrid">';
      html += '<tr><td>Gender</td><td>' + this.loaded.contact.gender + ' </td></tr>';
      html += '<tr><td>First Name</td><td>' + this.loaded.contact.firstName + ' </td></tr>';
      html += '<tr><td>Last Name</td><td>' + this.loaded.contact.lastName + ' </td></tr>';
      html += '<tr><td>First Name (Local Language)</td><td>' + this.loaded.contact.firstNameLocalLanguage + ' </td></tr>';
      html += '<tr><td>Last Name (LocalLanguage)</td><td>' + this.loaded.contact.lastNameLocalLanguage + ' </td></tr>';
      html += '<tr><td>Classified position</td><td>' + this.loaded.contact.normalPosition + ' </td></tr>';
      if(this.loaded.contact.normalPosition == 'OTHER') {
        html += '<tr><td>Classified position (Other)</td><td>' + this.loaded.contact.otherNormalPosition + ' </td></tr>';
      }
      html += '<tr><td>Direct Phone</td><td>' + this.loaded.contact.directPhone + ' </td></tr>';
      html += '<tr><td>Mobile Phone</td><td>' + this.loaded.contact.mobilePhone+ ' </td></tr>';
      html += '<tr><td>Email</td><td>' +  this.loaded.contact.email + ' </td></tr>';
      html += '<tr><td>Language</td><td>' + this.loaded.contact.language + ' </td></tr>';
      html += '<tr><td>Residencial Country</td><td>' + residencialCountryName + ' </td></tr>';
      html += '<tr><td>Clients address is used</td><td>' + booleanVisualizer.getHtml(this.loaded.contact.isClientsAddressUsed) + ' </td></tr>';
      if(!this.loaded.contact.isClientsAddressUsed) {
        html += '<tr><td>Street</td><td>' + this.loaded.contact.street + ' </td></tr>';
        html += '<tr><td>Zip code</td><td>' + this.loaded.contact.zipCode + ' </td></tr>';
        html += '<tr><td>City</td><td>' + this.loaded.contact.city + ' </td></tr>';
        html += '<tr><td>Country</td><td>' + countryName + ' </td></tr>';
      }
      html += '<tr><td>Newsletters</td><td>' + booleanVisualizer.getHtml(this.loaded.contact.isNewsletters) + ' </td></tr>';
      html += '<tr><td>Reminder mailing</td><td>' + booleanVisualizer.getHtml(this.loaded.contact.isReminder) + ' </td></tr>';
      html += '<tr><td>Present type</td><td>' + this.loaded.contact.presentType + ' </td></tr>';
      html += '<tr><td>Active</td><td>' + booleanVisualizer.getHtml(this.loaded.contact.isActive) + ' </td></tr>';
      html += '<tr><td>Comment</td><td>' + this.loaded.contact.comment + ' </td></tr>';
      html += '</table>';
      
      html += '</div>';
      
      html += '<h3>Clients (' + this.loaded.contactClientLinks.length + ')</h3>';
      html += '<div>';
      html += '<table class="datagrid">';
      html += '<tr class="dgHeader"><td>Name</td></tr>';
      if(this.loaded.contactClientLinks != null && this.loaded.contactClientLinks.length > 0) {
        for(var key in this.loaded.contactClientLinks) {
            var contactClientLinkTmp = this.loaded.contactClientLinks[key];
            html += '<tr><td>';
            html += contactClientLinkTmp.clientName;
            html += '<span class="link" id="' + this.htmlId + '_edit_contactClientLink_' + contactClientLinkTmp.id + '">Edit</span> | ';
            html += '<span class="link" id="' + this.htmlId + '_delete_contactClientLink_' + contactClientLinkTmp.id + '">Delete</span>';
            html += '</td></tr>';
        }
      } else {
          html += '<tr><td>No data found for this contact</td></tr>';
      }
      html += '<tr><td><button id="' + this.htmlId + '_add_contactClientLink' + '">Add client</button></td></tr>';
      html += '</table>'      
      html += '</div>';

      html += '<h3>Personal contacts (' + this.loaded.employeeContactLinks.length + ')</h3>';
      html += '<div>';      
      html += '<table class="datagrid">';
      html += '<tr class="dgHeader"><td>Name</td></tr>';
      if(this.loaded.employeeContactLinks != null && this.loaded.employeeContactLinks.length > 0) {
        for(var key in this.loaded.employeeContactLinks) {
            var employeeContactLinkTmp = this.loaded.employeeContactLinks[key];
            html += '<tr><td>';
            html += employeeContactLinkTmp.employeeFirstName + ' ' + employeeContactLinkTmp.employeeLastName + ' (' + employeeContactLinkTmp.employeeUserName + ')';
            if(employeeContactLinkTmp.comment != null && jQuery.trim(employeeContactLinkTmp.comment) != '') {
              html += '<div class="comment1">' + employeeContactLinkTmp.comment + '</div>';
            }
            html += '<span class="link" id="' + this.htmlId + '_edit_employeeContactLink_' + employeeContactLinkTmp.id + '">Edit</span> | ';
            html += '<span class="link" id="' + this.htmlId + '_delete_employeeContactLink_' + employeeContactLinkTmp.id + '">Delete</span>';
            html += '</td></tr>';
        }
      } else {
          html += '<tr><td>No data found for this contact</td></tr>';
      }
      html += '<tr><td><button id="' + this.htmlId + '_add_employeeContactLink' + '">Add link</button></td></tr>';
      html += '</table>';

      html += '</div>';

      html += '<h3>Persons-in-charge (' + this.loaded.inChargePersons.length + ')</h3>';
      html += '<div>';      
      html += '<table class="datagrid">';
      html += '<tr class="dgHeader"><td>Name</td></tr>';
      if(this.loaded.inChargePersons != null && this.loaded.inChargePersons.length > 0) {
        for(var key in this.loaded.inChargePersons) {
            var inChargePerson = this.loaded.inChargePersons[key];
            html += '<tr>';
            html += '<td>' + inChargePerson.firstName + ' ' + inChargePerson.lastName + ' (' + inChargePerson.userName + ')' + '</td>';
            html += '</tr>';
        }
      } else {
          html += '<tr><td>No data found for this contact</td></tr>';
      }
      html += '</table>';

      html += '</div>';

      html += '</div>';
       
      $('#' + this.htmlId + '_info').html(html);
      
      var form = this;
      $('span[id^="' + this.htmlId + '_edit_contactClientLink_"]').bind('click', function(event) {form.contactClientLinkEditClickedHandle.call(form, event)});
      $('span[id^="' + this.htmlId + '_delete_contactClientLink_"]').bind('click', function(event) {form.contactClientLinkDeleteClickedHandle.call(form, event)});
      $('span[id^="' + this.htmlId + '_edit_employeeContactLink_"]').bind('click', function(event) {form.employeeContactLinkEditClickedHandle.call(form, event)});
      $('span[id^="' + this.htmlId + '_delete_employeeContactLink_"]').bind('click', function(event) {form.employeeContactLinkDeleteClickedHandle.call(form, event)});

        $('#' + this.htmlId + '_add_contactClientLink')
          .button({
            icons: {
                primary: "ui-icon-plus"
            },
            text: true
            })
          .click(function( event ) {
            form.addContactClientLink.call(form);
        });

       $('#' + this.htmlId + '_add_employeeContactLink')
          .button({
            icons: {
                primary: "ui-icon-plus"
            },
            text: true
            })
          .click(function( event ) {
            form.addEmployeeContactLink.call(form);
        });
    
      $( '#' + this.htmlId + '_accordion').accordion({
        collapsible: true,
        heightStyle: "content"
      });      
}    
ContactManager.prototype.updateContactHistoryItemsView = function(event) {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader">';
    html += '<td>Status</td>';
    html += '<td>Comment</td>';
    html += '<td>Modified at</td>';
    html += '<td>Modified by</td>';
    html += '</tr>';
    if(this.loaded.contactHistoryItems.length > 0) {
        for(var key in this.loaded.contactHistoryItems) {
            var contactHistoryItem = this.loaded.contactHistoryItems[key];
            html += '<tr>';
            html += '<td>' + contactHistoryItem.status + '</td>';
            html += '<td>' + contactHistoryItem.comment + '</td>';
            html += '<td>' + getStringFromYearMonthDateTime(contactHistoryItem.modifiedAt) + '</td>';
            html += '<td>' + (contactHistoryItem.modifiedByFirstName + ' ' + contactHistoryItem.modifiedByLastName) + '</td>';
            html += '</tr>';        
        }
    } else {
        html += '<tr><td colspan="4">No data</td></tr>';
    }
    html += '</table>';

    this.popupHtmlId = getNextPopupHtmlContainer();
    $('#' + this.popupHtmlId).html(html);
    
    var form = this;
    $('#' + this.popupHtmlId).dialog({
        title: "Contact history",
        modal: true,
        position: 'center',
        width: 600,
        height: 300,
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

ContactManager.prototype.updateContactInChargePersonsView = function(event) {
    var html = '';
    html += '<div class="comment1">These are employees who are persons in charge of this client\'s projects</div>';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader">';
    html += '<td>Full name</td>';
    html += '<td>User name</td>';
    html += '</tr>';
    if(this.loaded.contactInChargePersons.length > 0) {
        for(var key in this.loaded.contactInChargePersons) {
            var contactInChargePerson = this.loaded.contactInChargePersons[key];
            html += '<tr>';
            html += '<td>' + (contactInChargePerson.firstName + ' ' + contactInChargePerson.lastName) + '</td>';
            html += '<td>' + contactInChargePerson.userName + '</td>';
            html += '</tr>';        
        }
    } else {
        html += '<tr><td colspan="2">No data</td></tr>';
    }
    html += '</table>';

    this.popupHtmlId = getNextPopupHtmlContainer();
    $('#' + this.popupHtmlId).html(html);
    
    var form = this;
    $('#' + this.popupHtmlId).dialog({
        title: "Persons in charge",
        modal: true,
        position: 'center',
        width: 400,
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
ContactManager.prototype.normalizeContentSize = function() { 
    jQuery('#' + this.htmlId + '_contacts').width(contentWidth - 350);
    jQuery('#' + this.htmlId + '_contacts').height(contentHeight - 80);

    jQuery('#' + this.htmlId + '_info').width(270);
    jQuery('#' + this.htmlId + '_info').height(contentHeight - 80);
}
ContactManager.prototype.updateSelectorView = function(id, value, options) {
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
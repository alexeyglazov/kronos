/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ContactPicker(formData, htmlId, okHandler, okHandlerContext, moduleName) {
    this.config = {
        endpointUrl: endpointsFolder + "ContactPicker.jsp"
    }
    this.mode = formData.mode;
    this.contactManagerFilter = null;
    this.htmlId = htmlId;
    this.okHandler = okHandler;
    this.okHandlerContext = okHandlerContext;
    this.moduleName = moduleName;
    this.filterData = ContactManagerFilter.prototype.getDefaultFilter();;
    this.filter = null;    
    this.loaded = {
        "contacts": []
    }
    this.enums = {
        "pickTypes": {
            "FOUND": 'All found',
            "SELECTED": 'All selected'
        }
    }
    this.data = {
        pickType: 'SELECTED'
    }
    this.selected = {
        contactIds: []
    }
    this.displayFields = this.getDefaultDisplayFields();
    this.possibleFields = {
        gender: "Gender",
        name: "Name",
        localName: "Local name",
        client: "Client",
        group: "Group",
        position: "Position",
        classifiedPosition: "Classified position",
        directPhone: "Direct phone",
        mobilePhone: "Mobile phone",
        email: "Email",
        nationality: "Nationality",
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
        isActive: "Active"
    }
}
ContactPicker.prototype.getDefaultDisplayFields = function() {
    return {
        gender: false,
        name: true,
        localName: true,
        client: true,
        group: false,
        position: true,
        classifiedPosition: true,
        directPhone: false,
        mobilePhone: false,
        email: false,
        nationality: false,
        language: false,
        residencialCountry: false,
        isClientsAddressUsed: false,
        street: false,
        zipCode: false,
        city: false,
        country: false
    }
}
ContactPicker.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
}
ContactPicker.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.moduleName = this.moduleName;
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
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ContactPicker.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr>';
    html += '<td><button id="' + this.htmlId + '_filterBtn">Contact filter</button></td>';
    html += '<td><span class="label1">Pick</td>';
    html += '<td><select id="' + this.htmlId + '_pickType"></select></td>';
    html += '</tr>';
    html += '</table>';
    html += '<div id="' + this.htmlId + '_comment"></div>';
    html += '<div id="' + this.htmlId + '_contacts" style="overflow: auto;"></div>';
    return html;
}
ContactPicker.prototype.makeButtons = function() {
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
ContactPicker.prototype.updateView = function() {
    this.updatePickTypeView();
    this.updateCommentView();
    this.updateContactsView();
}
ContactPicker.prototype.updatePickTypeView = function() {
    var html = '';
    for(var key in this.enums.pickTypes) {
        var pickType = this.enums.pickTypes[key];
        var isSelected = "";
        if(key == this.data.pickType) {
           isSelected = "selected";
        }
        html += '<option value="' + key + '" ' + isSelected + '>' + pickType + '</option>';
    }
    $('#' + this.htmlId + '_pickType').html(html);    
}
ContactPicker.prototype.updateCommentView = function() {
    var html = '';
    var contactsToPickCount = 0;
    if(this.data.pickType == 'FOUND') {
        contactsToPickCount = this.loaded.contacts.length;
    } else if(this.data.pickType == 'SELECTED') {
        contactsToPickCount = this.selected.contactIds.length;
    }
    html += 'Contacts to pick: ' + contactsToPickCount;
    $('#' + this.htmlId + '_comment').html(html);
}
ContactPicker.prototype.updateContactsView = function() {
    var html = "";
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader">';
    html += '<td></td>';
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
            if(this.displayFields['position']) {
                html += '<td>' + (contact.position != null ? contact.position : '') + '</td>';
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
            if(this.displayFields['nationality']) {
                html += '<td>' + (contact.nationalityName != null ? contact.nationalityName : '') + '</td>';
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
            html += '</tr>';
        }
    } else {
        html += '<tr><td colspan="13">No data</td></tr>';
    }
    html += '</table>';

    $('#' + this.htmlId + '_contacts').html(html);
    var form = this;
    $('span[id^="' + this.htmlId + '_contact_"]').bind('click', function(event) {form.contactClickedHandle.call(form, event)});
    $('input[id^="' + this.htmlId + '_contactSelect_"]').bind("click", function(event) {form.contactSelectClickedHandle.call(form, event);});
    this.updateContactsSelection();
}
ContactPicker.prototype.updateContactsSelection = function() {
    for(var key in this.loaded.contacts) {
        var contact = this.loaded.contacts[key];
        var value = false;
        if(jQuery.inArray(contact.id, this.selected.contactIds) != -1) {
            value = true;
        }
        $('#' + this.htmlId + '_contactSelect_' + contact.id).prop("checked", value);
    }
}


ContactPicker.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_pickType').bind("change", function(event) {form.pickTypeChangedHandle.call(form, event);});
}
ContactPicker.prototype.showFilter = function() {
    this.contactManagerFilter = new ContactManagerFilter(this.filterData, this.filterChangedHandler, this, this.htmlId + '_contactManagerFilter', this.moduleName);
    this.contactManagerFilter.init();   
}
ContactPicker.prototype.filterChangedHandler = function(filterData) {
    this.selected.contactIds = [];
    this.data.contactIds = [];

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
        this.loadInitialContent();
    }
}
ContactPicker.prototype.pickTypeChangedHandle = function(event) {
    this.data.pickType = jQuery.trim(event.currentTarget.value);
    if(this.data.pickType == '') {
        this.data.pickType = null;
    }
    this.updatePickTypeView();
    this.updateCommentView();
}
ContactPicker.prototype.contactClickedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    this.selected.contactIds = [];
    this.selected.contactIds.push(id);
    this.updateContactsSelection();
    this.updateCommentView();
}
ContactPicker.prototype.contactSelectClickedHandle = function(event) {
    this.selected.contactIds = [];
    if(this.mode == 'SINGLE') {
        var htmlId = $(event.currentTarget).attr("id");
        var tmp = htmlId.split("_");
        var contactId = parseInt(tmp[tmp.length - 1]);
        if( $('#' + this.htmlId + '_contactSelect_' + contactId).is(':checked') ) {
            this.selected.contactIds.push(contactId);
        }
    } else if(this.mode == 'MULTIPLE') {
        for(var key in this.loaded.contacts) {
            var contact = this.loaded.contacts[key];
            if( $('#' + this.htmlId + '_contactSelect_' + contact.id).is(':checked') ) {
                this.selected.contactIds.push(contact.id);
            }
        }
    }
    this.updateContactsSelection();
    this.updateCommentView();
}

ContactPicker.prototype.show = function() {
    var title = 'Pick contact'
    var form = this;
    var height = 400;
    $("#" + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    this.updateView();
    this.makeButtons();
    $("#" + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        client: 'center',
        width: 600,
        height: height,
        buttons: {
            Ok: function() {
                $(this).dialog( "close" );
                form.okClickHandle();
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
ContactPicker.prototype.okClickHandle = function() {
    var contactIds = [];
    if(this.data.pickType == 'FOUND') {
        for(var key in this.loaded.contacts) {
            var contact = this.loaded.contacts[key];
            contactIds.push(contact.id);
        }
    } else if(this.data.pickType == 'SELECTED') {
        contactIds = this.selected.contactIds;
    }
    this.okHandler.call(this.okHandlerContext, contactIds);
}

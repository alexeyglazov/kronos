/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ContactEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "ContactEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.moduleName = "Clients";
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.loaded = {
        client: null,
        countries: [],
        languages: []
    }
    this.enums = {
        genders: {
            "MR": "Mr",
            "MRS": "Mrs"
        },
        normalPositions: {
            "CEO": "CEO",
            "CFO": "CFO",
            "HR": "HR",
            "CIO": "CIO (IT)",
            "TAX_MANAGER": "Tax manager",
            "CA": "CA",
            "OTHER": "Other"
        },
        presentTypes: {
            "VIP": "VIP",
            "STANDARD": "Standard",
            "CARD": "Card only",
            "NO": "No"
        },

    }
    this.originalData = {
        "isActive" : formData.isActive
    }
    if(this.originalData.isActive == null) {
       this.originalData.isActive = true; 
    }
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "clientId": formData.clientId,
        "gender": formData.gender,
        "firstName": formData.firstName,
        "lastName" : formData.lastName,
        "firstNameLocalLanguage" : formData.firstNameLocalLanguage,
        "lastNameLocalLanguage" : formData.lastNameLocalLanguage,
        "normalPosition" : formData.normalPosition,
        "otherNormalPosition" : formData.otherNormalPosition,
        "comment" : formData.comment,
        "directPhone" : formData.directPhone,
        "mobilePhone" : formData.mobilePhone,
        "email" : formData.email,
        "nationalityId" : formData.nationalityId,
        "language" : formData.language,
        "residencialCountryId" : formData.residencialCountryId,
        "isClientsAddressUsed" : formData.isClientsAddressUsed,
        "street": formData.street,
        "zipCode": formData.zipCode,
        "city": formData.city,
        "countryId": formData.countryId,
        "isNewsletters" : formData.isNewsletters,
        "isReminder" : formData.isReminder,
        "presentType": formData.presentType,
        "isActive" : formData.isActive
    }
    this.selected = {
        contactEmployeeId: null
    }
}
ContactEditForm.prototype.start = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
    this.dataChanged(false);
}
ContactEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    if(this.data.mode == 'CREATE') {
        html += '<tr><td><span class="label1">Client</span></td><td><span id="' + this.htmlId + '_client"></span></td>';
        html += '<td><button id="' + this.htmlId + '_client_pick">Pick</button></td><td><button id="' + this.htmlId + '_client_clear" title="Clear">Delete</button></td>';
        html += '</tr>';
    }
    html += '<tr><td><span class="label1">Gender</span></td><td><select id="' + this.htmlId + '_gender" title="Gender"></select></td><td></td><td></td></tr>';
    html += '<tr><td><span class="label1">First Name</span></td><td><input type="text" id="' + this.htmlId + '_firstName" title="First name"></td><td></td><td></td></tr>';
    html += '<tr><td><span class="label1">Last Name</span></td><td><input type="text" id="' + this.htmlId + '_lastName" title="Last name"></td><td></td><td></td></tr>';
    html += '<tr><td><span class="label1">First Name (Local Language)</span></td><td><input type="text" id="' + this.htmlId + '_firstNameLocalLanguage" title="Fisrt name in local language"></td><td></td><td></td></tr>';
    html += '<tr><td><span class="label1">Last Name (Local Language)</span></td><td><input type="text" id="' + this.htmlId + '_lastNameLocalLanguage" title="Last name in local language"></td><td></td><td></td></tr>';
    html += '<tr><td><span class="label1">Classified position</span></td><td><select id="' + this.htmlId + '_normalPosition" title="Classified position"></select></td><td></td><td></td></tr>';
    html += '<tr id="' + this.htmlId + '_otherNormalPosition_block"><td><span class="label1">Other</span></td><td><input type="text" id="' + this.htmlId + '_otherNormalPosition" title="Specified value for classified position"></td><td></td><td></td></tr>';
    html += '<tr><td><span class="label1">Direct Phone</span></td><td><input type="text" id="' + this.htmlId + '_directPhone" title="Direct phone"></td><td></td><td></td></tr>';
    html += '<tr><td><span class="label1">Mobile Phone</span></td><td><input type="text" id="' + this.htmlId + '_mobilePhone" title="Mobile phone"></td><td></td><td></td></tr>';
    html += '<tr><td><span class="label1">Email</span></td><td><input type="text" id="' + this.htmlId + '_email" style="width: 300px;" title="Email"></td><td></td><td></td></tr>';
    html += '<tr><td><span class="label1">Client\'s postal address is used</span></td><td><input type="checkbox" id="' + this.htmlId + '_isClientsAddressUsed" title="Check it if the contact has the same address as the client\'s postal adress"></td><td></td><td></td></tr>';
    html += '<tr id="' + this.htmlId + '_street_block"><td><span class="label1">Postal address: street, building, office</span></td><td><input type="text" id="' + this.htmlId + '_street" title="Postal address (Street, building, etc)"></td><td></td><td></td></tr>';
    html += '<tr id="' + this.htmlId + '_zipCode_block"><td><span class="label1">Postal address: Zip code</span></td><td><input type="text" id="' + this.htmlId + '_zipCode" title="Postal address ZIP code"></td><td></td><td></td></tr>';
    html += '<tr id="' + this.htmlId + '_city_block"><td><span class="label1">Postal address: city</span></td><td><input type="text" id="' + this.htmlId + '_city" title="Postal address city"></td><td></td><td></td></tr>';
    html += '<tr id="' + this.htmlId + '_country_block"><td><span class="label1">Postal address: country</span></td><td><select id="' + this.htmlId + '_country" title="Postal address city"></select></td><td></td><td></td></tr>';
    html += '<tr><td><span class="label1">Language</span></td><td><textarea id="' + this.htmlId + '_language" style="width: 200px; height: 40px;" title="List of languages"></textarea></td><td></td><td></td></tr>';
    html += '<tr><td><span class="label1">Residencial Country</span></td><td><select id="' + this.htmlId + '_residencialCountry" title="Residential country"></select></td><td></td><td></td></tr>';
    html += '<tr><td><span class="label1">Newsletters</span></td><td><input type="checkbox" id="' + this.htmlId + '_isNewsletters" title="Check it if the contact should recieve newsletters"></td><td></td><td></td></tr>';
    html += '<tr><td><span class="label1">Reminder mailing</span></td><td><input type="checkbox" id="' + this.htmlId + '_isReminder" title="Check it if the contact should recieve reminder letters"></td><td></td><td></td></tr>';
    html += '<tr><td><span class="label1">Present type</span></td><td><select id="' + this.htmlId + '_presentType" title="Select present type"></select></td><td></td><td></td></tr>';
    html += '<tr><td><span class="label1">Active</span></td><td><input type="checkbox" id="' + this.htmlId + '_isActive" title="Check it if the contact is active"></td><td></td><td></td></tr>';
    html += '<tr id="' + this.htmlId + '_reason_block"><td><span class="label1">Reason of changing Active status</span></td><td><textarea id="' + this.htmlId + '_reason" style="width: 300px; height: 75px;" title="Explain please why you change the Active value"></textarea></td><td></td><td></td></tr>';
    html += '<tr><td><span class="label1">Comment</span></td><td><textarea id="' + this.htmlId + '_comment" title="Comment"></textarea></td><td></td><td></td></tr>';
    html += '</table>';
    return html
}
ContactEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_gender').bind("change", function(event) {form.genderChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_firstName').bind("change", function(event) {form.firstNameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_lastName').bind("change", function(event) {form.lastNameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_firstNameLocalLanguage').bind("change", function(event) {form.firstNameLocalLanguageChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_lastNameLocalLanguage').bind("change", function(event) {form.lastNameLocalLanguageChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_normalPosition').bind("change", function(event) {form.normalPositionChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_otherNormalPosition').bind("change", function(event) {form.otherNormalPositionChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_comment').bind("change", function(event) {form.commentChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_directPhone').bind("change", function(event) {form.directPhoneChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_mobilePhone').bind("change", function(event) {form.mobilePhoneChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_email').bind("change", function(event) {form.emailChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_language').bind("change", function(event) {form.languageChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_residencialCountry').bind("change", function(event) {form.residencialCountryChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isClientsAddressUsed').bind("click", function(event) {form.isClientsAddressUsedChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_street').bind("change", function(event) {form.streetChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_zipCode').bind("change", function(event) {form.zipCodeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_city').bind("change", function(event) {form.cityChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_country').bind("change", function(event) {form.countryChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isNewsletters').bind("click", function(event) {form.isNewslettersChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isReminder').bind("click", function(event) {form.isReminderChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_presentType').bind("change", function(event) {form.presentTypeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isActive').bind("click", function(event) {form.isActiveChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_reason').bind("change", function(event) {form.reasonChangedHandle.call(form, event);});
}
ContactEditForm.prototype.makeButtons = function() {
    var form = this;
    
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
    
    $('#' + this.htmlId + '_client_clear')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.clientClearHandle.call(form);
    });    
}
ContactEditForm.prototype.clientPickHandle = function() {
    var formData = {
        "mode": 'SINGLE'
    };
    this.clientPicker = new ClientPicker(formData, "clientPicker", this.clientPicked, this, this.moduleName);
    this.clientPicker.init();
}
ContactEditForm.prototype.clientPicked = function(client) {
    this.loaded.client = client;
    this.data.clientId = client.id;
    this.updateClientView();
}
ContactEditForm.prototype.clientClearHandle = function() {
    this.loaded.client = null;
    this.data.clientId = null;
    this.updateClientView();
}
ContactEditForm.prototype.genderChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_gender').val();
    if(idTxt == "") {
        this.data.gender = null;
    } else {
        this.data.gender = idTxt;
    }
    this.updateGenderView();
    this.dataChanged(true);
}
ContactEditForm.prototype.firstNameChangedHandle = function(event) {
    this.data.firstName = jQuery.trim(event.currentTarget.value);
    this.updateFirstNameView();
    this.dataChanged(true);
}
ContactEditForm.prototype.lastNameChangedHandle = function(event) {
    this.data.lastName = jQuery.trim(event.currentTarget.value);
    this.updateLastNameView();
    this.dataChanged(true);
}
ContactEditForm.prototype.firstNameLocalLanguageChangedHandle = function(event) {
    this.data.firstNameLocalLanguage = jQuery.trim(event.currentTarget.value);
    this.updateFirstNameLocalLanguageView();
    this.dataChanged(true);
}
ContactEditForm.prototype.lastNameLocalLanguageChangedHandle = function(event) {
    this.data.lastNameLocalLanguage = jQuery.trim(event.currentTarget.value);
    this.updateLastNameLocalLanguageView();
    this.dataChanged(true);
}
ContactEditForm.prototype.normalPositionChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_normalPosition').val();
    if(idTxt == "") {
        this.data.normalPosition = null;
    } else {
        this.data.normalPosition = idTxt;
    }
    this.updateNormalPositionView();
    this.updateOtherNormalPositionView();
    this.dataChanged(true);
}
ContactEditForm.prototype.otherNormalPositionChangedHandle = function(event) {
    this.data.otherNormalPosition = jQuery.trim(event.currentTarget.value);
    this.updateOtherNormalPositionView();
    this.dataChanged(true);
}
ContactEditForm.prototype.commentChangedHandle = function(event) {
    this.data.comment = jQuery.trim(event.currentTarget.value);
    this.updateCommentView();
    this.dataChanged(true);
}
ContactEditForm.prototype.directPhoneChangedHandle = function(event) {
    this.data.directPhone = jQuery.trim(event.currentTarget.value);
    this.updateDirectPhoneView();
    this.dataChanged(true);
}
ContactEditForm.prototype.mobilePhoneChangedHandle = function(event) {
    this.data.mobilePhone = jQuery.trim(event.currentTarget.value);
    this.updateMobilePhoneView();
    this.dataChanged(true);
}
ContactEditForm.prototype.emailChangedHandle = function(event) {
    this.data.email = jQuery.trim(event.currentTarget.value);
    this.updateEmailView();
    this.dataChanged(true);
}
ContactEditForm.prototype.languageChangedHandle = function(event) {
    this.data.language = jQuery.trim(event.currentTarget.value);
    this.updateLanguageView();
    this.dataChanged(true);
}
ContactEditForm.prototype.isClientsAddressUsedChangedHandle = function(event) {
    this.data.isClientsAddressUsed = $('#' + this.htmlId + '_isClientsAddressUsed').is(':checked');
    this.updateIsClientsAddressUsedView();

    this.updateStreetView();
    this.updateZipCodeView();
    this.updateCityView();
    this.updateCountryView();
    this.dataChanged(true);
}
ContactEditForm.prototype.streetChangedHandle = function(event) {
    this.data.street = jQuery.trim(event.currentTarget.value);
    this.updateStreetView();
    this.dataChanged(true);
}
ContactEditForm.prototype.zipCodeChangedHandle = function(event) {
    this.data.zipCode = jQuery.trim(event.currentTarget.value);
    this.updateZipCodeView();
    this.dataChanged(true);
}
ContactEditForm.prototype.cityChangedHandle = function(event) {
    this.data.city = jQuery.trim(event.currentTarget.value);
    this.updateCityView();
    this.dataChanged(true);
}
ContactEditForm.prototype.countryChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_country').val();
    if(idTxt == "") {
        this.data.countryId = null;
    } else {
        this.data.countryId = parseInt(idTxt);
    }
    this.updateCountryView();
    this.dataChanged(true);
}

ContactEditForm.prototype.residencialCountryChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_residencialCountry').val();
    if(idTxt == "") {
        this.data.residencialCountryId = null;
    } else {
        this.data.residencialCountryId = parseInt(idTxt);
    }
    this.updateResidencialCountryView();
    this.dataChanged(true);
}
ContactEditForm.prototype.isNewslettersChangedHandle = function(event) {
    this.data.isNewsletters = $('#' + this.htmlId + '_isNewsletters').is(':checked');
    this.updateIsNewslettersView();
    this.dataChanged(true);
}
ContactEditForm.prototype.isReminderChangedHandle = function(event) {
    this.data.isReminder = $('#' + this.htmlId + '_isReminder').is(':checked');
    this.updateIsReminderView();
    this.dataChanged(true);
}
ContactEditForm.prototype.presentTypeChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_presentType').val();
    if(idTxt == "") {
        this.data.presentType = null;
    } else {
        this.data.presentType = idTxt;
    }
    this.updatePresentTypeView();
    this.dataChanged(true);
}

ContactEditForm.prototype.isActiveChangedHandle = function(event) {
    this.data.isActive = $('#' + this.htmlId + '_isActive').is(':checked');
    this.updateIsActiveView();
    this.dataChanged(true);
}

ContactEditForm.prototype.reasonChangedHandle = function(event) {
    this.data.reason = jQuery.trim(event.currentTarget.value);
    this.updateReasonView();
    this.dataChanged(true);
}

ContactEditForm.prototype.updateView = function() {
    this.updateClientView();
    this.updateGenderView();
    this.updateFirstNameView();
    this.updateLastNameView();
    this.updateFirstNameLocalLanguageView();
    this.updateLastNameLocalLanguageView();
    this.updateNormalPositionView();
    this.updateOtherNormalPositionView();
    this.updateCommentView();
    this.updateDirectPhoneView();
    this.updateMobilePhoneView();
    this.updateEmailView();
    this.updateLanguageView();
    this.updateResidencialCountryView();
    this.updateIsClientsAddressUsedView();
    this.updateStreetView();
    this.updateZipCodeView();
    this.updateCityView();
    this.updateCountryView();
    this.updateIsNewslettersView();
    this.updateIsReminderView();
    this.updatePresentTypeView();
    this.updateIsActiveView();
    this.updateReasonView();
}
ContactEditForm.prototype.updateClientView = function() {
    var html = 'Not defined';
    if(this.data.clientId != null) {
        html = this.loaded.client.name;
    }
    $('#' + this.htmlId + '_client').html(html);
}
ContactEditForm.prototype.updateGenderView = function() {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.enums.genders) {
        var gender = this.enums.genders[key];
        var isSelected = "";
        if(key == this.data.gender) {
           isSelected = "selected";
        }
        html += '<option value="' + key + '" ' + isSelected + '>' + gender + '</option>';
    }
    $('#' + this.htmlId + '_gender').html(html);
}
ContactEditForm.prototype.updateFirstNameView = function() {
    $('#' + this.htmlId + '_firstName').val(this.data.firstName);
}
ContactEditForm.prototype.updateLastNameView = function() {
    $('#' + this.htmlId + '_lastName').val(this.data.lastName);
}
ContactEditForm.prototype.updateFirstNameLocalLanguageView = function() {
    $('#' + this.htmlId + '_firstNameLocalLanguage').val(this.data.firstNameLocalLanguage);
}
ContactEditForm.prototype.updateLastNameLocalLanguageView = function() {
    $('#' + this.htmlId + '_lastNameLocalLanguage').val(this.data.lastNameLocalLanguage);
}
ContactEditForm.prototype.updateNormalPositionView = function() {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.enums.normalPositions) {
        var normalPosition = this.enums.normalPositions[key];
        var isSelected = "";
        if(key == this.data.normalPosition) {
           isSelected = "selected";
        }
        html += '<option value="' + key + '" ' + isSelected + '>' + normalPosition + '</option>';
    }
    $('#' + this.htmlId + '_normalPosition').html(html);
}
ContactEditForm.prototype.updateOtherNormalPositionView = function() {
    $('#' + this.htmlId + '_otherNormalPosition').val(this.data.otherNormalPosition);
    if(this.data.normalPosition != 'OTHER') {
        $('#' + this.htmlId + '_otherNormalPosition_block').hide('slow');
    } else {
        $('#' + this.htmlId + '_otherNormalPosition_block').show('slow');
    }    
}
ContactEditForm.prototype.updateCommentView = function() {
    $('#' + this.htmlId + '_comment').val(this.data.comment);
}
ContactEditForm.prototype.updateDirectPhoneView = function() {
    $('#' + this.htmlId + '_directPhone').val(this.data.directPhone);
}
ContactEditForm.prototype.updateMobilePhoneView = function() {
    $('#' + this.htmlId + '_mobilePhone').val(this.data.mobilePhone);
}
ContactEditForm.prototype.updateEmailView = function() {
    $('#' + this.htmlId + '_email').val(this.data.email);
}
ContactEditForm.prototype.updateLanguageView = function() {
    $('#' + this.htmlId + '_language').val(this.data.language);
}
ContactEditForm.prototype.updateResidencialCountryView = function() {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.loaded.countries) {
        var country = this.loaded.countries[key];
        var isSelected = "";
        if(country.id == this.data.residencialCountryId) {
           isSelected = "selected";
        }
        html += '<option value="' + country.id + '" ' + isSelected + '>' + country.name + '</option>';
    }
    $('#' + this.htmlId + '_residencialCountry').html(html);
}
ContactEditForm.prototype.updateIsClientsAddressUsedView = function() {
    $('#' + this.htmlId + '_isClientsAddressUsed').attr("checked", this.data.isClientsAddressUsed);
}
ContactEditForm.prototype.updateStreetView = function() {
    $('#' + this.htmlId + '_street').val(this.data.street);
    if(this.data.isClientsAddressUsed) {
        $('#' + this.htmlId + '_street_block').hide('slow');
    } else {
        $('#' + this.htmlId + '_street_block').show('slow');
    }
}
ContactEditForm.prototype.updateZipCodeView = function() {
    $('#' + this.htmlId + '_zipCode').val(this.data.zipCode);
    if(this.data.isClientsAddressUsed) {
        $('#' + this.htmlId + '_zipCode_block').hide('slow');
    } else {
        $('#' + this.htmlId + '_zipCode_block').show('slow');
    }
}
ContactEditForm.prototype.updateCityView = function() {
    $('#' + this.htmlId + '_city').val(this.data.city);
    if(this.data.isClientsAddressUsed) {
        $('#' + this.htmlId + '_city_block').hide('slow');
    } else {
        $('#' + this.htmlId + '_city_block').show('slow');
    }
}
ContactEditForm.prototype.updateCountryView = function() {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.loaded.countries) {
        var country = this.loaded.countries[key];
        var isSelected = "";
        if(country.id == this.data.countryId) {
           isSelected = "selected";
        }
        html += '<option value="' + country.id + '" ' + isSelected + '>' + country.name + '</option>';
    }
    $('#' + this.htmlId + '_country').html(html);
    if(this.data.isClientsAddressUsed) {
        $('#' + this.htmlId + '_country_block').hide('slow');
    } else {
        $('#' + this.htmlId + '_country_block').show('slow');
    }
}
ContactEditForm.prototype.updateIsNewslettersView = function() {
    $('#' + this.htmlId + '_isNewsletters').attr("checked", this.data.isNewsletters);
}
ContactEditForm.prototype.updateIsReminderView = function() {
    $('#' + this.htmlId + '_isReminder').attr("checked", this.data.isReminder);
}
ContactEditForm.prototype.updatePresentTypeView = function() {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.enums.presentTypes) {
        var presentType = this.enums.presentTypes[key];
        var isSelected = "";
        if(key == this.data.presentType) {
           isSelected = "selected";
        }
        html += '<option value="' + key + '" ' + isSelected + '>' + presentType + '</option>';
    }
    $('#' + this.htmlId + '_presentType').html(html);
}
ContactEditForm.prototype.updateIsActiveView = function() {
    $('#' + this.htmlId + '_isActive').attr("checked", this.data.isActive);
    if(this.data.mode == 'UPDATE' && (this.originalData.isActive != this.data.isActive)) {
        $('#' + this.htmlId + '_reason_block').show('slow');
    } else {
        $('#' + this.htmlId + '_reason_block').hide('slow');
    }    
}
ContactEditForm.prototype.updateReasonView = function() {
    $('#' + this.htmlId + '_reason').val(this.data.reason);
}

ContactEditForm.prototype.loadInitialContent = function() {
   var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.clientId = this.data.clientId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.client = result.client;
            form.loaded.countries = result.countries;
            form.loaded.languages = result.languages;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ContactEditForm.prototype.show = function() {
    var title = 'Update Contact'
    if(this.data.mode == 'CREATE') {
        title = 'Create Contact';
    }
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    this.makeButtons();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 600,
        height: 600,
        buttons: {
            Ok: function() {
                form.save();
            },
            Cancel: function() {
                $(this).dialog( "close" );
                form.dataChanged(false);
            }
	},
        close: function(event, ui) {
            releasePopupLayer();
        } 
    });
    this.updateView();
}
ContactEditForm.prototype.validate = function() {
    var errors = [];
    var warnings = [];
    var emailRE = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if(this.data.mode == 'CREATE' && this.data.clientId == null) {
        errors.push("Client is not set");
    }
    if(this.data.firstName == null || this.data.firstName == "") {
        errors.push("First Name is not set");
    }
    if(this.data.lastName == null || this.data.lastName == "") {
        errors.push("Last Name is not set");
    }
    if(this.data.mode == 'UPDATE' && (this.originalData.isActive != this.data.isActive)) {
        if(this.data.reason == null || this.data.reason == '') {
            errors.push("Reason to change Active status is not specified");
        }
    }    

    if(this.data.email == null || this.data.email == "") {
    } else if(!emailRE.test(this.data.email)) {
        errors.push("E-mail has incorrect format.");
    }
    
    if(this.data.isActive == false) {
        return {
            "errors": errors,
            "warnings": warnings
        };
    }
    //==================================
    if(this.data.email == null || this.data.email == "") {
        errors.push("E-mail is not set");
    }

    if(this.data.gender == null) {
        errors.push("Gender is not selected");
    }
    if(this.data.normalPosition == null) {
        errors.push("Classified position is not selected");
    } else if(this.data.normalPosition == 'OTHER' && (this.data.otherNormalPosition == null || this.data.otherNormalPosition == '')) {
        errors.push("Comment for classified position is not specified");
    }
    if(this.data.language == null || this.data.language == "") {
        errors.push("Spoken Language is not set");
    }
    //if(this.data.residencialCountryId == null) {
    //    errors.push("Residencial Country is not selected");
    //}
    if(this.data.isClientsAddressUsed == null) {
        errors.push("ClientsAddressUsed is not selected");
    } else if(! this.data.isClientsAddressUsed) {
        if(this.data.street == null || this.data.street == '') {
            errors.push("Street is not set");
        }
        if(this.data.zipCode == null || this.data.zipCode == '') {
            errors.push("Zip Code is not set");
        }
        if(this.data.city == null || this.data.city == '') {
            errors.push("City is not set");
        }
        if(this.data.countryId == null) {
            errors.push("Country is not set");
        }
    }    
    if(this.data.presentType == null) {
        errors.push("Present Type is not selected");
    }
    return {
        "errors": errors,
        "warnings": warnings
    };
}
ContactEditForm.prototype.save = function() {
    var result = this.validate();
    if(result.errors.length > 0) {
        showErrors(result.errors);
        return;
    } else if(result.warnings.length > 0) {
        showWarnings(result.warnings, this, this.doSave);
        return;
    } else {
        this.doSave();
    }
}
ContactEditForm.prototype.doSave = function() {    
    var serverFormData = clone(this.data);
    if(serverFormData.normalPosition != 'OTHER') {
        serverFormData.otherNormalPosition = null;
    }
    if(serverFormData.isClientsAddressUsed == null) {
        serverFormData.street = null;
        serverFormData.zipCode = null;
        serverFormData.city = null;
        serverFormData.countryId = null;
    }
    
    var form = this;
    var data = {};
    data.command = "saveContact";
    data.contactEditForm = getJSON(serverFormData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Contact has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ContactEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}

ContactEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}



//==================================================

function ContactDeleteForm(contactId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "ContactEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": contactId
    }
}
ContactDeleteForm.prototype.start = function() {
    this.checkDependencies();
}
ContactDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkContactDependencies";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.analyzeDependencies(result);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ContactDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.employeeContacts == 0) {
        this.show();
    } else {
        var html = 'This Contact has dependencies and can not be deleted<br />';
        html += 'Personal contacts: ' + dependencies.employeeContacts + '<br />';
        doAlert("Dependencies found", html, null, null);
    }
}
ContactDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "You are about to completely delete this Contact. You can not restore it after deletion. Proceed with it?", this, function() {this.doDeleteContact()}, null, null);
}
ContactDeleteForm.prototype.doDeleteContact = function() {
    var form = this;
    var data = {};
    data.command = "deleteContact";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Contact has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ContactDeleteForm.prototype.afterSave = function() {
    $("#admin_info").dialog("close");
    this.successHandler.call(this.successContext);
}

//==================================================


function ContactSetInactiveForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "ContactEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": formData.id,
        "reason": formData.reason
    }
}
ContactSetInactiveForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.show();
}
ContactSetInactiveForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td style="vertical-align: top;"><span class="label1">Reason</span></td><td><textarea id="' + this.htmlId + '_reason" style="width: 300px; height: 100px;"></textarea></td></tr>';
    html += '</table>';
    return html
}
ContactSetInactiveForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_reason').bind("change", function(event) {form.reasonChangedHandle.call(form, event);});
}
ContactSetInactiveForm.prototype.reasonChangedHandle = function(event) {
    this.data.reason = jQuery.trim(event.currentTarget.value);
    this.updateReasonView();
    this.dataChanged(true);
}
ContactSetInactiveForm.prototype.updateView = function() {
    this.updateReasonView();
}
ContactSetInactiveForm.prototype.updateReasonView = function() {
    $('#' + this.htmlId + '_reason').val(this.data.reason);
}
ContactSetInactiveForm.prototype.show = function() {
    var title = 'Set contact inactive';
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 400,
        height: 250,
        buttons: {
            Ok: function() {
                form.save();
            },
            Cancel: function() {
                $(this).dialog( "close" );
                form.dataChanged(false);
            }
	},
        close: function(event, ui) {
            releasePopupLayer();
        } 
    });
}
ContactSetInactiveForm.prototype.validate = function() {
    var errors = [];
    if(this.data.reason == null || this.data.reason == "") {
        errors.push("Reason is not set");
    } else if(this.data.reason.length < 7) {
        errors.push("Reason is too short");
    }
    return errors;
}
ContactSetInactiveForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var serverFormData = clone(this.data);
   
    var form = this;
    var data = {};
    data.command = "setContactInactive";
    data.contactSetInactiveForm = getJSON(serverFormData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Contact has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ContactSetInactiveForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}
ContactSetInactiveForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}

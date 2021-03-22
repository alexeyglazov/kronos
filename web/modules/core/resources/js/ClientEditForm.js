/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ClientEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "ClientEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.moduleName = "Clients";
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.loaded = {
        countries: [],
        subdepartments: []
    }
    this.enums = {
        customerTypes: {
            "PIE": "PIE",
            "OMB": "OMB"
        },
        channelTypes: {
            "CHANNEL1": "Channel 1 (Assurance services)",
            "CHANNEL2": "Channel 2 (Non assurance services)"
        },
        subdepartmentTypes: {
            "AUDIT_GENERAL": "Audit general",
            "AUDIT_BANK": "Audit bank",
            "FINANCIAL_ADVISORY": "Financial advisory",
            "OUTSOURCING": "Outsourcing",
            "TAX_AND_LEGAL": "Tax and legal"       
        },
        clientGroups: {
            "ONE": "1",
            "TWO": "2",
            "THREE": "3",
            "NA": "N/A"              
        }
    }

    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "subdepartmentClientLinks": formData.subdepartmentClientLinks,
        "groupId": formData.groupId,
        "clientGroup": formData.clientGroup,
        "name": formData.name,
        "codeName": formData.codeName,
        "alias": formData.alias,
        
        "legalStreet" : formData.legalStreet,
        "legalZipCode" : formData.legalZipCode,
        "legalCity" : formData.legalCity,
        "legalCountryId" : formData.legalCountryId,
        
        "isPostalAddressEqualToLegal" : formData.isPostalAddressEqualToLegal,
        "postalStreet" : formData.postalStreet,
        "postalZipCode" : formData.postalZipCode,
        "postalCity" : formData.postalCity,
        "postalCountryId" : formData.postalCountryId,
        "phone" : formData.phone,
        "email" : formData.email,
        "taxNumber" : formData.taxNumber,
        "activitySector1Id" : formData.activitySector1Id,
        "activitySector2Id" : formData.activitySector2Id,
        "activitySector3Id" : formData.activitySector3Id,
        "activitySector4Id" : formData.activitySector4Id,
        "activitySector5Id" : formData.activitySector5Id,
        "isListed" : formData.isListed,
        "isReferred" : formData.isReferred,
        "customerType" : formData.customerType,
        "channelType" : formData.channelType,
        "isActive" : formData.isActive,
        "isFuture" : formData.isFuture,
        "isExternal" : formData.isExternal,
        "isTransnational" : formData.isTransnational,
        "countryId" : formData.countryId,
        "listingCountryId" : formData.listingCountryId
    }
    
    this.calculateCustomerTypeView();
}
ClientEditForm.prototype.init = function() {
    if(this.data.mode == "UPDATE") {
        this.checkDependencies();
    } else {
       this.loadInitialContent();
    }
    this.dataChanged(false);
}
ClientEditForm.prototype.loadGroupContent = function() {
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
            form.loaded.group = result.group;
            form.updateGroupView();
            form.updateCountryView();
            form.updateIsReferredView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });    
}
ClientEditForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkClientDependencies";
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
ClientEditForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.projectCodes == 0 && dependencies.contacts == 0 && dependencies.actRequests == 0 && dependencies.invoiceRequests == 0 && dependencies.planningGroups == 0) {
        this.loadInitialContent();
    } else {
        var html = 'This Client has dependencies<br />';
        html += 'Project Codes: ' + dependencies.projectCodes + '<br />';
        html += 'Contacts: ' + dependencies.contacts + '<br />';
        html += 'Act requests: ' + dependencies.actRequests + '<br />';
        html += 'Invoice requests: ' + dependencies.invoiceRequests + '<br />';
        html += 'Planning groups: ' + dependencies.planningGroups + '<br />';
        html += 'Current Name and Code Name will be preserved in history.<br />';
        html += 'Proceed with update?';
        doConfirm("Dependencies found", html, this, this.loadInitialContent, null, null);
    }
}
ClientEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table id="' + this.htmlId + '_form">';
    html += '<tr><td><span class="label1">Leading subdepartments</span></td><td><div id="' + this.htmlId + '_subdepartmentClientLinkBlock"></div></td></tr>';
    html += '<tr id="' + this.htmlId + '_clientGroupBlock"><td><span class="label1">Client group</span></td><td><select id="' + this.htmlId + '_clientGroup" title="Client\'s group according to the quaterly closing classification"></select></td></tr>';
    html += '<tr><td><span class="label1">Group (optional)</span></td><td><input type="text" id="' + this.htmlId + '_group' + '" title="Group"></td>';
        html += '<td><button id="' + this.htmlId + '_group_pick">Pick</button><button id="' + this.htmlId + '_group_clear" title="Clear">Delete</button></td>';
    html += '<tr><td><span class="label1">Name</span></td><td><input type="text" id="' + this.htmlId + '_name" title="Client name"></td></tr>';
    html += '<tr><td><span class="label1">Alias</span> <span class="comment1">Short name for planning</span></td><td><input type="text" id="' + this.htmlId + '_alias" title="Short client name"></td></tr>';
    html += '<tr><td><span class="label1">Code Name</span></td><td><input type="text" id="' + this.htmlId + '_codeName" title="Client code name"></td></tr>';
    html += '<tr><td><span class="label1">Country of origin</span></td><td><select id="' + this.htmlId + '_country" title="Name of the country where client\'s Head Quarter is located"></select><span id="' + this.htmlId + '_countryComment" class="comment1"></span></td></tr>';
    html += '<tr><td><span class="label1">Referred</span></td><td><input type="checkbox" id="' + this.htmlId + '_isReferred" title="Check it if the client has been directed to local office by Mazars group"><span id="' + this.htmlId + '_isReferredComment" class="comment1"></span></td></tr>';
    
    html += '<tr><td><span class="label1">Postal address: street, building, office</span></td><td><input type="text" id="' + this.htmlId + '_postalStreet" title="Postal address street. It is recommended to use language of the country where this company is located"></td></tr>';
    html += '<tr><td><span class="label1">Postal address: ZIP code</span></td><td><input type="text" id="' + this.htmlId + '_postalZipCode" title="Postal address ZIP code"></td></tr>';
    html += '<tr><td><span class="label1">Postal address: city</span></td><td><input type="text" id="' + this.htmlId + '_postalCity" title="Postal address city"></td></tr>';
    html += '<tr><td><span class="label1">Postal address: country</span></td><td><select id="' + this.htmlId + '_postalCountry" title="Postal address country"></select></td></tr>';

    html += '<tr><td><span class="label1">Postal address equals to legal</span></td><td><input type="checkbox" id="' + this.htmlId + '_isPostalAddressEqualToLegal" title="Check it if postal address is the same as legal"></td></tr>';

    html += '<tr id="' + this.htmlId + '_legalStreetBlock"><td><span class="label1">Legal address: street, building, office</span></td><td><input type="text" id="' + this.htmlId + '_legalStreet" title="Legal address street. It is recommended to use language of the country where this client is located"></td></tr>';
    html += '<tr id="' + this.htmlId + '_legalZipCodeBlock"><td><span class="label1">Legal address: ZIP code</span></td><td><input type="text" id="' + this.htmlId + '_legalZipCode" title="Legal address ZIP code"></td></tr>';
    html += '<tr id="' + this.htmlId + '_legalCityBlock"><td><span class="label1">Legal address: city</span></td><td><input type="text" id="' + this.htmlId + '_legalCity" title="Legal address city"></td></tr>';
    html += '<tr id="' + this.htmlId + '_legalCountryBlock"><td><span class="label1">Legal address: country</span></td><td><select id="' + this.htmlId + '_legalCountry" title="Legal address country"></select></td></tr>'; 
    
    html += '<tr><td><span class="label1">Phone</span></td><td><input type="text" id="' + this.htmlId + '_phone" title="Client\'s phone"></td></tr>';
    html += '<tr><td><span class="label1">Email</span></td><td><input type="text" id="' + this.htmlId + '_email" title="Client\'s email"></td></tr>';
    html += '<tr><td><span class="label1">INN (Tax number)</span></td><td><input type="text" id="' + this.htmlId + '_taxNumber" title="Client\'s tax number"></td></tr>';
    html += '<tr><td><span class="label1">Activity Sector 1</span></td><td><select id="' + this.htmlId + '_activitySector1" title="Activity sector. At least one should be set."></select></td></tr>';
    html += '<tr><td><span class="label1">Activity Sector 2</span></td><td><select id="' + this.htmlId + '_activitySector2" title="Second activity sector (optional)"></select></td></tr>';
    html += '<tr><td><span class="label1">Activity Sector 3</span></td><td><select id="' + this.htmlId + '_activitySector3" title="Third activity sector (optional)"></select></td></tr>';
    html += '<tr><td><span class="label1">Activity Sector 4</span></td><td><select id="' + this.htmlId + '_activitySector4" title="Fourth activity sector (optional)"></select></td></tr>';
    html += '<tr><td><span class="label1">Activity Sector 5</span></td><td><select id="' + this.htmlId + '_activitySector5" title="Fifth activity sector (optional)"></select></td></tr>';
    html += '<tr><td><span class="label1">Listed</span></td><td><input type="checkbox" id="' + this.htmlId + '_isListed" title="Check it if the client is listed"></td></tr>';
    html += '<tr id="' + this.htmlId + '_listingCountryBlock"><td><span class="label1">Listing Country</span></td><td><select id="' + this.htmlId + '_listingCountry" title="Country where the company is listed"></select></td></tr>';
    html += '<tr><td><span class="label1">Customer Type</span></td><td><select id="' + this.htmlId + '_customerType" title="PIE (Public Interested Entity, OMB (Own Management Business))"></select><span class="comment1"> is determined by Activity Sector and Listed</span></td></tr>';
    html += '<tr><td><span class="label1">Transnational</span></td><td><select id="' + this.htmlId + '_isTransnational" title="Choose option to display if the client is transnational"></select></td></tr>';
    html += '<tr><td><span class="label1">Channel Type</span></td><td><select id="' + this.htmlId + '_channelType" title="Choose channel type"></select></td></tr>';
    html += '<tr><td><span class="label1">External/Networking</span></td><td><input type="checkbox" id="' + this.htmlId + '_isExternal" title="Check it if the client is external"></td></tr>';
    html += '<tr><td><span class="label1">Potential</span></td><td><input type="checkbox" id="' + this.htmlId + '_isFuture" title="Check it if the client is potential"></td></tr>';
    html += '<tr><td><span class="label1">Active</span></td><td><input type="checkbox" id="' + this.htmlId + '_isActive" title="Check it if the client is active"></td></tr>';
    html += '</table>';
    return html
}
ClientEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_clientGroup').bind("change", function(event) {form.clientGroupChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_name').bind("change", function(event) {form.nameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_alias').bind("change", function(event) {form.aliasChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_codeName').bind("change", function(event) {form.codeNameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_country').bind("change", function(event) {form.countryChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isListed').bind("click", function(event) {form.isListedChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_listingCountry').bind("change", function(event) {form.listingCountryChangedHandle.call(form, event);});

    $('#' + this.htmlId + '_postalStreet').bind("change", function(event) {form.postalStreetChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_postalZipCode').bind("change", function(event) {form.postalZipCodeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_postalCity').bind("change", function(event) {form.postalCityChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_postalCountry').bind("change", function(event) {form.postalCountryChangedHandle.call(form, event);});

    $('#' + this.htmlId + '_isPostalAddressEqualToLegal').bind("click", function(event) {form.isPostalAddressEqualToLegalChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_legalStreet').bind("change", function(event) {form.legalStreetChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_legalZipCode').bind("change", function(event) {form.legalZipCodeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_legalCity').bind("change", function(event) {form.legalCityChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_legalCountry').bind("change", function(event) {form.legalCountryChangedHandle.call(form, event);});

    $('#' + this.htmlId + '_phone').bind("change", function(event) {form.phoneChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_email').bind("change", function(event) {form.emailChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_taxNumber').bind("change", function(event) {form.taxNumberChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_activitySector1').bind("change", function(event) {form.activitySector1ChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_activitySector2').bind("change", function(event) {form.activitySector2ChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_activitySector3').bind("change", function(event) {form.activitySector3ChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_activitySector4').bind("change", function(event) {form.activitySector4ChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_activitySector5').bind("change", function(event) {form.activitySector5ChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isReferred').bind("click", function(event) {form.isReferredChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_customerType').bind("change", function(event) {form.customerTypeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_channelType').bind("change", function(event) {form.channelTypeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isActive').bind("click", function(event) {form.isActiveChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isFuture').bind("click", function(event) {form.isFutureChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isExternal').bind("click", function(event) {form.isExternalChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isTransnational').bind("change", function(event) {form.isTransnationalChangedHandle.call(form, event);});
}
ClientEditForm.prototype.makeDatePickers = function() {
    var form = this;

}
ClientEditForm.prototype.makeButtons = function() {
    var form = this;
    $('#' + this.htmlId + '_group_pick')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.groupPickHandle.call(form);
    });
    
    $('#' + this.htmlId + '_group_clear')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.groupClearHandle.call(form);
    });
}

ClientEditForm.prototype.groupPickHandle = function() {
    this.groupPicker = new GroupPicker("groupPicker", this.groupPicked, this, this.moduleName);
    this.groupPicker.init();
}
ClientEditForm.prototype.groupPicked = function(group) {
    this.data.groupId = group.id;
    this.loadGroupContent();
    this.dataChanged(true);
}
ClientEditForm.prototype.groupClearHandle = function() {
    this.data.groupId = null;
    this.loaded.group = null;
    this.updateGroupView();
    this.updateCountryView();
    this.updateIsReferredView();    
    this.dataChanged(true);
}

ClientEditForm.prototype.nameChangedHandle = function(event) {
    this.data.name = jQuery.trim(event.currentTarget.value);
    this.updateNameView();
    this.dataChanged(true);
}
ClientEditForm.prototype.aliasChangedHandle = function(event) {
    this.data.alias = jQuery.trim(event.currentTarget.value);
    this.updateAliasView();
    this.dataChanged(true);
}
ClientEditForm.prototype.codeNameChangedHandle = function(event) {
    this.data.codeName = jQuery.trim(event.currentTarget.value);
    this.updateCodeNameView();
    this.dataChanged(true);
}
ClientEditForm.prototype.countryChangedHandle = function(event) {
    var countryIdTxt = $('#' + this.htmlId + '_country').val();
    if(countryIdTxt == "") {
        this.data.countryId = null;
    } else {
        this.data.countryId = parseInt(countryIdTxt);
    }
    this.updateCountryView();
    this.dataChanged(true);
}
ClientEditForm.prototype.isListedChangedHandle = function(event) {
    this.data.isListed = $('#' + this.htmlId + '_isListed').is(':checked');
    this.updateIsListedView();
    
    this.calculateCustomerTypeView();
    this.updateCustomerTypeView();
    
    this.dataChanged(true);
}
ClientEditForm.prototype.listingCountryChangedHandle = function(event) {
    var listingCountryIdTxt = $('#' + this.htmlId + '_listingCountry').val();
    if(listingCountryIdTxt == "") {
        this.data.listingCountryId = null;
    } else {
        this.data.listingCountryId = parseInt(listingCountryIdTxt);
    }
    //this.updateListingCountryView();
    this.dataChanged(true);
}

ClientEditForm.prototype.postalStreetChangedHandle = function(event) {
    this.data.postalStreet = jQuery.trim(event.currentTarget.value);
    this.updatePostalStreetView();
    this.dataChanged(true);
}
ClientEditForm.prototype.postalZipCodeChangedHandle = function(event) {
    this.data.postalZipCode = jQuery.trim(event.currentTarget.value);
    this.updatePostalZipCodeView();
    this.dataChanged(true);
}
ClientEditForm.prototype.postalCityChangedHandle = function(event) {
    this.data.postalCity = jQuery.trim(event.currentTarget.value);
    this.updatePostalCityView();
    this.dataChanged(true);
}
ClientEditForm.prototype.postalCountryChangedHandle = function(event) {
    var countryIdTxt = $('#' + this.htmlId + '_postalCountry').val();
    if(countryIdTxt == "") {
        this.data.postalCountryId = null;
    } else {
        this.data.postalCountryId = parseInt(countryIdTxt);
    }
    this.updatePostalCountryView();
    this.dataChanged(true);
}

ClientEditForm.prototype.isPostalAddressEqualToLegalChangedHandle = function(event) {
    this.data.isPostalAddressEqualToLegal = $('#' + this.htmlId + '_isPostalAddressEqualToLegal').is(':checked');
    this.updateIsPostalAddressEqualToLegalView();
    this.dataChanged(true);
}
ClientEditForm.prototype.legalStreetChangedHandle = function(event) {
    this.data.legalStreet = jQuery.trim(event.currentTarget.value);
    this.updateLegalStreetView();
    this.dataChanged(true);
}
ClientEditForm.prototype.legalZipCodeChangedHandle = function(event) {
    this.data.legalZipCode = jQuery.trim(event.currentTarget.value);
    this.updateLegalZipCodeView();
    this.dataChanged(true);
}
ClientEditForm.prototype.legalCityChangedHandle = function(event) {
    this.data.legalCity = jQuery.trim(event.currentTarget.value);
    this.updateLegalCityView();
    this.dataChanged(true);
}
ClientEditForm.prototype.legalCountryChangedHandle = function(event) {
    var countryIdTxt = $('#' + this.htmlId + '_legalCountry').val();
    if(countryIdTxt == "") {
        this.data.legalCountryId = null;
    } else {
        this.data.legalCountryId = parseInt(countryIdTxt);
    }
    this.updateLegalCountryView();
    this.dataChanged(true);
}


ClientEditForm.prototype.phoneChangedHandle = function(event) {
    this.data.phone = jQuery.trim(event.currentTarget.value);
    this.updatePhoneView();
    this.dataChanged(true);
}
ClientEditForm.prototype.emailChangedHandle = function(event) {
    this.data.email = jQuery.trim(event.currentTarget.value);
    this.updateEmailView();
    this.dataChanged(true);
}
ClientEditForm.prototype.taxNumberChangedHandle = function(event) {
    this.data.taxNumber = jQuery.trim(event.currentTarget.value);
    this.updateTaxNumberView();
    this.dataChanged(true);
}
ClientEditForm.prototype.activitySector1ChangedHandle = function(event) {
    var activitySector1IdTxt = $('#' + this.htmlId + '_activitySector1').val();
    if(activitySector1IdTxt == "") {
        this.data.activitySector1Id = null;
    } else {
        this.data.activitySector1Id = parseInt(activitySector1IdTxt);
    }
    this.updateActivitySector1View();
    
    this.calculateCustomerTypeView();
    this.updateCustomerTypeView();
    
    this.dataChanged(true);
}
ClientEditForm.prototype.activitySector2ChangedHandle = function(event) {
    var activitySector2IdTxt = $('#' + this.htmlId + '_activitySector2').val();
    if(activitySector2IdTxt == "") {
        this.data.activitySector2Id = null;
    } else {
        this.data.activitySector2Id = parseInt(activitySector2IdTxt);
    }
    this.updateActivitySector2View();
    
    this.calculateCustomerTypeView();
    this.updateCustomerTypeView();
       
    this.dataChanged(true);
}
ClientEditForm.prototype.activitySector3ChangedHandle = function(event) {
    var activitySector3IdTxt = $('#' + this.htmlId + '_activitySector3').val();
    if(activitySector3IdTxt == "") {
        this.data.activitySector3Id = null;
    } else {
        this.data.activitySector3Id = parseInt(activitySector3IdTxt);
    }
    this.updateActivitySector3View();
    
    this.calculateCustomerTypeView();
    this.updateCustomerTypeView();
    
    this.dataChanged(true);
}
ClientEditForm.prototype.activitySector4ChangedHandle = function(event) {
    var activitySector4IdTxt = $('#' + this.htmlId + '_activitySector4').val();
    if(activitySector4IdTxt == "") {
        this.data.activitySector4Id = null;
    } else {
        this.data.activitySector4Id = parseInt(activitySector4IdTxt);
    }
    this.updateActivitySector4View();
        
    this.calculateCustomerTypeView();
    this.updateCustomerTypeView();
    
    this.dataChanged(true);
}
ClientEditForm.prototype.activitySector5ChangedHandle = function(event) {
    var activitySector5IdTxt = $('#' + this.htmlId + '_activitySector5').val();
    if(activitySector5IdTxt == "") {
        this.data.activitySector5Id = null;
    } else {
        this.data.activitySector5Id = parseInt(activitySector5IdTxt);
    }
    this.updateActivitySector5View();
    
    this.calculateCustomerTypeView();
    this.updateCustomerTypeView();
      
    this.dataChanged(true);
}
ClientEditForm.prototype.isReferredChangedHandle = function(event) {
    this.data.isReferred = $('#' + this.htmlId + '_isReferred').is(':checked');
    this.updateIsReferredView();
    this.dataChanged(true);
}
ClientEditForm.prototype.customerTypeChangedHandle = function(event) {
    var customerTypeTxt = $('#' + this.htmlId + '_customerType').val();
    if(customerTypeTxt == "") {
        this.data.customerType = null;
    } else {
        this.data.customerType = customerTypeTxt;
    }
    this.updateCustomerTypeView();
    this.dataChanged(true);
}
ClientEditForm.prototype.channelTypeChangedHandle = function(event) {
    var channelTypeTxt = $('#' + this.htmlId + '_channelType').val();
    if(channelTypeTxt == "") {
        this.data.channelType = null;
    } else {
        this.data.channelType = channelTypeTxt;
    }
    this.updateChannelTypeView();
    this.dataChanged(true);
}
ClientEditForm.prototype.isActiveChangedHandle = function(event) {
    this.data.isActive = $('#' + this.htmlId + '_isActive').is(':checked');
    this.updateIsActiveView();
    this.dataChanged(true);
}
ClientEditForm.prototype.isFutureChangedHandle = function(event) {
    this.data.isFuture = $('#' + this.htmlId + '_isFuture').is(':checked');
    this.updateIsFutureView();
    this.dataChanged(true);
}
ClientEditForm.prototype.isExternalChangedHandle = function(event) {
    this.data.isExternal = $('#' + this.htmlId + '_isExternal').is(':checked');
    this.updateIsExternalView();
    this.dataChanged(true);
}
ClientEditForm.prototype.isTransnationalChangedHandle = function(event) {
    var isTransnationalTxt = $('#' + this.htmlId + '_isTransnational').val();
    if(isTransnationalTxt == "") {
        this.data.isTransnational = null;
    } else if(isTransnationalTxt == "true") {
        this.data.isTransnational = true;
    } else if(isTransnationalTxt == "false") {
        this.data.isTransnational = false;
    }
    this.updateIsTransnationalView();
    this.dataChanged(true);
}
ClientEditForm.prototype.updateView = function() {
    this.updateGroupView();
    this.updateSubdepartmentClientLinkBlockView();
    this.updateClientGroupView();
    this.updateNameView();
    this.updateAliasView();
    this.updateCodeNameView();
    this.updateCountryView();
    this.updateIsListedView();
    this.updateListingCountryView();
    
    this.updateLegalStreetView();
    this.updateLegalZipCodeView();
    this.updateLegalCityView();
    this.updateLegalCountryView();

    this.updateIsPostalAddressEqualToLegalView();
    this.updatePostalStreetView();
    this.updatePostalZipCodeView();
    this.updatePostalCityView();
    this.updatePostalCountryView();

    this.updatePhoneView();  
    this.updateEmailView();
    this.updateTaxNumberView();
    this.updateActivitySector1View();
    this.updateActivitySector2View();
    this.updateActivitySector3View();
    this.updateActivitySector4View();
    this.updateActivitySector5View();
    this.updateIsReferredView();
    this.updateCustomerTypeView();
    this.updateChannelTypeView();
    this.updateIsActiveView();
    this.updateIsFutureView();
    this.updateIsExternalView();
    this.updateIsTransnationalView();
}
ClientEditForm.prototype.updateGroupView = function() {
    $('#' + this.htmlId + '_group').attr("disabled", true);
    var groupName = "";
    if(this.loaded.group != null) {
        groupName = this.loaded.group.name;
    }
    $('#' + this.htmlId + '_group').val(groupName);
}
ClientEditForm.prototype.updateSubdepartmentClientLinkBlockView = function() {
    var html = '';
    var isOutsourcing = false;
    if(this.data.subdepartmentClientLinks.length > 0) {
        for(var key1 in this.data.subdepartmentClientLinks) {
            var subdepartmentClientLink = this.data.subdepartmentClientLinks[key1];
            for(var key2 in this.loaded.subdepartments) {
                var subdepartment = this.loaded.subdepartments[key2];
                if(subdepartment.subdepartmentId == subdepartmentClientLink.subdepartmentId) {
                    html += subdepartment.officeName + ' / ' + subdepartment.departmentName + ' / ' + subdepartment.subdepartmentName + '<br />';
                    if(subdepartment.subdepartmentName.toLowerCase().indexOf('outsourcing') != -1) {
                        isOutsourcing = true;
                    }
                    break;
                }
            }
        }
    } else {
        html += 'Undefined';
    }
    $('#' + this.htmlId + '_subdepartmentClientLinkBlock').html(html);
    if(isOutsourcing) {
        $('#' + this.htmlId + '_clientGroupBlock').show();
    } else {
        $('#' + this.htmlId + '_clientGroupBlock').hide();        
    }
}
ClientEditForm.prototype.updateClientGroupView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.enums.clientGroups) {
        var clientGroup = this.enums.clientGroups[key];
        var isSelected = "";
        if(key == this.data.clientGroup) {
           isSelected = "selected";
        }
        html += '<option value="' + key + '" ' + isSelected + '>' + clientGroup + '</option>';
    }
    $('#' + this.htmlId + '_clientGroup').html(html);
}
ClientEditForm.prototype.updateNameView = function() {
    $('#' + this.htmlId + '_name').val(this.data.name);
}
ClientEditForm.prototype.updateAliasView = function() {
    $('#' + this.htmlId + '_alias').val(this.data.alias);
}
ClientEditForm.prototype.updateCodeNameView = function() {
    $('#' + this.htmlId + '_codeName').val(this.data.codeName);
}
ClientEditForm.prototype.updateCountryView = function() {
    var html = '';
    var countryId = this.data.countryId;
    var comment = '';
    var disabled = false;
    if(this.data.groupId != null) {
        countryId = this.loaded.group.countryId;
        comment = 'Inherited from Group';
        disabled = true;
    }
    html += '<option value="">...</option>';
    for(var key in this.loaded.countries) {
        var country = this.loaded.countries[key];
        var isSelected = "";
        if(country.id == countryId) {
           isSelected = "selected";
        }
        html += '<option value="' + country.id + '" ' + isSelected + '>' + country.name + '</option>';
    }
    $('#' + this.htmlId + '_country').html(html);
    $('#' + this.htmlId + '_countryComment').html(comment);
    $('#' + this.htmlId + '_country').attr("disabled", disabled);
}
ClientEditForm.prototype.updateIsListedView = function() {
    $('#' + this.htmlId + '_isListed').attr("checked", this.data.isListed);
    if(this.data.isListed) {
        $('#' + this.htmlId + '_listingCountryBlock').show('slow');
    } else {
        $('#' + this.htmlId + '_listingCountryBlock').hide('hide');
    }
}
ClientEditForm.prototype.updateListingCountryView = function() {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.loaded.countries) {
        var country = this.loaded.countries[key];
        var isSelected = "";
        if(country.id == this.data.listingCountryId) {
           isSelected = "selected";
        }
        html += '<option value="' + country.id + '" ' + isSelected + '>' + country.name + '</option>';
    }
    $('#' + this.htmlId + '_listingCountry').html(html);
}

ClientEditForm.prototype.updatePostalStreetView = function() {
    $('#' + this.htmlId + '_postalStreet').val(this.data.postalStreet);
}
ClientEditForm.prototype.updatePostalZipCodeView = function() {
    $('#' + this.htmlId + '_postalZipCode').val(this.data.postalZipCode);
}
ClientEditForm.prototype.updatePostalCityView = function() {
    $('#' + this.htmlId + '_postalCity').val(this.data.postalCity);
}
ClientEditForm.prototype.updatePostalCountryView = function() {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.loaded.countries) {
        var country = this.loaded.countries[key];
        var isSelected = "";
        if(country.id == this.data.postalCountryId) {
           isSelected = "selected";
        }
        html += '<option value="' + country.id + '" ' + isSelected + '>' + country.name + '</option>';
    }
    $('#' + this.htmlId + '_postalCountry').html(html);
}
ClientEditForm.prototype.updateIsPostalAddressEqualToLegalView = function() {
    $('#' + this.htmlId + '_isPostalAddressEqualToLegal').attr("checked", this.data.isPostalAddressEqualToLegal);
    if(this.data.isPostalAddressEqualToLegal != true) {
        $('#' + this.htmlId + '_legalStreetBlock').show('slow');
        $('#' + this.htmlId + '_legalZipCodeBlock').show('slow');
        $('#' + this.htmlId + '_legalCityBlock').show('slow');
        $('#' + this.htmlId + '_legalCountryBlock').show('slow');
    } else {
        $('#' + this.htmlId + '_legalStreetBlock').hide('slow');
        $('#' + this.htmlId + '_legalZipCodeBlock').hide('slow');
        $('#' + this.htmlId + '_legalCityBlock').hide('slow');
        $('#' + this.htmlId + '_legalCountryBlock').hide('slow');       
    }
}
ClientEditForm.prototype.updateLegalStreetView = function() {
    $('#' + this.htmlId + '_legalStreet').val(this.data.legalStreet);
}
ClientEditForm.prototype.updateLegalZipCodeView = function() {
    $('#' + this.htmlId + '_legalZipCode').val(this.data.legalZipCode);
}
ClientEditForm.prototype.updateLegalCityView = function() {
    $('#' + this.htmlId + '_legalCity').val(this.data.legalCity);
}
ClientEditForm.prototype.updateLegalCountryView = function() {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.loaded.countries) {
        var country = this.loaded.countries[key];
        var isSelected = "";
        if(country.id == this.data.legalCountryId) {
           isSelected = "selected";
        }
        html += '<option value="' + country.id + '" ' + isSelected + '>' + country.name + '</option>';
    }
    $('#' + this.htmlId + '_legalCountry').html(html);
}


ClientEditForm.prototype.updatePhoneView = function() {
    $('#' + this.htmlId + '_phone').val(this.data.phone);
}
ClientEditForm.prototype.updateEmailView = function() {
    $('#' + this.htmlId + '_email').val(this.data.email);
}
ClientEditForm.prototype.updateTaxNumberView = function() {
    $('#' + this.htmlId + '_taxNumber').val(this.data.taxNumber);
}
ClientEditForm.prototype.updateActivitySector1View = function() {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.loaded.activitySectors) {
       var activitySector = this.loaded.activitySectors[key];
       var isSelected = "";
       if(activitySector.id == this.data.activitySector1Id) {
           isSelected = "selected";
       }
       html += '<option value="' + activitySector.id + '" ' + isSelected + '>' + activitySector.name + '</option>';         
    }
    $('#' + this.htmlId + '_activitySector1').html(html);
}
ClientEditForm.prototype.updateActivitySector2View = function() {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.loaded.activitySectors) {
       var activitySector = this.loaded.activitySectors[key];
       var isSelected = "";
       if(activitySector.id == this.data.activitySector2Id) {
           isSelected = "selected";
       }
       html += '<option value="' + activitySector.id + '" ' + isSelected + '>' + activitySector.name + '</option>';         
    }
    $('#' + this.htmlId + '_activitySector2').html(html);
}
ClientEditForm.prototype.updateActivitySector3View = function() {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.loaded.activitySectors) {
       var activitySector = this.loaded.activitySectors[key];
       var isSelected = "";
       if(activitySector.id == this.data.activitySector3Id) {
           isSelected = "selected";
       }
       html += '<option value="' + activitySector.id + '" ' + isSelected + '>' + activitySector.name + '</option>';         
    }
    $('#' + this.htmlId + '_activitySector3').html(html);
}
ClientEditForm.prototype.updateActivitySector4View = function() {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.loaded.activitySectors) {
       var activitySector = this.loaded.activitySectors[key];
       var isSelected = "";
       if(activitySector.id == this.data.activitySector4Id) {
           isSelected = "selected";
       }
       html += '<option value="' + activitySector.id + '" ' + isSelected + '>' + activitySector.name + '</option>';         
    }
    $('#' + this.htmlId + '_activitySector4').html(html);
}
ClientEditForm.prototype.updateActivitySector5View = function() {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.loaded.activitySectors) {
       var activitySector = this.loaded.activitySectors[key];
       var isSelected = "";
       if(activitySector.id == this.data.activitySector5Id) {
           isSelected = "selected";
       }
       html += '<option value="' + activitySector.id + '" ' + isSelected + '>' + activitySector.name + '</option>';         
    }
    $('#' + this.htmlId + '_activitySector5').html(html);
}

ClientEditForm.prototype.updateIsReferredView = function() {
    var isReferred = this.data.isReferred;
    var comment = '';
    var disabled = false;
    if(this.data.groupId != null) {
        isReferred = this.loaded.group.isReferred;
        comment = 'Inherited from Group';
        disabled = true;
    }
    $('#' + this.htmlId + '_isReferred').attr("checked", isReferred);
    $('#' + this.htmlId + '_isReferredComment').html(comment);
    $('#' + this.htmlId + '_isReferred').attr("disabled", disabled);
}
ClientEditForm.prototype.updateCustomerTypeView = function() {
    $('#' + this.htmlId + '_customerType').attr("disabled", true);
    
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.enums.customerTypes) {
        var customerType = this.enums.customerTypes[key];
        var isSelected = "";
        if(key == this.data.customerType) {
           isSelected = "selected";
        }
        html += '<option value="' + key + '" ' + isSelected + '>' + customerType + '</option>';
    }
    $('#' + this.htmlId + '_customerType').html(html);
}
ClientEditForm.prototype.updateChannelTypeView = function() {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.enums.channelTypes) {
        var channelType = this.enums.channelTypes[key];
        var isSelected = "";
        if(key == this.data.channelType) {
           isSelected = "selected";
        }
        html += '<option value="' + key + '" ' + isSelected + '>' + channelType + '</option>';
    }
    $('#' + this.htmlId + '_channelType').html(html);
}

ClientEditForm.prototype.updateIsActiveView = function() {
    $('#' + this.htmlId + '_isActive').attr("checked", this.data.isActive);
}
ClientEditForm.prototype.updateIsFutureView = function() {
    $('#' + this.htmlId + '_isFuture').attr("checked", this.data.isFuture);
}
ClientEditForm.prototype.updateIsExternalView = function() {
    $('#' + this.htmlId + '_isExternal').attr("checked", this.data.isExternal);
}
ClientEditForm.prototype.updateIsTransnationalView = function() {
    var html = '';
    html += '<option value="" selected>...</option>';
    html += '<option value="false" ' + (this.data.isTransnational === false ? 'selected' : '') + '>No</option>';
    html += '<option value="true" ' + (this.data.isTransnational === true ? 'selected' : '') + '>Yes</option>';
    $('#' + this.htmlId + '_isTransnational').html(html);
}

ClientEditForm.prototype.loadInitialContent = function() {
   var form = this;
    var data = {};
    data.command = "getInitialContent";
    if(this.data.groupId != null) {
        data.groupId = this.data.groupId;
    }
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.subdepartments = result.subdepartments;
            form.loaded.countries = result.countries;
            form.loaded.group = result.group;
            form.loaded.activitySectors = result.activitySectors;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ClientEditForm.prototype.show = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    var title = 'Update Client'
    if(this.data.mode == 'CREATE') {
        title = 'Create Client';
    }
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeDatePickers();
    this.makeButtons();

    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 600,
        height: 500,
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
ClientEditForm.prototype.validate = function() {
    var errors = [];
    var nameRE = /^[a-zA-Z0-9 \-+&]*$/;
    var codeNameRE = /^[A-Z0-9-+&]*$/;
    var dunsRE = /^[0-9]{9}$/;
    var emailRE = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if(this.data.name == null || this.data.name == "") {
        errors.push("Name is not set");
    } else if(!nameRE.test(this.data.name)) {
        errors.push("Name has incorrect format. Latin letters, numerals, +, -, & and blank spaces are allowed only.");
    }        
    if(this.data.isFuture == true || this.data.isActive == false || this.data.isExternal == true) {
        return errors;
    }
    if(this.data.name == null || this.data.name == "") {
        errors.push("Name is not set");
    } else if(!nameRE.test(this.data.name)) {
      errors.push("Name has incorrect format. Latin letters, numerals, +, -, & and blank spaces are allowed only.");
    }

    if(this.data.codeName == null || this.data.codeName == "") {
        errors.push("Code Name is not set");
    } else if(!codeNameRE.test(this.data.codeName)) {
      errors.push("Code Name has incorrect format. Capital latin letters, numerals, +, -, & are allowed only.");
    }
    if(this.data.email == null || this.data.email == "") {
    } else if(!emailRE.test(this.data.email)) {
        errors.push("Email has incorrect format");
    }
    if(this.data.groupId != null) {
        if(this.loaded.group.countryId == null) {
            errors.push("Selected group has no country of origin");
        }
    } else if(this.data.countryId == null) {
            errors.push("Country of origin is not selected");
    }
    
    if(this.data.postalStreet == null || this.data.postalStreet == "") {
        errors.push("Postal address street is not selected");
    }
    if(this.data.postalZipCode == null || this.data.postalZipCode == "") {
        errors.push("Postal address ZIP code is not selected");
    }
    if(this.data.postalCity == null || this.data.postalCity == "") {
        errors.push("Postal address city is not selected");
    }
    if(this.data.postalCountryId == null) {
        errors.push("Postal address country is not selected");
    }    
    
    if(this.data.isPostalAddressEqualToLegal != true) {
        if(this.data.legalStreet == null || this.data.legalStreet == "") {
            errors.push("Legal address street is not selected");
        }
        if(this.data.legalZipCode == null || this.data.legalZipCode == "") {
            errors.push("Legal address ZIP code is not selected");
        }
        if(this.data.legalCity == null || this.data.legalCity == "") {
            errors.push("Legal address city is not selected");
        }
        if(this.data.legalCountryId == null) {
            errors.push("Legal address country is not selected");
        }  
    }
    
    if(this.data.isListed && this.data.listingCountryId == null) {
        errors.push("Listing Country is not selected");
    }
    if(this.data.activitySector1Id == null &&
       this.data.activitySector2Id == null &&
       this.data.activitySector3Id == null &&
       this.data.activitySector4Id == null && 
       this.data.activitySector5Id == null
    ) {
        errors.push("Activity Sector is not selected");
    } else {
        var repeated = false;
        if(this.data.activitySector1Id != null && (this.data.activitySector1Id == this.data.activitySector2Id || this.data.activitySector1Id == this.data.activitySector3Id || this.data.activitySector1Id == this.data.activitySector4Id || this.data.activitySector1Id == this.data.activitySector5Id)) {
            repeated = true;
        }
        if(this.data.activitySector2Id != null && (this.data.activitySector2Id == this.data.activitySector1Id || this.data.activitySector2Id == this.data.activitySector3Id || this.data.activitySector2Id == this.data.activitySector4Id || this.data.activitySector2Id == this.data.activitySector5Id)) {
            repeated = true;
        }
        if(this.data.activitySector3Id != null && (this.data.activitySector3Id == this.data.activitySector1Id || this.data.activitySector3Id == this.data.activitySector2Id || this.data.activitySector3Id == this.data.activitySector4Id || this.data.activitySector3Id == this.data.activitySector5Id)) {
            repeated = true;
        }
        if(this.data.activitySector4Id != null && (this.data.activitySector4Id == this.data.activitySector1Id || this.data.activitySector4Id == this.data.activitySector2Id || this.data.activitySector4Id == this.data.activitySector3Id || this.data.activitySector4Id == this.data.activitySector5Id)) {
            repeated = true;
        }
        if(this.data.activitySector5Id != null && (this.data.activitySector5Id == this.data.activitySector1Id || this.data.activitySector5Id == this.data.activitySector2Id || this.data.activitySector5Id == this.data.activitySector3Id || this.data.activitySector5Id == this.data.activitySector4Id)) {
            repeated = true;
        }     
        if(repeated) {
            errors.push("Activity Sectors are repeated");
        }
    }
    if(this.data.customerType == null) {
        errors.push("Customer Type is not selected");
    }

    return errors;
}
ClientEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var serverFormatData = clone(this.data);
    var isAssignedToOutsourcing = false;
    for(var key in this.data.subdepartmentClientLinks) {
        var subdepartmentId = this.data.subdepartmentClientLinks[key].subdepartmentId;
        for(var key2 in this.loaded.subdepartments) {
            var subdepartment = this.loaded.subdepartments[key2];
            if(subdepartment.subdepartmentId == subdepartmentId) {
                if(subdepartment.subdepartmentName.toLowerCase().indexOf('outsourcing') != -1) {
                    isAssignedToOutsourcing = true;
                    break;
                }
            }
        }
        if(isAssignedToOutsourcing) {
            break;
        }
    }
    if(isAssignedToOutsourcing) {
        this.data.clientGroup = null;
    }
    if(this.data.groupId != null) {
        serverFormatData.countryId = this.loaded.group.countryId;
        serverFormatData.isReferred = this.loaded.group.isReferred;
    }
    if(! this.data.isListed) {
        serverFormatData.isListed = false; // exclude null
        serverFormatData.listingCountryId = null;
    }
    if(! this.data.isActive) {
        serverFormatData.isActive = false; // exclude null
    }

    if(this.data.isFuture == null) {
       serverFormatData.isFuture = false; 
    }
    if(this.data.isExternal == null) {
       serverFormatData.isExternal = false; 
    }
    var form = this;
    var data = {};
    data.command = "saveClient";
    data.clientEditForm = getJSON(serverFormatData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Client has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ClientEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}
ClientEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}
ClientEditForm.prototype.calculateCustomerTypeView = function() {
    var specialActivitySectorNames = ['Banks', 'Insurers', 'Capital markets'];
    var isSpecial = false;
    var activitySector1 = this.getActivitySector(this.data.activitySector1Id);
    var activitySector2 = this.getActivitySector(this.data.activitySector2Id);
    var activitySector3 = this.getActivitySector(this.data.activitySector3Id);
    var activitySector4 = this.getActivitySector(this.data.activitySector4Id);
    var activitySector5 = this.getActivitySector(this.data.activitySector5Id);
    if(activitySector1 != null && $.inArray(activitySector1.name, specialActivitySectorNames) != -1) {
        isSpecial = true;
    } else if(activitySector2 != null && $.inArray(activitySector2.name, specialActivitySectorNames) != -1) {
        isSpecial = true;
    } else if(activitySector3 != null && $.inArray(activitySector3.name, specialActivitySectorNames) != -1) {
        isSpecial = true;
    } else if(activitySector4 != null && $.inArray(activitySector4.name, specialActivitySectorNames) != -1) {
        isSpecial = true;
    } else if(activitySector5 != null && $.inArray(activitySector5.name, specialActivitySectorNames) != -1) {
        isSpecial = true;
    }
    if(isSpecial) {
        this.data.customerType = 'PIE';
        return;
    }
    if(this.data.isListed) {
        this.data.customerType = 'PIE';
        return;        
    } else if(! this.data.isListed) {
        this.data.customerType = 'OMB';
        return;        
    }
    this.data.customerType = null;
    return;            
}
ClientEditForm.prototype.getActivitySector = function(activitySectorId) {
    if(activitySectorId == null) {
        return null;
    }
    for(var key in this.loaded.activitySectors) {
        var activitySector = this.loaded.activitySectors[key];
        if(activitySector.id == activitySectorId) {
            return activitySector;
        }
    }
    return null;
}



//==================================================

function ClientDeleteForm(clientId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "ClientEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": clientId
    }
}
ClientDeleteForm.prototype.start = function() {
    this.checkDependencies();
}
ClientDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkClientDependencies";
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
ClientDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.projectCodes == 0 && dependencies.contacts == 0 && dependencies.actRequests == 0 && dependencies.invoiceRequests == 0 && dependencies.planningGroups == 0) {
        this.show();
    } else {
        var html = 'This Client has dependencies and can not be deleted<br />';
        html += 'Project Codes: ' + dependencies.projectCodes + '<br />';
        html += 'Contacts: ' + dependencies.contacts + '<br />';
        html += 'Act requests: ' + dependencies.actRequests + '<br />';
        html += 'Invoice requests: ' + dependencies.invoiceRequests + '<br />';
        html += 'Planning groups: ' + dependencies.planningGroups + '<br />';        
        doAlert("Dependencies found", html, null, null);
    }
}
ClientDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this Client", this, function() {this.doDeleteClient()}, null, null);
}
ClientDeleteForm.prototype.doDeleteClient = function() {
    var form = this;
    var data = {};
    data.command = "deleteClient";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Client has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ClientDeleteForm.prototype.afterSave = function() {
    $("#admin_info").dialog("close");
    this.successHandler.call(this.successContext);
}

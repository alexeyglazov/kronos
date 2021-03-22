/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function GroupEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "GroupEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.moduleName = "Clients";    
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.loaded = {
        countries: []
    }
    this.disabled = {
        "name": true,
        "alias": true,
        "country": true,
        "isListed": true,
        "listingCountry": true
    };
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "name": formData.name,
        "alias": formData.alias,
        "countryId": formData.countryId,
        "isListed": formData.isListed,
        "listingCountryId": formData.listingCountryId,
        "isReferred" : formData.isReferred,
        "isMazarsAudit" : formData.isMazarsAudit
    }
}
GroupEditForm.prototype.start = function() {
    if(this.data.mode == "UPDATE") {
        //this.checkDependencies();
        this.disabled = {
            "name": false,
            "alias": false,
            "country": false,
            "isListed": false,
            "listingCountry": false
        };
        this.loadCountries();
    } else {
       this.disabled = {
        "name": false,
        "alias": false,
        "country": false,
        "isListed": false,
        "listingCountry": false
       };        
       this.loadCountries();
    }
    this.dataChanged(false);
}
GroupEditForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkGroupDependencies";
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
GroupEditForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.clients == 0) {
        this.disabled = {
            "name": false,
            "alias": false,
            "country": false,
            "isListed": false,
            "listingCountry": false
        };
        this.loadCountries();
    } else {
        var html = 'This Group has dependencies. Only "Alias" and "Country" properties are updatable.<br />';
        html += 'Clients: ' + dependencies.clients + '<br />';
        this.disabled = {
            "name": true,
            "alias": false,
            "country": false,
            "isListed": true,
            "listingCountry": true
        };
        doAlert("Dependencies found", html, this, this.loadCountries);
    }
}
GroupEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table id="' + this.htmlId + '_form">';
    html += '<tr><td>Name</td><td><input type="text" id="' + this.htmlId + '_name" title="Name of the group"></td></tr>';
    html += '<tr><td>Alias</td><td><input type="text" id="' + this.htmlId + '_alias" title="Short name of the group"></td></tr>';
    html += '<tr><td>Country of origin</td><td><select id="' + this.htmlId + '_country" title="Name of the country where the group\'s Head Quarter is located"></select></td></tr>';
    html += '<tr><td>Listed</td><td><input type="checkbox" id="' + this.htmlId + '_isListed" title="Check it if the group is listed"></td></tr>';
    html += '<tr id="' + this.htmlId + '_listingCountryBlock"><td>Listing Country</td><td><select id="' + this.htmlId + '_listingCountry" title="Name of the country where the group is listed"></select></td></tr>';
    html += '<tr><td>Referred</td><td><input type="checkbox" id="' + this.htmlId + '_isReferred" title="Check it if the group has been directed to local office by Mazars group"></td></tr>';
    html += '<tr><td>Group audit by Mazars</td><td><input type="checkbox" id="' + this.htmlId + '_isMazarsAudit" title="Check it if the group is audited by Mazars"></td></tr>';
    html += '</table>';
    return html
}
GroupEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_name').bind("change", function(event) {form.nameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_alias').bind("change", function(event) {form.aliasChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_country').bind("change", function(event) {form.countryChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isListed').bind("click", function(event) {form.isListedChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_listingCountry').bind("change", function(event) {form.listingCountryChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isReferred').bind("click", function(event) {form.isReferredChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isMazarsAudit').bind("click", function(event) {form.isMazarsAuditChangedHandle.call(form, event);});
}
GroupEditForm.prototype.nameChangedHandle = function(event) {
    this.data.name = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
GroupEditForm.prototype.aliasChangedHandle = function(event) {
    this.data.alias = jQuery.trim(event.currentTarget.value);
    this.updateAliasView();
    this.dataChanged(true);
}
GroupEditForm.prototype.countryChangedHandle = function(event) {
    var countryIdTxt = $('#' + this.htmlId + '_country').val();
    if(countryIdTxt == "") {
        this.data.countryId = null;
    } else {
        this.data.countryId = parseInt(countryIdTxt);
    }
    this.updateView();
    this.dataChanged(true);
}
GroupEditForm.prototype.isListedChangedHandle = function(event) {
    this.data.isListed = $('#' + this.htmlId + '_isListed').is(':checked');
    this.updateView();
    this.dataChanged(true);
}
GroupEditForm.prototype.listingCountryChangedHandle = function(event) {
    var listingCountryIdTxt = $('#' + this.htmlId + '_listingCountry').val();
    if(listingCountryIdTxt == "") {
        this.data.listingCountryId = null;
    } else {
        this.data.listingCountryId = parseInt(listingCountryIdTxt);
    }
    this.updateView();
    this.dataChanged(true);
}
GroupEditForm.prototype.isReferredChangedHandle = function(event) {
    this.data.isReferred = $('#' + this.htmlId + '_isReferred').is(':checked');
    this.updateIsReferredView();
    this.dataChanged(true);
}
GroupEditForm.prototype.isMazarsAuditChangedHandle = function(event) {
    this.data.isMazarsAudit = $('#' + this.htmlId + '_isMazarsAudit').is(':checked');
    this.updateIsMazarsAuditView();
    this.dataChanged(true);
}
GroupEditForm.prototype.updateView = function() {
    this.updateNameView();
    this.updateAliasView();
    this.updateCountryView();
    this.updateIsListedView();
    this.updateListingCountryView();
    this.updateIsReferredView();
    this.updateIsMazarsAuditView();    
}
GroupEditForm.prototype.updateNameView = function() {
    $('#' + this.htmlId + '_name').val(this.data.name);
    $('#' + this.htmlId + '_name').attr("disabled", this.disabled.name);
}
GroupEditForm.prototype.updateAliasView = function() {
    $('#' + this.htmlId + '_alias').val(this.data.alias);
    $('#' + this.htmlId + '_alias').attr("disabled", this.disabled.alias);
}
GroupEditForm.prototype.updateCountryView = function() {
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
    $('#' + this.htmlId + '_country').attr("disabled", this.disabled.country);
}
GroupEditForm.prototype.updateIsListedView = function() {
    $('#' + this.htmlId + '_isListed').attr("checked", this.data.isListed);
    if(this.data.isListed) {
        $('#' + this.htmlId + '_listingCountryBlock').show('slow');
    } else {
        $('#' + this.htmlId + '_listingCountryBlock').hide('slow');
    }
    $('#' + this.htmlId + '_isListed').attr("disabled", this.disabled.isListed);
}
GroupEditForm.prototype.updateListingCountryView = function() {
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
    $('#' + this.htmlId + '_listingCountry').attr("disabled", this.disabled.listingCountry);
}
GroupEditForm.prototype.updateIsReferredView = function() {
    $('#' + this.htmlId + '_isReferred').attr("checked", this.data.isReferred);
}
GroupEditForm.prototype.updateIsMazarsAuditView = function() {
    $('#' + this.htmlId + '_isMazarsAudit').attr("checked", this.data.isMazarsAudit);
}
GroupEditForm.prototype.loadCountries = function() {
   var form = this;
    var data = {};
    data.command = "getCountries";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.countries = result.countries;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
GroupEditForm.prototype.show = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    var title = 'Update Group'
    if(this.data.mode == 'CREATE') {
        title = 'Create Group';
    }
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 500,
        height: 300,
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
GroupEditForm.prototype.validate = function() {
    var errors = [];
    if(this.data.name == null || this.data.name == "") {
        errors.push("Name is not set");
    }
    if(this.data.countryId == null) {
        errors.push("Country is not selected");
    }
    if(this.data.isListed && this.data.listingCountryId == null) {
        errors.push("Listing Country is not selected");
    }
    return errors;
}
GroupEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var serverFormatData = clone(this.data);
    if(! this.data.isReferred) {
        serverFormatData.isReferred = false; // exclude null
    }
    if(! this.data.isMazarsAudit) {
        serverFormatData.isMazarsAudit = false; // exclude null
    }    
    var form = this;
    var data = {};
    data.command = "saveGroup";
    data.groupEditForm = getJSON(serverFormatData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Group has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
GroupEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}

GroupEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}


//==================================================

function GroupDeleteForm(groupId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "GroupEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": groupId
    }
}
GroupDeleteForm.prototype.start = function() {
    this.checkDependencies();
}
GroupDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkGroupDependencies";
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
GroupDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.clients == 0) {
        this.show();
    } else {
        var html = 'This Group has dependencies and can not be deleted<br />';
        html += 'Clients: ' + dependencies.clients + '<br />';
        doAlert("Dependencies found", html, null, null);
    }
}
GroupDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this Group", this, function() {this.doDeleteGroup()}, null, null);
}
GroupDeleteForm.prototype.doDeleteGroup = function() {
    var form = this;
    var data = {};
    data.command = "deleteGroup";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Group has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
GroupDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}
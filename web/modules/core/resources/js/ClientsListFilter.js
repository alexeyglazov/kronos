/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ClientsListFilter(htmlId, moduleName, filter, callback, callbackContext) {
    this.config = {
        endpointUrl: endpointsFolder + "ClientsListFilter.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.moduleName = moduleName;
    this.callback = callback;
    this.callbackContext = callbackContext;
    this.disabled = {
        "id": false,
        "name": false,
        "group": false,
        "office": false,
        "department": false,
        "subdepartment": false,
        "isCountryDefined": false,
        "country": false,
        "activitySectorGroup": false,
        "activitySector": false,
        "isListed": false,
        "isReferred": false,
        "isActive": false,
        "isFuture": false,
        "isExternal": false,
        "isTransnational": false
    };
    if(filter != null) {
        this.filter = clone(filter);
    } else {
        this.filter = {
            "id": null,
            "name": null,
            "groupId": null,
            "officeId": null,
            "departmentId": null,
            "subdepartmentId": null,
            "isCountryDefined": null,
            "countryId": null,
            "activitySectorGroupId": null,
            "activitySectorId": null,
            "isListed": null,
            "isReferred": null,
            "isActive": null,
            "isFuture": null,
            "isExternal": null,
            "isTransnational": null
        };
    } 
    this.loaded = {
        groups: [],
        offices: [],
        departments: [],
        subdepartments: [],
        isoCountries: [],
        activitySectorGroups: [],
        activitySectors: []
    }
    this.internalFilter = {
        'group': null
    }
}
ClientsListFilter.prototype.isFilterUsed = function(filter) {
    if(filter.id != null) {
        return true;
    }
    if(filter.name != null && filter.name != '') {
        return true;
    }
    if(filter.groupId != null) {
        return true;
    }
    if(filter.officeId != null) {
        return true;
    }
    if(filter.departmentId != null) {
        return true;
    }
    if(filter.subdepartmentId != null) {
        return true;
    }
    if(filter.isCountryDefined != null) {
        return true;
    }
    if(filter.countryId != null) {
        return true;
    }
    if(filter.activitySectorGroupId != null) {
        return true;
    }
    if(filter.activitySectorId != null) {
        return true;
    }
    if(filter.isListed != null) {
        return true;
    }
    if(filter.isReferred != null) {
        return true;
    }
    if(filter.isActive != null) {
        return true;
    }
    if(filter.isFuture != null) {
        return true;
    }
    if(filter.isExternal != null) {
        return true;
    }
    if(filter.isTransnational != null) {
        return true;
    }
    return false;        
}
ClientsListFilter.prototype.getDefaultFilter = function() {
    return {
        "id": null,
        "name": null,
        "groupId": null,
        "officeId": null,
        "departmentId": null,
        "subdepartmentId": null,
        "isCountryDefined": null,
        "countryId": null,
        "activitySectorGroupId": null,
        "activitySectorId": null,
        "isListed": null,
        "isReferred": null,
        "isActive": null,
        "isFuture": null,
        "isExternal": null,
        "isTransnational": null        
    }
}
ClientsListFilter.prototype.normalizeFilter = function(obj) {
    var normalizedFilter = {
        "id": obj.id,
        "name": obj.name,
        "groupId": obj.groupId,
        "officeId": obj.officeId,
        "departmentId": obj.departmentId,
        "subdepartmentId": obj.subdepartmentId,
        "isCountryDefined": obj.isCountryDefined,
        "countryId": obj.countryId,
        "activitySectorGroupId": obj.activitySectorGroupId,
        "activitySectorId": obj.activitySectorId,
        "isListed": obj.isListed,
        "isReferred": obj.isReferred,
        "isActive": obj.isActive,
        "isFuture": obj.isFuture,
        "isExternal": obj.isExternal,
        "isTransnational": obj.isTransnational
    }
    return normalizedFilter;
}
ClientsListFilter.prototype.setDisabled = function(disabled) {
    for(var key in this.disabled) {
        this.disabled[key] = false;
    }
    for(var key in disabled) {
        this.disabled[key] = disabled[key];
    }
}
ClientsListFilter.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
}
ClientsListFilter.prototype.loadInitialContent = function() {
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
            form.loaded.offices = result.offices;
            form.loaded.departments = result.departments;
            form.loaded.subdepartments = result.subdepartments;
            form.loaded.isoCountries = result.isoCountries;
            form.loaded.activitySectorGroups = result.activitySectorGroups;
            form.loaded.activitySectors = result.activitySectors;
            
            form.filter.groupId = result.groupId;
            form.filter.countryId = result.countryId;
            form.filter.activitySectorGroupId = result.activitySectorGroupId;
            form.filter.activitySectorId = result.activitySectorId;
            form.filter.officeId = result.officeId;
            form.filter.departmentId = result.departmentId;
            form.filter.subdepartmentId = result.subdepartmentId;
            
            form.show();
        })          
       },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ClientsListFilter.prototype.loadOfficeContent = function() {
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

            form.filter.departmentId = null;
            form.filter.subdepartmentId = null;
            form.updateDepartmentView();
            form.updateSubdepartmentView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ClientsListFilter.prototype.loadDepartmentContent = function() {
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

            form.filter.subdepartmentId = null;
            form.updateSubdepartmentView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ClientsListFilter.prototype.loadActivitySectorGroupContent = function() {
    var form = this;
    var data = {};
    data.command = "getActivitySectorGroupContent";
    data.moduleName = this.moduleName;
    if(this.filter.activitySectorGroupId != null) {
        data.activitySectorGroupId = this.filter.activitySectorGroupId;
    }
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.activitySectors = result.activitySectors;
            form.filter.activitySectorId = null;
            form.updateActivitySectorView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}

ClientsListFilter.prototype.getLayoutHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td>';
    html += '<button id="' + this.htmlId + '_reset">Reset all</button>';
    html += '</td></tr>';
    html += '</table>';
    
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td>Field Name</td><td>Filter</td></tr>';
    html += '<tr><td>Name</td><td><input type="text" id="' + this.htmlId + '_name" style="width: 300px;"><button id="' + this.htmlId + '_name_clear">Clear</button><br /><span class="comment1">Use the asterisk (*) wildcard character to search</span></td></tr>';
    html += '<tr><td>Group</td><td><input type="text" id="' + this.htmlId + '_groupFilter" style="width: 60px;"><br /><select id="' + this.htmlId + '_group"></td></tr>';
    html += '<tr><td>Office</td><td><select type="text" id="' + this.htmlId + '_office"></td></tr>';
    html += '<tr><td>Department</td><td><select type="text" id="' + this.htmlId + '_department"></td></tr>';
    html += '<tr><td>Subdepartment</td><td><select type="text" id="' + this.htmlId + '_subdepartment"></td></tr>';
    html += '<tr><td>Activity sector group</td><td><select type="text" id="' + this.htmlId + '_activitySectorGroup"></td></tr>';
    html += '<tr><td>Activity sector</td><td><select type="text" id="' + this.htmlId + '_activitySector"></td></tr>';
    html += '<tr><td>Country defined</td><td><select id="' + this.htmlId + '_isCountryDefined"></select></td></tr>';
    html += '<tr id="' + this.htmlId + '_countryBlock"><td>Country</td><td><select type="text" id="' + this.htmlId + '_country"></td></tr>';
    html += '<tr><td>Listed</td><td><select id="' + this.htmlId + '_isListed"></select></td></tr>';
    html += '<tr><td>Referred</td><td><select id="' + this.htmlId + '_isReferred"></select></td></tr>';
    html += '<tr><td>Active</td><td><select id="' + this.htmlId + '_isActive"></select></td></tr>';
    html += '<tr><td>Future</td><td><select id="' + this.htmlId + '_isFuture"></select></td></tr>';
    html += '<tr><td>External</td><td><select id="' + this.htmlId + '_isExternal"></select></td></tr>';
    html += '<tr><td>Transnational</td><td><select id="' + this.htmlId + '_isTransnational"></select></td></tr>';
    html += '</table>';
    return html;
}
ClientsListFilter.prototype.show = function() {
    var title = 'Filter data'
    var form = this;
    $('#' + this.containerHtmlId).html(this.getLayoutHtml());
    this.setHandlers();
    this.makeButtons();
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
ClientsListFilter.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_groupFilter').bind("change", function(event) {form.groupFilterChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_clientFilter').bind("change", function(event) {form.clientFilterChangedHandle.call(form, event);});
    
    $('#' + this.htmlId + '_name').bind("change", function(event) {form.nameChangedHandle.call(form)});
    $('#' + this.htmlId + '_group').bind("change", function(event) {form.groupChangedHandle.call(form)});
    $('#' + this.htmlId + '_office').bind("change", function(event) {form.officeChangedHandle.call(form)});
    $('#' + this.htmlId + '_department').bind("change", function(event) {form.departmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_subdepartment').bind("change", function(event) {form.subdepartmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_activitySectorGroup').bind("change", function(event) {form.activitySectorGroupChangedHandle.call(form)});
    $('#' + this.htmlId + '_activitySector').bind("change", function(event) {form.activitySectorChangedHandle.call(form)});
    $('#' + this.htmlId + '_isCountryDefined').bind("change", function(event) {form.isCountryDefinedChangedHandle.call(form)});
    $('#' + this.htmlId + '_country').bind("change", function(event) {form.countryChangedHandle.call(form)});
    $('#' + this.htmlId + '_isListed').bind("change", function(event) {form.isListedChangedHandle.call(form)});
    $('#' + this.htmlId + '_isReferred').bind("change", function(event) {form.isReferredChangedHandle.call(form)});
    $('#' + this.htmlId + '_isActive').bind("change", function(event) {form.isActiveChangedHandle.call(form)});    
    $('#' + this.htmlId + '_isFuture').bind("change", function(event) {form.isFutureChangedHandle.call(form)});
    $('#' + this.htmlId + '_isExternal').bind("change", function(event) {form.isExternalChangedHandle.call(form)});
    $('#' + this.htmlId + '_isTransnational').bind("change", function(event) {form.isTransnationalChangedHandle.call(form)});    
}
ClientsListFilter.prototype.makeButtons = function() {
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
    
    $('#' + this.htmlId + '_name_clear')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.nameClearHandle.call(form, event);
    });    
}
ClientsListFilter.prototype.makeDatePickers = function() {
    var form = this;
    //$('#' + this.htmlId + '_createdAt_from').datepicker({
    //    dateFormat: 'dd.mm.yy',
    //    onSelect: function(dateText, inst) {form.createdAtFromSelectHandle(dateText, inst)}
    //});
}
ClientsListFilter.prototype.reset = function(event) {
    this.filter = this.getDefaultFilter();
    this.loadInitialContent();
}
ClientsListFilter.prototype.groupFilterChangedHandle = function(event) {
    var value = $('#' + this.htmlId + '_groupFilter').val();
    value = $.trim(value);
    if(value != this.internalFilter.group) {
        this.internalFilter.group = value;
        this.filter.groupId = null;
        this.updateGroupView();
    }
    this.updateGroupFilterView();
}

ClientsListFilter.prototype.nameChangedHandle = function(event) {
    if(this.disabled.name) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        this.filter.name = jQuery.trim($('#' + this.htmlId + '_name').val());
    }
    this.updateNameView();    
}
ClientsListFilter.prototype.nameClearHandle = function() {
    if(this.disabled.code) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {    
        this.filter.name = '';
    }
    this.updateNameView();
}

ClientsListFilter.prototype.groupChangedHandle = function() {
    var htmlId = $('#' + this.htmlId + '_group').val();
    if(htmlId == '') {
        this.filter.groupId = null;
    } else {
        this.filter.groupId = parseInt(htmlId);
    }
}
ClientsListFilter.prototype.officeChangedHandle = function() {
    var htmlId = $('#' + this.htmlId + '_office').val();
    if(htmlId == '') {
        this.filter.officeId = null;
    } else {
        this.filter.officeId = parseInt(htmlId);
    }
    if(this.filter.officeId == null) {
        this.loaded.departments = [];
        this.loaded.subdepartments = [];
        this.filter.departmentId = null;
        this.filter.subdepartmentId = null;
        this.updateDepartmentView();
        this.updateSubdepartmentView();
    } else {
        this.loadOfficeContent();
    }
}
ClientsListFilter.prototype.departmentChangedHandle = function() {
    var htmlId = $('#' + this.htmlId + '_department').val();
    if(htmlId == '') {
        this.filter.departmentId = null;
    } else {
        this.filter.departmentId = parseInt(htmlId);
    }
    if(this.filter.departmentId == null) {
        this.loaded.subdepartments = [];
        this.filter.subdepartmentId = null;
        this.updateSubdepartmentView();
    } else {
        this.loadDepartmentContent();
    }
}
ClientsListFilter.prototype.subdepartmentChangedHandle = function() {
    var htmlId = $('#' + this.htmlId + '_subdepartment').val();
    if(htmlId == '') {
        this.filter.subdepartmentId = null;
    } else {
        this.filter.subdepartmentId = parseInt(htmlId);
    }
}
ClientsListFilter.prototype.activitySectorGroupChangedHandle = function() {
    var htmlId = $('#' + this.htmlId + '_activitySectorGroup').val();
    if(htmlId == '') {
        this.filter.activitySectorGroupId = null;
    } else {
        this.filter.activitySectorGroupId = parseInt(htmlId);
    }
    this.loadActivitySectorGroupContent();
}
ClientsListFilter.prototype.activitySectorChangedHandle = function() {
    var htmlId = $('#' + this.htmlId + '_activitySector').val();
    if(htmlId == null || htmlId == '') {
        this.filter.activitySectorId = null;
    } else {
        this.filter.activitySectorId = parseInt(htmlId);
    }
}
ClientsListFilter.prototype.isCountryDefinedChangedHandle = function(event) {
    if(this.disabled.isCountryDefined) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        if($('#' + this.htmlId + '_isCountryDefined').val() == 'ALL') {
            this.filter.isCountryDefined = null;
        } else {
            this.filter.isCountryDefined = $('#' + this.htmlId + '_isCountryDefined').val();
        }
    }
    if(this.filter.isCountryDefined != 'TRUE') {
        this.filter.countryId = null;
    }
    this.updateIsCountryDefinedView();
    this.updateCountryView();
}
ClientsListFilter.prototype.countryChangedHandle = function() {
    var htmlId = $('#' + this.htmlId + '_country').val();
    if(htmlId == null || htmlId == '') {
        this.filter.countryId = null;
    } else {
        this.filter.countryId = parseInt(htmlId);
    }
}
ClientsListFilter.prototype.isListedChangedHandle = function(event) {
    if(this.disabled.isClosed) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        if($('#' + this.htmlId + '_isListed').val() == 'ALL') {
            this.filter.isListed = null;
        } else {
            this.filter.isListed = $('#' + this.htmlId + '_isListed').val();
        }
    }
    this.updateIsListedView();
}
ClientsListFilter.prototype.isReferredChangedHandle = function(event) {
    if(this.disabled.isClosed) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        if($('#' + this.htmlId + '_isReferred').val() == 'ALL') {
            this.filter.isReferred = null;
        } else {
            this.filter.isReferred = $('#' + this.htmlId + '_isReferred').val();
        }
    }
    this.updateIsReferredView();
}
ClientsListFilter.prototype.isActiveChangedHandle = function(event) {
    if(this.disabled.isClosed) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        if($('#' + this.htmlId + '_isActive').val() == 'ALL') {
            this.filter.isActive = null;
        } else {
            this.filter.isActive = $('#' + this.htmlId + '_isActive').val();
        }
    }
    this.updateIsActiveView();
}
ClientsListFilter.prototype.isFutureChangedHandle = function(event) {
    if(this.disabled.isFuture) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        if($('#' + this.htmlId + '_isFuture').val() == 'ALL') {
            this.filter.isFuture = null;
        } else {
            this.filter.isFuture = $('#' + this.htmlId + '_isFuture').val();
        }
    }
    this.updateIsFutureView();
}
ClientsListFilter.prototype.isExternalChangedHandle = function(event) {
    if(this.disabled.isExternal) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        if($('#' + this.htmlId + '_isExternal').val() == 'ALL') {
            this.filter.isExternal = null;
        } else {
            this.filter.isExternal = $('#' + this.htmlId + '_isExternal').val();
        }
    }
    this.updateIsExternalView();
}
ClientsListFilter.prototype.isTransnationalChangedHandle = function(event) {
    if(this.disabled.isTransnational) {
        doAlert('Alert', 'This field is disabled', null, null);
    } else {
        if($('#' + this.htmlId + '_isTransnational').val() == 'ALL') {
            this.filter.isTransnational = null;
        } else {
            this.filter.isTransnational = $('#' + this.htmlId + '_isTransnational').val();
        }
    }
    this.updateIsTransnationalView();
}

ClientsListFilter.prototype.updateView = function() {
    this.updateGroupFilterView();    
    this.updateNameView();
    this.updateGroupView();
    this.updateOfficeView();
    this.updateDepartmentView();
    this.updateSubdepartmentView();   
    this.updateActivitySectorGroupView();
    this.updateActivitySectorView();
    this.updateIsCountryDefinedView();
    this.updateCountryView();
    this.updateIsListedView();
    this.updateIsReferredView();
    this.updateIsActiveView();
    this.updateIsFutureView();
    this.updateIsExternalView();
    this.updateIsTransnationalView();
}

ClientsListFilter.prototype.updateGroupFilterView = function() {
    $('#' + this.htmlId + '_groupFilter').val(this.internalFilter.group);
}

ClientsListFilter.prototype.updateNameView = function() {
    $('#' + this.htmlId + '_name').val(this.filter.name);
}
ClientsListFilter.prototype.updateGroupView = function() {
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
ClientsListFilter.prototype.updateOfficeView = function() {
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
ClientsListFilter.prototype.updateDepartmentView = function() {
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
ClientsListFilter.prototype.updateSubdepartmentView = function() {
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
ClientsListFilter.prototype.updateActivitySectorGroupView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.activitySectorGroups) {
        var activitySectorGroup = this.loaded.activitySectorGroups[key];
        var isSelected = "";
        if(activitySectorGroup.id == this.filter.activitySectorGroupId) {
           isSelected = "selected";
        }
        html += '<option value="' + activitySectorGroup.id + '" ' + isSelected + '>' + activitySectorGroup.name + '</option>';
    }
    $('#' + this.htmlId + '_activitySectorGroup').html(html);
}
ClientsListFilter.prototype.updateActivitySectorView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.activitySectors) {
        var activitySector = this.loaded.activitySectors[key];
        var isSelected = "";
        if(activitySector.id == this.filter.activitySectorId) {
           isSelected = "selected";
        }
        html += '<option value="' + activitySector.id + '" ' + isSelected + '>' + activitySector.name + '</option>';
    }
    $('#' + this.htmlId + '_activitySector').html(html);
}
ClientsListFilter.prototype.updateIsCountryDefinedView = function() {
    var options = {"ALL": "All", "TRUE": "Yes", "FALSE": "No"}
    this.updateSelectorView(this.htmlId + '_isCountryDefined', this.filter.isCountryDefined, options);
    if(this.filter.isCountryDefined == 'TRUE') {
        $('#' + this.htmlId + '_countryBlock').show();
    } else {
        $('#' + this.htmlId + '_countryBlock').hide();
    }
}
ClientsListFilter.prototype.updateCountryView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.isoCountries) {
        var country = this.loaded.isoCountries[key];
        var isSelected = "";
        if(country.id == this.filter.countryId) {
           isSelected = "selected";
        }
        html += '<option value="' + country.id + '" ' + isSelected + '>' + country.name + '</option>';
    }
    $('#' + this.htmlId + '_country').html(html);
}
ClientsListFilter.prototype.updateIsListedView = function() {
    var options = {"ALL": "All", "TRUE": "Yes", "FALSE": "No"}
    this.updateSelectorView(this.htmlId + '_isListed', this.filter.isListed, options);
}
ClientsListFilter.prototype.updateIsReferredView = function() {
    var options = {"ALL": "All", "TRUE": "Yes", "FALSE": "No"}
    this.updateSelectorView(this.htmlId + '_isReferred', this.filter.isReferred, options);
}
ClientsListFilter.prototype.updateIsActiveView = function() {
    var options = {"ALL": "All", "TRUE": "Yes", "FALSE": "No"}
    this.updateSelectorView(this.htmlId + '_isActive', this.filter.isActive, options);
}
ClientsListFilter.prototype.updateIsFutureView = function() {
    var options = {"ALL": "All", "TRUE": "Yes", "FALSE": "No"}
    this.updateSelectorView(this.htmlId + '_isFuture', this.filter.isFuture, options);
}
ClientsListFilter.prototype.updateIsExternalView = function() {
    var options = {"ALL": "All", "TRUE": "Yes", "FALSE": "No"}
    this.updateSelectorView(this.htmlId + '_isExternal', this.filter.isExternal, options);
}
ClientsListFilter.prototype.updateIsTransnationalView = function() {
    var options = {"ALL": "All", "TRUE": "Yes", "FALSE": "No"}
    this.updateSelectorView(this.htmlId + '_isTransnational', this.filter.isTransnational, options);
}
ClientsListFilter.prototype.updateSelectorView = function(id, value, options) {
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
ClientsListFilter.prototype.okHandle = function() {
    this.callback.call(this.callbackContext, this.filter);
}

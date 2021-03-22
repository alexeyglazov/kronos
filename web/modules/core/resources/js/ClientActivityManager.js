/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ClientActivityManager(htmlId, containerHtmlId) {
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.moduleName = "Clients";
    this.config = {
         endpointUrl: endpointsFolder + "ClientActivityManager.jsp"
    };
    this.loaded = {
        "countries": [],
        "languages": [],
        "clientActivityInfoItems": []
    };
    this.selected = {
        "clientIds": []
    }
    this.clientActivityFilter = {
        "projectsCount": null,
        "startDate" : null,
        "endDate" : null        
    }
    this.clientFilter = ClientsListFilter.prototype.getDefaultFilter();    
    var filterStr = getCookie("clientsListFilter");
    if(filterStr != null) {
        try{
            this.clientFilter = ClientsListFilter.prototype.normalizeFilter(jQuery.parseJSON(filterStr));
        } catch (e) {
            deleteCookie("clientsListFilter");
        }
    }
    var now = new Date();
    this.clientActivityFilter.endDate = {
        year: now.getFullYear(),
        month: now.getMonth(),
        dayOfMonth: now.getDate()
    }
    this.clientActivityFilter.startDate = getShiftedYearMonthDate(this.clientActivityFilter.endDate, -183);
    
    this.limiter = {
        "page": 0,
        "itemsPerPage": 100
    };
    this.sorter = {
        "field": 'NAME',
        "order": 'ASC'
    };
}
ClientActivityManager.prototype.init = function() {
    contentSizeChangedEventSubscribers.push({"context": this, "function": this.normalizeContentSize});
    this.makeLayout();
    this.normalizeContentSize();
    this.makeButtons();
    this.setHandlers();
    this.loadInitialContent();
}
ClientActivityManager.prototype.makeLayout = function() {
    var html = '';
    html += '<div id="' + this.htmlId + '_panel"></div><br />';
    html += '<div><span id="' + this.htmlId + '_clientsLimiter"></span> <span id="' + this.htmlId + '_clientsCount"></span> <span id="' + this.htmlId + '_selectorCount"></span></div>';
    html += '<div id="' + this.htmlId + '_clients" style="height: 100px; width: 100px; overflow: auto;"></div>';
    $('#' + this.containerHtmlId).html(html);   
}
ClientActivityManager.prototype.makeButtons = function() {
    var form = this;
}    
ClientActivityManager.prototype.setHandlers = function() {
    var form = this;
}
ClientActivityManager.prototype.clientClickedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    this.selected.clientIds = [];
    this.selected.clientIds.push(id);
    this.clientSelectionChangedHandle();
}
ClientActivityManager.prototype.clientSelectorClickedHandle = function(event) {
    this.selected.clientIds = [];
    for(var key in this.loaded.clientActivityInfoItems) {
        var clientActivityInfoItem = this.loaded.clientActivityInfoItems[key];
        if( $('#' + this.htmlId + '_clientSelect_' + clientActivityInfoItem.clientId).is(':checked') ) {
            this.selected.clientIds.push(clientActivityInfoItem.clientId);
        }
    } 
    this.clientSelectionChangedHandle();     
}
ClientActivityManager.prototype.clientSelectionChangedHandle = function() {     
    this.updatePanelView();
    this.updateClientsSelection();
}
ClientActivityManager.prototype.projectsCountChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_projectsCount').val();
    if(idTxt == '') {
        this.clientActivityFilter.projectsCount = null;
    }
    this.clientActivityFilter.projectsCount = idTxt;
    this.loadClients();
}
ClientActivityManager.prototype.startDateChangedHandle = function(dateText, inst) {
    this.processStartDateChanged(dateText);
}
ClientActivityManager.prototype.startDateTextChangedHandle = function(event) {
    var dateText = $(event.currentTarget).val();
    this.processStartDateChanged(dateText);
}
ClientActivityManager.prototype.processStartDateChanged = function(dateText) {
    if(dateText == null || jQuery.trim(dateText) == '') {
        this.clientActivityFilter.startDate = null;
    } else {
        if(isDateValid(dateText)) {
            this.clientActivityFilter.startDate = getYearMonthDateFromDateString(jQuery.trim(dateText));
        } else {
        }
    }
    this.updateStartDateView();
    this.loadClients();
}
ClientActivityManager.prototype.endDateChangedHandle = function(dateText, inst) {
    this.processEndDateChanged(dateText);
}
ClientActivityManager.prototype.endDateTextChangedHandle = function(event) {
    var dateText = $(event.currentTarget).val();
    this.processEndDateChanged(dateText);
}
ClientActivityManager.prototype.processEndDateChanged = function(dateText) {
    if(dateText == null || jQuery.trim(dateText) == '') {
        this.clientActivityFilter.endDate = null;
    } else {
        if(isDateValid(dateText)) {
            this.clientActivityFilter.endDate = getYearMonthDateFromDateString(jQuery.trim(dateText));
        } else {
        }
    }
    this.updateEndDateView();
    this.loadClients();
}
ClientActivityManager.prototype.getContentForClient = function() {
    if(this.selected.clientIds == null || this.selected.clientIds.length != 1) {
        doAlert('Alert', 'Select one client please', null, null);
        return;
    }
    var form = this;
    this.loadContentForClient();
}
ClientActivityManager.prototype.setActive = function(isActive) {
    if(this.selected.clientIds == null || this.selected.clientIds.length == 0) {
        doAlert('Alert', 'Select one or more clients please', null, null);
        return;
    }
    var form = this;
    doConfirm('Confirm', 'Proceed with changing active status of selected clients?', this, function() {form.doSetActive(isActive)}, null, null);
}
ClientActivityManager.prototype.doSetActive = function(isActive) {
    var form = this;
    var data = {};
    data.command = "setActive";
    data.clientIds = getJSON({"list": this.selected.clientIds});
    data.isActive = isActive;   
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            this.selected.clientIds = [];
            doAlert("Info", "Active status has been successfully set", form, form.loadClients);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });

}
ClientActivityManager.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.clientFilter = getJSON(this.clientFilter);
    data.clientActivityFilter = getJSON(this.clientActivityFilter);
    data.sorter = getJSON(this.sorter);
    data.limiter = getJSON(this.limiter);    
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.clientActivityInfoItems = result.clientActivityInfoItems;
            form.totalClientsCount = result.totalClientsCount;
            form.foundClientsCount = result.foundClientsCount;
            form.loaded.subdepartments = result.subdepartments;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ClientActivityManager.prototype.loadClients = function() {
    var form = this;
    var data = {};
    data.command = "getClients";
    data.clientFilter = getJSON(this.clientFilter);
    data.clientActivityFilter = getJSON(this.clientActivityFilter);
    data.sorter = getJSON(this.sorter);
    data.limiter = getJSON(this.limiter);    
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.clientActivityInfoItems = result.clientActivityInfoItems;
            form.totalClientsCount = result.totalClientsCount;
            form.foundClientsCount = result.foundClientsCount;
            form.updateClientsView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ClientActivityManager.prototype.loadContentForClient = function() {
    var form = this;
    var data = {};
    data.command = "getContentForClient";
    data.clientId = this.selected.clientIds[0];
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.group = result.group;
            form.loaded.client = result.client;
            form.loaded.subdepartmentClientLinks = result.subdepartmentClientLinks;
            form.loaded.contacts = result.contacts;
            form.loaded.clientHistoryItems = result.clientHistoryItems;
            form.updateClientView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ClientActivityManager.prototype.updateView = function() {
    this.updatePanelView();
    this.updateClientsView();
}
ClientActivityManager.prototype.updatePanelView = function() {
    var html = '';
    html += '<table>';
    html += '<tr>';
    html += '<td></td>';
    html += '<td><span class="label1">Active projects</span></td>';
    html += '<td><span class="label1">From</span></td>';
    html += '<td><span class="label1">To</span></td>';
    html + '</tr>';
    html += '<tr>';
    html += '<td id="' + this.htmlId + '_clientFilterCell"><button id="' + this.htmlId + '_clientFilterBtn" title="Client filter">Client filter</button></td>';
    html += '<td><select id="' + this.htmlId + '_projectsCount" title="Filters clients by active projects count"></select></td>';
    html += '<td><input type="text" id="' + this.htmlId + '_startDate' + '" title="Filters clients by their projects dates"></td>';
    html += '<td><input type="text" id="' + this.htmlId + '_endDate' + '" title="Filters clients by their projects dates"></td>';
    html += '<td><button id="' + this.htmlId + '_getClientDetailsBtn" title="See details">Details</button></td>';
    html += '<td><button id="' + this.htmlId + '_setActiveBtn" title="Set active">Set active</button></td>';
    html += '<td><button id="' + this.htmlId + '_setInactiveBtn" title="Set inactive">Set inactive</button></td>';
    html += '</tr>';
    html += '</table>';    
    $('#' + this.htmlId + '_panel').html(html);
    this.updateFilterSelectionView();

    var form = this;
    $('#' + this.htmlId + '_clientFilterBtn').button({
        icons: {
            primary: "ui-icon-search"
        }
    }).click(function(event) {
        form.showClientsListFilter.call(form);
    });
    
    $('#' + this.htmlId + '_getClientDetailsBtn').button({
        icons: {
            primary: "ui-icon-comment"
        }
    }).click(function(event) {
        form.getContentForClient.call(form, true);
    });

    $('#' + this.htmlId + '_setActiveBtn').button({
        icons: {
            primary: "ui-icon-star"
        }
    }).click(function(event) {
        form.setActive.call(form, true);
    });
    
    $('#' + this.htmlId + '_setInactiveBtn').button({
        icons: {
            primary: "ui-icon-cancel"
        }
    }).click(function(event) {
        form.setActive.call(form, false);
    });

    $('#' + this.htmlId + '_projectsCount').bind("change", function(event) {form.projectsCountChangedHandle.call(form)});
    $('#' + this.htmlId + '_startDate').bind("change", function(event) {form.startDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_endDate').bind("change", function(event) {form.endDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_startDate').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.startDateChangedHandle(dateText, inst)}
    });
    $('#' + this.htmlId + '_endDate').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.endDateChangedHandle(dateText, inst)}
    });
    
    this.updateProjectsCountView();
    this.updateStartDateView();
    this.updateEndDateView();
}
ClientActivityManager.prototype.updateFilterSelectionView = function() {
    if(ClientsListFilter.prototype.isFilterUsed(this.clientFilter)) {
        $('#' + this.htmlId + '_clientFilterCell').css('border-left', '3px solid #009900');
    } else {
        $('#' + this.htmlId + '_clientFilterCell').css('border-left', '0px');
    }
}
ClientActivityManager.prototype.updateProjectsCountView = function() {
    var values = {
        'ZERO': '0',
        'MORE_THAN_ZERO': 'More than 0'
    }    
    var html = "";
    html += '<option value="">All</option>';
    for(var key in values) {
        var value = values[key];
        var isSelected = "";
        if(key == this.clientActivityFilter.projectsCount) {
           isSelected = "selected";
        }
        html += '<option value="'+ key +'" ' + isSelected + '>' + value + '</option>';
    }
    $('#' + this.htmlId + '_projectsCount').html(html);
}
ClientActivityManager.prototype.updateClientView = function() {
    var client = clone(this.loaded.client);
    var subdepartments = [];
    var country;
    var listingCountry;
    var legalCountry;
    var postalCountry;
    var activitySectors = [];
    for(var key1 in this.loaded.subdepartmentClientLinks) {
        var subdepartmentClientLink = this.loaded.subdepartmentClientLinks[key1];
        for(var key2 in this.loaded.subdepartments) {
            var subdepartment = this.loaded.subdepartments[key2];
            if(subdepartment.subdepartmentId == subdepartmentClientLink.subdepartmentId) {
                subdepartments.push(subdepartment);
                break;
            }
        }
    }
    for(var key in this.loaded.countries) {
        var countryTmp = this.loaded.countries[key];
        if(countryTmp.id == this.loaded.client.countryId) {
            country = countryTmp;
            break;
        }
    }
    for(var key in this.loaded.countries) {
        var countryTmp = this.loaded.countries[key];
        if(countryTmp.id == this.loaded.client.legalCountryId) {
            legalCountry = countryTmp;
            break;
        }
    }
    for(var key in this.loaded.countries) {
        var countryTmp = this.loaded.countries[key];
        if(countryTmp.id == this.loaded.client.postalCountryId) {
            postalCountry = countryTmp;
            break;
        }
    }      
    for(var key in this.loaded.countries) {
        var countryTmp = this.loaded.countries[key];
        if(countryTmp.id == this.loaded.client.listingCountryId) {
            listingCountry = countryTmp;
            break;
        }
    }
      
    for(var key in this.loaded.client.activitySectorIds) {
        var activitySectorId = this.loaded.client.activitySectorIds[key];
        for(var key2 in this.loaded.activitySectors) {
            var activitySectorTmp = this.loaded.activitySectors[key2];
            if(activitySectorTmp.id == activitySectorId) {
                activitySectors.push(activitySectorTmp);
                break;
            }
        }
    }

    if(country != null) {
      client.countryName = country.name;
    } else {
      client.countryName = "Not defined";
    }
    if(legalCountry != null) {
      client.legalCountryName = legalCountry.name;
    } else {
      client.legalCountryName = "Not set"
    }
    if(postalCountry != null) {
      client.postalCountryName = postalCountry.name;
    } else {
      client.postalCountryName = "Not set"
    }      
    if(listingCountry != null) {
      client.listingCountryName = listingCountry.name;
    } else {
      client.listingCountryName = "Not applicable"
    }
    client.subdepartmentNames = '';
    var isOutsourcing = false;
    if(subdepartments.length > 0) {
        for(var key in subdepartments) {
          var subdepartment = subdepartments[key];
          client.subdepartmentNames += subdepartment.officeName + ' / ' + subdepartment.departmentName + ' / ' + subdepartment.subdepartmentName + '<br />';
          if(subdepartment.subdepartmentName.toLowerCase().indexOf('outsourcing') != -1) {
              isOutsourcing = true;
              break;
          }          
        }
    } else {
      client.subdepartmentNames = "Not defined";
    }
    if(isOutsourcing) {
        client.clientGroupName = this.enums.clientGroups[client.clientGroup];
    }

    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td colspan="2">Client</td></tr>';
    html += '<tr><td>Leading subdepartments</td><td>' + client.subdepartmentNames + '</td></tr>';
    if(isOutsourcing) {
      html += '<tr><td>Group of client</td><td>' + client.clientGroupName + '</td></tr>';
    }
    html += '<tr><td>Name</td><td>' + client.name + '</td></tr>';
    html += '<tr><td>Alias</td><td>' + client.alias + '</td></tr>';
    html += '<tr><td>Code Name</td><td>' + client.codeName + '</td></tr>';
    html += '<tr><td>Country of origin</td><td>' + client.countryName + '</td></tr>';
      
    html += '<tr><td>Legal address: street</td><td>' + client.legalStreet + '</td></tr>';
    html += '<tr><td>Legal address: ZIP Code</td><td>' + client.legalZipCode + '</td></tr>';
    html += '<tr><td>Legal address: city</td><td>' + client.legalCity + '</td></tr>';
    html += '<tr><td>Legal address: country</td><td>' + client.legalCountryName + '</td></tr>';
    html += '<tr><td>Postal address equals to legal</td><td>' + booleanVisualizer.getHtml(client.isPostalAddressEqualToLegal) + '</td></tr>';
    if(client.isPostalAddressEqualToLegal != true) {
      html += '<tr><td>Postal address: street</td><td>' + client.postalStreet + '</td></tr>';
      html += '<tr><td>Postal address: ZIP Code</td><td>' + client.postalZipCode + '</td></tr>';
      html += '<tr><td>Postal address: city</td><td>' + client.postalCity + '</td></tr>';
      html += '<tr><td>Postal address: country</td><td>' + client.postalCountryName + '</td></tr>';
    }

    html += '<tr><td>Phone</td><td>' + client.phone + '</td></tr>';
    html += '<tr><td>Email</td><td>' + client.email + '</td></tr>';
    html += '<tr><td>INN</td><td>' + client.taxNumber + '</td></tr>';
    for(var key in activitySectors) {
        var activitySector = activitySectors[key];
        html += '<tr><td>Activity Sector</td><td>' + activitySector.name + '</td></tr>';
    }    
    html += '<tr><td>Listed</td><td>' + booleanVisualizer.getHtml(client.isListed) + '</td></tr>';
    html += '<tr><td>Listing Country</td><td>' + client.listingCountryName + '</td></tr>';
    html += '<tr><td>Referred</td><td>' + booleanVisualizer.getHtml(client.isReferred) + '</td></tr>';
    html += '<tr><td>Customer Type</td><td>' + client.customerType + '</td></tr>';
    html += '<tr><td>Channel Type</td><td>' + client.channelType + '</td></tr>';
    html += '<tr><td>Active</td><td>' + booleanVisualizer.getHtml(client.isActive) + '</td></tr>';
    html += '<tr><td>Potential</td><td>' + booleanVisualizer.getHtml(client.isFuture) + '</td></tr>';
    html += '<tr><td>External/Networking</td><td>' + booleanVisualizer.getHtml(client.isExternal) + '</td></tr>';
    html += '<tr><td>Transnational</td><td>' + booleanVisualizer.getHtml(client.isTransnational) + '</td></tr>';
    html += '</table>';
    
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td>Name</td><td>Code name</td><td>Group</td><td>Created at</td><td>Created by</td></tr>';
    for(var key in this.loaded.clientHistoryItems) {
        var clientHistoryItem = this.loaded.clientHistoryItems[key];
        html += '<tr>';
        html += '<td>' + clientHistoryItem.name + '</td>';
        html += '<td>' + clientHistoryItem.codeName + '</td>';
        html += '<td>' + clientHistoryItem.groupName + '</td>';
        html += '<td>' + yearMonthDateTimeVisualizer.getHtml(clientHistoryItem.createdAt) + '</td>';
        html += '<td>' + clientHistoryItem.createdByUserName + '</td>';
        html += '</tr>';
    }
    html += '</table>';

    showPopup('Client', html, 400, 500, null, null);
}
ClientActivityManager.prototype.updateStartDateView = function() {
    $('#' + this.htmlId + '_startDate').val(getStringFromYearMonthDate(this.clientActivityFilter.startDate));
}
ClientActivityManager.prototype.updateEndDateView = function() {
    $('#' + this.htmlId + '_endDate').val(getStringFromYearMonthDate(this.clientActivityFilter.endDate));
}
ClientActivityManager.prototype.updateClientsView = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader">';
    html += '<td></td>';
    html += '<td>Client</td>';
    html += '<td>Group</td>';
    html += '<td>Active</td>';
    html += '<td>Total</td>';
    for(var key in this.loaded.subdepartments) {
        var subdepartment = this.loaded.subdepartments[key];
        html += '<td>' + subdepartment.officeName + ' / ' + subdepartment.departmentName + ' / ' + subdepartment.subdepartmentName + '</td>';
    }
    html += '</tr>';
    for(var key in this.loaded.clientActivityInfoItems) {
        var clientActivityInfoItem = this.loaded.clientActivityInfoItems[key];
        var totalCount = 0;
        for(var key2 in clientActivityInfoItem.subdepartmentCounts) {
            totalCount += clientActivityInfoItem.subdepartmentCounts[key2];
        }
        var classTxt = '';
        if((clientActivityInfoItem.clientIsActive && totalCount > 0) || (! clientActivityInfoItem.clientIsActive && totalCount == 0)) {
            classTxt = 'class="good"';
        } else if((clientActivityInfoItem.clientIsActive && totalCount == 0) || (! clientActivityInfoItem.clientIsActive && totalCount > 0)) {
            classTxt = 'class="bad"';
        }
        html += '<tr>';
        html += '<td><input type="checkbox"  id="' + this.htmlId + '_clientSelect_' + clientActivityInfoItem.clientId +'"></td>';
        html += '<td><span class="link" id="' + this.htmlId + '_client_' + clientActivityInfoItem.clientId + '">' + clientActivityInfoItem.clientName + '</span></td>';
        html += '<td>' + (clientActivityInfoItem.groupName != null ? clientActivityInfoItem.groupName : '') + '</td>';
        html += '<td ' + classTxt + '>' + booleanVisualizer.getHtml(clientActivityInfoItem.clientIsActive) + '</td>';
        html += '<td>' + totalCount + '</td>';
        for(var sKey in this.loaded.subdepartments) {
            var subdepartment = this.loaded.subdepartments[sKey];
            var count = null;
            for(var cKey in clientActivityInfoItem.subdepartmentCounts) {
                if(subdepartment.subdepartmentId == cKey) {
                    count = clientActivityInfoItem.subdepartmentCounts[cKey];
                    break;
                }
            }
            html += '<td>' + (count != null ? count : '') + '</td>';
        }        
    }
    html += '</table>';
    $('#' + this.htmlId + '_clients').html(html);
    $('#' + this.htmlId + '_clientsCount').html('(Total: ' + this.totalClientsCount + ', found: ' + this.foundClientsCount + ')');       
    var form = this;
    $('span[id^="' + this.htmlId + '_client_"]').bind('click', function(event) {form.clientClickedHandle.call(form, event)});
    $('input[id^="' + this.htmlId + '_clientSelect_"]').bind("click", function(event) {form.clientSelectorClickedHandle.call(form, event);});
    this.updateClientsSelection();
    this.updateClientsLimiterView();
}
ClientActivityManager.prototype.updateClientsLimiterView = function() {
    var pagesCount = parseInt(this.foundClientsCount / this.limiter.itemsPerPage) + 1;
    var html = '';
    html += '<select id="' + this.htmlId + '_limiter_size">';
    html += '</select> ';
    html += 'Found: ' + this.foundClientsCount + '. ';
    if(pagesCount > 1) {
        for(var i = 0; i < pagesCount; i++) {
            if(this.limiter.page - i > 5) {
                continue;
            }
            if(i - this.limiter.page > 5) {
                break;
            }
            if(i == this.limiter.page) {
                html += '<span>' + (i + 1) + '</span>';
            } else {
                html += '<span class="link" id="' + this.htmlId + '_limiter_page_' + i + '">' + (i + 1) + '</span>';
            }
        }
    }
    $('#' + this.htmlId + '_clientsLimiter').html(html);
    this.updateLimiterSizeView();
    var form = this;
    $('span[id^="' + this.htmlId + '_limiter_page_"]').bind("click", function(event) {form.pageClickHandle.call(form, event)});    
    $('#' + this.htmlId + '_limiter_size').bind("change", function(event) {form.limiterSizeChangedHandle.call(form, event)});
}
ClientActivityManager.prototype.updateLimiterSizeView = function() {
    var options = {"20": "20", "100": "100", "1000": "1000"}
    this.updateSelectorView(this.htmlId + '_limiter_size', this.limiter.itemsPerPage, options);
}
ClientActivityManager.prototype.updateClientsSelection = function() {
    for(var key in this.loaded.clientActivityInfoItems) {
        var clientActivityInfoItem = this.loaded.clientActivityInfoItems[key];
        var value = false;
        if(jQuery.inArray(clientActivityInfoItem.clientId, this.selected.clientIds) != -1) {
            value = true;
        }
        $('#' + this.htmlId + '_clientSelect_' + clientActivityInfoItem.clientId).prop("checked", value);
    }
    
    var html = '';
    html += 'Selected: ' + this.selected.clientIds.length;
    $('#' + this.htmlId + '_selectorCount').html(html);
}
ClientActivityManager.prototype.showClientsListFilter = function() {
    this.clientsListFilter = new ClientsListFilter(this.htmlId + '_contactManagerFilter', this.moduleName, this.clientFilter, this.clientFilterChangedHandler, this);
    this.clientsListFilter.init();   
}
ClientActivityManager.prototype.clientFilterChangedHandler = function(filter) {
    this.limiter.page = 0;
    this.clientFilter = filter;
    this.selected = {
        "groupIds": [],
        "clientIds": []
    }
    this.rememberFilter();
    this.updatePanelView();
    this.loadClients();
}
ClientActivityManager.prototype.limiterSizeChangedHandle = function(event) {
    this.limiter.itemsPerPage = $(event.currentTarget).val();
    this.limiter.page = 0;
    this.selected.clientIds = [];
    this.loadClients();
}

ClientActivityManager.prototype.pageClickHandle = function(event) {
    var htmlId = $(event.currentTarget).attr("id");
    var tmp = htmlId.split("_");
    var page = parseInt(tmp[tmp.length - 1]);
    this.limiter.page = page;
    this.selected.clientIds = [];
    this.loadClients();
}
ClientActivityManager.prototype.rememberFilter = function() {
    var filterStr = getJSON(this.clientFilter);
    var expire = new Date();
    expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 100);
    setCookie("clientsListFilter", filterStr, expire.toGMTString(), null);        
}

ClientActivityManager.prototype.clientChangedHandle = function(event) {
    var htmlId = $('#' + this.htmlId + '_clients').val();
    if(htmlId == null || htmlId == '') {
        this.selected.clientId = null;
    } else {
        this.selected.clientId = parseInt(htmlId);
    }  
    this.updateClientsView();
    this.loadContent();
}
ClientActivityManager.prototype.updateSelectorView = function(id, value, options) {
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
ClientActivityManager.prototype.normalizeContentSize = function() {
    var layoutWidth = contentWidth - 20;
    var layoutHeight = contentHeight - 125;
   
    jQuery('#' + this.htmlId + '_clients').width(layoutWidth);
    jQuery('#' + this.htmlId + '_clients').height(layoutHeight);
}
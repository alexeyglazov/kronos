/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function CRM(htmlId, containerHtmlId) {
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.moduleName = "Clients";
    this.config = {
         endpointUrl: endpointsFolder + "CRM.jsp"
    };
    this.enums = {
        "clientGroups": {
            "ONE": "1",
            "TWO": "2",
            "THREE": "3",
            "NA": "N/A"              
        }
    }
    this.loaded = {
        "countries": [],
        "languages": [],
        "groups": [],
        "clients": [],
        "group": null,
        "client": null,
        "contact": null,
        "contacts": [],
        "groupHistoryItems": [],
        "clientHistoryItems": [],
        "activitySectors": []
    };
    this.selected = {
        "groupIds": [],
        "clientIds": [],
        "contactIds": []
    }
    
    this.filter = ClientsListFilter.prototype.getDefaultFilter();    
    var filterStr = getCookie("clientsListFilter");
    if(filterStr != null) {
        try{
            this.filter = ClientsListFilter.prototype.normalizeFilter(jQuery.parseJSON(filterStr));
        } catch (e) {
            deleteCookie("clientsListFilter");
        }
    }
    this.limiter = {
        "page": 0,
        "itemsPerPage": 100
    };
    this.sorter = {
        "field": 'NAME',
        "order": 'ASC'
    };   
    this.displayFields = this.getDefaultDisplayFields();
    this.possibleFields = {
        id: "ID",
        name: "Name",
        group: "Group",
        codeName: "Code name",
        alias: "Alias",
        subdepartments: "Subdepartments",
        clientGroup: "Client group",
        country: "Country of origin",
        legalStreet: "Legal street",
        legalZipCode: "Legal ZipCode",
        legalCity: "Legal city",
        legalCountry: "Legal country",
        isPostalAddressEqualToLegal: "Postal address equals to legal",
        postalStreet: "Postal street",
        postalZipCode: "Postal ZipCode",
        postalCity: "Postal city",
        postalCountry: "Postal country",
        phone: "Phone",
        email: "Email",
        taxNumber: "Tax number",
        activitySectors: "Activity Sectors",
        isListed: "Listed",
        listingCountry: "Listing country",
        isReferred: "Referred",
        customerType: "Customer type",
        channelType: "Channel type",
        isTransnational: "Transnational",
        isFuture: "Future",
        isExternal: "External/Networking",
        isActive: "Active"
    }
    this.loadContentForContactHandler = null
}
CRM.prototype.getDefaultDisplayFields = function() {
    return {
        id: false,
        name: true,
        group: true,
        codeName: true,
        alias: false,
        subdepartments: false,
        clientGroup: false,
        country: false,
        legalStreet: false,
        legalZipCode: false,
        legalCity: false,
        legalCountry: false,
        isPostalAddressEqualToLegal: false,
        postalStreet: false,
        postalZipCode: false,
        postalCity: false,
        postalCountry: false,
        phone: false,
        email: false,
        taxNumber: false,
        activitySectors: false,
        isListed: false,
        listingCountry: false,
        isReferred: false,
        customerType: false,
        channelType: false,
        isTransnational: false,
        isFuture: false,
        isExternal: false,
        isActive: true
    }
}
CRM.prototype.init = function() {
    this.makeLayout();
    this.makeButtons();
    this.setHandlers();
    this.cleanContentView();
    this.loadInitialContent();
}
CRM.prototype.makeLayout = function() {
    var html = '';
    html += '<div id="' + this.htmlId + '_panel"></div><br />';
    html += '<table>';
    html += '<tr>';
    html += '<td>';

    html += '<div id="' + this.htmlId + '_accordion">';
        html += '<h3>Groups <span id="' + this.htmlId + '_groupsCount"></span></h3>';
        html += '<div>';
        html += '<div id="' + this.htmlId + '_groups" style="height: 200px; overflow: auto;"></div>';
        html += '</div>';
        html += '<h3>Clients <span id="' + this.htmlId + '_clientsCount"></span></h3>';
        html += '<div>';
        html += '<div id="' + this.htmlId + '_clientsLimiter"></div>';
        html += '<div id="' + this.htmlId + '_clients" style="height: 200px; overflow: auto;"></div>';
        html += '</div>';
    html += '</div>';

    html += '</td>';
    html += '<td>';
    html += '</td>';
    html += '</tr>';
    html += '</table>';

    html += '<table>';
    html += '<tr>';
    html += '<td>';
        html += '<div id="' + this.htmlId + '_group"></div>';
        html += '<div id="' + this.htmlId + '_groupHistoryItems"></div>';
    html += '</td>';
    html += '<td id="' + this.htmlId + '_client"></td>';
    html += '<td>';
        html += '<div id="' + this.htmlId + '_contacts"></div>';
        html += '<div id="' + this.htmlId + '_nonActiveContacts"></div>';
        html += '<div id="' + this.htmlId + '_projectCodeCounts"></div>';
        html += '<div id="' + this.htmlId + '_clientHistoryItems"></div>';
    html += '</td>';
    html += '</tr>';
    html += '</table>';
    $('#' + this.containerHtmlId).html(html);
    $( '#' + this.htmlId + '_accordion').accordion({
        collapsible: true,
        heightStyle: "content"
    });   
}
CRM.prototype.makeButtons = function() {
    var form = this;
}    
CRM.prototype.setHandlers = function() {
    var form = this;
}
CRM.prototype.groupClickedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    this.selected.groupIds = [];
    this.selected.clientIds = [];
    this.selected.groupIds.push(id);
    this.groupSelectionChangedHandle();
}
CRM.prototype.groupSelectorClickedHandle = function(event) {
    this.selected.groupIds = [];
    for(var key in this.loaded.groups) {
        var group = this.loaded.groups[key];
        if( $('#' + this.htmlId + '_groupSelect_' + group.id).is(':checked') ) {
            this.selected.groupIds.push(group.id);
        }
    } 
    this.groupSelectionChangedHandle();   
}
CRM.prototype.groupSelectionChangedHandle = function() {     
    this.cleanContentView();
    if(this.selected.groupIds.length == 1) {
        this.filter.groupId = this.selected.groupIds[0];
        this.rememberFilter();
        this.limiter.page = 0;
        this.loadContentForGroup();
    } else if(this.selected.groupIds.length == 0) {
        this.filter.groupId = null;
        this.rememberFilter();
        this.limiter.page = 0;
        this.loadClients();
    } else {
    }
    this.updatePanelView();
    this.updateGroupsSelection();
    this.updateClientsSelection();
}
CRM.prototype.clientClickedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    this.selected.groupIds = [];
    this.selected.clientIds = [];
    this.selected.clientIds.push(id);
    this.clientSelectionChangedHandle();
}
CRM.prototype.clientSelectorClickedHandle = function(event) {
    this.selected.clientIds = [];
    for(var key in this.loaded.clients) {
        var client = this.loaded.clients[key];
        if( $('#' + this.htmlId + '_clientSelect_' + client.id).is(':checked') ) {
            this.selected.clientIds.push(client.id);
        }
    } 
    this.clientSelectionChangedHandle();     
}
CRM.prototype.clientSelectionChangedHandle = function() {     
    this.cleanContentView();
    if(this.selected.clientIds.length == 1) {
        this.loadContentForClient();
    } else {
    }
    this.updatePanelView();
    this.updateGroupsSelection();
    this.updateClientsSelection();
}
CRM.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.filter = getJSON(this.filter);
    data.sorter = getJSON(this.sorter);
    data.limiter = getJSON(this.limiter);    
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.groups = result.groups;
            form.loaded.clients = result.clients;
            form.totalClientsCount = result.totalClientsCount;
            form.foundClientsCount = result.foundClientsCount;
            form.loaded.subdepartments = result.subdepartments;
            form.loaded.activitySectors = result.activitySectors;
            form.loaded.countries = result.countries;
            form.loaded.languages = result.languages;
            form.updatePanelView();
            form.updateGroupsView();
            form.updateClientsView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CRM.prototype.loadClients = function() {
    var form = this;
    var data = {};
    data.command = "getClients";
    data.filter = getJSON(this.filter);
    data.sorter = getJSON(this.sorter);
    data.limiter = getJSON(this.limiter);    
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.clients = result.clients;
            form.totalClientsCount = result.totalClientsCount;
            form.foundClientsCount = result.foundClientsCount;
            form.updateGroupsView();
            form.updateClientsView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CRM.prototype.loadContentForGroup = function() {
    var form = this;
    var data = {};
    data.command = "getContentForGroup";
    data.groupId = this.selected.groupIds[0];
    data.filter = getJSON(this.filter);
    data.sorter = getJSON(this.sorter);
    data.limiter = getJSON(this.limiter);        
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.group = result.group;
            form.loaded.groupHistoryItems = result.groupHistoryItems;
            form.loaded.clients = result.clients;
            form.totalClientsCount = result.totalClientsCount;
            form.foundClientsCount = result.foundClientsCount;            
            form.cleanContentView();
            form.updateGroupsView();
            form.updateClientsView();
            form.updateGroupView();
            form.updateGroupHistoryItemsView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CRM.prototype.loadContentForClient = function() {
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
            form.loaded.groupHistoryItems = result.groupHistoryItems;
            form.loaded.clientHistoryItems = result.clientHistoryItems;
            
            form.loaded.projectCodeCounts = result.projectCodeCounts;
            form.loaded.projectCodeSubdepartments = result.projectCodeSubdepartments;
            form.loaded.projectCodeCountsStart = result.projectCodeCountsStart;
            form.loaded.projectCodeCountsEnd = result.projectCodeCountsEnd;
            form.cleanContentView();
            form.updateGroupView();
            form.updateClientView();
            form.updateContactsView();
            form.updateNonActiveContactsView();
            form.updateGroupHistoryItemsView();
            form.updateClientHistoryItemsView();
            form.updateProjectCodeCountsView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CRM.prototype.loadContentForContact = function() {
    var form = this;
    var id = this.selected.contactIds[0];
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
            form.loaded.employeeContactLinks = result.employeeContactLinks;
            form.loadContentForContactHandler.call(form);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });    
}
CRM.prototype.updatePanelView = function() {
    var html = '';
    html += '<table><tr>';
    html += '<td id="' + this.htmlId + '_filterCell"><button id="' + this.htmlId + '_clientFilterBtn" title="Client filter">Client filter</button></td>';
    html += '<td><button id="' + this.htmlId + '_displayBtn' + '">Display</button></td>';
    html += '<td><button class="link" id="' + this.htmlId + '_addGroupBtn">Add group</button></td>';
    html += '<td><button class="link" id="' + this.htmlId + '_addClientBtn">Add client</button></td>';
    html += '</tr></table>';
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
    $('#' + this.htmlId + '_displayBtn').button({
        icons: {
            primary: "ui-icon-grip-dotted-horizontal"
        },
        text: true
    }).click(function(event) {
        form.showDisplayFieldsFilter.call(form);
    });    
    $('#' + this.htmlId + '_addGroupBtn').button({
        icons: {
            primary: "ui-icon-plus"
        }
    }).click(function(event) {
        form.addGroup.call(form);
    });
    $('#' + this.htmlId + '_addClientBtn').button({
        icons: {
            primary: "ui-icon-plus"
        }
    }).click(function(event) {
        form.addClient.call(form);
    });
}
CRM.prototype.updateFilterSelectionView = function() {
    if(ClientsListFilter.prototype.isFilterUsed(this.filter)) {
        $('#' + this.htmlId + '_filterCell').css('border-left', '3px solid #009900');
    } else {
        $('#' + this.htmlId + '_filterCell').css('border-left', '0px');
    }
}

CRM.prototype.updateGroupsView = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader">';
    html += '<td></td>';
    html += '<td>Name</td>';
    html += '<td>Alias</td>';
    html += '<td>Listed</td>';
    html += '<td>Referred</td>';
    html += '<td>Mazars Audit</td>';
    html += '</tr>';
    for(var key in this.loaded.groups) {
        var group = this.loaded.groups[key];              
        html += '<tr>';
        html += '<td><input type="checkbox"  id="' + this.htmlId + '_groupSelect_' + group.id +'"></td>';
        html += '<td><span class="link" id="' + this.htmlId + '_group_' + group.id + '">' + group.name + '</span></td>';
        html += '<td>' + (group.alias != null ? group.alias : '') + '</td>';
        html += '<td>' + booleanVisualizer.getHtml(group.isListed) + '</td>';
        html += '<td>' + booleanVisualizer.getHtml(group.isReferred) + '</td>';
        html += '<td>' + booleanVisualizer.getHtml(group.isMazarsAudit) + '</td>';
        html += '</tr>';
    }
    html += '</table>';
    $('#' + this.htmlId + '_groups').html(html);
    $('#' + this.htmlId + '_groupsCount').html('(Total: ' + this.loaded.groups.length + ')');

    var form = this;
    $('span[id^="' + this.htmlId + '_group_"]').bind('click', function(event) {form.groupClickedHandle.call(form, event)});
    $('input[id^="' + this.htmlId + '_groupSelect_"]').bind("click", function(event) {form.groupSelectorClickedHandle.call(form, event);});
    this.updateGroupsSelection();    
}
CRM.prototype.updateClientsView = function() {
    var groupIndex = {};
    for(var key in this.loaded.groups) {
        var group = this.loaded.groups[key];
        groupIndex[group.id] = group;
    }
    var html = '';
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
    for(var key in this.loaded.clients) {
        var client = this.loaded.clients[key];              
        html += '<tr>';
        html += '<td><input type="checkbox"  id="' + this.htmlId + '_clientSelect_' + client.id +'"></td>';
        if(this.displayFields['id']) {
            html += '<td>' + client.id + '</td>';
        }
        if(this.displayFields['name']) {
            html += '<td><span class="link" id="' + this.htmlId + '_client_' + client.id + '">' + client.name + '</span></td>';
        }
        if(this.displayFields['group']) {
            var groupName = '';
            if(client.groupId != null) {
                groupName = groupIndex[client.groupId].name;
            }
            html += '<td>' + groupName + '</td>';
        }
        if(this.displayFields['codeName']) {
            html += '<td>' + (client.codeName != null ? client.codeName : '') + '</td>';
        }
        if(this.displayFields['alias']) {
            html += '<td>' + (client.alias != null ? client.alias : '') + '</td>';
        }
        if(this.displayFields['subdepartments']) {
            var subdepartmentNames = '';
            for(var key2 in client.subdepartmentIds) {
                var subdepartmentId = client.subdepartmentIds[key2];
                var subdepartment = null;
                for(var key3 in this.loaded.subdepartments) {
                    var subdepartment = this.loaded.subdepartments[key3];
                    if(subdepartment.subdepartmentId == subdepartmentId) {
                        subdepartmentNames += subdepartment.officeName + '/' + subdepartment.departmentName + '/' + subdepartment.subdepartmentName + '; ';
                    }
                }
            }
            html += '<td>' + subdepartmentNames + '</td>';
        }
        if(this.displayFields['clientGroup']) {
            html += '<td>' + (client.clientGroup != null ? client.clientGroup : '') + '</td>';
        }
        if(this.displayFields['country']) {
            if(client.countryId != null) {
                var country = this.getCountry(client.countryId);
                html += '<td>' + (country.name != null ? country.name : '') + '</td>';
            } else {
                html += '<td></td>';
            }
        }
        if(this.displayFields['legalStreet']) {
            html += '<td>' + (client.legalStreet != null ? client.legalStreet : '') + '</td>';
        }
        if(this.displayFields['legalZipCode']) {
            html += '<td>' + (client.legalZipCode != null ? client.legalZipCode : '') + '</td>';
        }
        if(this.displayFields['legalCity']) {
            html += '<td>' + (client.legalCity != null ? client.legalCity : '') + '</td>';
        }
        if(this.displayFields['legalCountry']) {
            if(client.legalCountryId != null) {
                var legalCountry = this.getCountry(client.legalCountryId);
                html += '<td>' + (legalCountry.name != null ? legalCountry.name : '') + '</td>';
            } else {
                html += '<td></td>';
            }
        }
        if(this.displayFields['isPostalAddressEqualToLegal']) {
            html += '<td>' + booleanVisualizer.getHtml(client.isPostalAddressEqualToLegal) + '</td>';
        }
        if(this.displayFields['postalStreet']) {
            html += '<td>' + (client.postalStreet != null ? client.postalStreet : '') + '</td>';
        }
        if(this.displayFields['postalZipCode']) {
            html += '<td>' + (client.postalZipCode != null ? client.postalZipCode : '') + '</td>';
        }
        if(this.displayFields['postalCity']) {
            html += '<td>' + (client.postalCity != null ? client.postalCity : '') + '</td>';
        }
        if(this.displayFields['postalCountry']) {
            if(client.postalCountryId != null) {
                var postalCountry = this.getCountry(client.postalCountryId);
                html += '<td>' + (postalCountry.name != null ? postalCountry.name : '') + '</td>';
            } else {
                html += '<td></td>';
            }
        }
        if(this.displayFields['phone']) {
            html += '<td>' + (client.phone != null ? client.phone : '') + '</td>';
        }
        if(this.displayFields['email']) {
            html += '<td>' + (client.email != null ? client.email : '') + '</td>';
        }
        if(this.displayFields['taxNumber']) {
            html += '<td>' + (client.taxNumber != null ? client.taxNumber : '') + '</td>';
        }
        if(this.displayFields['activitySectors']) {
            var activitySectorNames = '';
            for(var key2 in client.activitySectorIds) {
                var activitySectorId = client.activitySectorIds[key2];
                var activitySector = null;
                for(var key3 in this.loaded.activitySectors) {
                    var activitySector = this.loaded.activitySectors[key3];
                    if(activitySector.id == activitySectorId) {
                        activitySectorNames += activitySector.name + '; ';
                    }
                }
            }
            html += '<td>' + activitySectorNames + '</td>';            
        }
        if(this.displayFields['isListed']) {
            html += '<td>' + booleanVisualizer.getHtml(client.isListed) + '</td>';
        }
        if(this.displayFields['listingCountry']) {
            if(client.listingCountryId != null) {
                var listingCountry = this.getCountry(client.listingCountryId);
                html += '<td>' + (listingCountry.name != null ? listingCountry.name : '') + '</td>';
            } else {
                html += '<td></td>';
            }
        }
        if(this.displayFields['isReferred']) {
            html += '<td>' + booleanVisualizer.getHtml(client.isReferred) + '</td>';
        }
        if(this.displayFields['customerType']) {
            html += '<td>' + (client.customerType != null ? client.customerType : '') + '</td>';
        }
        if(this.displayFields['channelType']) {
            html += '<td>' + (client.channelType != null ? client.channelType : '') + '</td>';
        }
        if(this.displayFields['isTransnational']) {
            html += '<td>' + booleanVisualizer.getHtml(client.isTransnational) + '</td>';
        }
        if(this.displayFields['isFuture']) {
            html += '<td>' + booleanVisualizer.getHtml(client.isFuture) + '</td>';
        }
        if(this.displayFields['isExternal']) {
            html += '<td>' + booleanVisualizer.getHtml(client.isExternal) + '</td>';
        }
        if(this.displayFields['isActive']) {
            html += '<td>' + booleanVisualizer.getHtml(client.isActive) + '</td>';
        }
        html += '</tr>';
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
CRM.prototype.updateClientsLimiterView = function() {
    var pagesCount = parseInt(this.foundClientsCount / this.limiter.itemsPerPage) + 1;
    var html = '';
    html += '<select id="' + this.htmlId + '_limiter_size">';
    html += '</select>';
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
CRM.prototype.updateLimiterSizeView = function() {
    var options = {"20": "20", "100": "100", "1000": "1000"}
    this.updateSelectorView(this.htmlId + '_limiter_size', this.limiter.itemsPerPage, options);
}
CRM.prototype.updateGroupView = function() {
    if(this.loaded.group == null) {
        var html = '';
        html += '<table class="datagrid">';
        html += '<tr class="dgHeader"><td>Group</td></tr>';
        html += '<tr><td>Selected client does not belong to any group</td></tr>';
        html += '</table>';
        $('#' + this.htmlId + '_group').html(html);
        return;
    }
      var country;
      var listingCountry;
      for(var key in this.loaded.countries) {
          var countryTmp = this.loaded.countries[key];
          if(countryTmp.id == this.loaded.group.countryId) {
              country = countryTmp;
              break;
          }
      }
      for(var key in this.loaded.countries) {
          var countryTmp = this.loaded.countries[key];
          if(countryTmp.id == this.loaded.group.listingCountryId) {
              listingCountry = countryTmp;
              break;
          }
      }
      if(country != null) {
        this.loaded.group.countryName = country.name;
      } else {
        this.loaded.group.countryName = "Not defined";
      }
      if(listingCountry != null) {
        this.loaded.group.listingCountryName = listingCountry.name;
      } else {
        this.loaded.group.listingCountryName = "Not applicable"
      }
      var rows = [];
      rows.push({"name": "Name", "property": "name"});
      rows.push({"name": "Alias", "property": "alias"});
      rows.push({"name": "Country of origin", "property": "countryName"});
      rows.push({"name": "Listed", "property": "isListed"});
      rows.push({"name": "Listing Country", "property": "listingCountryName"});
      rows.push({"name": "Is referred", "property": "isReferred", "visualizer": booleanVisualizer});
      rows.push({"name": "Group audit by Mazars", "property": "isMazarsAudit", "visualizer": booleanVisualizer});
      var controls = [];
      controls.push({"id": "edit", "text": "Edit", "icon": imagePath+"/icons/edit.png", "click": {"handler": this.editGroup, "context": this}});
      controls.push({"id": "delete", "text": "Delete", "icon": null, "click": {"handler": this.deleteGroup, "context": this}});
      var propertyGrid = new PropertyGrid("admin_group", this.loaded.group, rows, "Group", controls);
      propertyGrid.show(this.htmlId + '_group');
}
CRM.prototype.updateClientView = function() {
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
    if(subdepartments.length > 0) {
        for(var key in subdepartments) {
          var subdepartment = subdepartments[key];
          client.subdepartmentNames += subdepartment.officeName + ' / ' + subdepartment.departmentName + ' / ' + subdepartment.subdepartmentName + '<br />';
        }
    } else {
        client.subdepartmentNames = "Not defined";
    }
    var isOutsourcing = false;
    for(var key in subdepartments) {
        var subdepartment = subdepartments[key];
        if(subdepartment.subdepartmentName.toLowerCase().indexOf('outsourcing') != -1 ||
            subdepartment.departmentName.toLowerCase().indexOf('outsourcing') != -1 ||
            subdepartment.officeName.toLowerCase().indexOf('outsourcing') != -1) {
            isOutsourcing = true;
            break;
        }          
    }
    if(isOutsourcing) {
        client.clientGroupName = this.enums.clientGroups[client.clientGroup];
    }

    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td colspan="2">Client</td></tr>';
    html += '<tr><td>Leading subdepartments</td><td>' + client.subdepartmentNames + ' <span class="link" id="' + this.htmlId + '_editSubdepartmentClientLinks">Edit subdepartments</span></td></tr>';
    if(isOutsourcing) {
      html += '<tr><td>Group of client</td><td>' + client.clientGroupName + '</td></tr>';
    }
    html += '<tr><td>Name</td><td>' + client.name + '</td></tr>';
    html += '<tr><td>Alias</td><td>' + client.alias + '</td></tr>';
    html += '<tr><td>Code Name</td><td>' + client.codeName + '</td></tr>';
    html += '<tr><td>Country of origin</td><td>' + client.countryName + '</td></tr>';
      
    html += '<tr><td>Postal address: street</td><td>' + client.postalStreet + '</td></tr>';
    html += '<tr><td>Postal address: ZIP Code</td><td>' + client.postalZipCode + '</td></tr>';
    html += '<tr><td>Postal address: city</td><td>' + client.postalCity + '</td></tr>';
    html += '<tr><td>Postal address: country</td><td>' + client.postalCountryName + '</td></tr>';
    html += '<tr><td>Postal address equals to legal</td><td>' + booleanVisualizer.getHtml(client.isPostalAddressEqualToLegal) + '</td></tr>';
    if(client.isPostalAddressEqualToLegal != true) {
        html += '<tr><td>Legal address: street</td><td>' + client.legalStreet + '</td></tr>';
        html += '<tr><td>Legal address: ZIP Code</td><td>' + client.legalZipCode + '</td></tr>';
        html += '<tr><td>Legal address: city</td><td>' + client.legalCity + '</td></tr>';
        html += '<tr><td>Legal address: country</td><td>' + client.legalCountryName + '</td></tr>';      
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
    html += '<tr><td>Customer Type</td><td>' + client.customerType + '</td></tr>';
    html += '<tr><td>Transnational</td><td>' + booleanVisualizer.getHtml(client.isTransnational) + '</td></tr>';
    html += '<tr><td>Referred</td><td>' + booleanVisualizer.getHtml(client.isReferred) + '</td></tr>';
    html += '<tr><td>Channel Type</td><td>' + client.channelType + '</td></tr>';
    html += '<tr><td>Active</td><td>' + booleanVisualizer.getHtml(client.isActive) + '</td></tr>';
    html += '<tr><td>Potential</td><td>' + booleanVisualizer.getHtml(client.isFuture) + '</td></tr>';
    html += '<tr><td>External/Networking</td><td>' + booleanVisualizer.getHtml(client.isExternal) + '</td></tr>';
    html += '<tr><td colspan="2"><span class="link" id="' + this.htmlId + '_editClient">Edit</span> <span class="link" id="' + this.htmlId + '_deleteClient">Delete</span></td></tr>';
    html += '</table>';
    $('#' + this.htmlId + '_client').html(html);
    
    var form = this;
    $('#' + this.htmlId + '_editClient').bind("click", function(event) {form.editClient.call(form, event);});
    $('#' + this.htmlId + '_deleteClient').bind("click", function(event) {form.deleteClient.call(form, event);});
    $('#' + this.htmlId + '_editSubdepartmentClientLinks').bind("click", function(event) {form.editSubdepartmentClientLinks.call(form, event);});
}
CRM.prototype.updateContactsView = function() {
    var contacts = [];
    for(var key in this.loaded.contacts) {
        var contact = this.loaded.contacts[key];
        if(contact.firstName == '') {
            contact.fistName = 'Undefined';
        }
        if(contact.isActive != true) {
            continue;
        }
        contact.conversedNormalPosition = contact.normalPosition; 
        if(contact.normalPosition == 'OTHER') {
            contact.conversedNormalPosition += ' / ' + contact.otherNormalPosition;
        }
        contacts.push(contact);
    }
      var columns = [];
      columns.push({"name": "Gender", "property": "gender"});
      columns.push({"name": "First Name", "property": "firstName", "click": {"handler": this.showContact, "context": this}});
      columns.push({"name": "Last Name", "property": "lastName"});
      columns.push({"name": "Classified position", "property": "conversedNormalPosition"});
      var controls = [];
      controls.push({"text": "Add contact", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addContact, "context": this}, "id": 'add'});
      controls.push({"text": "Assign existing contact", "icon": null, "click": {"handler": this.assignContact, "context": this}, "id": 'assign'});
      var extraColumns = [];
      extraColumns.push({"name": "Personal contacts", "property": "personalContacts", "text": "Show",  "click": {"handler": this.showEmployeeContactLinks, "context": this}});
      extraColumns.push({"name": "Edit", "property": "edit", "text": "Edit",  "click": {"handler": this.startEditContact, "context": this}});
      extraColumns.push({"name": "Delete completely", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteContact, "context": this}});
      var dataGrid = new DataGrid("admin_contacts", contacts, columns, "Contacts", controls, extraColumns, "id");
      dataGrid.show(this.htmlId + '_contacts');
}
CRM.prototype.updateNonActiveContactsView = function() {
    var contacts = [];
    for(var key in this.loaded.contacts) {
        var contact = this.loaded.contacts[key];
        if(contact.firstName == '') {
            contact.fistName = 'Undefined';
        }
        if(contact.isActive == true) {
            continue;
        }
        contact.conversedNormalPosition = contact.normalPosition; 
        if(contact.normalPosition == 'OTHER') {
            contact.conversedNormalPosition += ' / ' + contact.otherNormalPosition;
        }
        contacts.push(contact);
    }
      var columns = [];
      columns.push({"name": "Gender", "property": "gender"});
      columns.push({"name": "First Name", "property": "firstName", "click": {"handler": this.showContact, "context": this}});
      columns.push({"name": "Last Name", "property": "lastName"});
      columns.push({"name": "Classified position", "property": "conversedNormalPosition"});
      var controls = [];
      var extraColumns = [];
      extraColumns.push({"name": "Personal contacts", "property": "personalContacts", "text": "Show",  "click": {"handler": this.showEmployeeContactLinks, "context": this}});
      extraColumns.push({"name": "Edit", "property": "edit", "text": "Edit",  "click": {"handler": this.startEditContact, "context": this}});
      extraColumns.push({"name": "Delete completely", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteContact, "context": this}});
      var dataGrid = new DataGrid("admin_nonActiveContacts", contacts, columns, "Contacts (non-active)", controls, extraColumns, "id");
      dataGrid.show(this.htmlId + '_nonActiveContacts');
}
CRM.prototype.updateProjectCodeCountsView = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td colspan="2">Activity at (' + getStringFromRange(this.loaded.projectCodeCountsStart, this.loaded.projectCodeCountsEnd) + ')</td></tr>';
    html += '<tr class="dgHeader"><td>Subdepartment</td><td>Project codes</td></tr>';
    if(size(this.loaded.projectCodeCounts) > 0) {
        for(var key in this.loaded.projectCodeSubdepartments) {
            var subdepartment = this.loaded.projectCodeSubdepartments[key];
            var count = this.loaded.projectCodeCounts[subdepartment.subdepartmentId];
            html += '<tr><td>' + (subdepartment.officeName + ' / ' + subdepartment.departmentName + ' / ' + subdepartment.subdepartmentName) + '</td><td>' + count + '</td></tr>';
        }
        html += '<tr><td colspan="2"><span class="link" id="' + this.htmlId + '_projectCodeDetailsLink">Details</span></td></tr>';
    } else {
        html += '<tr><td colspan="2">No data for this period</td></tr>';
    }
    html += '</table>';
    var form = this;
    $('#' + this.htmlId + '_projectCodeCounts').html(html);
    $('#' + this.htmlId + '_projectCodeDetailsLink').bind('click', function(event) {form.showProjectCodesDetails(event);});
}
CRM.prototype.updateGroupsSelection = function() {
    for(var key in this.loaded.groups) {
        var group = this.loaded.groups[key];
        var value = false;
        if(jQuery.inArray(group.id, this.selected.groupIds) != -1) {
            value = true;
        }
        $('#' + this.htmlId + '_groupSelect_' + group.id).prop("checked", value);
    }
}
CRM.prototype.updateClientsSelection = function() {
    for(var key in this.loaded.clients) {
        var client = this.loaded.clients[key];
        var value = false;
        if(jQuery.inArray(client.id, this.selected.clientIds) != -1) {
            value = true;
        }
        $('#' + this.htmlId + '_clientSelect_' + client.id).prop("checked", value);
    }
}
CRM.prototype.updateGroupHistoryItemsView = function() {
      var columns = [];
      columns.push({"name": "Name", "property": "name"});
      columns.push({"name": "Country", "property": "countryName"});
      columns.push({"name": "Created At", "property": "createdAt", visualizer: yearMonthDateTimeVisualizer});
      columns.push({"name": "Created By", "property": "createdByUserName"});
      var controls = [];
      var dataGrid = new DataGrid("admin_groupHistoryItems", this.loaded.groupHistoryItems, columns, "Group History", controls, null, "id");
      dataGrid.show(this.htmlId + '_groupHistoryItems');
}
CRM.prototype.updateClientHistoryItemsView = function() {
      var columns = [];
      columns.push({"name": "Name", "property": "name"});
      columns.push({"name": "Code Name", "property": "codeName"});
      columns.push({"name": "Group", "property": "groupName"});
      columns.push({"name": "Created At", "property": "createdAt", visualizer: yearMonthDateTimeVisualizer});
      columns.push({"name": "Created By", "property": "createdByUserName"});
      var controls = [];
      var dataGrid = new DataGrid("admin_clientHistoryItems", this.loaded.clientHistoryItems, columns, "Client History", controls, null, "id");
      dataGrid.show(this.htmlId + '_clientHistoryItems');
}
CRM.prototype.showClientsListFilter = function() {
    this.clientsListFilter = new ClientsListFilter(this.htmlId + '_contactManagerFilter', this.moduleName, this.filter, this.filterChangedHandler, this);
    this.clientsListFilter.init();   
}
CRM.prototype.filterChangedHandler = function(filter) {
    this.limiter.page = 0;
    this.filter = filter;
    this.selected = {
        "groupIds": [],
        "clientIds": []
    }
    this.rememberFilter();
    this.updatePanelView();
    this.loadClients();
}
CRM.prototype.limiterSizeChangedHandle = function(event) {
    this.limiter.itemsPerPage = $(event.currentTarget).val();
    this.limiter.page = 0;
    this.selected.clientIds = [];
    this.loadClients();
}

CRM.prototype.pageClickHandle = function(event) {
    var htmlId = $(event.currentTarget).attr("id");
    var tmp = htmlId.split("_");
    var page = parseInt(tmp[tmp.length - 1]);
    this.limiter.page = page;
    this.selected.clientIds = [];
    this.loadClients();
}
CRM.prototype.rememberFilter = function() {
    var filterStr = getJSON(this.filter);
    var expire = new Date();
    expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 100);
    setCookie("clientsListFilter", filterStr, expire.toGMTString(), null);        
}
CRM.prototype.showDisplayFieldsFilter = function() {
    this.filterDisplayFieldsForm = new DisplayFieldsFilter("displayFieldsFilter", this.moduleName, this.displayFields, this.possibleFields, this.acceptDisplayFieldsFilterData, this);
    this.filterDisplayFieldsForm.init();
}
CRM.prototype.acceptDisplayFieldsFilterData = function(displayFields) {
    this.displayFields = displayFields;
    this.updateClientsView();
}

CRM.prototype.groupChangedHandle = function(event) {
    var htmlId = $('#' + this.htmlId + '_groups').val();
    if(htmlId == '') {
        this.selected.groupId = null;
    } else {
        this.selected.groupId = parseInt(htmlId);
    }  
    this.updateGroupsView();
    this.selected.clientId = null;
    this.loadContent();
}
CRM.prototype.clientChangedHandle = function(event) {
    var htmlId = $('#' + this.htmlId + '_clients').val();
    if(htmlId == null || htmlId == '') {
        this.selected.clientId = null;
    } else {
        this.selected.clientId = parseInt(htmlId);
    }  
    this.updateClientsView();
    this.loadContent();
}
CRM.prototype.reset = function(event) {
    this.selected = {
        "groupIds": [],
        "clientIds": []
    }    
    this.cleanContentView();
    this.loadInitialContent();
}
CRM.prototype.cleanContentView = function(event) {
    $('#' + this.htmlId + '_group').html('');
    $('#' + this.htmlId + '_client').html('');
    $('#' + this.htmlId + '_contacts').html('');
    $('#' + this.htmlId + '_nonActiveContacts').html('');
    $('#' + this.htmlId + '_projectCodeCounts').html('');
    $('#' + this.htmlId + '_groupHistoryItems').html('');    
    $('#' + this.htmlId + '_clientHistoryItems').html('');    
}

CRM.prototype.addGroup = function(event) {
    var groupEditForm = new GroupEditForm({
        "mode": 'CREATE',
        "id": null,
        "name": "",
        "alias": "",
        "countryId": null,
        "isListed": false,
        "listingCountryId": null,
        "isReferred": false,
        "isMazarsAudit": false
    }, "groupEditForm", this.reset, this);
    groupEditForm.start();
}
CRM.prototype.editGroup = function(event) {
    this.selected.groupId = this.loaded.group.id;
    var groupEditForm = new GroupEditForm({
        "mode": 'UPDATE',
        "id": this.loaded.group.id,
        "name": this.loaded.group.name,
        "alias": this.loaded.group.alias,
        "countryId": this.loaded.group.countryId,
        "isListed": this.loaded.group.isListed,
        "listingCountryId": this.loaded.group.listingCountryId,
        "isReferred": this.loaded.group.isReferred,
        "isMazarsAudit": this.loaded.group.isMazarsAudit
    }, "groupEditForm", this.reset, this);
    groupEditForm.start();
}
CRM.prototype.deleteGroup = function(event) {
  var groupDeleteForm = new GroupDeleteForm(this.loaded.group.id, this.reset, this);
  groupDeleteForm.start();
}

CRM.prototype.addClient = function(event) {
    var clientEditForm = new ClientEditForm({
        "mode": 'CREATE',
        "id": null,
        "groupId": this.selected.groupId,
        "subdepartmentClientLinks": [],
        "clientGroup": null,
        "name": "",
        "codeName": "",
        
        "legalStreet" : "",
        "legalZipCode" : "",
        "legalCity" : "",
        "legalCountryId" : null,

        "isPostalAddressEqualToLegal" : true,
        "postalStreet" : "",
        "postalZipCode" : "",
        "postalCity" : "",
        "postalCountryId" : null,

        "phone" : "",
        "email" : "",
        "taxNumber" : "",
        "activitySector1Id" : null,
        "activitySector2Id" : null,
        "activitySector3Id" : null,
        "activitySector4Id" : null,
        "activitySector5Id" : null,
        "isListed" : false,
        "isReferred" : false,
        "customerType" : null,
        "db" : "",
        "channelType" : null,
        "countryId" : null,
        "listingCountryId" : null,
        "isActive" : true,
        "isFuture" : false,
        "isExternal" : false,
        "isTransnational" : null
    }, "clientEditForm", this.reset, this);
    clientEditForm.init();
}
CRM.prototype.editClient = function(event) {
    var formData = {
        "mode": 'UPDATE',
        "id": this.loaded.client.id,
        "groupId": this.loaded.client.groupId,
        "subdepartmentClientLinks": this.loaded.subdepartmentClientLinks,
        "clientGroup": this.loaded.client.clientGroup,       
        "name": this.loaded.client.name,
        "codeName": this.loaded.client.codeName,
        "alias": this.loaded.client.alias,
        
        "legalStreet" : this.loaded.client.legalStreet,
        "legalZipCode" : this.loaded.client.legalZipCode,
        "legalCity" : this.loaded.client.legalCity,
        "legalCountryId" : this.loaded.client.legalCountryId,

        "isPostalAddressEqualToLegal" : this.loaded.client.isPostalAddressEqualToLegal,
        "postalStreet" : this.loaded.client.postalStreet,
        "postalZipCode" : this.loaded.client.postalZipCode,
        "postalCity" : this.loaded.client.postalCity,
        "postalCountryId" : this.loaded.client.postalCountryId,
        
        "phone" : this.loaded.client.phone,
        "email" : this.loaded.client.email,
        "taxNumber" : this.loaded.client.taxNumber,
        "activitySector1Id" : null,
        "activitySector2Id" : null,
        "activitySector3Id" : null,
        "activitySector4Id" : null,
        "activitySector5Id" : null,
        "isListed" : this.loaded.client.isListed,
        "isReferred" : this.loaded.client.isReferred,
        "customerType" : this.loaded.client.customerType,
        "db" : this.loaded.client.db,
        "channelType" : this.loaded.client.channelType,
        "countryId" : this.loaded.client.countryId,
        "listingCountryId" : this.loaded.client.listingCountryId,
        "isActive" : this.loaded.client.isActive,
        "isFuture" : this.loaded.client.isFuture,
        "isExternal" : this.loaded.client.isExternal,
        "isTransnational" : this.loaded.client.isTransnational
    };
    if(this.loaded.client.activitySectorIds.length > 0) {
        formData.activitySector1Id = this.loaded.client.activitySectorIds[0];
    }
    if(this.loaded.client.activitySectorIds.length > 1) {
        formData.activitySector2Id = this.loaded.client.activitySectorIds[1];
    }
    if(this.loaded.client.activitySectorIds.length > 2) {
        formData.activitySector3Id = this.loaded.client.activitySectorIds[2];
    }
    if(this.loaded.client.activitySectorIds.length > 3) {
        formData.activitySector4Id = this.loaded.client.activitySectorIds[3];
    }
    if(this.loaded.client.activitySectorIds.length > 4) {
        formData.activitySector5Id = this.loaded.client.activitySectorIds[4];
    }
    var clientEditForm = new ClientEditForm(formData, "clientEditForm", this.reset, this);
    clientEditForm.init();
}
CRM.prototype.editSubdepartmentClientLinks = function(event) {
    var subdepartmentClientLinksEditForm = new SubdepartmentClientLinksEditForm({
        "clientId": this.loaded.client.id,
        "subdepartmentClientLinks": this.loaded.subdepartmentClientLinks
    }, "subdepartmentClientLinksEditForm", this.reset, this);
    subdepartmentClientLinksEditForm.init();
}
CRM.prototype.deleteClient = function(event) {
  var clientDeleteForm = new ClientDeleteForm(this.loaded.client.id, this.reset, this);
  clientDeleteForm.start();
}

CRM.prototype.addContact = function() {
    var contactEditForm = new ContactEditForm({
        "mode": 'CREATE',
        "id": null,
        "clientId": this.loaded.client.id,
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
    }, "contactEditForm", this.loadContentForClient, this);
    contactEditForm.start();
}
CRM.prototype.assignContact = function() {
    var contactClientLinkEditForm = new ContactClientLinkEditForm({
        "mode": 'CREATE',
        "id": null,
        "contactId": null,
        "clientId": this.loaded.client.id
        }, "contactClientLinkEditForm", this.loadContentForClient, this);
    contactClientLinkEditForm.init();
}
CRM.prototype.startEditContact = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var id = tmp[tmp.length - 1];
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
CRM.prototype.editContact = function() {
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
    }, "contactEditForm", this.loadContentForClient, this);
    contactEditForm.start();
}
CRM.prototype.deleteContact = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    var id = tmp[tmp.length - 1];    
    doConfirm('Confirm', 'It is recommended to unset status Active instead of deletion. Proceed to remove contact?', this, function() {this.startDeletingContact(id);}, null, null);
}
CRM.prototype.startDeletingContact = function(id) {
  var contactDeleteForm = new ContactDeleteForm(id, this.loadContentForClient, this);
  contactDeleteForm.start();
}
CRM.prototype.showProjectCodesDetails = function(event) {
  var id = this.loaded.client.id;
  var form = this;
    var data = {};
    data.command = "getProjectCodes";
    data.clientId = id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.projectCodes = result.projectCodes;
            form.updateProjectCodesView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}

CRM.prototype.employeeContactLinkEditClickedHandle = function(event) {
    $('#' + this.popupHtmlId).dialog("close");
    
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
        }, "employeeContactLinkEditForm", this.loadContentForContact, this);
    employeeContactLinkEditForm.init();

}
CRM.prototype.employeeContactLinkDeleteClickedHandle = function(event) {
    $('#' + this.popupHtmlId).dialog("close");
    
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    var employeeContactLinkDeleteForm = new EmployeeContactLinkDeleteForm(id, this.loadContentForContact, this);
    employeeContactLinkDeleteForm.init();
}
CRM.prototype.addEmployeeContactLink = function(event) {
    $('#' + this.popupHtmlId).dialog("close");
    
    var employeeContactLinkEditForm = new EmployeeContactLinkEditForm({
        "mode": 'CREATE',
        "id": null,
        "contactId": this.loaded.contact.id,
        "employeeId": null,
        "comment": '',
        }, "employeeContactLinkEditForm", this.loadContentForContact, this);
    employeeContactLinkEditForm.init();
}

CRM.prototype.showContact = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var id = tmp[tmp.length - 1];
  this.selected.contactIds = [];
  this.selected.contactIds.push(id);
  this.loadContentForContactHandler = this.updateContactView;
  this.loadContentForContact();
}
CRM.prototype.showEmployeeContactLinks = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var id = tmp[tmp.length - 1];
  this.selected.contactIds = [];
  this.selected.contactIds.push(id);
  this.loadContentForContactHandler = this.updateEmployeeContactLinksView;
  this.loadContentForContact();
}
CRM.prototype.updateProjectCodesView = function(event) {
      this.popupHtmlId = getNextPopupHtmlContainer();
      var columns = [];
      columns.push({"name": "Code", "property": "code"});
      columns.push({"name": "Person in charge", "property": "inChargePerson"});
      columns.push({"name": "Created by", "property": "createdBy"});
      columns.push({"name": "Start", "property": "startDate", visualizer: calendarVisualizer});
      columns.push({"name": "End", "property": "endDate", visualizer: calendarVisualizer});

      var controls = [];
      var extraColumns = [];
      var dataGrid = new DataGrid("admin_contacts", this.loaded.projectCodes, columns, "Project codes", controls, extraColumns, "id");
      dataGrid.show(this.popupHtmlId);
      var form = this;
      $('#' + this.popupHtmlId).dialog({
        title: "Project codes",
        modal: true,
        position: 'center',
        width: 400,
        height: 600,
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
CRM.prototype.updateContactView = function(event) {
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
      this.loaded.contact.residencialCountryName = residencialCountryName;
      this.loaded.contact.countryName = countryName;
      var contactEmployeesText = '';
      var count = 0;
      for(var key in this.loaded.employeeContactLinks) {
          var employeeContactLinkTmp = this.loaded.employeeContactLinks[key];
          contactEmployeesText += employeeContactLinkTmp.employeeFirstName + ' ' + employeeContactLinkTmp.employeeLastName;
          if(count < this.loaded.employeeContactLinks.length - 1) {
              contactEmployeesText += '; ';
          }
          count++;
      }
      this.loaded.contact.contactEmployeesText = contactEmployeesText;
      
      var rows = [];
      rows.push({"name": "Gender", "property": "gender"});
      rows.push({"name": "First Name", "property": "firstName"});
      rows.push({"name": "Last Name", "property": "lastName"});
      rows.push({"name": "First Name (Local Language)", "property": "firstNameLocalLanguage"});
      rows.push({"name": "Last Name (LocalLanguage)", "property": "lastNameLocalLanguage"});
      rows.push({"name": "Responsible employees", "property": "contactEmployeesText"});
      rows.push({"name": "Classified position", "property": "normalPosition"});
      if(this.loaded.contact.normalPosition == 'OTHER') {
          rows.push({"name": "Classified position (Other)", "property": "otherNormalPosition"});
      }    
      rows.push({"name": "Direct Phone", "property": "directPhone"});
      rows.push({"name": "Mobile Phone", "property": "mobilePhone"});
      rows.push({"name": "Email", "property": "email"});
      rows.push({"name": "Language", "property": "language"});
      rows.push({"name": "Residencial Country", "property": "residencialCountryName"});
      rows.push({"name": "Clients address is used", "property": "isClientsAddressUsed", "visualizer": booleanVisualizer});
      if(!this.loaded.contact.isClientsAddressUsed) {
          rows.push({"name": "Street", "property": "street"});
          rows.push({"name": "Zip code", "property": "zipCode"});
          rows.push({"name": "City", "property": "city"});
          rows.push({"name": "Country", "property": "countryName"});
      }
      rows.push({"name": "Newsletters", "property": "isNewsletters", "visualizer": booleanVisualizer});
      rows.push({"name": "Reminder mailing", "property": "isReminder", "visualizer": booleanVisualizer});
      rows.push({"name": "Present type", "property": "presentType"});
      rows.push({"name": "Active", "property": "isActive", "visualizer": booleanVisualizer});
      rows.push({"name": "Comment", "property": "comment"});

      var controls = [];
      var propertyGrid = new PropertyGrid("admin_contact", this.loaded.contact, rows, "Contact", controls);
      
      this.popupHtmlId = getNextPopupHtmlContainer();
      propertyGrid.show(this.popupHtmlId);
      
      var form = this;
      $('#' + this.popupHtmlId).dialog({
        title: "Contact",
        modal: true,
        position: 'center',
        width: 400,
        height: 600,
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
CRM.prototype.updateEmployeeContactLinksView = function(event) {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td>Name</td><td>Comment</td><td>Edit</td><td>Delete</td></tr>';
    if(this.loaded.employeeContactLinks != null && this.loaded.employeeContactLinks.length > 0) {
        for(var key in this.loaded.employeeContactLinks) {
            var employeeContactLinkTmp = this.loaded.employeeContactLinks[key];
            html += '<tr>';
            html += '<td>' + employeeContactLinkTmp.employeeFirstName + ' ' + employeeContactLinkTmp.employeeLastName + ' (' + employeeContactLinkTmp.employeeUserName + ')' + '</td>';
            html += '<td>' + (employeeContactLinkTmp.comment != null ? employeeContactLinkTmp.comment : '') + '</td>';
            html += '<td><span class="link" id="' + this.htmlId + '_edit_employeeContactLink_' + employeeContactLinkTmp.id + '">Edit</span></td>';
            html += '<td><span class="link" id="' + this.htmlId + '_delete_employeeContactLink_' + employeeContactLinkTmp.id + '">Delete</span></td>';
            html += '</tr>';
        }
    } else {
        html += '<tr><td colspan="4">No data found for this contact</td></tr>';
    }
    html += '</table>';
    html += '<button id="' + this.htmlId + '_add_employeeContactLink' + '">Add link</button>';
    
    this.popupHtmlId = getNextPopupHtmlContainer();
    $('#' + this.popupHtmlId).html(html);

    var form = this;
    $('span[id^="' + this.htmlId + '_edit_employeeContactLink_"]').bind('click', function(event) {form.employeeContactLinkEditClickedHandle.call(form, event)});
    $('span[id^="' + this.htmlId + '_delete_employeeContactLink_"]').bind('click', function(event) {form.employeeContactLinkDeleteClickedHandle.call(form, event)});
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
    
    var form = this;
    $('#' + this.popupHtmlId).dialog({
        title: "Personal contacts",
        modal: true,
        position: 'center',
        width: 400,
        height: 600,
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
CRM.prototype.getCountry = function(id) {
    for(var key in this.loaded.countries) {
        var country = this.loaded.countries[key];
        if(country.id == id) {
            return country;
        }
    }
    return null;
}
CRM.prototype.updateSelectorView = function(id, value, options) {
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

/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function StandardRatesManager(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder+ "StandardRatesManager.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.loaded = {
        "offices" : [],
        "departments" : [],
        "subpartments": null,
        "positions": []
    }
    this.selected = {
        "officeId" : null,
        "departmentId" : null,
        "subdepartmentId" : null
    }
    this.data = {}
    this.reports = {};
}
StandardRatesManager.prototype.init = function() {
    this.loadInitialContent();
}
StandardRatesManager.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.offices = result.offices;
            form.loaded.departments = [];
            form.loaded.subdepartments = [];
            form.loaded.standardSellingRateBlocks = [];
            form.loaded.standardCostBlocks = [];
            form.selected.officeId = null;
            form.selected.departmentId = null;
            form.selected.subdepartmentId = null;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
StandardRatesManager.prototype.loadOfficeContent = function() {
    var form = this;
    var data = {};
    data.command = "getOfficeContent";
    data.officeId = this.selected.officeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.departments = result.departments;
            form.loaded.subdepartments = [];
            form.loaded.standardSellingRateBlocks = [];
            form.loaded.standardCostBlocks = [];
            form.selected.departmentId = null;
            form.selected.subdepartmentId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
StandardRatesManager.prototype.loadDepartmentContent = function() {
    var form = this;
    var data = {};
    data.command = "getDepartmentContent";
    data.departmentId = this.selected.departmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.subdepartments = result.subdepartments;
            form.loaded.standardSellingRateBlocks = [];
            form.loaded.standardCostBlocks = [];
            form.selected.subdepartmentId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
StandardRatesManager.prototype.loadSubdepartmentContent = function() {
    var form = this;
    var data = {};
    data.command = "getSubdepartmentContent";
    data.subdepartmentId = this.selected.subdepartmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.standardSellingRateBlocks = result.standardSellingRateBlocks;
            form.loaded.standardCostBlocks = result.standardCostBlocks;
            form.loaded.positions = result.positions;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
StandardRatesManager.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.setHandlers();
}
StandardRatesManager.prototype.getHtml = function() {
    var html = '';
    html += '<fieldset>';
    html += '<table>';
    html += '<tr><td><span class="label1">Office</span></td><td><span class="label1">Department</span></td><td><span class="label1">Subdepartment</span></td></tr>';
    html += '<tr><td><select id="' + this.htmlId + '_office' + '"></select></td><td><select id="' + this.htmlId + '_department' + '"></select></td><td><select id="' + this.htmlId + '_subdepartment' + '"></select></td></tr>';
    html += '</table>';
    html += '</fieldset>';

    html += '<table>';
    html += '<tr><td id="' + this.htmlId + '_standardSellingRates' + '" style="width: 400px;"></td><td id="' + this.htmlId + '_standardCosts' + '" style="width: 400px;"></td></tr>';
    html += '<table>';
    html += '<div id="' + this.htmlId + '_popup"></div>';

    return html;
}
StandardRatesManager.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_office').bind("change", function(event) {form.officeChangedHandle.call(form)});
    $('#' + this.htmlId + '_department').bind("change", function(event) {form.departmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_subdepartment').bind("change", function(event) {form.subdepartmentChangedHandle.call(form)});
}
StandardRatesManager.prototype.officeChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_office').val();
    if(idTxt == '') {
        this.selected.officeId = null;
    } else {
        this.selected.officeId = parseInt(idTxt);
    }
    if(this.selected.officeId == null) {
        this.loadInitialContent();
    } else {
        this.loadOfficeContent();
    }
}
StandardRatesManager.prototype.departmentChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_department').val();
    if(idTxt == '') {
        this.selected.departmentId = null;
    } else {
        this.selected.departmentId = parseInt(idTxt);
    }
    if(this.selected.departmentId == null) {
        this.loadOfficeContent();
    } else {
        this.loadDepartmentContent();
    }
}
StandardRatesManager.prototype.subdepartmentChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_subdepartment').val();
    if(idTxt == '') {
        this.selected.subdepartmentId = null;
    } else {
        this.selected.subdepartmentId = parseInt(idTxt);
    }
    if(this.selected.subdepartmentId == null) {
        this.loadDepartmentContent();
    } else {
        this.loadSubdepartmentContent();
    }
}

StandardRatesManager.prototype.updateView = function() {
    this.updateOfficeView();
    this.updateDepartmentView();
    this.updateSubdepartmentView();
    this.updateStandardSellingRatesView();
    this.updateStandardCostsView();
}
StandardRatesManager.prototype.updateOfficeView = function() {
    var html = "";
    html += '<option value="" >...</option>';
    for(var key in this.loaded.offices) {
        var office = this.loaded.offices[key];
        var isSelected = "";
        if(office.id == this.selected.officeId) {
           isSelected = "selected";
        }
        html += '<option value="'+ office.id +'" ' + isSelected + '>' + office.name + '</option>';
    }
    $('#' + this.htmlId + '_office').html(html);
}
StandardRatesManager.prototype.updateDepartmentView = function() {
   var html = "";
   html += '<option value="">...</option>';
    for(var key in this.loaded.departments) {
        var department = this.loaded.departments[key];
        var isSelected = "";
        if(department.id == this.selected.departmentId) {
           isSelected = "selected";
        }
        html += '<option value="'+ department.id +'" ' + isSelected + '>' + department.name + '</option>';
    }
    $('#' + this.htmlId + '_department').html(html);
}
StandardRatesManager.prototype.updateSubdepartmentView = function() {
   var html = "";
   html += '<option value="">...</option>';
    for(var key in this.loaded.subdepartments) {
        var subdepartment = this.loaded.subdepartments[key];
        var isSelected = "";
        if(subdepartment.id == this.selected.subdepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="'+ subdepartment.id +'" ' + isSelected + '>' + subdepartment.name + '</option>';
    }
    $('#' + this.htmlId + '_subdepartment').html(html);
}
StandardRatesManager.prototype.updateStandardSellingRatesView = function() {
   if(this.selected.subdepartmentId == null) {
       $('#' + this.htmlId + '_standardSellingRates').html("");
       return;
   }
   var html = "";
   html += '<span class="link" id="'+ this.htmlId + '_addStandardSellingRate">Add Standard Selling Rate</span><br />';
   if(this.loaded.standardSellingRateBlocks.length > 0) {
       html += '<div id="'+ this.htmlId + '_standardSellingRateAccordion">';
       for(var key in this.loaded.standardSellingRateBlocks) {
           var standardSellingRateBlock = this.loaded.standardSellingRateBlocks[key];
           html += '<h3><a href="#">' + calendarVisualizer.getHtml(standardSellingRateBlock.start) + ' - ' + calendarVisualizer.getHtml(standardSellingRateBlock.end) + '</a></h3>';
           html += '<div>'
           
           html += '<span class="link" id="'+ this.htmlId + '_editStandardSellingRate_' + standardSellingRateBlock.standardSellingRateGroupId + '">Edit</span>';
           html += '<span class="link" id="'+ this.htmlId + '_deleteStandardSellingRate_' + standardSellingRateBlock.standardSellingRateGroupId + '">Delete</span>';
           html += '<div style="height: 400px;">';
           html += '<table>';
           html += '<tr><td><span class="label1">Currency</span></td><td>' + standardSellingRateBlock.currencyName + '</td></tr>';
           html += '</table>';
           html += '<table class="datagrid">';
           html += '<tr class="dgHeader"><td>Standard Position</td><td>Position</td><td>Amount</td></tr>';
           for(var key2 in this.loaded.positions) {
                var position = this.loaded.positions[key2];
                var standardSellingRate = null;
                for(var key3 in standardSellingRateBlock.standardSellingRates) {
                    if(standardSellingRateBlock.standardSellingRates[key3].positionId == position.id) {
                        standardSellingRate = standardSellingRateBlock.standardSellingRates[key3];
                        break;
                    }
                }
                html += '<tr>';
                html += '<td>' + position.standardPositionName + '</td>';
                html += '<td>' + position.positionName + '</td>';
                html += '<td>' + (standardSellingRate != null ? standardSellingRate.amount : '-')  + '</td>';
                html += '</tr>';
           }
           html += '</table><br />';
           html += '</div>'

           html += '</div>';
       }
       html += '</div>';
   } else {
       html += 'No data';
   }   $('#' + this.htmlId + '_standardSellingRates').html(html);
   $('#'+ this.htmlId + '_standardSellingRateAccordion').accordion();
   var form = this;
   $('#' + this.htmlId + '_addStandardSellingRate').bind('click', function(event) {form.addStandardSellingRate.call(form, event)});
   $('span[id^="' + this.htmlId + '_editStandardSellingRate_"]').bind('click', function(event) {form.editStandardSellingRate.call(form, event)});
   $('span[id^="' + this.htmlId + '_deleteStandardSellingRate_"]').bind('click', function(event) {form.deleteStandardSellingRate.call(form, event)});
}
StandardRatesManager.prototype.updateStandardCostsView = function() {
   if(this.selected.subdepartmentId == null) {
       $('#' + this.htmlId + '_standardCosts').html("");
       return;
   }
   var html = "";
   html += '<span class="link" id="'+ this.htmlId + '_addStandardCost">Add Standard Cost</span><br />';
   if(this.loaded.standardCostBlocks.length > 0) {
       html += '<div id="'+ this.htmlId + '_standardCostAccordion">';
       for(var key in this.loaded.standardCostBlocks) {
           var standardCostBlock = this.loaded.standardCostBlocks[key];
           html += '<h3><a href="#">' + calendarVisualizer.getHtml(standardCostBlock.start) + ' - ' + calendarVisualizer.getHtml(standardCostBlock.end) + '</a></h3>';
           html += '<div>';

           html += '<span class="link" id="'+ this.htmlId + '_editStandardCost_' + standardCostBlock.standardCostGroupId + '">Edit</span>';
           html += '<span class="link" id="'+ this.htmlId + '_deleteStandardCost_' + standardCostBlock.standardCostGroupId + '">Delete</span>';
           html += '<div style="height: 400px;">';
           html += '<table>';
           html += '<tr><td><span class="label1">Currency</span></td><td>' + standardCostBlock.currencyName + '</td></tr>';
           html += '</table>';
           html += '<table class="datagrid">';
           html += '<tr class="dgHeader"><td>Standard Position</td><td>Position</td><td>Amount</td></tr>';
           for(var key2 in this.loaded.positions) {
                var position = this.loaded.positions[key2];
                var standardCost = null;
                for(var key3 in standardCostBlock.standardCosts) {
                    if(standardCostBlock.standardCosts[key3].positionId == position.id) {
                        standardCost = standardCostBlock.standardCosts[key3];
                        break;
                    }
                }
                html += '<tr>';
                html += '<td>' + position.standardPositionName + '</td>';
                html += '<td>' + position.positionName + '</td>';
                html += '<td>' + (standardCost != null ? standardCost.amount : '-')  + '</td>';
                html += '</tr>';
           }
           html += '</table><br />';
           html += '</div>';

           html += '</div>';
       }
       html += '</div>';
   } else {
       html += 'No data';
   }
   $('#' + this.htmlId + '_standardCosts').html(html);
   $('#'+ this.htmlId + '_standardCostAccordion').accordion();
   var form = this;
   $('#' + this.htmlId + '_addStandardCost').bind('click', function(event) {form.addStandardCost.call(form, event)});
   $('span[id^="' + this.htmlId + '_editStandardCost_"]').bind('click', function(event) {form.editStandardCost.call(form, event)});
   $('span[id^="' + this.htmlId + '_deleteStandardCost_"]').bind('click', function(event) {form.deleteStandardCost.call(form, event)});
}
StandardRatesManager.prototype.refreshInfo = function() {
   this.loadSubdepartmentContent();
}
StandardRatesManager.prototype.addStandardSellingRate = function(event) {
    var formData = {
        "mode": 'CREATE',
        "standardSellingRateGroupId": null,
        "subdepartmentId": this.selected.subdepartmentId,
        "currencyId": null,
        "start" : "",
        "end" : "",
        "standardSellingRates" : []
    }
    var standardSellingRatesEditForm = new StandardSellingRatesEditForm(formData, "standardSellingRatesEditForm", this.refreshInfo, this);
    standardSellingRatesEditForm.init();
}
StandardRatesManager.prototype.editStandardSellingRate = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var standardSellingRateGroupId = tmp[tmp.length - 1];
   var standardSellingRateBlock = null;
   for(var key in this.loaded.standardSellingRateBlocks) {
       var standardSellingRateBlockTmp = this.loaded.standardSellingRateBlocks[key];
       if(standardSellingRateBlockTmp.standardSellingRateGroupId == standardSellingRateGroupId) {
            standardSellingRateBlock = standardSellingRateBlockTmp;
            break;
       }
   }
   var standardSellingRates = [];
   for(var key in standardSellingRateBlock.standardSellingRates) {
       var standardSellingRate = standardSellingRateBlock.standardSellingRates[key];
       standardSellingRates.push({
        "id" : standardSellingRate.id,
        "positionId" : standardSellingRate.positionId,
        "amount": standardSellingRate.amount
       });
   }
   var formData = {
        "mode": 'UPDATE',
        "standardSellingRateGroupId": standardSellingRateBlock.standardSellingRateGroupId,
        "subdepartmentId": this.selected.subdepartmentId,
        "currencyId": standardSellingRateBlock.currencyId,
        "start" : calendarVisualizer.getHtml(standardSellingRateBlock.start),
        "end" : calendarVisualizer.getHtml(standardSellingRateBlock.end),
        "standardSellingRates" : standardSellingRates
    }
    var standardSellingRatesEditForm = new StandardSellingRatesEditForm(formData, "standardSellingRatesEditForm", this.refreshInfo, this);
    standardSellingRatesEditForm.init();
}
StandardRatesManager.prototype.deleteStandardSellingRate = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var standardSellingRateGroupId = tmp[tmp.length - 1];
  var standardSellingRatesDeleteForm = new StandardSellingRatesDeleteForm(standardSellingRateGroupId, this.refreshInfo, this);
  standardSellingRatesDeleteForm.init();
}
StandardRatesManager.prototype.addStandardCost = function(event) {
    var formData = {
        "mode": 'CREATE',
        "standardCostGroupId": null,
        "subdepartmentId": this.selected.subdepartmentId,
        "currencyId": null,
        "start" : "",
        "end" : "",
        "standardCosts" : []
    }
    var standardCostsEditForm = new StandardCostsEditForm(formData, "standardCostsEditForm", this.refreshInfo, this);
    standardCostsEditForm.init();
}
StandardRatesManager.prototype.editStandardCost = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var standardCostGroupId = tmp[tmp.length - 1];
   var standardCostBlock = null;
   for(var key in this.loaded.standardCostBlocks) {
       var standardCostBlockTmp = this.loaded.standardCostBlocks[key];
       if(standardCostBlockTmp.standardCostGroupId == standardCostGroupId) {
        standardCostBlock = standardCostBlockTmp;
        break;
       }
   }
   var standardCosts = [];
   for(var key in standardCostBlock.standardCosts) {
       var standardCost = standardCostBlock.standardCosts[key];
       standardCosts.push({
        "id" : standardCost.id,
        "positionId" : standardCost.positionId,
        "amount": standardCost.amount
       });
   }
   var formData = {
        "mode": 'UPDATE',
        "standardCostGroupId": standardCostBlock.standardCostGroupId,
        "subdepartmentId": this.selected.subdepartmentId,
        "currencyId": standardCostBlock.currencyId,
        "start" : calendarVisualizer.getHtml(standardCostBlock.start),
        "end" : calendarVisualizer.getHtml(standardCostBlock.end),
        "standardCosts" : standardCosts
    }
    var standardCostsEditForm = new StandardCostsEditForm(formData, "standardCostsEditForm", this.refreshInfo, this);
    standardCostsEditForm.init();
}
StandardRatesManager.prototype.deleteStandardCost = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var standardCostGroupId = tmp[tmp.length - 1];
  var standardCostsDeleteForm = new StandardCostsDeleteForm(standardCostGroupId, this.refreshInfo, this);
  standardCostsDeleteForm.init();
}
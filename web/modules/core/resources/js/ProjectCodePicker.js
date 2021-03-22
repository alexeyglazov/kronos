/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ProjectCodePicker(options, htmlId, okHandler, okHandlerContext, moduleName) {
    this.config = {
        endpointUrl: endpointsFolder + "ProjectCodePicker.jsp"
    }
    this.mode = options.mode;
    this.restriction = options.restriction;
    this.htmlId = htmlId;
    this.okHandler = okHandler;
    this.okHandlerContext = okHandlerContext;
    this.moduleName = moduleName;
    this.filterForm = null;
    this.filter = ProjectCodesListFilter.prototype.getDefaultFilter();
    this.filter.client = this.restriction.client;
    this.filter.office = this.restriction.office;
    this.filter.subdepartment = this.restriction.subdepartment;
    this.sorter = {
        "field": 'CODE',
        "order": 'ASC'
    };
    this.limiter = {
        "page": 0,
        "itemsPerPage": 50
    };
    this.loaded = {
        "count": null,
        "projectCodes": []
    }
    this.pickedProjectCodes = [];
    this.selected = {
        "projectCodeId": null,
        "pickedProjectCodeId": null
    }
}
ProjectCodePicker.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
}
ProjectCodePicker.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getProjectCodesList";
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
            form.loaded.count = result.count;
            form.loaded.projectCodes = result.projectCodes;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}

ProjectCodePicker.prototype.loadProjectCodeList = function() {
    var form = this;
    var data = {};
    data.command = "getProjectCodesList";
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
            form.loaded.count = result.count;
            form.loaded.projectCodes = result.projectCodes;
            form.updateProjectCodeView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProjectCodePicker.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td><span id="' + this.htmlId + '_filterBtn" title="Filter">Filter</span></td></tr>';
    html += '</table>';

    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Project code</span></td>';
    html += '<td style="text-align: right;"><span class="comment1" id="' + this.htmlId + '_projectCodeCount' + '"></span></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td colspan="2"><select id="' + this.htmlId + '_projectCode" size="5" style="width: 400px;"></select></td>';
    if(this.mode == 'MULTIPLE') {
        html += '<td style="vertical-align: top;"><span id="' + this.htmlId + '_projectCode_pick" title="Pick selected">Pick</span></td>';
    }
    html += '</tr>';
    html += '</table>';
    
    if(this.mode == 'MULTIPLE') {
        html += '<span class="label1">Picked activities</span><br />';
        html += '<table>';
        html += '<tr>';
        html += '<td><select id="' + this.htmlId + '_pickedProjectCode" size="5" style="width: 500px; height: 150px;"></select></td>';
        html += '<td style="vertical-align: top;"><span id="' + this.htmlId + '_projectCode_clear" title="Remove selected">Remove</span></td>';
        html += '</tr>';
        html += '</table>';
    }
    return html;
}
ProjectCodePicker.prototype.makeButtons = function() {
    var form = this;
    $('#' + this.htmlId + '_filterBtn').button({
        icons: {
            primary: "ui-icon-search"
        }
    }).click(function(event) {
        form.showFilter.call(form);
    });
    

    $('#' + this.htmlId + '_projectCode_pick')
      .button({
        icons: {
            primary: "ui-icon-triangle-1-s"
        },
        text: true
        })
      .click(function( event ) {
        form.pickProjectCode.call(form);
    });
    
    $('#' + this.htmlId + '_projectCode_clear')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: true
        })
      .click(function( event ) {
        form.clearProjectCode.call(form);
    });
}    
ProjectCodePicker.prototype.updateView = function() {
    this.updateProjectCodeView();
    this.updatePickedProjectCodeView();
}

ProjectCodePicker.prototype.updateProjectCodeView = function() {
    var html = '';
    for(var key in this.loaded.projectCodes) {
        var projectCode = this.loaded.projectCodes[key];
        var isSelected = "";
        if(projectCode.id == this.selected.projectCodeId) {
           isSelected = "selected";
        }
        html += '<option value="' + projectCode.id + '" ' + isSelected + '>' + projectCode.code + '</option>';
    }
    $('#' + this.htmlId + '_projectCode').html(html);
    if(this.loaded.count != null) {
        $('#' + this.htmlId + '_projectCodeCount').html('Total found: ' + this.loaded.count + ', shown: ' + this.loaded.projectCodes.length);
    } else {
        $('#' + this.htmlId + '_projectCodeCount').html('');
    }
}
ProjectCodePicker.prototype.updatePickedProjectCodeView = function() {
    var html = '';
    for(var key in this.pickedProjectCodes) {
        var projectCode = this.pickedProjectCodes[key];
        var isSelected = "";
        if(projectCode.id == this.selected.pickedProjectCodeId) {
           isSelected = "selected";
        }
        html += '<option value="' + projectCode.id + '" ' + isSelected + '>' + projectCode.code + '</option>';
    }
    $('#' + this.htmlId + '_pickedProjectCode').html(html);
}
ProjectCodePicker.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_projectCode').bind("change", function(event) {form.projectCodeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_pickedProjectCode').bind("change", function(event) {form.pickedProjectCodeChangedHandle.call(form, event);});
}
ProjectCodePicker.prototype.showFilter = function(event) {
    this.filterForm = new ProjectCodesListFilter("projectCodesListFilter", this.moduleName, this.filter, this.acceptFilterData, this);
    this.filterForm.setDisabled({
        client: true,
        office: true,
        subdepartment: true
    });
    this.filterForm.init();
}
ProjectCodePicker.prototype.acceptFilterData = function(filter) {
    this.limiter.page = 0;
    this.filter = filter;
    this.selected.projectCodeId = [];
    this.loadProjectCodeList();
}

ProjectCodePicker.prototype.projectCodeChangedHandle = function(event) {
    var htmlId = $('#' + this.htmlId + '_projectCode').val();
    if(htmlId == null || htmlId == '') {
        this.selected.projectCodeId = null;
    } else {
        this.selected.projectCodeId = parseInt(htmlId);
    }
    this.updateProjectCodeView();
}
ProjectCodePicker.prototype.pickedProjectCodeChangedHandle = function(event) {
    var htmlId = $('#' + this.htmlId + '_pickedProjectCode').val();
    if(htmlId == null || htmlId == '') {
        this.selected.pickedProjectCodeId = null;
    } else {
        this.selected.pickedProjectCodeId = parseInt(htmlId);
    }
    this.updatePickedProjectCodeView();
}
ProjectCodePicker.prototype.pickProjectCode = function(event) {
    if(this.selected.projectCodeId == null) {
        doAlert('Alert', 'Project Code is not selected', null, null);
        return;
    }
    var projectCode = this.getProjectCode(this.selected.projectCodeId);
    var projectCodeTmp = jQuery.grep(this.pickedProjectCodes, function(element, i) {
        return (projectCode.id == element.id);
    });
    if(projectCodeTmp.length == 0) {
        this.pickedProjectCodes.push(projectCode);
        this.selected.pickedProjectCodeId = null;
        this.sortPickedProjectCodes();
        this.updatePickedProjectCodeView();
    } else {
        doAlert('Alert', 'This projectCode is already picked', null, null);
    }
}
ProjectCodePicker.prototype.clearProjectCode = function(event) {
    if(this.selected.pickedProjectCodeId == null) {
        doAlert('Alert', 'Project Code is not selected', null, null);
        return;
    }
    var index = null;
    for(var key in this.pickedProjectCodes) {
        if(this.pickedProjectCodes[key].id == this.selected.pickedProjectCodeId) {
            index = key;
            break;
        }
    }
    if(index != null) {
        this.pickedProjectCodes.splice(index, 1);
        this.selected.pickedProjectCodeId = null;
        this.updatePickedProjectCodeView();
    }
}
ProjectCodePicker.prototype.show = function() {
    var title = 'Pick Project Code'
    var form = this;
    var height = 300;
    if(this.mode == 'MULTIPLE') {
        height = 450;
    }
    $("#" + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    this.updateView();
    this.makeButtons();
    $("#" + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        activity: 'center',
        width: 700,
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
ProjectCodePicker.prototype.okClickHandle = function() {
    if(this.mode == 'MULTIPLE') {
        this.okHandler.call(this.okHandlerContext, this.pickedProjectCodes);        
    } else {    
        var projectCode = this.getProjectCode(this.selected.projectCodeId);
        this.okHandler.call(this.okHandlerContext, projectCode);
    }    
}
ProjectCodePicker.prototype.getProjectCode = function(id) {
    if(id == null) {
        return null;
    }    
    for(var key in this.loaded.projectCodes) {
        if(this.loaded.projectCodes[key].id == id) {
            return this.loaded.projectCodes[key];
        }
    }
    return null;
}

ProjectCodePicker.prototype.sortPickedProjectCodes = function() {
    this.pickedProjectCodes.sort(function(o1, o2){
        if(o1.code == o2.code) return 0;
        return o1.code > o2.code ? 1: -1;
    }); 
}
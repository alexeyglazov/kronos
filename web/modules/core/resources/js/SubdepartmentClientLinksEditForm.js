/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function SubdepartmentClientLinksEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "SubdepartmentClientLinksEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.moduleName = "Clients";
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.loaded = {
        subdepartments: []
    }
    this.data = {
        "clientId": formData.clientId,
        "subdepartmentClientLinks": formData.subdepartmentClientLinks
    }
}
SubdepartmentClientLinksEditForm.prototype.init = function() {
    this.loadInitialContent();
    this.dataChanged(false);
}
SubdepartmentClientLinksEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<div id="' + this.htmlId + '_subdepartmentClientLinkBlock"></div>';
    html += '<button id="' + this.htmlId + '_addSubdepartmentClientLink">Add subdepartment</button>';
    return html
}
SubdepartmentClientLinksEditForm.prototype.setHandlers = function() {
    var form = this;
    //$('#' + this.htmlId + '_isTransnational').bind("change", function(event) {form.isTransnationalChangedHandle.call(form, event);});
}
SubdepartmentClientLinksEditForm.prototype.makeDatePickers = function() {
    var form = this;
}
SubdepartmentClientLinksEditForm.prototype.makeButtons = function() {
    var form = this;
    $('#' + this.htmlId + '_addSubdepartmentClientLink')
      .button({
        icons: {
            primary: "ui-icon-plus"
        },
        text: true
        })
      .click(function( event ) {
        form.addSubdepartmentClientLinkHandle.call(form);
    });
}

SubdepartmentClientLinksEditForm.prototype.addSubdepartmentClientLinkHandle = function(event) {
    this.data.subdepartmentClientLinks.push({
        "subdepartmentId": null
    });
    this.updateSubdepartmentClientLinkBlockView();
}
SubdepartmentClientLinksEditForm.prototype.deleteSubdepartmentClientLinkHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.subdepartmentClientLinks.splice(index, 1);
    this.updateSubdepartmentClientLinkBlockView();
    this.dataChanged(true);
}
SubdepartmentClientLinksEditForm.prototype.subdepartmentChangedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    if(jQuery.trim(event.currentTarget.value) == '') {
        this.data.subdepartmentClientLinks[index].subdepartmentId = null;
    } else {
        this.data.subdepartmentClientLinks[index].subdepartmentId = parseInt(jQuery.trim(event.currentTarget.value));
    }
    this.updateSubdepartmentView(index);
    this.dataChanged(true);
}
SubdepartmentClientLinksEditForm.prototype.updateView = function() {
    this.updateSubdepartmentClientLinkBlockView();
}
SubdepartmentClientLinksEditForm.prototype.updateSubdepartmentClientLinkBlockView = function() {
    var html = '';
    html += '<table class="datagrid">';
    for(var key in this.data.subdepartmentClientLinks) {
        html += '<tr><td><select id="' + this.htmlId + '_subdepartment_' + key + '"></select></td><td><button id="' + this.htmlId + '_deleteSubdepartmentClientLink_' + key + '">Delete</button></td></tr>';
    }
    html += '</table>';
    $('#' + this.htmlId + '_subdepartmentClientLinkBlock').html(html);
    
    var form = this;
    $('select[id^="' + this.htmlId + '_subdepartment_"]').bind("change", function(event) {form.subdepartmentChangedHandle.call(form, event);});
    $('button[id^="' + this.htmlId + '_deleteSubdepartmentClientLink_"]')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.deleteSubdepartmentClientLinkHandle.call(form, event);
    });
    
    this.updateSubdepartmentsView();
}
SubdepartmentClientLinksEditForm.prototype.updateSubdepartmentsView = function() {
    for(var key in this.data.subdepartmentClientLinks) {
        this.updateSubdepartmentView(key);
    }
}
SubdepartmentClientLinksEditForm.prototype.updateSubdepartmentView = function(index) {
    var subdepartmentClientLink = this.data.subdepartmentClientLinks[index];
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.subdepartments) {
        var subdepartment = this.loaded.subdepartments[key];
        var isSelected = "";
        if(subdepartment.subdepartmentId == subdepartmentClientLink.subdepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="' + subdepartment.subdepartmentId + '" ' + isSelected + '>' + (subdepartment.officeName + ' / ' + subdepartment.departmentName + ' / ' + subdepartment.subdepartmentName) + '</option>';
    }
    $('#' + this.htmlId + '_subdepartment_' + index).html(html);
}

SubdepartmentClientLinksEditForm.prototype.loadInitialContent = function() {
   var form = this;
    var data = {};
    data.command = "getInitialContent";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.subdepartments = result.subdepartments;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
SubdepartmentClientLinksEditForm.prototype.show = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    var title = 'Update subdepartment-to-client links'
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
    this.updateView();
}
SubdepartmentClientLinksEditForm.prototype.validate = function() {
    var errors = [];
    var nameRE = /^[a-zA-Z0-9 \-+&]*$/;
    var codeNameRE = /^[A-Z0-9-+&]*$/;
    //if(this.data.countryId == null) {
    //    errors.push("Country of origin is not selected");
    //}
    
    return errors;
}
SubdepartmentClientLinksEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var serverFormatData = clone(this.data);

    var form = this;
    var data = {};
    data.command = "saveSubdepartmentClientLinks";
    data.subdepartmentClientLinksEditForm = getJSON(serverFormatData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Info has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
SubdepartmentClientLinksEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}
SubdepartmentClientLinksEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}


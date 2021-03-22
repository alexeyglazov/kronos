/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ProjectCodeBatchEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "ProjectCodeBatchEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.moduleName = "Code";
    var currentYear = (new Date()).getFullYear();
    this.financialYears = [];
    for(var i = 2008; i <= currentYear + 1; i++) {
        this.financialYears[i] = '' + i + '-' + (i + 1);
    }
    this.projectCodeIds = formData.projectCodeIds;
    this.data = {
        "projectCodes": []
    }
    this.dataChanged(false);
}
ProjectCodeBatchEditForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
}
ProjectCodeBatchEditForm.prototype.loadInitialContent = function() {
   var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.projectCodeIds = getJSON({"list": this.projectCodeIds});
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.data.projectCodes = result.projectCodes;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProjectCodeBatchEditForm.prototype.getHtml = function() {
    var html = '';  
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader">';
    html += '<td><span class="label1">Code</span></td>';
    html += '<td><span class="label1">Financial year</span></td>';
    html += '<td><span class="label1">Person in charge</span></td>';
    html += '<td><span class="label1">Partner in charge</span></td>';
    html += '<td><span class="label1">Comment</span></td>';
    html += '<td><span class="label1">Description</span></td>';
    html += '</tr>';
    for(var key in this.data.projectCodes) {
        var projectCode = this.data.projectCodes[key];
        html += '<tr>';
        html += '<td><span class="label1">' + projectCode.code + '</span></td>';
        html += '<td><select id="' + this.htmlId + '_financialYear_' + projectCode.id + '"></select></td>';
        html += '<td><input type="text" id="' + this.htmlId + '_inChargePerson_userName_' + projectCode.id + '"><button id="' + this.htmlId + '_inChargePerson_pick_' + projectCode.id + '">Pick employee</button><button id="' + this.htmlId + '_inChargePerson_clear_' + projectCode.id + '">Clear</button></td>';
        html += '<td><input type="text" id="' + this.htmlId + '_inChargePartner_userName_' + projectCode.id + '"><button id="' + this.htmlId + '_inChargePartner_pick_' + projectCode.id + '">Pick employee</button><button id="' + this.htmlId + '_inChargePartner_clear_' + projectCode.id + '">Clear</button></td>';
        html += '<td><textarea id="' + this.htmlId + '_comment_' + projectCode.id + '" style="width: 120px; height: 60px;"></textarea></td>';
        html += '<td><textarea id="' + this.htmlId + '_description_' + projectCode.id + '" style="width: 120px; height: 60px;"></textarea></td>';
        html += '</tr>';
    }
    html += '</table>';
    return html
}
ProjectCodeBatchEditForm.prototype.show = function() {
    var title = 'Project code edit'
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    this.makeButtons();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 950,
        height: 450,
        buttons: {
            OK: function() {
                form.save();
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
ProjectCodeBatchEditForm.prototype.makeButtons = function() {
    var form = this;
    $('button[id^="' + this.htmlId + '_inChargePerson_pick_"]')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.inChargePersonPickHandle.call(form, event);
    });

    $('button[id^="' + this.htmlId + '_inChargePerson_clear_"]')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.inChargePersonClearHandle.call(form, event);
    });
    
    $('button[id^="' + this.htmlId + '_inChargePartner_pick_"]')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.inChargePartnerPickHandle.call(form, event);
    });

    $('button[id^="' + this.htmlId + '_inChargePartner_clear_"]')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.inChargePartnerClearHandle.call(form, event);
    });
    
}
ProjectCodeBatchEditForm.prototype.setHandlers = function() {
    var form = this;
    $('select[id^="' + this.htmlId + '_financialYear_"]').bind("change", function(event) {form.financialYearChangeHandle.call(form, event)});
    $('textarea[id^="' + this.htmlId + '_comment_"]').bind("change", function(event) {form.commentChangeHandle.call(form, event)});
    $('textarea[id^="' + this.htmlId + '_description_"]').bind("change", function(event) {form.descriptionChangeHandle.call(form, event)});   
}
ProjectCodeBatchEditForm.prototype.makeDatePickers = function() {
    var form = this;
    //$('input[id^="' + this.htmlId + '_startDate_"]').datepicker({
    //    dateFormat: 'dd.mm.yy',
    //    onSelect: function(dateText, inst) {form.startDateSelectHandle(dateText, inst)}
    //});

}

ProjectCodeBatchEditForm.prototype.financialYearChangeHandle = function(event) {
    var value = $(event.currentTarget).val().trim();
    if(value == '') {
        value = null;
    }
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parts[parts.length - 1];
    for(var key in this.data.projectCodes) {
        var projectCode = this.data.projectCodes[key];
        if(projectCode.id == id) {
            projectCode.financialYear = value;
        }
    }
    this.updateFinancialYearView();
    this.dataChanged(true);    
}
ProjectCodeBatchEditForm.prototype.inChargePersonPickHandle = function(event) {
    var value = $(event.currentTarget).val().trim();
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parts[parts.length - 1];
    for(var key in this.data.projectCodes) {
        var projectCode = this.data.projectCodes[key];
        if(projectCode.id == id) {
            this.updatedProjectCodeId = projectCode.id;           
        }
    }
    this.inChargePersonPicker = new EmployeePicker("inChargePersonPicker", this.inChargePersonPicked, this, this.moduleName);
    this.inChargePersonPicker.init();
    this.dataChanged(true);    
}
ProjectCodeBatchEditForm.prototype.inChargePersonPicked = function(inChargePerson) {
    for(var key in this.data.projectCodes) {
        var projectCode = this.data.projectCodes[key];
        if(projectCode.id == this.updatedProjectCodeId) {
            projectCode.inChargePerson = inChargePerson;
            break;
        }
    }
    this.updateInChargePersonView();
    this.dataChanged(true);    
}
ProjectCodeBatchEditForm.prototype.inChargePersonClearHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    for(var key in this.data.projectCodes) {
        var projectCode = this.data.projectCodes[key];
        if(projectCode.id == id) {
            projectCode.inChargePerson = null;
            break;
        }
    }
    this.updateInChargePersonView();
    this.dataChanged(true);    
}
ProjectCodeBatchEditForm.prototype.inChargePartnerPickHandle = function(event) {
    var value = $(event.currentTarget).val().trim();
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parts[parts.length - 1];
    for(var key in this.data.projectCodes) {
        var projectCode = this.data.projectCodes[key];
        if(projectCode.id == id) {
            this.updatedProjectCodeId = projectCode.id;           
        }
    }
    this.inChargePartnerPicker = new EmployeePicker("inChargePartnerPicker", this.inChargePartnerPicked, this, this.moduleName);
    this.inChargePartnerPicker.init();
    this.dataChanged(true);    
}
ProjectCodeBatchEditForm.prototype.inChargePartnerPicked = function(inChargePartner) {
    for(var key in this.data.projectCodes) {
        var projectCode = this.data.projectCodes[key];
        if(projectCode.id == this.updatedProjectCodeId || projectCode.inChargePartner == null) {
            projectCode.inChargePartner = inChargePartner;
            //break;
        }
    }
    this.updateInChargePartnerView();
    this.dataChanged(true);    
}
ProjectCodeBatchEditForm.prototype.inChargePartnerClearHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    for(var key in this.data.projectCodes) {
        var projectCode = this.data.projectCodes[key];
        if(projectCode.id == id) {
            projectCode.inChargePartner = null;
            break;
        }
    }
    this.updateInChargePartnerView();
    this.dataChanged(true);    
}

ProjectCodeBatchEditForm.prototype.descriptionChangeHandle = function(event) {
    var value = $(event.currentTarget).val().trim();
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parts[parts.length - 1];
    for(var key in this.data.projectCodes) {
        var projectCode = this.data.projectCodes[key];
        if(projectCode.id == id) {
            projectCode.description = value;
        }
    }
    this.updateDescriptionView();
    this.dataChanged(true);    
}
ProjectCodeBatchEditForm.prototype.commentChangeHandle = function(event) {
    var value = $(event.currentTarget).val().trim();
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parts[parts.length - 1];
    for(var key in this.data.projectCodes) {
        var projectCode = this.data.projectCodes[key];
        if(projectCode.id == id) {
            projectCode.comment = value;
        }
    }
    this.updateCommentView();
    this.dataChanged(true);    
}

ProjectCodeBatchEditForm.prototype.updateView = function() {
    this.updateFinancialYearView();
    this.updateInChargePersonView();
    this.updateInChargePartnerView();
    this.updateDescriptionView();
    this.updateCommentView();
}
ProjectCodeBatchEditForm.prototype.updateFinancialYearView = function() {
    for(var key in this.data.projectCodes) {
        var projectCode = this.data.projectCodes[key];
        var html = "";
        html += '<option value="">...</option>';
        for(var key in this.financialYears) {
            var financialYear = this.financialYears[key];
            var isSelected = "";
            if(key == projectCode.financialYear) {
                isSelected = "selected";
            }
            html += '<option value="'+ key +'" ' + isSelected + '>' + financialYear + '</option>';
        }
        $('#' + this.htmlId + '_financialYear_' + projectCode.id).html(html);
    }
}
ProjectCodeBatchEditForm.prototype.updateInChargePersonView = function() {
    for(var key in this.data.projectCodes) {
        var projectCode = this.data.projectCodes[key];
        $('#' + this.htmlId + '_inChargePerson_userName_' + projectCode.id).attr("disabled", true);
        if(projectCode.inChargePerson != null) {
            $('#' + this.htmlId + '_inChargePerson_userName_' + projectCode.id).val(projectCode.inChargePerson.userName);
        } else {
            $('#' + this.htmlId + '_inChargePerson_userName_' + projectCode.id).val("");
        }
    }
}
ProjectCodeBatchEditForm.prototype.updateInChargePartnerView = function() {
    for(var key in this.data.projectCodes) {
        var projectCode = this.data.projectCodes[key];
        $('#' + this.htmlId + '_inChargePartner_userName_' + projectCode.id).attr("disabled", true);
        if(projectCode.inChargePartner != null) {
            $('#' + this.htmlId + '_inChargePartner_userName_' + projectCode.id).val(projectCode.inChargePartner.userName);
        } else {
            $('#' + this.htmlId + '_inChargePartner_userName_' + projectCode.id).val("");
        }
    }
}
ProjectCodeBatchEditForm.prototype.updateDescriptionView = function() {
    for(var key in this.data.projectCodes) {
        var projectCode = this.data.projectCodes[key];
        $('#' + this.htmlId + '_description_' + projectCode.id).val(projectCode.description);
    }
}
ProjectCodeBatchEditForm.prototype.updateCommentView = function() {
    for(var key in this.data.projectCodes) {
        var projectCode = this.data.projectCodes[key];
        $('#' + this.htmlId + '_comment_' + projectCode.id).val(projectCode.comment);
    }
}

ProjectCodeBatchEditForm.prototype.validate = function() {
    var errors = [];
    for(var key in this.data.projectCodes) {
        var projectCode = this.data.projectCodes[key];
        if(projectCode.financialYear == null) {
            errors.push("Financial year is not set for " + projectCode.code);        
        }
        if(projectCode.inChargePerson == null) {
            errors.push("Person in charge is not set for " + projectCode.code);        
        }
        if(projectCode.inChargePartner == null) {
            errors.push("Partner in charge is not set for " + projectCode.code);        
        }
        if(projectCode.description == null || projectCode.description == "") {
            errors.push("Description is not set for " + projectCode.code);        
        }
        if(projectCode.comment == null || projectCode.comment == "") {
            errors.push("Comment is not set for " + projectCode.code);        
        }
    }
    return errors;
}
ProjectCodeBatchEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var projectCodeBatchEditForm = {
        "items": []
    }
    for(var key in this.data.projectCodes) {
        var projectCode = this.data.projectCodes[key];
        projectCodeBatchEditForm.items.push(
            {
                "id": projectCode.id,
                "financialYear": projectCode.financialYear,
                "inChargePersonId": projectCode.inChargePerson.id,
                "inChargePartnerId": projectCode.inChargePartner.id,
                "comment": projectCode.comment,
                "description": projectCode.description
            }
        );
    }
    var form = this;
    var data = {};
    data.command = "saveProjectCodes";
    data.projectCodeBatchEditForm = getJSON(projectCodeBatchEditForm);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Project code(s) has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProjectCodeBatchEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}
ProjectCodeBatchEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}
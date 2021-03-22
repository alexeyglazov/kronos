/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function GroupPicker(htmlId, okHandler, okHandlerContext, moduleName) {
    this.config = {
        endpointUrl: endpointsFolder + "GroupPicker.jsp"
    }
    this.htmlId = htmlId;
    this.okHandler = okHandler;
    this.okHandlerContext = okHandlerContext;
    this.moduleName = moduleName;
    this.loaded = {
        "groups": []
    }
    this.selected = {
        "groupId": null
    }
}
GroupPicker.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
}
GroupPicker.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.moduleName = this.moduleName;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.groups = result.groups;

            form.selected.groupId = null;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
GroupPicker.prototype.getHtml = function() {
    var html = '';
    html += '<span class="label1">Group</span><br />';
    html += '<select id="groupPicker_group" size="15" style="width: 500px;"></select>';
    return html;
}
GroupPicker.prototype.updateView = function() {
    this.updateGroupView();
}
GroupPicker.prototype.updateGroupView = function() {
    var html = '';
    for(var key in this.loaded.groups) {
        var group = this.loaded.groups[key];
        var isSelected = "";
        if(group.id == this.selected.groupId) {
           isSelected = "selected";
        }
        html += '<option value="' + group.id + '" ' + isSelected + '>' + group.name + '</option>';
    }
    $('#groupPicker_group').html(html);
}
GroupPicker.prototype.setHandlers = function() {
    var form = this;
    $("#groupPicker_group").bind("change", function(event) {form.groupChangedHandle.call(form, event);});
}
GroupPicker.prototype.groupChangedHandle = function(event) {
    var htmlId = $("#groupPicker_group").val();
    if(htmlId == null || htmlId == '') {
        this.selected.groupId = null;
    } else {
        this.selected.groupId = parseInt(htmlId);
    }
}
GroupPicker.prototype.show = function() {
    var title = 'Pick Group'
    var form = this;
    $("#" + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    this.updateView();
    $("#" + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        group: 'center',
        width: 600,
        height: 400,
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
GroupPicker.prototype.okClickHandle = function() {
    var group = null;
    if(this.selected.groupId != null) {
        for(var key in this.loaded.groups) {
            if(this.loaded.groups[key].id == this.selected.groupId) {
                group = this.loaded.groups[key];
            }
        }
    }
    this.okHandler.call(this.okHandlerContext, group);
}
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function Menu(contentData, currentUri, htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "Menu.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.contentData = contentData;
    this.currentUri = currentUri;
    this.timers = [];
}
Menu.prototype.init = function() {
    this.show();
}
Menu.prototype.getTopMenuHtml = function() {
    var html = '';
    html += '<table id="topMenu"><tbody><tr>';
    var root = this.contentData.root;
    if(root != null && root.children != null) {
        for(var key in root.children) {
            var child = root.children[key];
            var clazz = '';
            if(this.currentUri.startsWith(child.navigationUrl)) {
                clazz = 'class="highlight"';
            }
            html += '<td ' + clazz + ' title="' + child.description + '" id="topMenu_' + key + '">';
            html += '<a href="' + child.navigationUrl + '">' + child.title + '</a>';
            html += '</td>';            
        }
    }
    html += '</tr></tbody></table>';         
    return html
}
Menu.prototype.getSubMenuHtml = function(key) {
    var html = '';
    var element = this.contentData.root.children[key];
    html += '<ul id="menu_' + key + '" style="z-index: 10000;">';
    for(var key2 in element.children) {
        var item = element.children[key2];
        html += this.getSubMenuHtml2(item);
    }
    html += '</ul>';
    return html;
}
Menu.prototype.getSubMenuHtml2 = function(item) {
    var html = '';
    html += '<li>';
    if(this.currentUri.startsWith(item.navigationUrl)) {
        html += '<a href="' + item.navigationUrl + '"><span style="font-weight: bold;">' + item.title + '</span></a>';
    } else {
        html += '<a href="' + item.navigationUrl + '">' + item.title + '</a>';        
    }
    if(item.children != null && item.children.length > 0) {
        html += '<ul>';
        for(var key in item.children) {
            var child = item.children[key];
            html += this.getSubMenuHtml2(child);
        }
        html += '</ul>';
    }
    html += '</li>';
    return html;
}
Menu.prototype.makeTopMenu = function() {
    var html = '';
    html += this.getTopMenuHtml();
    $('#' + this.containerHtmlId).append(html);
}
Menu.prototype.makeSubMenu = function(key) {
    var html = '';
    html += this.getSubMenuHtml(key);
    $('#' + this.containerHtmlId).append(html);
    $('#menu_' + key).menu();
    $('#menu_' + key).position({
        my: 'left top',
        at: 'left bottom', of: '#topMenu_' + key
      });    
    $('#menu_' + key).hide();
    
    var form = this;

    $('#topMenu_' + key).bind('mouseover', function() {
        $('#menu_' + key).show();
        clearTimeout(form.timers[key]);
    });
    $('#topMenu_' + key).bind('mouseout', function() {
        form.timers[key] = setTimeout(function() {$('#menu_' + key).hide();}, 100);       
    });
    $('#menu_' + key).bind('mouseover', function() {
        clearTimeout(form.timers[key]);
    });
    $('#menu_' + key).bind('mouseout', function() {
        form.timers[key] = setTimeout(function() {$('#menu_' + key).hide();}, 100);
    });    
}
Menu.prototype.show = function() {
    this.makeTopMenu();
    var root = this.contentData.root;
    if(root != null && root.children != null && root.children.length > 0) {
        for(var key in root.children) {
            if(root.children[key].children != null && root.children[key].children.length > 0) {
                this.makeSubMenu(key);
            }
        }
    }    
}

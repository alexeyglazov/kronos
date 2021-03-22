/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;

import com.mazars.management.db.comparators.ProjectCodeConflictHistoryItemComparator;
import com.mazars.management.db.domain.Action;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.domain.ProjectCodeConflict;
import com.mazars.management.db.domain.ProjectCodeConflictHistoryItem;
import com.mazars.management.db.vo.ProjectCodeVO;
import com.mazars.management.db.vo.YearMonth;
import com.mazars.management.db.vo.YearMonthDateTime;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

/**
 *
 * @author glazov
 */
public class ActionBlock {
    public static class ActionParameter {
        private Long id;
        private String name;
        private String value;

        public ActionParameter() {
        }
        public ActionParameter(com.mazars.management.db.domain.ActionParameter actionParameter) {
            this.id = actionParameter.getId();
            this.name = actionParameter.getName();
            this.value = actionParameter.getValue();
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }
    } 
    private Long id;
    private YearMonthDateTime time;
    private String remoteAddr;
    private Integer remotePort;
    private String method;
    private String requestURI;
    private String protocol;
    private String scheme;

    private String comment;

    private ConciseEmployee employee;
    private List<ActionParameter> actionParameters = new LinkedList<ActionParameter>();

    public ActionBlock() {
    }

    public ActionBlock(Action action) {
        this.id = action.getId();
        if(action.getTime()!= null) {
            this.time = new YearMonthDateTime(action.getTime());
        }
        this.remoteAddr = action.getRemoteAddr();
        this.remotePort = action.getRemotePort();
        this.method = action.getMethod();
        this.requestURI = action.getRequestURI();
        this.protocol = action.getProtocol();
        this.scheme = action.getScheme();
        this.comment = action.getComment();
        if(action.getEmployee()!= null) {
            this.employee = new ConciseEmployee(action.getEmployee());
        }    
        for(com.mazars.management.db.domain.ActionParameter actionParameter : action.getActionParameters()) {
            this.actionParameters.add(new ActionBlock.ActionParameter(actionParameter));
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public YearMonthDateTime getTime() {
        return time;
    }

    public void setTime(YearMonthDateTime time) {
        this.time = time;
    }

    public String getRemoteAddr() {
        return remoteAddr;
    }

    public void setRemoteAddr(String remoteAddr) {
        this.remoteAddr = remoteAddr;
    }

    public Integer getRemotePort() {
        return remotePort;
    }

    public void setRemotePort(Integer remotePort) {
        this.remotePort = remotePort;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getRequestURI() {
        return requestURI;
    }

    public void setRequestURI(String requestURI) {
        this.requestURI = requestURI;
    }

    public String getProtocol() {
        return protocol;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }

    public String getScheme() {
        return scheme;
    }

    public void setScheme(String scheme) {
        this.scheme = scheme;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public ConciseEmployee getEmployee() {
        return employee;
    }

    public void setEmployee(ConciseEmployee employee) {
        this.employee = employee;
    }

    public List<ActionParameter> getActionParameters() {
        return actionParameters;
    }

    public void setActionParameters(List<ActionParameter> actionParameters) {
        this.actionParameters = actionParameters;
    }
}

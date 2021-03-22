/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;

/**
 *
 * @author glazov
 */
public class ActionVO {
    private Long id;
    private YearMonthDateTime time;
    private String remoteAddr;
    private Integer remotePort;
    private String method;
    private String requestURI;
    private String protocol;
    private String scheme;

    private String comment;

    public ActionVO() {
    }

    public ActionVO(Action action) {
        this.id = action.getId();
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

    public String getScheme() {
        return scheme;
    }

    public void setScheme(String scheme) {
        this.scheme = scheme;
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

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}

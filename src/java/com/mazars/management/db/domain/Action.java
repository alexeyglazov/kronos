/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.hibernate.Query;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class Action {
    private Long id;
    private Date time;

    private String remoteAddr;
    private Integer remotePort;
    private String method;
    private String requestURI;
    private String protocol;
    private String scheme;

    private String comment;

    private Employee employee;
    private Set<ActionParameter> actionParameters = new HashSet<ActionParameter>();

    public Action() {
        this.time = new Date();
    }
    public Action(Employee employee) {
        this.time = new Date();
        this.employee = employee;
    }

    public void readHttpRequestDataWithParameters(HttpServletRequest request) {
        this.remoteAddr = request.getRemoteAddr();
        this.remotePort = request.getRemotePort();
        this.method = request.getMethod();
        this.requestURI = request.getRequestURI();
        this.protocol = request.getProtocol();
        this.scheme = request.getScheme();
        Map<String, String[]> rawParameters = request.getParameterMap();
        if(rawParameters != null) {
            for(String name : rawParameters.keySet()) {
                String[] values = rawParameters.get(name);
                if(values != null) {
                    for(String value : values) {
                        ActionParameter actionParameter = new ActionParameter();
                        actionParameter.setAction(this);
                        actionParameter.setName(name);
                        actionParameter.setValue(value);
                        this.getActionParameters().add(actionParameter);
                    }
                }
            }
        }
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getScheme() {
        return scheme;
    }

    public void setScheme(String scheme) {
        this.scheme = scheme;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public Set<ActionParameter> getActionParameters() {
        return actionParameters;
    }

    public void setActionParameters(Set<ActionParameter> actionParameters) {
        this.actionParameters = actionParameters;
    }
    public void saveWithActionParameters() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        hs.save(this);
        for(ActionParameter actionParameter : this.getActionParameters()) {
            hs.save(actionParameter);
        }
    }
    public static List<Action> get() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select a from Action as a ";
        Query q = hs.createQuery(query);
        return q.list();
    }
}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.webservices.services;

import com.mazars.management.db.domain.Country;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.Module;
import com.mazars.management.db.domain.RightsItem;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.security.SecurityUtils;
import com.mazars.management.web.security.AccessChecker;
import com.mazars.management.webservices.vo.ClientVO;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import javax.jws.WebService;
import javax.jws.WebMethod;
import javax.jws.WebParam;
import org.hibernate.Query;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
@WebService(serviceName = "Client")
public class Client {
/**
     * Операция веб-службы
     */

    @WebMethod(operationName = "getClients")
    public java.util.List<com.mazars.management.webservices.vo.ClientVO> getClients(
            @WebParam(name = "userName") String userName,
            @WebParam(name = "password") String password,
            @WebParam(name = "modifiedAtFrom") Date modifiedAtFrom,
            @WebParam(name = "modifiedAtTo") Date modifiedAtTo
        ) throws Exception {
        List<com.mazars.management.webservices.vo.ClientVO> clientVOs = new LinkedList<com.mazars.management.webservices.vo.ClientVO>();

        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            AccessChecker accessChecker = new AccessChecker();
            
            Employee currentUser = accessChecker.authenticate(userName, password);
            Module module = Module.getByName("Clients Report");
            AccessChecker.Status status = accessChecker.check(currentUser, module);
            if(! AccessChecker.Status.VALID.equals(status)) {
                throw new Exception("Authorization status is " + status + ".");
            }
            Country country = currentUser.getCountry();
            String query = "";
            query += "select c, max(chi.createdAt) from Client as c inner join c.clientHistoryItems as chi ";
            query += "inner join c.workCountry as wc ";
            query += "where ";
            query += "wc=:workCountry ";
            boolean isUsed = true;
            if(modifiedAtFrom != null) {
                if(isUsed) {
                    query += "and ";
                }
                query += "chi.createdAt>=:modifiedAtFrom ";
                isUsed = true;
            }
            if(modifiedAtTo != null) {
                if(isUsed) {
                    query += "and ";
                }
                query += "chi.createdAt<=:modifiedAtTo ";
                isUsed = true;
            }
            query += "group by c ";
            Query hq = hs.createQuery(query);
            hq.setParameter("workCountry", country);
            if(modifiedAtFrom != null) {
                hq.setParameter("modifiedAtFrom", modifiedAtFrom);
            }
            if(modifiedAtTo != null) {
                hq.setParameter("modifiedAtTo", modifiedAtTo);
            }

            List<Object[]> selection = (List<Object[]>)hq.list();
            for(Object[] tuple : selection) {
                com.mazars.management.db.domain.Client client = (com.mazars.management.db.domain.Client)tuple[0];
                Date modifiedAt = (Date)tuple[1];
                ClientVO clientVO = new ClientVO();
                clientVO.setId(client.getId());
                clientVO.setName(client.getName());
                clientVO.setCode(client.getCodeName());
                clientVO.setModifiedAt(modifiedAt);
                clientVOs.add(clientVO);
            }
            hs.getTransaction().commit();
        } catch (Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }    
        return clientVOs;
    }
}

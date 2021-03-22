package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import org.hibernate.Session;
import java.util.List;
import java.util.Date;

public class ClientHistoryItem {
    public enum SortOrder {
        ASC,
        DESC
    }
    private Long id;
    private String name;
    private String codeName;
    private Date createdAt;
    private Client client;
    private Group group;
    private Employee createdBy;

    public ClientHistoryItem() {}

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public String getCodeName() {
        return codeName;
    }

    public void setCodeName(String codeName) {
        this.codeName = codeName;
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

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Employee getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Employee createdBy) {
        this.createdBy = createdBy;
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group group) {
        this.group = group;
    }
    
    public static List<ClientHistoryItem> getSortedClientHistoryItems(Client client, ClientHistoryItem.SortOrder sortOrder) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(ClientHistoryItem.SortOrder.ASC.equals(sortOrder)) {
            return (List<ClientHistoryItem>)hs.createQuery("select chi from Client as c inner join c.clientHistoryItems as chi where c=? order by chi.createdAt asc").setParameter(0, client).list();
        } else {
            return (List<ClientHistoryItem>)hs.createQuery("select chi from Client as c inner join c.clientHistoryItems as chi where c=? order by chi.createdAt desc").setParameter(0, client).list();
        }
    }
    public static ClientHistoryItem getLatestClientHistoryItem(Client client) {
        List<ClientHistoryItem> clientHistoryItems = ClientHistoryItem.getSortedClientHistoryItems(client, SortOrder.DESC);
        if(clientHistoryItems.isEmpty()) {
            return null;
        } else {
            return clientHistoryItems.get(0);
        }
    }
}
